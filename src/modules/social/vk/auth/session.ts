/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 17:09:58
 * @LastEditTime : 2026-09-28 17:38:07
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/modules/social/vk/auth/session.ts
 * @Description  : VK 会话授权管理
 */

import type { Context } from '../context';

/**
 * 验证浏览器会话，并获取账号标识与当前页面的接口参数。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @returns Promise，完成后返回检查结果；满足条件时为 true，否则为 false。
 */
export function verifyAuth(ctx: Context): Promise<boolean> {
  return ctx.run('auth.verify', undefined, false, async (ctx) => {
    const data = await ctx.request({
      url: 'https://vk.com/im',
      method: 'GET'
    });
    if (!data) {
      return false;
    }
    const url = new URL(data.finalUrl || 'https://vk.com/im');
    if (!['vk.com', 'vk.ru'].includes(url.hostname) || /\/login(?:\/|$)/.test(url.pathname)) {
      return ctx.fail('AUTH_REQUIRED');
    }
    const userId = data.responseText.match(/\bid:\s*(\d+)/)?.[1];
    if (!userId || userId === '0') {
      return ctx.fail('AUTH_REQUIRED');
    }
    ctx.state.userId = userId;
    const version = data.responseText.match(/"version"\s*:\s*"([\d.]+)"\s*,\s*"response"/)?.[1];
    const appId = data.responseText.match(/"app_id"\s*:\s*"?(\d+)"?\s*,\s*"is_mobile"/)?.[1];
    if (version && !ctx.options.apiVersion) {
      ctx.state.version = version;
    }
    if (appId && !ctx.options.appId) {
      ctx.state.appId = appId;
    }
    return true;
  });
}
