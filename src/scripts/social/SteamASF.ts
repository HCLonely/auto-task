/*
 * @Author       : HCLonely
 * @Date         : 2024-04-29 14:16:49
 * @LastEditTime : 2026-09-28 17:38:06
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/scripts/social/SteamASF.ts
 * @Description  : SteamASF 社交任务集成与模块适配
 */

import ModuleClient, { createGMHttpClient } from '../../modules/social/steam/steamASF';
import { bindModuleStatus, moduleNamespace, projectGM } from './moduleBridge';

/**
 * SteamASF 社交任务客户端，封装初始化、任务操作与状态管理。
 */
export default class SteamASF extends ModuleClient {
  private readonly unsubscribe: /** 注销已注册的监听器。 */ () => void;
  /**
   * 创建 SteamASF 实例并初始化所需状态。
   *
   * @param options - 本次操作的配置选项。
   */
  constructor(options: { AsfIpcUrl: string; AsfIpcPassword: string; AsfBotname: string; steamWebApiKey: string }) {
    super({
      ...options,
      http: createGMHttpClient((request) => {
        return GM_xmlhttpRequest(request);
      }),
      gm: projectGM('steam'),
      namespace: `${moduleNamespace('steam')}:asf`
    });
    this.unsubscribe = bindModuleStatus(this, 'SteamASF');
  }
  /**
   * 释放模块资源并结束待处理的监听或等待。
   */
  dispose(): void {
    this.unsubscribe();
    super.dispose();
  }
}
