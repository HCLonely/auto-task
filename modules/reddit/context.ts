import { createGMStorage, getDefaultGM } from './adapters/gmStorage';
import { getDefaultCookieReader } from './adapters/gmCookie';
import { StatusEvents } from './events';
import type { CookieReader, HttpClient, RedditOptions, RedditStatusEvent, RedditTasks } from './types';

export class Context {
  readonly state = {
    csrfToken: '', initialized: false, disposed: false,
    tasks: { reddits: [] } as RedditTasks,
    whiteList: { reddits: [] } as RedditTasks
  };
  readonly events = new StatusEvents();
  readonly storage: ReturnType<typeof createGMStorage>;
  readonly cookies: CookieReader;
  readonly intervalMs: number;
  readonly doTaskEnabled: boolean;
  readonly undoTaskEnabled: boolean;
  readonly cancellations = new Set<() => void>();
  private readonly http: HttpClient;
  private operationId = '';
  private parentOperationId?: string;
  private operation = '';
  private target?: string;
  private failureCode?: string;
  private skipped = false;

  constructor(options: RedditOptions) {
    this.http = options.http;
    this.storage = createGMStorage(options.gm || getDefaultGM(), options.namespace || 'reddit');
    this.cookies = options.cookies || getDefaultCookieReader(options.cookieTimeoutMs);
    this.intervalMs = options.intervalMs ?? 1000;
    if (!Number.isFinite(this.intervalMs) || this.intervalMs < 0) throw new Error('Invalid intervalMs');
    this.doTaskEnabled = options.doTaskEnabled ?? true;
    this.undoTaskEnabled = options.undoTaskEnabled ?? true;
  }

  async run<T>(operation: string, target: string | undefined, work: (ctx: Context) => Promise<T>, success: (value: T) => boolean): Promise<T> {
    const child = Object.assign(Object.create(Context.prototype) as Context, this);
    child.parentOperationId = this.operationId || undefined;
    child.operationId = crypto.randomUUID();
    child.operation = operation;
    child.target = target;
    child.failureCode = undefined;
    child.skipped = false;
    child.emit('start', 'OPERATION_STARTED');
    try {
      const result = await work(child);
      const ok = success(result);
      child.emit(ok ? child.skipped ? 'skipped' : 'success' : 'failure',
        ok ? child.skipped ? 'OPERATION_SKIPPED' : 'OPERATION_COMPLETED' : child.failureCode || 'OPERATION_FAILED');
      return result;
    } catch (error) {
      child.emit('failure', child.failureCode || 'UNEXPECTED_ERROR');
      throw error;
    }
  }

  private emit(phase: RedditStatusEvent['phase'], code: string, details?: RedditStatusEvent['details']): void {
    this.events.emit({ operationId: this.operationId, parentOperationId: this.parentOperationId,
      operation: this.operation, target: this.target, phase, code, timestamp: Date.now(),
      level: phase === 'failure' || code === this.failureCode ? 'error' : code.startsWith('HTTP_') ? 'debug' : 'info', details });
  }
  progress(code: string, details?: RedditStatusEvent['details']): void { this.emit('progress', code, details); }
  fail(code: string): false { this.failureCode = code; this.progress(code); return false; }
  skip(code: string): true { this.skipped = true; this.progress(code); return true; }

  async request(options: Parameters<HttpClient>[0]): ReturnType<HttpClient> {
    if (this.state.disposed) throw new Error('DISPOSED');
    this.progress('HTTP_REQUEST_STARTED', { method: options.method || 'GET' });
    const result = await this.http(options);
    if (this.state.disposed) throw new Error('DISPOSED');
    this.progress('HTTP_REQUEST_COMPLETED', { transportStatus: result.status, httpStatus: result.data?.status || 0 });
    return result;
  }

  async delay(): Promise<void> {
    if (this.state.disposed || this.intervalMs === 0) return;
    await new Promise<void>((resolve) => {
      const done = () => { clearTimeout(timer); this.cancellations.delete(done); resolve(); };
      const timer = setTimeout(done, this.intervalMs);
      this.cancellations.add(done);
    });
  }
}
