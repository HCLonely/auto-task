import type { Context } from '../context';
import type { WallItem } from '../types';

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
