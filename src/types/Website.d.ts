/*
 * @Author       : HCLonely
 * @Date         : 2021-11-05 11:32:20
 * @LastEditTime : 2025-08-18 19:03:53
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/types/Website.d.ts
 * @Description  :
 */

declare interface discordWebTasks {
  serverLinks?: Array<string>
}
declare interface instagramWebTasks {
  userLinks?: Array<string>
}
declare interface redditWebTasks {
  redditLinks?: Array<string>
}
declare interface steamWebTasks {
  groupLinks?: Array<string>
  officialGroupLinks?: Array<string>
  wishlistLinks?: Array<string>
  followLinks?: Array<string>
  forumLinks?: Array<string>
  workshopLinks?: Array<string>
  curatorLinks?: Array<string>
  workshopVoteLinks?: Array<string>
  curatorLikeLinks?: Array<string>
  announcementLinks?: Array<string>
  licenseLinks?: Array<string>
}
declare interface twitchWebTasks {
  channelLinks?: Array<string>
}
declare interface twitterWebTasks {
  userLinks?: Array<string>
  retweetLinks?: Array<string>
  likeLinks?: Array<string>
}
declare interface vkWebTasks {
  nameLinks?: Array<string>
}
declare interface youtubeWebTasks {
  channelLinks?: Array<string>
  likeLinks?: Array<string>
}
declare interface extraTasks {
  [name: string]: Array<string>
}
declare interface webSocialTasks {
  discord?: discordWebTasks
  instagram?: instagramWebTasks
  twitch?: twitchWebTasks
  twitter?: twitterWebTasks
  vk?: vkWebTasks
  youtube?: youtubeWebTasks
  reddit?: redditWebTasks
  steam?: steamWebTasks
  links?: Array<string>
  extra?: extraTasks
}
declare interface bindReturn {
  name: string
  result: boolean | 'skip'
}
declare interface socialInitialized {
  discord: boolean | 'skip'
  instagram: boolean | 'skip'
  reddit: boolean | 'skip'
  twitch: boolean | 'skip'
  twitter: boolean | 'skip'
  vk: boolean | 'skip'
  youtube: boolean | 'skip'
  steamStore: boolean | 'skip'
  steamCommunity: boolean | 'skip'
}

declare function initFunction():Promise<boolean>

interface WebsiteButton {
  name: string;
  action: () => void | Promise<void>;
}

interface WebsiteOptions {
  [key: string]: any;
}

interface Website {
  name: string;
  test: () => boolean;
  before?: () => Promise<void>;
  after?: () => Promise<void>;
  doTask?: () => void | Promise<void>;
  undoTask?: () => void | Promise<void>;
  buttons?: string[];
  options?: WebsiteOptions;
  [key: string]: any;
}

interface AuthData {
  authToken?: string;
  clientVersion?: string;
  clientId?: string;
  deviceId?: string;
  clientSessionId?: string;
  auth?: string;
  storeSessionID?: string;
  steam64Id?: string;
  communitySessionID?: string;
}

type WebsiteType =
  | 'Gleam'
  | 'FreeAnyWhere'
  | 'GiveawaySu'
  | 'Indiedb'
  | 'Keyhub'
  | 'Givekey'
  | 'OpiumPulses'
  | 'Keylol'
  | 'Opquests'
  | 'SweepWidget'
  | 'Setting'
  | 'GiveawayHopper'
  | 'Prys';

interface WebsiteClass {
  new(): Website;
  test(): boolean;
}
