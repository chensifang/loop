<template><div><h1 id="什么情况下会产生循环引用-如何解决" tabindex="-1"><a class="header-anchor" href="#什么情况下会产生循环引用-如何解决"><span>什么情况下会产生循环引用？如何解决？</span></a></h1>
<h2 id="核心概念" tabindex="-1"><a class="header-anchor" href="#核心概念"><span>核心概念</span></a></h2>
<p>循环引用是指两个或多个对象相互强引用，导致它们的引用计数永远无法降为 0，从而造成内存泄漏。</p>
<h2 id="循环引用产生的场景" tabindex="-1"><a class="header-anchor" href="#循环引用产生的场景"><span>循环引用产生的场景</span></a></h2>
<table>
<thead>
<tr>
<th>场景</th>
<th>描述</th>
<th>示例</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>对象相互引用</strong></td>
<td>两个对象互相强引用对方</td>
<td>Person ↔ Apartment</td>
</tr>
<tr>
<td><strong>闭包捕获 self</strong></td>
<td>闭包是对象属性，闭包内使用 self</td>
<td>ViewController → closure → ViewController</td>
</tr>
<tr>
<td><strong>代理模式</strong></td>
<td>如果 delegate 是强引用</td>
<td>ViewController → tableView → ViewController</td>
</tr>
<tr>
<td><strong>父子关系</strong></td>
<td>父子对象互相强引用</td>
<td>Parent ↔ Child</td>
</tr>
</tbody>
</table>
<h3 id="_1-对象之间的相互引用" tabindex="-1"><a class="header-anchor" href="#_1-对象之间的相互引用"><span>1. 对象之间的相互引用</span></a></h3>
<p><strong>典型场景：</strong></p>
<div class="language-swift line-numbers-mode" data-highlighter="prismjs" data-ext="swift"><pre v-pre><code class="language-swift"><span class="line"><span class="token keyword">class</span> <span class="token class-name">Person</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">var</span> apartment<span class="token punctuation">:</span> <span class="token class-name">Apartment</span><span class="token operator">?</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">class</span> <span class="token class-name">Apartment</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">var</span> tenant<span class="token punctuation">:</span> <span class="token class-name">Person</span><span class="token operator">?</span>  <span class="token comment">// 强引用 Person</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">var</span> person<span class="token punctuation">:</span> <span class="token class-name">Person</span><span class="token operator">?</span> <span class="token operator">=</span> <span class="token class-name">Person</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line"><span class="token keyword">var</span> apartment<span class="token punctuation">:</span> <span class="token class-name">Apartment</span><span class="token operator">?</span> <span class="token operator">=</span> <span class="token class-name">Apartment</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line">person<span class="token operator">?</span><span class="token punctuation">.</span>apartment <span class="token operator">=</span> apartment  <span class="token comment">// Person 强引用 Apartment</span></span>
<span class="line">apartment<span class="token operator">?</span><span class="token punctuation">.</span>tenant <span class="token operator">=</span> person     <span class="token comment">// Apartment 强引用 Person</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// 此时引用计数：</span></span>
<span class="line"><span class="token comment">// Person: 2 (person变量 + apartment.tenant)</span></span>
<span class="line"><span class="token comment">// Apartment: 2 (apartment变量 + person.apartment)</span></span>
<span class="line"></span>
<span class="line">person <span class="token operator">=</span> <span class="token nil constant">nil</span>      <span class="token comment">// Person 引用计数 = 1（apartment.tenant 还在引用）</span></span>
<span class="line">apartment <span class="token operator">=</span> <span class="token nil constant">nil</span>   <span class="token comment">// Apartment 引用计数 = 1（person.apartment 还在引用）</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// 两个对象都无法释放！内存泄漏！</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><blockquote>
<p><strong>通俗理解：</strong> 就像两个人互相拉着对方的手，谁也不肯先松手，结果两个人都走不了。</p>
</blockquote>
<h3 id="_2-闭包捕获-self" tabindex="-1"><a class="header-anchor" href="#_2-闭包捕获-self"><span>2. 闭包捕获 self</span></a></h3>
<p><strong>典型场景：</strong></p>
<div class="language-swift line-numbers-mode" data-highlighter="prismjs" data-ext="swift"><pre v-pre><code class="language-swift"><span class="line"><span class="token keyword">class</span> <span class="token class-name">ViewController</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">var</span> completionHandler<span class="token punctuation">:</span> <span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">-></span> <span class="token class-name">Void</span><span class="token punctuation">)</span><span class="token operator">?</span></span>
<span class="line">    </span>
<span class="line">    <span class="token keyword">func</span> <span class="token function-definition function">setup</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        completionHandler <span class="token operator">=</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token keyword">self</span><span class="token punctuation">.</span><span class="token function">doSomething</span><span class="token punctuation">(</span><span class="token punctuation">)</span>  <span class="token comment">// 闭包强引用 self</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">    </span>
<span class="line">    <span class="token keyword">func</span> <span class="token function-definition function">doSomething</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token function">print</span><span class="token punctuation">(</span><span class="token string-literal"><span class="token string">"doing something"</span></span><span class="token punctuation">)</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">var</span> vc<span class="token punctuation">:</span> <span class="token class-name">ViewController</span><span class="token operator">?</span> <span class="token operator">=</span> <span class="token class-name">ViewController</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line">vc<span class="token operator">?</span><span class="token punctuation">.</span><span class="token function">setup</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// 此时：</span></span>
<span class="line"><span class="token comment">// ViewController 强引用 completionHandler（闭包）</span></span>
<span class="line"><span class="token comment">// 闭包强引用 ViewController（self）</span></span>
<span class="line"></span>
<span class="line">vc <span class="token operator">=</span> <span class="token nil constant">nil</span>  <span class="token comment">// ViewController 引用计数 = 1（闭包还在引用），无法释放！</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>为什么会这样？</strong></p>
<p>闭包会捕获它内部使用的所有外部变量，如果闭包是对象的属性，而闭包内部又使用了 <code v-pre>self</code>，就会形成循环引用。</p>
<h3 id="_3-代理模式-delegate-中的循环引用" tabindex="-1"><a class="header-anchor" href="#_3-代理模式-delegate-中的循环引用"><span>3. 代理模式（Delegate）中的循环引用</span></a></h3>
<p><strong>典型场景：</strong></p>
<div class="language-swift line-numbers-mode" data-highlighter="prismjs" data-ext="swift"><pre v-pre><code class="language-swift"><span class="line"><span class="token keyword">class</span> <span class="token class-name">ViewController</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">var</span> tableView<span class="token punctuation">:</span> <span class="token class-name">UITableView</span><span class="token operator">?</span></span>
<span class="line">    </span>
<span class="line">    <span class="token keyword">init</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        tableView <span class="token operator">=</span> <span class="token class-name">UITableView</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line">        tableView<span class="token operator">?</span><span class="token punctuation">.</span>delegate <span class="token operator">=</span> <span class="token keyword">self</span>  <span class="token comment">// 如果 delegate 是强引用，就会循环引用</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// 如果 UITableView 的 delegate 属性是强引用：</span></span>
<span class="line"><span class="token comment">// ViewController 强引用 tableView</span></span>
<span class="line"><span class="token comment">// tableView 强引用 ViewController（delegate）</span></span>
<span class="line"><span class="token comment">// 形成循环引用</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><blockquote>
<p><strong>注意：</strong> 实际上 <code v-pre>UITableView.delegate</code> 是 <code v-pre>weak</code> 引用，所以不会循环引用。但如果自己实现代理模式时用强引用，就会出问题。</p>
</blockquote>
<h3 id="_4-父子关系中的循环引用" tabindex="-1"><a class="header-anchor" href="#_4-父子关系中的循环引用"><span>4. 父子关系中的循环引用</span></a></h3>
<p><strong>典型场景：</strong></p>
<div class="language-swift line-numbers-mode" data-highlighter="prismjs" data-ext="swift"><pre v-pre><code class="language-swift"><span class="line"><span class="token keyword">class</span> <span class="token class-name">Parent</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">var</span> children<span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token class-name">Child</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">class</span> <span class="token class-name">Child</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">var</span> parent<span class="token punctuation">:</span> <span class="token class-name">Parent</span><span class="token operator">?</span>  <span class="token comment">// 如果这里是强引用</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">var</span> parent <span class="token operator">=</span> <span class="token class-name">Parent</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line"><span class="token keyword">var</span> child <span class="token operator">=</span> <span class="token class-name">Child</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line">parent<span class="token punctuation">.</span>children<span class="token punctuation">.</span><span class="token function">append</span><span class="token punctuation">(</span>child<span class="token punctuation">)</span></span>
<span class="line">child<span class="token punctuation">.</span>parent <span class="token operator">=</span> parent  <span class="token comment">// 如果 parent 是强引用，就会循环引用</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="如何解决循环引用" tabindex="-1"><a class="header-anchor" href="#如何解决循环引用"><span>如何解决循环引用</span></a></h2>
<table>
<thead>
<tr>
<th>方法</th>
<th>特点</th>
<th>使用场景</th>
<th>注意事项</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>weak</strong></td>
<td>不增加引用计数，对象释放时自动置为 nil</td>
<td>不确定生命周期、代理模式、父子关系</td>
<td>必须是可选类型</td>
</tr>
<tr>
<td><strong>unowned</strong></td>
<td>不增加引用计数，不会自动置为 nil</td>
<td>确定被引用对象生命周期更长</td>
<td>对象释放后访问会崩溃</td>
</tr>
<tr>
<td><strong>捕获列表</strong></td>
<td>闭包中使用 <code v-pre>[weak self]</code> 或 <code v-pre>[unowned self]</code></td>
<td>闭包捕获 self 的场景</td>
<td>优先使用 weak</td>
</tr>
<tr>
<td><strong>手动断开</strong></td>
<td>在 deinit 中手动置为 nil</td>
<td>对象生命周期明确</td>
<td>不是最佳实践</td>
</tr>
</tbody>
</table>
<p><strong>对象释放的本质：</strong></p>
<ul>
<li>对象存储在<strong>堆内存</strong>中，有一个具体的<strong>内存地址</strong>（比如 0x1000）</li>
<li>强引用变量（如 <code v-pre>var person: Person?</code>）存储的是这个对象的<strong>内存地址</strong>（指针）</li>
<li><strong>对象释放</strong> = 堆内存中这块地址（0x1000）的数据被清空/回收，这块内存可以被其他对象使用</li>
</ul>
<p><strong>weak 引用自动置为 nil 的本质：</strong></p>
<ul>
<li><code v-pre>weak var tenant: Person?</code> 这个变量本身也占用内存，存储的是一个<strong>地址值</strong>（指针）</li>
<li>当对象存在时，<code v-pre>tenant</code> 变量存储的是对象的地址（比如 0x1000）</li>
<li><strong>weak 置为 nil</strong> = 将 <code v-pre>tenant</code> 变量存储的地址值从 <code v-pre>0x1000</code> 改为 <code v-pre>nil</code>（0x0），也就是<strong>清空指针</strong></li>
<li>这样即使对象的堆内存被回收了，weak 变量也不会指向无效的内存地址</li>
</ul>
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
<td><strong>本质</strong></td>
<td>对象相互强引用，引用计数无法降为 0</td>
</tr>
<tr>
<td><strong>常见场景</strong></td>
<td>对象相互引用、闭包捕获 self、代理模式、父子关系</td>
</tr>
<tr>
<td><strong>解决方法</strong></td>
<td>weak、unowned、捕获列表、手动断开</td>
</tr>
<tr>
<td><strong>选择原则</strong></td>
<td>不确定生命周期用 weak，确定生命周期用 unowned，闭包用捕获列表</td>
</tr>
<tr>
<td><strong>weak/unowned 区别</strong></td>
<td>详见问题 3：weak 和 unowned 的区别和使用场景</td>
</tr>
</tbody>
</table>
</div></template>


