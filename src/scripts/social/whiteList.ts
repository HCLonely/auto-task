/*
 * @Author       : HCLonely
 * @Date         : 2021-12-06 13:16:38
 * @LastEditTime : 2025-08-18 19:08:27
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/scripts/social/whiteList.ts
 * @Description  : 白名单相关
 */

import Swal from 'sweetalert2';
import __ from '../tools/i18n';
import echoLog from '../echoLog';
import Steam from './Steam';
import { getInfo } from './Youtube';
import { stringToColour } from '../tools/tools';
import throwError from '../tools/throwError';
import { debug } from '../tools/debug';

/**
 * 默认白名单配置对象，包含各个平台的默认设置。
 *
 * @constant {whiteList} defaultWhiteList
 * @property {Object} discord - Discord 平台的白名单设置。
 * @property {string[]} discord.servers - Discord 服务器的白名单列表。
 *
 * @property {Object} instagram - Instagram 平台的白名单设置。
 * @property {string[]} instagram.users - Instagram 用户的白名单列表。
 *
 * @property {Object} twitch - Twitch 平台的白名单设置。
 * @property {string[]} twitch.channels - Twitch 频道的白名单列表。
 *
 * @property {Object} twitter - Twitter 平台的白名单设置。
 * @property {string[]} twitter.users - Twitter 用户的白名单列表。
 * @property {string[]} twitter.retweets - Twitter 转发的白名单列表。
 * @property {string[]} twitter.likes - Twitter 点赞的白名单列表。
 *
 * @property {Object} vk - VK 平台的白名单设置。
 * @property {string[]} vk.names - VK 名称的白名单列表。
 *
 * @property {Object} youtube - YouTube 平台的白名单设置。
 * @property {string[]} youtube.channels - YouTube 频道的白名单列表。
 * @property {string[]} youtube.likes - YouTube 点赞的白名单列表。
 *
 * @property {Object} reddit - Reddit 平台的白名单设置。
 * @property {string[]} reddit.reddits - Reddit 子版块的白名单列表。
 *
 * @property {Object} steam - Steam 平台的白名单设置。
 * @property {string[]} steam.groups - Steam 群组的白名单列表。
 * @property {string[]} steam.officialGroups - Steam 官方群组的白名单列表。
 * @property {string[]} steam.wishlists - Steam 心愿单的白名单列表。
 * @property {string[]} steam.follows - Steam 关注的白名单列表。
 * @property {string[]} steam.forums - Steam 论坛的白名单列表。
 * @property {string[]} steam.workshops - Steam 工作坊的白名单列表。
 * @property {string[]} steam.curators - Steam 策展人的白名单列表。
 * @property {string[]} steam.workshopVotes - Steam 工作坊投票的白名单列表。
 * @property {string[]} steam.curatorLikes - Steam 策展人点赞的白名单列表。
 * @property {string[]} steam.announcements - Steam 公告的白名单列表。
 * @property {string[]} steam.licenses - Steam 许可证的白名单列表。
 * @property {string[]} steam.playtests - Steam 测试版的白名单列表。
 */
const defaultWhiteList: whiteList = {
  discord: {
    servers: []
  },
  instagram: {
    users: []
  },
  twitch: {
    channels: []
  },
  twitter: {
    users: [],
    retweets: [],
    likes: []
  },
  vk: {
    names: []
  },
  youtube: {
    channels: [],
    likes: []
  },
  reddit: {
    reddits: []
  },
  steam: {
    groups: [],
    officialGroups: [],
    wishlists: [],
    follows: [],
    forums: [],
    workshops: [],
    curators: [],
    workshopVotes: [],
    curatorLikes: [],
    announcements: [],
    licenses: [],
    playtests: [],
    playTime: []
  }
};

// 优化正则表达式常量
const REGEX_PATTERNS = {
  DISCORD_INVITE: /invite\/(.+)/,
  INSTAGRAM_USER: /https:\/\/www\.instagram\.com\/(.+)?\//,
  TWITCH_CHANNEL: /https:\/\/(www\.)?twitch\.tv\/(.+)/,
  TWITTER_USER: /https:\/\/twitter\.com\/(.+)/,
  TWITTER_STATUS: /https:\/\/twitter\.com\/.*?\/status\/([\d]+)/,
  VK_NAME: /https:\/\/vk\.com\/([^/]+)/,
  REDDIT_USER: /https?:\/\/www\.reddit\.com\/user\/([^/]*)/,
  REDDIT_SUBREDDIT: /https?:\/\/www\.reddit\.com\/r\/([^/]*)/,
  STEAM_GROUP: /groups\/(.+)\/?/,
  STEAM_APP: /app\/([\d]+)/,
  STEAM_WORKSHOP: /\?id=([\d]+)/,
  STEAM_CURATOR: /curator\/([\d]+)/,
  STEAM_STORE: /https?:\/\/store\.steampowered\.com\/(.*?)\/([^/?]+)/
} as const;

