/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 17:09:58
 * @LastEditTime : 2026-09-28 17:38:07
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/modules/social/youtube/features/channels.ts
 * @Description  : YouTube 频道订阅与取消订阅
 */

import { requestContext, signedHeaders } from '../auth/signature';
import type { Context } from '../context';
import { eventTarget, normalizeYoutubeLink } from '../utils/links';
import { getInfo } from './info';

/**
 * 根据操作方向关注频道或取消关注频道。
 *
 * @remarks
 * 解构参数包含：link（任务目标链接）、doTask（是否执行任务；为 false 时执行撤销操作）、verify（对应字段值）。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
 */
async function executeChannel(ctx: Context, {
  link, doTask = true, verify = false
}: { link: string; doTask?: boolean; verify?: boolean }): Promise<boolean> {
  return ctx.forTaskLink(link).run(verify ? 'auth.verifyChannel' : (doTask ? 'channel.subscribe' : 'channel.unsubscribe'), eventTarget(link), false, async (ctx) => {
    if (!ctx.state.auth || (!verify && !ctx.state.initialized)) {
      return ctx.fail('AUTH_REQUIRED');
    }
    const {
      params, needLogin
    } = await getInfo(ctx, link, 'channel');
    if (needLogin) {
      return ctx.fail('AUTH_REQUIRED');
    }
    if (!params?.channelId) {
      return ctx.fail('INFO_PARAMS_MISSING');
    }
    const {
      channelId, apiKey
    } = params;
    if (!doTask && !verify && ctx.state.whiteList.channels.includes(channelId)) {
      return ctx.skip('WHITELIST_SKIPPED');
    }
    const {
      result, data
    } = await ctx.request({
      url: `https://www.youtube.com/youtubei/v1/subscription/${doTask ? '' : 'un'}subscribe?key=${encodeURIComponent(apiKey)}&prettyPrint=false`,
      method: 'POST',
      headers: await signedHeaders(ctx.state.auth, params, `https://www.youtube.com/channel/${channelId}`, ctx.hash),
      data: JSON.stringify({
        context: requestContext(params),
        channelIds: [channelId],
        params: doTask ? 'EgIIAhgA' : 'CgIIAhgA'
      })
    });
    if (result !== 'Success' || data?.status !== 200) {
      return ctx.fail('HTTP_FAILED');
    }
    const subscribed = doTask && (/"subscribed"\s*:\s*true/.test(data.responseText) || data.responseText.includes('The subscription already exists'));
    const unsubscribed = !doTask && /"subscribed"\s*:\s*false/.test(data.responseText);
    const self = verify && data.responseText.includes('You may not subscribe to yourself');
    if (!(subscribed || unsubscribed || self)) {
      return ctx.fail('AUTH_OR_OPERATION_REJECTED');
    }
    if (doTask && !verify) {
      ctx.state.tasks.channels = [...new Set([...ctx.state.tasks.channels, normalizeYoutubeLink(link)!])];
    }
    return true;
  });
}

/**
 * 关注频道。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @param options - 本次操作的配置选项。
 * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
 */
export function doChannel(ctx: Context, options: { link: string; verify?: boolean }): Promise<boolean> {
  return executeChannel(ctx, {
    ...options,
    doTask: true
  });
}
/**
 * 取消关注频道。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @param options - 本次操作的配置选项。
 * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
 */
export function undoChannel(ctx: Context, options: { link: string }): Promise<boolean> {
  return executeChannel(ctx, {
    ...options,
    doTask: false,
    verify: false
  });
}
