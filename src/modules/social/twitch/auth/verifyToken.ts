/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 17:09:58
 * @LastEditTime : 2026-09-28 17:38:07
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/modules/social/twitch/auth/verifyToken.ts
 * @Description  : Twitch 访问令牌验证
 */

import type { Context } from '../context';
import { object, query } from '../graphql';

/**
 * 验证当前访问令牌。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @returns Promise，完成后返回检查结果；满足条件时为 true，否则为 false。
 */
export function verifyToken(ctx: Context): Promise<boolean> {
  return ctx.run('auth.verifyToken', undefined, async (ctx) => {
    try {
      const data = await query(ctx, 'FrontPageNew_User', {
        limit: 1
      }, '64bd07a2cbaca80699d62636d966cf6395a5d14a1f0a14282067dcb28b13eb11');
      if (!data || Object.keys(object(data.currentUser)).length === 0) {
        ctx.progress('AUTH_INVALID', 'error');
        return false;
      }
      return true;
    } catch {
      ctx.progress('AUTH_VERIFY_FAILED', 'error');
      return false;
    }
  }, Boolean);
}
