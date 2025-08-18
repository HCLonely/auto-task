/*
 * @Author       : HCLonely
 * @Date         : 2021-11-04 17:37:43
 * @LastEditTime : 2025-08-18 19:02:22
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/types/Freeanywhere.d.ts
 */
declare interface fawSocialTasks {
  steam: {
    groupLinks: Array<string>
    wishlistLinks: Array<string>
    curatorLinks: Array<string>
    followLinks: Array<string>
    playTimeLinks: Array<string>
  }
  vk: {
    nameLinks: Array<string>
  }
  discord: {
    serverLinks: Array<string>
  }
  youtube: {
    channelLinks: Array<string>
  }
  extra: {
    website: Array<string>
  }
}
declare interface fawGMTasks {
  tasks: fawSocialTasks
  time: number
}
declare interface fawTaskInfo {
  id: string
  title: string
  social?: string
  type?: string
  data?: string
}

declare interface fawUserData {
  tasks?: fawSocialTasks
  user?: {
    avatar?: string
    lang?: string
    name?: string
    steam?: string
  }
  games?: Record<string, { playtime_forever: number }>
  settings?: {
    game_update?: number
  }
}
