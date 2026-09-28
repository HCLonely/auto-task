import { defineConfig } from 'vitepress'

const editLinkPattern = 'https://github.com/HCLonely/auto-task/edit/main/doc/docs/:path'

const zhNav = [
  { text: '首页', link: '/' },
  { text: '指南', link: '/guide/' },
  { text: '常见问题', link: '/FAQ/' },
  { text: '反馈', link: '/feedback/' },
  { text: '参与开发', link: '/dev/' },
  { text: 'TSDoc', link: '/tsdoc/' },
  { text: '更新日志', link: '/logs/' },
  { text: '其他脚本', link: '/other/' },
]

const enNav = [
  { text: 'Home', link: '/en/' },
  { text: 'Guide', link: '/en/guide/' },
  { text: 'Q&A', link: '/en/FAQ/' },
  { text: 'Feedback', link: '/en/feedback/' },
  { text: 'Contribute', link: '/en/dev/' },
  { text: 'TSDoc', link: '/tsdoc/' },
  { text: 'Logs', link: '/en/logs/' },
]

// Keep the existing README sources, sync scripts and directory URLs.
export default defineConfig({
  title: 'Auto Task',
  lastUpdated: true,
  rewrites: id => id.replace(/(^|\/)README\.md$/, '$1index.md'),
  head: [['link', { rel: 'icon', href: '/favicon.ico' }]],
  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      description: '自动完成赠key站任务脚本',
      themeConfig: {
        nav: zhNav,
        sidebar: [{ text: '文档', items: zhNav.slice(1) }],
        outline: { level: [2, 3], label: '页面导航' },
        editLink: { pattern: editLinkPattern, text: '在 GitHub 上编辑此页' },
        lastUpdated: { text: '上次更新' },
        docFooter: { prev: '上一页', next: '下一页' },
        sidebarMenuLabel: '菜单',
        returnToTopLabel: '返回顶部',
        darkModeSwitchLabel: '外观',
        langMenuLabel: '更改语言',
      },
    },
    en: {
      label: 'English',
      lang: 'en-US',
      description: 'Automatically complete giveaway tasks',
      themeConfig: {
        nav: enNav,
        sidebar: [{ text: 'Documentation', items: enNav.slice(1) }],
        outline: { level: [2, 3], label: 'On this page' },
        editLink: { pattern: editLinkPattern, text: 'Edit this page on GitHub' },
        lastUpdated: { text: 'Last Updated' },
      },
    },
  },
  themeConfig: {
    socialLinks: [{ icon: 'github', link: 'https://github.com/HCLonely/auto-task' }],
    footer: {
      message: 'MIT Licensed',
      copyright: `Copyright © 2020-${new Date().getFullYear()} by HCLonely`,
    },
  },
})
