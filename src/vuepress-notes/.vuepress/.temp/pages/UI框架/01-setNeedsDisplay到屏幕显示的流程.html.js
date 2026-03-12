import comp from "/Users/chensifang/code/loop/src/vuepress-notes/.vuepress/.temp/pages/UI框架/01-setNeedsDisplay到屏幕显示的流程.html.vue"
const data = JSON.parse("{\"path\":\"/UI%E6%A1%86%E6%9E%B6/01-setNeedsDisplay%E5%88%B0%E5%B1%8F%E5%B9%95%E6%98%BE%E7%A4%BA%E7%9A%84%E6%B5%81%E7%A8%8B.html\",\"title\":\"请详细描述从 setNeedsDisplay 被调用，到像素点真正显示在屏幕上的全过程\",\"lang\":\"zh-CN\",\"frontmatter\":{},\"git\":{},\"filePathRelative\":\"UI框架/01-setNeedsDisplay到屏幕显示的流程.md\"}")
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
