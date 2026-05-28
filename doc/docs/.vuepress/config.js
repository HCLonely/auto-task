import { viteBundler } from '@vuepress/bundler-vite'
import { defaultTheme } from '@vuepress/theme-default'

export default {
  bundler: viteBundler(),
  locales: {
    '/': {
      lang: 'zh-CN',
      title: 'Auto Task',
      description: '自动完成赠key站任务',
    },
    '/en/': {
      lang: 'en-US',
      title: 'Auto Task',
      description: 'Automatically complete giveaway tasks',
    },
  },
  theme: defaultTheme({
    sidebarDepth: 2,
    sidebar: 'auto',
    lastUpdated: true,
    repo: 'HCLonely/auto-task',
    repoLabel: 'Github',
    docsRepo: 'HCLonely/auto-task-doc',
    docsDir: 'docs',
    docsBranch: 'main',
    editLink: true,
    locales: {
      '/': {
        selectLanguageName: '简体中文',
        selectLanguageText: 'Languages',
        selectLanguageAriaLabel: 'Languages',
        editLinkText: '在 GitHub 上编辑此页',
        lastUpdatedText: '上次更新',
        navbar: [
          { text: '首页', link: '/' },
          { text: '指南', link: '/guide/' },
          { text: '常见问题', link: '/FAQ/' },
          { text: '反馈', link: '/feedback/' },
          { text: '参与开发', link: '/dev/' },
          { text: '更新日志', link: '/logs/' },
          { text: '其他脚本', link: '/other/' },
        ],
      },
      '/en/': {
        selectLanguageName: 'English',
        selectLanguageText: '更改语言',
        selectLanguageAriaLabel: '更改语言',
        editLinkText: 'Edit this page on GitHub',
        lastUpdatedText: 'Last Updated',
        navbar: [
          { text: 'Home', link: '/en/' },
          { text: 'Guide', link: '/en/guide/' },
          { text: 'Q&A', link: '/en/FAQ/' },
          { text: 'Feedback', link: '/en/feedback/' },
          { text: 'Contribute', link: '/en/dev/' },
          { text: 'Logs', link: '/en/logs/' },
        ],
      },
    },
  }),
}
