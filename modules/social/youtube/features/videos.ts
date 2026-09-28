import { requestContext, signedHeaders } from '../auth/signature';
import type { Context } from '../context';
import { eventTarget, normalizeYoutubeLink } from '../utils/links';
import { getInfo } from './info';

async function executeLikeVideo(ctx: Context, { link, doTask = true }: { link: string; doTask?: boolean }): Promise<boolean> {
  return ctx.forTaskLink(link).run(doTask ? 'video.like' : 'video.unlike', eventTarget(link), false, async (ctx) => {
    if (!ctx.state.initialized || !ctx.state.auth) return ctx.fail('AUTH_REQUIRED');
    const { params, needLogin } = await getInfo(ctx, link, 'likeVideo');
    if (needLogin) return ctx.fail('AUTH_REQUIRED');
    if (!params?.videoId) return ctx.fail('INFO_PARAMS_MISSING');
    const { videoId, apiKey, likeParams } = params;
    if (!doTask && ctx.state.whiteList.likes.includes(videoId)) return ctx.skip('WHITELIST_SKIPPED');
    // Unlike does not require the opaque parameter used to add a like.
    if (doTask && !likeParams) return ctx.fail('LIKE_PARAMS_MISSING');
    const { result, data } = await ctx.request({
      url: `https://www.youtube.com/youtubei/v1/like/${doTask ? '' : 'remove'}like?key=${encodeURIComponent(apiKey)}`,
      method: 'POST',
      headers: await signedHeaders(ctx.state.auth, params, `https://www.youtube.com/watch?v=${videoId}`, ctx.hash),
      data: JSON.stringify({ context: requestContext(params), target: { videoId }, ...(doTask ? { params: likeParams } : {}) })
    });
    if (result !== 'Success' || data?.status !== 200) return ctx.fail('HTTP_FAILED');
    const liked = doTask && data.responseText.includes('Added to Liked videos');
    const unliked = !doTask && (data.responseText.includes('Removed from Liked videos') || data.responseText.includes('Dislike removed'));
    if (!(liked || unliked)) return ctx.fail('AUTH_OR_OPERATION_REJECTED');
    if (doTask) ctx.state.tasks.likes = [...new Set([...ctx.state.tasks.likes, normalizeYoutubeLink(link)!])];
    return true;
  });
}

export function doLikeVideo(ctx: Context, options: { link: string; }): Promise<boolean> { return executeLikeVideo(ctx, { ...options, doTask: true }); }
export function undoLikeVideo(ctx: Context, options: { link: string; }): Promise<boolean> { return executeLikeVideo(ctx, { ...options, doTask: false }); }
