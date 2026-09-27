import { createGMHttpClient } from './adapters/gmHttp';
import type { GMRequest } from './adapters/gmHttp';
import { updateAuth } from './auth/cookies';
import { verifyAuth } from './auth/verify';
import { Context, tasks } from './context';
import { doTasks, undoTasks } from './features/batch';
import { doChannel, undoChannel } from './features/channels';
import { getInfo as readInfo } from './features/info';
import { doLikeVideo, undoLikeVideo } from './features/videos';
import type { InfoOptions, InfoType, SocialTaskResult, StatusListener, TaskOptions, YoutubeInfo, YoutubeOptions, YoutubeTasks } from './types';

export * from './types';
export { createGMHttpClient } from './adapters/gmHttp';
export type { GMRequest, GMRequestOptions, GMRawResponse } from './adapters/gmHttp';
export { createGMCookieReader } from './adapters/gmCookies';
export { createGMStorage } from './adapters/gmStorage';

declare const GM_xmlhttpRequest: GMRequest;

/** Keeps the original two-argument API; an optional third argument injects HTTP/status handling. */
export async function getInfo(link: string, type: InfoType, options: InfoOptions = {}): Promise<YoutubeInfo> {
  const ctx = new Context({ http: options.http || createGMHttpClient((request) => GM_xmlhttpRequest(request)) });
  if (options.onStatus) ctx.events.on(options.onStatus);
  return readInfo(ctx, link, type);
}

export class Youtube {
  private readonly ctx: Context;
  constructor(options: YoutubeOptions) { this.ctx = new Context(options); }

  /** Session task history, as in the original class; verification never adds a task. */
  get tasks(): YoutubeTasks { return this.ctx.state.tasks; }
  set tasks(value: YoutubeTasks) { this.ctx.state.tasks = tasks(value); }
  get whiteList(): YoutubeTasks { return this.ctx.state.whiteList; }
  set whiteList(value: YoutubeTasks) {
    this.ctx.state.whiteList = tasks(value);
    this.ctx.state.whiteListOverride = tasks(value);
  }

  on(event: 'status', listener: StatusListener): () => void {
    if (event !== 'status') throw new Error('Unknown event');
    return this.ctx.events.on(listener);
  }

  init(): Promise<boolean> {
    const { state } = this.ctx;
    if (state.init) return state.init;
    state.init = this.ctx.run('init', undefined, false, async (ctx) => {
      if (state.initialized) return true;
      state.whiteList = state.whiteListOverride || tasks(await ctx.storage.get<Partial<YoutubeTasks>>('whiteList', {}));
      if (state.whiteListOverride) await ctx.storage.set('whiteList', state.whiteList);
      const saved = await ctx.storage.get<{ PAPISID?: unknown } | null>('auth', null);
      state.auth = typeof saved?.PAPISID === 'string' ? saved.PAPISID : '';
      if (state.auth && await verifyAuth(ctx)) {
        state.initialized = true;
        return true;
      }
      state.auth = '';
      await ctx.storage.delete('auth');
      if (!await updateAuth(ctx)) return false;
      if (!await verifyAuth(ctx)) { state.auth = ''; return false; }
      if (state.disposed) return ctx.fail('DISPOSED');
      await ctx.storage.set('auth', { PAPISID: state.auth });
      if (state.disposed) return ctx.fail('DISPOSED');
      state.initialized = true;
      return true;
    }).finally(() => { state.init = undefined; });
    return state.init;
  }

  do(options: TaskOptions = {}): Promise<SocialTaskResult> { return doTasks(this.ctx, options); }
  undo(options: TaskOptions = {}): Promise<SocialTaskResult> { return undoTasks(this.ctx, options); }
  getInfo(link: string, type: InfoType): Promise<YoutubeInfo> { return readInfo(this.ctx, link, type); }
  /** Individual operations are also exposed for callers that do not need batch scheduling. */
  doChannel(options: { link: string; }): Promise<boolean> { return doChannel(this.ctx, options); }
  undoChannel(options: { link: string; }): Promise<boolean> { return undoChannel(this.ctx, options); }
  doLikeVideo(options: { link: string; }): Promise<boolean> { return doLikeVideo(this.ctx, options); }
  undoLikeVideo(options: { link: string; }): Promise<boolean> { return undoLikeVideo(this.ctx, options); }

  saveWhiteList(value: Partial<YoutubeTasks> = this.whiteList): Promise<boolean> {
    return this.ctx.run('whiteList.save', undefined, false, async (ctx) => {
      const next = tasks(value);
      await ctx.storage.set('whiteList', next);
      this.whiteList = next;
      return true;
    });
  }

  dispose(): void {
    this.ctx.state.disposed = true;
    this.ctx.state.initialized = false;
    this.ctx.state.auth = '';
    for (const cancel of [...this.ctx.state.cleanups]) cancel();
    this.ctx.events.clear();
  }
}

export default Youtube;
