import { SocialAdapter } from './adapter';
import { isSuccessful } from './types';
import type { BatchResult, InitOptions, InitResult, ManagerListener, ManagerStatusEvent, SocialModule, SocialTaskResult, TaskOptions } from './types';

type InitMap<M extends Record<keyof M, SocialModule>> = { [K in keyof M]?: InitOptions<M[K]> };
type TaskMap<M extends Record<keyof M, SocialModule>> = { [K in keyof M]?: TaskOptions<M[K]> };
// Parameter types are erased only inside heterogeneous storage; public methods retain M's types.
type RuntimeModule = Omit<SocialModule, 'init' | 'do' | 'undo'> & {
  init(options?: unknown): Promise<InitResult>;
  do(options: unknown): Promise<SocialTaskResult>;
  undo(options: unknown): Promise<SocialTaskResult>;
};

/** Coordinates supplied instances only. Construction performs no authentication or network I/O. */
export class SocialManager<M extends Record<keyof M, SocialModule>> {
  private readonly adapters = new Map<keyof M, SocialAdapter<RuntimeModule>>();
  private readonly listeners = new Set<ManagerListener>();
  private readonly unsubscribers: (() => void)[] = [];
  private readonly queues = new Map<keyof M, Promise<unknown>>();
  private disposed = false;
  private readonly clients: M;

  constructor(clients: M) {
    this.clients = Object.freeze({ ...clients });
    // Fail before subscribing when the same instance is registered under two names.
    const seen = new Set<SocialModule>();
    for (const key of Object.keys(clients) as (keyof M)[]) {
      if (seen.has(clients[key])) throw new Error('A module instance may only be registered once');
      seen.add(clients[key]);
    }
    try {
      for (const key of Object.keys(clients) as (keyof M)[]) {
        const adapter = new SocialAdapter(clients[key] as unknown as RuntimeModule);
        this.adapters.set(key, adapter);
        this.unsubscribers.push(adapter.on('status', (event) => {
          this.emit({ ...event, platform: String(key), origin: 'module' });
        }));
      }
    } catch (error) {
      for (const off of this.unsubscribers) { try { off(); } catch { /* Continue detaching. */ } }
      throw error;
    }
  }

  /** Access native methods such as Steam.resetArea() or Vk.setWhiteList(). */
  get<K extends keyof M>(platform: K): M[K] {
    if (!Object.hasOwn(this.clients, platform)) throw new Error('Unknown social module');
    return this.clients[platform];
  }

