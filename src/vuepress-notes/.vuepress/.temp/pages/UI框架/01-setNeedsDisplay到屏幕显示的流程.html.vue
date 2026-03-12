<template><div><h1 id="请详细描述从-setneedsdisplay-被调用-到像素点真正显示在屏幕上的全过程" tabindex="-1"><a class="header-anchor" href="#请详细描述从-setneedsdisplay-被调用-到像素点真正显示在屏幕上的全过程"><span>请详细描述从 setNeedsDisplay 被调用，到像素点真正显示在屏幕上的全过程</span></a></h1>
<h2 id="核心概念" tabindex="-1"><a class="header-anchor" href="#核心概念"><span>核心概念</span></a></h2>
<p>从调用 <code v-pre>setNeedsDisplay</code> 到像素显示在屏幕上，是一个复杂的渲染流程，涉及应用层、系统层、GPU 和硬件显示。整个过程是异步的，不会立即执行。</p>
<blockquote>
<p><strong>重要提示：</strong> 只有当你覆写了 <code v-pre>drawRect:</code> 方法时，系统才会走 CPU 绘制流程。绝大多数情况下（如设置 <code v-pre>backgroundColor</code> 或 <code v-pre>UIImageView</code> 加载图片），是不走 <code v-pre>drawRect:</code> 的。一旦覆写 <code v-pre>drawRect:</code>，系统会为该 View 申请一块巨大的内存（寄宿图 Backing Store），其大小 = width × height × contentsScale² × 4 字节，这是极其耗费内存的。</p>
</blockquote>
<h2 id="完整流程时间线" tabindex="-1"><a class="header-anchor" href="#完整流程时间线"><span>完整流程时间线</span></a></h2>
<table>
<thead>
<tr>
<th>时间点</th>
<th>阶段/操作</th>
<th>执行位置</th>
<th>详细解释</th>
<th>白话理解</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>T0</strong></td>
<td><strong>调用 setNeedsDisplay</strong></td>
<td>App 进程（主线程）</td>
<td>在视图的 <code v-pre>layer</code> 上设置 <code v-pre>needsDisplay</code> 标志位，标记这个视图需要重绘。标记会向上传播到父视图。<strong>关键点：</strong> <code v-pre>setNeedsDisplay</code> 是异步的，不会立即调用 <code v-pre>drawRect:</code>，只是标记需要重绘。<strong>重要：</strong> 只有当你覆写了 <code v-pre>drawRect:</code> 方法时，系统才会走 CPU 绘制流程。</td>
<td>就像在墙上贴了一张&quot;需要重新粉刷&quot;的便利贴，但还没开始刷墙。</td>
</tr>
<tr>
<td><strong>T1</strong></td>
<td><strong>RunLoop 循环处理</strong></td>
<td>App 进程（主线程）</td>
<td>RunLoop 在每次循环中处理各种事件和更新，检查是否有视图被标记为 <code v-pre>needsLayout</code> 或 <code v-pre>needsDisplay</code>。</td>
<td>主线程是一个忙碌的工人，一直在处理各种任务，一边检查有没有需要更新的视图。</td>
</tr>
<tr>
<td><strong>T2</strong></td>
<td><strong>RunLoop BeforeWaiting Observer</strong></td>
<td>App 进程（主线程）</td>
<td>RunLoop 准备进入休眠前，触发 Core Animation 的 Observer。这个 Observer 会触发 <code v-pre>CATransaction::commit()</code>，这是真正开始渲染流程的起点。</td>
<td>工人准备休息睡觉前，Core Animation 的&quot;闹钟&quot;响了，说&quot;该开始渲染了！&quot;</td>
</tr>
<tr>
<td><strong>T3</strong></td>
<td><strong>CATransaction Commit - Layout 阶段</strong></td>
<td>App 进程（主线程 CPU）</td>
<td>遍历所有被标记为 <code v-pre>needsLayout</code> 的视图，调用每个视图的 <code v-pre>layoutSubviews</code> 方法，计算和更新子视图的 frame、bounds 等布局属性。Auto Layout 约束计算也在这个阶段完成。</td>
<td>先确定每个视图的位置和大小，就像装修前先量尺寸、画图纸。</td>
</tr>
<tr>
<td><strong>T4</strong></td>
<td><strong>CATransaction Commit - Display 阶段</strong></td>
<td>App 进程（主线程 CPU）</td>
<td><strong>仅当覆写了 drawRect: 时才会执行</strong>。系统创建 <code v-pre>CGContext</code>（Backing Store），执行 <code v-pre>drawRect:</code> 中的绘制代码，生成位图并设置为 <code v-pre>CALayer</code> 的 <code v-pre>contents</code> 属性。<strong>如果没有覆写 drawRect:：</strong> 系统会直接使用 Layer 的 <code v-pre>contents</code>（如 UIImage、backgroundColor 等），跳过 CPU 绘制流程。</td>
<td>只有当你自定义了 <code v-pre>drawRect:</code>，系统才会在这里执行你的绘制代码。如果没有自定义，就像直接用现成的图片或颜色，直接跳过这一步。</td>
</tr>
<tr>
<td><strong>T5</strong></td>
<td><strong>CATransaction Commit - Prepare 阶段</strong></td>
<td>App 进程（主线程 CPU）</td>
<td><strong>性能瓶颈的关键阶段</strong>。图片解码（仅当有图片时）、图片格式转换（仅当有图片时）、计算每个 Layer 的变换矩阵、构建渲染树（Render Tree）。<strong>优化建议：</strong> 图片应该提前在后台线程解码，避免在 Commit 阶段阻塞主线程。</td>
<td>这是最累的一步，就像把所有材料准备好。图片解码最容易卡，就像解压一个大文件。</td>
</tr>
<tr>
<td><strong>T6</strong></td>
<td><strong>CATransaction Commit - Commit 阶段</strong></td>
<td>App 进程 → Render Server（IPC）</td>
<td>将所有渲染数据打包并发送给渲染服务器进程（backboardd）。通过 IPC（进程间通信）发送数据。<strong>为什么需要渲染服务器：</strong> 渲染服务器是一个独立的进程，即使 App 崩溃，渲染服务器仍然可以继续工作，保证界面不会卡死。</td>
<td>把准备好的&quot;渲染清单&quot;和所有图片打包，通过&quot;快递&quot;发送给另一个专门负责渲染的&quot;工厂&quot;。</td>
</tr>
<tr>
<td><strong>T7</strong></td>
<td><strong>Render Server 接收并解析</strong></td>
<td>Render Server 进程（backboardd）</td>
<td>接收 App 进程发送过来的渲染数据，反序列化数据，解析 Layer 树和渲染指令。<strong>关键点：</strong> Render Server 本身并不直接做大量的&quot;像素计算&quot;，它主要是拆解打包发来的指令，然后调用 OpenGL/Metal API 给 GPU 发送 Draw Calls。</td>
<td>渲染工厂收到快递，拆包看看里面有什么。它不直接画画，而是把&quot;渲染清单&quot;翻译成 GPU 能理解的指令。</td>
</tr>
<tr>
<td><strong>T8</strong></td>
<td><strong>GPU - 纹理上传</strong></td>
<td>GPU（显存）</td>
<td>将 CPU 内存中的位图数据通过 PCIe 总线传输到 GPU 的显存中。位图在 GPU 中作为纹理（texture）存储。如果纹理很大，这一步也会耗时。</td>
<td>把图片从 CPU 的内存搬到 GPU 的&quot;专用仓库&quot;（显存）里。</td>
</tr>
<tr>
<td><strong>T9</strong></td>
<td><strong>GPU - 顶点处理</strong></td>
<td>GPU（顶点着色器）</td>
<td>GPU 的顶点着色器处理每个 Layer 的顶点数据，应用变换矩阵（位置、旋转、缩放、透视等），计算每个顶点在屏幕空间中的最终位置。</td>
<td>GPU 计算每个视图的四个角（顶点）在屏幕上的最终位置。</td>
</tr>
<tr>
<td><strong>T10</strong></td>
<td><strong>GPU - 光栅化</strong></td>
<td>GPU（光栅化单元）</td>
<td>光栅化将处理后的顶点数据转换为像素片段（fragments），确定哪些像素被几何图形覆盖，为每个像素片段生成插值后的属性。</td>
<td>把几何图形转换成一个个像素点，确定哪些像素被这个图形覆盖。</td>
</tr>
<tr>
<td><strong>T11</strong></td>
<td><strong>GPU - 片段着色</strong></td>
<td>GPU（片段着色器）</td>
<td>GPU 的片段着色器对每个像素片段进行着色，应用纹理采样、颜色混合、透明度计算等，输出每个像素的最终颜色值。</td>
<td>给每个像素点&quot;上色&quot;，决定每个像素应该是什么颜色。</td>
</tr>
<tr>
<td><strong>T12</strong></td>
<td><strong>GPU - 合成与离屏渲染</strong></td>
<td>GPU（合成单元）</td>
<td>按照 Layer 的层级关系将所有 Layer 合成到一起，处理透明度混合、混合模式等。<strong>离屏渲染（Offscreen Rendering）：</strong> 如果 Layer 需要特殊处理（如圆角 <code v-pre>cornerRadius</code>、阴影 <code v-pre>shadow</code>、遮罩 <code v-pre>mask</code>），GPU 会先渲染到离屏缓冲区，然后再合成到主缓冲区。这会增加性能开销，应该尽量避免。</td>
<td>把所有视图按照层级关系叠在一起。如果某个视图需要特殊效果，GPU 会先在一个&quot;临时画布&quot;上画好，再叠到主画布上，这比较慢。</td>
</tr>
<tr>
<td><strong>T13</strong></td>
<td><strong>GPU - 写入帧缓冲</strong></td>
<td>GPU（帧缓冲区）</td>
<td>将合成后的最终图像写入帧缓冲（Frame Buffer）。iOS 使用双缓冲或三缓冲机制：一个 Front Buffer（正在显示）、一个或多个 Back Buffer（正在渲染）。帧缓冲区位于 GPU 显存中，大小 = 屏幕分辨率 × 4 字节（RGBA）。</td>
<td>把最终画好的完整画面存到一个&quot;准备区&quot;（Back Buffer）。系统有两个缓冲区，一个正在显示，一个正在准备下一帧。</td>
</tr>
<tr>
<td><strong>T14</strong></td>
<td><strong>等待 VSync 信号</strong></td>
<td>硬件（显示器）</td>
<td>VSync（Vertical Synchronization）是显示器硬件发出的同步信号。对于 60Hz 的显示器，VSync 信号每 16.67ms（1/60 秒）发出一次。<strong>掉帧机制：</strong> 如果 CPU + GPU 执行的总时间超过了 16.67ms，当 VSync 信号到来时，新的一帧还没写进 Back Buffer，交换就不会发生。此时屏幕会继续显示上一帧的内容，这在视觉上就是掉帧（Jank）。<strong>跳帧补偿：</strong> 系统不会补偿错过的帧。被错过的帧会被直接丢弃，App 表现为直接&quot;跳&quot;到最新的状态。</td>
<td>等待显示器的&quot;换帧信号&quot;。如果新画面还没准备好，就继续显示旧画面（掉帧）。如果错过了这一班，就等下一班，不会补偿。</td>
</tr>
<tr>
<td><strong>T15</strong></td>
<td><strong>交换缓冲区（Swap）</strong></td>
<td>硬件（显示控制器）</td>
<td>当 VSync 信号到来且新帧已准备好时，交换前后帧缓冲区。交换是硬件操作，非常快速（通常只需要修改指针）。<strong>双缓冲机制：</strong> 避免画面撕裂（Tearing），保证画面完整显示。<strong>ProMotion 动态 VSync：</strong> 在现代 ProMotion 屏幕（120Hz）上，VSync 的间隔是动态的（从 10Hz 到 120Hz 变化）。</td>
<td>交换前后缓冲区，避免画面撕裂。</td>
</tr>
<tr>
<td><strong>T16</strong></td>
<td><strong>扫描输出</strong></td>
<td>硬件（显示器）</td>
<td>显示器从帧缓冲区逐行扫描像素数据，从 Front Buffer 中读取每个像素的 RGB 值，将数字信号转换为模拟信号，驱动显示器的像素点。</td>
<td>显示器逐行扫描像素数据。</td>
</tr>
<tr>
<td><strong>T17</strong></td>
<td><strong>像素显示</strong></td>
<td>硬件（显示器）</td>
<td>显示器的每个像素点根据接收到的 RGB 值发光，用户看到最终的画面。整个过程完成，从调用 <code v-pre>setNeedsDisplay</code> 到像素显示，通常需要 1-2 个 VSync 周期（16.67-33.34ms）。</td>
<td>像素点最终显示在屏幕上。</td>
</tr>
</tbody>
</table>
<h2 id="关键要点总结" tabindex="-1"><a class="header-anchor" href="#关键要点总结"><span>关键要点总结</span></a></h2>
<h3 id="_1-catransaction-的四个阶段" tabindex="-1"><a class="header-anchor" href="#_1-catransaction-的四个阶段"><span>1. CATransaction 的四个阶段</span></a></h3>
<p>CATransaction Commit 分为四个阶段：</p>
<ul>
<li><strong>Layout：</strong> 调用 <code v-pre>layoutSubviews</code> 更新布局</li>
<li><strong>Display：</strong> 调用 <code v-pre>drawRect:</code> 进行绘制（仅当覆写时）</li>
<li><strong>Prepare：</strong> 图片解码（仅当有图片时）、格式转换（仅当有图片时）、构建渲染树（性能瓶颈）</li>
<li><strong>Commit：</strong> 打包数据并发送给 Render Server</li>
</ul>
<h3 id="_2-drawrect-的触发条件与内存代价" tabindex="-1"><a class="header-anchor" href="#_2-drawrect-的触发条件与内存代价"><span>2. drawRect: 的触发条件与内存代价</span></a></h3>
<p><strong>只有覆写了 <code v-pre>drawRect:</code> 方法时，系统才会走 CPU 绘制流程。</strong> 绝大多数情况下（如设置 <code v-pre>backgroundColor</code> 或 <code v-pre>UIImageView</code> 加载图片），是不走 <code v-pre>drawRect:</code> 的。</p>
<p>一旦覆写 <code v-pre>drawRect:</code>，系统会为该 View 申请一块巨大的内存（寄宿图 Backing Store），其大小 = width × height × contentsScale² × 4 字节。这是极其耗费内存的，专家级优化通常建议<strong>尽量避免覆写 drawRect:</strong>。</p>
<h3 id="_3-图片解码是性能瓶颈-仅当有图片时" tabindex="-1"><a class="header-anchor" href="#_3-图片解码是性能瓶颈-仅当有图片时"><span>3. 图片解码是性能瓶颈（仅当有图片时）</span></a></h3>
<p>在 Prepare 阶段，如果 Layer 的 <code v-pre>contents</code> 是压缩图片（JPEG、PNG），CPU 必须将图片解压成位图。这一步在主线程执行，如果图片很大或未预解码，会严重卡顿主线程，导致掉帧。这是掉帧的头号杀手。</p>
<p><strong>重要理解：</strong> 不是所有 UI 都需要图片。纯色背景（<code v-pre>backgroundColor</code>）、文字（<code v-pre>UILabel</code>）、简单几何图形等，GPU 可以直接渲染，不需要图片。只有使用 <code v-pre>UIImage</code>、覆写 <code v-pre>drawRect:</code> 或离屏渲染时才需要图片/位图。</p>
<p><strong>优化建议：</strong> 图片应该提前在后台线程解码，避免在 Commit 阶段阻塞主线程。</p>
<h3 id="_4-vsync-与掉帧机制" tabindex="-1"><a class="header-anchor" href="#_4-vsync-与掉帧机制"><span>4. VSync 与掉帧机制</span></a></h3>
<p>如果 CPU + GPU 执行的总时间超过了 16.67ms，当 VSync 信号到来时，新的一帧还没写进 Back Buffer，交换（Swap）就不会发生。此时屏幕会继续显示上一帧的内容，这在视觉上就是掉帧（Jank）。</p>
<p><strong>跳帧补偿：</strong> 系统不会补偿错过的帧。VSync 是硬件发出的脉冲，如果没赶上这一班，就只能等下一班。被错过的帧会被直接丢弃，App 表现为直接&quot;跳&quot;到最新的状态。</p>
</div></template>


