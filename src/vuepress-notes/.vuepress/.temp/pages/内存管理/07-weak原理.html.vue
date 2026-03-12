<template><div><h1 id="weak原理" tabindex="-1"><a class="header-anchor" href="#weak原理"><span>weak原理</span></a></h1>
<h2 id="概述" tabindex="-1"><a class="header-anchor" href="#概述"><span>概述</span></a></h2>
<p>weak 关键字用于创建弱引用，不增加对象的引用计数。当对象被释放时，weak 引用会自动置为 nil。</p>
<h2 id="weak-引用的实现流程" tabindex="-1"><a class="header-anchor" href="#weak-引用的实现流程"><span>weak 引用的实现流程</span></a></h2>
<Mermaid code="eJx1UM1OwjAcv/sUTe/EF1ASAYXhURIPC1m6URVdtqSrEm94gY1EuaAxcUY9mHBR50kE3dPQ4t7C+t9MSIAdlrS/7x7Ybss6IoyjWmkNqW9Lx8K/E5MxalFygsTX9Www3DDZeh7OZ4Qh1zxGm4gTdkg5rqNcLo8KOla3luFxl9F9RcR1cCsAWtSxfHiWQYz2mg1aI6ZNM7wIeEllhkMINPgfanA0Hb2kGsiW/s1cK4M6nJ0bKhxMSmCyrUyiTta6f5t0+yKMxH071X9MRO9R+NEyPfx2lPzt8+f9Ken25CDOdpWzXQ3qcXZqcc3xOHGs//plIFVWzqsAri2flxYL4hWtNNBWdZxcXIqrjgzaMgwW52XsKrB34Q0WqRA1+36djsbIadpK8wvnQMo8"></Mermaid><h2 id="关键步骤说明" tabindex="-1"><a class="header-anchor" href="#关键步骤说明"><span>关键步骤说明</span></a></h2>
<table>
<thead>
<tr>
<th>步骤</th>
<th>操作</th>
<th>说明</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>1. 创建 weak 引用</strong></td>
<td>objc_storeWeak</td>
<td>将 weak 变量地址注册到 SideTable 的 weak_table_t 中</td>
</tr>
<tr>
<td><strong>2. 查找/创建 weak_entry_t</strong></td>
<td>在 weak_table_t 中查找</td>
<td>通过对象地址（Key）查找对应的 weak_entry_t（Value），如果不存在则创建</td>
</tr>
<tr>
<td><strong>3. 添加 weak 变量地址</strong></td>
<td>append_referrer</td>
<td>将 weak 变量的地址添加到 weak_entry_t 的 Value 中（存储 weak 指针地址数组）</td>
</tr>
<tr>
<td><strong>4. 对象释放时</strong></td>
<td>objc_destructInstance</td>
<td>对象释放时，查找对应的 weak_entry_t</td>
</tr>
<tr>
<td><strong>5. 清空所有 weak 引用</strong></td>
<td>遍历 weak 变量地址</td>
<td>遍历 weak_entry_t 中存储的所有 weak 变量地址，将它们都置为 nil</td>
</tr>
</tbody>
</table>
<h2 id="核心代码逻辑" tabindex="-1"><a class="header-anchor" href="#核心代码逻辑"><span>核心代码逻辑</span></a></h2>
<h3 id="创建-weak-引用" tabindex="-1"><a class="header-anchor" href="#创建-weak-引用"><span>创建 weak 引用</span></a></h3>
<div class="language-cpp line-numbers-mode" data-highlighter="prismjs" data-ext="cpp"><pre v-pre><code class="language-cpp"><span class="line"><span class="token comment">// 伪代码：objc_storeWeak</span></span>
<span class="line"><span class="token keyword">void</span> <span class="token function">objc_storeWeak</span><span class="token punctuation">(</span>id <span class="token operator">*</span>location<span class="token punctuation">,</span> id newObj<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token comment">// 1. 获取对象的 SideTable</span></span>
<span class="line">    SideTable <span class="token operator">&amp;</span>table <span class="token operator">=</span> <span class="token function">SideTables</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">[</span>newObj<span class="token punctuation">]</span><span class="token punctuation">;</span></span>
<span class="line">    </span>
<span class="line">    <span class="token comment">// 2. 在 weak_table_t 中查找或创建 weak_entry_t</span></span>
<span class="line">    weak_entry_t <span class="token operator">*</span>entry <span class="token operator">=</span> <span class="token function">weak_entry_for_referent</span><span class="token punctuation">(</span>table<span class="token punctuation">.</span>weak_table<span class="token punctuation">,</span> newObj<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>entry<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token comment">// 创建新的 weak_entry_t</span></span>
<span class="line">        entry <span class="token operator">=</span> <span class="token function">create_weak_entry</span><span class="token punctuation">(</span>newObj<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token function">weak_table_insert</span><span class="token punctuation">(</span>table<span class="token punctuation">.</span>weak_table<span class="token punctuation">,</span> entry<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">    </span>
<span class="line">    <span class="token comment">// 3. 将 weak 变量地址添加到 weak_entry_t</span></span>
<span class="line">    <span class="token function">append_referrer</span><span class="token punctuation">(</span>entry<span class="token punctuation">,</span> location<span class="token punctuation">)</span><span class="token punctuation">;</span>  <span class="token comment">// location 是 weak 变量的地址</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="对象释放时清空-weak-引用" tabindex="-1"><a class="header-anchor" href="#对象释放时清空-weak-引用"><span>对象释放时清空 weak 引用</span></a></h3>
<div class="language-cpp line-numbers-mode" data-highlighter="prismjs" data-ext="cpp"><pre v-pre><code class="language-cpp"><span class="line"><span class="token comment">// 伪代码：对象释放时</span></span>
<span class="line"><span class="token keyword">void</span> <span class="token function">objc_destructInstance</span><span class="token punctuation">(</span>id obj<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token comment">// 1. 获取对象的 SideTable</span></span>
<span class="line">    SideTable <span class="token operator">&amp;</span>table <span class="token operator">=</span> <span class="token function">SideTables</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">[</span>obj<span class="token punctuation">]</span><span class="token punctuation">;</span></span>
<span class="line">    </span>
<span class="line">    <span class="token comment">// 2. 在 weak_table_t 中查找 weak_entry_t</span></span>
<span class="line">    weak_entry_t <span class="token operator">*</span>entry <span class="token operator">=</span> <span class="token function">weak_entry_for_referent</span><span class="token punctuation">(</span>table<span class="token punctuation">.</span>weak_table<span class="token punctuation">,</span> obj<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">if</span> <span class="token punctuation">(</span>entry<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token comment">// 3. 遍历所有 weak 变量地址，将它们都置为 nil</span></span>
<span class="line">        <span class="token keyword">for</span> <span class="token punctuation">(</span>weak_referrer_t <span class="token operator">*</span>referrer <span class="token operator">=</span> entry<span class="token operator">-></span>referrers<span class="token punctuation">;</span> </span>
<span class="line">             referrer <span class="token operator">!=</span> <span class="token constant">NULL</span><span class="token punctuation">;</span> </span>
<span class="line">             referrer<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token operator">*</span>referrer <span class="token operator">=</span> nil<span class="token punctuation">;</span>  <span class="token comment">// 将 weak 变量置为 nil</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">        </span>
<span class="line">        <span class="token comment">// 4. 从 weak_table_t 中移除该 weak_entry_t</span></span>
<span class="line">        <span class="token function">remove_referrer</span><span class="token punctuation">(</span>entry<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="关键理解" tabindex="-1"><a class="header-anchor" href="#关键理解"><span>关键理解</span></a></h2>
<ul>
<li><strong>weak 变量地址</strong>：weak 变量本身也有内存地址，这个地址被存储在 weak_entry_t 中</li>
<li><strong>自动置 nil</strong>：对象释放时，通过 weak_entry_t 找到所有 weak 变量的地址，将这些地址存储的值改为 nil</li>
<li><strong>不增加引用计数</strong>：weak 引用不会让对象的引用计数 +1，所以不会阻止对象释放</li>
<li><strong>必须可选类型</strong>：因为可能为 nil，所以 weak 变量必须是可选类型</li>
</ul>
<h2 id="与-sidetable-的关系" tabindex="-1"><a class="header-anchor" href="#与-sidetable-的关系"><span>与 SideTable 的关系</span></a></h2>
<p>weak 引用的实现依赖于 SideTable：</p>
<ul>
<li>SideTable 中的 <strong>weak_table_t</strong> 存储所有对象的 weak 引用信息</li>
<li>通过对象地址（Key）查找对应的 <strong>weak_entry_t</strong>（Value）</li>
<li>weak_entry_t 中存储了所有指向该对象的 weak 变量地址</li>
<li>当对象释放时，通过这些地址将所有 weak 变量置为 nil</li>
</ul>
</div></template>


