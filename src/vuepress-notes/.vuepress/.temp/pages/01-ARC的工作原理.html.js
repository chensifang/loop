import comp from "/Users/chensifang/code/loop/src/vuepress-notes/.vuepress/.temp/pages/01-ARC的工作原理.html.vue"
const data = JSON.parse("{\"path\":\"/01-ARC%E7%9A%84%E5%B7%A5%E4%BD%9C%E5%8E%9F%E7%90%86.html\",\"title\":\"简述 ARC（自动引用计数）的工作原理\",\"lang\":\"zh-CN\",\"frontmatter\":{},\"git\":{\"updatedTime\":1773341310000,\"contributors\":[{\"name\":\"chensifang\",\"username\":\"chensifang\",\"email\":\"chen62615@gmail.com\",\"commits\":1,\"url\":\"https://github.com/chensifang\"}],\"changelog\":[{\"hash\":\"813bdd12e8f60f10ccec884ab22015fd24333a11\",\"time\":1773341310000,\"email\":\"chen62615@gmail.com\",\"author\":\"chensifang\",\"message\":\"迁移笔记到 Markdown 格式并集成 VuePress\"}]},\"filePathRelative\":\"01-ARC的工作原理.md\"}")
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
