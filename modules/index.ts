/** Unified imports without ambiguous wildcard exports from independent modules. */
export { Social, SocialAdapter, SocialManager } from './social';
export type { SocialModule, SocialStatusEvent, ManagerStatusEvent, InitResult, SocialTaskResult, SocialTaskDetailResult } from './social';
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
