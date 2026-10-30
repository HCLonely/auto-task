import Steam, { createGMHttpClient as createSteamHttp } from '../../modules/social/steam';
import Reddit, { createGMHttpClient as createRedditHttp } from '../../modules/social/reddit';
import Twitch, { createGMHttpClient as createTwitchHttp } from '../../modules/social/twitch';
import Twitter, { createGMHttpClient as createTwitterHttp } from '../../modules/social/twitter';
import Vk, { createGMHttpClient as createVkHttp } from '../../modules/social/vk';
import Youtube, { createGMHttpClient as createYoutubeHttp } from '../../modules/social/youtube';
import SteamASF, { createGMHttpClient as createSteamASFHttp } from '../../modules/social/steam/steamASF';
import type { SocialModule } from '../../modules/social/social/types';
import { globalOptions } from '../globalOptions';
import { bindModuleStatus, moduleNamespace, projectGM } from './moduleBridge';

/**
 * 在原生实例上接入项目日志，并在释放时一并移除监听。
 * 保留实例身份和所有业务方法；重复释放不会重复调用模块的 dispose。
 */
const connectProjectModule = <T extends Pick<SocialModule, 'on' | 'dispose'>>(client: T, platform: string): T => {
  const unsubscribe = bindModuleStatus(client, platform);
  const dispose = client.dispose.bind(client);
  let disposed = false;
  client.dispose = () => {
    if (disposed) {
      return;
    }
    disposed = true;
    try {
      unsubscribe();
    } finally {
      dispose();
    }
  };
  return client;
};

/** 创建原生 Steam 模块，注入项目配置、存储与状态日志。 */
export const createSteam = (): Steam => {
  return connectProjectModule(new Steam({
    http: createSteamHttp((options) => {
      return GM_xmlhttpRequest(options);
    }),
    gm: projectGM('steam'),
    namespace: moduleNamespace('steam'),
    ASF: globalOptions.ASF,
    doTask: globalOptions.doTask.steam,
    undoTask: globalOptions.undoTask.steam,
    autoChangeRegion: true
  }), 'Steam');
};

/** 创建原生 Reddit 模块，注入项目配置、存储与状态日志。 */
export const createReddit = (): Reddit => {
  return connectProjectModule(new Reddit({
    http: createRedditHttp((options) => {
      return GM_xmlhttpRequest(options);
    }),
    gm: projectGM('reddit'),
    namespace: moduleNamespace('reddit'),
    doTaskEnabled: globalOptions.doTask.reddit.reddits,
    undoTaskEnabled: globalOptions.undoTask.reddit.reddits
  }), 'Reddit');
};

/** 创建原生 Twitch 模块，注入项目配置、存储与状态日志。 */
export const createTwitch = (): Twitch => {
  return connectProjectModule(new Twitch({
    http: createTwitchHttp((options) => {
      return GM_xmlhttpRequest(options);
    }),
    gm: projectGM('twitch'),
    namespace: moduleNamespace('twitch'),
    followEnabled: globalOptions.doTask.twitch.channels,
    unfollowEnabled: globalOptions.undoTask.twitch.channels
  }), 'Twitch');
};

/** 创建原生 Twitter 模块，注入项目配置、存储与状态日志。 */
export const createTwitter = (): Twitter => {
  return connectProjectModule(new Twitter({
    http: createTwitterHttp((options) => {
      return GM_xmlhttpRequest(options);
    }),
    gm: {
      ...projectGM('twitter'),
      /**
       * 读取符合条件的 Cookie 列表。
       *
       * @param details - 状态事件的补充信息。
       * @param callback - 接收处理结果的回调函数。
       */
      listCookies: (details, callback) => {
        return GM_cookie.list(details, callback);
      }
    },
    namespace: moduleNamespace('twitter'),
    verifyId: globalOptions.other.twitterVerifyId,
    doTask: globalOptions.doTask.twitter,
    undoTask: globalOptions.undoTask.twitter
  }), 'Twitter');
};

/** 创建原生 Vk 模块，注入项目配置、存储与状态日志。 */
export const createVk = (): Vk => {
  return connectProjectModule(new Vk({
    http: createVkHttp((options) => {
      return GM_xmlhttpRequest(options);
    }),
    gm: projectGM('vk'),
    namespace: moduleNamespace('vk'),
    doTaskEnabled: globalOptions.doTask.vk.names,
    undoTaskEnabled: globalOptions.undoTask.vk.names
  }), 'Vk');
};

/** 创建原生 Youtube 模块，注入项目配置、存储与状态日志。 */
export const createYoutube = (): Youtube => {
  return connectProjectModule(new Youtube({
    http: createYoutubeHttp((options) => {
      return GM_xmlhttpRequest(options);
    }),
    gm: projectGM('youtube'),
    namespace: moduleNamespace('youtube'),
    verifyChannel: globalOptions.other.youtubeVerifyChannel,
    doTask: globalOptions.doTask.youtube,
    undoTask: globalOptions.undoTask.youtube
  }), 'Youtube');
};

/** 创建原生 ASF 客户端，用于项目挂时长结束后的停止操作。 */
export const createSteamASF = (options: typeof globalOptions.ASF): SteamASF => {
  return connectProjectModule(new SteamASF({
    ...options,
    http: createSteamASFHttp((request) => {
      return GM_xmlhttpRequest(request);
    }),
    gm: projectGM('steam'),
    namespace: `${moduleNamespace('steam')}:asf`
  }), 'SteamASF');
};

/** 查询 YouTube 信息，并在成功或失败后释放临时实例与监听。 */
export const getYoutubeInfo = async (link: string, type: string): ReturnType<Youtube['getInfo']> => {
  if (type !== 'channel' && type !== 'likeVideo') {
    return {};
  }
  const youtube = createYoutube();
  try {
    return await youtube.getInfo(link, type);
  } finally {
    youtube.dispose();
  }
};
