/*
 * @Author       : HCLonely
 * @Date         : 2021-11-05 10:43:43
 * @LastEditTime : 2025-08-18 19:03:47
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/types/SteamWeb.d.ts
 */

declare interface areas {
  currentArea?: string
  areas?: Array<string>
}

declare interface followGameRequestData {
  sessionid: string
  appid: string
  unfollow?: string
}

declare interface announcementParams {
  authWgToken?: string
  clanId?: string
  gid?: string
}

declare interface steamTasksParam {
  groups?: Array<string>
  officialGroups?: Array<string>
  wishlists?: Array<string>
  follows?: Array<string>
  forums?: Array<string>
  workshops?: Array<string>
  curators?: Array<string>
  workshopVotes?: Array<string>
  curatorLikes?: Array<string>
  announcements?: Array<string>
  licenseLinks?: Array<string>
  playtestLinks?: Array<string>
  playTimeLinks?: Array<string>
}
declare interface storeTokenParam {
  steamID: string
  nonce: string
  redir: string
  auth: string
}
