import { updateAuth } from './auth/session';
import { Context } from './context';
import { doTasks, undoTasks } from './features/tasks';
import { loadWhiteList, setWhiteList, validateWhiteList } from './whiteList';
import type { RedditOptions, RedditTasks, SocialTaskResult, StatusListener, TaskOptions } from './types';

export * from './types';
export { createGMHttpClient } from './adapters/gmHttp';
export type { GMRawResponse, GMRequest, GMRequestOptions } from './adapters/gmHttp';
export { createGMCookieReader } from './adapters/gmCookie';
export { createGMStorage } from './adapters/gmStorage';

export class Reddit {
  private readonly ctx: Context;
  private initializing?: Promise<boolean>;
  private queue: Promise<unknown> = Promise.resolve();

  constructor(options: RedditOptions) { this.ctx = new Context(options); }
  get tasks(): RedditTasks { return this.ctx.state.tasks; }
  set tasks(value: RedditTasks) { this.ctx.state.tasks = validateWhiteList(value); }
  get whiteList(): RedditTasks { return this.ctx.state.whiteList; }
  set whiteList(value: RedditTasks) { this.ctx.state.whiteList = validateWhiteList(value); }

  on(event: 'status', listener: StatusListener): () => void {
    if (event !== 'status') throw new Error('Unknown event');
    return this.ctx.events.on(listener);
  }

  init(): Promise<boolean> {
    if (this.initializing) return this.initializing;
    this.initializing = this.ctx.run('init', undefined, async (ctx) => {
      try {
        if (ctx.state.disposed) return ctx.fail('DISPOSED');
        if (ctx.state.initialized) return true;
        await loadWhiteList(ctx);
        ctx.state.initialized = await updateAuth(ctx);
        return ctx.state.initialized;
      } catch { return ctx.fail('INITIALIZATION_FAILED'); }
    }, Boolean).finally(() => { this.initializing = undefined; });
    return this.initializing;
  }

  do(options: TaskOptions = {}): Promise<SocialTaskResult> {
    const job = this.queue.then(() => doTasks(this.ctx, options));
    this.queue = job.catch(() => undefined);
    return job;
  }
  undo(options: TaskOptions = {}): Promise<SocialTaskResult> {
    const job = this.queue.then(() => undoTasks(this.ctx, options));
    this.queue = job.catch(() => undefined);
    return job;
  }

  /** Unlike assigning whiteList, this method also persists it in GM storage. */
  setWhiteList(value: RedditTasks): Promise<boolean> { return setWhiteList(this.ctx, value); }

  dispose(): void {
    this.ctx.state.disposed = true;
    this.ctx.state.csrfToken = '';
    for (const cancel of [...this.ctx.cancellations]) cancel();
    this.ctx.events.clear();
  }
}

export default Reddit;
