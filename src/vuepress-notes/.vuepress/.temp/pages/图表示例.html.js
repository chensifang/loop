import comp from "/Users/chensifang/code/loop/src/vuepress-notes/.vuepress/.temp/pages/图表示例.html.vue"
const data = JSON.parse("{\"path\":\"/%E5%9B%BE%E8%A1%A8%E7%A4%BA%E4%BE%8B.html\",\"title\":\"图表功能示例\",\"lang\":\"zh-CN\",\"frontmatter\":{},\"git\":{},\"filePathRelative\":\"图表示例.md\"}")
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
