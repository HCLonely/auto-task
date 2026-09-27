import { Context, SteamError } from './context';
import { candidates, dispatch } from './executors';
import { getDemoAppId } from './lookups';
import { getPlayState, playStateKey } from './storage';

export function stopPlayGames(ctx: Context): Promise<boolean> {
  return ctx.run('play.stop', undefined, false, async (child) => {
    const asf = candidates(child, 'playTime').find((executor) => executor.source === 'steamASF');
    if (!asf || asf.source !== 'steamASF') throw new SteamError('ASF_REQUIRED');
    const record = await getPlayState(child);
    if (record.playedGames.some((id) => child.state.whiteList.playTime.includes(id))) {
      child.skip('WHITELIST_SKIPPED'); return true;
    }
    if (!await child.invoke(asf, () => asf.client.stopPlayGames())) return false;
    await child.storage.set(playStateKey(child), { stopPlayTime: 0, playedGames: [], taskLink: [] });
    child.state.tasks.playTime = [];
    await child.storage.set('tasks', child.state.tasks);
    return true;
  });
}

export function playGames(ctx: Context, ids: string[], minutes: number): Promise<boolean> {
  return ctx.run('play.start', ids.join(','), false, async (child) => {
    const asf = candidates(child, 'playTime').find((executor) => executor.source === 'steamASF');
    if (!asf || asf.source !== 'steamASF') throw new SteamError('ASF_REQUIRED');
    const expanded = new Set(ids);
    for (const id of ids) {
      const demo = await getDemoAppId(child, id);
      if (demo) expanded.add(demo);
    }
    const games = [...expanded];
    for (const id of games) {
      if (!await dispatch(child, 'licenses', `appid-${id}`, true)) child.progress('LICENSE_NOT_CONFIRMED', { id });
    }
    const start = async () => {
      const started = await child.invoke(asf, () => asf.client.playGames(games.join(',')));
      if (!started) return false;
      const status = await child.invoke(asf, () => asf.client.checkPlayStatus(games.join(',')));
      if (status === 'skip') child.progress('PLAY_STATUS_UNVERIFIED');
      return status === true || status === 'skip';
    };
    if (!await start()) {
      await child.delay(child.options.playRetryDelayMs);
      if (!await start()) return false;
    }
    const old = await getPlayState(child);
    const taskUrl = child.options.taskUrl ?? (typeof location === 'undefined' ? '' : location.href);
    const stopPlayTime = Math.max(old.stopPlayTime, Date.now() + (minutes + 10) * 60000);
    await child.storage.set(playStateKey(child), {
      stopPlayTime, playedGames: [...new Set([...old.playedGames, ...games])],
      taskLink: [...new Set([...old.taskLink, ...(taskUrl ? [taskUrl] : [])])]
    });
    child.state.tasks.playTime = [...new Set([...child.state.tasks.playTime, ...games])];
    await child.storage.set('tasks', child.state.tasks);
    child.progress('PLAY_SCHEDULE_RECORDED', { stopPlayTime });
    return true;
  });
}
