import { createGMStorage } from './adapters/gmStorage';
import { StatusEvents } from './events';
import type { ASFStatusEvent, HttpRequestOptions, SteamASFOptions } from './types';

export class OperationError extends Error {
  constructor(readonly code: string) {
    super(code);
  }
}

export class Context {
  readonly events = new StatusEvents();
  readonly storage: ReturnType<typeof createGMStorage>;
  readonly endpoint: string;
  readonly bot: string;
  readonly apiKey?: string;
  readonly state: {
    disposed: boolean;
    initialized: boolean;
    initializing?: Promise<boolean>;
    groups?: Record<string, string>;
    loadingGroups?: Promise<Record<string, string>>;
  } = {
      disposed: false,
      initialized: false
    };
  private readonly http;
  private readonly password: string;
  private operationId = '';
  private parentOperationId?: string;
  private operation = '';
  private target?: string;

  constructor(options: SteamASFOptions) {
    const url = new URL('/Api/Command/', options.AsfIpcUrl);
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) {
      throw new Error('Invalid ASF IPC URL');
    }
    this.endpoint = url.href;
    this.bot = options.AsfBotname || 'asf';
    if (/\s/.test(this.bot)) {
      throw new Error('Invalid ASF bot name');
    }
    this.apiKey = options.steamWebApiKey;
    this.password = options.AsfIpcPassword;
    this.http = options.http;
    // Endpoint and bot isolate persistent data without storing passwords or API keys.
    this.storage = createGMStorage(options.gm, `${options.namespace || 'steamASF'}:${encodeURIComponent(this.endpoint)}:${encodeURIComponent(this.bot)}`);
  }

  async run<T>(operation: string, target: string | undefined, fallback: T, work: (ctx: Context) => Promise<T>, isSuccess?: (value: T) => boolean): Promise<T> {
    const child = Object.assign(Object.create(Context.prototype) as Context, this);
    child.operationId = crypto.randomUUID();
    child.parentOperationId = this.operationId || undefined;
    child.operation = operation;
    child.target = target;
    child.emit('start', 'info', 'OPERATION_STARTED');
    try {
      if (child.state.disposed) {
        throw new OperationError('DISPOSED');
      }
      const value = await work(child);
      const ok = isSuccess ? isSuccess(value) : value !== false && value !== '';
      child.emit(value === 'skip' ? 'skipped' : (ok ? 'success' : 'failure'), ok ? 'info' : 'error',
        value === 'skip' ? 'OPERATION_SKIPPED' : (ok ? 'OPERATION_COMPLETED' : 'OPERATION_FAILED'));
      return value;
    } catch (error) {
      child.emit('failure', 'error', error instanceof OperationError ? error.code : 'UNEXPECTED_ERROR');
      return fallback;
    }
  }

  private emit(phase: ASFStatusEvent['phase'], level: ASFStatusEvent['level'], code: string, details?: Record<string, string | number | boolean>): void {
    this.events.emit({
      operationId: this.operationId,
      parentOperationId: this.parentOperationId,
      operation: this.operation,
      target: this.target,
      phase,
      level,
      code,
      timestamp: Date.now(),
      details
    });
  }

  progress(code: string, details?: Record<string, string | number | boolean>, level: ASFStatusEvent['level'] = 'info'): void {
    this.emit('progress', level, code, details);
  }

  async request(options: HttpRequestOptions) {
    if (this.state.disposed) {
      throw new OperationError('DISPOSED');
    }
    this.progress('HTTP_REQUEST_STARTED', {
      method: options.method || 'GET'
    }, 'debug');
    const response = await this.http(options);
    if (this.state.disposed) {
      throw new OperationError('DISPOSED');
    }
    this.progress('HTTP_REQUEST_COMPLETED', {
      transportStatus: response.status,
      httpStatus: response.data?.status || 0
    }, 'debug');
    if (response.result !== 'Success') {
      throw new OperationError('TRANSPORT_FAILED');
    }
    if (response.data?.status !== 200) {
      throw new OperationError('HTTP_FAILED');
    }
    return response.data;
  }

  async command(command: string): Promise<string> {
    const data = await this.request({
      url: this.endpoint,
      method: 'POST',
      responseType: 'json',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        Authentication: this.password
      },
      data: JSON.stringify({
        Command: command
      })
    });
    const body = data.response;
    if (body?.Success !== true || body.Message !== 'OK' || typeof body.Result !== 'string' || !body.Result.trim()) {
      throw new OperationError('ASF_COMMAND_FAILED');
    }
    return body.Result;
  }
}
