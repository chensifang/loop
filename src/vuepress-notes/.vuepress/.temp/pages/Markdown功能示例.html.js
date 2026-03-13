import comp from "/Users/chensifang/code/loop/src/vuepress-notes/.vuepress/.temp/pages/Markdown功能示例.html.vue"
const data = JSON.parse("{\"path\":\"/Markdown%E5%8A%9F%E8%83%BD%E7%A4%BA%E4%BE%8B.html\",\"title\":\"Markdown 功能示例\",\"lang\":\"zh-CN\",\"frontmatter\":{},\"git\":{},\"filePathRelative\":\"Markdown功能示例.md\"}")
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
