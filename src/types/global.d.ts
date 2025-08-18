/*
 * @Author       : HCLonely
 * @Date         : 2021-10-13 13:18:21
 * @LastEditTime : 2025-08-18 19:02:54
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/types/global.d.ts
 */

declare global {

  interface GlobalThis {
    Xresponse: undefined | JQuery;
  }
  interface Window {
    __allLogs: any[];
    GLOBAL_ENV: Record<string, string>;
    STYLE: HTMLElement
    DEBUG: boolean
    TRACE: boolean
    commonOptions: {
      headers?: {
        'Client-ID': string
        'Device-ID': string
      }
    };
    __twilightBuildID: string;
    Twitter: any;
  }

  interface Array<T> {
    at(index: number): T | undefined;
  }

  interface MonkeyXhrResponse {
    finalUrl: string
    readyState: number
    status: number
    statusText: string
    responseHeadersText: string
    responseHeaders: any
    response: any
    responseXML: Document
    responseText: string
  }
  interface MonkeyXhrBasicDetails {
    method: 'GET' | 'POST' | 'HEAD' | 'DELETE'
    url: string
    headers?: { [name: string]: string },
    data?: string | FormData
    binary?: boolean
    timeout?: number
    nochche?: boolean
    context?: any
    responseType?: 'arraybuffer' | 'blob' | 'json'
    overrideMimeType?: string
    anonymous?: boolean
    fetch?: boolean
    username?: string
    password?: string,
    redirect?: 'follow' | 'error' | 'manual'
  }
  interface MonkeyXhrDetails extends MonkeyXhrBasicDetails {
    onabort?: () => void
    onerror?: (response: MonkeyXhrResponse) => void
    onloadstart?: (response: MonkeyXhrResponse) => void
    onprogress?: (response: MonkeyXhrResponse) => void
    onreadystatechange?: (response: MonkeyXhrResponse) => void
    ontimeout?: (response: MonkeyXhrResponse) => void
    onload?: (response: MonkeyXhrResponse) => void
  }
  interface httpRequestOptions extends MonkeyXhrDetails {
    dataType?: 'arraybuffer' | 'blob' | 'json'
  }
  interface httpResponse {
    result: string
    statusText: string
    status: number
    options: httpRequestOptions
    data?: MonkeyXhrResponse
    error?: Error
  }
  interface socialTasks {
    servers?: Array<string>
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
  type socialType = 'discord' | 'instagram' | 'reddit' | 'steam' | 'twitch' | 'twitter' | 'vk' | 'youtube'
  type taskTypes = 'servers' | 'users' | 'reddits' | 'channels' | 'retweets' | 'likes' | 'names' | 'groups' | 'officialGroups' | 'publics' | 'walls' |
    'wishlists' | 'follows' | 'forums' | 'workshops' | 'curators' | 'workshopVotes' | 'curatorLikes' | 'announcements' | 'licenses' | 'playtests' | 'playTime'

  interface discordTasks {
    servers: Array<string>
  }
  interface instagramTasks {
    users: Array<string>
  }
  interface redditTasks {
    reddits: Array<string>
  }
  interface steamTasks {
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
  interface twitchTasks {
    channels: Array<string>
  }
  interface twitterTasks {
    users: Array<string>
    retweets: Array<string>
    likes: Array<string>
  }
  interface vkTasks {
    names: Array<string>
  }
  interface youtubeTasks {
    channels: Array<string>
    likes: Array<string>
  }
  interface whiteList {
    discord?: discordTasks
    instagram?: instagramTasks
    twitch?: twitchTasks
    twitter?: twitterTasks
    vk?: vkTasks
    youtube?: youtubeTasks
    reddit?: redditTasks
    steam?: steamTasks
  }
  interface auth {
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
  interface cache {
    [name: string]: string
  }
  type steamCacheTypes = 'group' | 'officialGroup' | 'forum' | 'workshop' | 'curator'

  interface steamCache {
    group: cache
    officialGroup: cache
    forum: cache
    workshop: cache
    curator: cache
  }

  interface logStatus {
    font?: JQuery
    success: (text?: string, html?: boolean) => logStatus
    error: (text?: string, html?: boolean) => logStatus
    warning: (text?: string, html?: boolean) => logStatus
    info: (text?: string, html?: boolean) => logStatus
    view: (text?: string, html?: boolean) => logStatus
  }

  interface gmInfo {
    scriptHandler: string
    version: string
    script: {
      version: string
      name: string
      'run-at': string
    }
  }

  function GM_addValueChangeListener<T>(key: string, callback: (key: string, old_value: T, new_value: T, remote: boolean) => void): number
  function GM_removeValueChangeListener(listenerId: number): void

  function sha1(value: string): string

  interface commonObject {
    [key: string]: any
  }

  interface Navigator {
    userAgentData?: {
      platform: string;
      brands: Array<{
        brand: string;
        version: string;
      }>;
    };
  }
}

export { };
