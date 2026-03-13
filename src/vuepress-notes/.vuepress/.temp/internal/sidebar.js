export const sidebar = {"/":{"/":[{"text":"内存管理","prefix":"内存管理/","collapsible":true,"children":["01-iOS对象的内存布局.md","02-isa指针与类对象元类对象的关系.md","03-简述ARC的工作原理.md","04-循环引用的产生与解决.md","05-weak和unowned的区别和使用场景.md","06-SideTable的结构.md","07-weak原理.md"]},{"text":"锁","collapsible":true,"children":["/02-iOS中的锁概述.md","/锁/02-优先级翻转问题.md","/锁/03-@synchronized原理.md"]},{"text":"UI框架","prefix":"UI框架/","collapsible":true,"children":["01-setNeedsDisplay到屏幕显示的流程.md","02-UIView绘制显示原理流程解析以及性能优化.md"]},{"text":"绘制","prefix":"绘制/","collapsible":true,"children":["01-T0代码执行阶段.md","02-T1Layout阶段.md","03-T2Display阶段.md","04-T3Commit阶段.md","05-T4RenderServer阶段.md","06-T5GPU渲染阶段.md","07-CPU绘制vsGPU绘制.md","08-iOS绘制框架分层架构.md"]},{"text":"网络","prefix":"网络/","collapsible":true,"children":["01-HTTPS.md"]}]},"__auto__":{},"__home__":{}}

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updateSidebar) {
    __VUE_HMR_RUNTIME__.updateSidebar(sidebar)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ sidebar }) => {
    __VUE_HMR_RUNTIME__.updateSidebar(sidebar)
  })
}
