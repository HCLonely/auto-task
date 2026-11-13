/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 17:09:58
 * @LastEditTime : 2026-09-28 17:38:06
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/modules/website/taskModel.ts
 * @Description  : 网站任务模型转换、去重与执行筛选
 */

import type { LegacyWebsiteTasks, WebsiteSocialPayload, WebsiteStoredTasksInput, WebsiteTask } from './types';
const LEGACY_TYPE_MAP: Record<string, string> = {
  groupLinks: 'group',
  officialGroupLinks: 'officialGroup',
  wishlistLinks: 'wishlist',
  followLinks: 'follow',
  forumLinks: 'forum',
  workshopLinks: 'workshop',
  workshopVoteLinks: 'workshopVote',
  curatorLinks: 'curator',
  curatorLikeLinks: 'curatorLike',
  announcementLinks: 'announcement',
  licenseLinks: 'license',
  playTimeLinks: 'playtime',
  playtestLinks: 'playtest',
  redditLinks: 'post',
  channelLinks: 'channel',
  userLinks: 'user',
  retweetLinks: 'retweet',
  likeLinks: 'like',
  nameLinks: 'user',
  website: 'website',
  visitLink: 'visit',
  videoTasks: 'video',
  gleam: 'gleam',
  giveawayHopper: 'giveawayHopper'
};

const SOCIAL_PAYLOAD_TYPE_MAP: Record<string, string> = {
  'steam.group': 'groupLinks',
  'steam.officialGroup': 'officialGroupLinks',
  'steam.wishlist': 'wishlistLinks',
  'steam.follow': 'followLinks',
  'steam.forum': 'forumLinks',
  'steam.workshop': 'workshopLinks',
  'steam.workshopVote': 'workshopVoteLinks',
  'steam.curator': 'curatorLinks',
  'steam.curatorLike': 'curatorLikeLinks',
  'steam.announcement': 'announcementLinks',
  'steam.license': 'licenseLinks',
  'steam.playtime': 'playTimeLinks',
  'steam.playtest': 'playtestLinks',
  'reddit.post': 'redditLinks',
  'twitch.channel': 'channelLinks',
  'twitter.user': 'userLinks',
  'twitter.retweet': 'retweetLinks',
  'twitter.like': 'likeLinks',
  'vk.user': 'nameLinks',
  'vk.like': 'nameLinks',
  'youtube.channel': 'channelLinks',
  'youtube.like': 'videoLinks'
};

/** GFF 支持范围独立于普通模块，指南关注不扩展 Steam 真实接口。 */
const GFF_PAYLOAD_TYPE_MAP: Record<string, string> = {
  'steam.follow': 'followLinks',
  'steam.curator': 'curatorLinks',
  'steam.guide': 'guideLinks',
  'steam.workshop': 'workshopLinks',
  'youtube.channel': 'channelLinks',
  'youtube.like': 'videoLinks'
};

/**
 * 检查数据是否符合网站任务结构。
 *
 * @param value - 待处理的值。
 * @returns 检查结果；满足条件时为 true，否则为 false。
 */
const isWebsiteTask = (value: unknown): value is WebsiteTask => {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const task = value as Partial<WebsiteTask>;
  return typeof task.done === 'boolean' &&
    typeof task.social === 'string' && task.social !== 'discord' &&
    typeof task.type === 'string' &&
    typeof task.link === 'string' &&
    (!('GFF' in task) || typeof task.GFF === 'boolean') &&
    (!('minutes' in task) || typeof task.minutes === 'number') &&
    (!('id' in task) || typeof task.id === 'string' || typeof task.id === 'number') &&
    (!('title' in task) || typeof task.title === 'string') &&
    (!('data' in task) || typeof task.data === 'string');
};

/**
 * 规范化游戏时长任务的数据结构。
 *
 * @param social - 社交平台实例或名称。
 * @param type - 操作或数据类型。
 * @param value - 待处理的值。
 * @param done - 操作结束回调。
 * @returns 处理结果（WebsiteTask）。
 */
