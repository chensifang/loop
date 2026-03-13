import comp from "/Users/chensifang/code/loop/src/vuepress-notes/.vuepress/.temp/pages/内存管理/03-简述ARC的工作原理.html.vue"
const data = JSON.parse("{\"path\":\"/%E5%86%85%E5%AD%98%E7%AE%A1%E7%90%86/03-%E7%AE%80%E8%BF%B0ARC%E7%9A%84%E5%B7%A5%E4%BD%9C%E5%8E%9F%E7%90%86.html\",\"title\":\"简述 ARC（自动引用计数）的工作原理\",\"lang\":\"zh-CN\",\"frontmatter\":{},\"git\":{\"updatedTime\":1773349384000,\"contributors\":[{\"name\":\"chensifang\",\"username\":\"chensifang\",\"email\":\"chen62615@gmail.com\",\"commits\":2,\"url\":\"https://github.com/chensifang\"}],\"changelog\":[{\"hash\":\"0861b3e0e7b05f66e3150591730964ba6e012a90\",\"time\":1773349384000,\"email\":\"chen62615@gmail.com\",\"author\":\"chensifang\",\"message\":\"更新标题样式：为不同级别标题设置区分颜色\"},{\"hash\":\"813bdd12e8f60f10ccec884ab22015fd24333a11\",\"time\":1773341310000,\"email\":\"chen62615@gmail.com\",\"author\":\"chensifang\",\"message\":\"迁移笔记到 Markdown 格式并集成 VuePress\"}]},\"filePathRelative\":\"内存管理/03-简述ARC的工作原理.md\"}")
export { comp, data }

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updatePageData) {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ data }) => {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  })
}
