import { Context, OperationError } from '../context';

export function getSteamIdASF(ctx: Context): Promise<string> {
  return ctx.run('identity.asf', undefined, '', async (child) => {
    const result = await child.command(`!steamid ${child.bot}`);
    const ids = [...new Set(result.match(/\b7656119\d{10}\b/g) || [])];
    if (ids.length !== 1) throw new OperationError('STEAM_ID_UNAVAILABLE');
    return ids[0];
  });
}

export function getSteamIdWeb(ctx: Context): Promise<string> {
  return ctx.run('identity.web', undefined, '', async (child) => {
    const data = await child.request({ url: 'https://store.steampowered.com', method: 'GET' });
    const id = data.responseText.match(/steamid&quot;:&quot;(\d+)/)?.[1]
      || data.responseText.match(/g_steamID\s*=\s*["'](\d+)["']/)?.[1];
    if (!id || !/^7656119\d{10}$/.test(id)) throw new OperationError('STEAM_ID_UNAVAILABLE');
    return id;
  });
}

/** Retains the original public Web-first lookup. Bot play-status checks use ASF identity directly. */
export function getSteamId(ctx: Context): Promise<string> {
  return ctx.run('identity.resolve', undefined, '', async (child) => (await getSteamIdWeb(child)) || getSteamIdASF(child));
}