const normalizePlaytimeTask = (
  social: string,
  type: string,
  value: string,
  done: boolean
): WebsiteTask => {
  if (social !== 'steam' || type !== 'playtime') {
    return {
      done,
      social,
      type,
      link: value
    };
  }
  const match = value.match(/^(\d+(?:\.\d+)?)-(https?:\/\/.+)$/);
  if (!match) {
    return {
      done,
      social,
      type,
      link: value
    };
  }
  return {
    done,
    social,
    type,
    link: match[2],
    minutes: Number(match[1])
  };
};

/**
 * 将旧版任务数据转换为统一任务模型。
 *
 * @param tasks - 待处理的任务集合。
 * @param done - 操作结束回调；默认值为 `true`。
 * @returns 处理后的数据列表。
 */
const normalizeLegacyTasks = (
  tasks: LegacyWebsiteTasks,
  done = true
): Array<WebsiteTask> => {
  const result: Array<WebsiteTask> = [];
  for (const [social, legacyTypes] of Object.entries(tasks)) {
    if (social === 'discord') {
      continue;
    }
    if (Array.isArray(legacyTypes)) {
      for (const link of legacyTypes) {
        result.push({
          done,
          social: social === 'links' ? 'links' : 'extra',
          type: social === 'links' ? 'visit' : social,
          link
        });
      }
      continue;
    }
    for (const [legacyType, links] of Object.entries(legacyTypes)) {
      const type = LEGACY_TYPE_MAP[legacyType] || legacyType.replace(/Links$/, '');
      for (const link of links) {
        result.push(normalizePlaytimeTask(social, type, link, done));
      }
    }
  }
  return result;
};

/**
 * 将已存储任务转换为统一任务模型。
 *
 * @param value - 待处理的值；可省略。
 * @returns 处理后的数据列表。
 */
const normalizeStoredTasks = (
  value?: WebsiteStoredTasksInput | null
): Array<WebsiteTask> => {
  if (!value?.tasks) {
    return [];
  }
  if (Array.isArray(value.tasks)) {
    return value.tasks.filter(isWebsiteTask);
  }
  return normalizeLegacyTasks(value.tasks, true);
};

/**
 * 生成用于识别重复网站任务的键。
 *
 * @param task - 当前任务数据。
 * @returns 处理后的字符串。
 */
const getTaskKey = (task: WebsiteTask): string => {
  return JSON.stringify([
    task.done,
    task.social,
    task.type,
    task.link,
    task.GFF === true,
    task.minutes ?? null,
    task.id ?? null,
    task.data ?? null
  ]);
};

/**
 * 根据任务键去除重复的网站任务。
 *
 * @param tasks - 待处理的任务集合。
 * @returns 处理后的数据列表。
 */
