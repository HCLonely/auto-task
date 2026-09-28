/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 17:09:58
 * @LastEditTime : 2026-09-28 17:38:07
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/modules/social/vk/features/wall.ts
 * @Description  : VK 动态信息获取
 */

import type { Context } from '../context';
import type { WallItem } from '../types';

/**
 * 读取 VK 动态信息。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @param name - 目标名称。
 * @returns Promise，完成后返回处理结果（WallItem）；未取得有效结果时返回 false。
 */
export function getWall(ctx: Context, name: string): Promise<WallItem | false> {
  return ctx.run<WallItem | false>('wall.get', name, false, async (ctx) => {
    const match = name.match(/^wall(-?\d+)_(\d+)$/);
    if (!match) {
      return ctx.fail('INVALID_TARGET');
    }
    // Preserve the original feed endpoint and ten-post lookup scope.
    const response = await ctx.api('wall.get', {
      domain: match[1],
      extended: 1,
      filter: 'owner',
      start_from: '',
      count: 10
    }, 'web.api.vk.ru', name);
    const payload = response as { items?: WallItem[] } | WallItem[];
    const items = Array.isArray(payload) ? payload : payload && payload.items;
    const item = Array.isArray(items) && items.find((entry) => {
      return entry.id === Number(match[2]) && entry.owner_id === Number(match[1]);
    });
    if (!item || typeof item.type !== 'string') {
      return ctx.fail('POST_NOT_FOUND');
    }
    return item;
  });
}
