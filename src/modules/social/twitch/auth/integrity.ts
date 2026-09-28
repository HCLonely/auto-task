/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 17:09:58
 * @LastEditTime : 2026-09-28 17:38:07
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/modules/social/twitch/auth/integrity.ts
 * @Description  : Twitch 客户端完整性校验
 */

import type { Context } from '../context';
import { authHeaders, object } from '../graphql';

/**
 * 检查 Twitch 客户端完整性凭据。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @returns Promise，完成后返回检查结果；满足条件时为 true，否则为 false。
 */
export function checkIntegrity(ctx: Context): Promise<boolean> {
  return ctx.run('auth.integrity', undefined, async (ctx) => {
    ctx.state.integrityToken = '';
    try {
      let challenge = '';
      for (let attempt = 0; attempt < 2; attempt++) {
        const {
          result, data
        } = await ctx.request({
          url: 'https://gql.twitch.tv/integrity',
          method: 'POST',
          responseType: 'json',
          anonymous: true,
          headers: {
            ...authHeaders(ctx, true),
            'x-kpsdk-ct': challenge
          }
        });
        if (result !== 'Success') {
          ctx.progress('INTEGRITY_REQUEST_FAILED', 'error');
          return false;
        }
        const token = object(data?.response).token;
        if (data?.status === 200 && typeof token === 'string' && token) {
          ctx.state.integrityToken = token;
          return true;
        }
        const header = Object.entries(data?.responseHeaders || {}).find(([key]) => {
          return key.toLowerCase() === 'x-kpsdk-ct';
        })?.[1];
        const next = Array.isArray(header) ? header[0] : header;
        if (attempt === 0 && next) {
          challenge = next;
          ctx.progress('INTEGRITY_RETRY', 'warning');
          continue;
        }
        break;
      }
      ctx.progress('INTEGRITY_FAILED', 'error');
      return false;
    } catch {
      ctx.progress('INTEGRITY_FAILED', 'error');
      return false;
    }
  }, Boolean);
}