const uniqueWebsiteTasks = (tasks: Array<WebsiteTask>): Array<WebsiteTask> => {
  const seen = new Set<string>();
  return tasks.filter((task) => {
    if (task.social === 'discord') {
      return false;
    }
    const key = getTaskKey(task);
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
};

/**
 * 根据执行或撤销选项筛选网站任务。
 *
 * @param tasks - 待处理的任务集合。
 * @param action - 待执行的动作。
 * @returns 处理后的数据列表。
 */
const selectTasksForAction = (
  tasks: Array<WebsiteTask>,
  action: 'do' | 'undo'
): Array<WebsiteTask> => {
  return tasks.filter((task) => {
    return (
      task.social !== 'discord' && (action === 'do' ? !task.done : task.done)
    );
  });
};

/**
 * 将网站任务转换为社交平台模块的输入数据。
 *
 * @param tasks - 待处理的任务集合。
 * @param onUnknownTask - 处理未知任务的回调。
 * @returns 处理结果（WebsiteSocialPayload）。
 */
const toSocialPayload = (
  tasks: Array<WebsiteTask>,
  onUnknownTask: (task: WebsiteTask) => void
): WebsiteSocialPayload => {
  const payload: WebsiteSocialPayload = {};
  for (const task of tasks) {
    if (task.social === 'discord') {
      continue;
    }
    if (task.social === 'extra') {
      payload.extra ||= {};
      payload.extra[task.type] ||= [];
      payload.extra[task.type].push(task);
      continue;
    }
    if (task.social === 'links') {
      payload.links ||= [];
      payload.links.push(task.link);
      continue;
    }
    const payloadType = SOCIAL_PAYLOAD_TYPE_MAP[`${task.social}.${task.type}`];
    if (!payloadType) {
      onUnknownTask(task);
      continue;
    }
    const socialPayloads = payload as Record<string, Record<string, Array<string>>>;
    socialPayloads[task.social] ||= {};
    const socialPayload = socialPayloads[task.social];
    socialPayload[payloadType] ||= [];
    const link = task.type === 'playtime' && task.minutes !== undefined ?
      `${task.minutes}-${task.link}` :
      task.link;
    socialPayload[payloadType].push(link);
  }
  return payload;
};

/**
 * 获取指定平台任务的输入数据项。
 *
 * @param task - 当前任务数据。
 * @returns 处理后的数据对象；未取得有效结果时返回 null。
 */
const getSocialPayloadEntry = (
  task: WebsiteTask
): { type: string; value: string } | null => {
  const payloadType = SOCIAL_PAYLOAD_TYPE_MAP[`${task.social}.${task.type}`];
  if (!payloadType) {
    return null;
  }
  const value = task.type === 'playtime' && task.minutes !== undefined ?
    `${task.minutes}-${task.link}` :
    task.link;
  return {
    type: payloadType,
    value
  };
};

/** 获取 GFF 逐项结果使用的输入键，保留原始链接作为回写键。 */
const getGFFPayloadEntry = (task: WebsiteTask): { type: string; value: string } | null => {
  const type = GFF_PAYLOAD_TYPE_MAP[`${task.social}.${task.type}`];
  if (!type) {
    return null;
  }
  return {
    type,
    value: task.link
  };
};

/** 在链接数组转换前按执行方向分流，保留任务引用与所属集合。 */
const partitionTasksForExecution = (tasks: Array<WebsiteTask>, action: 'do' | 'undo') => {
  const groups = {
    normalTasks: [] as Array<WebsiteTask>,
    steamGFFTasks: [] as Array<WebsiteTask>,
    youtubeGFFTasks: [] as Array<WebsiteTask>,
    unsupportedTasks: [] as Array<WebsiteTask>
  };
  for (const task of tasks) {
    const entry = getGFFPayloadEntry(task);
    if (action === 'do' && task.GFF === true) {
      if (entry && task.social === 'steam') {
        groups.steamGFFTasks.push(task);
      } else if (entry && task.social === 'youtube') {
        groups.youtubeGFFTasks.push(task);
      } else {
        groups.unsupportedTasks.push(task);
      }
    } else if (task.social === 'steam' && task.type === 'guide') {
      groups.unsupportedTasks.push(task);
    } else {
      groups.normalTasks.push(task);
    }
  }
  return groups;
};

/** 同批同类型同原始链接只打开一次，结果可回写到多条网站任务。 */
const toGFFPayload = (tasks: Array<WebsiteTask>): {
  steam?: Record<string, Array<string>>;
  youtube?: Record<string, Array<string>>;
} => {
  const payload: {
    steam?: Record<string, Array<string>>;
    youtube?: Record<string, Array<string>>;
  } = {};
  for (const task of tasks) {
    const entry = getGFFPayloadEntry(task);
    if (!entry || (task.social !== 'steam' && task.social !== 'youtube')) {
      continue;
    }
    const platform = payload[task.social] ||= {};
    const links = platform[entry.type] ||= [];
    if (!links.includes(entry.value)) {
      links.push(entry.value);
    }
  }
  return payload;
};

export {
  getGFFPayloadEntry,
  getSocialPayloadEntry,
  isWebsiteTask,
  normalizeLegacyTasks,
  normalizeStoredTasks,
  partitionTasksForExecution,
  selectTasksForAction,
  toSocialPayload,
  toGFFPayload,
  uniqueWebsiteTasks
};
