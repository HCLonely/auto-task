/*
 * @Author       : HCLonely
 * @Date         : 2021-10-29 19:27:33
 * @LastEditTime : 2026-09-28 17:38:06
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/scripts/social/Twitter.ts
 * @Description  : Twitter 社交任务集成与模块适配
 */

import ModuleClient, { createGMHttpClient } from '../../modules/social/twitter';
import { globalOptions } from '../globalOptions';
import { ProjectSocial } from './Social';
import { moduleNamespace, projectGM } from './moduleBridge';

/**
 * Twitter 社交任务客户端，封装初始化、任务操作与状态管理。
 */
class Twitter extends ProjectSocial<ModuleClient> {
  /**
   * 创建 Twitter 实例并初始化所需状态。
   */
  constructor() {
    super(new ModuleClient({
      http: createGMHttpClient((options) => {
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
  }
  /**
   * 将用户名称转换为用户标识。
   *
   * @param name - 目标名称。
   * @returns Promise，完成后返回处理后的字符串；未取得有效结果时返回 false。
   */
  userName2id(name: string): Promise<string | false> {
    return this.client.userName2id(name);
  }
}
export default Twitter;
