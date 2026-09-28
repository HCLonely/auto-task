/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 17:09:58
 * @LastEditTime : 2026-09-28 17:38:07
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/modules/social/youtube/auth/verify.ts
 * @Description  : YouTube 授权状态验证
 */

import type { Context } from '../context';
import { doChannel } from '../features/channels';
import { normalizeYoutubeLink } from '../utils/links';

/**
 * 授权验证会尝试订阅配置中的目标频道。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @returns Promise，完成后返回检查结果；满足条件时为 true，否则为 false。
 */
export async function verifyAuth(ctx: Context): Promise<boolean> {
  return ctx.run('auth.verify', undefined, false, async (ctx) => {
    const configured = ctx.options.verifyChannel;
    const link = normalizeYoutubeLink(configured.startsWith('https://') ? configured : `https://www.youtube.com/channel/${configured}`);
    if (!link || !configured || (!configured.startsWith('https://') && !/^[\w-]+$/.test(configured))) {
      return ctx.fail('INVALID_VERIFY_CHANNEL');
    }
    ctx.progress('VERIFY_BY_SUBSCRIPTION');
    return doChannel(ctx, {
      link,
      verify: true
    });
  });
}
