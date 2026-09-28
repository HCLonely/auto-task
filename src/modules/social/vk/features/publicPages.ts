/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 17:09:58
 * @LastEditTime : 2026-09-28 17:38:07
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/modules/social/vk/features/publicPages.ts
 * @Description  : VK 公共页面关注与取消关注
 */

import type { Context } from '../context';
import type { PublicParams } from '../types';

/**
 * 保留公共页面内部操作接口，但不自动解析公共页面任务。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @param name - 目标名称。
 * @param params - 操作参数集合。
 * @param doTask - 是否执行任务；为 false 时执行撤销操作；默认值为 `true`。
 * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
 */
function executePublic(ctx: Context, name: string, params: PublicParams, doTask = true): Promise<boolean> {
  return ctx.run(doTask ? 'public.join' : 'public.leave', name, false, async (ctx) => {
    if (params.publicJoined === doTask) {
      return ctx.skip('ALREADY_IN_DESIRED_STATE');
    }
    if (!params.publicPid || !params.publicHash) {
      return ctx.fail('MISSING_PARAMETERS');
    }
    const data = await ctx.request({
      url: 'https://vk.com/al_public.php',
      method: 'POST',
      responseType: 'json',
      headers: {
        origin: 'https://vk.com',
        referer: `https://vk.com/${name}`,
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: new URLSearchParams({
        act: doTask ? 'a_enter' : 'a_leave',
        al: '1',
        pid: params.publicPid,
        hash: params.publicHash
      }).toString()
    });
    if (!data || data.response?.error) {
      return ctx.fail('PUBLIC_REQUEST_FAILED');
    }
    // Legacy al_* replies place their status code in payload[0].
    if (!Array.isArray(data.response?.payload) || ![0, '0'].includes(data.response.payload[0])) {
      return ctx.fail('INVALID_RESPONSE');
    }
    if (doTask) {
      ctx.record(name);
    }
    return true;
  });
}

/**
 * 关注公共页面。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @param name - 目标名称。
 * @param params - 操作参数集合。
 * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
 */
export function doPublic(ctx: Context, name: string, params: PublicParams): Promise<boolean> {
  return executePublic(ctx, name, params, true);
}
/**
 * 取消关注公共页面。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @param name - 目标名称。
 * @param params - 操作参数集合。
 * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
 */
export function undoPublic(ctx: Context, name: string, params: PublicParams): Promise<boolean> {
  return executePublic(ctx, name, params, false);
}
