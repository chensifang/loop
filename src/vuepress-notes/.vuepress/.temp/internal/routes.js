export const redirects = JSON.parse("{}")

export const routes = Object.fromEntries([
  ["/01-ARC%E7%9A%84%E5%B7%A5%E4%BD%9C%E5%8E%9F%E7%90%86.html", { loader: () => import(/* webpackChunkName: "01-ARC的工作原理.html" */"/Users/chensifang/code/loop/src/vuepress-notes/.vuepress/.temp/pages/01-ARC的工作原理.html.js"), meta: {"title":"简述 ARC（自动引用计数）的工作原理"} }],
  ["/02-iOS%E4%B8%AD%E7%9A%84%E9%94%81%E6%A6%82%E8%BF%B0.html", { loader: () => import(/* webpackChunkName: "02-iOS中的锁概述.html" */"/Users/chensifang/code/loop/src/vuepress-notes/.vuepress/.temp/pages/02-iOS中的锁概述.html.js"), meta: {"title":"iOS 中的锁概述"} }],
  ["/Markdown%E5%8A%9F%E8%83%BD%E7%A4%BA%E4%BE%8B.html", { loader: () => import(/* webpackChunkName: "Markdown功能示例.html" */"/Users/chensifang/code/loop/src/vuepress-notes/.vuepress/.temp/pages/Markdown功能示例.html.js"), meta: {"title":"Markdown 功能示例"} }],
  ["/", { loader: () => import(/* webpackChunkName: "index.html" */"/Users/chensifang/code/loop/src/vuepress-notes/.vuepress/.temp/pages/index.html.js"), meta: {"title":"VuePress 笔记"} }],
  ["/SideTable%E7%BB%93%E6%9E%84%E5%AF%B9%E6%AF%94%E7%A4%BA%E4%BE%8B.html", { loader: () => import(/* webpackChunkName: "SideTable结构对比示例.html" */"/Users/chensifang/code/loop/src/vuepress-notes/.vuepress/.temp/pages/SideTable结构对比示例.html.js"), meta: {"title":"SideTable 结构 - 现有组件示例"} }],
  ["/%E5%9B%BE%E8%A1%A8%E7%A4%BA%E4%BE%8B.html", { loader: () => import(/* webpackChunkName: "图表示例.html" */"/Users/chensifang/code/loop/src/vuepress-notes/.vuepress/.temp/pages/图表示例.html.js"), meta: {"title":"图表功能示例"} }],
  ["/UI%E6%A1%86%E6%9E%B6/01-setNeedsDisplay%E5%88%B0%E5%B1%8F%E5%B9%95%E6%98%BE%E7%A4%BA%E7%9A%84%E6%B5%81%E7%A8%8B.html", { loader: () => import(/* webpackChunkName: "UI框架_01-setNeedsDisplay到屏幕显示的流程.html" */"/Users/chensifang/code/loop/src/vuepress-notes/.vuepress/.temp/pages/UI框架/01-setNeedsDisplay到屏幕显示的流程.html.js"), meta: {"title":"请详细描述从 setNeedsDisplay 被调用，到像素点真正显示在屏幕上的全过程"} }],
  ["/UI%E6%A1%86%E6%9E%B6/02-UIView%E7%BB%98%E5%88%B6%E6%98%BE%E7%A4%BA%E5%8E%9F%E7%90%86%E6%B5%81%E7%A8%8B%E8%A7%A3%E6%9E%90%E4%BB%A5%E5%8F%8A%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96.html", { loader: () => import(/* webpackChunkName: "UI框架_02-UIView绘制显示原理流程解析以及性能优化.html" */"/Users/chensifang/code/loop/src/vuepress-notes/.vuepress/.temp/pages/UI框架/02-UIView绘制显示原理流程解析以及性能优化.html.js"), meta: {"title":"iOS底层原理之 UIView绘制显示原理流程解析以及性能优化"} }],
  ["/%E5%86%85%E5%AD%98%E7%AE%A1%E7%90%86/01-iOS%E5%AF%B9%E8%B1%A1%E7%9A%84%E5%86%85%E5%AD%98%E5%B8%83%E5%B1%80.html", { loader: () => import(/* webpackChunkName: "内存管理_01-iOS对象的内存布局.html" */"/Users/chensifang/code/loop/src/vuepress-notes/.vuepress/.temp/pages/内存管理/01-iOS对象的内存布局.html.js"), meta: {"title":"iOS 对象的内存布局"} }],
  ["/%E5%86%85%E5%AD%98%E7%AE%A1%E7%90%86/02-isa%E6%8C%87%E9%92%88%E4%B8%8E%E7%B1%BB%E5%AF%B9%E8%B1%A1%E5%85%83%E7%B1%BB%E5%AF%B9%E8%B1%A1%E7%9A%84%E5%85%B3%E7%B3%BB.html", { loader: () => import(/* webpackChunkName: "内存管理_02-isa指针与类对象元类对象的关系.html" */"/Users/chensifang/code/loop/src/vuepress-notes/.vuepress/.temp/pages/内存管理/02-isa指针与类对象元类对象的关系.html.js"), meta: {"title":"isa 指针与类对象、元类对象的关系"} }],
  ["/%E5%86%85%E5%AD%98%E7%AE%A1%E7%90%86/03-%E7%AE%80%E8%BF%B0ARC%E7%9A%84%E5%B7%A5%E4%BD%9C%E5%8E%9F%E7%90%86.html", { loader: () => import(/* webpackChunkName: "内存管理_03-简述ARC的工作原理.html" */"/Users/chensifang/code/loop/src/vuepress-notes/.vuepress/.temp/pages/内存管理/03-简述ARC的工作原理.html.js"), meta: {"title":"简述 ARC（自动引用计数）的工作原理"} }],
  ["/%E5%86%85%E5%AD%98%E7%AE%A1%E7%90%86/04-%E5%BE%AA%E7%8E%AF%E5%BC%95%E7%94%A8%E7%9A%84%E4%BA%A7%E7%94%9F%E4%B8%8E%E8%A7%A3%E5%86%B3.html", { loader: () => import(/* webpackChunkName: "内存管理_04-循环引用的产生与解决.html" */"/Users/chensifang/code/loop/src/vuepress-notes/.vuepress/.temp/pages/内存管理/04-循环引用的产生与解决.html.js"), meta: {"title":"什么情况下会产生循环引用？如何解决？"} }],
  ["/%E5%86%85%E5%AD%98%E7%AE%A1%E7%90%86/05-weak%E5%92%8Cunowned%E7%9A%84%E5%8C%BA%E5%88%AB%E5%92%8C%E4%BD%BF%E7%94%A8%E5%9C%BA%E6%99%AF.html", { loader: () => import(/* webpackChunkName: "内存管理_05-weak和unowned的区别和使用场景.html" */"/Users/chensifang/code/loop/src/vuepress-notes/.vuepress/.temp/pages/内存管理/05-weak和unowned的区别和使用场景.html.js"), meta: {"title":"weak 和 unowned 的区别是什么？分别在什么场景下使用？"} }],
  ["/%E5%86%85%E5%AD%98%E7%AE%A1%E7%90%86/06-SideTable%E7%9A%84%E7%BB%93%E6%9E%84.html", { loader: () => import(/* webpackChunkName: "内存管理_06-SideTable的结构.html" */"/Users/chensifang/code/loop/src/vuepress-notes/.vuepress/.temp/pages/内存管理/06-SideTable的结构.html.js"), meta: {"title":"SideTable"} }],
  ["/%E5%86%85%E5%AD%98%E7%AE%A1%E7%90%86/07-weak%E5%8E%9F%E7%90%86.html", { loader: () => import(/* webpackChunkName: "内存管理_07-weak原理.html" */"/Users/chensifang/code/loop/src/vuepress-notes/.vuepress/.temp/pages/内存管理/07-weak原理.html.js"), meta: {"title":"weak原理"} }],
  ["/%E9%94%81/02-%E4%BC%98%E5%85%88%E7%BA%A7%E7%BF%BB%E8%BD%AC%E9%97%AE%E9%A2%98.html", { loader: () => import(/* webpackChunkName: "锁_02-优先级翻转问题.html" */"/Users/chensifang/code/loop/src/vuepress-notes/.vuepress/.temp/pages/锁/02-优先级翻转问题.html.js"), meta: {"title":"优先级翻转问题"} }],
  ["/%E9%94%81/03-@synchronized%E5%8E%9F%E7%90%86.html", { loader: () => import(/* webpackChunkName: "锁_03-@synchronized原理.html" */"/Users/chensifang/code/loop/src/vuepress-notes/.vuepress/.temp/pages/锁/03-@synchronized原理.html.js"), meta: {"title":"@synchronized 原理"} }],
  ["/%E7%BD%91%E7%BB%9C/01-HTTPS.html", { loader: () => import(/* webpackChunkName: "网络_01-HTTPS.html" */"/Users/chensifang/code/loop/src/vuepress-notes/.vuepress/.temp/pages/网络/01-HTTPS.html.js"), meta: {"title":"HTTPS"} }],
  ["/%E7%BB%98%E5%88%B6/01-T0%E4%BB%A3%E7%A0%81%E6%89%A7%E8%A1%8C%E9%98%B6%E6%AE%B5.html", { loader: () => import(/* webpackChunkName: "绘制_01-T0代码执行阶段.html" */"/Users/chensifang/code/loop/src/vuepress-notes/.vuepress/.temp/pages/绘制/01-T0代码执行阶段.html.js"), meta: {"title":"T0：代码执行阶段（主线程）"} }],
  ["/%E7%BB%98%E5%88%B6/02-T1Layout%E9%98%B6%E6%AE%B5.html", { loader: () => import(/* webpackChunkName: "绘制_02-T1Layout阶段.html" */"/Users/chensifang/code/loop/src/vuepress-notes/.vuepress/.temp/pages/绘制/02-T1Layout阶段.html.js"), meta: {"title":"T1：Layout 阶段（布局计算）"} }],
  ["/%E7%BB%98%E5%88%B6/03-T2Display%E9%98%B6%E6%AE%B5.html", { loader: () => import(/* webpackChunkName: "绘制_03-T2Display阶段.html" */"/Users/chensifang/code/loop/src/vuepress-notes/.vuepress/.temp/pages/绘制/03-T2Display阶段.html.js"), meta: {"title":""} }],
  ["/%E7%BB%98%E5%88%B6/04-T3Commit%E9%98%B6%E6%AE%B5.html", { loader: () => import(/* webpackChunkName: "绘制_04-T3Commit阶段.html" */"/Users/chensifang/code/loop/src/vuepress-notes/.vuepress/.temp/pages/绘制/04-T3Commit阶段.html.js"), meta: {"title":"T3：CATransaction Commit 阶段（提交到 Render Server）"} }],
  ["/%E7%BB%98%E5%88%B6/05-T4RenderServer%E9%98%B6%E6%AE%B5.html", { loader: () => import(/* webpackChunkName: "绘制_05-T4RenderServer阶段.html" */"/Users/chensifang/code/loop/src/vuepress-notes/.vuepress/.temp/pages/绘制/05-T4RenderServer阶段.html.js"), meta: {"title":"T4：Render Server 处理阶段（准备渲染）"} }],
  ["/%E7%BB%98%E5%88%B6/06-T5GPU%E6%B8%B2%E6%9F%93%E9%98%B6%E6%AE%B5.html", { loader: () => import(/* webpackChunkName: "绘制_06-T5GPU渲染阶段.html" */"/Users/chensifang/code/loop/src/vuepress-notes/.vuepress/.temp/pages/绘制/06-T5GPU渲染阶段.html.js"), meta: {"title":"T5：GPU 渲染阶段（渲染到屏幕）"} }],
  ["/%E7%BB%98%E5%88%B6/07-CPU%E7%BB%98%E5%88%B6vsGPU%E7%BB%98%E5%88%B6.html", { loader: () => import(/* webpackChunkName: "绘制_07-CPU绘制vsGPU绘制.html" */"/Users/chensifang/code/loop/src/vuepress-notes/.vuepress/.temp/pages/绘制/07-CPU绘制vsGPU绘制.html.js"), meta: {"title":"CPU 绘制 vs GPU 绘制：本质区别"} }],
  ["/%E7%BB%98%E5%88%B6/08-iOS%E7%BB%98%E5%88%B6%E6%A1%86%E6%9E%B6%E5%88%86%E5%B1%82%E6%9E%B6%E6%9E%84.html", { loader: () => import(/* webpackChunkName: "绘制_08-iOS绘制框架分层架构.html" */"/Users/chensifang/code/loop/src/vuepress-notes/.vuepress/.temp/pages/绘制/08-iOS绘制框架分层架构.html.js"), meta: {"title":"iOS 绘制框架分层架构"} }],
  ["/404.html", { loader: () => import(/* webpackChunkName: "404.html" */"/Users/chensifang/code/loop/src/vuepress-notes/.vuepress/.temp/pages/404.html.js"), meta: {"title":""} }],
]);

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updateRoutes) {
    __VUE_HMR_RUNTIME__.updateRoutes(routes)
  }
  if (__VUE_HMR_RUNTIME__.updateRedirects) {
    __VUE_HMR_RUNTIME__.updateRedirects(redirects)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ routes, redirects }) => {
    __VUE_HMR_RUNTIME__.updateRoutes(routes)
    __VUE_HMR_RUNTIME__.updateRedirects(redirects)
  })
}
