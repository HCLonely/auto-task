/*
 * @Author       : HCLonely
 * @Date         : 2021-11-01 14:32:26
 * @LastEditTime : 2026-09-28 17:38:06
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/scripts/social/Steam.ts
 * @Description  : Steam 社交任务集成与模块适配
 */

import ModuleClient, { createGMHttpClient } from '../../modules/social/steam';
import { globalOptions } from '../globalOptions';
import { ProjectSocial } from './Social';
import { moduleNamespace, projectGM } from './moduleBridge';

/**
 * Steam 社交任务客户端，封装初始化、任务操作与状态管理。
 */
class Steam extends ProjectSocial<ModuleClient> {
  /**
   * 创建 Steam 实例并初始化所需状态。
   */
  constructor() {
    super(new ModuleClient({
      http: createGMHttpClient((options) => {
        return GM_xmlhttpRequest(options);
      }),
      gm: projectGM('steam'),
      namespace: moduleNamespace('steam'),
      ASF: globalOptions.ASF,
      doTask: globalOptions.doTask.steam,
      undoTask: globalOptions.undoTask.steam,
      autoChangeRegion: true
    }), 'Steam');
  }
  /**
   * 查询 Steam 鉴赏家标识。
   *
   * @param path - 请求路径。
   * @param name - 目标名称。
   * @returns Promise，完成后返回处理后的字符串；未取得有效结果时返回 false。
   */
  getCuratorId(path: string, name: string): Promise<string | false> {
    return this.client.getCuratorId(path, name);
  }
}
export default Steam;
