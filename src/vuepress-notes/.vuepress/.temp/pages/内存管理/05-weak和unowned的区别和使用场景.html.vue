<template><div><h1 id="weak-和-unowned-的区别是什么-分别在什么场景下使用" tabindex="-1"><a class="header-anchor" href="#weak-和-unowned-的区别是什么-分别在什么场景下使用"><span>weak 和 unowned 的区别是什么？分别在什么场景下使用？</span></a></h1>
<h2 id="核心区别" tabindex="-1"><a class="header-anchor" href="#核心区别"><span>核心区别</span></a></h2>
<table>
<thead>
<tr>
<th>特性</th>
<th>weak</th>
<th>unowned</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>引用计数</strong></td>
<td>不增加</td>
<td>不增加</td>
</tr>
<tr>
<td><strong>自动置 nil</strong></td>
<td>✅ 是</td>
<td>❌ 否</td>
</tr>
<tr>
<td><strong>类型要求</strong></td>
<td>必须是可选类型</td>
<td>可以是非可选类型</td>
</tr>
<tr>
<td><strong>安全性</strong></td>
<td>安全（访问时为 nil 不会崩溃）</td>
<td>不安全（对象释放后访问会崩溃）</td>
</tr>
<tr>
<td><strong>使用场景</strong></td>
<td>不确定生命周期</td>
<td>确定被引用对象生命周期更长（不会先释放）</td>
</tr>
</tbody>
</table>
<h2 id="详细说明" tabindex="-1"><a class="header-anchor" href="#详细说明"><span>详细说明</span></a></h2>
<h3 id="weak-的特点" tabindex="-1"><a class="header-anchor" href="#weak-的特点"><span>weak 的特点</span></a></h3>
<ul>
<li><strong>不增加引用计数</strong>：weak 引用不会让对象的引用计数 +1</li>
<li><strong>自动置为 nil</strong>：当对象被释放时，weak 引用会自动变为 nil</li>
<li><strong>必须是可选类型</strong>：因为可能为 nil，所以必须是 <code v-pre>Optional</code> 类型</li>
<li><strong>安全访问</strong>：即使对象已释放，访问 weak 引用也不会崩溃（只是 nil）</li>
</ul>
<p><strong>对象释放的本质：</strong></p>
<ul>
<li>对象存储在<strong>堆内存</strong>中，有一个具体的<strong>内存地址</strong>（比如 0x1000）</li>
<li><strong>对象释放</strong> = 堆内存中这块地址的数据被清空/回收</li>
</ul>
<p><strong>weak 引用自动置为 nil 的本质：</strong></p>
<ul>
<li><code v-pre>weak var tenant: Person?</code> 这个变量存储的是一个<strong>地址值</strong>（指针）</li>
<li>当对象存在时，<code v-pre>tenant</code> 变量存储的是对象的地址（比如 0x1000）</li>
<li><strong>weak 置为 nil</strong> = 将 <code v-pre>tenant</code> 变量存储的地址值从 <code v-pre>0x1000</code> 改为 <code v-pre>nil</code>（0x0），也就是<strong>清空指针</strong></li>
</ul>
<h3 id="unowned-的特点" tabindex="-1"><a class="header-anchor" href="#unowned-的特点"><span>unowned 的特点</span></a></h3>
<ul>
<li><strong>不增加引用计数</strong>：unowned 引用也不会让对象的引用计数 +1</li>
<li><strong>不会自动置为 nil</strong>：对象释放后，unowned 引用仍然指向原来的地址（无效内存）</li>
<li><strong>可以是非可选类型</strong>：因为假设对象不会被释放，所以可以是非可选类型</li>
<li><strong>不安全访问</strong>：如果对象已释放，访问 unowned 引用会崩溃</li>
</ul>
<p><strong>生命周期要求：</strong></p>
<ul>
<li>如果 <code v-pre>a.b</code> 是 unowned，那么 <strong>b 的生命周期必须比 a 长</strong></li>
<li>如果 b 先释放了，a 还在，此时访问 <code v-pre>a.b</code> 就会崩溃（因为指向无效内存）</li>
<li>所以使用 unowned 的前提是：<strong>被引用的对象（b）一定不会先于引用者（a）释放</strong></li>
</ul>
<h2 id="使用场景" tabindex="-1"><a class="header-anchor" href="#使用场景"><span>使用场景</span></a></h2>
<h3 id="使用-weak-的场景" tabindex="-1"><a class="header-anchor" href="#使用-weak-的场景"><span>使用 weak 的场景</span></a></h3>
<table>
<thead>
<tr>
<th>场景</th>
<th>说明</th>
<th>示例</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>不确定生命周期</strong></td>
<td>被引用的对象可能先释放</td>
<td>代理模式（delegate）</td>
</tr>
<tr>
<td><strong>代理模式</strong></td>
<td>delegate 通常用 weak</td>
<td><code v-pre>weak var delegate: SomeDelegate?</code></td>
</tr>
<tr>
<td><strong>父子关系</strong></td>
<td>子对象引用父对象</td>
<td><code v-pre>weak var parent: Parent?</code></td>
</tr>
<tr>
<td><strong>闭包捕获</strong></td>
<td>闭包中捕获 self</td>
<td><code v-pre>{ [weak self] in ... }</code></td>
</tr>
</tbody>
</table>
<h3 id="使用-unowned-的场景" tabindex="-1"><a class="header-anchor" href="#使用-unowned-的场景"><span>使用 unowned 的场景</span></a></h3>
<table>
<thead>
<tr>
<th>场景</th>
<th>说明</th>
<th>示例</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>确定生命周期</strong></td>
<td>被引用对象生命周期更长</td>
<td>Country 和 City 的关系</td>
</tr>
<tr>
<td><strong>相互依赖初始化</strong></td>
<td>两个对象相互引用，但生命周期确定</td>
<td>Country 创建 City，City 用 unowned 引用 Country</td>
</tr>
</tbody>
</table>
<p><strong>正确示例：</strong></p>
<div class="language-swift line-numbers-mode" data-highlighter="prismjs" data-ext="swift"><pre v-pre><code class="language-swift"><span class="line"><span class="token keyword">class</span> <span class="token class-name">Country</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">var</span> capitalCity<span class="token punctuation">:</span> <span class="token class-name">City</span><span class="token operator">!</span></span>
<span class="line">    <span class="token keyword">var</span> name<span class="token punctuation">:</span> <span class="token class-name">String</span></span>
<span class="line">    </span>
<span class="line">    <span class="token keyword">init</span><span class="token punctuation">(</span>name<span class="token punctuation">:</span> <span class="token class-name">String</span><span class="token punctuation">,</span> capitalName<span class="token punctuation">:</span> <span class="token class-name">String</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">self</span><span class="token punctuation">.</span>name <span class="token operator">=</span> name</span>
<span class="line">        <span class="token keyword">self</span><span class="token punctuation">.</span>capitalCity <span class="token operator">=</span> <span class="token class-name">City</span><span class="token punctuation">(</span>name<span class="token punctuation">:</span> capitalName<span class="token punctuation">,</span> country<span class="token punctuation">:</span> <span class="token keyword">self</span><span class="token punctuation">)</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">class</span> <span class="token class-name">City</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">unowned</span> <span class="token keyword">let</span> country<span class="token punctuation">:</span> <span class="token class-name">Country</span>  <span class="token comment">// City 用 unowned 引用 Country</span></span>
<span class="line">    <span class="token keyword">var</span> name<span class="token punctuation">:</span> <span class="token class-name">String</span></span>
<span class="line">    </span>
<span class="line">    <span class="token keyword">init</span><span class="token punctuation">(</span>name<span class="token punctuation">:</span> <span class="token class-name">String</span><span class="token punctuation">,</span> country<span class="token punctuation">:</span> <span class="token class-name">Country</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">self</span><span class="token punctuation">.</span>name <span class="token operator">=</span> name</span>
<span class="line">        <span class="token keyword">self</span><span class="token punctuation">.</span>country <span class="token operator">=</span> country</span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// 为什么这里可以用 unowned？</span></span>
<span class="line"><span class="token comment">// 因为 Country 的生命周期一定比 City 长（国家比城市先存在）</span></span>
<span class="line"><span class="token comment">// Country 释放时，City 一定已经释放了</span></span>
<span class="line"><span class="token comment">// 所以 City 用 unowned 引用 Country 是安全的</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>错误示例：</strong></p>
<div class="language-swift line-numbers-mode" data-highlighter="prismjs" data-ext="swift"><pre v-pre><code class="language-swift"><span class="line"><span class="token keyword">class</span> <span class="token class-name">A</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">unowned</span> <span class="token keyword">var</span> b<span class="token punctuation">:</span> <span class="token class-name">B</span><span class="token operator">?</span>  <span class="token comment">// a.b 是 unowned</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">var</span> a <span class="token operator">=</span> <span class="token class-name">A</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line"><span class="token keyword">var</span> b <span class="token operator">=</span> <span class="token class-name">B</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line">a<span class="token punctuation">.</span>b <span class="token operator">=</span> b</span>
<span class="line">b <span class="token operator">=</span> <span class="token nil constant">nil</span>  <span class="token comment">// b 释放了</span></span>
<span class="line"></span>
<span class="line"><span class="token function">print</span><span class="token punctuation">(</span>a<span class="token punctuation">.</span>b<span class="token punctuation">)</span>  <span class="token comment">// 💥 崩溃！因为 b 已经释放，a.b 指向无效内存</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="为什么实际开发中-weak-更常用" tabindex="-1"><a class="header-anchor" href="#为什么实际开发中-weak-更常用"><span>为什么实际开发中 weak 更常用？</span></a></h2>
<table>
<thead>
<tr>
<th>原因</th>
<th>说明</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>安全性</strong></td>
<td>weak 更安全，即使对象已释放也不会崩溃</td>
</tr>
<tr>
<td><strong>灵活性</strong></td>
<td>不需要确定生命周期，适用场景更广</td>
</tr>
<tr>
<td><strong>代码可维护性</strong></td>
<td>不需要仔细分析生命周期关系，降低出错风险</td>
</tr>
<tr>
<td><strong>可选类型</strong></td>
<td>虽然需要可选类型，但可以通过 <code v-pre>guard let</code> 或 <code v-pre>if let</code> 安全处理</td>
</tr>
</tbody>
</table>
<h2 id="什么场景使用-unowned-有优势" tabindex="-1"><a class="header-anchor" href="#什么场景使用-unowned-有优势"><span>什么场景使用 unowned 有优势</span></a></h2>
<p>unowned 的优势主要体现在<strong>相互依赖初始化</strong>的场景中，因为可以使用非可选类型，带来代码简洁性和使用便利性。</p>
<h3 id="代码对比" tabindex="-1"><a class="header-anchor" href="#代码对比"><span>代码对比</span></a></h3>
<p><strong>用 weak（可选类型）：</strong></p>
<div class="language-swift line-numbers-mode" data-highlighter="prismjs" data-ext="swift"><pre v-pre><code class="language-swift"><span class="line"><span class="token keyword">class</span> <span class="token class-name">Country</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">var</span> capitalCity<span class="token punctuation">:</span> <span class="token class-name">City</span><span class="token operator">!</span></span>
<span class="line">    <span class="token keyword">var</span> name<span class="token punctuation">:</span> <span class="token class-name">String</span></span>
<span class="line">    </span>
<span class="line">    <span class="token keyword">init</span><span class="token punctuation">(</span>name<span class="token punctuation">:</span> <span class="token class-name">String</span><span class="token punctuation">,</span> capitalName<span class="token punctuation">:</span> <span class="token class-name">String</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">self</span><span class="token punctuation">.</span>name <span class="token operator">=</span> name</span>
<span class="line">        <span class="token keyword">self</span><span class="token punctuation">.</span>capitalCity <span class="token operator">=</span> <span class="token class-name">City</span><span class="token punctuation">(</span>name<span class="token punctuation">:</span> capitalName<span class="token punctuation">,</span> country<span class="token punctuation">:</span> <span class="token keyword">self</span><span class="token punctuation">)</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">class</span> <span class="token class-name">City</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">weak</span> <span class="token keyword">var</span> country<span class="token punctuation">:</span> <span class="token class-name">Country</span><span class="token operator">?</span>  <span class="token comment">// 必须是可选类型</span></span>
<span class="line">    <span class="token keyword">var</span> name<span class="token punctuation">:</span> <span class="token class-name">String</span></span>
<span class="line">    </span>
<span class="line">    <span class="token keyword">init</span><span class="token punctuation">(</span>name<span class="token punctuation">:</span> <span class="token class-name">String</span><span class="token punctuation">,</span> country<span class="token punctuation">:</span> <span class="token class-name">Country</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">self</span><span class="token punctuation">.</span>name <span class="token operator">=</span> name</span>
<span class="line">        <span class="token keyword">self</span><span class="token punctuation">.</span>country <span class="token operator">=</span> country</span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">    </span>
<span class="line">    <span class="token keyword">func</span> <span class="token function-definition function">getCountryName</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">-></span> <span class="token class-name">String</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token comment">// 每次访问都需要解包</span></span>
<span class="line">        <span class="token keyword">guard</span> <span class="token keyword">let</span> country <span class="token operator">=</span> country <span class="token keyword">else</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token keyword">return</span> <span class="token string-literal"><span class="token string">"Unknown"</span></span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">        <span class="token keyword">return</span> country<span class="token punctuation">.</span>name</span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>用 unowned（非可选类型）：</strong></p>
<div class="language-swift line-numbers-mode" data-highlighter="prismjs" data-ext="swift"><pre v-pre><code class="language-swift"><span class="line"><span class="token keyword">class</span> <span class="token class-name">Country</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">var</span> capitalCity<span class="token punctuation">:</span> <span class="token class-name">City</span><span class="token operator">!</span></span>
<span class="line">    <span class="token keyword">var</span> name<span class="token punctuation">:</span> <span class="token class-name">String</span></span>
<span class="line">    </span>
<span class="line">    <span class="token keyword">init</span><span class="token punctuation">(</span>name<span class="token punctuation">:</span> <span class="token class-name">String</span><span class="token punctuation">,</span> capitalName<span class="token punctuation">:</span> <span class="token class-name">String</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">self</span><span class="token punctuation">.</span>name <span class="token operator">=</span> name</span>
<span class="line">        <span class="token keyword">self</span><span class="token punctuation">.</span>capitalCity <span class="token operator">=</span> <span class="token class-name">City</span><span class="token punctuation">(</span>name<span class="token punctuation">:</span> capitalName<span class="token punctuation">,</span> country<span class="token punctuation">:</span> <span class="token keyword">self</span><span class="token punctuation">)</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">class</span> <span class="token class-name">City</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">unowned</span> <span class="token keyword">let</span> country<span class="token punctuation">:</span> <span class="token class-name">Country</span>  <span class="token comment">// 非可选类型，更简洁</span></span>
<span class="line">    <span class="token keyword">var</span> name<span class="token punctuation">:</span> <span class="token class-name">String</span></span>
<span class="line">    </span>
<span class="line">    <span class="token keyword">init</span><span class="token punctuation">(</span>name<span class="token punctuation">:</span> <span class="token class-name">String</span><span class="token punctuation">,</span> country<span class="token punctuation">:</span> <span class="token class-name">Country</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">self</span><span class="token punctuation">.</span>name <span class="token operator">=</span> name</span>
<span class="line">        <span class="token keyword">self</span><span class="token punctuation">.</span>country <span class="token operator">=</span> country</span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">    </span>
<span class="line">    <span class="token keyword">func</span> <span class="token function-definition function">getCountryName</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">-></span> <span class="token class-name">String</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token comment">// 直接访问，不需要解包</span></span>
<span class="line">        <span class="token keyword">return</span> country<span class="token punctuation">.</span>name</span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="unowned-的优势" tabindex="-1"><a class="header-anchor" href="#unowned-的优势"><span>unowned 的优势</span></a></h3>
<table>
<thead>
<tr>
<th>优势</th>
<th>说明</th>
<th>实际对比</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>代码更简洁</strong></td>
<td>不需要可选类型，避免每次访问都要解包</td>
<td><code v-pre>weak var country: Country?</code> → 访问时需要 <code v-pre>country?.name</code> 或 <code v-pre>guard let country = country</code><br><code v-pre>unowned let country: Country</code> → 直接访问 <code v-pre>country.name</code></td>
</tr>
<tr>
<td><strong>语义更清晰</strong></td>
<td>明确表达&quot;country 一定存在&quot;的语义</td>
<td>非可选类型本身就表达了&quot;这个对象一定存在&quot;的含义</td>
</tr>
<tr>
<td><strong>使用更方便</strong></td>
<td>直接访问，不需要 <code v-pre>guard let</code> 或 <code v-pre>if let</code></td>
<td>避免了可选类型带来的额外代码</td>
</tr>
<tr>
<td><strong>性能略好</strong></td>
<td>不需要 Side Table 管理（但差异很小，通常不需要考虑）</td>
<td>性能差异很小，通常不需要考虑</td>
</tr>
</tbody>
</table>
<blockquote>
<p><strong>注意：</strong> 虽然 unowned 有这些优势，但必须确保生命周期关系正确，否则会崩溃。在实际开发中，如果对生命周期关系不确定，还是优先用 weak。</p>
</blockquote>
<h2 id="实际开发建议" tabindex="-1"><a class="header-anchor" href="#实际开发建议"><span>实际开发建议</span></a></h2>
<table>
<thead>
<tr>
<th>场景</th>
<th>推荐</th>
<th>原因</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>大多数情况</strong></td>
<td>优先用 <code v-pre>weak</code></td>
<td>更安全，适用场景广</td>
</tr>
<tr>
<td><strong>代理模式</strong></td>
<td>用 <code v-pre>weak</code></td>
<td>delegate 可能随时被释放</td>
</tr>
<tr>
<td><strong>闭包捕获</strong></td>
<td>优先用 <code v-pre>[weak self]</code></td>
<td>不确定 self 的生命周期</td>
</tr>
<tr>
<td><strong>相互依赖初始化</strong></td>
<td>可以用 <code v-pre>unowned</code></td>
<td>如 Country 和 City，生命周期确定</td>
</tr>
<tr>
<td><strong>需要非可选类型</strong></td>
<td>可以用 <code v-pre>unowned</code></td>
<td>但必须确保生命周期关系</td>
</tr>
</tbody>
</table>
<h2 id="关键点总结" tabindex="-1"><a class="header-anchor" href="#关键点总结"><span>关键点总结</span></a></h2>
<table>
<thead>
<tr>
<th>方面</th>
<th>说明</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>weak</strong></td>
<td>安全但必须是可选类型，适合不确定生命周期的场景</td>
</tr>
<tr>
<td><strong>unowned</strong></td>
<td>不安全但可以是非可选类型，适合确定生命周期的场景</td>
</tr>
<tr>
<td><strong>选择原则</strong></td>
<td>不确定用 weak，确定用 unowned</td>
</tr>
<tr>
<td><strong>闭包捕获</strong></td>
<td>优先用 weak，确定生命周期用 unowned</td>
</tr>
</tbody>
</table>
</div></template>


