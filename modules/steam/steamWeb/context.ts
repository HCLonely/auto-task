import { createGMStorage, getDefaultGM } from './adapters/gmStorage';
import { StatusEvents } from './events';
import type { Auth, GMAuthAPI, HttpClient, StatusLevel, SteamCache, SteamWebOptions, StepStatus } from './types';

export interface State {
  auth: Auth;
  cache: SteamCache;
  cacheLoaded: boolean;
  cacheLoading?: Promise<void>;
  cacheWrites: Promise<void>;
  storeInitialized: boolean;
  communityInitialized: boolean;
  storeInit?: Promise<boolean>;
  communityInit?: Promise<boolean>;
  area: string;
  oldArea?: string;
  regionQueue: Promise<unknown>;
  disposed: boolean;
  cleanups: Set<() => void>;
}

/** A child context changes only the operation identity; account state remains instance-local. */
export class Context {
  readonly events: StatusEvents;
  readonly gm: GMAuthAPI;
  readonly storage: ReturnType<typeof createGMStorage>;
  readonly state: State;
  readonly namespace: string;
  readonly authTimeoutMs: number;
  readonly autoChangeRegion: boolean;
  private readonly transport: HttpClient;
  private operationId = '';
  private parentOperationId?: string;
  private operation = '';
  private target?: string;
  private lastError?: string;

  constructor(options: SteamWebOptions) {
    this.transport = options.http;
    this.gm = options.gm || getDefaultGM();
    this.namespace = options.namespace || 'steamWeb';
    this.authTimeoutMs = options.authTimeoutMs ?? 120000;
    if (!Number.isFinite(this.authTimeoutMs) || this.authTimeoutMs <= 0) throw new Error('Invalid authTimeoutMs');
    this.autoChangeRegion = options.autoChangeRegion ?? true;
    this.storage = createGMStorage(this.gm, this.namespace);
    this.events = new StatusEvents();
    this.state = {
      auth: {}, cache: { group: {}, officialGroup: {}, forum: {}, workshop: {}, curator: {} },
      cacheLoaded: false, cacheWrites: Promise.resolve(), storeInitialized: false,
      communityInitialized: false, area: 'CN', regionQueue: Promise.resolve(),
      disposed: false, cleanups: new Set()
    };
  }

  async run<T>(operation: string, target: string | undefined, work: (ctx: Context) => Promise<T>, successful?: (value: T) => boolean): Promise<T> {
    const child = Object.assign(Object.create(Context.prototype) as Context, this);
    child.operationId = crypto.randomUUID();
    child.parentOperationId = this.operationId || undefined;
    child.operation = operation;
    child.target = target;
    child.lastError = undefined;
    child.emit('start', 'info', 'OPERATION_STARTED');
    try {
      const value = await work(child);
      const ok = successful ? successful(value) : value !== false && value !== undefined && value !== null &&
        !(typeof value === 'object' && value !== null && !Array.isArray(value) && Object.keys(value).length === 0) && value !== 'areaLocked';
      child.emit(value === 'skip' ? 'skipped' : ok ? 'success' : 'failure', ok ? 'info' : 'error',
        ok ? 'OPERATION_COMPLETED' : child.lastError || 'OPERATION_FAILED');
      return value;
    } catch (error) {
      child.emit('failure', 'error', child.lastError || 'UNEXPECTED_ERROR');
      throw error;
    }
  }

  private emit(phase: 'start' | 'progress' | 'success' | 'failure' | 'skipped', level: StatusLevel, code: string,
    details?: Record<string, string | number | boolean>): void {
    this.events.emit({
      operationId: this.operationId, parentOperationId: this.parentOperationId,
      operation: this.operation, phase, level, code, target: this.target, timestamp: Date.now(), details
    });
  }

  progress(code: string, level: StatusLevel = 'info', details?: Record<string, string | number | boolean>): void {
    if (level === 'error') this.lastError = code;
    this.emit('progress', level, code, details);
  }

  reportError(): void { this.progress('UNEXPECTED_ERROR', 'error'); }

  /** Step updates never emit terminal operation events. */
  step(code: string, target?: string): StepStatus {
    this.progress(code, 'info', target ? { target } : undefined);
    const update = (level: StatusLevel, fallback: string) => (reason = fallback): StepStatus => {
      this.progress(reason, level, target ? { target } : undefined);
      return status;
    };
    const status: StepStatus = {
      success: update('info', 'STEP_COMPLETED'), error: update('error', 'STEP_FAILED'),
      warning: update('warning', 'STEP_WARNING'), remove: () => this.progress('STEP_COMPLETED', 'debug')
    };
    return status;
  }

  async request(options: Parameters<HttpClient>[0]): ReturnType<HttpClient> {
    if (this.state.disposed) throw new Error('SteamWeb disposed');
    this.progress('HTTP_REQUEST_STARTED', 'debug', { method: options.method || 'GET' });
    const result = await this.transport(options);
    if (this.state.disposed) throw new Error('SteamWeb disposed');
    this.progress('HTTP_REQUEST_COMPLETED', result.result === 'Success' ? 'debug' : 'warning', {
      transportStatus: result.status, httpStatus: result.data?.status || 0
    });
    return result;
  }
}
