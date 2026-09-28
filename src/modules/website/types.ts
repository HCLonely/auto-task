/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 17:09:58
 * @LastEditTime : 2026-09-28 17:35:44
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/modules/website/types.ts
 * @Description  : 网站任务、配置与社交平台交互类型定义
 */

export interface fawTaskInfo {
  id: string
  title: string
  social?: string
  type?: string
  data?: string
}

export interface fawUserData {
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

export interface giveawayHopperReturnTaskInfo {
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
  group_id?: string | number;
  invite_code?: string;
}

export interface vlootData {
  Data: Array<{
    title: string
    link: string
  }>
  Success: boolean
}

export interface instagramWebTasks {
  userLinks?: Array<string>
}

export interface redditWebTasks {
  redditLinks?: Array<string>
}

export interface steamWebTasks {
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
  playTimeLinks?: Array<string>
  playtestLinks?: Array<string>
}

export interface twitchWebTasks {
  channelLinks?: Array<string>
}

export interface twitterWebTasks {
  userLinks?: Array<string>
  retweetLinks?: Array<string>
  likeLinks?: Array<string>
}

export interface vkWebTasks {
  nameLinks?: Array<string>
}

export interface youtubeWebTasks {
  channelLinks?: Array<string>
  videoLinks?: Array<string>
}

export interface extraTasks {
  [name: string]: Array<string>
}

export interface WebsiteTask {
  done: boolean
  social: string
  type: string
  link: string
  id?: string | number
  title?: string
  data?: string
  minutes?: number
  [key: string]: unknown
}

/**
 * 处理无法识别的网站任务。
 *
 * @param task - 当前任务数据。
 */
export type WebsiteUnknownTaskHandler = (task: WebsiteTask) => void

export interface WebsiteStoredTasks {
  tasks: Array<WebsiteTask>
  time: number
}

export interface LegacyWebsiteTasks {
  [social: string]: Array<string> | {
    [type: string]: Array<string>
  }
}

export type WebsiteStoredTasksInput = WebsiteStoredTasks | {
  tasks: LegacyWebsiteTasks
  time: number
}

export interface WebsiteSocialPayload {
  instagram?: instagramWebTasks
  twitch?: twitchWebTasks
  twitter?: twitterWebTasks
  vk?: vkWebTasks
  youtube?: youtubeWebTasks
  reddit?: redditWebTasks
  steam?: steamWebTasks
  links?: Array<string>
  extra?: Record<string, Array<WebsiteTask>>
}

export interface SocialToggleDetailResult {
  success: boolean
  results: Record<string, Record<string, boolean>>
}

export type SocialToggleResult = boolean | SocialToggleDetailResult

export interface bindReturn {
  name: string
  result: boolean | 'skip'
}

export interface socialInitialized {
  instagram: boolean | 'skip'
  reddit: boolean | 'skip'
  twitch: boolean | 'skip'
  twitter: boolean | 'skip'
  vk: boolean | 'skip'
  youtube: boolean | 'skip'
  steamStore: boolean | 'skip'
  steamCommunity: boolean | 'skip'
}

export interface WebsiteButton {
  name: string;
  /**
   * 执行指定任务动作。
   *
   * @returns 处理结果（void | Promise<void>）。
   */
  action: () => void | Promise<void>;
}

export interface WebsiteOptions {
  [key: string]: any;
}

export interface Website {
  name: string;
  /**
   * 检查当前页面是否属于此网站处理器支持的页面。
   *
   * @returns 检查结果；满足条件时为 true，否则为 false。
   */
  test: () => boolean;
  /**
   * 执行操作前的处理逻辑。
   *
   * @returns 在操作完成后兑现的 Promise。
   */
  before?: () => Promise<void>;
  /**
   * 执行操作后的处理逻辑。
   *
   * @returns 在操作完成后兑现的 Promise。
   */
  after?: () => Promise<void>;
  /**
   * 执行指定任务。
   *
   * @returns 处理结果（void | Promise<void>）。
   */
  doTask?: () => void | Promise<void>;
  /**
   * 撤销指定任务。
   *
   * @returns 处理结果（void | Promise<void>）。
   */
  undoTask?: () => void | Promise<void>;
  buttons?: string[];
  options?: WebsiteOptions;
  [key: string]: any;
}

export interface AuthData {
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

export type WebsiteType =
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

export interface WebsiteClass {
  /**
   * 约定网站处理器的实例创建接口。
   *
   * @returns 创建的网站任务处理器实例。
   */
  new(): Website;
  /**
   * 检查当前页面是否属于此网站处理器支持的页面。
   *
   * @returns 检查结果；满足条件时为 true，否则为 false。
   */
  test(): boolean;
}
