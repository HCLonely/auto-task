import type { Context } from '../context';
import type { InfoType, YoutubeInfo } from '../types';
import { jsonProperty, object } from '../utils/json';
import { eventTarget, normalizeYoutubeLink } from '../utils/links';

export async function getInfo(ctx: Context, link: string, type: InfoType): Promise<YoutubeInfo> {
  return ctx.run('info.get', eventTarget(link), {}, async (ctx): Promise<YoutubeInfo> => {
    const url = normalizeYoutubeLink(link);
    if (!url || !['channel', 'likeVideo'].includes(type)) {
      ctx.fail('INVALID_ARGUMENT');
      return {};
    }
    const {
      result, data
    } = await ctx.request({
      url,
      method: 'GET'
    });
    if (result !== 'Success' || data?.status !== 200) {
      ctx.fail('HTTP_FAILED');
      return {};
    }
    if (data.responseText.includes('accounts.google.com/ServiceLogin?service=youtube') || new URL(data.finalUrl || url).hostname === 'accounts.google.com') {
      ctx.fail('AUTH_REQUIRED');
      return {
        needLogin: true
      };
    }
    const apiKey = jsonProperty(data.responseText, 'INNERTUBE_API_KEY');
    const context = jsonProperty(data.responseText, 'INNERTUBE_CONTEXT');
    if (typeof apiKey !== 'string' || !apiKey || !object(context) || !object(context.client) || !object(context.request)) {
      ctx.fail('INFO_PARAMS_MISSING');
      return {};
    }
    const client = {
      ...context.client,
      hl: 'en'
    };
    const params: NonNullable<YoutubeInfo['params']> = {
      apiKey,
      client,
      request: context.request
    };
    if (type === 'channel') {
      const channelId = jsonProperty(data.responseText, 'channelId');
      if (typeof channelId !== 'string' || !channelId) {
        ctx.fail('CHANNEL_ID_MISSING');
        return {};
      }
      params.channelId = channelId;
    } else {
      // Shortlink is the original source; structured videoId covers alternative page layouts.
      const shortlink = data.responseText.match(/<link\b[^>]*rel=["']shortlinkUrl["'][^>]*href=["']https:\/\/youtu\.be\/([^"'?]+)["']/)?.[1];
      const videoId = shortlink || jsonProperty(data.responseText, 'videoId');
      const likeParams = jsonProperty(data.responseText, 'likeParams');
      if (typeof videoId !== 'string' || !videoId) {
        ctx.fail('VIDEO_ID_MISSING');
        return {};
      }
      params.videoId = videoId;
      if (typeof likeParams === 'string') {
        params.likeParams = likeParams;
      }
    }
    return {
      params
    };
  }, (value) => {
    return Boolean(value.params);
  });
}
