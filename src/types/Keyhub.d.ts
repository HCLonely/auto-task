/*
 * @Author       : HCLonely
 * @Date         : 2021-12-24 15:50:42
 * @LastEditTime : 2025-08-18 19:03:01
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/types/Keyhub.d.ts
 */

interface khSocialTasks {
  steam: {
    groupLinks: Array<string>
    officialGroupLinks: Array<string>
    wishlistLinks: Array<string>
    curatorLinks: Array<string>
  }
  discord: {
    serverLinks: Array<string>
  }
  extra: {
    videoTasks: Array<string>
  }
  links: Array<string>
}
declare interface khGMTasks {
  tasks: khSocialTasks
  time: number
}

declare function VerifyTasks(value: string): void
