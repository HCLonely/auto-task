import SteamASF from './steamASF';
import SteamWeb from './steamWeb';
import { createGMStorage, getDefaultGM } from './steamWeb/adapters/gmStorage';
import { asfDefaults, createTasks, doDefaults, undoDefaults } from './defaults';
import { SteamEvents } from './events';
import type { Executor, SteamEvent, SteamOptions, SteamTasks } from './types';

export class SteamError extends Error {
  constructor(readonly code: string) {
    super(code);
  }
}
export class Context {
  readonly events = new SteamEvents();
  readonly storage: ReturnType<typeof createGMStorage>;
  readonly options;
  readonly executors: Executor[] = [];
  readonly activeParents = new Map<Executor, string>();
  readonly unsubscribers: Array<() => void> = [];
  readonly state: {
    tasks: SteamTasks; whiteList: SteamTasks; loaded: boolean; queue: Promise<unknown>; disposed: boolean;
  } = {
      tasks: createTasks(),
      whiteList: createTasks(),
      loaded: false,
      queue: Promise.resolve(),
      disposed: false
    };
  private operationId = '';
  private parentOperationId?: string;
  private operation = '';
  private target?: string;
  private skipped?: string;
  private operationDetails?: Record<string, string | number | boolean>;

  constructor(options: SteamOptions) {
    this.options = {
      ...options,
      namespace: options.namespace || 'steam',
      ASF: {
        ...asfDefaults,
        ...options.ASF
      },
      doTask: {
        ...doDefaults,
        ...options.doTask
      },
      undoTask: {
        ...undoDefaults,
        ...options.undoTask
      },
      taskDelayMs: options.taskDelayMs ?? 1000,
      playRetryDelayMs: options.playRetryDelayMs ?? 3000
    };
    for (const ms of [this.options.taskDelayMs, this.options.playRetryDelayMs]) {
      if (!Number.isFinite(ms) || ms < 0) {
        throw new Error('Invalid delay');
      }
    }
    const gm = {
      ...getDefaultGM(),
      ...options.gm
    };
    this.storage = createGMStorage(gm, this.options.namespace);
    const asf = this.options.ASF;
    if (asf.AsfEnabled) {
      this.executors.push({
        source: 'steamASF',
        ready: new Set(),
        client: new SteamASF({
          ...asf,
          http: options.http,
          gm,
          namespace: `${this.options.namespace}:asf`
        })
      });
    }
    if (!asf.AsfEnabled || asf.steamWeb) {
      this.executors.push({
        source: 'steamWeb',
        ready: new Set(),
        client: new SteamWeb({
          http: options.http,
          gm,
          namespace: `${this.options.namespace}:web`,
          autoChangeRegion: options.autoChangeRegion,
          authTimeoutMs: options.authTimeoutMs
        })
      });
    }
    if (!asf.preferASF) {
      this.executors.sort((a, b) => {
        return Number(a.source === 'steamASF') - Number(b.source === 'steamASF');
      });
    }
    for (const executor of this.executors) {
      this.unsubscribers.push(executor.client.on('status', (event) => {
        return this.events.emit({
          ...event,
          source: executor.source,
          parentOperationId: event.parentOperationId || this.activeParents.get(executor)
        });
      }));
    }
  }

  enqueue<T>(work: () => Promise<T>): Promise<T> {
    const job = this.state.queue.then(work);
    this.state.queue = job.catch(() => {
      return undefined;
    });
    return job;
  }

  async run<T>(operation: string, target: string | undefined, fallback: T, work: (ctx: Context) => Promise<T>, success?: (value: T) => boolean, details?: Record<string, string | number | boolean>): Promise<T> {
    const child = Object.assign(Object.create(Context.prototype) as Context, this);
    child.operationId = crypto.randomUUID();
    child.parentOperationId = this.operationId || undefined;
    child.operation = operation;
    child.target = target;
    child.skipped = undefined;
    child.operationDetails = details;
    child.emit('start', 'OPERATION_STARTED');
    try {
      if (child.state.disposed) {
        throw new SteamError('DISPOSED');
      }
      const value = await work(child);
      const ok = success ? success(value) : value !== false;
      child.emit(child.skipped ? 'skipped' : (ok ? 'success' : 'failure'), child.skipped || (ok ? 'OPERATION_COMPLETED' : 'OPERATION_FAILED'));
      return value;
    } catch (error) {
      child.emit('failure', error instanceof SteamError ? error.code : 'UNEXPECTED_ERROR');
      return fallback;
    }
  }

  private emit(phase: SteamEvent['phase'], code: string, details?: Record<string, string | number | boolean>): void {
    this.events.emit({
      source: 'steam',
      operationId: this.operationId,
      parentOperationId: this.parentOperationId,
      operation: this.operation,
      target: this.target,
      phase,
      level: phase === 'failure' ? 'error' : 'info',
      code,
      timestamp: Date.now(),
      details: {
        ...this.operationDetails,
        ...details
      }
    });
  }
  progress(code: string, details?: Record<string, string | number | boolean>): void {
    this.emit('progress', code, details);
  }
  skip(code: string): void {
    this.skipped = code;
  }

  async invoke<T>(executor: Executor, work: () => Promise<T>): Promise<T> {
    if (this.state.disposed) {
      throw new SteamError('DISPOSED');
    }
    this.activeParents.set(executor, this.operationId);
    try {
      return await work();
    } finally {
      this.activeParents.delete(executor);
    }
  }

  async delay(ms = this.options.taskDelayMs): Promise<void> {
    if (ms) {
      await new Promise<void>((resolve) => {
        return setTimeout(resolve, ms);
      });
    }
    if (this.state.disposed) {
      throw new SteamError('DISPOSED');
    }
  }
}
