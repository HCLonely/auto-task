import { verifyAuth } from './auth/session';
import { updateAuth } from './auth/token';
import { loadCache } from './cache';
import { Context } from './context';
import { doTasks, undoTasks } from './features/tasks';
import type { SocialTaskResult, StatusListener, TaskOptions, VkOptions, VkTasks } from './types';
import { loadWhiteList, setWhiteList } from './whiteList';

export * from './types';
export { createGMHttpClient } from './adapters/gmHttp';
export type { GMRequest, GMRawResponse, GMRequestOptions } from './adapters/gmHttp';
export { createGMStorage } from './adapters/gmStorage';

/** Browser userscript VK module; no global registration or project dependencies. */
export class Vk {
  private readonly ctx: Context;
  private queue: Promise<unknown> = Promise.resolve();
  constructor(options: VkOptions) {
    this.ctx = new Context(options);
  }

  get tasks(): VkTasks {
    return this.ctx.state.tasks;
  }
  set tasks(value: VkTasks) {
    this.ctx.state.tasks = value;
  }
  get whiteList(): VkTasks {
    return this.ctx.state.whiteList;
  }
  set whiteList(value: VkTasks) {
    this.ctx.state.whiteList = value;
  }

  on(event: 'status', listener: StatusListener): () => void {
    if (event !== 'status') {
      throw new Error('Unknown event');
    }
    return this.ctx.events.on(listener);
  }

  init(): Promise<boolean> {
    const { state } = this.ctx;
    if (state.init) {
      return state.init;
    }
    state.init = this.ctx.run('init', undefined, false, async (ctx) => {
      if (state.disposed) {
        return ctx.fail('DISPOSED');
      }
      if (state.initialized) {
        return true;
      }
      state.token = '';
      // Read current API parameters before requesting a token, retaining defaults if absent.
      if (!await verifyAuth(ctx) || !await updateAuth(ctx)) {
        return false;
      }
      await loadCache(ctx);
      await loadWhiteList(ctx);
      if (state.disposed) {
        return ctx.fail('DISPOSED');
      }
      state.initialized = true;
      return true;
    }).finally(() => {
      state.init = undefined;
    });
    return state.init;
  }

  do(options: TaskOptions = {}): Promise<SocialTaskResult> {
    const snapshot = {
      ...options,
      nameLinks: [...(options.nameLinks || [])]
    };
    const job = this.queue.then(() => {
      return doTasks(this.ctx, snapshot);
    });
    this.queue = job.catch(() => {
      return undefined;
    });
    return job;
  }
  undo(options: TaskOptions = {}): Promise<SocialTaskResult> {
    const snapshot = {
      ...options,
      nameLinks: [...(options.nameLinks || [])]
    };
    const job = this.queue.then(() => {
      return undoTasks(this.ctx, snapshot);
    });
    this.queue = job.catch(() => {
      return undefined;
    });
    return job;
  }

  /** Use this method when whiteList changes should persist across script reloads. */
  setWhiteList(value: VkTasks): Promise<boolean> {
    return setWhiteList(this.ctx, value);
  }

  dispose(): void {
    this.ctx.state.disposed = true;
    this.ctx.state.initialized = false;
    this.ctx.state.token = '';
    this.ctx.events.clear();
  }
}
export default Vk;
