import comp from "/Users/chensifang/code/loop/src/vuepress-notes/.vuepress/.temp/pages/内存管理/04-循环引用的产生与解决.html.vue"
const data = JSON.parse("{\"path\":\"/%E5%86%85%E5%AD%98%E7%AE%A1%E7%90%86/04-%E5%BE%AA%E7%8E%AF%E5%BC%95%E7%94%A8%E7%9A%84%E4%BA%A7%E7%94%9F%E4%B8%8E%E8%A7%A3%E5%86%B3.html\",\"title\":\"什么情况下会产生循环引用？如何解决？\",\"lang\":\"zh-CN\",\"frontmatter\":{},\"git\":{},\"filePathRelative\":\"内存管理/04-循环引用的产生与解决.md\"}")
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
