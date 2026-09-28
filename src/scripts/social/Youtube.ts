/*
 * @Author       : HCLonely
 * @Date         : 2021-10-29 19:27:33
 * @LastEditTime : 2026-09-28 17:38:06
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/scripts/social/Youtube.ts
 * @Description  : Youtube 社交任务集成与模块适配
 */

import ModuleClient, { createGMHttpClient } from '../../modules/social/youtube';
import { globalOptions } from '../globalOptions';
import { ProjectSocial } from './Social';
import { moduleNamespace, projectGM } from './moduleBridge';

/**
 * Youtube 社交任务客户端，封装初始化、任务操作与状态管理。
 */
class Youtube extends ProjectSocial<ModuleClient> {
  /**
   * 创建 Youtube 实例并初始化所需状态。
   */
  constructor() {
    super(new ModuleClient({
      http: createGMHttpClient((options) => {
        return GM_xmlhttpRequest(options);
      }),
      gm: projectGM('youtube'),
      namespace: moduleNamespace('youtube'),
      verifyChannel: globalOptions.other.youtubeVerifyChannel,
      doTask: globalOptions.doTask.youtube,
      undoTask: globalOptions.undoTask.youtube
    }), 'Youtube');
  }
}
export default Youtube;
export { Youtube };
/**
 * 获取频道或视频信息。
 *
 * @param link - 任务目标链接。
 * @param type - 操作或数据类型。
 * @returns Promise，完成后返回处理结果。
 */
export const getInfo = async (link: string, type: string): ReturnType<ModuleClient['getInfo']> => {
  if (type !== 'channel' && type !== 'likeVideo') {
    return {};
  }
  const youtube = new Youtube();
  try {
    return await youtube.client.getInfo(link, type);
  } finally {
    youtube.dispose();
  }
};
