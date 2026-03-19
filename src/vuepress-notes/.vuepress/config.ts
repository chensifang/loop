import { defineUserConfig } from 'vuepress'
import { defaultTheme } from '@vuepress/theme-default'
import { viteBundler } from '@vuepress/bundler-vite'
import { markdownChartPlugin } from '@vuepress/plugin-markdown-chart'
import { shikiPlugin } from '@vuepress/plugin-shiki'

export default defineUserConfig({
  // 语言设置
  lang: 'zh-CN',
  title: 'VuePress 笔记',
  description: 'iOS 开发笔记',
  
  // Head 配置 - 添加 favicon
  head: [
    ['link', { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }],
    ['link', { rel: 'alternate icon', href: '/favicon.ico' }],
  ],
  
  // 使用 Vite 作为打包工具
  bundler: viteBundler(),
  
  // 插件配置 - 启用所有图表功能（和 Plume 主题一样）
  plugins: [
    // 禁用上一篇/下一篇链接
    {
      name: 'disable-prev-next',
      extendsPageOptions: (pageOptions) => {
        pageOptions.frontmatter = pageOptions.frontmatter ?? {}
        pageOptions.frontmatter.prev = false
        pageOptions.frontmatter.next = false
      },
    },
    // Shiki 代码高亮插件 - 提供更好的语法高亮（禁用行号，使用历史样式）
    shikiPlugin({
      langs: ['swift', 'objective-c', 'objc', 'cpp', 'c', 'javascript', 'typescript', 'python', 'java', 'bash', 'json', 'markdown'],
      theme: 'github-light', // 使用 GitHub 风格的浅色主题
      lineNumbers: false, // 禁用行号，使用历史 HTML 的简洁样式
    }),
    markdownChartPlugin({
      mermaid: true,      // Mermaid 图表和流程图
      chartjs: true,     // Chart.js 图表
      echarts: true,     // ECharts 图表
      flowchart: true,   // Flowchart 流程图
      markmap: true,     // Markmap 思维导图
      plantuml: [
        // PlantUML - 使用 phase-6 替代 plantuml.com（后者在国内部分请求易失败）
        { name: 'uml', type: 'fence', fence: 'uml', server: 'https://plantuml.phase-6.com', format: 'svg' },
        { name: 'plantuml', type: 'fence', fence: 'plantuml', server: 'https://plantuml.phase-6.com', format: 'svg' },
        { name: 'puml', type: 'fence', fence: 'puml', server: 'https://plantuml.phase-6.com', format: 'svg' },
      ],
    }),
  ],
  
  // 主题配置
  theme: defaultTheme({
    // 禁用悬浮返回顶部按钮和顶部滚动进度条
    themePlugins: {
      backToTop: false,
      nprogress: false,
    },
    // 禁用最近更新时间
    lastUpdated: false,
    // 禁用贡献者列表
    contributors: false,
    // 导航栏
    navbar: [
      {
        text: '首页',
        link: '/',
      },
    ],
    // 不显示笔记内的子标题（h2、h3 等）
    sidebarDepth: 0,
    // 侧边栏配置 - 与文档标题一致
    sidebar: {
      '/': [
        {
          text: '总览',
          children: [
            { text: 'iOS知识框架', link: '/总览/01-iOS知识框架.md' },
          ],
        },
        {
          text: '示例文档',
          children: [
            { text: '图表示例', link: '/图表示例.md' },
            { text: 'Markdown功能示例', link: '/Markdown功能示例.md' },
            { text: 'SideTable结构对比示例', link: '/SideTable结构对比示例.md' },
          ],
        },
        {
          text: '内存管理',
          collapsible: true,
          children: [
            { text: '对象内存布局', link: '/内存管理/01-iOS对象的内存布局.md' },
            { text: '对象、类、元类', link: '/内存管理/02-isa指针与类对象元类对象的关系.md' },
            { text: 'ARC', link: '/内存管理/03-简述ARC的工作原理.md' },
            { text: '循环引用', link: '/内存管理/04-循环引用的产生与解决.md' },
            { text: 'weak、unowned', link: '/内存管理/05-weak和unowned的区别和使用场景.md' },
            { text: 'SideTable', link: '/内存管理/06-SideTable的结构.md' },
            { text: 'weak', link: '/内存管理/07-weak原理.md' },
          ],
        },
        {
          text: '锁',
          collapsible: true,
          children: [
            { text: 'iOS中的锁概述', link: '/锁/01-iOS中的锁概述.md' },
            { text: '优先级翻转问题', link: '/锁/02-优先级翻转问题.md' },
            { text: '@synchronized原理', link: '/锁/03-@synchronized原理.md' },
          ],
        },
        {
          text: 'UI框架',
          collapsible: true,
          children: [],
        },
        {
          text: '绘制',
          collapsible: true,
          children: [
            { text: 'T0代码执行阶段', link: '/绘制/01-T0代码执行阶段.md' },
            { text: 'T1Layout阶段', link: '/绘制/02-T1Layout阶段.md' },
            { text: 'T2Display阶段', link: '/绘制/03-T2Display阶段.md' },
            { text: 'T3Commit阶段', link: '/绘制/04-T3Commit阶段.md' },
            { text: 'T4RenderServer阶段', link: '/绘制/05-T4RenderServer阶段.md' },
            { text: 'T5GPU渲染阶段', link: '/绘制/06-T5GPU渲染阶段.md' },
            { text: 'CPU绘制vsGPU绘制', link: '/绘制/07-CPU绘制vsGPU绘制.md' },
            { text: 'iOS绘制框架分层架构', link: '/绘制/08-iOS绘制框架分层架构.md' },
          ],
        },
        {
          text: 'RunLoop',
          collapsible: true,
          children: [
            { text: 'Runloop', link: '/RunLoop/Runloop.md' },
            { text: 'Runloop 与绘制', link: '/RunLoop/02-Runloop与绘制.md' },
          ],
        },
        {
          text: '网络',
          collapsible: true,
          children: [
            { text: 'HTTPS', link: '/网络/01-HTTPS.md' },
            { text: 'TCP 报文结构', link: '/网络/02-TCP报文结构.md' },
          ],
        },
      ],
    },
  }),
  
  // 开发服务器配置
  port: 8080,
  open: false,
})
