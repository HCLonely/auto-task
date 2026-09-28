import { createGMStorage, getDefaultGM } from './adapters/gmStorage';
import { StatusEvents } from './events';
import type { Auth, HttpRequestOptions, StatusLevel, TwitchOptions, TwitchTasks } from './types';

export class Context {
  readonly events = new StatusEvents();
  readonly gm;
  readonly storage;
  readonly namespace;
  readonly authTimeoutMs;
  readonly channelDelayMs;
  readonly followEnabled;
  readonly unfollowEnabled;
  readonly state = {
    auth: undefined as Auth | undefined,
    integrityToken: '',
    initialized: false,
    loaded: false,
    disposed: false,
    init: undefined as Promise<boolean> | undefined,
    cache: Object.create(null) as Record<string, string>,
    tasks: {
      channels: []
    } as TwitchTasks,
    whiteList: {
      channels: []
    } as TwitchTasks,
    tasksOverridden: false,
    whiteListOverridden: false,
    cleanups: new Set<() => void>(),
    batchQueue: Promise.resolve() as Promise<unknown>
  };
  private operationId = '';
  private parentOperationId?: string;
  private operation = '';
  private target?: string;
  private taskLink?: string;

  /** Scope the original task URL to this operation and its children. */
  forTaskLink(link: string): Context {
    const child = Object.assign(Object.create(Context.prototype) as Context, this);
    child.taskLink = link;
    return child;
  }

  private code?: string;
  private skipped = false;

  constructor(private readonly options: TwitchOptions) {
    this.gm = options.gm || getDefaultGM();
    this.namespace = options.namespace || 'twitch';
    this.authTimeoutMs = options.authTimeoutMs ?? 120000;
    this.channelDelayMs = options.channelDelayMs ?? 1000;
    if (!Number.isFinite(this.authTimeoutMs) || this.authTimeoutMs <= 0 || this.authTimeoutMs > 2147483647) {
      throw new Error('Invalid authTimeoutMs');
    }
    if (!Number.isFinite(this.channelDelayMs) || this.channelDelayMs < 0 || this.channelDelayMs > 2147483647) {
      throw new Error('Invalid channelDelayMs');
    }
    this.followEnabled = options.followEnabled ?? true;
    this.unfollowEnabled = options.unfollowEnabled ?? true;
    this.storage = createGMStorage(this.gm, this.namespace);
  }

  async run<T>(operation: string, target: string | undefined, work: (ctx: Context) => Promise<T>, success: (value: T) => boolean): Promise<T> {
    const ctx = Object.assign(Object.create(Context.prototype) as Context, this);
    ctx.operationId = crypto.randomUUID();
    ctx.parentOperationId = this.operationId || undefined;
    ctx.operation = operation;
    ctx.target = target;
    ctx.code = undefined;
    ctx.skipped = false;
    ctx.emit('start', 'info', 'OPERATION_STARTED');
    try {
      const result = await work(ctx);
      const ok = success(result);
      ctx.emit(ok ? (ctx.skipped ? 'skipped' : 'success') : 'failure', ok ? 'info' : 'error',
        ok ? (ctx.skipped ? (ctx.code || 'OPERATION_SKIPPED') : 'OPERATION_COMPLETED') : (ctx.code || 'OPERATION_FAILED'));
      return result;
    } catch (error) {
      ctx.emit('failure', 'error', 'UNEXPECTED_ERROR');
      throw error;
    }
  }

  private emit(phase: 'start' | 'progress' | 'success' | 'failure' | 'skipped', level: StatusLevel, code: string,
    details?: Record<string, string | number | boolean>): void {
    this.events.emit({
      operationId: this.operationId,
      parentOperationId: this.parentOperationId,
      operation: this.operation,
      target: this.target,
      timestamp: Date.now(),
      phase,
      level,
      code,
      details: {
        ...details,
        ...(this.taskLink ? {
          taskLink: this.taskLink
        } : {})
      }
    });
  }
  progress(code: string, level: StatusLevel = 'info', details?: Record<string, string | number | boolean>): void {
    if (level === 'error') {
      this.code = code;
    }
    this.emit('progress', level, code, details);
  }
  skip(code: string): void {
    this.skipped = true;
    this.code = code;
  }
  async request(options: HttpRequestOptions) {
    if (this.state.disposed) {
      throw new Error('Disposed');
    }
    this.progress('HTTP_REQUEST_STARTED', 'debug');
    const result = await this.options.http(options);
    if (this.state.disposed) {
      throw new Error('Disposed');
    }
    this.progress('HTTP_REQUEST_COMPLETED', 'debug', {
      transportStatus: result.status,
      httpStatus: result.data?.status || 0
    });
    return result;
  }
}
