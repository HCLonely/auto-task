/*
 * @Author       : HCLonely
 * @Date         : 2021-10-26 15:03:26
 * @LastEditTime : 2025-08-18 19:04:47
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/scripts/echoLog.ts
 * @Description  : 日志记录模块，用于显示和管理任务执行状态的日志信息
 */
import throwError from './tools/throwError';
import __ from './tools/i18n';
import ASF from '../assets/images/ASF.svg';
import Web from '../assets/images/Web.svg';
import Twitch from '../assets/images/Twitch.svg';
import Instagram from '../assets/images/Instagram.svg';
import Twitter from '../assets/images/Twitter.svg';
import Reddit from '../assets/images/Reddit.svg';
import Youtube from '../assets/images/Youtube.svg';
import Vk from '../assets/images/Vk.svg';
import AutoTask from '../assets/images/AutoTask.svg';

type IconKeys = '[ASF]' | '[Web]' | '[Twitch]' | '[Instagram]' | '[Twitter]' | '[Reddit]' | '[Youtube]' | '[Vk]' | '[AutoTask]';
const ICONS: Record<IconKeys, string> = {
  '[ASF]': ASF,
  '[Web]': Web,
  '[Twitch]': Twitch,
  '[Instagram]': Instagram,
  '[Twitter]': Twitter,
  '[Reddit]': Reddit,
  '[Youtube]': Youtube,
  '[Vk]': Vk,
  '[AutoTask]': AutoTask
};

type StatusKind = 'loading' | 'success' | 'error' | 'warning' | 'info';
const STATUS_ICONS: Record<StatusKind, string> = {
  loading: '', success: '✅️', error: '❌️', warning: '⚠️', info: '❓️'
};
const STATUS_LABELS: Record<StatusKind, string> = {
  loading: 'logLoading', success: 'logSuccess', error: 'logError', warning: 'logWarning', info: 'unKnown'
};

/** Match translated result messages, including their interpolated parameters. */
const inferStatus = (content: string): StatusKind => {
  const resultKeys: Partial<Record<StatusKind, string[]>> = {
    error: ['getFailed', 'getTaskIdFailed', 'initFailed', 'checkLoginFailed', 'checkLeftKeyFailed', 'syncDataFailed', 'checkUpdateFailed', 'moduleFailed'],
    warning: ['needLogin', 'needInit', 'needJoinGiveaway', 'cannotUndo', 'moduleSkipped', 'skipTask', 'skipTaskOption', 'taskNotFinished', 'campaign', 'verifiedGleamTasks', 'giveeClubVerifyFinished'],
    success: ['allTasksComplete', 'initSuccess', 'syncDataSuccess', 'clearHistoryFinished', 'clearTaskFinished'],
    info: ['unKnown', 'unKnownTaskType']
  };
  for (const [kind, keys] of Object.entries(resultKeys)) {
    for (const key of keys) {
      const pattern = __(key).split(/%\d+/)
        .map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
        .join('.*');
      if (new RegExp(`^${pattern}`).test(content)) return kind as StatusKind;
    }
  }
  return 'loading';
};
/**
 * 日志状态接口定义
 */
interface logStatus {
  font?: JQuery;
  success: (text?: string, html?: boolean) => logStatus;
  error: (text?: string, html?: boolean) => logStatus;
  warning: (text?: string, html?: boolean) => logStatus;
  info: (text?: string, html?: boolean) => logStatus;
  view: () => logStatus;
  remove: () => logStatus;
}

/**
 * URL生成器类型
 */
type UrlGenerator = ((text: string, id?: string) => string) | {
  [key: string]: (text: string, id?: string) => string;
};

/**
 * URL生成器映射类型
 */
type UrlGenerators = {
  [key: string]: UrlGenerator;
};

/**
 * 生成链接HTML
 * @param {string} url - 链接URL
 * @param {string} text - 链接文本
 * @returns {string} 生成的HTML字符串
 */
const generateLink = (url: string, text: string): string => `<a href="${url}" target="_blank">${text}</a>`;

/**
 * 生成基础日志元素
 * @param {string} content - 日志内容
 * @returns {JQuery} jQuery元素
 */
const createBaseElement = (content: string): JQuery => $(`<li>${content}<font class="log-status"></font></li>`).addClass('card-text');

/**
 * 生成平台相关日志元素
 * @param {string} type - 日志类型
 * @param {string} text - 文本内容
 * @param {string} [id] - 相关ID
 * @returns {JQuery | null} 生成的jQuery元素或null
 */
