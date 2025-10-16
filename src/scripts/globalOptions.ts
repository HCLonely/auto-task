/*
 * @Author       : HCLonely
 * @Date         : 2021-12-24 16:41:12
 * @LastEditTime : 2025-08-18 19:04:41
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/scripts/globalOptions.ts
 * @Description  : 全局设置选项
 */

/**
 * 默认全局选项配置对象，包含各个平台的任务设置、位置、热键和其他选项。
 *
 * @constant {globalOptions} defaultGlobalOptions
 * @property {Object} doTask - 执行任务的选项。
 * @property {Object} doTask.discord - Discord 平台的任务设置。
 * @property {boolean} doTask.discord.servers - 是否执行 Discord 服务器任务。
//  * @property {Object} doTask.instagram - Instagram 平台的任务设置。
//  * @property {boolean} doTask.instagram.users - 是否执行 Instagram 用户任务。
 * @property {Object} doTask.twitch - Twitch 平台的任务设置。
 * @property {boolean} doTask.twitch.channels - 是否执行 Twitch 频道任务。
 * @property {Object} doTask.twitter - Twitter 平台的任务设置。
 * @property {boolean} doTask.twitter.users - 是否执行 Twitter 用户任务。
 * @property {boolean} doTask.twitter.retweets - 是否执行 Twitter 转发任务。
 * @property {Object} doTask.vk - VK 平台的任务设置。
 * @property {boolean} doTask.vk.names - 是否执行 VK 名称任务。
 * @property {Object} doTask.youtube - YouTube 平台的任务设置。
 * @property {boolean} doTask.youtube.channels - 是否执行 YouTube 频道任务。
 * @property {boolean} doTask.youtube.likes - 是否执行 YouTube 点赞任务。
 * @property {Object} doTask.reddit - Reddit 平台的任务设置。
 * @property {boolean} doTask.reddit.reddits - 是否执行 Reddit 子版块任务。
 * @property {Object} doTask.steam - Steam 平台的任务设置。
 * @property {boolean} doTask.steam.groups - 是否执行 Steam 群组任务。
 * @property {boolean} doTask.steam.officialGroups - 是否执行 Steam 官方群组任务。
 * @property {boolean} doTask.steam.wishlists - 是否执行 Steam 心愿单任务。
 * @property {boolean} doTask.steam.follows - 是否执行 Steam 关注任务。
 * @property {boolean} doTask.steam.forums - 是否执行 Steam 论坛任务。
 * @property {boolean} doTask.steam.workshops - 是否执行 Steam 工作坊任务。
 * @property {boolean} doTask.steam.curators - 是否执行 Steam 策展人任务。
 * @property {boolean} doTask.steam.workshopVotes - 是否执行 Steam 工作坊投票任务。
 * @property {boolean} doTask.steam.announcements - 是否执行 Steam 公告任务。
 * @property {boolean} doTask.steam.licenses - 是否执行 Steam 许可证任务。
 * @property {boolean} doTask.steam.playtests - 是否执行 Steam 测试版任务。
 *
 * @property {Object} undoTask - 撤销任务的选项，结构与 doTask 相同。
 *
 * @property {Object} ASF - ASF 相关设置。
 * @property {boolean} ASF.AsfEnabled - 是否启用 ASF。
 * @property {string} ASF.AsfIpcUrl - ASF IPC URL。
 * @property {string} ASF.AsfIpcPassword - ASF IPC 密码。
 * @property {string} ASF.AsfBotname - ASF 机器人名称。
 *
 * @property {Object} position - 按钮和日志的位置设置。
 * @property {string} position.buttonSideX - 按钮 X 轴位置。
 * @property {string} position.buttonSideY - 按钮 Y 轴位置。
 * @property {string} position.buttonDistance - 按钮距离。
 * @property {string} position.showButtonSideX - 显示按钮 X 轴位置。
 * @property {string} position.showButtonSideY - 显示按钮 Y 轴位置。
 * @property {string} position.showButtonDistance - 显示按钮距离。
 * @property {string} position.logSideX - 日志 X 轴位置。
 * @property {string} position.logSideY - 日志 Y 轴位置。
 * @property {string} position.logDistance - 日志距离。
 *
 * @property {Object} hotKey - 热键设置。
 * @property {string} hotKey.doTaskKey - 执行任务的热键。
 * @property {string} hotKey.undoTaskKey - 撤销任务的热键。
 * @property {string} hotKey.toggleLogKey - 切换日志的热键。
 *
 * @property {Object} other - 其他设置。
 * @property {string} other.twitterVerifyId - Twitter 验证 ID。
 * @property {string} other.youtubeVerifyChannel - YouTube 验证频道。
 * @property {string} other.autoUpdateSource - 自动更新源。
 * @property {string} other.language - 语言设置。
 * @property {boolean} other.checkLogin - 是否检查登录状态。
 * @property {boolean} other.checkLeftKey - 是否检查左键。
 * @property {boolean} other.defaultShowButton - 默认是否显示按钮。
 * @property {boolean} other.defaultShowLog - 默认是否显示日志。
 * @property {boolean} other.debug - 是否启用调试模式。
 * @property {boolean} other.receivePreview - 是否接收预览。
 */
