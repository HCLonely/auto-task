/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 17:09:58
 * @LastEditTime : 2026-09-28 17:14:18
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/modules/social/index.ts
 * @Description  : 社交平台模块统一导出
 */

/** Unified imports without ambiguous wildcard exports from independent modules. */
export { Social, SocialAdapter } from './social';
export type { SocialModule, SocialStatusEvent, InitResult, SocialTaskResult, SocialTaskDetailResult } from './social';
export { default as Steam, handleSteamAuthPage } from './steam';
export { default as SteamWeb } from './steam/steamWeb';
export { default as SteamASF } from './steam/steamASF';
export { default as Vk } from './vk';
export { default as Twitch, handleTwitchAuthPage } from './twitch';
export { default as Twitter } from './twitter';
export { default as Reddit } from './reddit';
export { default as Youtube } from './youtube';
export type { SteamOptions } from './steam';
export type { VkOptions } from './vk';
export type { TwitchOptions } from './twitch';
export type { TwitterOptions } from './twitter';
export type { RedditOptions } from './reddit';
export type { YoutubeOptions } from './youtube';