  on(event: 'status', listener: ManagerListener): () => void {
    if (event !== 'status') throw new Error('Unknown event');
    if (this.disposed) throw new Error('SocialManager disposed');
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private emit(event: ManagerStatusEvent): void {
    if (this.disposed) return;
    const snapshot = Object.freeze({ ...event, details: event.details && Object.freeze({ ...event.details }) });
    for (const listener of [...this.listeners]) {
      try { void Promise.resolve(listener(snapshot)).catch(() => undefined); }
      catch { /* Observers do not affect execution. */ }
    }
  }

  private schedule<T extends InitResult | SocialTaskResult>(platform: keyof M, operation: string, fallback: T, work: (adapter: SocialAdapter<RuntimeModule>) => Promise<T>): Promise<T> {
    const job = (this.queues.get(platform) || Promise.resolve()).then(async () => {
      const adapter = this.adapters.get(platform);
      if (this.disposed) return fallback;
      const base = { operationId: crypto.randomUUID(), operation, platform: String(platform), origin: 'manager' as const };
      const emit = (phase: ManagerStatusEvent['phase'], code: string, level: ManagerStatusEvent['level'] = 'info') =>
        this.emit({ ...base, phase, code, level, timestamp: Date.now() });
      emit('start', 'OPERATION_STARTED');
      if (!adapter) { emit('failure', 'MODULE_NOT_REGISTERED', 'error'); return fallback; }
      try {
        const result = await work(adapter);
        if (this.disposed) return fallback;
        const success = result === 'skip' || isSuccessful(result);
        emit(result === 'skip' ? 'skipped' : success ? 'success' : 'failure', success ? 'OPERATION_COMPLETED' : 'OPERATION_FAILED', success ? 'info' : 'error');
        return result;
      } catch {
        emit('failure', 'MODULE_EXCEPTION', 'error');
        return fallback;
      }
    });
    this.queues.set(platform, job.catch(() => undefined));
    return job;
  }

  init<K extends keyof M>(platform: K, options?: InitOptions<M[K]>): Promise<InitResult> {
    return this.schedule<InitResult>(platform, 'social.init', false, (adapter) => adapter.init(options));
  }

  do<K extends keyof M>(platform: K, options: TaskOptions<M[K]>): Promise<SocialTaskResult> {
    // Copy caller-owned link arrays before entering the queue.
    const snapshot = options && typeof options === 'object'
      ? Object.fromEntries(Object.entries(options).map(([key, value]) => [key, Array.isArray(value) ? [...value] : value]))
      : options;
    return this.schedule<SocialTaskResult>(platform, 'social.do', false, (adapter) => adapter.do(snapshot));
  }

  undo<K extends keyof M>(platform: K, options: TaskOptions<M[K]>): Promise<SocialTaskResult> {
    // Copy caller-owned link arrays before entering the queue.
    const snapshot = options && typeof options === 'object'
      ? Object.fromEntries(Object.entries(options).map(([key, value]) => [key, Array.isArray(value) ? [...value] : value]))
      : options;
    return this.schedule<SocialTaskResult>(platform, 'social.undo', false, (adapter) => adapter.undo(snapshot));
  }

  async initAll(options: InitMap<M> = {}): Promise<BatchResult<{ [K in keyof M]: InitResult }>> {
    const results = {} as { [K in keyof M]: InitResult };
    let success = true;
    for (const key of Object.keys(this.clients) as (keyof M)[]) {
      const result = await this.init(key, options[key]);
      Object.defineProperty(results, key, { value: result, enumerable: true });
      success = success && result !== false;
    }
    return { success, results };
  }

  async doAll(options: TaskMap<M>): Promise<BatchResult<Partial<Record<keyof M, SocialTaskResult>>>> {
    const results: Partial<Record<keyof M, SocialTaskResult>> = {};
    let success = true;
    // Only explicitly requested modules execute; a failed module does not suppress the rest.
    for (const key of Object.keys(options) as (keyof M)[]) {
      const value = options[key];
      if (value === undefined) continue;
      const result = await this.do(key, value);
      Object.defineProperty(results, key, { value: result, enumerable: true });
      success = success && isSuccessful(result);
    }
    return { success, results };
  }

  async undoAll(options: TaskMap<M>): Promise<BatchResult<Partial<Record<keyof M, SocialTaskResult>>>> {
    const results: Partial<Record<keyof M, SocialTaskResult>> = {};
    let success = true;
    // Only explicitly requested modules execute; a failed module does not suppress the rest.
    for (const key of Object.keys(options) as (keyof M)[]) {
      const value = options[key];
      if (value === undefined) continue;
      const result = await this.undo(key, value);
      Object.defineProperty(results, key, { value: result, enumerable: true });
      success = success && isSuccessful(result);
    }
    return { success, results };
  }

  /** Detaches by default: passed-in clients remain owned by the caller. */
  dispose(options: { disposeModules?: boolean } = {}): void {
    if (this.disposed) return;
    this.disposed = true;
    for (const off of this.unsubscribers) { try { off(); } catch { /* Continue cleanup. */ } }
    if (options.disposeModules) {
      for (const adapter of this.adapters.values()) { try { adapter.dispose(); } catch { /* Continue cleanup. */ } }
    }
    this.listeners.clear();
    this.queues.clear();
  }
}
