/*
 * @Author       : HCLonely
 * @Date         : 2026-09-27 20:48:06
 * @LastEditTime : 2026-09-28 17:38:06
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/scripts/social/moduleBridge.ts
 * @Description  : 社交平台模块桥接与任务状态日志绑定
 */

import type { GMAuthAPI } from '../../modules/social/steam';
import type { SocialStatusEvent, StatusListener } from '../../modules/social/social/types';
import echoLog from '../echoLog';
import __ from '../tools/i18n';
import { debug } from '../tools/debug';
import { parseLink, linkTasks } from '../../modules/social/steam/links';
import type { TaskType } from '../../modules/social/steam/types';

/**
 * 生成社交平台模块使用的存储命名空间。
 *
 * @param platform - 社交平台名称。
 * @returns 处理后的字符串。
 */
export const moduleNamespace = (platform: string): string => {
  return `autoTask:${platform}`;
};

/**
 * 通过 GM 存储兼容项目数据，并使用命名空间隔离授权握手。
 *
 * @param platform - 社交平台名称。
 * @returns 处理结果（GMAuthAPI）。
 */
export const projectGM = (platform: string): GMAuthAPI => {
  const namespace = moduleNamespace(platform);
  const legacyKeys: Record<string, string> = {
    [`${namespace}:auth`]: `${platform}Auth`,
    [`${namespace}:cache`]: `${platform}Cache`
  };
  if (platform === 'steam') {
    legacyKeys[`${namespace}:web:cache`] = 'steamCache';
  }
  // Website history is scoped by giveaway; never undo tasks recorded on another page.
  const page = typeof location === 'undefined' ? '' : location.href.split('#')[0];
  /**
   * 生成带命名空间的存储键。
   *
   * @param key - 目标数据的键名。
   * @returns 处理后的字符串。
   */
  const keyFor = (key: string): string => {
    return (key === `${namespace}:tasks` ? `${key}:${encodeURIComponent(page)}` : (legacyKeys[key] || key));
  };
  /**
   * 检查数据是否符合游戏时长任务状态结构。
   *
   * @param key - 目标数据的键名。
   * @returns 检查结果；满足条件时为 true，否则为 false。
   */
  const isPlayState = (key: string): boolean => {
    return platform === 'steam' && key.startsWith(`${namespace}:playState:`);
  };
  return {
    /**
     * 读取指定 GM 存储项。
     *
     * @typeParam T - 操作处理的数据或返回值类型。
     * @param key - 目标数据的键名。
     * @param fallback - 未取得有效数据时使用的默认值。
     * @returns 工作函数或存储读取产生的泛型结果。
     */
    getValue: <T>(key: string, fallback: T): T => {
      if (key === `${namespace}:whiteList`) {
        return GM_getValue<Record<string, T>>('whiteList', {})[platform] ?? fallback;
      }
      if (isPlayState(key)) {
        return {
          stopPlayTime: GM_getValue('stopPlayTime', 0),
          playedGames: GM_getValue('playedGames', []),
          taskLink: GM_getValue('taskLink', [])
        } as T;
      }
      return GM_getValue(keyFor(key), fallback);
    },
    /**
     * 写入指定 GM 存储项。
     *
     * @param key - 目标数据的键名。
     * @param value - 待处理的值。
     */
    setValue: (key, value) => {
      if (key === `${namespace}:whiteList`) {
        GM_setValue('whiteList', {
          ...GM_getValue('whiteList', {}),
          [platform]: value
        });
      } else if (isPlayState(key)) {
        const state = value as Record<string, unknown>;
        for (const field of ['stopPlayTime', 'playedGames', 'taskLink']) {
          GM_setValue(field, state[field]);
        }
      } else {
        GM_setValue(keyFor(key), value);
      }
    },
    /**
     * 删除指定 GM 存储项。
     *
     * @param key - 目标数据的键名。
     */
    deleteValue: (key) => {
      if (key === `${namespace}:whiteList`) {
        const lists = GM_getValue<Record<string, unknown>>('whiteList', {});
        delete lists[platform];
        GM_setValue('whiteList', lists);
      } else if (isPlayState(key)) {
        for (const field of ['stopPlayTime', 'playedGames', 'taskLink']) {
          GM_deleteValue(field);
        }
      } else {
        GM_deleteValue(keyFor(key));
      }
    },
    /**
     * 在新标签页中打开链接。
     *
     * @param url - 请求或访问的 URL。
     * @param options - 本次操作的配置选项。
     * @returns 处理结果（Tampermonkey.OpenTabObject）。
     */
    openInTab: (url, options) => {
      return GM_openInTab(url, options);
    },
    /**
     * 注册 GM 存储值变化监听器。
     *
     * @param key - 目标数据的键名。
     * @param listener - 接收状态变化的监听函数。
     * @returns 计算得到的数值。
     */
    addValueChangeListener: (key, listener) => {
      return GM_addValueChangeListener(keyFor(key), listener);
    },
    /**
     * 移除 GM 存储值变化监听器。
     *
     * @param id - 目标标识。
     */
    removeValueChangeListener: (id) => {
      return GM_removeValueChangeListener(id);
    }
  };
};

