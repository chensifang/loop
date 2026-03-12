export const themeData = JSON.parse("{\"navbar\":[{\"text\":\"首页\",\"link\":\"/\"}],\"sidebar\":{\"/\":[{\"text\":\"内存管理\",\"collapsible\":true,\"children\":[\"/内存管理/01-iOS对象的内存布局.md\",\"/内存管理/02-isa指针与类对象元类对象的关系.md\",\"/内存管理/03-简述ARC的工作原理.md\",\"/内存管理/04-循环引用的产生与解决.md\",\"/内存管理/05-weak和unowned的区别和使用场景.md\",\"/内存管理/06-SideTable的结构.md\",\"/内存管理/07-weak原理.md\"]},{\"text\":\"锁\",\"collapsible\":true,\"children\":[\"/02-iOS中的锁概述.md\",\"/锁/02-优先级翻转问题.md\",\"/锁/03-@synchronized原理.md\"]},{\"text\":\"UI框架\",\"collapsible\":true,\"children\":[\"/UI框架/01-setNeedsDisplay到屏幕显示的流程.md\",\"/UI框架/02-UIView绘制显示原理流程解析以及性能优化.md\"]},{\"text\":\"绘制\",\"collapsible\":true,\"children\":[\"/绘制/01-T0代码执行阶段.md\",\"/绘制/02-T1Layout阶段.md\",\"/绘制/03-T2Display阶段.md\",\"/绘制/04-T3Commit阶段.md\",\"/绘制/05-T4RenderServer阶段.md\",\"/绘制/06-T5GPU渲染阶段.md\",\"/绘制/07-CPU绘制vsGPU绘制.md\",\"/绘制/08-iOS绘制框架分层架构.md\"]},{\"text\":\"网络\",\"collapsible\":true,\"children\":[\"/网络/01-HTTPS.md\"]}]},\"locales\":{\"/\":{\"selectLanguageName\":\"English\"}},\"colorMode\":\"auto\",\"colorModeSwitch\":true,\"logo\":null,\"repo\":null,\"selectLanguageText\":\"Languages\",\"selectLanguageAriaLabel\":\"Select language\",\"sidebarDepth\":2,\"editLink\":true,\"editLinkText\":\"Edit this page\",\"lastUpdated\":true,\"contributors\":true,\"contributorsText\":\"Contributors\",\"notFound\":[\"There's nothing here.\",\"How did we get here?\",\"That's a Four-Oh-Four.\",\"Looks like we've got some broken links.\"],\"backToHome\":\"Take me home\",\"openInNewWindow\":\"open in new window\",\"toggleColorMode\":\"toggle color mode\",\"toggleSidebar\":\"toggle sidebar\"}")

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updateThemeData) {
    __VUE_HMR_RUNTIME__.updateThemeData(themeData)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ themeData }) => {
    __VUE_HMR_RUNTIME__.updateThemeData(themeData)
  })
}
