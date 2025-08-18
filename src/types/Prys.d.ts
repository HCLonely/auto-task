/*
 * @Author       : HCLonely
 * @Date         : 2021-12-24 15:52:25
 * @LastEditTime : 2025-08-18 19:03:25
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/types/Prys.d.ts
 */

declare function checkClick(prarm: number): void
declare function getURLParameter(prarm: string): string
declare function showAlert(prarm1: string, prarm2: string): void
declare function captchaCheck(): void

interface prysSocialTasks {
  steam: {
    groupLinks: Array<string>
    curatorLinks: Array<string>
    wishlistLinks: Array<string>
    followLinks: Array<string>
  }
  youtube: {
    channelLinks: Array<string>
  }
}
declare interface prysGMTasks {
  tasks: prysSocialTasks
  time: number
}