const defaultGlobalOptions: globalOptions = {
  doTask: {
    discord: {
      servers: true
    },
    // instagram: {
    //   users: true
    // },
    twitch: {
      channels: true
    },
    twitter: {
      users: true,
      retweets: true
    },
    vk: {
      names: true
    },
    youtube: {
      channels: true,
      likes: true
    },
    reddit: {
      reddits: true
    },
    steam: {
      groups: true,
      officialGroups: true,
      wishlists: true,
      follows: true,
      forums: true,
      workshops: true,
      curators: true,
      workshopVotes: true,
      announcements: true,
      licenses: true,
      playtests: true,
      playTime: true
    }
  },
  undoTask: {
    discord: {
      servers: true
    },
    // instagram: {
    //   users: true
    // },
    twitch: {
      channels: true
    },
    twitter: {
      users: true,
      retweets: true
    },
    vk: {
      names: true
    },
    youtube: {
      channels: true,
      likes: true
    },
    reddit: {
      reddits: true
    },
    steam: {
      groups: true,
      officialGroups: true,
      wishlists: true,
      follows: true,
      forums: true,
      workshops: true,
      curators: true,
      playTime: true
    }
  },
  ASF: {
    AsfEnabled: false,
    AsfIpcUrl: '',
    AsfIpcPassword: '',
    AsfBotname: 'asf',
    steamWeb: false,
    preferASF: false,
    steamWebApiKey: ''
  },
  position: {
    buttonSideX: 'right',
    buttonSideY: 'top',
    buttonDistance: '15,30',
    showButtonSideX: 'right',
    showButtonSideY: 'top',
    showButtonDistance: '15,30',
    logSideX: 'right',
    logSideY: 'bottom',
    logDistance: '10,10'
  },
  hotKey: {
    doTaskKey: 'alt + d',
    undoTaskKey: 'alt + u',
    toggleLogKey: 'alt + l'
  },
  other: {
    twitterVerifyId: '783214',
    youtubeVerifyChannel: 'UCrXUsMBcfTVqwAS7DKg9C0Q',
    autoUpdateSource: 'jsdelivr',
    language: 'zh',
    checkLogin: true,
    checkLeftKey: true,
    defaultShowButton: true,
    defaultShowLog: true,
    debug: false,
    receivePreview: true
  }
};

/**
 * 从存储中获取用户定义的全局选项
 * 使用 GM_getValue 从油猴存储中读取配置，如果不存在则返回空对象
 *
 * @returns {Partial<globalOptions>} 用户定义的全局选项，可能只包含部分配置
 */
const userDefinedGlobalOptions = GM_getValue<Partial<globalOptions>>('globalOptions') || {};

/**
 * 深度合并两个对象，返回一个新的对象
 * 该方法会递归合并所有嵌套的对象属性，保留源对象中未定义的目标对象属性
 *
 * @template T - 对象类型参数，必须是一个对象类型
 * @param {T} target - 目标对象，作为基础配置
 * @param {Partial<T>} source - 源对象，用于覆盖目标对象的配置，可以是部分配置
 * @returns {T} 返回合并后的新对象，类型与目标对象相同
 * @throws {Error} 在合并过程中如果发生错误，会被 try-catch 捕获并记录，返回目标对象
 */
const deepMerge = <T extends object>(target: T, source: Partial<T>): T => {
  try {
    const result = { ...target };

    for (const [key, value] of Object.entries(source)) {
      const targetValue = target[key as keyof T];

      if (isObject(value) && isObject(targetValue)) {
        result[key as keyof T] = deepMerge(targetValue, value) as T[keyof T];
      } else if (value !== undefined) {
        // 检查类型是否一致，如果不一致则使用target的值
        if (typeof value === typeof targetValue) {
          result[key as keyof T] = value as T[keyof T];
        } else {
          console.log('%c%s', 'color:yellow;background:black', `Auto-Task[Warning]: Type mismatch for key "${key}". Expected ${typeof targetValue}, got ${typeof value}. Using default value.`);
        }
      }
    }

    return result;
  } catch (error) {
    console.log('%c%s', 'color:white;background:red', `Auto-Task[Error]: deepMerge\n${(error as Error).stack}`);
    return target;
  }
};

/**
 * 检查值是否为普通对象（不包括数组和 null）
 *
 * @param {unknown} value - 要检查的值，可以是任意类型
 * @returns {boolean} 如果值是对象且不是数组或 null，返回 true；否则返回 false
 */
const isObject = (value: unknown): value is object => value !== null && typeof value === 'object' && !Array.isArray(value);

/**
 * 全局配置实例
 * 通过深度合并默认配置和用户定义的配置创建
 * 这个实例将作为应用程序的主要配置对象
 *
 * @type {globalOptions} 完整的全局配置对象
 */
const globalOptions = deepMerge(defaultGlobalOptions, userDefinedGlobalOptions);

export { globalOptions };
