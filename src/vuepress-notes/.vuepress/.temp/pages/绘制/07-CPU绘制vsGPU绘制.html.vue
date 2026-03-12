<template><div><h1 id="cpu-绘制-vs-gpu-绘制-本质区别" tabindex="-1"><a class="header-anchor" href="#cpu-绘制-vs-gpu-绘制-本质区别"><span>CPU 绘制 vs GPU 绘制：本质区别</span></a></h1>
<h2 id="核心理解" tabindex="-1"><a class="header-anchor" href="#核心理解"><span>核心理解</span></a></h2>
<p><strong>关键点</strong>：CPU 不能直接&quot;画&quot;到屏幕上，它只是在内存中生成位图数据。</p>
<table>
<thead>
<tr>
<th>概念</th>
<th>准确含义</th>
<th>位置</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>CPU &quot;绘制&quot;</strong></td>
<td>在内存中生成位图数据</td>
<td>CPU 内存（RAM）</td>
</tr>
<tr>
<td><strong>GPU 绘制</strong></td>
<td>把位图数据渲染到屏幕</td>
<td>GPU 显存 → FrameBuffer → 屏幕</td>
</tr>
</tbody>
</table>
<h2 id="cpu-绘制-的真正含义" tabindex="-1"><a class="header-anchor" href="#cpu-绘制-的真正含义"><span>CPU &quot;绘制&quot;的真正含义</span></a></h2>
<p>当我们说&quot;CPU 绘制&quot;时，实际上是指：</p>
<ol>
<li><strong>在内存中创建位图</strong>：系统在 CPU 内存中分配一块区域（Backing Store）</li>
<li><strong>计算像素数据</strong>：CPU 执行代码，计算每个像素的颜色值</li>
<li><strong>写入内存</strong>：将像素数据写入内存数组</li>
<li><strong>存储位图</strong>：位图数据存入 <code v-pre>layer.contents</code></li>
</ol>
<p><strong>重要</strong>：此时屏幕还没有任何变化，只是内存中有了图像数据。</p>
<h2 id="gpu-绘制的真正含义" tabindex="-1"><a class="header-anchor" href="#gpu-绘制的真正含义"><span>GPU 绘制的真正含义</span></a></h2>
<p>GPU 绘制才是真正显示到屏幕的过程：</p>
<ol>
<li><strong>位图上传</strong>：位图数据从 CPU 内存复制到 GPU 显存（变成纹理）</li>
<li><strong>GPU 渲染管线</strong>：GPU 执行顶点着色、片段着色、光栅化等操作</li>
<li><strong>写入 FrameBuffer</strong>：渲染结果写入帧缓冲区</li>
<li><strong>屏幕显示</strong>：屏幕硬件读取 FrameBuffer，显示到屏幕</li>
</ol>
<h2 id="完整流程对比" tabindex="-1"><a class="header-anchor" href="#完整流程对比"><span>完整流程对比</span></a></h2>
<h3 id="示例-drawrect-的完整流程" tabindex="-1"><a class="header-anchor" href="#示例-drawrect-的完整流程"><span>示例：drawRect 的完整流程</span></a></h3>
<div class="language-swift line-numbers-mode" data-highlighter="prismjs" data-ext="swift"><pre v-pre><code class="language-swift"><span class="line"><span class="token keyword">class</span> <span class="token class-name">RedView</span><span class="token punctuation">:</span> <span class="token class-name">UIView</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">override</span> <span class="token keyword">func</span> <span class="token function-definition function">draw</span><span class="token punctuation">(</span><span class="token omit keyword">_</span> rect<span class="token punctuation">:</span> <span class="token class-name">CGRect</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token comment">// 步骤 1：CPU 在内存中生成位图</span></span>
<span class="line">        <span class="token keyword">let</span> context <span class="token operator">=</span> <span class="token class-name">UIGraphicsGetCurrentContext</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line">        context<span class="token operator">?</span><span class="token punctuation">.</span><span class="token function">setFillColor</span><span class="token punctuation">(</span><span class="token class-name">UIColor</span><span class="token punctuation">.</span>red<span class="token punctuation">.</span>cgColor<span class="token punctuation">)</span></span>
<span class="line">        context<span class="token operator">?</span><span class="token punctuation">.</span><span class="token function">fill</span><span class="token punctuation">(</span>rect<span class="token punctuation">)</span></span>
<span class="line">        <span class="token comment">// 此时：内存中有红色位图，屏幕还是空白</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><table>
<thead>
<tr>
<th>时间</th>
<th>操作</th>
<th>位置</th>
<th>屏幕状态</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>T0</strong></td>
<td>代码执行，调用 <code v-pre>drawRect</code></td>
<td>CPU</td>
<td>空白</td>
</tr>
<tr>
<td><strong>T1</strong></td>
<td>CPU 在内存中生成位图</td>
<td>CPU 内存</td>
<td>空白</td>
</tr>
<tr>
<td><strong>T2</strong></td>
<td>位图存入 <code v-pre>layer.contents</code></td>
<td>CPU 内存</td>
<td>空白</td>
</tr>
<tr>
<td><strong>T3</strong></td>
<td>提交到 Render Server</td>
<td>进程间通信</td>
<td>空白</td>
</tr>
<tr>
<td><strong>T4</strong></td>
<td>位图上传到 GPU 显存</td>
<td>GPU 显存</td>
<td>空白</td>
</tr>
<tr>
<td><strong>T5</strong></td>
<td>GPU 渲染到 FrameBuffer</td>
<td>GPU</td>
<td>空白</td>
</tr>
<tr>
<td><strong>T6</strong></td>
<td>屏幕显示</td>
<td>屏幕硬件</td>
<td>✅ 红色方块</td>
</tr>
</tbody>
</table>
<h2 id="技术层面的区别" tabindex="-1"><a class="header-anchor" href="#技术层面的区别"><span>技术层面的区别</span></a></h2>
<h3 id="cpu-绘制-的本质" tabindex="-1"><a class="header-anchor" href="#cpu-绘制-的本质"><span>CPU &quot;绘制&quot;的本质</span></a></h3>
<p><strong>CPU 绘制 = 在内存中生成位图数据</strong></p>
<table>
<thead>
<tr>
<th>操作</th>
<th>说明</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>创建位图内存</strong></td>
<td>在 CPU 内存中分配 Backing Store（宽 × 高 × 4 字节）</td>
</tr>
<tr>
<td><strong>计算像素颜色</strong></td>
<td>CPU 执行代码，计算每个像素的 RGBA 值</td>
</tr>
<tr>
<td><strong>写入内存数组</strong></td>
<td>将像素数据写入内存的二维数组</td>
</tr>
<tr>
<td><strong>存储位图</strong></td>
<td>位图数据存入 <code v-pre>layer.contents</code></td>
</tr>
</tbody>
</table>
<p><strong>关键</strong>：所有操作都在 CPU 内存中进行，屏幕没有任何变化。</p>
<h3 id="gpu-绘制的本质" tabindex="-1"><a class="header-anchor" href="#gpu-绘制的本质"><span>GPU 绘制的本质</span></a></h3>
<p><strong>GPU 绘制 = 把位图数据渲染到屏幕</strong></p>
<table>
<thead>
<tr>
<th>操作</th>
<th>说明</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>读取位图数据</strong></td>
<td>从 CPU 内存读取位图数据</td>
</tr>
<tr>
<td><strong>上传到 GPU</strong></td>
<td>位图数据复制到 GPU 显存（变成纹理）</td>
</tr>
<tr>
<td><strong>执行渲染管线</strong></td>
<td>GPU 执行顶点着色、片段着色、光栅化等</td>
</tr>
<tr>
<td><strong>写入 FrameBuffer</strong></td>
<td>渲染结果写入帧缓冲区</td>
</tr>
<tr>
<td><strong>屏幕显示</strong></td>
<td>屏幕硬件读取 FrameBuffer，显示到屏幕</td>
</tr>
</tbody>
</table>
<p><strong>关键</strong>：只有经过 GPU，数据才能显示到屏幕上。</p>
<h2 id="为什么说-cpu-绘制" tabindex="-1"><a class="header-anchor" href="#为什么说-cpu-绘制"><span>为什么说&quot;CPU 绘制&quot;？</span></a></h2>
<p>这是习惯说法，更准确的表述是：</p>
<table>
<thead>
<tr>
<th>习惯说法</th>
<th>准确说法</th>
</tr>
</thead>
<tbody>
<tr>
<td>CPU 绘制</td>
<td>CPU 生成位图数据</td>
</tr>
<tr>
<td>GPU 绘制</td>
<td>GPU 渲染位图到屏幕</td>
</tr>
</tbody>
</table>
<h2 id="常见场景" tabindex="-1"><a class="header-anchor" href="#常见场景"><span>常见场景</span></a></h2>
<h3 id="场景-1-drawrect-cpu-绘制" tabindex="-1"><a class="header-anchor" href="#场景-1-drawrect-cpu-绘制"><span>场景 1：drawRect（CPU 绘制）</span></a></h3>
<div class="language-swift line-numbers-mode" data-highlighter="prismjs" data-ext="swift"><pre v-pre><code class="language-swift"><span class="line"><span class="token keyword">class</span> <span class="token class-name">CustomView</span><span class="token punctuation">:</span> <span class="token class-name">UIView</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">override</span> <span class="token keyword">func</span> <span class="token function-definition function">draw</span><span class="token punctuation">(</span><span class="token omit keyword">_</span> rect<span class="token punctuation">:</span> <span class="token class-name">CGRect</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token comment">// CPU 在内存中生成位图</span></span>
<span class="line">        <span class="token keyword">let</span> context <span class="token operator">=</span> <span class="token class-name">UIGraphicsGetCurrentContext</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line">        context<span class="token operator">?</span><span class="token punctuation">.</span><span class="token function">setFillColor</span><span class="token punctuation">(</span><span class="token class-name">UIColor</span><span class="token punctuation">.</span>blue<span class="token punctuation">.</span>cgColor<span class="token punctuation">)</span></span>
<span class="line">        context<span class="token operator">?</span><span class="token punctuation">.</span><span class="token function">fillEllipse</span><span class="token punctuation">(</span><span class="token keyword">in</span><span class="token punctuation">:</span> rect<span class="token punctuation">)</span></span>
<span class="line">        <span class="token comment">// 位图存入 layer.contents</span></span>
<span class="line">        <span class="token comment">// 后续由 GPU 渲染到屏幕</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="场景-2-uiimageview-不需要-cpu-绘制" tabindex="-1"><a class="header-anchor" href="#场景-2-uiimageview-不需要-cpu-绘制"><span>场景 2：UIImageView（不需要 CPU 绘制）</span></a></h3>
<div class="language-swift line-numbers-mode" data-highlighter="prismjs" data-ext="swift"><pre v-pre><code class="language-swift"><span class="line"><span class="token keyword">let</span> imageView <span class="token operator">=</span> <span class="token class-name">UIImageView</span><span class="token punctuation">(</span>image<span class="token punctuation">:</span> <span class="token class-name">UIImage</span><span class="token punctuation">(</span>named<span class="token punctuation">:</span> <span class="token string-literal"><span class="token string">"icon"</span></span><span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line"><span class="token comment">// 图片解码成位图（CPU 操作）</span></span>
<span class="line"><span class="token comment">// 位图存入 layer.contents</span></span>
<span class="line"><span class="token comment">// GPU 直接渲染位图，不需要 drawRect</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="场景-3-uilabel-文字光栅化" tabindex="-1"><a class="header-anchor" href="#场景-3-uilabel-文字光栅化"><span>场景 3：UILabel（文字光栅化）</span></a></h3>
<div class="language-swift line-numbers-mode" data-highlighter="prismjs" data-ext="swift"><pre v-pre><code class="language-swift"><span class="line"><span class="token keyword">let</span> label <span class="token operator">=</span> <span class="token class-name">UILabel</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line">label<span class="token punctuation">.</span>text <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"Hello"</span></span></span>
<span class="line"><span class="token comment">// Core Text 排版（CPU 操作）</span></span>
<span class="line"><span class="token comment">// 文字光栅化成位图（CPU 操作）</span></span>
<span class="line"><span class="token comment">// 位图存入 layer.contents</span></span>
<span class="line"><span class="token comment">// GPU 直接渲染位图，不需要 drawRect</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="总结" tabindex="-1"><a class="header-anchor" href="#总结"><span>总结</span></a></h2>
<table>
<thead>
<tr>
<th>要点</th>
<th>说明</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>CPU &quot;绘制&quot;</strong></td>
<td>在内存中生成位图数据，不直接显示到屏幕</td>
</tr>
<tr>
<td><strong>GPU 绘制</strong></td>
<td>把位图数据渲染到屏幕，用户才能看到</td>
</tr>
<tr>
<td><strong>CPU 的作用</strong></td>
<td>准备数据（生成位图）</td>
</tr>
<tr>
<td><strong>GPU 的作用</strong></td>
<td>显示数据（渲染到屏幕）</td>
</tr>
<tr>
<td><strong>关键理解</strong></td>
<td>CPU 确实没有直接绘制到屏幕的能力，它只是准备数据；GPU 才是真正把数据显示到屏幕的硬件</td>
</tr>
</tbody>
</table>
</div></template>


