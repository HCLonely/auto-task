/*
 * @Author       : HCLonely
 * @Date         : 2021-10-29 19:27:33
 * @LastEditTime : 2026-09-28 17:38:06
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/scripts/social/Twitch.ts
 * @Description  : Twitch 社交任务集成与模块适配
 */

import ModuleClient, { createGMHttpClient } from '../../modules/social/twitch';
import { globalOptions } from '../globalOptions';
import { ProjectSocial } from './Social';
import { moduleNamespace, projectGM } from './moduleBridge';

/**
 * Twitch 社交任务客户端，封装初始化、任务操作与状态管理。
 */
class Twitch extends ProjectSocial<ModuleClient> {
  /**
   * 创建 Twitch 实例并初始化所需状态。
   */
  constructor() {
    super(new ModuleClient({
      http: createGMHttpClient((options) => {
        return GM_xmlhttpRequest(options);
      }),
      gm: projectGM('twitch'),
      namespace: moduleNamespace('twitch'),
      followEnabled: globalOptions.doTask.twitch.channels,
      unfollowEnabled: globalOptions.undoTask.twitch.channels
    }), 'Twitch');
  }
}
export default Twitch;