const createPlatformElement = (type: string, text?: string, id?: string): JQuery | null => {
  const urlGenerators: UrlGenerators = {
    // Steam相关
    group: (text: string) => `https://steamcommunity.com/groups/${text}`,
    officialGroup: (text: string) => `https://steamcommunity.com/games/${text}`,
    forum: (text: string) => `https://steamcommunity.com/app/${text}/discussions/`,
    curator: (text: string) => `https://store.steampowered.com/${text?.includes('/') ? text : `curator/${text}`}`,
    app: (text: string) => `https://store.steampowered.com/app/${text}`,
    sub: (text: string) => `https://steamdb.info/sub/${text}/`,
    workshop: (text: string) => `https://steamcommunity.com/sharedfiles/filedetails/?id=${text}`,
    announcement: (text: string, id?: string) => `https://store.steampowered.com/news/app/${text}/view/${id}`,

    // 社交平台相关

    twitch: (text: string) => `https://www.twitch.tv/${text}`,
    instagram: (text: string) => `https://www.instagram.com/${text}/`,
    twitter: (text: string) => `https://x.com/${text}`,
    reddit: {
      subreddit: (text: string) => `https://www.reddit.com/r/${text}/`,
      user: (text: string) => `https://www.reddit.com/user/${text?.replace('u_', '')}`
    },
    youtube: {
      channel: (text: string) => `https://www.youtube.com/channel/${text}`,
      video: (text: string) => `https://www.youtube.com/watch?v=${text}`
    },
    vk: (text: string) => `https://vk.com/${text}/`
  };

  const typeMap = {
    // Steam相关
    joiningSteamGroup: ['group'],
    leavingSteamGroup: ['group'],
    gettingSteamGroupId: ['group'],
    joiningSteamOfficialGroup: ['officialGroup'],
    leavingSteamOfficialGroup: ['officialGroup'],
    gettingSteamOfficialGroupId: ['officialGroup'],
    subscribingForum: ['forum'],
    unsubscribingForum: ['forum'],
    gettingForumId: ['forum'],
    followingCurator: ['curator'],
    unfollowingCurator: ['curator'],
    gettingCuratorId: ['curator'],
    addingToWishlist: ['app'],
    removingFromWishlist: ['app'],
    followingGame: ['app'],
    unfollowingGame: ['app'],
    gettingSubid: ['app'],
    addingFreeLicense: ['app', 'sub'],
    requestingPlayTestAccess: ['app'],
    gettingDemoAppid: ['app'],
    favoritingWorkshop: ['workshop'],
    unfavoritingWorkshop: ['workshop'],
    gettingWorkshopAppId: ['workshop'],
    votingUpWorkshop: ['workshop'],
    gettingAnnouncementParams: ['announcement'],
    likingAnnouncement: ['announcement'],

    // 社交平台相关
    followingTwitchChannel: ['twitch'],
    unfollowingTwitchChannel: ['twitch'],
    gettingTwitchChannelId: ['twitch'],
    gettingInsUserId: ['instagram'],
    followingIns: ['instagram'],
    unfollowingIns: ['instagram'],
    gettingTwitterUserId: ['twitter'],
    followingTwitterUser: ['twitter'],
    unfollowingTwitterUser: ['twitter'],
    joiningReddit: ['reddit', 'subreddit'],
    leavingReddit: ['reddit', 'subreddit'],
    gettingRedditSubredditId: ['reddit', 'subreddit'],
    followingRedditUser: ['reddit', 'user'],
    unfollowingRedditUser: ['reddit', 'user'],
    gettingRedditUserId: ['reddit', 'user'],
    followingYtbChannel: ['youtube', 'channel'],
    unfollowingYtbChannel: ['youtube', 'channel'],
    likingYtbVideo: ['youtube', 'video'],
    unlikingYtbVideo: ['youtube', 'video'],
    gettingVkId: ['vk'],
    gettingVkWall: ['vk'],
    likingVkPublic: ['vk'],
    unlikingVkPublic: ['vk'],
    joiningVkGroup: ['vk'],
    leavingVkGroup: ['vk'],
    joiningVkPublic: ['vk'],
    leavingVkPublic: ['vk'],
    sendingVkWall: ['vk'],
    deletingVkWall: ['vk']
  } as const;

  const urlConfig = typeMap[type as keyof typeof typeMap];
  if (!urlConfig || !text) return null;

  const [platform, subType] = urlConfig;
  const urlGenerator = urlGenerators[platform];

  if (typeof urlGenerator === 'function') {
    const url = urlGenerator(text, id);
    const displayText = platform === 'announcement' ? id || '' : text;
    return createBaseElement(`${__(type)}[${generateLink(url, displayText)}]`);
  }

  if (subType && typeof urlGenerator === 'object') {
    const subGenerator = urlGenerator[subType];
    if (typeof subGenerator === 'function') {
      const displayText = type.includes('RedditUser') ? text.replace('u_', '') : text;
      return createBaseElement(`${__(type)}[${generateLink(subGenerator(text), displayText)}]`);
    }
  }

  return null;
};

/**
 * 生成特殊类型日志元素
 * @param {string} type - 日志类型
 * @param {string} text - 文本内容
 * @param {string} [html] - HTML内容
 * @param {string} [id] - 相关ID
 * @returns {JQuery} 生成的jQuery元素
 */
