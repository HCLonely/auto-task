import { requestContext, signedHeaders } from '../auth/signature';
import type { Context } from '../context';
import { eventTarget, normalizeYoutubeLink } from '../utils/links';
import { getInfo } from './info';

async function executeChannel(ctx: Context, { link, doTask = true, verify = false }: { link: string; doTask?: boolean; verify?: boolean }): Promise<boolean> {
  return ctx.forTaskLink(link).run(verify ? 'auth.verifyChannel' : doTask ? 'channel.subscribe' : 'channel.unsubscribe', eventTarget(link), false, async (ctx) => {
    if (!ctx.state.auth || (!verify && !ctx.state.initialized)) return ctx.fail('AUTH_REQUIRED');
    const { params, needLogin } = await getInfo(ctx, link, 'channel');
    if (needLogin) return ctx.fail('AUTH_REQUIRED');
    if (!params?.channelId) return ctx.fail('INFO_PARAMS_MISSING');
    const { channelId, apiKey } = params;
    if (!doTask && !verify && ctx.state.whiteList.channels.includes(channelId)) return ctx.skip('WHITELIST_SKIPPED');
    const { result, data } = await ctx.request({
      url: `https://www.youtube.com/youtubei/v1/subscription/${doTask ? '' : 'un'}subscribe?key=${encodeURIComponent(apiKey)}&prettyPrint=false`,
      method: 'POST',
      headers: await signedHeaders(ctx.state.auth, params, `https://www.youtube.com/channel/${channelId}`, ctx.hash),
      data: JSON.stringify({ context: requestContext(params), channelIds: [channelId], params: doTask ? 'EgIIAhgA' : 'CgIIAhgA' })
    });
    if (result !== 'Success' || data?.status !== 200) return ctx.fail('HTTP_FAILED');
    const subscribed = doTask && (/"subscribed"\s*:\s*true/.test(data.responseText) || data.responseText.includes('The subscription already exists'));
    const unsubscribed = !doTask && /"subscribed"\s*:\s*false/.test(data.responseText);
    const self = verify && data.responseText.includes('You may not subscribe to yourself');
    if (!(subscribed || unsubscribed || self)) return ctx.fail('AUTH_OR_OPERATION_REJECTED');
    if (doTask && !verify) ctx.state.tasks.channels = [...new Set([...ctx.state.tasks.channels, normalizeYoutubeLink(link)!])];
    return true;
  });
}

export function doChannel(ctx: Context, options: { link: string; verify?: boolean }): Promise<boolean> { return executeChannel(ctx, { ...options, doTask: true }); }
export function undoChannel(ctx: Context, options: { link: string }): Promise<boolean> { return executeChannel(ctx, { ...options, doTask: false, verify: false }); }
