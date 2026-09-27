import { Context, SteamError } from './context';

async function getHTML(ctx: Context, url: string): Promise<string> {
  if (ctx.state.disposed) throw new SteamError('DISPOSED');
  const response = await ctx.options.http({ url, method: 'GET' });
  if (ctx.state.disposed) throw new SteamError('DISPOSED');
  ctx.progress('LOOKUP_RESPONSE', { transportStatus: response.status, httpStatus: response.data?.status || 0 });
  if (response.result !== 'Success' || response.data?.status !== 200) throw new SteamError('LOOKUP_FAILED');
  return response.data.responseText;
}
export function getCuratorId(ctx: Context, path: string, name: string): Promise<string | false> {
  return ctx.run<string | false>('curator.resolve', `${path}/${name}`, false, async (child) => {
    if (!['developer', 'publisher', 'franchise', 'curator'].includes(path) || !name || /[\r\n/]/.test(name)) throw new SteamError('INVALID_ARGUMENT');
    const key = `curator:${path}:${encodeURIComponent(name)}`;
    const cached = await child.storage.get<unknown>(key, null);
    if (typeof cached === 'string' && /^\d+$/.test(cached)) return cached;
    const html = await getHTML(child, `https://store.steampowered.com/${path}/${encodeURIComponent(name)}`);
    const id = html.match(/g_pagingData[\s\S]*?"clanid"\s*:\s*(\d+)/)?.[1];
    if (!id) throw new SteamError('CURATOR_ID_NOT_FOUND');
    await child.storage.set(key, id);
    return id;
  });
}
export function getDemoAppId(ctx: Context, id: string): Promise<string | false> {
  return ctx.run<string | false>('demo.resolve', id, false, async (child) => {
    const html = await getHTML(child, `https://store.steampowered.com/app/${id}`);
    const demo = html.match(/steam:\/\/(?:install|run)\/(\d+)/)?.[1];
    if (!demo) { child.skip('DEMO_NOT_FOUND'); return false; }
    return demo;
  });
}
