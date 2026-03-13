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
  
  // 使用 Vite 作为打包工具
  bundler: viteBundler(),
  
  // 插件配置 - 启用所有图表功能（和 Plume 主题一样）
  plugins: [
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
        // PlantUML UML 图表 - 支持多种代码块标识符
        { name: 'uml', type: 'fence', fence: 'uml' },
        { name: 'plantuml', type: 'fence', fence: 'plantuml' },
        { name: 'puml', type: 'fence', fence: 'puml' },
      ],
    }),
  ],
  
  // 主题配置
  theme: defaultTheme({
    // 导航栏
    navbar: [
      {
        text: '首页',
        link: '/',
      },
    ],
    // 侧边栏配置 - 标题与文件名一致，含数字
    sidebar: {
      '/': [
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
            { text: '01-iOS对象的内存布局', link: '/内存管理/01-iOS对象的内存布局.md' },
            { text: '02-isa指针与类对象元类对象的关系', link: '/内存管理/02-isa指针与类对象元类对象的关系.md' },
            { text: '03-简述ARC的工作原理', link: '/内存管理/03-简述ARC的工作原理.md' },
            { text: '04-循环引用的产生与解决', link: '/内存管理/04-循环引用的产生与解决.md' },
            { text: '05-weak和unowned的区别和使用场景', link: '/内存管理/05-weak和unowned的区别和使用场景.md' },
            { text: '06-SideTable的结构', link: '/内存管理/06-SideTable的结构.md' },
            { text: '07-weak原理', link: '/内存管理/07-weak原理.md' },
          ],
        },
        {
          text: '锁',
          collapsible: true,
          children: [
            { text: '02-iOS中的锁概述', link: '/02-iOS中的锁概述.md' },
            { text: '02-优先级翻转问题', link: '/锁/02-优先级翻转问题.md' },
            { text: '03-@synchronized原理', link: '/锁/03-@synchronized原理.md' },
          ],
        },
        {
          text: 'UI框架',
          collapsible: true,
          children: [
            { text: '01-setNeedsDisplay到屏幕显示的流程', link: '/UI框架/01-setNeedsDisplay到屏幕显示的流程.md' },
            { text: '02-UIView绘制显示原理流程解析以及性能优化', link: '/UI框架/02-UIView绘制显示原理流程解析以及性能优化.md' },
          ],
        },
        {
          text: '绘制',
          collapsible: true,
          children: [
            { text: '01-T0代码执行阶段', link: '/绘制/01-T0代码执行阶段.md' },
            { text: '02-T1Layout阶段', link: '/绘制/02-T1Layout阶段.md' },
            { text: '03-T2Display阶段', link: '/绘制/03-T2Display阶段.md' },
            { text: '04-T3Commit阶段', link: '/绘制/04-T3Commit阶段.md' },
            { text: '05-T4RenderServer阶段', link: '/绘制/05-T4RenderServer阶段.md' },
            { text: '06-T5GPU渲染阶段', link: '/绘制/06-T5GPU渲染阶段.md' },
            { text: '07-CPU绘制vsGPU绘制', link: '/绘制/07-CPU绘制vsGPU绘制.md' },
            { text: '08-iOS绘制框架分层架构', link: '/绘制/08-iOS绘制框架分层架构.md' },
          ],
        },
        {
          text: '网络',
          collapsible: true,
          children: [
            { text: '01-HTTPS', link: '/网络/01-HTTPS.md' },
          ],
        },
      ],
    },
  }),
  
  // 开发服务器配置
  port: 8080,
  open: false,
})
