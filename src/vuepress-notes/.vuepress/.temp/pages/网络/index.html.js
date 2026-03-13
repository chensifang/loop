import comp from "/Users/chensifang/code/loop/src/vuepress-notes/.vuepress/.temp/pages/网络/index.html.vue"
const data = JSON.parse("{\"path\":\"/%E7%BD%91%E7%BB%9C/\",\"title\":\"网络\",\"lang\":\"zh-CN\",\"frontmatter\":{\"title\":\"网络\",\"article\":false,\"feed\":false,\"sitemap\":false},\"readingTime\":{\"minutes\":0,\"words\":1},\"filePathRelative\":null}")
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
