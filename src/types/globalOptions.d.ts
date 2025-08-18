/*
 * @Author       : HCLonely
 * @Date         : 2021-12-24 17:21:16
 * @LastEditTime : 2025-08-18 19:02:57
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/types/globalOptions.d.ts
 */

interface globalOptions {
  doTask: {
    discord: {
      servers: boolean
    },
    // instagram: {
    //   users: boolean
    // },
    twitch: {
      channels: boolean
    },
    twitter: {
      users: boolean
      retweets: boolean
    },
    vk: {
      names: boolean
    },
    youtube: {
      channels: boolean
      likes: boolean
    },
    reddit: {
      reddits: boolean
    },
    steam: {
      groups: boolean
      officialGroups: boolean
      wishlists: boolean
      follows: boolean
      forums: boolean
      workshops: boolean
      curators: boolean
      workshopVotes: boolean
      announcements: boolean
      licenses: boolean
      playtests: boolean
      playTime: boolean
    }
  },
  undoTask: {
    discord: {
      servers: boolean
    },
    // instagram: {
    //   users: boolean
    // },
    twitch: {
      channels: boolean
    },
    twitter: {
      users: boolean
      retweets: boolean
    },
    vk: {
      names: boolean
    },
    youtube: {
      channels: boolean
      likes: boolean
    },
    reddit: {
      reddits: boolean
    },
    steam: {
      groups: boolean
      officialGroups: boolean
      wishlists: boolean
      follows: boolean
      forums: boolean
      workshops: boolean
      curators: boolean
      playTime: boolean
    }
  },
  ASF: {
    AsfEnabled: boolean
    AsfIpcUrl: string
    AsfIpcPassword: string
    AsfBotname: string
    steamWeb: boolean
    preferASF: boolean
    steamWebApiKey: string
  },
  position: {
    buttonSideX: 'right' | 'left'
    buttonSideY: 'top' | 'bottom'
    buttonDistance: string
    showButtonSideX: 'right' | 'left'
    showButtonSideY: 'top' | 'bottom'
    showButtonDistance: string
    logSideX: 'right' | 'left'
    logSideY: 'top' | 'bottom'
    logDistance: string
  },
  hotKey: {
    doTaskKey: string
    undoTaskKey: string
    toggleLogKey: string
  },
  other: {
    twitterVerifyId: string
    youtubeVerifyChannel: string
    autoUpdateSource: 'github' | 'jsdelivr' | 'standby'
    language: string
    checkLogin: boolean
    checkLeftKey: boolean
    defaultShowButton: boolean
    defaultShowLog: boolean
    debug: boolean
    receivePreview: boolean
  }
}
