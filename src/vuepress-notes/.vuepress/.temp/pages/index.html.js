import comp from "/Users/chensifang/code/loop/src/vuepress-notes/.vuepress/.temp/pages/index.html.vue"
const data = JSON.parse("{\"path\":\"/\",\"title\":\"VuePress 笔记\",\"lang\":\"zh-CN\",\"frontmatter\":{},\"git\":{\"updatedTime\":1773341310000,\"contributors\":[{\"name\":\"chensifang\",\"username\":\"chensifang\",\"email\":\"chen62615@gmail.com\",\"commits\":1,\"url\":\"https://github.com/chensifang\"}],\"changelog\":[{\"hash\":\"813bdd12e8f60f10ccec884ab22015fd24333a11\",\"time\":1773341310000,\"email\":\"chen62615@gmail.com\",\"author\":\"chensifang\",\"message\":\"迁移笔记到 Markdown 格式并集成 VuePress\"}]},\"filePathRelative\":\"README.md\"}")
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
