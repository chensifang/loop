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
<div class="language-cpp line-numbers-mode" data-highlighter="prismjs" data-ext="cpp"><pre  class="shiki github-light vp-code" style="background-color:#fff;color:#24292e" v-pre=" language-cpp"><code><span class="line"><span class="line"><span style="color:#6A737D">// 伪代码：objc_storeWeak</span></span></span>
<span class="line"><span class="line"><span style="color:#D73A49">void</span><span style="color:#6F42C1"> objc_storeWeak</span><span style="color:#24292E">(</span><span style="color:#6F42C1">id</span><span style="color:#D73A49"> *</span><span style="color:#E36209">location</span><span style="color:#24292E">, </span><span style="color:#6F42C1">id</span><span style="color:#E36209"> newObj</span><span style="color:#24292E">) {</span></span></span>
<span class="line"><span class="line"><span style="color:#6A737D">    // 1. 获取对象的 SideTable</span></span></span>
<span class="line"><span class="line"><span style="color:#24292E">    SideTable </span><span style="color:#D73A49">&#x26;</span><span style="color:#24292E">table </span><span style="color:#D73A49">=</span><span style="color:#6F42C1"> SideTables</span><span style="color:#24292E">()[newObj];</span></span></span>
<span class="line"><span class="line"><span style="color:#24292E">    </span></span></span>
<span class="line"><span class="line"><span style="color:#6A737D">    // 2. 在 weak_table_t 中查找或创建 weak_entry_t</span></span></span>
<span class="line"><span class="line"><span style="color:#005CC5">    weak_entry_t</span><span style="color:#D73A49"> *</span><span style="color:#24292E">entry </span><span style="color:#D73A49">=</span><span style="color:#6F42C1"> weak_entry_for_referent</span><span style="color:#24292E">(table.weak_table, newObj);</span></span></span>
<span class="line"><span class="line"><span style="color:#D73A49">    if</span><span style="color:#24292E"> (</span><span style="color:#D73A49">!</span><span style="color:#24292E">entry) {</span></span></span>
<span class="line"><span class="line"><span style="color:#6A737D">        // 创建新的 weak_entry_t</span></span></span>
<span class="line"><span class="line"><span style="color:#24292E">        entry </span><span style="color:#D73A49">=</span><span style="color:#6F42C1"> create_weak_entry</span><span style="color:#24292E">(newObj);</span></span></span>
<span class="line"><span class="line"><span style="color:#6F42C1">        weak_table_insert</span><span style="color:#24292E">(table.weak_table, entry);</span></span></span>
<span class="line"><span class="line"><span style="color:#24292E">    }</span></span></span>
<span class="line"><span class="line"><span style="color:#24292E">    </span></span></span>
<span class="line"><span class="line"><span style="color:#6A737D">    // 3. 将 weak 变量地址添加到 weak_entry_t</span></span></span>
<span class="line"><span class="line"><span style="color:#6F42C1">    append_referrer</span><span style="color:#24292E">(entry, location);</span><span style="color:#6A737D">  // location 是 weak 变量的地址</span></span></span>
<span class="line"><span class="line"><span style="color:#24292E">}</span></span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"></div></div><h3 id="对象释放时清空-weak-引用" tabindex="-1"><a class="header-anchor" href="#对象释放时清空-weak-引用"><span>对象释放时清空 weak 引用</span></a></h3>
<div class="language-cpp line-numbers-mode" data-highlighter="prismjs" data-ext="cpp"><pre  class="shiki github-light vp-code" style="background-color:#fff;color:#24292e" v-pre=" language-cpp"><code><span class="line"><span class="line"><span style="color:#6A737D">// 伪代码：对象释放时</span></span></span>
<span class="line"><span class="line"><span style="color:#D73A49">void</span><span style="color:#6F42C1"> objc_destructInstance</span><span style="color:#24292E">(</span><span style="color:#6F42C1">id</span><span style="color:#E36209"> obj</span><span style="color:#24292E">) {</span></span></span>
<span class="line"><span class="line"><span style="color:#6A737D">    // 1. 获取对象的 SideTable</span></span></span>
<span class="line"><span class="line"><span style="color:#24292E">    SideTable </span><span style="color:#D73A49">&#x26;</span><span style="color:#24292E">table </span><span style="color:#D73A49">=</span><span style="color:#6F42C1"> SideTables</span><span style="color:#24292E">()[obj];</span></span></span>
<span class="line"><span class="line"><span style="color:#24292E">    </span></span></span>
<span class="line"><span class="line"><span style="color:#6A737D">    // 2. 在 weak_table_t 中查找 weak_entry_t</span></span></span>
<span class="line"><span class="line"><span style="color:#005CC5">    weak_entry_t</span><span style="color:#D73A49"> *</span><span style="color:#24292E">entry </span><span style="color:#D73A49">=</span><span style="color:#6F42C1"> weak_entry_for_referent</span><span style="color:#24292E">(table.weak_table, obj);</span></span></span>
<span class="line"><span class="line"><span style="color:#D73A49">    if</span><span style="color:#24292E"> (entry) {</span></span></span>
<span class="line"><span class="line"><span style="color:#6A737D">        // 3. 遍历所有 weak 变量地址，将它们都置为 nil</span></span></span>
<span class="line"><span class="line"><span style="color:#D73A49">        for</span><span style="color:#24292E"> (</span><span style="color:#005CC5">weak_referrer_t</span><span style="color:#D73A49"> *</span><span style="color:#24292E">referrer </span><span style="color:#D73A49">=</span><span style="color:#24292E"> entry->referrers; </span></span></span>
<span class="line"><span class="line"><span style="color:#24292E">             referrer </span><span style="color:#D73A49">!=</span><span style="color:#005CC5"> NULL</span><span style="color:#24292E">; </span></span></span>
<span class="line"><span class="line"><span style="color:#24292E">             referrer</span><span style="color:#D73A49">++</span><span style="color:#24292E">) {</span></span></span>
<span class="line"><span class="line"><span style="color:#D73A49">            *</span><span style="color:#24292E">referrer </span><span style="color:#D73A49">=</span><span style="color:#24292E"> nil;</span><span style="color:#6A737D">  // 将 weak 变量置为 nil</span></span></span>
<span class="line"><span class="line"><span style="color:#24292E">        }</span></span></span>
<span class="line"><span class="line"><span style="color:#24292E">        </span></span></span>
<span class="line"><span class="line"><span style="color:#6A737D">        // 4. 从 weak_table_t 中移除该 weak_entry_t</span></span></span>
<span class="line"><span class="line"><span style="color:#6F42C1">        remove_referrer</span><span style="color:#24292E">(entry);</span></span></span>
<span class="line"><span class="line"><span style="color:#24292E">    }</span></span></span>
<span class="line"><span class="line"><span style="color:#24292E">}</span></span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"></div></div><h2 id="关键理解" tabindex="-1"><a class="header-anchor" href="#关键理解"><span>关键理解</span></a></h2>
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


