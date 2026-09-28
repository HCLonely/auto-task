/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 17:09:58
 * @LastEditTime : 2026-09-28 17:38:07
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/modules/social/twitch/features/channel.ts
 * @Description  : Twitch 频道查询、关注与取消关注
 */

import type { Context } from '../context';
import { object, query } from '../graphql';
import { channels } from '../storage';

/**
 * 查询频道标识。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @param name - 目标名称。
 * @returns Promise，完成后返回处理后的字符串；未取得有效结果时返回 false。
 */
export function getChannelId(ctx: Context, name: string): Promise<string | false> {
  return ctx.run('channel.resolve', name, async (ctx) => {
    try {
      if (ctx.state.cache[name]) {
        return ctx.state.cache[name];
      }
      const data = await query(ctx, 'ActiveWatchParty', {
        channelLogin: name
      }, '4a8156c97b19e3a36e081cf6d6ddb5dbf9f9b02ae60e4d2ff26ed70aebc80a30');
      const id = data && object(data.user).id;
      if (typeof id !== 'string' || !/^\d+$/.test(id)) {
        ctx.progress('CHANNEL_NOT_FOUND', 'error');
        return false;
      }
      const cache = {
        ...ctx.state.cache,
        [name]: id
      };
      await ctx.storage.set('cache', cache);
      ctx.state.cache = Object.assign(Object.create(null), cache);
      return id;
    } catch {
      ctx.progress('CHANNEL_LOOKUP_FAILED', 'error');
      return false;
    }
  }, Boolean);
}

/**
 * 根据操作方向关注频道或取消关注频道。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @param name - 目标名称。
 * @param doTask - 是否执行任务；为 false 时执行撤销操作。
 * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
 */
function executeChannel(ctx: Context, name: string, doTask: boolean): Promise<boolean> {
  return ctx.run(doTask ? 'channel.follow' : 'channel.unfollow', name, async (ctx) => {
    try {
      if (ctx.state.disposed || !ctx.state.initialized) {
        ctx.progress('AUTH_REQUIRED', 'error');
        return false;
      }
      if (!doTask && channels(ctx.state.whiteList.channels).includes(name)) {
        ctx.skip('WHITELIST_SKIP');
        return true;
      }
      const id = await getChannelId(ctx, name);
      if (!id) {
        return false;
      }
      const data = await query(ctx, doTask ? 'FollowButton_FollowUser' : 'FollowButton_UnfollowUser',
        {
          input: {
            targetID: id,
            ...(doTask ? {
              disableNotifications: false
            } : {})
          }
        },
        doTask ? '800e7346bdf7e5278a3c1d3f21b2b56e2639928f86815677a7126b093b2fdd08' : 'f7dae976ebf41c755ae2d758546bfd176b4eeb856656098bb40e0a672ca0d880', true);
      const payload = data && data[doTask ? 'followUser' : 'unfollowUser'];
      if (Object.keys(object(payload)).length === 0 || object(payload).error) {
        ctx.progress('CHANNEL_UPDATE_FAILED', 'error');
        return false;
      }
      if (doTask) {
        ctx.state.tasks.channels = [...new Set([...ctx.state.tasks.channels, name])];
        // The remote action succeeded even if saving the local history fails.
        try {
          await ctx.storage.set('tasks', ctx.state.tasks);
        } catch {
          ctx.progress('TASKS_PERSIST_FAILED', 'warning');
        }
      }
      return true;
    } catch {
      ctx.progress('CHANNEL_UPDATE_FAILED', 'error');
      return false;
    }
  }, Boolean);
}

/**
 * 关注频道。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @param name - 目标名称。
 * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
 */
export function doChannel(ctx: Context, name: string): Promise<boolean> {
  return executeChannel(ctx, name, true);
}
/**
 * 取消关注频道。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @param name - 目标名称。
 * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
 */
export function undoChannel(ctx: Context, name: string): Promise<boolean> {
  return executeChannel(ctx, name, false);
}
