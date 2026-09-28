/*
 * @Author       : HCLonely
 * @Date         : 2021-10-26 15:03:26
 * @LastEditTime : 2026-09-28 17:38:06
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
  loading: '',
  success: '✅️',
  error: '❌️',
  warning: '⚠️',
  info: '❓️'
};
const STATUS_LABELS: Record<StatusKind, string> = {
  loading: 'logLoading',
  success: 'logSuccess',
  error: 'logError',
  warning: 'logWarning',
  info: 'unKnown'
};

/**
 * 匹配翻译后的结果消息及其中的插值参数。
 *
 * @param content - 待处理的内容。
 * @returns 用于界面显示的日志状态类别。
 */
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
        .map((part) => {
          return part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        })
        .join('.*');
      if (new RegExp(`^${pattern}`).test(content)) {
        return kind as StatusKind;
      }
    }
  }
  return 'loading';
};
/**
 * 日志状态接口定义
 */
interface logStatus {
  font?: JQuery;
  /**
   * 设置操作前置处理器。
   *
   * @param before - 执行前的状态或前置处理函数。
   * @returns 可继续更新同一条日志的状态控制器。
   */
  setBefore: (before: string) => logStatus;
  /**
   * 记录操作成功状态。
   *
   * @param text - 待处理的文本；可省略。
   * @param html - 待解析或显示的 HTML 内容；可省略。
   * @returns 可继续更新同一条日志的状态控制器。
   */
  success: (text?: string, html?: boolean) => logStatus;
  /**
   * 记录错误状态。
   *
   * @param text - 待处理的文本；可省略。
   * @param html - 待解析或显示的 HTML 内容；可省略。
   * @returns 可继续更新同一条日志的状态控制器。
   */
  error: (text?: string, html?: boolean) => logStatus;
  /**
   * 记录警告状态。
   *
   * @param text - 待处理的文本；可省略。
   * @param html - 待解析或显示的 HTML 内容；可省略。
   * @returns 可继续更新同一条日志的状态控制器。
   */
  warning: (text?: string, html?: boolean) => logStatus;
  /**
   * 记录信息状态。
   *
   * @param text - 待处理的文本；可省略。
   * @param html - 待解析或显示的 HTML 内容；可省略。
   * @returns 可继续更新同一条日志的状态控制器。
   */
  info: (text?: string, html?: boolean) => logStatus;
  /**
   * 更新界面视图。
   *
   * @returns 可继续更新同一条日志的状态控制器。
   */
  view: () => logStatus;
  /**
   * 移除指定记录或界面元素。
   *
   * @returns 可继续更新同一条日志的状态控制器。
   */
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
 *
 * @param url - 链接URL
 * @param text - 链接文本
 * @returns 生成的HTML字符串
 */
const generateLink = (url: string, text: string): string => {
  return `<a href="${url}" target="_blank">${text}</a>`;
};

/**
 * 生成基础日志元素
 *
 * @param content - 日志内容
 * @returns jQuery元素
 */
const createBaseElement = (content: string): JQuery => {
  return $(`<li>${content}<font class="log-status"></font></li>`).addClass('card-text');
};

/**
 * 生成平台相关日志元素
 *
 * @param type - 日志类型
 * @param text - 文本内容
 * @param id - 相关ID
 * @returns 生成的jQuery元素或null
 */
const createPlatformElement = (type: string, text?: string, id?: string): JQuery | null => {
  const urlGenerators: UrlGenerators = {
    // Steam相关
    /**
     * 处理群组任务。
     *
     * @param text - 待处理的文本。
     * @returns 处理后的字符串。
     */
    group: (text: string) => {
      return `https://steamcommunity.com/groups/${text}`;
    },
    /**
     * 处理游戏官方组任务。
     *
     * @param text - 待处理的文本。
     * @returns 处理后的字符串。
     */
    officialGroup: (text: string) => {
      return `https://steamcommunity.com/games/${text}`;
    },
    /**
     * 处理论坛任务。
     *
     * @param text - 待处理的文本。
     * @returns 处理后的字符串。
     */
    forum: (text: string) => {
      return `https://steamcommunity.com/app/${text}/discussions/`;
    },
    /**
     * 处理鉴赏家任务。
     *
     * @param text - 待处理的文本。
     * @returns 处理后的字符串。
     */
    curator: (text: string) => {
      return `https://store.steampowered.com/${text?.includes('/') ? text : `curator/${text}`}`;
    },
    /**
     * 处理指定应用任务。
     *
     * @param text - 待处理的文本。
     * @returns 处理后的字符串。
     */
    app: (text: string) => {
      return `https://store.steampowered.com/app/${text}`;
    },
    /**
     * 处理指定许可包任务。
     *
     * @param text - 待处理的文本。
     * @returns 处理后的字符串。
     */
    sub: (text: string) => {
      return `https://steamdb.info/sub/${text}/`;
    },
    /**
     * 处理创意工坊任务。
     *
     * @param text - 待处理的文本。
     * @returns 处理后的字符串。
     */
    workshop: (text: string) => {
      return `https://steamcommunity.com/sharedfiles/filedetails/?id=${text}`;
    },
    /**
     * 处理游戏公告任务。
     *
     * @param text - 待处理的文本。
     * @param id - 目标标识；可省略。
     * @returns 处理后的字符串。
     */
    announcement: (text: string, id?: string) => {
      return `https://store.steampowered.com/news/app/${text}/view/${id}`;
    },

    // 社交平台相关

    /**
     * 处理 Twitch 平台任务。
     *
     * @param text - 待处理的文本。
     * @returns 处理后的字符串。
     */
    twitch: (text: string) => {
      return `https://www.twitch.tv/${text}`;
    },
    /**
     * 处理 Instagram 平台任务。
     *
     * @param text - 待处理的文本。
     * @returns 处理后的字符串。
     */
    instagram: (text: string) => {
      return `https://www.instagram.com/${text}/`;
    },
    /**
     * 处理 Twitter 平台任务。
     *
     * @param text - 待处理的文本。
     * @returns 处理后的字符串。
     */
    twitter: (text: string) => {
      return `https://x.com/${text}`;
    },
    reddit: {
      /**
       * 处理 Reddit 社区任务。
       *
       * @param text - 待处理的文本。
       * @returns 处理后的字符串。
       */
      subreddit: (text: string) => {
        return `https://www.reddit.com/r/${text}/`;
      },
      /**
       * 处理用户任务。
       *
       * @param text - 待处理的文本。
       * @returns 处理后的字符串。
       */
      user: (text: string) => {
        return `https://www.reddit.com/user/${text?.replace('u_', '')}`;
      }
    },
    youtube: {
      /**
       * 处理频道任务。
       *
       * @param text - 待处理的文本。
       * @returns 处理后的字符串。
       */
      channel: (text: string) => {
        return `https://www.youtube.com/channel/${text}`;
      },
      /**
       * 处理视频任务。
       *
       * @param text - 待处理的文本。
       * @returns 处理后的字符串。
       */
      video: (text: string) => {
        return `https://www.youtube.com/watch?v=${text}`;
      }
    },
    /**
     * 处理 VK 平台任务。
     *
     * @param text - 待处理的文本。
     * @returns 处理后的字符串。
     */
    vk: (text: string) => {
      return `https://vk.com/${text}/`;
    }
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
  if (!urlConfig || !text) {
    return null;
  }

  const [platform, subType] = urlConfig;
  const urlGenerator = urlGenerators[platform];

  if (typeof urlGenerator === 'function') {
    const url = urlGenerator(text, id);
    const displayText = platform === 'announcement' ? (id || '') : text;
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
 *
 * @param type - 日志类型
 * @param text - 文本内容
 * @param html - HTML内容
 * @param id - 相关ID
 * @returns 生成的jQuery元素
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
 *
 * @remarks
 * 解构参数包含：type（操作或数据类型）、text（待处理的文本）、html（待解析或显示的 HTML 内容）、id（目标标识）、before（执行前的状态或前置处理函数）。
 *
 * @returns 日志状态对象
 */
const echoLog = ({
  type, text, html, id, before
}: { type?: string, text?: string, html?: string, id?: string, before?: string }): logStatus => {
  const emptyStatus: logStatus = {
    /**
     * 设置操作前置处理器。
     *
     * @returns 可继续更新同一条日志的状态控制器。
     */
    setBefore: () => {
      return emptyStatus;
    },
    /**
     * 记录操作成功状态。
     *
     * @returns 可继续更新同一条日志的状态控制器。
     */
    success: () => {
      return emptyStatus;
    },
    /**
     * 记录错误状态。
     *
     * @returns 可继续更新同一条日志的状态控制器。
     */
    error: () => {
      return emptyStatus;
    },
    /**
     * 记录警告状态。
     *
     * @returns 可继续更新同一条日志的状态控制器。
     */
    warning: () => {
      return emptyStatus;
    },
    /**
     * 记录信息状态。
     *
     * @returns 可继续更新同一条日志的状态控制器。
     */
    info: () => {
      return emptyStatus;
    },
    /**
     * 更新界面视图。
     *
     * @returns 可继续更新同一条日志的状态控制器。
     */
    view: () => {
      return emptyStatus;
    },
    /**
     * 移除指定记录或界面元素。
     *
     * @returns 可继续更新同一条日志的状态控制器。
     */
    remove: () => {
      return emptyStatus;
    }
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

    if (!ele.length) {
      ele = createBaseElement('');
    }
    // HTML logs may not supply a status node; keep their original content intact.
    ele = ele.map((_, node) => {
      return (node.nodeType === 1 ? node : $('<li>').append(node)[0]);
    });
    ele.each((_, node) => {
      const row = $(node);
      if (!row.find('font.log-status').length) {
        row.append('<font class="log-status"></font>');
      }
    });
    const font = ele.find('font.log-status');
    const indicators = $('<span class="log-status-icon" role="img"></span>');
    ele.append(indicators);
    const icons = ele.children('.log-status-icon');
    /**
     * 更新当前状态。
     *
     * @param kind - 目标类别。
     * @param targets - 当前操作的目标列表；默认值为 `icons`。
     */
    const setState = (kind: StatusKind, targets = icons): void => {
      targets.attr('data-status', kind).attr('aria-label', __(STATUS_LABELS[kind]))
        .attr('title', __(STATUS_LABELS[kind]))
        .text(STATUS_ICONS[kind]);
    };
    ele.each((_, node) => {
      const row = $(node);
      const initialStatus = (type === 'whiteList' || type === 'globalOptionsSkip' || row.is('.warning') || row.find('.warning').length) ? 'warning' :
        ((row.is('.error') || row.find('.error').length) ? 'error' :
          ((row.is('.success') || row.find('.success').length) ? 'success' : inferStatus(row.text())));
      setState(initialStatus, row.children('.log-status-icon'));
    });

    /**
     * 设置操作前置处理器。
     *
     * @param prefix - 生成内容使用的前缀；默认值为 `'[AutoTask]'`。
     */
    const setBefore = (prefix = '[AutoTask]'): void => {
      ele.children('.before-icon, .before').remove();
      if (prefix in ICONS) {
        const base64Svg = btoa(ICONS[prefix as IconKeys]);
        ele.prepend(`<font class="before-icon" style="background-image: url('data:image/svg+xml;base64,${base64Svg}')"></font>`);
      } else {
        ele.prepend(`<font class="before">${prefix}</font>`);
      }
    };
    setBefore(before || undefined);

    ele.addClass('card-text');
    $('#auto-task-info').append(ele);
    ele[0]?.scrollIntoView();

    const status: logStatus = {
      font,
      /**
       * 设置操作前置处理器。
       *
       * @param prefix - 生成内容使用的前缀。
       * @returns 可继续更新同一条日志的状态控制器。
       */
      setBefore(prefix) {
        setBefore(prefix);
        return this;
      },
      /**
       * 记录操作成功状态。
       *
       * @param text - 待处理的文本；默认值为 `__('logSuccess')`。
       * @param html - 待解析或显示的 HTML 内容；默认值为 `false`。
       * @returns 可继续更新同一条日志的状态控制器。
       */
      success(text = __('logSuccess'), html = false) {
        this.font?.attr('class', 'log-status success');
        html ? this.font?.html(text) : this.font?.text(text);
        setState('success');
        return this;
      },
      /**
       * 记录错误状态。
       *
       * @param text - 待处理的文本；默认值为 `__('logError')`。
       * @param html - 待解析或显示的 HTML 内容；默认值为 `false`。
       * @returns 可继续更新同一条日志的状态控制器。
       */
      error(text = __('logError'), html = false) {
        this.font?.attr('class', 'log-status error');
        html ? this.font?.html(text) : this.font?.text(text);
        setState('error');
        return this;
      },
      /**
       * 记录警告状态。
       *
       * @param text - 待处理的文本；默认值为 `__('logWarning')`。
       * @param html - 待解析或显示的 HTML 内容；默认值为 `false`。
       * @returns 可继续更新同一条日志的状态控制器。
       */
      warning(text = __('logWarning'), html = false) {
        this.font?.attr('class', 'log-status warning');
        html ? this.font?.html(text) : this.font?.text(text);
        setState('warning');
        return this;
      },
      /**
       * 记录信息状态。
       *
       * @param text - 待处理的文本；默认值为 `__('unKnown')`。
       * @param html - 待解析或显示的 HTML 内容；默认值为 `false`。
       * @returns 可继续更新同一条日志的状态控制器。
       */
      info(text = __('unKnown'), html = false) {
        this.font?.attr('class', 'log-status info');
        html ? this.font?.html(text) : this.font?.text(text);
        setState('info');
        return this;
      },
      /**
       * 更新界面视图。
       *
       * @returns 可继续更新同一条日志的状态控制器。
       */
      view() {
        ele[0]?.scrollIntoView();
        return this;
      },
      /**
       * 移除指定记录或界面元素。
       *
       * @returns 可继续更新同一条日志的状态控制器。
       */
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