interface WhiteList {
  [key: string]: {
    [key: string]: string[];
  };
}

interface DisabledType {
  [key: string]: string[];
}

/**
 * 从给定的链接中提取特定类型的 ID。
 *
 * @param {string} type - 链接类型，支持的类型包括：
 *   - discord.servers
 *   - instagram.users
 *   - twitch.channels
 *   - twitter.users
 *   - twitter.retweets
 *   - vk.names
 *   - youtube.channels
 *   - youtube.likes
 *   - reddit.reddits
 *   - steam.groups
 *   - steam.wishlists
 *   - steam.follows
 *   - steam.playtests
 *   - steam.playTime
 *   - steam.forums
 *   - steam.workshops
 *   - steam.curators
 *
 * @returns {Promise<string>} 提取到的 ID，如果未找到则返回空字符串。
 *
 * @throws {Error} 如果在提取过程中发生错误，将抛出错误。
 */
const link2id = async function (type: string): Promise<string> {
  try {
    debug('开始从链接获取ID', { type });
    const link = $('#socialLink').val() as string;
    let id = '';
    switch (type) {
        case 'discord.servers':
          id = REGEX_PATTERNS.DISCORD_INVITE.exec(link)?.[1] || '';
          break;
        case 'instagram.users':
          id = REGEX_PATTERNS.INSTAGRAM_USER.exec(link)?.[1] || '';
          break;
        case 'twitch.channels':
          id = REGEX_PATTERNS.TWITCH_CHANNEL.exec(link)?.[2] || '';
          break;
        case 'twitter.users':
          id = REGEX_PATTERNS.TWITTER_USER.exec(link)?.[1] || '';
          break;
        case 'twitter.retweets':
          id = REGEX_PATTERNS.TWITTER_STATUS.exec(link)?.[1] || '';
          break;
        case 'vk.names':
          id = REGEX_PATTERNS.VK_NAME.exec(link)?.[1] || '';
          break;
        case 'youtube.channels':
          id = (await getInfo(link, 'channel'))?.params?.channelId || '';
          break;
        case 'youtube.likes':
          id = (await getInfo(link, 'likeVideo'))?.params?.videoId || '';
          break;
        case 'reddit.reddits': {
          const userMatch = REGEX_PATTERNS.REDDIT_USER.exec(link);
          const subredditMatch = REGEX_PATTERNS.REDDIT_SUBREDDIT.exec(link);
          id = userMatch?.[1] || subredditMatch?.[1] || '';
          break;
        }
        case 'steam.groups':
          id = REGEX_PATTERNS.STEAM_GROUP.exec(link)?.[1] || '';
          break;
        case 'steam.wishlists':
        case 'steam.follows':
        case 'steam.forums':
        case 'steam.playtests':
        case 'steam.playTime':
          id = REGEX_PATTERNS.STEAM_APP.exec(link)?.[1] || '';
          break;
        case 'steam.workshops':
          id = REGEX_PATTERNS.STEAM_WORKSHOP.exec(link)?.[1] || '';
          break;
        case 'steam.curators': {
          if (link.includes('curator')) {
            id = REGEX_PATTERNS.STEAM_CURATOR.exec(link)?.[1] || '';
          } else {
            const storeMatch = REGEX_PATTERNS.STEAM_STORE.exec(link);
            if (!storeMatch) break;

            const [, param1, param2] = storeMatch;
            const steam = new Steam();
            if (await steam.init()) {
              id = await steam.getCuratorId(param1, param2) || '';
            }
          }
          break;
        }
    }
    debug('从链接获取ID结果', { type, id });
    return id;
  } catch (error) {
    debug('从链接获取ID时发生错误', { error });
    throwError(error as Error, 'link2id');
    return __('getFailed', 'id');
  }
};

/**
 * 禁用的类型配置对象。
 *
 * @constant {Object} disabledType
 * @property {string[]} disabledType.steam - Steam 平台上禁用的类型，包括 'workshopVotes'、'curatorLikes' 和 'announcements'。
 * @property {string[]} disabledType.twitter - Twitter 平台上禁用的类型，包括 'likes'。
 */
const disabledType: DisabledType = {
  steam: ['workshopVotes', 'curatorLikes', 'announcements'],
  twitter: ['likes']
};

/**
 * 合并给定的白名单与默认白名单，返回新的白名单对象。
 *
 * @param {whiteList} whiteList - 要合并的白名单对象。
 * @returns {whiteList} 合并后的新白名单对象。
 *
 * @throws {Error} 如果在合并过程中发生错误，将抛出错误。
 */
