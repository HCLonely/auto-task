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
  action: () => void | Promise<void>;
}

export interface WebsiteOptions {
  [key: string]: any;
}

export interface Website {
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
  new(): Website;
  test(): boolean;
}
