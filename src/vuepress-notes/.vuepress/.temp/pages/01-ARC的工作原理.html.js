import comp from "/Users/chensifang/code/loop/src/vuepress-notes/.vuepress/.temp/pages/01-ARC的工作原理.html.vue"
const data = JSON.parse("{\"path\":\"/01-ARC%E7%9A%84%E5%B7%A5%E4%BD%9C%E5%8E%9F%E7%90%86.html\",\"title\":\"简述 ARC（自动引用计数）的工作原理\",\"lang\":\"zh-CN\",\"frontmatter\":{},\"git\":{},\"filePathRelative\":\"01-ARC的工作原理.md\"}")
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
