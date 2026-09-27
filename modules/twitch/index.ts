import { checkIntegrity } from './auth/integrity';
import { updateAuth } from './auth/updateAuth';
import { verifyToken } from './auth/verifyToken';
import { Context } from './context';
import { doTasks, undoTasks } from './features/tasks';
import { channels, loadState } from './storage';
import type { SocialTaskResult, StatusListener, TaskOptions, TwitchOptions, TwitchTasks } from './types';

export * from './types';
export { createGMHttpClient } from './adapters/gmHttp';
export type { GMRequest, GMRequestOptions, GMRawResponse } from './adapters/gmHttp';
export { createGMStorage } from './adapters/gmStorage';
export { handleTwitchAuthPage, readTwitchAuth } from './auth/pageAuth';
export type { TwitchPageWindow } from './auth/pageAuth';

export class Twitch {
  private readonly ctx: Context;
  constructor(options: TwitchOptions) { this.ctx = new Context(options); }
  get tasks(): TwitchTasks { return this.ctx.state.tasks; }
  set tasks(value: TwitchTasks) { this.ctx.state.tasks = { channels: channels(value.channels) }; this.ctx.state.tasksOverridden = true; }
  get whiteList(): TwitchTasks { return this.ctx.state.whiteList; }
  set whiteList(value: TwitchTasks) { this.ctx.state.whiteList = { channels: channels(value.channels) }; this.ctx.state.whiteListOverridden = true; }
  on(event: 'status', listener: StatusListener): () => void {
    if (event !== 'status') throw new Error('Unknown event');
    return this.ctx.events.on(listener);
  }
  init(): Promise<boolean> {
    const { state } = this.ctx;
    if (state.init) return state.init;
    state.init = this.ctx.run('init', undefined, async (ctx) => {
      try {
        if (state.disposed) { ctx.progress('DISPOSED', 'error'); return false; }
        if (state.initialized) return true;
        await loadState(ctx);
        if (state.auth && await verifyToken(ctx) && await checkIntegrity(ctx)) { state.initialized = true; return true; }
        state.auth = undefined;
        state.integrityToken = '';
        await ctx.storage.delete('auth');
        state.initialized = await updateAuth(ctx);
        if (!state.initialized) { state.auth = undefined; state.integrityToken = ''; }
        return state.initialized;
      } catch { ctx.progress('INIT_FAILED', 'error'); return false; }
    }, Boolean).finally(() => { state.init = undefined; });
    return state.init;
  }
  do(options: TaskOptions = {}): Promise<SocialTaskResult> { return doTasks(this.ctx, options); }
  undo(options: TaskOptions = {}): Promise<SocialTaskResult> { return undoTasks(this.ctx, options); }
  async setWhiteList(value: TwitchTasks): Promise<boolean> {
    return this.ctx.run('whiteList.update', undefined, async (ctx) => {
      try {
        if (ctx.state.disposed) return false;
        const normalized = { channels: channels(value.channels) };
        await ctx.storage.set('whiteList', normalized);
        ctx.state.whiteList = normalized;
        ctx.state.whiteListOverridden = true;
        return true;
      } catch { ctx.progress('STORAGE_FAILED', 'error'); return false; }
    }, Boolean);
  }
  dispose(): void {
    this.ctx.state.disposed = true;
    for (const cancel of [...this.ctx.state.cleanups]) cancel();
    this.ctx.events.clear();
  }
}
export default Twitch;
