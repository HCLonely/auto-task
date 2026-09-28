/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 17:09:58
 * @LastEditTime : 2026-09-28 17:38:07
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/modules/social/twitch/auth/updateAuth.ts
 * @Description  : Twitch 授权信息更新
 */

import { requestTabAuth } from '../adapters/gmTabAuth';
import type { Context } from '../context';
import { checkIntegrity } from './integrity';
import { verifyToken } from './verifyToken';

/**
 * 更新平台授权信息。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
 */
export function updateAuth(ctx: Context): Promise<boolean> {
  return ctx.run('auth.update', undefined, async (ctx) => {
    try {
      if (!await requestTabAuth(ctx)) {
        return false;
      }
      if (!await verifyToken(ctx) || !await checkIntegrity(ctx)) {
        return false;
      }
      await ctx.storage.set('auth', ctx.state.auth);
      return true;
    } catch {
      ctx.progress('AUTH_UPDATE_FAILED', 'error');
      return false;
    }
  }, Boolean);
}
