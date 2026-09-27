import { Context } from './context';
import { createTasks } from './defaults';
import { initialize, resetRegion } from './executors';
import { getCuratorId } from './lookups';
import { stopPlayGames } from './playTime';
import { getPlayState, loadState } from './storage';
import { doTasks, undoTasks } from './tasks';
import { handleSteamAuthPage as handleWebAuthPage } from './steamWeb';
import type { GMAuthAPI, InitType, PlayState, SteamListener, SteamOptions, SteamTasks, SteamTaskOptions, SteamTaskResult } from './types';

export * from './types';
export { default as SteamWeb } from './steamWeb';
export { default as SteamASF } from './steamASF';
export { createGMHttpClient } from './steamWeb/adapters/gmHttp';
export type { GMRequest, GMRequestOptions, GMRawResponse } from './steamWeb/adapters/gmHttp';

/** Uses the integrated client's <namespace>:web namespace automatically. */
export function handleSteamAuthPage(options: { namespace?: string; gm?: GMAuthAPI } = {}): Promise<boolean> {
  return handleWebAuthPage({ ...options, namespace: `${options.namespace || 'steam'}:web` });
}

export class Steam {
  private readonly ctx: Context;
  constructor(options: SteamOptions) { this.ctx = new Context(options); }
  get tasks(): SteamTasks { return this.ctx.state.tasks; }
  set tasks(value: SteamTasks) { this.ctx.state.tasks = createTasks(value); }
  get whiteList(): SteamTasks { return this.ctx.state.whiteList; }
  set whiteList(value: SteamTasks) { this.ctx.state.whiteList = createTasks(value); }
  on(event: 'status', listener: SteamListener): () => void {
    if (event !== 'status') throw new Error('Unknown event');
    return this.ctx.events.on(listener);
  }
  init(type: InitType = 'all'): Promise<boolean> { return this.ctx.enqueue(() => initialize(this.ctx, type)); }
  do(options: SteamTaskOptions = {}): Promise<SteamTaskResult> { return this.ctx.enqueue(() => doTasks(this.ctx, options)); }
  undo(options: SteamTaskOptions = {}): Promise<SteamTaskResult> { return this.ctx.enqueue(() => undoTasks(this.ctx, options)); }
  getCuratorId(path: string, name: string): Promise<string | false> { return this.ctx.enqueue(() => getCuratorId(this.ctx, path, name)); }
  setWhiteList(value: Partial<SteamTasks>): Promise<boolean> {
    return this.ctx.enqueue(() => this.ctx.run('whitelist.set', undefined, false, async (ctx) => {
      await loadState(ctx);
      const next = createTasks({ ...ctx.state.whiteList, ...value });
      await ctx.storage.set('whiteList', next);
      ctx.state.whiteList = next;
      return true;
    }));
  }
  getPlayState(): Promise<PlayState | false> {
    return this.ctx.enqueue(() => this.ctx.run<PlayState | false>('play.state', undefined, false, getPlayState));
  }
  stopPlayGames(): Promise<boolean> { return this.ctx.enqueue(() => stopPlayGames(this.ctx)); }
  resetArea(): Promise<boolean> { return this.ctx.enqueue(() => this.ctx.run('region.reset', undefined, false, resetRegion)); }
  dispose(): void {
    this.ctx.state.disposed = true;
    for (const off of this.ctx.unsubscribers) off();
    for (const executor of this.ctx.executors) executor.client.dispose();
    this.ctx.events.clear();
  }
}
export default Steam;
