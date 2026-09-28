/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 17:09:58
 * @LastEditTime : 2026-09-28 17:35:45
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/modules/social/steam/types.ts
 * @Description  : Steam 类型定义
 */

import type SteamASF from './steamASF';
import type SteamWeb from './steamWeb';
import type { GMAuthAPI, GMStorageAPI, HttpClient, SteamStatusEvent } from './steamWeb/types';

export type { HttpClient, HttpRequestOptions, HttpResponse, GMAuthAPI, GMStorageAPI } from './steamWeb/types';
export type InitType = 'all' | 'store' | 'community';
export type TaskType = 'groups' | 'officialGroups' | 'wishlists' | 'follows' | 'forums' | 'workshops' |
  'workshopVotes' | 'curators' | 'curatorLikes' | 'announcements' | 'licenses' | 'playtests' | 'playTime';
export type SteamTasks = Record<TaskType, string[]>;
export type TaskFlags = Record<Exclude<TaskType, 'curatorLikes'>, boolean>;
export type LinkType = 'groupLinks' | 'officialGroupLinks' | 'wishlistLinks' | 'followLinks' | 'forumLinks' |
  'workshopLinks' | 'workshopVoteLinks' | 'curatorLinks' | 'curatorLikeLinks' | 'announcementLinks' |
  'licenseLinks' | 'playtestLinks' | 'playTimeLinks';
export type SteamTaskOptions = Partial<Record<LinkType, string[]>>;
export interface SteamTaskDetailResult {
  success: boolean;
  results: Partial<Record<LinkType, Record<string, boolean>>>;
}
export type SteamTaskResult = boolean | SteamTaskDetailResult;
export interface ASFOptions {
  AsfEnabled: boolean;
  AsfIpcUrl: string;
  AsfIpcPassword: string;
  AsfBotname: string;
  steamWeb: boolean;
  preferASF: boolean;
  steamWebApiKey: string;
}
export interface SteamOptions {
  http: HttpClient;
  gm?: GMStorageAPI & Partial<GMAuthAPI>;
  namespace?: string;
  ASF?: Partial<ASFOptions>;
  doTask?: Partial<TaskFlags>;
  undoTask?: Partial<TaskFlags>;
  whiteList?: Partial<SteamTasks>;
  autoChangeRegion?: boolean;
  authTimeoutMs?: number;
  /** Delay between tasks; defaults to the original 1000 ms. */
  taskDelayMs?: number;
  playRetryDelayMs?: number;
  /** URL recorded with play-time tasks. Defaults to the current page URL. */
  taskUrl?: string;
}
export interface PlayState {
  stopPlayTime: number;
  playedGames: string[];
  taskLink: string[];
}
export interface SteamEvent extends SteamStatusEvent {
  readonly source: 'steam' | 'steamWeb' | 'steamASF';
}
/**
 * 接收 Steam 状态事件。
 *
 * @param event - 事件名称或事件对象。
 * @returns 处理结果（void | Promise<void>）。
 */
export type SteamListener = (event: SteamEvent) => void | Promise<void>;
export type Executor = { source: 'steamWeb'; client: SteamWeb; ready: Set<'store' | 'community'> } |
  { source: 'steamASF'; client: SteamASF; ready: Set<'store' | 'community'> };
