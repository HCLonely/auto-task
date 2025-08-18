/*
 * @Author       : HCLonely
 * @Date         : 2021-11-15 13:58:41
 * @LastEditTime : 2025-08-18 19:06:11
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/scripts/website/Keylol.ts
 * @Description  : https://keylol.com/f319-1
 */

import throwError from '../tools/throwError';
import Website from './Website';
import leftKeyChecker from './leftKeyChecker';
import __ from '../tools/i18n';
import { debug } from '../tools/debug';

const defaultTasksTemplate: keylolSocialTasks = {
  steam: {
    groupLinks: [],
    wishlistLinks: [],
    curatorLinks: [],
    curatorLikeLinks: [],
    followLinks: [],
    forumLinks: [],
    announcementLinks: [],
    workshopVoteLinks: [],
    licenseLinks: []
  },
  discord: {
    serverLinks: []
  },
  // instagram: {
  //   userLinks: []
  // },
  vk: {
    nameLinks: []
  },
  twitch: {
    channelLinks: []
  },
  reddit: {
    redditLinks: []
  },
  twitter: {
    userLinks: [],
    retweetLinks: []
  },
  youtube: {
    channelLinks: [],
    likeLinks: []
  }
};
const defaultTasks = JSON.stringify(defaultTasksTemplate);

// 添加更详细的类型定义
type TaskAction = 'do' | 'undo';
type SocialPlatform = keyof keylolSocialTasks;

// 首先定义更精确的类型
type TaskLinks = string[];

interface TaskButton extends HTMLElement {
  getAttribute(name: 'data-social'): SocialPlatform | null;
  getAttribute(name: 'data-type'): string | null;
  getAttribute(name: 'data-link'): string | null;
  getAttribute(name: 'selected'): string | null;
}

/**
 * Keylol 类用于处理 Keylol 网站的自动任务。
 *
 * @class Keylol
 * @extends Website
 *
 * @property {string} name - 网站名称，默认为 'Keylol'。
 * @property {keylolSocialTasks} socialTasks - 存储社交任务的对象。
 * @property {keylolSocialTasks} undoneTasks - 存储未完成任务的对象。
 * @property {Array<string>} buttons - 可用的操作按钮数组。
 *
 * @method static test - 检查当前域名是否为 Keylol 网站。
 * @returns {boolean} 如果当前域名为 'keylol.com' 且特定链接存在，则返回 true；否则返回 false。
 *
 * @method init - 初始化方法。
 * @returns {boolean} 总是返回 true，表示初始化成功。
 *
 * @method after - 抽奖后续操作的方法。
 * @returns {void} 无返回值。
 * @throws {Error} 如果在处理过程中发生错误，将抛出错误。
 *
 * @method classifyTask - 分类任务的方法。
 * @param {'do' | 'undo'} action - 要执行的操作类型，'do' 表示执行任务，'undo' 表示撤销任务。
 * @returns {boolean} 如果任务分类成功，则返回 true；否则返回 false。
 * @throws {Error} 如果在分类过程中发生错误，将抛出错误。
 *
 * @method selectAll - 选择所有可见任务的函数。
 * @returns {void} 无返回值。
 * @throws {Error} 如果在选择过程中发生错误，将抛出错误。
 *
 * @method selectNone - 取消选择所有可见任务的函数。
 * @returns {void} 无返回值。
 * @throws {Error} 如果在取消选择过程中发生错误，将抛出错误。
 *
 * @method invertSelect - 反转选择所有可见任务的函数。
 * @returns {void} 无返回值。
 * @throws {Error} 如果在反转选择过程中发生错误，将抛出错误。
 *
 * @method #addBtn - 添加按钮的方法。
 * @param {HTMLElement} before - 在该元素之后插入新按钮。
 * @param {string} social - 社交媒体类型。
 * @param {string} linkType - 链接类型。
 * @param {string} link - 要添加的链接。
 * @returns {void} 无返回值。
 * @throws {Error} 如果在添加按钮过程中发生错误，将抛出错误。
 */
