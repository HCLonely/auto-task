/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 17:09:58
 * @LastEditTime : 2026-09-28 17:35:46
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/modules/social/steam/steamASF/context.ts
 * @Description  : Steam ASF 运行上下文与状态管理
 */

import { createGMStorage } from './adapters/gmStorage';
import { StatusEvents } from './events';
import type { ASFStatusEvent, HttpRequestOptions, SteamASFOptions } from './types';

/**
 * 封装任务操作错误及其状态代码。
 */
export class OperationError extends Error {
  /**
   * 创建 OperationError 实例并初始化所需状态。
   *
   * @param code - 状态代码。
   */
  constructor(readonly code: string) {
    super(code);
  }
}

/**
 * 管理 Steam 模块的授权、存储、任务状态与操作上下文。
 */
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

  /**
   * 创建 Context 实例并初始化所需状态。
   *
   * @remarks
   * 注入的请求、存储和授权依赖由当前实例持有。
   *
   * @param options - 本次操作的配置选项。
   * @throws Error - 触发 'Invalid ASF IPC URL' 错误条件时抛出。
   * @throws Error - 触发 'Invalid ASF bot name' 错误条件时抛出。
   */
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

  /**
   * 在独立操作上下文中执行任务并发送状态事件。
   *
   * @typeParam T - 操作处理的数据或返回值类型。
   * @param operation - 操作名称或执行函数。
   * @param target - 当前操作的目标。
   * @param fallback - 未取得有效数据时使用的默认值。
   * @param work - 在当前上下文中执行的工作函数。
   * @param isSuccess - 操作是否成功；可省略。
   * @returns Promise，完成后返回工作函数或存储读取产生的泛型结果。
   */
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

  /**
   * 向监听器发送状态事件。
   *
   * @param phase - 操作所处阶段。
   * @param level - 日志级别。
   * @param code - 状态代码。
   * @param details - 状态事件的补充信息；可省略。
   */
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

  /**
   * 发送操作进度状态。
   *
   * @param code - 状态代码。
   * @param details - 状态事件的补充信息；可省略。
   * @param level - 日志级别；默认值为 `'info'`。
   */
  progress(code: string, details?: Record<string, string | number | boolean>, level: ASFStatusEvent['level'] = 'info'): void {
    this.emit('progress', level, code, details);
  }

  /**
   * 发送 HTTP 请求并处理传输状态。
   *
   * @param options - 本次操作的配置选项。
   * @returns Promise，完成后返回处理结果。
   * @throws OperationError - 触发 'DISPOSED' 错误条件时抛出。
   * @throws OperationError - 触发 'TRANSPORT_FAILED' 错误条件时抛出。
   * @throws OperationError - 触发 'HTTP_FAILED' 错误条件时抛出。
   */
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

  /**
   * 发送 ASF 命令。
   *
   * @param command - 待发送的 ASF 命令。
   * @returns Promise，完成后返回处理后的字符串。
   * @throws OperationError - 触发 'ASF_COMMAND_FAILED' 错误条件时抛出。
   */
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
