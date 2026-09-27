import { initialize } from './auth/initialization';
import { Context, normalizeTasks } from './context';
import { doRetweet, undoRetweet } from './features/retweets';
import { doTasks, undoTasks } from './features/tasks';
import { doUser, undoUser, userName2id } from './features/users';
import type { StatusListener, TaskOptions, TwitterOptions, TwitterTasks, TwitterTaskResult } from './types';

export * from './types';
export { createGMHttpClient } from './adapters/gmHttp';
export type { GMRawResponse, GMRequest, GMRequestOptions } from './adapters/gmHttp';
export { createGMStorage } from './adapters/gmStorage';
export { createTransactionIdProvider } from './transaction';

/** Userscript-only, self-contained Twitter client. Construction performs no I/O. */
export class Twitter {
  private readonly ctx: Context;
  constructor(options: TwitterOptions) { this.ctx = new Context(options); }
  get tasks(): TwitterTasks { return this.ctx.state.tasks; }
  set tasks(value: TwitterTasks) { this.ctx.state.tasks = normalizeTasks(value); }
  get whiteList(): TwitterTasks { return this.ctx.state.whiteList; }
  set whiteList(value: TwitterTasks) {
    this.ctx.state.whiteList = normalizeTasks(value);
    this.ctx.state.whiteListConfigured = true;
  }
  init(): Promise<boolean> { return initialize(this.ctx); }
  userName2id(name: string): Promise<string | false> { return userName2id(this.ctx, name); }
  do(options: TaskOptions = {}): Promise<TwitterTaskResult> { return doTasks(this.ctx, options); }
  undo(options: TaskOptions = {}): Promise<TwitterTaskResult> { return undoTasks(this.ctx, options); }
  /** Explicit single-item actions alongside the do/undo batch API. */
  doUser(name: string): Promise<boolean> { return doUser(this.ctx, name); }
  undoUser(name: string): Promise<boolean> { return undoUser(this.ctx, name); }
  doRetweet(id: string): Promise<boolean> { return doRetweet(this.ctx, id); }
  undoRetweet(id: string): Promise<boolean> { return undoRetweet(this.ctx, id); }
  setWhiteList(value: Partial<TwitterTasks>): Promise<boolean> {
    return this.ctx.run('whiteList.update', undefined, false, async (ctx) => {
      const whiteList = normalizeTasks({ ...ctx.state.whiteList, ...value });
      await ctx.storage.set('whiteList', whiteList);
      ctx.state.whiteList = whiteList;
      ctx.state.whiteListConfigured = true;
      return true;
    });
  }
  on(event: 'status', listener: StatusListener): () => void {
    if (event !== 'status') throw new Error('Unknown event');
    return this.ctx.events.on(listener);
  }
  dispose(): void {
    this.ctx.state.disposed = true;
    this.ctx.state.initialized = false;
    for (const cancel of [...this.ctx.state.cleanups]) cancel();
    this.ctx.events.clear();
  }
}
export default Twitter;
