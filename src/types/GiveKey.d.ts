/*
 * @Author       : HCLonely
 * @Date         : 2021-12-24 15:48:27
 * @LastEditTime : 2025-08-18 19:02:42
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/types/GiveKey.d.ts
 */

declare interface gkSocialTasks {
  steam: {
    groupLinks: Array<string>
    wishlistLinks: Array<string>
    curatorLinks: Array<string>
    curatorLikeLinks: Array<string>
  }
  twitter: {
    userLinks: Array<string>
  }
  vk: {
    nameLinks: Array<string>
  }
  discord: {
    serverLinks: Array<string>
  }
}
declare interface gkGMTasks {
  tasks: gkSocialTasks
  time: number
}
