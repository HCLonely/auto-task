import type { Context } from '../context';
import { encodeForm, parseHTML } from '../utils/html';
import { changeArea } from './region';

async function executeFollowGame(ctx: Context, gameId: string, doTask: boolean, retried = false): Promise<boolean> {
  return ctx.run(doTask ? 'followGame.doFollowGame' : 'followGame.undoFollowGame', gameId, async (ctx) => {
    if (ctx.state.disposed || !ctx.state.storeInitialized) {
      ctx.progress(ctx.state.disposed ? 'DISPOSED' : 'AUTH_REQUIRED', 'error');
      return false;
    }
    try {
      ctx.progress(doTask ? 'followingGame' : 'unfollowingGame');
      const { result, data } = await ctx.request({
        url: 'https://store.steampowered.com/explore/followgame/', method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
        data: encodeForm({ sessionid: ctx.state.auth.storeSessionID, appid: gameId, ...(!doTask ? { unfollow: '1' } : {}) })
      });
      if (result === 'Success' && data?.status === 200 && data.responseText.trim() === 'true') return true;
      const followed = await isFollowedGame(ctx, gameId);
      if (!retried && ctx.state.area === 'CN' && followed === 'areaLocked') {
        const changed = await changeArea(ctx);
        if (typeof changed !== 'string' || changed === 'skip' || changed === 'CN') return false;
        return executeFollowGame(ctx, gameId, doTask, true);
      }
      return typeof followed === 'boolean' && followed === doTask;
    } catch { ctx.reportError(); return false; }
  });
}

/** null distinguishes a failed lookup from a valid "not followed" result. */
export async function isFollowedGame(ctx: Context, gameId: string): Promise<boolean | 'areaLocked' | null> {
  return ctx.run('followGame.isFollowedGame', gameId, async (ctx) => {
    try {
      const { result, data } = await ctx.request({ url: `https://store.steampowered.com/app/${gameId}`, method: 'GET' });
      if (result !== 'Success' || data?.status !== 200) return null;
      if (data.responseText.includes('id="error_box"')) return 'areaLocked';
      const page = parseHTML(data.responseText);
      const control = page.querySelector('.queue_control_button.queue_btn_follow');
      if (!control) return null;
      const active = control.querySelector<HTMLElement>('.btnv6_blue_hoverfade.btn_medium.queue_btn_active');
      return Boolean(active && !active.hidden && active.style.display !== 'none');
    } catch { ctx.reportError(); return null; }
  }, (value) => typeof value === 'boolean');
}

export function doFollowGame(ctx: Context, gameId: string, retried = false): Promise<boolean> { return executeFollowGame(ctx, gameId, true, retried); }
export function undoFollowGame(ctx: Context, gameId: string, retried = false): Promise<boolean> { return executeFollowGame(ctx, gameId, false, retried); }
