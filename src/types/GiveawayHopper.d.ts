/*
 * @Author       : HCLonely
 * @Date         : 2021-11-08 10:43:23
 * @LastEditTime : 2025-08-18 19:02:30
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/types/GiveawayHopper.d.ts
 */

declare interface giveawayHopperSocialTasks {
  steam: {
    groupLinks: Array<string>
    wishlistLinks: Array<string>
    followLinks: Array<string>
    curatorLinks: Array<string>
    curatorLikeLinks: Array<string>
  }
  twitter: {
    userLinks: Array<string>
    retweetLinks: Array<string>
  }
  twitch: {
    channelLinks: Array<string>
  }
  discord: {
    serverLinks: Array<string>
  }
  youtube: {
    channelLinks: Array<string>
  }
  extra: {
    giveawayHopper: Array<string>
  }
}
declare interface giveawayHopperGMTasks {
  tasks: giveawayHopperSocialTasks
  time: number
}
declare interface giveawayHopperTaskInfo {
  id: string
  title: string
  done: boolean
  link: string
  social?: string
  type?: string
}
declare interface giveawayHopperReturnTaskInfo {
  id: number;
  name: string;
  isPlatform: boolean;
  colors: string[];
  tickets: number;
  category: string;
  type: string;
  displayName: string;
  targetName: string;
  creator: number;
  required: number;
  isDone: boolean;
  requiredPlatform: string | null;
  requiresVisit: boolean;
  link: string;
  hash: string;
  username: string;
}
