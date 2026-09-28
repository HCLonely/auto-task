/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 17:09:58
 * @LastEditTime : 2026-09-28 17:38:07
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/modules/social/youtube/features/videos.ts
 * @Description  : YouTube 视频点赞与取消点赞
 */

import { requestContext, signedHeaders } from '../auth/signature';
import type { Context } from '../context';
import { eventTarget, normalizeYoutubeLink } from '../utils/links';
import { getInfo } from './info';

/**
 * 根据操作方向为视频点赞或取消视频点赞。
 *
 * @remarks
 * 解构参数包含：link（任务目标链接）、doTask（是否执行任务；为 false 时执行撤销操作）。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
 */
async function executeLikeVideo(ctx: Context, {
  link, doTask = true
}: { link: string; doTask?: boolean }): Promise<boolean> {
  return ctx.forTaskLink(link).run(doTask ? 'video.like' : 'video.unlike', eventTarget(link), false, async (ctx) => {
    if (!ctx.state.initialized || !ctx.state.auth) {
      return ctx.fail('AUTH_REQUIRED');
    }
    const {
      params, needLogin
    } = await getInfo(ctx, link, 'likeVideo');
    if (needLogin) {
      return ctx.fail('AUTH_REQUIRED');
    }
    if (!params?.videoId) {
      return ctx.fail('INFO_PARAMS_MISSING');
    }
    const {
      videoId, apiKey, likeParams
    } = params;
    if (!doTask && ctx.state.whiteList.likes.includes(videoId)) {
      return ctx.skip('WHITELIST_SKIPPED');
    }
    // Unlike does not require the opaque parameter used to add a like.
    if (doTask && !likeParams) {
      return ctx.fail('LIKE_PARAMS_MISSING');
    }
    const {
      result, data
    } = await ctx.request({
      url: `https://www.youtube.com/youtubei/v1/like/${doTask ? '' : 'remove'}like?key=${encodeURIComponent(apiKey)}`,
      method: 'POST',
      headers: await signedHeaders(ctx.state.auth, params, `https://www.youtube.com/watch?v=${videoId}`, ctx.hash),
      data: JSON.stringify({
        context: requestContext(params),
        target: {
          videoId
        },
        ...(doTask ? {
          params: likeParams
        } : {})
      })
    });
    if (result !== 'Success' || data?.status !== 200) {
      return ctx.fail('HTTP_FAILED');
    }
    const liked = doTask && data.responseText.includes('Added to Liked videos');
    const unliked = !doTask && (data.responseText.includes('Removed from Liked videos') || data.responseText.includes('Dislike removed'));
    if (!(liked || unliked)) {
      return ctx.fail('AUTH_OR_OPERATION_REJECTED');
    }
    if (doTask) {
      ctx.state.tasks.likes = [...new Set([...ctx.state.tasks.likes, normalizeYoutubeLink(link)!])];
    }
    return true;
  });
}

/**
 * 为视频点赞。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @param options - 本次操作的配置选项。
 * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
 */
export function doLikeVideo(ctx: Context, options: { link: string; }): Promise<boolean> {
  return executeLikeVideo(ctx, {
    ...options,
    doTask: true
  });
}
/**
 * 取消视频点赞。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @param options - 本次操作的配置选项。
 * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
 */
export function undoLikeVideo(ctx: Context, options: { link: string; }): Promise<boolean> {
  return executeLikeVideo(ctx, {
    ...options,
    doTask: false
  });
}
