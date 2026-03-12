<template><div><h1 id="vuepress-笔记" tabindex="-1"><a class="header-anchor" href="#vuepress-笔记"><span>VuePress 笔记</span></a></h1>
<p>欢迎来到 iOS 开发笔记！</p>
<p>这里收集了 iOS 开发相关的技术笔记。</p>
<h2 id="目录" tabindex="-1"><a class="header-anchor" href="#目录"><span>目录</span></a></h2>
<h3 id="内存管理" tabindex="-1"><a class="header-anchor" href="#内存管理"><span>内存管理</span></a></h3>
<ul>
<li><RouteLink to="/%E5%86%85%E5%AD%98%E7%AE%A1%E7%90%86/01-iOS%E5%AF%B9%E8%B1%A1%E7%9A%84%E5%86%85%E5%AD%98%E5%B8%83%E5%B1%80.html">iOS对象的内存布局</RouteLink></li>
<li><RouteLink to="/%E5%86%85%E5%AD%98%E7%AE%A1%E7%90%86/02-isa%E6%8C%87%E9%92%88%E4%B8%8E%E7%B1%BB%E5%AF%B9%E8%B1%A1%E5%85%83%E7%B1%BB%E5%AF%B9%E8%B1%A1%E7%9A%84%E5%85%B3%E7%B3%BB.html">isa指针与类对象元类对象的关系</RouteLink></li>
<li><RouteLink to="/%E5%86%85%E5%AD%98%E7%AE%A1%E7%90%86/03-%E7%AE%80%E8%BF%B0ARC%E7%9A%84%E5%B7%A5%E4%BD%9C%E5%8E%9F%E7%90%86.html">简述ARC的工作原理</RouteLink></li>
<li><RouteLink to="/%E5%86%85%E5%AD%98%E7%AE%A1%E7%90%86/04-%E5%BE%AA%E7%8E%AF%E5%BC%95%E7%94%A8%E7%9A%84%E4%BA%A7%E7%94%9F%E4%B8%8E%E8%A7%A3%E5%86%B3.html">循环引用的产生与解决</RouteLink></li>
<li><RouteLink to="/%E5%86%85%E5%AD%98%E7%AE%A1%E7%90%86/05-weak%E5%92%8Cunowned%E7%9A%84%E5%8C%BA%E5%88%AB%E5%92%8C%E4%BD%BF%E7%94%A8%E5%9C%BA%E6%99%AF.html">weak和unowned的区别和使用场景</RouteLink></li>
<li><RouteLink to="/%E5%86%85%E5%AD%98%E7%AE%A1%E7%90%86/06-SideTable%E7%9A%84%E7%BB%93%E6%9E%84.html">SideTable的结构</RouteLink></li>
<li><RouteLink to="/%E5%86%85%E5%AD%98%E7%AE%A1%E7%90%86/07-weak%E5%8E%9F%E7%90%86.html">weak原理</RouteLink></li>
</ul>
<h3 id="锁" tabindex="-1"><a class="header-anchor" href="#锁"><span>锁</span></a></h3>
<ul>
<li><RouteLink to="/02-iOS%E4%B8%AD%E7%9A%84%E9%94%81%E6%A6%82%E8%BF%B0.html">iOS中的锁概述</RouteLink></li>
<li><RouteLink to="/%E9%94%81/02-%E4%BC%98%E5%85%88%E7%BA%A7%E7%BF%BB%E8%BD%AC%E9%97%AE%E9%A2%98.html">优先级翻转问题</RouteLink></li>
<li><RouteLink to="/%E9%94%81/03-@synchronized%E5%8E%9F%E7%90%86.html">@synchronized原理</RouteLink></li>
</ul>
<h3 id="ui框架" tabindex="-1"><a class="header-anchor" href="#ui框架"><span>UI框架</span></a></h3>
<ul>
<li><RouteLink to="/UI%E6%A1%86%E6%9E%B6/01-setNeedsDisplay%E5%88%B0%E5%B1%8F%E5%B9%95%E6%98%BE%E7%A4%BA%E7%9A%84%E6%B5%81%E7%A8%8B.html">setNeedsDisplay到屏幕显示的流程</RouteLink></li>
<li><RouteLink to="/UI%E6%A1%86%E6%9E%B6/02-UIView%E7%BB%98%E5%88%B6%E6%98%BE%E7%A4%BA%E5%8E%9F%E7%90%86%E6%B5%81%E7%A8%8B%E8%A7%A3%E6%9E%90%E4%BB%A5%E5%8F%8A%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96.html">UIView绘制显示原理流程解析以及性能优化</RouteLink></li>
</ul>
<h3 id="绘制" tabindex="-1"><a class="header-anchor" href="#绘制"><span>绘制</span></a></h3>
<ul>
<li><RouteLink to="/%E7%BB%98%E5%88%B6/01-T0%E4%BB%A3%E7%A0%81%E6%89%A7%E8%A1%8C%E9%98%B6%E6%AE%B5.html">T0代码执行阶段</RouteLink></li>
<li><RouteLink to="/%E7%BB%98%E5%88%B6/02-T1Layout%E9%98%B6%E6%AE%B5.html">T1Layout阶段</RouteLink></li>
<li><RouteLink to="/%E7%BB%98%E5%88%B6/03-T2Display%E9%98%B6%E6%AE%B5.html">T2Display阶段</RouteLink></li>
<li><RouteLink to="/%E7%BB%98%E5%88%B6/04-T3Commit%E9%98%B6%E6%AE%B5.html">T3Commit阶段</RouteLink></li>
<li><RouteLink to="/%E7%BB%98%E5%88%B6/05-T4RenderServer%E9%98%B6%E6%AE%B5.html">T4RenderServer阶段</RouteLink></li>
<li><RouteLink to="/%E7%BB%98%E5%88%B6/06-T5GPU%E6%B8%B2%E6%9F%93%E9%98%B6%E6%AE%B5.html">T5GPU渲染阶段</RouteLink></li>
<li><RouteLink to="/%E7%BB%98%E5%88%B6/07-CPU%E7%BB%98%E5%88%B6vsGPU%E7%BB%98%E5%88%B6.html">CPU绘制vsGPU绘制</RouteLink></li>
<li><RouteLink to="/%E7%BB%98%E5%88%B6/08-iOS%E7%BB%98%E5%88%B6%E6%A1%86%E6%9E%B6%E5%88%86%E5%B1%82%E6%9E%B6%E6%9E%84.html">iOS绘制框架分层架构</RouteLink></li>
</ul>
<h3 id="网络" tabindex="-1"><a class="header-anchor" href="#网络"><span>网络</span></a></h3>
<ul>
<li><RouteLink to="/%E7%BD%91%E7%BB%9C/01-HTTPS.html">HTTPS</RouteLink></li>
</ul>
</div></template>


