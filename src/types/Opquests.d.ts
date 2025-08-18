/*
 * @Author       : HCLonely
 * @Date         : 2021-12-24 15:51:41
 * @LastEditTime : 2025-08-18 19:03:19
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/types/Opquests.d.ts
 */

interface oqSocialTasks {
  steam: {
    groupLinks: Array<string>
    wishlistLinks: Array<string>
    followLinks: Array<string>
    curatorLikeLinks: Array<string>
    playTimeLinks: Array<string>
  }
  twitter: {
    userLinks: Array<string>
    retweetLinks: Array<string>
  }
  discord: {
    serverLinks: Array<string>
  }
}
interface qpqTaskInfo {
  token: string
  taskId: string
  title: string
}
