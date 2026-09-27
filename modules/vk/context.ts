import { createGMStorage } from './adapters/gmStorage';
import { StatusEvents } from './events';
import type { HttpRequestOptions, StatusLevel, VkOptions, VkTasks } from './types';

export class Context {
  readonly events = new StatusEvents();
  readonly storage: ReturnType<typeof createGMStorage>;
  readonly state = {
    initialized: false, disposed: false, token: '', userId: '', version: '', appId: '',
    tasks: { names: [] } as VkTasks, whiteList: { names: [] } as VkTasks,
    cache: Object.create(null) as Record<string, string>,
    writes: Promise.resolve(), init: undefined as Promise<boolean> | undefined
  };
  private operationId?: string;
  private parentOperationId?: string;
  private operation = '';
  private target?: string;
  private errorCode?: string;
  private skipped = false;

  constructor(readonly options: VkOptions) {
    const interval = options.intervalMs ?? 1000;
    if (!Number.isFinite(interval) || interval < 0) throw new Error('Invalid intervalMs');
    this.storage = createGMStorage(options.gm, options.namespace || 'vk');
    this.state.version = options.apiVersion || '5.282';
    this.state.appId = options.appId || '6287487';
  }

  async run<T>(operation: string, target: string | undefined, fallback: T, work: (ctx: Context) => Promise<T>, success: (value: T) => boolean = (value) => value !== false): Promise<T> {
    const child = Object.assign(Object.create(Context.prototype) as Context, this);
    child.operationId = crypto.randomUUID();
    child.parentOperationId = this.operationId;
    child.operation = operation;
    child.target = target;
    child.errorCode = undefined;
    child.skipped = false;
    child.emit('start', 'OPERATION_STARTED');
    let value: T;
    try { value = await work(child); }
    catch { child.progress('UNEXPECTED_ERROR', 'error'); value = fallback; }
    const ok = success(value);
    child.emit(ok ? child.skipped ? 'skipped' : 'success' : 'failure',
      ok ? child.skipped ? 'OPERATION_SKIPPED' : 'OPERATION_COMPLETED' : child.errorCode || 'OPERATION_FAILED', ok ? 'info' : 'error');
    return value;
  }

  private emit(phase: 'start' | 'progress' | 'success' | 'failure' | 'skipped', code: string, level: StatusLevel = 'info', details?: Record<string, string | number | boolean>): void {
    this.events.emit({ operationId: this.operationId || '', parentOperationId: this.parentOperationId,
      operation: this.operation, target: this.target, phase, code, level, details, timestamp: Date.now() });
  }
  progress(code: string, level: StatusLevel = 'info', details?: Record<string, string | number | boolean>): void {
    if (level === 'error') this.errorCode = code;
    this.emit('progress', code, level, details);
  }
  skip(code: string): true { this.skipped = true; this.progress(code); return true; }
  fail(code: string): false { this.progress(code, 'error'); return false; }

  async request(options: HttpRequestOptions) {
    if (this.state.disposed) throw new Error('Disposed');
    this.progress('HTTP_REQUEST_STARTED', 'debug', { method: options.method || 'GET' });
    const response = await this.options.http(options);
    if (this.state.disposed) throw new Error('Disposed');
    this.progress('HTTP_REQUEST_COMPLETED', 'debug', { transportStatus: response.status, httpStatus: response.data?.status || 0 });
    if (response.result !== 'Success' || response.data?.status !== 200) {
      this.fail('HTTP_REQUEST_FAILED');
      return false;
    }
    return response.data;
  }

  /** Emit only the numeric API code; VK errors may echo access tokens in request_params. */
  async api(method: string, values: Record<string, string | number>, host = 'web.api.vk.com', name = ''): Promise<unknown | false> {
    if (!this.state.token) return this.fail('AUTH_REQUIRED');
    const data = await this.request({
      url: `https://${host}/method/${method}?v=${encodeURIComponent(this.state.version)}&client_id=${encodeURIComponent(this.state.appId)}`,
      method: 'POST', responseType: 'json',
      headers: { origin: 'https://vk.com', referer: `https://vk.com/${name}`, 'content-type': 'application/x-www-form-urlencoded' },
      data: new URLSearchParams(Object.entries({ ...values, access_token: this.state.token }).map(([key, value]) => [key, String(value)])).toString()
    });
    if (!data) return false;
    if (data.response?.error) {
      const code = data.response.error.error_code;
      this.progress('VK_API_ERROR', 'error', typeof code === 'number' ? { apiCode: code } : undefined);
      return false;
    }
    return data.response?.response ?? this.fail('INVALID_RESPONSE');
  }
  record(name: string): void {
    if (!this.state.tasks.names.includes(name)) this.state.tasks.names.push(name);
  }
}
