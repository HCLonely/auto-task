/*
 * @Author       : HCLonely
 * @Date         : 2021-11-04 17:37:43
 * @LastEditTime : 2025-08-18 19:02:22
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/types/Freeanywhere.d.ts
 */
declare interface fawTaskInfo {
  id: string
  title: string
  social?: string
  type?: string
  data?: string
}

declare interface fawUserData {
  tasks?: WebsiteTask[]
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
