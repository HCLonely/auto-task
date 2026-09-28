/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 17:09:58
 * @LastEditTime : 2026-09-28 17:38:07
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/modules/social/steam/steamWeb/features/playtest.ts
 * @Description  : Steam 网页端 游戏测试资格申请
 */

import type { Context } from '../context';
import { encodeForm } from '../utils/html';

/**
 * 申请游戏测试资格。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @param id - 目标标识。
 * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
 */
export async function requestPlayTestAccess(ctx: Context, id: string): Promise<boolean> {
  return ctx.run('playtest.requestPlayTestAccess', id, async (ctx): Promise<boolean> => {
    if (ctx.state.disposed || !ctx.state.storeInitialized) {
      ctx.progress(ctx.state.disposed ? 'DISPOSED' : 'AUTH_REQUIRED', 'error');
      return false;
    }
    try {
      const stepStatus = ctx.step('requestingPlayTestAccess', id);
      const {
        result, data
      } = await ctx.request({
        url: `https://store.steampowered.com/ajaxrequestplaytestaccess/${id}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          Host: 'store.steampowered.com',
          Origin: 'https://store.steampowered.com',
          Referer: `https://store.steampowered.com/app/${id}`
        },
        data: encodeForm({
          sessionid: ctx.state.auth.storeSessionID
        }),
        dataType: 'json'
      });
      if (result !== 'Success') {
        stepStatus.error('REQUEST_OR_RESPONSE_FAILED');
        return false;
      }
      if (data?.status !== 200 || data?.response?.success !== 1) {
        stepStatus.error('REQUEST_OR_RESPONSE_FAILED');
        return false;
      }
      stepStatus.success('STEP_COMPLETED');
      return true;
    } catch (error) {
      ctx.reportError();
      return false;
    }
  });
}
