<template><div><h1 id="简述-arc-自动引用计数-的工作原理" tabindex="-1"><a class="header-anchor" href="#简述-arc-自动引用计数-的工作原理"><span>简述 ARC（自动引用计数）的工作原理</span></a></h1>
<h2 id="核心概念" tabindex="-1"><a class="header-anchor" href="#核心概念"><span>核心概念</span></a></h2>
<p>ARC 是编译器在编译时自动插入内存管理代码（retain/release），开发者无需手动管理对象生命周期。</p>
<h2 id="工作原理" tabindex="-1"><a class="header-anchor" href="#工作原理"><span>工作原理</span></a></h2>
<h3 id="_1-编译时自动插入代码" tabindex="-1"><a class="header-anchor" href="#_1-编译时自动插入代码"><span>1. 编译时自动插入代码</span></a></h3>
<p>ARC 在编译时分析代码，在需要的地方自动插入 <code v-pre>retain</code> 和 <code v-pre>release</code>：</p>
<div class="language-swift line-numbers-mode" data-highlighter="prismjs" data-ext="swift"><pre  class="shiki github-light vp-code" style="background-color:#fff;color:#24292e" v-pre=" language-swift"><code><span class="line"><span class="line"><span style="color:#6A737D">// 你写的代码</span></span></span>
<span class="line"><span class="line"><span style="color:#D73A49">let</span><span style="color:#24292E"> person </span><span style="color:#D73A49">=</span><span style="color:#005CC5"> Person</span><span style="color:#24292E">()</span></span></span>
<span class="line"><span class="line"><span style="color:#D73A49">let</span><span style="color:#24292E"> name </span><span style="color:#D73A49">=</span><span style="color:#24292E"> person.name</span></span></span>
<span class="line"><span class="line"></span></span>
<span class="line"><span class="line"><span style="color:#6A737D">// ARC 编译后实际生成的代码（简化示意）</span></span></span>
<span class="line"><span class="line"><span style="color:#D73A49">let</span><span style="color:#24292E"> person </span><span style="color:#D73A49">=</span><span style="color:#005CC5"> Person</span><span style="color:#24292E">()</span></span></span>
<span class="line"><span class="line"><span style="color:#005CC5">objc_retain</span><span style="color:#24292E">(person)  </span><span style="color:#6A737D">// ARC 自动插入</span></span></span>
<span class="line"><span class="line"><span style="color:#D73A49">let</span><span style="color:#24292E"> name </span><span style="color:#D73A49">=</span><span style="color:#24292E"> person.name</span></span></span>
<span class="line"><span class="line"><span style="color:#005CC5">objc_release</span><span style="color:#24292E">(person)  </span><span style="color:#6A737D">// ARC 自动插入（当 person 不再使用时）</span></span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"></div></div><h3 id="_2-引用计数机制" tabindex="-1"><a class="header-anchor" href="#_2-引用计数机制"><span>2. 引用计数机制</span></a></h3>
<table>
<thead>
<tr>
<th>操作</th>
<th>引用计数变化</th>
<th>说明</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>对象创建</strong></td>
<td>+1</td>
<td>创建对象时自动 retain</td>
</tr>
<tr>
<td><strong>强引用赋值</strong></td>
<td>+1</td>
<td>赋值给强引用变量时 retain</td>
</tr>
<tr>
<td><strong>引用移除</strong></td>
<td>-1</td>
<td>强引用置为 nil 或离开作用域时 release</td>
</tr>
<tr>
<td><strong>计数为 0</strong></td>
<td>释放对象</td>
<td>所有强引用都移除后，对象被释放</td>
</tr>
</tbody>
</table>
<h3 id="_3-编译器如何判断插入位置" tabindex="-1"><a class="header-anchor" href="#_3-编译器如何判断插入位置"><span>3. 编译器如何判断插入位置</span></a></h3>
<table>
<thead>
<tr>
<th>时机</th>
<th>插入的操作</th>
<th>说明</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>对象创建时</strong></td>
<td><code v-pre>retain</code></td>
<td>创建对象后立即增加引用计数</td>
</tr>
<tr>
<td><strong>赋值给强引用时</strong></td>
<td><code v-pre>retain</code></td>
<td>新的强引用指向对象时</td>
</tr>
<tr>
<td><strong>强引用置为 nil 时</strong></td>
<td><code v-pre>release</code></td>
<td>强引用被清空时</td>
</tr>
<tr>
<td><strong>离开作用域时</strong></td>
<td><code v-pre>release</code></td>
<td>变量离开作用域时自动释放</td>
</tr>
</tbody>
</table>
<h2 id="通俗理解" tabindex="-1"><a class="header-anchor" href="#通俗理解"><span>通俗理解</span></a></h2>
<p>就像图书馆借书系统：</p>
<ul>
<li>借书时登记（retain，计数+1）</li>
<li>还书时注销（release，计数-1）</li>
<li>没人借时，书被回收（计数为 0，对象释放）</li>
</ul>
<p>ARC 会自动完成这些登记和注销，你不需要手动写 <code v-pre>retain</code>/<code v-pre>release</code>。</p>
<h3 id="引用计数流程图" tabindex="-1"><a class="header-anchor" href="#引用计数流程图"><span>引用计数流程图</span></a></h3>
<img src="https://www.plantuml.com/plantuml/svg/SoWkIImgAStDuNA0iy0CBgkd7REVxjxrTFtE5niNMWEvUwO-dxBYnRg5pwPkKB1LCBJcAi_8p4bLq7Wsf_FPj0tFPxKytRCBeiXUKo6p62WnOxqcbu82gavjeCRKl1IetgSJbcboPQO16QYc6m2DACb8pKCOyhAzwzcKVJ3NA2WKb-GNSANc5CCC0Ta3bdo-U_dptMkVhftnTCuAi5MPQLmEG0hiHmWD0000" alt="PlantUML Diagram">
<h2 id="实际例子" tabindex="-1"><a class="header-anchor" href="#实际例子"><span>实际例子</span></a></h2>
<div class="language-swift line-numbers-mode" data-highlighter="prismjs" data-ext="swift"><pre  class="shiki github-light vp-code" style="background-color:#fff;color:#24292e" v-pre=" language-swift"><code><span class="line"><span class="line"><span style="color:#D73A49">class</span><span style="color:#6F42C1"> Person</span><span style="color:#24292E"> {</span></span></span>
<span class="line"><span class="line"><span style="color:#D73A49">    var</span><span style="color:#24292E"> name: </span><span style="color:#005CC5">String</span></span></span>
<span class="line"><span class="line"><span style="color:#D73A49">    init</span><span style="color:#24292E">(</span><span style="color:#6F42C1">name</span><span style="color:#24292E">: </span><span style="color:#005CC5">String</span><span style="color:#24292E">) {</span></span></span>
<span class="line"><span class="line"><span style="color:#005CC5">        self</span><span style="color:#24292E">.name </span><span style="color:#D73A49">=</span><span style="color:#24292E"> name</span></span></span>
<span class="line"><span class="line"><span style="color:#24292E">    }</span></span></span>
<span class="line"><span class="line"><span style="color:#24292E">}</span></span></span>
<span class="line"><span class="line"></span></span>
<span class="line"><span class="line"><span style="color:#D73A49">func</span><span style="color:#6F42C1"> example</span><span style="color:#24292E">() {</span></span></span>
<span class="line"><span class="line"><span style="color:#D73A49">    let</span><span style="color:#24292E"> person1 </span><span style="color:#D73A49">=</span><span style="color:#005CC5"> Person</span><span style="color:#24292E">(</span><span style="color:#005CC5">name</span><span style="color:#24292E">: </span><span style="color:#032F62">"张三"</span><span style="color:#24292E">)  </span><span style="color:#6A737D">// 引用计数 = 1</span></span></span>
<span class="line"><span class="line"><span style="color:#D73A49">    let</span><span style="color:#24292E"> person2 </span><span style="color:#D73A49">=</span><span style="color:#24292E"> person1              </span><span style="color:#6A737D">// 引用计数 = 2（person2 也引用了）</span></span></span>
<span class="line"><span class="line"><span style="color:#24292E">    </span></span></span>
<span class="line"><span class="line"><span style="color:#6A737D">    // person1 离开作用域，引用计数 = 1</span></span></span>
<span class="line"><span class="line"><span style="color:#6A737D">    // person2 离开作用域，引用计数 = 0，对象被释放</span></span></span>
<span class="line"><span class="line"><span style="color:#24292E">}</span></span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"></div></div><h2 id="关键点" tabindex="-1"><a class="header-anchor" href="#关键点"><span>关键点</span></a></h2>
<table>
<thead>
<tr>
<th>特性</th>
<th>说明</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>编译时特性</strong></td>
<td>在编译阶段插入代码，运行时没有额外开销</td>
</tr>
<tr>
<td><strong>只管理对象</strong></td>
<td>值类型（struct、enum）不受 ARC 管理</td>
</tr>
<tr>
<td><strong>循环引用</strong></td>
<td>需要手动处理，使用 <code v-pre>weak</code> 或 <code v-pre>unowned</code> 打破循环</td>
</tr>
</tbody>
</table>
<h2 id="arc-vs-mrc-手动管理" tabindex="-1"><a class="header-anchor" href="#arc-vs-mrc-手动管理"><span>ARC vs MRC（手动管理）</span></a></h2>
<table>
<thead>
<tr>
<th>方面</th>
<th>MRC（手动管理）</th>
<th>ARC（自动管理）</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>代码</strong></td>
<td>需要手动写 <code v-pre>retain</code>/<code v-pre>release</code></td>
<td>编译器自动插入</td>
</tr>
<tr>
<td><strong>示例</strong></td>
<td><code v-pre>[person retain]; [person release];</code></td>
<td><code v-pre>let person = Person()</code></td>
</tr>
<tr>
<td><strong>错误率</strong></td>
<td>容易出错（忘记 release 导致泄漏）</td>
<td>减少内存管理错误</td>
</tr>
<tr>
<td><strong>性能</strong></td>
<td>手动控制</td>
<td>编译时优化，性能相同</td>
</tr>
</tbody>
</table>
</div></template>