class Keylol extends Website {
  name = 'Keylol';
  socialTasks: keylolSocialTasks = JSON.parse(defaultTasks);
  undoneTasks: keylolSocialTasks = JSON.parse(defaultTasks);
  buttons: Array<string> = [
    'doTask',
    'undoTask',
    'selectAll',
    'selectNone',
    'invertSelect'
  ];

  // 首先添加配置常量
  private static readonly CONFIG = {
    LINK_PATTERNS: {
      DISCORD: /^https?:\/\/discord\.com\/invite\/.+/,
      REDDIT: /^https?:\/\/www\.reddit\.com\/(r|user)\/.+/,
      INSTAGRAM: /^https:\/\/www\.instagram\.com\/.+/,
      TWITTER: /^https:\/\/(twitter|x)\.com\/.+/,
      TWITTER_RETWEET: /https:\/\/(twitter|x)\.com\/.*?\/status\/[\d]+/,
      TWITCH: /^https:\/\/(www\.)?twitch\.tv\/.+/,
      VK: /^https:\/\/vk\.com\/.+/,
      STEAM_CURATOR: /curator\/[\d]+/,
      STEAM_PUBLISHER: /(publisher|developer|franchise)\/.+/,
      STEAM_NEWS: /news(hub)?\/app\/[\d]+\/view\/[\d]+/,
      STEAM_APP: /app\/[\d]+/,
      STEAM_GROUP: /groups\/.+/,
      STEAM_ANNOUNCEMENT: /announcements\/detail\/[\d]+/,
      YOUTUBE: /youtube\.com/
    },
    SELECTORS: {
      MAIN_POST: {
        KEYLOL: '#postlist>div[id^="post_"]:first',
        DEFAULT: 'div.container'
      }
    }
  } as const;

  /**
   * 检查当前域名是否为 Keylol 网站的静态方法
   *
   * @returns {boolean} 如果当前域名为 'keylol.com' 且特定链接存在，则返回 true；否则返回 false。
   *
   * @description
   * 该方法通过比较当前窗口的域名来判断是否为 Keylol 网站。
   * 同时检查页面中是否存在特定的链接（索引为 3 的链接），
   * 如果该链接的 href 属性包含 '319' 或 '234'，则返回 true；否则返回 false。
   */
  static test(): boolean {
    const { host } = window.location;
    const link = $('.subforum_left_title_left_up a').eq(3)
      .attr('href');
    const isMatch = host === 'keylol.com' && (!!link?.includes('319') || !!link?.includes('234'));
    debug('检查网站匹配', { host, link, isMatch });
    return isMatch;
  }

  /**
   * 初始化方法
   *
   * @returns {boolean} 总是返回 true，表示初始化成功。
   *
   * @description
   * 该方法用于初始化相关设置或状态。
   * 当前实现仅返回 true，表示初始化过程已完成。
   */
  init(): boolean {
    debug('初始化 Keylol');
    return true;
  }

  /**
   * 页面加载后的方法
   *
   * @returns {void} 无返回值。
   *
   * @throws {Error} 如果在处理过程中发生错误，将抛出错误。
   *
   * @description
   * 该方法筛选可见的链接并分类不同类型的社交媒体链接。
   * 包括 Discord、Reddit、Instagram、Twitter、Twitch、VK、Steam 商店、Steam 社区和 YouTube 的链接。
   * 对于每种类型的链接，调用私有方法 `#addBtn` 将其添加到相应的任务列表中。
   * 还会检查页面中的抽奖链接，并根据状态进行分类。
   * 如果是 Keylol 网站，还会处理特定的 ASF 和 SteamDB 链接。
   */
  after(): void {
    try {
      debug('开始处理页面链接');
      const mainPost = $(this.name === 'Keylol' ?
        Keylol.CONFIG.SELECTORS.MAIN_POST.KEYLOL :
        Keylol.CONFIG.SELECTORS.MAIN_POST.DEFAULT);

      // 一次性获取所有链接
      const allLinks = mainPost.find('a');
      debug('找到所有链接', { count: allLinks.length });

      // 一次性过滤所有链接
      allLinks.each((_, link) => {
        const $link = $(link);
        const href = $link.attr('href');
        if (!href) return;

        this.#classifyAndProcessLink($link, href);
      });

      // 处理抽奖链接
      debug('开始处理抽奖链接');
      this.#processGiveawayLinks(mainPost);

      // 处理 Keylol 特定的链接
      if (this.name === 'Keylol') {
        debug('开始处理 Keylol 特定链接');
        this.#processKeylolSpecificLinks(mainPost);
      }

      // 设置 MutationObserver
      debug('设置 MutationObserver');
      this.#setupMutationObserver();
    } catch (error) {
      debug('处理页面链接失败', { error });
      throwError(error as Error, 'keylol.after');
    }
  }

