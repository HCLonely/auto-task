/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 17:09:58
 * @LastEditTime : 2026-09-28 17:38:07
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/modules/social/vk/auth/token.ts
 * @Description  : VK 访问令牌管理
 */

import type { Context } from '../context';

/**
 * 更新平台授权信息。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
 */
export function updateAuth(ctx: Context): Promise<boolean> {
  return ctx.run('auth.update', undefined, false, async (ctx) => {
    const data = await ctx.request({
      url: 'https://login.vk.com/?act=web_token',
      method: 'POST',
      responseType: 'json',
      headers: {
        origin: 'https://vk.com',
        referer: 'https://vk.com/',
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: new URLSearchParams({
        version: ctx.state.version,
        app_id: ctx.state.appId
      }).toString()
    });
    if (!data) {
      return false;
    }
    const token = data.response?.data?.access_token;
    if (data.response?.type !== 'okay' || typeof token !== 'string' || !token) {
      return ctx.fail('AUTH_REQUIRED');
    }
    ctx.state.token = token;
    return true;
  });
}