/**
 * 转义文本中的 HTML 特殊字符。
 *
 * @param value - 待处理的值。
 * @returns 处理后的字符串。
 */
const escapeText = (value: string): string => {
  return value.replace(/[&<>"']/g, (char) => {
    return {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      '\'': '&#39;'
    }[char] || char;
  });
};

/**
 * 将 Steam 操作名称转换为项目任务类型。
 *
 * @param event - 事件名称或事件对象。
 * @returns 处理结果（TaskType）；未取得有效结果时返回 undefined。
 */
const steamTaskType = (event: SocialStatusEvent): TaskType | undefined => {
  return (
    linkTasks.find(([, type]) => {
      return type === event.details?.taskType;
    })?.[1]
  );
};

const socialLabels: Record<string, Record<string, string>> = {
  Twitter: {
    'users.follow': 'FollowUser',
    'users.unfollow': 'UnfollowUser',
    'retweets.create': 'Retweet',
    'retweets.delete': 'UndoRetweet'
  },
  Twitch: {
    'channel.follow': 'FollowChannel',
    'channel.unfollow': 'UnfollowChannel'
  },
  Youtube: {
    'channel.subscribe': 'SubscribeChannel',
    'channel.unsubscribe': 'UnsubscribeChannel',
    'video.like': 'LikeVideo',
    'video.unlike': 'UnlikeVideo'
  },
  Reddit: {
    'user.follow': 'FollowUser',
    'user.unfollow': 'UnfollowUser',
    'subreddit.subscribe': 'JoinCommunity',
    'subreddit.unsubscribe': 'LeaveCommunity'
  },
  Vk: {
    'group.join': 'JoinGroup',
    'group.leave': 'LeaveGroup',
    'public.join': 'JoinCommunity',
    'public.leave': 'LeaveCommunity',
    'wall.like': 'LikePost',
    'wall.unlike': 'UnlikePost',
    'wall.repost': 'Repost',
    'wall.deleteRepost': 'UndoRepost'
  }
};

/**
 * 获取社交任务的显示名称。
 *
 * @param event - 事件名称或事件对象。
 * @param platform - 社交平台名称。
 * @returns 处理后的字符串。
 */
const taskLabel = (event: SocialStatusEvent, platform: string): string => {
  const type = platform === 'Steam' ? steamTaskType(event) : undefined;
  if (type && (event.details?.action === 'do' || event.details?.action === 'undo')) {
    return __(`moduleTask_${type}_${event.details.action}`);
  }
  if (platform === 'Steam' && /^play\.(start|stop)$/.test(event.operation)) {
    return __(`moduleTask_playTime_${event.operation === 'play.stop' ? 'undo' : 'do'}`);
  }
  if (platform === 'Vk' && /^task\.(do|undo)$/.test(event.operation)) {
    const undo = event.operation === 'task.undo';
    const target = event.target || '';
    const wall = /(?:^|\/)wall-?\d+_\d+/.test(target);
    const like = /[?&]action=like(?:&|$)/.test(target);
    return __(`moduleAction${wall ? (like ? (undo ? 'UnlikePost' : 'LikePost') : (undo ? 'UndoRepost' : 'Repost')) : (undo ? 'LeaveGroup' : 'JoinGroup')}`);
  }
  const label = socialLabels[platform]?.[event.operation];
  if (label) {
    return __(`moduleAction${label}`);
  }
  return __(event.operation.startsWith('init') ? 'moduleInitializing' : 'moduleTask');
};

/**
 * 提取用于显示的标识，同时保留原始链接。
 *
 * @param url - 请求或访问的 URL。
 * @param platform - 社交平台名称。
 * @returns 处理后的字符串；未取得有效结果时返回 undefined。
 */
