import { createGMStorage, getDefaultGM } from './adapters/gmStorage';
import { DEFAULT_API } from './defaults';
import { StatusEvents } from './events';
import type { ApiConfig, Auth, StatusLevel, StatusPhase, TransactionIdProvider, TwitterOptions, TwitterTasks } from './types';

export const emptyTasks = (): TwitterTasks => ({ users: [], retweets: [], likes: [] });
export function normalizeTasks(value: Partial<TwitterTasks> | null | undefined): TwitterTasks {
  const result = emptyTasks();
  for (const key of ['users', 'retweets', 'likes'] as const) {
    result[key] = Array.isArray(value?.[key]) ? [...new Set(value[key].filter((entry) => typeof entry === 'string'))] : [];
  }
  return result;
}

export class Context {
  readonly gm;
  readonly storage;
  readonly events = new StatusEvents();
  readonly api: ApiConfig;
  readonly options: TwitterOptions;
  readonly state = {
    initialized: false, disposed: false,
    initPromise: undefined as Promise<boolean> | undefined,
    auth: undefined as Auth | undefined,
    getTID: undefined as TransactionIdProvider | undefined,
    cache: Object.create(null) as Record<string, string>,
    writes: Promise.resolve(),
    tasks: emptyTasks(), whiteList: emptyTasks(), whiteListConfigured: false,
    cleanups: new Set<() => void>()
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

  private failureCode?: string;
  private skipCode?: string;

  constructor(options: TwitterOptions) {
    this.options = {
      ...options, verifyId: options.verifyId ?? '783214', taskDelayMs: options.taskDelayMs ?? 1000, cookieTimeoutMs: options.cookieTimeoutMs ?? 30000,
      doTask: { users: true, retweets: true, ...options.doTask }, undoTask: { users: true, retweets: true, ...options.undoTask }
    };
    for (const [name, value] of [['taskDelayMs', this.options.taskDelayMs], ['cookieTimeoutMs', this.options.cookieTimeoutMs]] as const) {
      if (!Number.isFinite(value) || value! < (name === 'cookieTimeoutMs' ? 1 : 0) || value! > 2147483647) throw new Error(`Invalid ${name}`);
    }
    if (!/^\d+$/.test(this.options.verifyId!)) throw new Error('Invalid verifyId');
    this.api = { ...DEFAULT_API, ...options.api };
    this.gm = options.gm || getDefaultGM();
    this.storage = createGMStorage(this.gm, options.namespace || 'twitter');
    this.state.whiteList = normalizeTasks(options.whiteList);
  }

  async run<T>(operation: string, target: string | undefined, fallback: T, work: (ctx: Context) => Promise<T>): Promise<T> {
    const ctx = Object.assign(Object.create(Context.prototype) as Context, this);
    ctx.operationId = crypto.randomUUID();
    ctx.parentOperationId = this.operationId || undefined;
    ctx.operation = operation;
    ctx.target = target;
    ctx.failureCode = undefined;
    ctx.skipCode = undefined;
    ctx.emit('start', 'info', 'OPERATION_STARTED');
    let result = fallback;
    try {
      if (ctx.state.disposed) ctx.progress('DISPOSED', 'error');
      else result = await work(ctx);
    } catch { ctx.progress('UNEXPECTED_ERROR', 'error'); }
    const success = result !== false && result !== undefined && result !== null &&
      !(typeof result === 'object' && 'success' in result && result.success === false);
    ctx.emit(success ? ctx.skipCode ? 'skipped' : 'success' : 'failure', success ? 'info' : 'error',
      success ? ctx.skipCode || 'OPERATION_COMPLETED' : ctx.failureCode || 'OPERATION_FAILED');
    return result;
  }

  private emit(phase: StatusPhase, level: StatusLevel, code: string, details?: Record<string, string | number | boolean>): void {
    this.events.emit({
      operationId: this.operationId, parentOperationId: this.parentOperationId, operation: this.operation,
      target: this.target, phase, level, code, timestamp: Date.now(), details: { ...details, ...(this.taskLink ? { taskLink: this.taskLink } : {}) }
    });
  }
  progress(code: string, level: StatusLevel = 'info', details?: Record<string, string | number | boolean>): void {
    if (level === 'error') this.failureCode = code;
    this.emit('progress', level, code, details);
  }
  skip(code: string): true { this.skipCode = code; return true; }
  ready(): boolean {
    if (this.state.initialized && !this.state.disposed) return true;
    this.progress(this.state.disposed ? 'DISPOSED' : 'AUTH_REQUIRED', 'error');
    return false;
  }
  async delay(): Promise<void> {
    if (!this.options.taskDelayMs || this.state.disposed) return;
    await new Promise<void>((resolve) => {
      const finish = () => { clearTimeout(timer); this.state.cleanups.delete(finish); resolve(); };
      const timer = setTimeout(finish, this.options.taskDelayMs);
      this.state.cleanups.add(finish);
    });
  }
}
