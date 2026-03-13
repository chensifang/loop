import comp from "/Users/chensifang/code/loop/src/vuepress-notes/.vuepress/.temp/pages/锁/03-@synchronized原理.html.vue"
const data = JSON.parse("{\"path\":\"/%E9%94%81/03-@synchronized%E5%8E%9F%E7%90%86.html\",\"title\":\"@synchronized 原理\",\"lang\":\"zh-CN\",\"frontmatter\":{},\"git\":{\"updatedTime\":1773349568000,\"contributors\":[{\"name\":\"chensifang\",\"username\":\"chensifang\",\"email\":\"chen62615@gmail.com\",\"commits\":2,\"url\":\"https://github.com/chensifang\"}],\"changelog\":[{\"hash\":\"f49aef94b2233a781e4b45c5b1972899b3ed9b3f\",\"time\":1773349568000,\"email\":\"chen62615@gmail.com\",\"author\":\"chensifang\",\"message\":\"修复 Vue 模板语法错误：转义表格中的尖括号\"},{\"hash\":\"813bdd12e8f60f10ccec884ab22015fd24333a11\",\"time\":1773341310000,\"email\":\"chen62615@gmail.com\",\"author\":\"chensifang\",\"message\":\"迁移笔记到 Markdown 格式并集成 VuePress\"}]},\"filePathRelative\":\"锁/03-@synchronized原理.md\"}")
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
