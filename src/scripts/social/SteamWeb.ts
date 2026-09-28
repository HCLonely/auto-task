/*
 * @Author       : HCLonely
 * @Date         : 2025-08-18 19:22:41
 * @LastEditTime : 2026-09-28 17:38:06
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/scripts/social/SteamWeb.ts
 * @Description  : SteamWeb 社交任务集成与模块适配
 */

import ModuleClient, { createGMHttpClient } from '../../modules/social/steam/steamWeb';
import { bindModuleStatus, moduleNamespace, projectGM } from './moduleBridge';

/**
 * SteamWeb 社交任务客户端，封装初始化、任务操作与状态管理。
 */
export default class SteamWeb extends ModuleClient {
  private readonly unsubscribe: /** 注销已注册的监听器。 */ () => void;
  /**
   * 创建 SteamWeb 实例并初始化所需状态。
   */
  constructor() {
    super({
      autoChangeRegion: true,
      http: createGMHttpClient((request) => {
        return GM_xmlhttpRequest(request);
      }),
      gm: projectGM('steam'),
      namespace: `${moduleNamespace('steam')}:web`
    });
    this.unsubscribe = bindModuleStatus(this, 'SteamWeb');
  }
  /**
   * 释放模块资源并结束待处理的监听或等待。
   */
  dispose(): void {
    this.unsubscribe();
    super.dispose();
  }
}
