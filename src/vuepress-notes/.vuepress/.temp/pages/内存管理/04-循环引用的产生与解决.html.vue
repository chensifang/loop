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
<div class="language-swift line-numbers-mode" data-highlighter="prismjs" data-ext="swift"><pre  class="shiki github-light vp-code" style="background-color:#fff;color:#24292e" v-pre=" language-swift"><code><span class="line"><span class="line"><span style="color:#D73A49">class</span><span style="color:#6F42C1"> Person</span><span style="color:#24292E"> {</span></span></span>
<span class="line"><span class="line"><span style="color:#D73A49">    var</span><span style="color:#24292E"> apartment: Apartment</span><span style="color:#D73A49">?</span></span></span>
<span class="line"><span class="line"><span style="color:#24292E">}</span></span></span>
<span class="line"><span class="line"></span></span>
<span class="line"><span class="line"><span style="color:#D73A49">class</span><span style="color:#6F42C1"> Apartment</span><span style="color:#24292E"> {</span></span></span>
<span class="line"><span class="line"><span style="color:#D73A49">    var</span><span style="color:#24292E"> tenant: Person</span><span style="color:#D73A49">?</span><span style="color:#6A737D">  // 强引用 Person</span></span></span>
<span class="line"><span class="line"><span style="color:#24292E">}</span></span></span>
<span class="line"><span class="line"></span></span>
<span class="line"><span class="line"><span style="color:#D73A49">var</span><span style="color:#24292E"> person: Person</span><span style="color:#D73A49">?</span><span style="color:#D73A49"> =</span><span style="color:#005CC5"> Person</span><span style="color:#24292E">()</span></span></span>
<span class="line"><span class="line"><span style="color:#D73A49">var</span><span style="color:#24292E"> apartment: Apartment</span><span style="color:#D73A49">?</span><span style="color:#D73A49"> =</span><span style="color:#005CC5"> Apartment</span><span style="color:#24292E">()</span></span></span>
<span class="line"><span class="line"></span></span>
<span class="line"><span class="line"><span style="color:#24292E">person</span><span style="color:#D73A49">?</span><span style="color:#24292E">.apartment </span><span style="color:#D73A49">=</span><span style="color:#24292E"> apartment  </span><span style="color:#6A737D">// Person 强引用 Apartment</span></span></span>
<span class="line"><span class="line"><span style="color:#24292E">apartment</span><span style="color:#D73A49">?</span><span style="color:#24292E">.tenant </span><span style="color:#D73A49">=</span><span style="color:#24292E"> person     </span><span style="color:#6A737D">// Apartment 强引用 Person</span></span></span>
<span class="line"><span class="line"></span></span>
<span class="line"><span class="line"><span style="color:#6A737D">// 此时引用计数：</span></span></span>
<span class="line"><span class="line"><span style="color:#6A737D">// Person: 2 (person变量 + apartment.tenant)</span></span></span>
<span class="line"><span class="line"><span style="color:#6A737D">// Apartment: 2 (apartment变量 + person.apartment)</span></span></span>
<span class="line"><span class="line"></span></span>
<span class="line"><span class="line"><span style="color:#24292E">person </span><span style="color:#D73A49">=</span><span style="color:#005CC5"> nil</span><span style="color:#6A737D">      // Person 引用计数 = 1（apartment.tenant 还在引用）</span></span></span>
<span class="line"><span class="line"><span style="color:#24292E">apartment </span><span style="color:#D73A49">=</span><span style="color:#005CC5"> nil</span><span style="color:#6A737D">   // Apartment 引用计数 = 1（person.apartment 还在引用）</span></span></span>
<span class="line"><span class="line"></span></span>
<span class="line"><span class="line"><span style="color:#6A737D">// 两个对象都无法释放！内存泄漏！</span></span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"></div></div><blockquote>
<p><strong>通俗理解：</strong> 就像两个人互相拉着对方的手，谁也不肯先松手，结果两个人都走不了。</p>
</blockquote>
<h3 id="_2-闭包捕获-self" tabindex="-1"><a class="header-anchor" href="#_2-闭包捕获-self"><span>2. 闭包捕获 self</span></a></h3>
<p><strong>典型场景：</strong></p>
<div class="language-swift line-numbers-mode" data-highlighter="prismjs" data-ext="swift"><pre  class="shiki github-light vp-code" style="background-color:#fff;color:#24292e" v-pre=" language-swift"><code><span class="line"><span class="line"><span style="color:#D73A49">class</span><span style="color:#6F42C1"> ViewController</span><span style="color:#24292E"> {</span></span></span>
<span class="line"><span class="line"><span style="color:#D73A49">    var</span><span style="color:#24292E"> completionHandler: (() </span><span style="color:#D73A49">-></span><span style="color:#005CC5"> Void</span><span style="color:#24292E">)</span><span style="color:#D73A49">?</span></span></span>
<span class="line"><span class="line"><span style="color:#24292E">    </span></span></span>
<span class="line"><span class="line"><span style="color:#D73A49">    func</span><span style="color:#6F42C1"> setup</span><span style="color:#24292E">() {</span></span></span>
<span class="line"><span class="line"><span style="color:#24292E">        completionHandler </span><span style="color:#D73A49">=</span><span style="color:#24292E"> {</span></span></span>
<span class="line"><span class="line"><span style="color:#005CC5">            self</span><span style="color:#24292E">.</span><span style="color:#005CC5">doSomething</span><span style="color:#24292E">()  </span><span style="color:#6A737D">// 闭包强引用 self</span></span></span>
<span class="line"><span class="line"><span style="color:#24292E">        }</span></span></span>
<span class="line"><span class="line"><span style="color:#24292E">    }</span></span></span>
<span class="line"><span class="line"><span style="color:#24292E">    </span></span></span>
<span class="line"><span class="line"><span style="color:#D73A49">    func</span><span style="color:#6F42C1"> doSomething</span><span style="color:#24292E">() {</span></span></span>
<span class="line"><span class="line"><span style="color:#005CC5">        print</span><span style="color:#24292E">(</span><span style="color:#032F62">"doing something"</span><span style="color:#24292E">)</span></span></span>
<span class="line"><span class="line"><span style="color:#24292E">    }</span></span></span>
<span class="line"><span class="line"><span style="color:#24292E">}</span></span></span>
<span class="line"><span class="line"></span></span>
<span class="line"><span class="line"><span style="color:#D73A49">var</span><span style="color:#24292E"> vc: ViewController</span><span style="color:#D73A49">?</span><span style="color:#D73A49"> =</span><span style="color:#005CC5"> ViewController</span><span style="color:#24292E">()</span></span></span>
<span class="line"><span class="line"><span style="color:#24292E">vc</span><span style="color:#D73A49">?</span><span style="color:#24292E">.</span><span style="color:#005CC5">setup</span><span style="color:#24292E">()</span></span></span>
<span class="line"><span class="line"></span></span>
<span class="line"><span class="line"><span style="color:#6A737D">// 此时：</span></span></span>
<span class="line"><span class="line"><span style="color:#6A737D">// ViewController 强引用 completionHandler（闭包）</span></span></span>
<span class="line"><span class="line"><span style="color:#6A737D">// 闭包强引用 ViewController（self）</span></span></span>
<span class="line"><span class="line"></span></span>
<span class="line"><span class="line"><span style="color:#24292E">vc </span><span style="color:#D73A49">=</span><span style="color:#005CC5"> nil</span><span style="color:#6A737D">  // ViewController 引用计数 = 1（闭包还在引用），无法释放！</span></span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"></div></div><p><strong>为什么会这样？</strong></p>
<p>闭包会捕获它内部使用的所有外部变量，如果闭包是对象的属性，而闭包内部又使用了 <code v-pre>self</code>，就会形成循环引用。</p>
<h3 id="_3-代理模式-delegate-中的循环引用" tabindex="-1"><a class="header-anchor" href="#_3-代理模式-delegate-中的循环引用"><span>3. 代理模式（Delegate）中的循环引用</span></a></h3>
<p><strong>典型场景：</strong></p>
<div class="language-swift line-numbers-mode" data-highlighter="prismjs" data-ext="swift"><pre  class="shiki github-light vp-code" style="background-color:#fff;color:#24292e" v-pre=" language-swift"><code><span class="line"><span class="line"><span style="color:#D73A49">class</span><span style="color:#6F42C1"> ViewController</span><span style="color:#24292E"> {</span></span></span>
<span class="line"><span class="line"><span style="color:#D73A49">    var</span><span style="color:#24292E"> tableView: UITableView</span><span style="color:#D73A49">?</span></span></span>
<span class="line"><span class="line"><span style="color:#24292E">    </span></span></span>
<span class="line"><span class="line"><span style="color:#D73A49">    init</span><span style="color:#24292E">() {</span></span></span>
<span class="line"><span class="line"><span style="color:#24292E">        tableView </span><span style="color:#D73A49">=</span><span style="color:#005CC5"> UITableView</span><span style="color:#24292E">()</span></span></span>
<span class="line"><span class="line"><span style="color:#24292E">        tableView</span><span style="color:#D73A49">?</span><span style="color:#24292E">.delegate </span><span style="color:#D73A49">=</span><span style="color:#005CC5"> self</span><span style="color:#6A737D">  // 如果 delegate 是强引用，就会循环引用</span></span></span>
<span class="line"><span class="line"><span style="color:#24292E">    }</span></span></span>
<span class="line"><span class="line"><span style="color:#24292E">}</span></span></span>
<span class="line"><span class="line"></span></span>
<span class="line"><span class="line"><span style="color:#6A737D">// 如果 UITableView 的 delegate 属性是强引用：</span></span></span>
<span class="line"><span class="line"><span style="color:#6A737D">// ViewController 强引用 tableView</span></span></span>
<span class="line"><span class="line"><span style="color:#6A737D">// tableView 强引用 ViewController（delegate）</span></span></span>
<span class="line"><span class="line"><span style="color:#6A737D">// 形成循环引用</span></span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"></div></div><blockquote>
<p><strong>注意：</strong> 实际上 <code v-pre>UITableView.delegate</code> 是 <code v-pre>weak</code> 引用，所以不会循环引用。但如果自己实现代理模式时用强引用，就会出问题。</p>
</blockquote>
<h3 id="_4-父子关系中的循环引用" tabindex="-1"><a class="header-anchor" href="#_4-父子关系中的循环引用"><span>4. 父子关系中的循环引用</span></a></h3>
<p><strong>典型场景：</strong></p>
<div class="language-swift line-numbers-mode" data-highlighter="prismjs" data-ext="swift"><pre  class="shiki github-light vp-code" style="background-color:#fff;color:#24292e" v-pre=" language-swift"><code><span class="line"><span class="line"><span style="color:#D73A49">class</span><span style="color:#6F42C1"> Parent</span><span style="color:#24292E"> {</span></span></span>
<span class="line"><span class="line"><span style="color:#D73A49">    var</span><span style="color:#24292E"> children: [</span><span style="color:#005CC5">Child</span><span style="color:#24292E">] </span><span style="color:#D73A49">=</span><span style="color:#24292E"> []</span></span></span>
<span class="line"><span class="line"><span style="color:#24292E">}</span></span></span>
<span class="line"><span class="line"></span></span>
<span class="line"><span class="line"><span style="color:#D73A49">class</span><span style="color:#6F42C1"> Child</span><span style="color:#24292E"> {</span></span></span>
<span class="line"><span class="line"><span style="color:#D73A49">    var</span><span style="color:#24292E"> parent: Parent</span><span style="color:#D73A49">?</span><span style="color:#6A737D">  // 如果这里是强引用</span></span></span>
<span class="line"><span class="line"><span style="color:#24292E">}</span></span></span>
<span class="line"><span class="line"></span></span>
<span class="line"><span class="line"><span style="color:#D73A49">var</span><span style="color:#24292E"> parent </span><span style="color:#D73A49">=</span><span style="color:#005CC5"> Parent</span><span style="color:#24292E">()</span></span></span>
<span class="line"><span class="line"><span style="color:#D73A49">var</span><span style="color:#24292E"> child </span><span style="color:#D73A49">=</span><span style="color:#005CC5"> Child</span><span style="color:#24292E">()</span></span></span>
<span class="line"><span class="line"><span style="color:#24292E">parent.children.</span><span style="color:#005CC5">append</span><span style="color:#24292E">(child)</span></span></span>
<span class="line"><span class="line"><span style="color:#24292E">child.parent </span><span style="color:#D73A49">=</span><span style="color:#24292E"> parent  </span><span style="color:#6A737D">// 如果 parent 是强引用，就会循环引用</span></span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"></div></div><h2 id="如何解决循环引用" tabindex="-1"><a class="header-anchor" href="#如何解决循环引用"><span>如何解决循环引用</span></a></h2>
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


