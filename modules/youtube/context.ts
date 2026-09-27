import { defaultCookieReader } from './adapters/gmCookies';
import { createGMStorage, getDefaultGM } from './adapters/gmStorage';
import { sha1 } from './auth/signature';
import { StatusEvents } from './events';
import type { HttpRequestOptions, YoutubeOptions, YoutubeStatusEvent, YoutubeTasks } from './types';

export function tasks(value?: Partial<YoutubeTasks>): YoutubeTasks {
  const strings = (items?: unknown) => Array.isArray(items) ? [...new Set(items.filter((item): item is string => typeof item === 'string'))] : [];
  return { channels: strings(value?.channels), likes: strings(value?.likes) };
}

export class Context {
  readonly events = new StatusEvents();
  readonly storage;
  readonly cookies;
  readonly hash;
  readonly options;
  readonly state = {
    auth: '', initialized: false, disposed: false,
    tasks: tasks(), whiteList: tasks(),
    whiteListOverride: undefined as YoutubeTasks | undefined,
    init: undefined as Promise<boolean> | undefined,
    cleanups: new Set<() => void>()
  };
  private operationId = '';
  private parentOperationId?: string;
  private operation = '';
  private target?: string;
  private failure?: string;
  private skipped?: string;

  constructor(options: YoutubeOptions) {
    const taskDelayMs = options.taskDelayMs ?? 1000;
    if (!Number.isFinite(taskDelayMs) || taskDelayMs < 0) throw new Error('Invalid taskDelayMs');
    this.options = {
      ...options, taskDelayMs,
      verifyChannel: options.verifyChannel ?? 'UCrXUsMBcfTVqwAS7DKg9C0Q',
      doTask: { channels: true, likes: true, ...options.doTask },
      undoTask: { channels: true, likes: true, ...options.undoTask }
    };
    this.storage = createGMStorage(options.gm || getDefaultGM(), options.namespace);
    this.cookies = options.cookies || defaultCookieReader(options.cookieTimeoutMs ?? 30000);
    this.hash = options.sha1 || sha1;
    if (options.whiteList) this.state.whiteListOverride = tasks(options.whiteList);
    this.state.whiteList = tasks(options.whiteList);
  }

  async run<T>(operation: string, target: string | undefined, fallback: T, work: (ctx: Context) => Promise<T>, success: (value: T) => boolean = (value) => value === true): Promise<T> {
    const child = Object.assign(Object.create(Context.prototype) as Context, this);
    child.operationId = crypto.randomUUID();
    child.parentOperationId = this.operationId || undefined;
    child.operation = operation;
    child.target = target;
    child.failure = undefined;
    child.skipped = undefined;
    child.emit('start', 'info', 'OPERATION_STARTED');
    try {
      if (this.state.disposed) { child.fail('DISPOSED'); throw new Error('Disposed'); }
      const value = await work(child);
      const ok = success(value);
      child.emit(ok ? child.skipped ? 'skipped' : 'success' : 'failure', ok ? 'info' : 'error',
        ok ? child.skipped || 'OPERATION_COMPLETED' : child.failure || 'OPERATION_FAILED');
      return value;
    } catch {
      child.emit('failure', 'error', child.failure || 'UNEXPECTED_ERROR');
      return fallback;
    }
  }

  private emit(phase: YoutubeStatusEvent['phase'], level: YoutubeStatusEvent['level'], code: string, details?: Record<string, string | number | boolean>): void {
    this.events.emit({ operationId: this.operationId, parentOperationId: this.parentOperationId,
      operation: this.operation, target: this.target, phase, level, code, timestamp: Date.now(), details });
  }
  progress(code: string, details?: Record<string, string | number | boolean>): void { this.emit('progress', 'info', code, details); }
  fail(code: string): false { this.failure = code; this.emit('progress', 'error', code); return false; }
  skip(code: string): true { this.skipped = code; return true; }
  async request(options: HttpRequestOptions) {
    if (this.state.disposed) throw new Error('Disposed');
    this.emit('progress', 'debug', 'HTTP_REQUEST_STARTED', { method: options.method || 'GET' });
    const result = await this.options.http(options);
    if (this.state.disposed) throw new Error('Disposed');
    this.emit('progress', 'debug', 'HTTP_REQUEST_COMPLETED', { transportStatus: result.status, httpStatus: result.data?.status || 0 });
    return result;
  }
  async delay(ms: number): Promise<void> {
    if (!ms || this.state.disposed) return;
    await new Promise<void>((resolve) => {
      const finish = () => { clearTimeout(timer); this.state.cleanups.delete(finish); resolve(); };
      const timer = setTimeout(finish, ms);
      this.state.cleanups.add(finish);
    });
  }
}
