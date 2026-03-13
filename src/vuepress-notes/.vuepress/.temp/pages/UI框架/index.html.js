import comp from "/Users/chensifang/code/loop/src/vuepress-notes/.vuepress/.temp/pages/UI框架/index.html.vue"
const data = JSON.parse("{\"path\":\"/UI%E6%A1%86%E6%9E%B6/\",\"title\":\"UI框架\",\"lang\":\"zh-CN\",\"frontmatter\":{\"title\":\"UI框架\",\"article\":false,\"feed\":false,\"sitemap\":false},\"readingTime\":{\"minutes\":0,\"words\":1},\"filePathRelative\":null}")
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
