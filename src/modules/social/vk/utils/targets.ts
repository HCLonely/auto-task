/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 17:09:58
 * @LastEditTime : 2026-09-28 17:38:07
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/modules/social/vk/utils/targets.ts
 * @Description  : VK 任务链接规范化与目标解析
 */

import type { Context } from '../context';
import type { Target } from '../types';

/**
 * 规范化任务目标链接。
 *
 * @remarks
 * 已捕获的异常通过失败返回值交付，不会从对应的 catch 分支继续抛出。
 *
 * @param link - 任务目标链接。
 * @returns 处理后的字符串；未取得有效结果时返回 false。
 */
export function normalizeLink(link: string): string | false {
  try {
    const url = new URL(link);
    if (url.protocol !== 'https:' || !['vk.com', 'vk.ru', 'www.vk.com', 'www.vk.ru'].includes(url.hostname) || url.username || url.password || url.port) {
      return false;
    }
    const name = url.pathname.replace(/^\//, '').replace(/\/$/, '');
    if (!/^[a-zA-Z0-9_.-]+$/.test(name)) {
      return false;
    }
    return name + (url.searchParams.get('action') === 'like' ? '?action=like' : '');
  } catch {
    return false;
  }
}

/**
 * 解析任务目标及其类型。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @param name - 目标名称。
 * @returns Promise，完成后返回解析后的任务目标；未取得有效结果时返回 false。
 */
export function getTarget(ctx: Context, name: string): Promise<Target | false> {
  return ctx.run<Target | false>('target.resolve', name, false, async (ctx) => {
    const [path] = name.split('?');
    if (/^wall-?\d+_\d+$/.test(path)) {
      return {
        type: 'wall',
        name: path,
        like: name.endsWith('?action=like')
      };
    }
    const data = await ctx.request({
      url: `https://vk.com/${path}`,
      method: 'GET'
    });
    if (!data) {
      return false;
    }
    const groupId = data.responseText.match(/"group_id"\s*:\s*"?(\d+)"?\s*,\s*"fields"/)?.[1];
    const isMember = data.responseText.match(/"is_member"\s*:\s*(0|1)\s*,/)?.[1];
    if (groupId) {
      return {
        type: 'group',
        params: {
          groupId,
          isMember
        }
      };
    }
    // The original public-page resolver is commented out; do not guess membership hashes.
    return ctx.fail('TARGET_NOT_SUPPORTED');
  });
}
