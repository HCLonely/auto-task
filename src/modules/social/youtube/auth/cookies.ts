/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 17:09:58
 * @LastEditTime : 2026-09-28 17:38:07
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/modules/social/youtube/auth/cookies.ts
 * @Description  : YouTube Cookie 授权信息读取与更新
 */

import type { Context } from '../context';

/**
 * Cookie 获取、授权验证与持久化分别处理。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
 */
export async function updateAuth(ctx: Context): Promise<boolean> {
  return ctx.run('auth.updateCookie', undefined, false, async (ctx) => {
    try {
      const cookies = await ctx.cookies('https://www.youtube.com/@YouTube');
      if (ctx.state.disposed) {
        return ctx.fail('DISPOSED');
      }
      const cookie = cookies.find((item) => {
        return item.name === '__Secure-3PAPISID';
      });
      if (!cookie || typeof cookie.value !== 'string' || !cookie.value) {
        return ctx.fail('AUTH_REQUIRED');
      }
      ctx.state.auth = cookie.value;
      return true;
    } catch {
      return ctx.fail('COOKIE_READ_FAILED');
    }
  });
}
