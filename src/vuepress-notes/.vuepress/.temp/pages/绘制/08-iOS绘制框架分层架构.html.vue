<template><div><h1 id="ios-绘制框架分层架构" tabindex="-1"><a class="header-anchor" href="#ios-绘制框架分层架构"><span>iOS 绘制框架分层架构</span></a></h1>
<p>iOS 的图形渲染体系采用分层架构，框架像洋葱一样分层包裹。越上层越易用，越底层性能越高、控制力越强。</p>
<h2 id="四层架构概览" tabindex="-1"><a class="header-anchor" href="#四层架构概览"><span>四层架构概览</span></a></h2>
<Mermaid code="eJxLL0osyFAIceFSAALH6Odr1jzZ0fB0Y9P7PbOe7pryfMoKINsmqUjfLtTTO7NEQV8huDwzrSTUM1ZBV9dOwQmsYVcPRMOzBTue7m9+Nqf3addCmDbn/KJUBce8zNzEksz8PKB+sIA7yNbM5GIYPyS1oiQW7AQnsLnOEId0Qsx9vnDNk93bnnXtfbERbq5vakliDkSLM1iLC0jL09mzIVpeLmp7On/+886dT9fNgmkJTk7NS4V6oqAoswTKdgwC0hCTXMAmuUa7B4QqQCyN5QIAq5uBsA=="></Mermaid><h2 id="第一层-应用层-application-layer" tabindex="-1"><a class="header-anchor" href="#第一层-应用层-application-layer"><span>第一层：应用层（Application Layer）</span></a></h2>
<p><strong>特点</strong>：最顶层，也是平时写的最多的。这些框架是对底层渲染能力的高级封装，目的是让开发者能快速构建 UI，不需要关心像素和显卡。</p>
<table>
<thead>
<tr>
<th>框架</th>
<th>核心组件</th>
<th>主要职责</th>
<th>特点</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>UIKit</strong></td>
<td>UIView、UIViewController</td>
<td>处理用户交互、布局、动画的高级接口</td>
<td>本身不直接渲染像素，而是管理 CALayer 图层树</td>
</tr>
<tr>
<td><strong>AppKit</strong></td>
<td>NSView、NSViewController</td>
<td>macOS 的 UI 框架（UIKit 的 macOS 版本）</td>
<td>与 UIKit 类似，但针对 macOS</td>
</tr>
<tr>
<td><strong>SwiftUI</strong></td>
<td>View、ViewModifier</td>
<td>声明式 UI 框架</td>
<td>底层混合使用 Core Animation 和 Metal</td>
</tr>
</tbody>
</table>
<h2 id="第二层-核心服务层-core-services-layer" tabindex="-1"><a class="header-anchor" href="#第二层-核心服务层-core-services-layer"><span>第二层：核心服务层（Core Services Layer）</span></a></h2>
<p><strong>特点</strong>：iOS 图形渲染的引擎，也是区分初级和高级工程师的分水岭。</p>
<table>
<thead>
<tr>
<th>框架</th>
<th>核心组件</th>
<th>主要职责</th>
<th>执行位置</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>Core Animation</strong><br/>(Quartz Core)</td>
<td>CALayer、CAAnimation</td>
<td>图层合成引擎，负责把多个图层高效合成</td>
<td>GPU（合成）</td>
</tr>
<tr>
<td><strong>Core Graphics</strong><br/>(Quartz 2D)</td>
<td>CGContext、CGPath、CGImage</td>
<td>CPU 绘图引擎，2D 矢量绘图，输出位图</td>
<td>主要在 CPU</td>
</tr>
<tr>
<td><strong>Core Image</strong></td>
<td>CIImage、CIFilter</td>
<td>图像处理滤镜库（模糊、色彩调整等）</td>
<td>GPU（并行计算）</td>
</tr>
<tr>
<td><strong>Core Text</strong></td>
<td>CTFrame、CTLine</td>
<td>文字排版引擎，处理复杂文字渲染</td>
<td>CPU</td>
</tr>
<tr>
<td><strong>TextKit</strong></td>
<td>NSLayoutManager、NSTextContainer</td>
<td>高级文字排版框架（基于 Core Text）</td>
<td>CPU</td>
</tr>
</tbody>
</table>
<h3 id="core-animation-的关键作用" tabindex="-1"><a class="header-anchor" href="#core-animation-的关键作用"><span>Core Animation 的关键作用</span></a></h3>
<p><strong>理解 Core Animation 是精通 iOS 渲染的关键</strong>：</p>
<ul>
<li>Core Animation 是 UIKit 和 GPU 之间的桥梁</li>
<li>几乎所有 iOS 动画都由它驱动</li>
<li>性能优化的核心在于减少不必要的 Layer 创建和离屏渲染</li>
</ul>
<h2 id="第三层-硬件抽象层-hardware-abstraction-layer" tabindex="-1"><a class="header-anchor" href="#第三层-硬件抽象层-hardware-abstraction-layer"><span>第三层：硬件抽象层（Hardware Abstraction Layer）</span></a></h2>
<p><strong>特点</strong>：直接与 GPU（图形处理器）对话。如果你做游戏引擎、视频播放器或高性能绘图 App，才会用到这里。</p>
<table>
<thead>
<tr>
<th>框架</th>
<th>地位</th>
<th>主要职责</th>
<th>状态</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>Metal</strong></td>
<td>现代 iOS 渲染的基石</td>
<td>低开销图形 API，直接与 GPU 对话</td>
<td>✅ 推荐使用</td>
</tr>
<tr>
<td><strong>OpenGL ES</strong></td>
<td>老一代跨平台图形标准</td>
<td>跨平台图形 API</td>
<td>❌ iOS 12+ 已废弃</td>
</tr>
</tbody>
</table>
<h3 id="metal-的重要性" tabindex="-1"><a class="header-anchor" href="#metal-的重要性"><span>Metal 的重要性</span></a></h3>
<p>Metal 是现代 iOS 渲染的基石：</p>
<ul>
<li>苹果自研的图形 API，直接对标 OpenGL/Vulkan</li>
<li>开销极低，能榨干 A 系列芯片的 GPU 性能</li>
<li>UIKit、Core Animation、Core Image 底层都通过 Metal 实现</li>
<li>从 iOS 12 开始，OpenGL ES 已被废弃，Metal 成为唯一的底层图形 API</li>
</ul>
<h2 id="第四层-领域特定层-domain-specific" tabindex="-1"><a class="header-anchor" href="#第四层-领域特定层-domain-specific"><span>第四层：领域特定层（Domain Specific）</span></a></h2>
<p><strong>特点</strong>：基于 Metal 或 OpenGL 封装的专用引擎。</p>
<table>
<thead>
<tr>
<th>框架</th>
<th>主要用途</th>
<th>底层技术</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>SceneKit</strong></td>
<td>3D 游戏引擎（模型、光照、物理）</td>
<td>Metal</td>
</tr>
<tr>
<td><strong>SpriteKit</strong></td>
<td>2D 游戏引擎（精灵图、物理碰撞）</td>
<td>Metal</td>
</tr>
<tr>
<td><strong>ARKit</strong></td>
<td>增强现实渲染（结合摄像头和 3D 渲染）</td>
<td>Metal + 摄像头数据</td>
</tr>
</tbody>
</table>
<h2 id="其他相关框架" tabindex="-1"><a class="header-anchor" href="#其他相关框架"><span>其他相关框架</span></a></h2>
<table>
<thead>
<tr>
<th>框架</th>
<th>用途</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>Image I/O</strong></td>
<td>图片编解码（PNG、JPEG、HEIF 等）</td>
</tr>
<tr>
<td><strong>PDFKit</strong></td>
<td>PDF 文档渲染和操作</td>
</tr>
<tr>
<td><strong>MapKit</strong></td>
<td>地图渲染（基于 Core Animation）</td>
</tr>
<tr>
<td><strong>AVFoundation</strong></td>
<td>视频渲染和播放</td>
</tr>
</tbody>
</table>
<h2 id="框架依赖关系" tabindex="-1"><a class="header-anchor" href="#框架依赖关系"><span>框架依赖关系</span></a></h2>
<Mermaid code="eJxLL0osyFDwCeJSAALH6FBP78ySWAVdXTsFp2jn/KJUBce8zNzEksz8vFiwEufo4PLMtJJQT6giiCCY7RLtm1qSmANR5wQRArNdISa5g6zKTC5G1ukGkfLMTUxPhYhDtLhDxENSK2CuAQt7RAcnp+alwt0IUewZHVxQlFmCLuwV7RiEJAQAj4o9Bg=="></Mermaid><h2 id="使用场景建议" tabindex="-1"><a class="header-anchor" href="#使用场景建议"><span>使用场景建议</span></a></h2>
<table>
<thead>
<tr>
<th>场景</th>
<th>推荐框架</th>
<th>说明</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>99% 的场景</strong></td>
<td>UIKit / SwiftUI</td>
<td>日常 UI 开发</td>
</tr>
<tr>
<td><strong>复杂静态图形/文字</strong></td>
<td>Core Graphics</td>
<td>报表、PDF 生成</td>
</tr>
<tr>
<td><strong>复杂动画/图层特效</strong></td>
<td>Core Animation</td>
<td>卡片翻转、粒子效果</td>
</tr>
<tr>
<td><strong>图片滤镜/修图</strong></td>
<td>Core Image</td>
<td>高斯模糊、色彩调整</td>
</tr>
<tr>
<td><strong>游戏/高性能计算</strong></td>
<td>Metal 或 SpriteKit/SceneKit</td>
<td>游戏引擎、高性能图形</td>
</tr>
</tbody>
</table>
<h2 id="各框架的必要性" tabindex="-1"><a class="header-anchor" href="#各框架的必要性"><span>各框架的必要性</span></a></h2>
<h3 id="core-animation-必须-对于-uikit" tabindex="-1"><a class="header-anchor" href="#core-animation-必须-对于-uikit"><span>Core Animation：必须（对于 UIKit）</span></a></h3>
<table>
<thead>
<tr>
<th>原因</th>
<th>说明</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>UIView 底层就是 CALayer</strong></td>
<td>每个 UIView 都有一个 CALayer；UIView 的 frame、backgroundColor 等属性实际操作的是 CALayer</td>
</tr>
<tr>
<td><strong>UIKit 依赖 Core Animation</strong></td>
<td>UIKit 的渲染流程：UIView → CALayer → Render Server → GPU；没有 Core Animation，UIKit 无法工作</td>
</tr>
</tbody>
</table>
<p><strong>理论上可以不用</strong>：如果不用 UIKit，直接用 Metal 渲染，但会失去 UIKit 的便利性。</p>
<h3 id="core-graphics-大多数情况不需要" tabindex="-1"><a class="header-anchor" href="#core-graphics-大多数情况不需要"><span>Core Graphics：大多数情况不需要</span></a></h3>
<table>
<thead>
<tr>
<th>原因</th>
<th>说明</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>90% 的 UIView 不走 drawRect</strong></td>
<td>系统会先检查是否覆写了 <code v-pre>drawRect:</code>；如果没有覆写，不会创建 Backing Store，不走 CPU 绘制流程</td>
</tr>
<tr>
<td><strong>系统控件都不走 drawRect</strong></td>
<td>UIImageView、UILabel、UIButton 等系统控件都不走 drawRect，直接使用 <code v-pre>layer.contents</code></td>
</tr>
</tbody>
</table>
<p><strong>只有一种情况需要</strong>：当你覆写了 <code v-pre>drawRect:</code> 方法时。</p>
<h2 id="实际开发示例" tabindex="-1"><a class="header-anchor" href="#实际开发示例"><span>实际开发示例</span></a></h2>
<h3 id="示例-1-普通-uiview-不需要-core-graphics" tabindex="-1"><a class="header-anchor" href="#示例-1-普通-uiview-不需要-core-graphics"><span>示例 1：普通 UIView（不需要 Core Graphics）</span></a></h3>
<div class="language-swift line-numbers-mode" data-highlighter="prismjs" data-ext="swift"><pre v-pre><code class="language-swift"><span class="line"><span class="token keyword">let</span> view <span class="token operator">=</span> <span class="token class-name">UIView</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line">view<span class="token punctuation">.</span>backgroundColor <span class="token operator">=</span> <span class="token class-name">UIColor</span><span class="token punctuation">.</span>blue</span>
<span class="line"><span class="token comment">// ✅ 不走 drawRect，不需要 Core Graphics</span></span>
<span class="line"><span class="token comment">// ✅ 需要 Core Animation（CALayer）</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="示例-2-uiimageview-不需要-core-graphics" tabindex="-1"><a class="header-anchor" href="#示例-2-uiimageview-不需要-core-graphics"><span>示例 2：UIImageView（不需要 Core Graphics）</span></a></h3>
<div class="language-swift line-numbers-mode" data-highlighter="prismjs" data-ext="swift"><pre v-pre><code class="language-swift"><span class="line"><span class="token keyword">let</span> imageView <span class="token operator">=</span> <span class="token class-name">UIImageView</span><span class="token punctuation">(</span>image<span class="token punctuation">:</span> <span class="token class-name">UIImage</span><span class="token punctuation">(</span>named<span class="token punctuation">:</span> <span class="token string-literal"><span class="token string">"icon"</span></span><span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line"><span class="token comment">// ✅ 不走 drawRect，不需要 Core Graphics</span></span>
<span class="line"><span class="token comment">// ✅ 需要 Core Animation（CALayer）</span></span>
<span class="line"><span class="token comment">// 图片解码后直接存入 layer.contents</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="示例-3-自定义绘制-需要-core-graphics" tabindex="-1"><a class="header-anchor" href="#示例-3-自定义绘制-需要-core-graphics"><span>示例 3：自定义绘制（需要 Core Graphics）</span></a></h3>
<div class="language-swift line-numbers-mode" data-highlighter="prismjs" data-ext="swift"><pre v-pre><code class="language-swift"><span class="line"><span class="token keyword">class</span> <span class="token class-name">CustomView</span><span class="token punctuation">:</span> <span class="token class-name">UIView</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">override</span> <span class="token keyword">func</span> <span class="token function-definition function">draw</span><span class="token punctuation">(</span><span class="token omit keyword">_</span> rect<span class="token punctuation">:</span> <span class="token class-name">CGRect</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token comment">// ❌ 只有这种情况才需要 Core Graphics</span></span>
<span class="line">        <span class="token keyword">let</span> context <span class="token operator">=</span> <span class="token class-name">UIGraphicsGetCurrentContext</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line">        <span class="token comment">// 绘制...</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="总结" tabindex="-1"><a class="header-anchor" href="#总结"><span>总结</span></a></h2>
<table>
<thead>
<tr>
<th>框架</th>
<th>是否必须</th>
<th>使用场景</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>Core Animation</strong></td>
<td>✅ 使用 UIKit 时必须</td>
<td>所有 UIKit 视图都需要</td>
</tr>
<tr>
<td><strong>Core Graphics</strong></td>
<td>❌ 大多数情况不需要</td>
<td>只有覆写 <code v-pre>drawRect:</code> 时才需要</td>
</tr>
<tr>
<td><strong>Metal</strong></td>
<td>✅ 底层必须（间接使用）</td>
<td>所有框架最终都通过 Metal 渲染</td>
</tr>
</tbody>
</table>
<p><strong>关键理解</strong>：</p>
<ul>
<li>Core Animation（CALayer）：UIKit 渲染的基础，使用 UIKit 就必须有</li>
<li>Core Graphics（drawRect）：仅在自定义绘制时使用，大多数情况下不需要</li>
<li>Metal：现代 iOS 渲染的底层基础，所有框架最终都通过它渲染</li>
</ul>
</div></template>