  /**
   * 分类并处理单个链接
   */
  #classifyAndProcessLink($link: JQuery<HTMLElement>, href: string): void {
    debug('分类处理链接', { href });
    const { LINK_PATTERNS } = Keylol.CONFIG;

    // 使用 switch-case 替代多个 if-else，提高性能
    switch (true) {
        case LINK_PATTERNS.DISCORD.test(href):
          debug('发现 Discord 链接');
          this.#addBtn($link[0], 'discord', 'serverLinks', href);
          break;

        case LINK_PATTERNS.REDDIT.test(href):
          debug('发现 Reddit 链接');
          this.#addBtn($link[0], 'reddit', 'redditLinks', href);
          break;

          // case LINK_PATTERNS.INSTAGRAM.test(href):
          //   debug('发现 Instagram 链接');
          //   this.#addBtn($link[0], 'instagram', 'userLinks', href);
          //   break;

        case LINK_PATTERNS.TWITTER.test(href):
          if (LINK_PATTERNS.TWITTER_RETWEET.test(href)) {
            debug('发现 Twitter 转发链接');
            this.#addBtn($link[0], 'twitter', 'retweetLinks', href);
          } else {
            debug('发现 Twitter 用户链接');
            this.#addBtn($link[0], 'twitter', 'userLinks', href);
          }
          break;

        case LINK_PATTERNS.TWITCH.test(href):
          debug('发现 Twitch 链接');
          this.#addBtn($link[0], 'twitch', 'channelLinks', href);
          break;

        case LINK_PATTERNS.VK.test(href):
          debug('发现 VK 链接');
          this.#addBtn($link[0], 'vk', 'nameLinks', href);
          break;

        case href.includes('store.steampowered.com'):
          debug('发现 Steam 商店链接');
          this.#processSteamStoreLink($link[0], href);
          break;

        case href.includes('steamcommunity.com'):
          debug('发现 Steam 社区链接');
          this.#processSteamCommunityLink($link[0], href);
          break;

        case LINK_PATTERNS.YOUTUBE.test(href):
          debug('发现 YouTube 链接');
          this.#addBtn($link[0], 'youtube', 'channelLinks', href);
          this.#addBtn($link[0], 'youtube', 'likeLinks', href);
          break;
    }
  }

  /**
   * 处理 Steam 商店链接
   */
  #processSteamStoreLink(element: HTMLElement, href: string): void {
    debug('处理 Steam 商店链接', { href });
    const { LINK_PATTERNS } = Keylol.CONFIG;

    if (LINK_PATTERNS.STEAM_CURATOR.test(href)) {
      debug('发现 Steam 鉴赏家链接');
      this.#addBtn(element, 'steam', 'curatorLinks', href);
    } else if (LINK_PATTERNS.STEAM_PUBLISHER.test(href)) {
      debug('发现 Steam 发行商链接');
      this.#addBtn(element, 'steam', 'curatorLikeLinks', href);
    } else if (LINK_PATTERNS.STEAM_NEWS.test(href)) {
      debug('发现 Steam 新闻链接');
      this.#addBtn(element, 'steam', 'announcementLinks', href);
    } else if (LINK_PATTERNS.STEAM_APP.test(href)) {
      debug('发现 Steam 应用链接');
      this.#addBtn(element, 'steam', 'followLinks', href);
      this.#addBtn(element, 'steam', 'wishlistLinks', href);
    }
  }

  /**
   * 处理 Steam 社区链接
   */
  #processSteamCommunityLink(element: HTMLElement, href: string): void {
    debug('处理 Steam 社区链接', { href });
    const { LINK_PATTERNS } = Keylol.CONFIG;

    if (LINK_PATTERNS.STEAM_GROUP.test(href)) {
      debug('发现 Steam 组链接');
      this.#addBtn(element, 'steam', 'groupLinks', href);
    } else if (LINK_PATTERNS.STEAM_ANNOUNCEMENT.test(href)) {
      debug('发现 Steam 公告链接');
      this.#addBtn(element, 'steam', 'announcementLinks', href);
    }
  }

  /**
   * 处理抽奖链接
   */
  #processGiveawayLinks(mainPost: JQuery<HTMLElement>): void {
    debug('开始处理抽奖链接');
    const giveawayLinks = mainPost.find(
      'a[href*="giveaway.su/giveaway/view/"],' +
      'a[href*="givee.club/"],' +
      'a[href*="gleam.io/"],' +
      'a[href*="www.indiedb.com/giveaways/"],' +
      'a[href*="key-hub.eu/giveaway/"],' +
      'a[href*="opquests.com/quests/"],' +
      'a[href*="freeanywhere.net/game?n="],' +
      'a[href*="itch.io/s/"]:visible'
    );

    debug('找到抽奖链接', { count: giveawayLinks.length });

    giveawayLinks.each((_, link) => {
      const href = $(link).attr('href');
      if (!href) return;

      debug('检查抽奖链接状态', { href });
      leftKeyChecker.classify(href)
        .then((status) => {
          if (!status) return;

          const statusClass = /^Active/.test(status) ? 'active' : 'not-active';
          const statusTitle = /^Active/.test(status) ? __('Active') : __(status);

          debug('更新抽奖链接状态', { href, status, statusClass });
          $(`a[href="${href}"]`).after(
            `<font class="auto-task-giveaway-status ${statusClass}" title="${statusTitle}">${status}</font>`
          );
        })
        .catch((error) => {
          debug('检查抽奖链接状态失败', { href, error });
          throwError(error, 'keylol.after -> leftKeyChecker');
        });
    });
  }

  /**
   * 处理 Keylol 特定的链接
   */
  #processKeylolSpecificLinks(mainPost: JQuery<HTMLElement>): void {
    debug('开始处理 Keylol 特定链接');

    // 处理 ASF 链接
    const asfLinks = mainPost.find('a[href^="#asf"]:visible');
    debug('找到 ASF 链接', { count: asfLinks.length });

    asfLinks.each((_, link) => {
      const href = $(link).attr('href');
      if (!href) return;

      debug('处理 ASF 链接', { href });
      const $link = $(`a[href="${href}"]`);
      $link.after('<span style="color: #ccc; margin: 0 -5px 0 5px"> | </span>');
      this.#addBtn($link.next()[0], 'steam', 'licenseLinks', `appid-${href.replace('#asf', '')}`);
    });

    // 处理 SteamDB 链接
    const steamDbLinks = mainPost.find('a[href*="steamdb.info/sub/"]:visible');
    debug('找到 SteamDB 链接', { count: steamDbLinks.length });

    steamDbLinks.each((_, link) => {
      const href = $(link).attr('href');
      if (!href) return;

      const subid = href.match(/^https:\/\/steamdb\.info\/sub\/([\d]+)/)?.[1];
      if (!subid) return;

      debug('处理 SteamDB 链接', { href, subid });
      this.#addBtn(link, 'steam', 'licenseLinks', `subid-${subid}`);
    });

    // 处理 ASF 代码块
    const asfBlocks = mainPost.find('.blockcode:contains("addlicense"):visible');
    debug('找到 ASF 代码块', { count: asfBlocks.length });

    asfBlocks.each((_, block) => {
      const appid = [...block.innerText.matchAll(/a(pp)?\/([\d]+)/g)]
        .map((matched) => matched?.[2])
        .filter((id) => id);

      if (appid.length > 0) {
        debug('处理 ASF 代码块 appid', { appid });
        this.#addBtn($(block).children('em')[0], 'steam', 'licenseLinks', `appid-${appid.join(',')}`);
      }

      const subid = block.innerText.match(/[\d]+/g)?.filter((matched) => !appid.includes(matched));
      if (subid?.length) {
        debug('处理 ASF 代码块 subid', { subid });
        this.#addBtn($(block).children('em')[0], 'steam', 'licenseLinks', `subid-${subid.join(',')}`);
      }
    });
  }

  /**
   * 设置 MutationObserver
   */
  #setupMutationObserver(): void {
    debug('设置 MutationObserver');
    if ($('#threadindex').length > 0) {
      const [elementTargetNode] = $('#postlist').children('div[id^="post_"]');
      const elementObserver = new MutationObserver(() => {
        debug('检测到 DOM 变化，重新处理页面');
        elementObserver.disconnect();
        this.after();
      });
      elementObserver.observe(elementTargetNode, {
        childList: true
      });
      debug('MutationObserver 设置完成');
    }
  }

  /**
   * 分类任务的方法
   *
   * @param {'do' | 'undo'} action - 要执行的操作类型，'do' 表示执行任务，'undo' 表示撤销任务。
   * @returns {boolean} 如果任务分类成功，则返回 true；否则返回 false。
   *
   * @throws {Error} 如果在分类过程中发生错误，将抛出错误。
   *
   * @description
   * 该方法根据传入的操作类型分类任务。
   * 首先将社交任务和未完成任务初始化为默认任务。
   * 然后遍历所有被选中的按钮，提取社交媒体类型、任务类型和链接。
   * 根据操作类型，将链接添加到相应的任务列表中。
   * 最后，去重任务列表并返回成功状态。
   */
  classifyTask(action: TaskAction): boolean {
    try {
      debug('开始分类任务', { action });
      this.socialTasks = JSON.parse(defaultTasks);
      this.undoneTasks = JSON.parse(defaultTasks);
      const selectedBtns = $('.auto-task-keylol[selected="selected"]:visible').get() as TaskButton[];
      debug('找到选中的按钮', { count: selectedBtns.length });

      for (const btn of selectedBtns) {
        const social = btn.getAttribute('data-social');
        const type = btn.getAttribute('data-type');
        const link = btn.getAttribute('data-link');

        debug('处理任务按钮', { social, type, link });

        if (!(social && type && link)) {
          debug('跳过无效任务按钮');
          continue;
        }
        if (!(social in this.undoneTasks)) {
          debug('跳过未知社交平台', { social });
          continue;
        }

        if (action === 'do' && type in this.undoneTasks[social as SocialPlatform]) {
          debug('添加到未完成任务', { social, type, link });
          (this.undoneTasks[social as SocialPlatform][type as keyof typeof this.undoneTasks[SocialPlatform]] as TaskLinks).push(link);
        }
        if (action === 'undo' && type in this.socialTasks[social as SocialPlatform]) {
          debug('添加到社交任务', { social, type, link });
          (this.socialTasks[social as SocialPlatform][type as keyof typeof this.socialTasks[SocialPlatform]] as TaskLinks).push(link);
        }
      }

      this.undoneTasks = this.uniqueTasks(this.undoneTasks) as keylolSocialTasks;
      this.socialTasks = this.uniqueTasks(this.socialTasks) as keylolSocialTasks;
      debug('任务分类完成', { undoneTasks: this.undoneTasks, socialTasks: this.socialTasks });
      return true;
    } catch (error) {
      debug('任务分类失败', { error });
      throwError(error as Error, 'Keylol.classifyTask');
      return false;
    }
  }

  /**
   * 选择所有可见任务的函数
   *
   * @returns {void} 无返回值。
   *
   * @throws {Error} 如果在选择过程中发生错误，将抛出错误。
   *
   * @description
   * 该方法选择所有可见的自动任务，并将其标记为选中状态。
   * 使用 jQuery 选择器查找所有可见的 `.auto-task-keylol` 元素，并设置其 `selected` 属性为 'selected'。
   */
  selectAll(): void {
    try {
      debug('选择所有可见任务');
      const tasks = $('.auto-task-keylol:visible');
      tasks.attr('selected', 'selected');
      debug('选择完成', { count: tasks.length });
    } catch (error) {
      debug('选择所有任务失败', { error });
      throwError(error as Error, 'Keylol.selectAll');
    }
  }

  /**
   * 取消选择所有可见任务的函数
   *
   * @returns {void} 无返回值。
   *
   * @throws {Error} 如果在取消选择过程中发生错误，将抛出错误。
   *
   * @description
   * 该方法取消所有可见的自动任务的选中状态。
   * 使用 jQuery 选择器查找所有可见的 `.auto-task-keylol` 元素，并移除其 `selected` 属性。
   */
  selectNone(): void {
    try {
      debug('取消选择所有可见任务');
      const tasks = $('.auto-task-keylol:visible');
      tasks.removeAttr('selected');
      debug('取消选择完成', { count: tasks.length });
    } catch (error) {
      debug('取消选择所有任务失败', { error });
      throwError(error as Error, 'Keylol.selectNone');
    }
  }

  /**
   * 反转选择所有可见任务的函数
   *
   * @returns {void} 无返回值。
   *
   * @throws {Error} 如果在反转选择过程中发生错误，将抛出错误。
   *
   * @description
   * 该方法遍历所有可见的自动任务，并根据当前状态反转其选中状态。
   * 如果任务当前被选中，则移除其 `selected` 属性；如果未被选中，则添加 `selected` 属性。
   */
  invertSelect(): void {
    try {
      debug('反转选择所有可见任务');
      const tasks = $('.auto-task-keylol:visible');
      tasks.each((_, element) => {
        const $element = $(element);
        if ($element.attr('selected')) {
          $element.removeAttr('selected');
        } else {
          $element.attr('selected', 'selected');
        }
      });
      debug('反转选择完成', { count: tasks.length });
    } catch (error) {
      debug('反转选择任务失败', { error });
      throwError(error as Error, 'Keylol.invertSelect');
    }
  }

  /**
   * 添加按钮的方法
   *
   * @param {HTMLElement} before - 在该元素之后插入新按钮。
   * @param {string} social - 社交媒体类型。
   * @param {string} linkType - 链接类型。
   * @param {string} link - 要添加的链接。
   * @returns {void} 无返回值。
   *
   * @throws {Error} 如果在添加按钮过程中发生错误，将抛出错误。
   *
   * @description
   * 该方法在指定的元素之后插入一个新的按钮。
   * 按钮的点击事件会根据当前状态切换 `selected` 属性。
   * 按钮还包含社交媒体类型、链接类型和链接信息，以便后续操作使用。
   */
  #addBtn(before: HTMLElement, social: string, linkType: string, link: string): void {
    try {
      debug('添加任务按钮', { social, linkType, link });
      if (!before || !social || !linkType || !link) {
        debug('跳过无效按钮参数');
        return;
      }

      const button = $('<a>', {
        href: 'javascript:void(0);',
        class: 'auto-task-keylol',
        target: '_self',
        'data-social': social,
        'data-type': linkType,
        'data-link': link,
        text: linkType.replace('Links', ''),
        onclick: 'this.getAttribute("selected") ? this.removeAttribute("selected") : this.setAttribute("selected", "selected")'
      });
      $(before).after(button);
      debug('按钮添加成功');
    } catch (error) {
      debug('添加按钮失败', { error, social, linkType });
      throwError(error as Error, `keylol.addBtn: ${social}/${linkType}`);
    }
  }
}

export default Keylol;
