/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 17:09:58
 * @LastEditTime : 2026-09-28 17:38:07
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/modules/social/twitter/auth/verify.ts
 * @Description  : Twitter 授权状态验证
 */

import type { Context } from '../context';
import { apiRequest, errorCode, hasErrors, reportFailure } from '../requests';

/**
 * 验证授权时会尝试关注配置中的目标账号。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @returns Promise，完成后返回检查结果；满足条件时为 true，否则为 false。
 */
export function verifyAuth(ctx: Context): Promise<boolean> {
  return ctx.run('auth.verify', ctx.options.verifyId, false, async (ctx) => {
    const response = await apiRequest(ctx, '/i/api/1.1/friendships/create.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: new URLSearchParams({
        id: ctx.options.verifyId!,
        skip_status: '1'
      }).toString()
    });
    if (response.result === 'Success' && ((response.data?.status === 200 && !hasErrors(response)) ||
      (response.data?.status === 403 && errorCode(response) === 158))) {
      return true;
    }
    return reportFailure(ctx, response);
  });
}
