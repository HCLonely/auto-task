import type { Context } from '../context';
import type { Target } from '../types';

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
