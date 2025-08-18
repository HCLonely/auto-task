module.exports = {
  locales: {
    '/': {
      lang: 'zh-CN',
      title: 'Auto Task',
      description: '自动完成赠key站任务'
    },
    '/en/': {
      lang: 'en-US',
      title: 'Auto Task',
      description: 'Automatically complete giveaway tasks'
    }
  },
  themeConfig: {
    sidebarDepth: 2,
    sidebar: 'auto',
    displayAllHeaders: true,
    lastUpdated: true,
    themeConfig: {
      nextLinks: false,
      prevLinks: false
    },
    smoothScroll: true,
    repo: 'HCLonely/auto-task',
    repoLabel: 'Github',
    docsRepo: 'HCLonely/auto-task-doc',
    docsDir: 'docs',
    editLinks: true,
    activeHeaderLinks: true,
    locales: {
      '/': {
        label: '简体中文',
        selectText: 'Languages',
        ariaLabel: 'Languages',
        editLinkText: '在 GitHub 上编辑此页',
        lastUpdated: '上次更新',
        nav: [
          { text: '首页', link: '/' },
          { text: '指南', link: '/guide/' },
          { text: '常见问题', link: '/FAQ/' },
          { text: '反馈', link: '/feedback/' },
          { text: '参与开发', link: '/dev/' },
          { text: '更新日志', link: '/logs/' },
          { text: '其他脚本', link: '/other/' }
        ]
      },
      '/en/': {
        label: 'English',
        selectText: '更改语言',
        ariaLabel: '更改语言',
        editLinkText: 'Edit this page on GitHub',
        lastUpdated: 'Last Updated',
        nav: [
          { text: 'Home', link: '/en/' },
          { text: 'Guide', link: '/en/guide/' },
          { text: 'Q&A', link: '/en/FAQ/' },
          { text: 'Feedback', link: '/en/feedback/' },
          { text: 'Contribute', link: '/en/dev/' },
          { text: 'Logs', link: '/en/logs/' }
        ]
      }
    }
  },
  plugins: ['@vuepress/back-to-top']
}
