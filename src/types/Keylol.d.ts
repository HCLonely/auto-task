/*
 * @Author       : HCLonely
 * @Date         : 2021-11-15 15:06:53
 * @LastEditTime : 2025-08-18 19:03:07
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/types/Keylol.d.ts
 */

declare interface keylolSocialTasks {
  steam: {
    groupLinks: Array<string>
    wishlistLinks: Array<string>
    curatorLinks: Array<string>
    curatorLikeLinks: Array<string>
    followLinks: Array<string>
    forumLinks: Array<string>
    announcementLinks: Array<string>
    workshopVoteLinks: Array<string>
    licenseLinks: Array<string>
  },
  discord: {
    serverLinks: Array<string>
  },
  // instagram: {
  //   userLinks: Array<string>
  // },
  vk: {
    nameLinks: Array<string>
  },
  twitch: {
    channelLinks: Array<string>
  },
  reddit: {
    redditLinks: Array<string>
  },
  twitter: {
    userLinks: Array<string>
    retweetLinks: Array<string>
  },
  youtube: {
    channelLinks: Array<string>
    likeLinks: Array<string>
  }
}
