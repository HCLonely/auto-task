/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 17:09:58
 * @LastEditTime : 2026-09-28 17:38:07
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/modules/social/reddit/auth/session.ts
 * @Description  : Reddit 会话授权管理
 */

import type { Context } from '../context';

/**
 * CSRF 令牌是必要条件，仍需检查 Reddit 会话是否已登录。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
 */
export function updateAuth(ctx: Context): Promise<boolean> {
  return ctx.run('auth.session', undefined, async (ctx) => {
    try {
      const cookies = await ctx.cookies();
      if (ctx.state.disposed) {
        return ctx.fail('DISPOSED');
      }
      const token = cookies.find((cookie) => {
        return cookie.name === 'csrf_token';
      })?.value;
      if (!token || typeof token !== 'string') {
        return ctx.fail('CSRF_TOKEN_MISSING');
      }
      ctx.state.csrfToken = token;
      return true;
    } catch {
      return ctx.fail('COOKIE_READ_FAILED');
    }
  }, Boolean);
}