const assignWhiteList = (whiteList: whiteList): whiteList => {
  try {
    debug('开始合并白名单');
    const newWhiteList: whiteList = {};
    for (const [key, value] of Object.entries(defaultWhiteList)) {
      newWhiteList[key as keyof whiteList] = { ...value, ...whiteList[key as keyof whiteList] };
    }
    debug('白名单合并完成');
    return newWhiteList;
  } catch (error) {
    debug('合并白名单时发生错误', { error });
    throwError(error as Error, 'assignWhiteList');
    return defaultWhiteList;
  }
};

/**
 * 显示白名单选项的表单，允许用户编辑白名单。
 *
 * @param {'page' | 'swal'} showType - 指定显示类型，支持 'page' 或 'swal'。
 *
 * @returns {void} 无返回值。
 *
 * @throws {Error} 如果在处理过程中发生错误，将抛出错误。
 */
const whiteListOptions = function (showType: 'page' | 'swal'): void {
  try {
    debug('开始显示白名单选项', { showType });
    const whiteList = assignWhiteList(GM_getValue<whiteList>('whiteList') || {});
    let whiteListOptionsForm = `<form id="whiteListForm" class="auto-task-form">
      <table class="auto-task-table">
        <thead>
          <tr>
            <td>${__('website')}</td>
            <td>${__('type')}</td>
            <td>${__('edit')}</td>
          </tr>
        </thead>
        <tbody>`;

    for (const [social, types] of Object.entries(whiteList)) {
      const validTypes = Object.keys(types).filter(
        (type) => !disabledType[social as keyof DisabledType]?.includes(type)
      );

      whiteListOptionsForm += validTypes.map((type, index) => {
        const bgColor = `${stringToColour(social)}66`;
        return `
          <tr style="background-color: ${bgColor}">
            ${index === 0 ? `<th rowspan="${validTypes.length}" style="background-color: ${bgColor}">${social}</th>` : ''}
            <td>${__(type)}</td>
            <td><button type="button" class="editWhiteList" data-value="${social}.${type}">${__('edit')}</button></td>
          </tr>`;
      }).join('');
    }

    whiteListOptionsForm += '</tbody></table></form>';

    if (showType === 'swal') {
      debug('使用Swal显示白名单选项');
      Swal.fire({
        title: __('whiteListOptions'),
        html: whiteListOptionsForm,
        showConfirmButton: false,
        showCloseButton: true
      });
    } else {
      debug('使用页面显示白名单选项');
      $('body').append(`<h2>${__('whiteList')}</h2>${whiteListOptionsForm}`);
    }

    $('.editWhiteList').on('click', function () {
      const value = $(this).attr('data-value');
      if (!value) return;

      const [social, type] = value.split('.');
      const currentList = (whiteList as WhiteList)[social]?.[type];

      if (!currentList) {
        debug('未找到白名单配置', { social, type });
        echoLog({}).warning(__('whiteListNotFound', value));
        return;
      }

      debug('编辑白名单', { social, type });
      Swal.fire({
        title: __('changeWhiteListOption', value),
        input: 'textarea',
        html: `
          <input id="socialLink" class="swal2-input" placeholder="在此处输入链接获取id">
          <button id="link2id" data-type="${value}" class="swal2-confirm swal2-styled">获取id</button>
          <p style="margin-bottom:0 !important;">在下方填写白名单，每行一个</p>
        `,
        inputValue: currentList.join('\n'),
        showConfirmButton: true,
        confirmButtonText: __('save'),
        showCancelButton: true,
        cancelButtonText: __('close'),
        showDenyButton: true,
        denyButtonText: __('return')
      }).then(({ isDenied, isConfirmed, value }) => {
        if (isDenied) {
          debug('返回白名单选项');
          if (showType === 'swal') {
            whiteListOptions(showType);
          }
          return;
        }

        if (isConfirmed && value) {
          debug('保存白名单更改', { social, type, value });
          (whiteList as WhiteList)[social][type] = value.split('\n').filter(Boolean);
          GM_setValue('whiteList', whiteList);
          Swal.fire({
            title: __('changeWhiteListSuccess'),
            icon: 'success'
          });
        }
      });

      $('#link2id').on('click', async function () {
        const type = $(this).attr('data-type');
        if (!type) return;

        debug('从链接获取ID按钮点击', { type });
        const id = await link2id(type);
        $('#socialLink').val(id);
      });
    });
  } catch (error) {
    debug('显示白名单选项时发生错误', { error });
    throwError(error as Error, 'whiteListOptions');
  }
};

export default whiteListOptions;
