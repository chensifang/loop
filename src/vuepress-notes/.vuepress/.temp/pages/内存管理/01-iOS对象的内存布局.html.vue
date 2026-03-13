<template><div><h1 id="ios-对象的内存布局" tabindex="-1"><a class="header-anchor" href="#ios-对象的内存布局"><span>iOS 对象的内存布局</span></a></h1>
<h2 id="对象内存布局结构" tabindex="-1"><a class="header-anchor" href="#对象内存布局结构"><span>对象内存布局结构</span></a></h2>
<div class="language-objective-c line-numbers-mode" data-highlighter="prismjs" data-ext="objective-c"><pre  class="shiki github-light vp-code" style="background-color:#fff;color:#24292e" v-pre=" language-objective-c"><code><span class="line"><span class="line"><span style="color:#D73A49">@interface</span><span style="color:#6F42C1"> Animal</span><span style="color:#24292E"> : </span><span style="color:#6F42C1">NSObject</span><span style="color:#24292E"> {</span></span></span>
<span class="line"><span class="line"><span style="color:#005CC5">    NSString</span><span style="color:#D73A49"> *</span><span style="color:#24292E">_name;</span></span></span>
<span class="line"><span class="line"><span style="color:#24292E">}</span></span></span>
<span class="line"><span class="line"><span style="color:#D73A49">@end</span></span></span>
<span class="line"><span class="line"></span></span>
<span class="line"><span class="line"><span style="color:#D73A49">@interface</span><span style="color:#6F42C1"> Dog</span><span style="color:#24292E"> : </span><span style="color:#6F42C1">Animal</span><span style="color:#24292E"> {</span></span></span>
<span class="line"><span class="line"><span style="color:#D73A49">    int</span><span style="color:#24292E"> _age;</span></span></span>
<span class="line"><span class="line"><span style="color:#24292E">}</span></span></span>
<span class="line"><span class="line"><span style="color:#D73A49">@end</span></span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"></div></div><div id="memory-container"></div>
<h2 id="内存布局说明" tabindex="-1"><a class="header-anchor" href="#内存布局说明"><span>内存布局说明</span></a></h2>
<table>
<thead>
<tr>
<th>位置</th>
<th>内容</th>
<th>大小</th>
<th>说明</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>偏移 0</strong></td>
<td><code v-pre>isa</code> 指针</td>
<td>8 字节</td>
<td>指向类对象，所有对象都有，偏移量固定为 0</td>
</tr>
<tr>
<td><strong>偏移 8</strong></td>
<td><code v-pre>_name</code> (NSString *)</td>
<td>8 字节</td>
<td>来自 Animal 父类的实例变量</td>
</tr>
<tr>
<td><strong>偏移 16</strong></td>
<td><code v-pre>_age</code> (int)</td>
<td>4 字节</td>
<td>来自 Dog 子类的实例变量</td>
</tr>
<tr>
<td><strong>偏移 20</strong></td>
<td>对齐填充</td>
<td>4 字节</td>
<td>使对象总大小为 24 字节（8 的倍数）</td>
</tr>
</tbody>
</table>
<h2 id="面试题-一个-nsobject-对象占用多少字节" tabindex="-1"><a class="header-anchor" href="#面试题-一个-nsobject-对象占用多少字节"><span>面试题：一个 NSObject 对象占用多少字节？</span></a></h2>
<p><strong>注意</strong>：这个问题特指 <code v-pre>NSObject</code> 这个基类对象，<strong>不是所有继承自 NSObject 的对象</strong>。</p>
<h3 id="答案" tabindex="-1"><a class="header-anchor" href="#答案"><span>答案</span></a></h3>
<p>需要区分两个概念：</p>
<table>
<thead>
<tr>
<th>概念</th>
<th>API</th>
<th>NSObject 的结果</th>
<th>说明</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>对象实例大小</strong></td>
<td><code v-pre>class_getInstanceSize</code></td>
<td>8 字节</td>
<td>对象实例变量实际占用的内存大小（只有 isa 指针）</td>
</tr>
<tr>
<td><strong>系统分配大小</strong></td>
<td><code v-pre>malloc_size</code></td>
<td>16 字节</td>
<td>系统实际分配的内存大小（最小分配单位）</td>
</tr>
</tbody>
</table>
<h3 id="代码示例" tabindex="-1"><a class="header-anchor" href="#代码示例"><span>代码示例</span></a></h3>
<div class="language-objective-c line-numbers-mode" data-highlighter="prismjs" data-ext="objective-c"><pre  class="shiki github-light vp-code" style="background-color:#fff;color:#24292e" v-pre=" language-objective-c"><code><span class="line"><span class="line"><span style="color:#005CC5">NSObject</span><span style="color:#D73A49"> *</span><span style="color:#24292E">obj </span><span style="color:#D73A49">=</span><span style="color:#24292E"> [[</span><span style="color:#005CC5">NSObject</span><span style="color:#005CC5"> alloc</span><span style="color:#24292E">] </span><span style="color:#005CC5">init</span><span style="color:#24292E">];</span></span></span>
<span class="line"><span class="line"><span style="color:#D73A49">size_t</span><span style="color:#24292E"> instanceSize </span><span style="color:#D73A49">=</span><span style="color:#6F42C1"> class_getInstanceSize</span><span style="color:#24292E">([</span><span style="color:#005CC5">NSObject</span><span style="color:#005CC5"> class</span><span style="color:#24292E">]);</span></span></span>
<span class="line"><span class="line"><span style="color:#D73A49">size_t</span><span style="color:#24292E"> mallocSize </span><span style="color:#D73A49">=</span><span style="color:#6F42C1"> malloc_size</span><span style="color:#24292E">((__bridge </span><span style="color:#D73A49">const</span><span style="color:#D73A49"> void</span><span style="color:#D73A49"> *</span><span style="color:#24292E">)</span><span style="color:#E36209">obj</span><span style="color:#24292E">);</span></span></span>
<span class="line"><span class="line"><span style="color:#005CC5">NSLog</span><span style="color:#24292E">(</span><span style="color:#032F62">@"实例大小: </span><span style="color:#005CC5">%zu</span><span style="color:#032F62">, 分配大小: </span><span style="color:#005CC5">%zu</span><span style="color:#032F62">"</span><span style="color:#24292E">, instanceSize, mallocSize);</span></span></span>
<span class="line"><span class="line"><span style="color:#6A737D">// 输出：实例大小: 8, 分配大小: 16</span></span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"></div></div><h3 id="重要说明" tabindex="-1"><a class="header-anchor" href="#重要说明"><span>重要说明</span></a></h3>
<table>
<thead>
<tr>
<th>对象类型</th>
<th>实例大小</th>
<th>系统分配大小</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>NSObject</strong></td>
<td>8 字节</td>
<td>16 字节</td>
</tr>
<tr>
<td><strong>有实例变量的对象</strong>（如 Dog）</td>
<td>8 + 实例变量大小</td>
<td>≥ 实例大小（取决于分配器）</td>
</tr>
</tbody>
</table>
<div class="hint-container info">
<p class="hint-container-title">常见误解</p>
<p>认为所有继承自 NSObject 的对象都是 16 字节。</p>
</div>
<div class="hint-container info">
<p class="hint-container-title">正确理解</p>
<p>只有 NSObject 本身是 8 字节（实例）/ 16 字节（分配）。有实例变量的对象大小会根据实例变量变化。</p>
</div>
</div></template>


