/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 16:24:42
 * @LastEditTime : 2026-09-28 17:14:18
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/scripts/social/types.ts
 * @Description  : 社交平台任务、授权与缓存类型定义
 */

export interface socialTasks {
  users?: Array<string>
  reddits?: Array<string>
  channels?: Array<string>
  retweets?: Array<string>
  likes?: Array<string>
  names?: Array<string>
  groups?: Array<string>
  officialGroups?: Array<string>
  publics?: Array<string>
  walls?: Array<string>
  wishlists?: Array<string>
  follows?: Array<string>
  forums?: Array<string>
  workshops?: Array<string>
  curators?: Array<string>
  workshopVotes?: Array<string>
  curatorLikes?: Array<string>
  announcements?: Array<string>
  licenses?: Array<string>
  playtests?: Array<string>
  playTime?: Array<string>
}

export type socialType = 'instagram' | 'reddit' | 'steam' | 'twitch' | 'twitter' | 'vk' | 'youtube'

export type taskTypes = 'users' | 'reddits' | 'channels' | 'retweets' | 'likes' | 'names' | 'groups' | 'officialGroups' | 'publics' | 'walls' |
  'wishlists' | 'follows' | 'forums' | 'workshops' | 'curators' | 'workshopVotes' | 'curatorLikes' | 'announcements' | 'licenses' | 'playtests' | 'playTime'

export interface instagramTasks {
  users: Array<string>
}

export interface redditTasks {
  reddits: Array<string>
}

export interface steamTasks {
  groups: Array<string>
  officialGroups: Array<string>
  wishlists: Array<string>
  follows: Array<string>
  forums: Array<string>
  workshops: Array<string>
  curators: Array<string>
  workshopVotes: Array<string>
  curatorLikes: Array<string>
  announcements: Array<string>
  licenses: Array<string>
  playtests: Array<string>
  playTime: Array<string>
}

export interface twitchTasks {
  channels: Array<string>
}

export interface twitterTasks {
  users: Array<string>
  retweets: Array<string>
  likes: Array<string>
}

export interface vkTasks {
  names: Array<string>
}

export interface youtubeTasks {
  channels: Array<string>
  likes: Array<string>
}

export interface whiteList {
  instagram?: instagramTasks
  twitch?: twitchTasks
  twitter?: twitterTasks
  vk?: vkTasks
  youtube?: youtubeTasks
  reddit?: redditTasks
  steam?: steamTasks
}

export interface auth {
  token?: string
  csrftoken?: string
  hash?: string
  auth?: string
  authToken?: string
  clientId?: string
  deviceId?: string
  clientVersion?: string
  clientSessionId?: string
  ct0?: string
  isLogin?: boolean
  PAPISID?: string
  storeSessionID?: string
  communitySessionID?: string
  steam64Id?: string
  userName?: string
  xSuperProperties?: string
}

export interface cache {
  [name: string]: string
}

export type steamCacheTypes = 'group' | 'officialGroup' | 'forum' | 'workshop' | 'curator'

export interface steamCache {
  group: cache
  officialGroup: cache
  forum: cache
  workshop: cache
  curator: cache
}
