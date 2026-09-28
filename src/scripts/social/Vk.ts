/*
 * @Author       : HCLonely
 * @Date         : 2021-10-29 19:27:33
 * @LastEditTime : 2026-09-28 17:38:06
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/scripts/social/Vk.ts
 * @Description  : Vk 社交任务集成与模块适配
 */

import ModuleClient, { createGMHttpClient } from '../../modules/social/vk';
import { globalOptions } from '../globalOptions';
import { ProjectSocial } from './Social';
import { moduleNamespace, projectGM } from './moduleBridge';

/**
 * Vk 社交任务客户端，封装初始化、任务操作与状态管理。
 */
class Vk extends ProjectSocial<ModuleClient> {
  /**
   * 创建 Vk 实例并初始化所需状态。
   */
  constructor() {
    super(new ModuleClient({
      http: createGMHttpClient((options) => {
        return GM_xmlhttpRequest(options);
      }),
      gm: projectGM('vk'),
      namespace: moduleNamespace('vk'),
      doTaskEnabled: globalOptions.doTask.vk.names,
      undoTaskEnabled: globalOptions.undoTask.vk.names
    }), 'Vk');
  }
}
export default Vk;
