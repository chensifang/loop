<template><div><h1 id="t2-display-阶段-生成-bitmap" tabindex="-1"><a class="header-anchor" href="#t2-display-阶段-生成-bitmap"><span>T2：Display 阶段（生成 bitmap）</span></a></h1>
<table>
<thead>
<tr>
<th>项目</th>
<th>内容</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>时间点</strong></td>
<td>Layout 阶段之后，RunLoop 进入休眠前</td>
</tr>
<tr>
<td><strong>触发时机</strong></td>
<td>RunLoop 的 <code v-pre>kCFRunLoopBeforeWaiting</code> 阶段，或者手动调用 <code v-pre>displayIfNeeded()</code> 时</td>
</tr>
<tr>
<td><strong>这个阶段发生了什么</strong></td>
<td>1. 检查哪些 Layer 需要 Display（系统检查所有被标记为&quot;需要显示&quot;的 Layer）<br>2. CALayer 的 display 方法被调用（对于被标记的 Layer，系统会调用 <code v-pre>display(_:)</code> 方法，这个方法负责生成 bitmap 并存入 <code v-pre>contents</code>）</td>
</tr>
</tbody>
</table>
<h2 id="calayer-的-display-方法流程" tabindex="-1"><a class="header-anchor" href="#calayer-的-display-方法流程"><span>CALayer 的 display 方法流程</span></a></h2>
<p><code v-pre>[CALayer display]</code> 方法被调用时，会根据 delegate 的实现情况，走不同的绘制路径：</p>
<Mermaid code="eJxlU11P01AYvudXvD9AtvhxtSgEOhjjOyDeNFx07GQuQkdKFQkxWRQYE8YgIzocCBhkM0ZQUMCOjT/Tc9r9C0/P225d3MXSj/f5eJ/nNKEp88/habgD+K9HprdpWt4IgdQzrCwRDeLJhflZZQnsL9/t8inN70xDZ2cX9C7HySxJKDoBVjyn26e0kKPG7uOYFuxyIQIfgu43gln89XKsMy8oJJlly/bxJnhMgXYgvyLatMBJAhBedszld+z0Kmqy7AZ9XxGa9p8Nmr6FmZSqE1VfcEXDfr0+mRXr1onRIslvm/WS9WnFrOVoqY5SAsK5BaRfxhAQaN4Y1jfD2qvhZB+yjoZlq1pgB4chcAiNEztzCRNEjXPcJNFeeTv0e+MdrSg8nciyu1D12L66BGl8CqxqkXtiB8dm9apbrNjI5OjanmmsQVxTFifIjM4V1z9g5PwJxpZUJSeD13rIl3vEn8OAfD8AdL1Eqwb0KjMvkmoCJvWURgBzoGur9EcRTQ8IRFR+EAAsC201Co6zENg/31m7lZYfBEUFaFB+yEE3F+ywYO0esvVtZAcpEp1TEgRHB8XokPwoANigW3vAKxKeQCypzynzOD/UDLF9Ny/IYTdIvgDdr9DrC7afdfY5+4sZ0tO3MBUVBp4lyWIg6VyJNzxJPE72Wd2+yzRPki/FYX+KI7JV+s22vpq1Ox4BKjVBbpLoeeR/z4LJ8zzqlb+fZUfX9DZPf31m6TIajvGCElrqpRqXUrMpDYIQS2nO0QpyMU0lGvob9VsbkyP8ACELFmBfn9P6Skgwmjc50yjzSvxt3wPchm1mzOqJdZC2sxfoXjB7Vsfd74GebdLVSiOdZ8WtIPt4hBEjYKxt3fHm3T+gy+I6"></Mermaid><p><strong>关键点说明</strong>：</p>
<ol>
<li>
<p><strong>第一个判断</strong>：<code v-pre>displayLayer:</code> 方法</p>
<ul>
<li>如果实现了 → 走完全自定义/异步绘制入口（路径 A）</li>
<li>系统完全放手，不创建上下文，不调用 drawRect</li>
<li>开发者必须手动给 <code v-pre>layer.contents</code> 赋值</li>
<li>如果没实现 → 走系统接管流程（路径 B）</li>
</ul>
</li>
<li>
<p><strong>系统接管流程中的关键判定</strong>：是否需要 CPU 绘图？</p>
<ul>
<li>系统会先检查：是否覆写了 <code v-pre>drawRect:</code> 或实现了 <code v-pre>drawLayer:inContext:</code></li>
<li>如果不需要 CPU 绘图（极速路径）：
<ul>
<li>不创建 Backing Store，不产生位图内存</li>
<li>直接结束，GPU 根据 <code v-pre>backgroundColor</code> 等属性直接着色</li>
<li>这是 90% 普通 UIView 的状态，内存开销极低</li>
</ul>
</li>
<li>如果需要 CPU 绘图（降级路径）：
<ul>
<li>创建 Backing Store（开辟内存：宽 × 高 × 4 字节）</li>
<li>调用绘图链条（<code v-pre>drawLayer:inContext:</code> 或 <code v-pre>drawRect:</code>）</li>
<li>生成位图，存入 <code v-pre>layer.contents</code></li>
</ul>
</li>
</ul>
</li>
<li>
<p><strong>drawRect: 的调用条件（唯一路径）</strong>：</p>
<ul>
<li>delegate 没有实现 <code v-pre>displayLayer:</code>（否则走异步绘制）</li>
<li>系统判定需要 CPU 绘图（覆写了 <code v-pre>drawRect:</code> 或实现了 <code v-pre>drawLayer:inContext:</code>）</li>
<li>delegate 没有实现 <code v-pre>drawLayer:inContext:</code>（否则走 drawLayer:inContext:）</li>
<li>delegate 是 UIView（否则不会调用 drawRect:）</li>
<li>UIView 覆写了 <code v-pre>drawRect:</code> 方法</li>
<li>结论：只有同时满足以上所有条件，才会调用 <code v-pre>drawRect:</code></li>
</ul>
</li>
</ol>
<h2 id="三种不同的-display-路径" tabindex="-1"><a class="header-anchor" href="#三种不同的-display-路径"><span>三种不同的 Display 路径</span></a></h2>
<table>
<thead>
<tr>
<th>路径</th>
<th>Layer</th>
<th>显示方式</th>
<th>说明</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>路径 A</strong></td>
<td>UIButton 自身的 Layer</td>
<td>GPU 直接渲染</td>
<td>只设置了 <code v-pre>backgroundColor</code>、<code v-pre>cornerRadius</code> 等属性，不生成 bitmap，<code v-pre>contents</code> 保持为 nil</td>
</tr>
<tr>
<td><strong>路径 B</strong></td>
<td>UIImageView 的 Layer</td>
<td>图片解码成 bitmap</td>
<td>图片文件（PNG/JPEG）需要解码成未压缩的 bitmap，解码后的 bitmap 赋值给 <code v-pre>layer.contents</code></td>
</tr>
<tr>
<td><strong>路径 C</strong></td>
<td>UILabel 的 Layer</td>
<td>文字光栅化成 bitmap</td>
<td>Core Text 根据字体、字号、行距等属性进行排版，排版结果光栅化成 bitmap，bitmap 存入 <code v-pre>layer.contents</code></td>
</tr>
</tbody>
</table>
<h2 id="光栅化是什么" tabindex="-1"><a class="header-anchor" href="#光栅化是什么"><span>光栅化是什么？</span></a></h2>
<p><strong>光栅化（Rasterization）</strong>：将矢量图形转换成位图（bitmap）的过程。</p>
<table>
<thead>
<tr>
<th>类型</th>
<th>定义</th>
<th>优点</th>
<th>缺点</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>矢量图形</strong></td>
<td>用数学公式描述的图形（如文字轮廓、Bezier 曲线）</td>
<td>可以无限放大不失真</td>
<td>GPU 无法直接渲染，需要先转换成像素</td>
</tr>
<tr>
<td><strong>位图（bitmap）</strong></td>
<td>由像素点组成的图像</td>
<td>GPU 可以直接渲染</td>
<td>放大后会模糊</td>
</tr>
</tbody>
</table>
<p><strong>在 UILabel 中的光栅化过程</strong>：</p>
<table>
<thead>
<tr>
<th>阶段</th>
<th>过程</th>
<th>说明</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>1. Core Text 排版</strong></td>
<td>矢量阶段</td>
<td>根据字体文件（TTF/OTF）中的轮廓数据，计算出文字的矢量轮廓；轮廓是数学曲线，不是像素</td>
</tr>
<tr>
<td><strong>2. 光栅化</strong></td>
<td>矢量 → 位图</td>
<td>将矢量轮廓&quot;填充&quot;成像素点；根据 Label 的 bounds 大小，创建一个像素网格；判断每个像素点是否在文字轮廓内；如果在轮廓内，就填充颜色（通常是黑色）；如果在轮廓边缘，可能做抗锯齿处理（半透明像素）；最终得到一个 bitmap（像素矩阵）</td>
</tr>
<tr>
<td><strong>3. 存入 contents</strong></td>
<td>存储位图</td>
<td>光栅化后的 bitmap 存入 <code v-pre>layer.contents</code>；GPU 可以直接读取这个 bitmap 进行渲染</td>
</tr>
</tbody>
</table>
<h2 id="位图和纹理的关系" tabindex="-1"><a class="header-anchor" href="#位图和纹理的关系"><span>位图和纹理的关系</span></a></h2>
<table>
<thead>
<tr>
<th>对比项</th>
<th>位图（Bitmap）</th>
<th>纹理（Texture）</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>定义</strong></td>
<td>由像素点组成的图像数据</td>
<td>GPU 内存中的图像数据</td>
</tr>
<tr>
<td><strong>存储位置</strong></td>
<td>CPU 内存（<code v-pre>layer.contents</code> 存储的就是位图）</td>
<td>GPU 显存</td>
</tr>
<tr>
<td><strong>存储格式</strong></td>
<td>二维数组，每个元素是一个像素的颜色值（RGBA）</td>
<td>GPU 可以直接读取和渲染的格式</td>
</tr>
<tr>
<td><strong>大小计算</strong></td>
<td>宽 × 高 × 4 字节（每个像素占用 4 字节 RGBA）</td>
<td>与位图相同</td>
</tr>
<tr>
<td><strong>本质</strong></td>
<td>图像数据本身</td>
<td>位图上传到 GPU 内存后，就变成了纹理</td>
</tr>
<tr>
<td><strong>转换过程</strong></td>
<td>CPU 内存（位图） → 上传到 GPU → GPU 内存（纹理） → GPU 渲染</td>
<td>-</td>
</tr>
</tbody>
</table>
<p><strong>在 iOS 绘制流程中的位置</strong>：</p>
<table>
<thead>
<tr>
<th>阶段</th>
<th>操作</th>
<th>说明</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>t2 阶段（Display）</strong></td>
<td>生成位图</td>
<td>存入 <code v-pre>layer.contents</code>（CPU 内存）；UILabel：文字光栅化成位图；UIImageView：图片解码成位图</td>
</tr>
<tr>
<td><strong>t3 阶段（Commit）</strong></td>
<td>提交数据</td>
<td>位图数据随 Layer 信息一起提交到 Render Server</td>
</tr>
<tr>
<td><strong>t4 阶段（Render Server）</strong></td>
<td>位图上传</td>
<td>位图上传到 GPU 内存，变成纹理</td>
</tr>
<tr>
<td><strong>t5 阶段（GPU 渲染）</strong></td>
<td>纹理采样</td>
<td>GPU 从纹理中采样像素，进行渲染</td>
</tr>
</tbody>
</table>
<h2 id="异步绘制实现示例" tabindex="-1"><a class="header-anchor" href="#异步绘制实现示例"><span>异步绘制实现示例</span></a></h2>
<p>如果 delegate 实现了 <code v-pre>displayLayer:</code> 方法，可以自定义异步绘制逻辑：</p>
<div class="language-objectivec line-numbers-mode" data-highlighter="prismjs" data-ext="objectivec"><pre v-pre><code class="language-objectivec"><span class="line"><span class="token comment">// 自定义 CALayer，实现异步绘制</span></span>
<span class="line"><span class="token keyword">@interface</span> AsyncLayer <span class="token punctuation">:</span> CALayer</span>
<span class="line"><span class="token keyword">@property</span> <span class="token punctuation">(</span>atomic<span class="token punctuation">,</span> assign<span class="token punctuation">)</span> BOOL isDrawing<span class="token punctuation">;</span>  <span class="token comment">// 绘制状态标记</span></span>
<span class="line"><span class="token keyword">@end</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">@implementation</span> AsyncLayer</span>
<span class="line"></span>
<span class="line"><span class="token operator">-</span> <span class="token punctuation">(</span><span class="token keyword">void</span><span class="token punctuation">)</span>setNeedsDisplay <span class="token punctuation">{</span></span>
<span class="line">    <span class="token comment">// 收到新的绘制请求时，取消正在绘制的线程</span></span>
<span class="line">    <span class="token keyword">self</span><span class="token punctuation">.</span>isDrawing <span class="token operator">=</span> NO<span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">[</span><span class="token keyword">super</span> setNeedsDisplay<span class="token punctuation">]</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token operator">-</span> <span class="token punctuation">(</span><span class="token keyword">void</span><span class="token punctuation">)</span>display <span class="token punctuation">{</span></span>
<span class="line">    <span class="token comment">// 判断 delegate 是否实现了 displayLayer: 方法</span></span>
<span class="line">    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token keyword">self</span><span class="token punctuation">.</span>delegate respondsToSelector<span class="token punctuation">:</span><span class="token keyword">@selector</span><span class="token punctuation">(</span>displayLayer<span class="token punctuation">:</span><span class="token punctuation">)</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token comment">// ✅ 走异步绘制入口</span></span>
<span class="line">        <span class="token punctuation">[</span><span class="token keyword">self</span> asyncDraw<span class="token punctuation">]</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token comment">// ❌ 走系统绘制流程</span></span>
<span class="line">        <span class="token punctuation">[</span><span class="token keyword">super</span> display<span class="token punctuation">]</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token operator">-</span> <span class="token punctuation">(</span><span class="token keyword">void</span><span class="token punctuation">)</span>asyncDraw <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">self</span><span class="token punctuation">.</span>isDrawing <span class="token operator">=</span> YES<span class="token punctuation">;</span></span>
<span class="line">    </span>
<span class="line">    <span class="token comment">// 在后台线程进行绘制</span></span>
<span class="line">    <span class="token function">dispatch_async</span><span class="token punctuation">(</span><span class="token function">dispatch_get_global_queue</span><span class="token punctuation">(</span>DISPATCH_QUEUE_PRIORITY_DEFAULT<span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token operator">^</span><span class="token punctuation">{</span></span>
<span class="line">        </span>
<span class="line">        <span class="token comment">// 检查是否被取消</span></span>
<span class="line">        <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span><span class="token keyword">self</span><span class="token punctuation">.</span>isDrawing<span class="token punctuation">)</span> <span class="token keyword">return</span><span class="token punctuation">;</span></span>
<span class="line">        </span>
<span class="line">        <span class="token comment">// 1. 创建绘制上下文（后台线程）</span></span>
<span class="line">        CGSize size <span class="token operator">=</span> <span class="token keyword">self</span><span class="token punctuation">.</span>bounds<span class="token punctuation">.</span>size<span class="token punctuation">;</span></span>
<span class="line">        CGFloat scale <span class="token operator">=</span> <span class="token punctuation">[</span>UIScreen mainScreen<span class="token punctuation">]</span><span class="token punctuation">.</span>scale<span class="token punctuation">;</span></span>
<span class="line">        <span class="token function">UIGraphicsBeginImageContextWithOptions</span><span class="token punctuation">(</span>size<span class="token punctuation">,</span> <span class="token keyword">self</span><span class="token punctuation">.</span>opaque<span class="token punctuation">,</span> scale<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        CGContextRef context <span class="token operator">=</span> <span class="token function">UIGraphicsGetCurrentContext</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        </span>
<span class="line">        <span class="token comment">// 2. 设置背景色（如果需要）</span></span>
<span class="line">        <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">self</span><span class="token punctuation">.</span>opaque <span class="token operator">&amp;&amp;</span> <span class="token keyword">self</span><span class="token punctuation">.</span>backgroundColor<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token function">CGContextSetFillColorWithColor</span><span class="token punctuation">(</span>context<span class="token punctuation">,</span> <span class="token keyword">self</span><span class="token punctuation">.</span>backgroundColor<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">            <span class="token function">CGContextFillRect</span><span class="token punctuation">(</span>context<span class="token punctuation">,</span> <span class="token function">CGRectMake</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">,</span> size<span class="token punctuation">.</span>width <span class="token operator">*</span> scale<span class="token punctuation">,</span> size<span class="token punctuation">.</span>height <span class="token operator">*</span> scale<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">        </span>
<span class="line">        <span class="token comment">// 3. 调用 delegate 的绘制方法（后台线程）</span></span>
<span class="line">        <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token keyword">self</span><span class="token punctuation">.</span>delegate respondsToSelector<span class="token punctuation">:</span><span class="token keyword">@selector</span><span class="token punctuation">(</span>drawLayer<span class="token punctuation">:</span>inContext<span class="token punctuation">:</span><span class="token punctuation">)</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token punctuation">[</span><span class="token keyword">self</span><span class="token punctuation">.</span>delegate drawLayer<span class="token punctuation">:</span><span class="token keyword">self</span> inContext<span class="token punctuation">:</span>context<span class="token punctuation">]</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">        </span>
<span class="line">        <span class="token comment">// 4. 检查是否被取消</span></span>
<span class="line">        <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span><span class="token keyword">self</span><span class="token punctuation">.</span>isDrawing<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token function">UIGraphicsEndImageContext</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">            <span class="token keyword">return</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">        </span>
<span class="line">        <span class="token comment">// 5. 从上下文生成图片</span></span>
<span class="line">        UIImage <span class="token operator">*</span>image <span class="token operator">=</span> <span class="token function">UIGraphicsGetImageFromCurrentImageContext</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token function">UIGraphicsEndImageContext</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        </span>
<span class="line">        <span class="token comment">// 6. 在主线程设置 contents</span></span>
<span class="line">        <span class="token function">dispatch_async</span><span class="token punctuation">(</span><span class="token function">dispatch_get_main_queue</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token operator">^</span><span class="token punctuation">{</span></span>
<span class="line">            <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">self</span><span class="token punctuation">.</span>isDrawing<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">                <span class="token keyword">self</span><span class="token punctuation">.</span>contents <span class="token operator">=</span> <span class="token punctuation">(</span>__bridge id<span class="token punctuation">)</span><span class="token punctuation">(</span>image<span class="token punctuation">.</span>CGImage<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">            <span class="token punctuation">}</span></span>
<span class="line">        <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">@end</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="系统绘制-vs-异步绘制" tabindex="-1"><a class="header-anchor" href="#系统绘制-vs-异步绘制"><span>系统绘制 vs 异步绘制</span></a></h2>
<table>
<thead>
<tr>
<th>特性</th>
<th>系统绘制（drawRect）</th>
<th>异步绘制（displayLayer）</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>触发条件</strong></td>
<td>delegate 没有实现 <code v-pre>displayLayer:</code></td>
<td>delegate 实现了 <code v-pre>displayLayer:</code></td>
</tr>
<tr>
<td><strong>执行线程</strong></td>
<td>主线程</td>
<td>可以后台线程</td>
</tr>
<tr>
<td><strong>内存消耗</strong></td>
<td>大（backing store）</td>
<td>大（backing store）</td>
</tr>
<tr>
<td><strong>使用场景</strong></td>
<td>默认路径，简单绘制</td>
<td>复杂绘制，需要性能优化</td>
</tr>
<tr>
<td><strong>是否阻塞主线程</strong></td>
<td>是</td>
<td>否（如果实现得当）</td>
</tr>
</tbody>
</table>
<p><strong>关键点</strong>：</p>
<table>
<thead>
<tr>
<th>要点</th>
<th>说明</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>路径判断</strong></td>
<td><code v-pre>display</code> 方法中判断 delegate 是否实现了 <code v-pre>displayLayer:</code>，决定走哪个路径</td>
</tr>
<tr>
<td><strong>异步绘制</strong></td>
<td>异步绘制在后台线程创建 context 并绘制</td>
</tr>
<tr>
<td><strong>主线程设置</strong></td>
<td>绘制完成后，必须在主线程设置 <code v-pre>layer.contents</code></td>
</tr>
<tr>
<td><strong>取消逻辑</strong></td>
<td>需要处理取消逻辑，避免重复绘制</td>
</tr>
</tbody>
</table>
</div></template>