const createSpecialElement = (type: string, text?: string, html?: string, id?: string): JQuery => {
  switch (type) {
      case 'retweetting':
      case 'unretweetting':
        return createBaseElement(`${__(type)}${text}`);
      case 'visitingLink':
        return createBaseElement(`${__('visitingLink')}[${generateLink(text || '', text || '')}]`);
      case 'verifyingInsAuth':
        return createBaseElement(__(type));
      case 'text':
        return createBaseElement(__(text || ''));
      case 'html':
        return $(text || html || '');
      case 'whiteList':
        return $(`<li><font class="warning">${__('skipTask')}[${text}(${id})](${__('whiteList')})</font></li>`);
      case 'globalOptionsSkip':
        return $(`<li>${__('skipTaskOption')}<font class="warning">${text}</font></li>`);
      default:
        return createBaseElement(`${__('unKnown')}:${type}(${text})`);
  }
};

/**
 * 记录日志信息并返回日志状态对象
 * @param {Object} options - 日志选项对象
 * @param {string} [options.type] - 日志类型
 * @param {string} [options.text] - 日志文本内容
 * @param {string} [options.html] - 日志的HTML内容
 * @param {string} [options.id] - 相关ID
 * @returns {logStatus} 日志状态对象
 */
const echoLog = ({ type, text, html, id, before }: { type?: string, text?: string, html?: string, id?: string, before?: string }): logStatus => {
  const emptyStatus: logStatus = {
    success: () => emptyStatus,
    error: () => emptyStatus,
    warning: () => emptyStatus,
    info: () => emptyStatus,
    view: () => emptyStatus,
    remove: () => emptyStatus
  };

  try {
    let ele: JQuery;

    if (!type && !text && !html) {
      ele = createBaseElement('');
    } else if (text && !type) {
      ele = createBaseElement(text);
    } else if (html && !type) {
      ele = $(html);
    } else if (type) {
      const platformElement = createPlatformElement(type, text, id);
      ele = platformElement || createSpecialElement(type, text, html, id);
    } else {
      ele = createBaseElement('');
    }

    if (!ele.length) ele = createBaseElement('');
    // HTML logs may not supply a status node; keep their original content intact.
    ele = ele.map((_, node) => (node.nodeType === 1 ? node : $('<li>').append(node)[0]));
    ele.each((_, node) => {
      const row = $(node);
      if (!row.find('font.log-status').length) row.append('<font class="log-status"></font>');
    });
    const font = ele.find('font.log-status');
    const indicators = $('<span class="log-status-icon" role="img"></span>');
    ele.append(indicators);
    const icons = ele.children('.log-status-icon');
    const setState = (kind: StatusKind, targets = icons): void => {
      targets.attr('data-status', kind).attr('aria-label', __(STATUS_LABELS[kind]))
        .attr('title', __(STATUS_LABELS[kind]))
        .text(STATUS_ICONS[kind]);
    };
    ele.each((_, node) => {
      const row = $(node);
      const initialStatus = type === 'whiteList' || type === 'globalOptionsSkip' || row.is('.warning') || row.find('.warning').length ? 'warning' :
        row.is('.error') || row.find('.error').length ? 'error' :
          row.is('.success') || row.find('.success').length ? 'success' : inferStatus(row.text());
      setState(initialStatus, row.children('.log-status-icon'));
    });

    if (before) {
      if (before in ICONS) {
        const iconKey = before as IconKeys;
        const svgContent = ICONS[iconKey];
        const base64Svg = btoa(svgContent);
        ele.prepend(`<font class="before-icon" style="background-image: url('data:image/svg+xml;base64,${base64Svg}')"></font>`);
      } else {
        ele.prepend(`<font class="before">${before}</font>`);
      }
    } else {
      const base64Svg = btoa(ICONS['[AutoTask]']);
      ele.prepend(`<font class="before-icon" style="background-image: url('data:image/svg+xml;base64,${base64Svg}')"></font>`);
    }

    ele.addClass('card-text');
    $('#auto-task-info').append(ele);
    ele[0]?.scrollIntoView();

    const status: logStatus = {
      font,
      success(text = __('logSuccess'), html = false) {
        this.font?.attr('class', 'log-status success');
        html ? this.font?.html(text) : this.font?.text(text);
        setState('success');
        return this;
      },
      error(text = __('logError'), html = false) {
        this.font?.attr('class', 'log-status error');
        html ? this.font?.html(text) : this.font?.text(text);
        setState('error');
        return this;
      },
      warning(text = __('logWarning'), html = false) {
        this.font?.attr('class', 'log-status warning');
        html ? this.font?.html(text) : this.font?.text(text);
        setState('warning');
        return this;
      },
      info(text = __('unKnown'), html = false) {
        this.font?.attr('class', 'log-status info');
        html ? this.font?.html(text) : this.font?.text(text);
        setState('info');
        return this;
      },
      view() {
        ele[0]?.scrollIntoView();
        return this;
      },
      remove() {
        ele.remove();
        return this;
      }
    };
    return status;
  } catch (error) {
    throwError(error as Error, 'echoLog');
    return emptyStatus;
  }
};

export default echoLog;