const socialTargetId = (url: URL, platform: string): string | undefined => {
  const parts = url.pathname.split('/').filter(Boolean)
    .map(decodeURIComponent);
  const host = url.hostname.replace(/^(www|m|old)\./, '');
  if (platform === 'Twitter' && ['x.com', 'twitter.com'].includes(host)) {
    return parts[1] === 'status' ? parts[2] : (parts[0] === 'i' ? parts.at(-1) : parts[0]);
  }
  if (platform === 'Twitch' && host === 'twitch.tv') {
    return parts[0];
  }
  if (platform === 'Reddit' && host === 'reddit.com' && ['r', 'u', 'user'].includes(parts[0])) {
    return parts[1];
  }
  if (platform === 'Vk' && ['vk.com', 'vk.ru'].includes(host)) {
    return parts[0];
  }
  if (platform === 'Youtube') {
    if (host === 'google.com' && url.pathname === '/url') {
      const destination = new URL(url.searchParams.get('url') || url.searchParams.get('q') || '');
      if (['youtube.com', 'www.youtube.com', 'm.youtube.com', 'youtu.be'].includes(destination.hostname)) {
        return socialTargetId(destination, platform);
      }
    }
    if (host === 'youtu.be') {
      return parts[0];
    }
    if (host === 'youtube.com') {
      return parts[0] === 'watch' ? (url.searchParams.get('v') || undefined) :
        (['channel', 'c', 'user', 'shorts', 'embed', 'live'].includes(parts[0]) ? parts[1] : parts[0]);
    }
  }
  return undefined;
};

/**
 * 直接调用模块时可只传入标识；批量任务保留原始 URL。
 *
 * @param event - 事件名称或事件对象。
 * @param platform - 社交平台名称。
 * @returns 处理后的字符串；未取得有效结果时返回 undefined。
 */
const socialTargetLink = (event: SocialStatusEvent, platform: string): string | undefined => {
  const target = event.target || '';
  if (platform === 'Twitter' && /^users\.(follow|unfollow)$/.test(event.operation) && /^@?\w+$/.test(target)) {
    return `https://x.com/${target.replace(/^@/, '')}`;
  }
  if (platform === 'Twitter' && /^retweets\.(create|delete)$/.test(event.operation) && /^\d+$/.test(target)) {
    return `https://x.com/i/status/${target}`;
  }
  if (platform === 'Twitch' && /^channel\.(follow|unfollow)$/.test(event.operation) && /^\w+$/.test(target)) {
    return `https://www.twitch.tv/${target}`;
  }
  if (platform === 'Reddit' && /^[\w-]+$/.test(target)) {
    if (/^user\.(follow|unfollow)$/.test(event.operation)) {
      return `https://www.reddit.com/user/${target.replace(/^u_/, '')}/`;
    }
    if (/^subreddit\.(subscribe|unsubscribe)$/.test(event.operation)) {
      return `https://www.reddit.com/r/${target}/`;
    }
  }
  if (platform === 'Vk' && /^(task|group|public|wall)\./.test(event.operation) && /^[\w.-]+(?:\?action=like)?$/.test(target)) {
    return `https://vk.com/${target}`;
  }
  if (platform === 'Youtube') {
    if (/^video\.(like|unlike)$/.test(event.operation) && /^[\w-]+$/.test(target)) {
      return `https://www.youtube.com/watch?v=${target}`;
    }
    if (/^channel\.(subscribe|unsubscribe)$/.test(event.operation) && /^\/(?:channel\/|c\/|user\/|@)[\w.-]+\/?$/.test(target)) {
      return `https://www.youtube.com${target}`;
    }
  }
  return undefined;
};

/**
 * 提取社交任务的目标信息。
 *
 * @param event - 事件名称或事件对象。
 * @param platform - 社交平台名称。
 * @returns 处理后的字符串。
 */
const taskTarget = (event: SocialStatusEvent, platform: string): string => {
  const target = typeof event.details?.taskLink === 'string' ? event.details.taskLink : event.target;
  if (!target) {
    return '';
  }
  try {
    const href = /^[a-z][a-z\d+.-]*:/i.test(target) ? target : (socialTargetLink(event, platform) || target);
    const url = new URL(href);
    if (!['http:', 'https:'].includes(url.protocol)) {
      return ` (${escapeText(target)})`;
    }
    const type = platform === 'Steam' ? steamTaskType(event) : undefined;
    let id: string | undefined;
    try {
      id = type ? parseLink(type, target)?.id : socialTargetId(url, platform);
    } catch { /* Keep malformed targets clickable with a neutral label. */ }
    return ` (<a href="${escapeText(href)}" target="_blank" rel="noopener noreferrer" title="${escapeText(href)}">${escapeText(id || __('moduleViewTarget'))}</a>)`;
  } catch {
    return ` (${escapeText(target)})`;
  }
};

