import { defineUserConfig } from 'vuepress'
import { defaultTheme } from '@vuepress/theme-default'
import { viteBundler } from '@vuepress/bundler-vite'
import { markdownChartPlugin } from '@vuepress/plugin-markdown-chart'

export default defineUserConfig({
  // 语言设置
  lang: 'zh-CN',
  title: 'VuePress 笔记',
  description: 'iOS 开发笔记',
  
  // 使用 Vite 作为打包工具
  bundler: viteBundler(),
  
  // 插件配置
  plugins: [
    markdownChartPlugin({ mermaid: true }),
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
    // 侧边栏配置
    sidebar: {
      '/': [
        {
          text: '内存管理',
          collapsible: true,
          children: [
            '/内存管理/01-iOS对象的内存布局.md',
            '/内存管理/02-isa指针与类对象元类对象的关系.md',
            '/内存管理/03-简述ARC的工作原理.md',
            '/内存管理/04-循环引用的产生与解决.md',
            '/内存管理/05-weak和unowned的区别和使用场景.md',
            '/内存管理/06-SideTable的结构.md',
            '/内存管理/07-weak原理.md',
          ],
        },
        {
          text: '锁',
          collapsible: true,
          children: [
            '/02-iOS中的锁概述.md',
            '/锁/02-优先级翻转问题.md',
            '/锁/03-@synchronized原理.md',
          ],
        },
        {
          text: 'UI框架',
          collapsible: true,
          children: [
            '/UI框架/01-setNeedsDisplay到屏幕显示的流程.md',
            '/UI框架/02-UIView绘制显示原理流程解析以及性能优化.md',
          ],
        },
        {
          text: '绘制',
          collapsible: true,
          children: [
            '/绘制/01-T0代码执行阶段.md',
            '/绘制/02-T1Layout阶段.md',
            '/绘制/03-T2Display阶段.md',
            '/绘制/04-T3Commit阶段.md',
            '/绘制/05-T4RenderServer阶段.md',
            '/绘制/06-T5GPU渲染阶段.md',
            '/绘制/07-CPU绘制vsGPU绘制.md',
            '/绘制/08-iOS绘制框架分层架构.md',
          ],
        },
        {
          text: '网络',
          collapsible: true,
          children: [
            '/网络/01-HTTPS.md',
          ],
        },
      ],
    },
  }),
  
  // 开发服务器配置
  port: 8080,
  open: false,
})