/**
 * 记录批量结果和单项任务，避免重复记录执行器与传输日志。
 *
 * @param client - 目标模块客户端。
 * @param platform - 社交平台名称。
 * @returns 供调用方使用的函数。
 */
export const bindModuleStatus = (client: { /** 注册状态事件监听器。 @param event - 要订阅的事件名称。 @param listener - 接收状态变化的监听函数。 @returns 用于移除当前监听器的清理函数。 */ on(event: 'status', listener: StatusListener): () => void; /** 释放模块资源并结束待处理的监听或等待。 */ dispose(): void }, platform: string): (() => void) => {
  const logs = new Map<string, ReturnType<typeof echoLog>>();
  const steamTasks = new Set<string>();
  const parents = new Map<string, string>();
  const taskOperations = /^(task\.(execute|skip|do|undo)|play\.(start|stop)|users\.(follow|unfollow)|retweets\.(create|delete)|channel\.(follow|unfollow|subscribe|unsubscribe)|video\.(like|unlike)|user\.(follow|unfollow)|subreddit\.(subscribe|unsubscribe))$/;
  /**
   * 接收并处理状态变化。
   *
   * @param event - 事件名称或事件对象。
   */
  const listener = (event: SocialStatusEvent & { source?: string }): void => {
    debug(`${platform}: ${event.operation}`, event);
    if (event.parentOperationId) {
      parents.set(event.operationId, event.parentOperationId);
    }
    const terminal = ['success', 'failure', 'skipped'].includes(event.phase);
    // Executor events are hidden below, but still identify the owning task's icon.
    const executor = event.code === 'EXECUTOR_ATTEMPT' ? event.details?.executor : event.source;
    if (platform === 'Steam' && (executor === 'steamWeb' || executor === 'steamASF')) {
      let id: string | undefined = event.operationId;
      const visited = new Set<string>();
      while (id && !visited.has(id)) {
        visited.add(id);
        if (steamTasks.has(id)) {
          logs.get(id)?.setBefore(executor === 'steamASF' ? '[ASF]' : '[Web]');
          break;
        }
        id = parents.get(id);
      }
    }
    if (/AUTH_REQUIRED|LOGIN_REQUIRED|AUTH_WAITING_FOR_PAGE/.test(event.code)) {
      let id: string | undefined = event.operationId;
      const visited = new Set<string>();
      while (id && !visited.has(id)) {
        visited.add(id);
        if (logs.has(id)) {
          logs.get(id)?.warning(__('needLogin'));
          break;
        }
        id = parents.get(id);
      }
    }
    if (event.parentOperationId && !(taskOperations.test(event.operation) && (platform !== 'Steam' || event.source === 'steam'))) {
      if (terminal) {
        parents.delete(event.operationId);
      }
      return;
    }
    let log = logs.get(event.operationId);
    if (!log) {
      const label = taskLabel(event, platform);
      const source = platform === 'Steam' ? (event.source || platform) : platform;
      const prefix = (source === 'steam' || source === 'Steam' || source === 'steamWeb' || source === 'SteamWeb') ? 'Web' :
        ((source === 'steamASF' || source === 'SteamASF') ? 'ASF' : platform);
      log = echoLog({
        before: `[${escapeText(prefix)}]`,
        text: escapeText(`${platform}: ${label}`) + taskTarget(event, platform)
      });
      logs.set(event.operationId, log);
      if (platform === 'Steam' && event.parentOperationId) {
        steamTasks.add(event.operationId);
      }
    }
    if (event.phase === 'success') {
      log.success();
    } else if (event.phase === 'failure') {
      log.error(__('moduleFailed'));
    } else if (event.phase === 'skipped') {
      log.warning(__('moduleSkipped'));
    } else if (/AUTH_REQUIRED|LOGIN_REQUIRED/.test(event.code)) {
      log.warning(__('needLogin'));
    }
    if (terminal) {
      logs.delete(event.operationId);
      parents.delete(event.operationId);
      steamTasks.delete(event.operationId);
    }
  };
  const unsubscribe = client.on('status', listener);
  /**
   * 处理页面离开时的资源清理。
   *
   * @param event - 事件名称或事件对象。
   */
  const onPageHide = (event: PageTransitionEvent): void => {
    if (!event.persisted) {
      client.dispose();
    }
  };
  window.addEventListener('pagehide', onPageHide);
  return () => {
    unsubscribe();
    logs.clear();
    parents.clear();
    steamTasks.clear();
    window.removeEventListener('pagehide', onPageHide);
  };
};
