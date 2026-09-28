/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 17:09:58
 * @LastEditTime : 2026-09-28 17:38:07
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/modules/social/vk/context.ts
 * @Description  : VK 运行上下文与状态管理
 */

import { createGMStorage } from './adapters/gmStorage';
import { StatusEvents } from './events';
import type { HttpRequestOptions, StatusLevel, VkOptions, VkTasks } from './types';

/**
 * 管理 VK 模块的授权、存储、任务状态与操作上下文。
 */
export class Context {
  readonly events = new StatusEvents();
  readonly storage: ReturnType<typeof createGMStorage>;
  readonly state = {
    initialized: false,
    disposed: false,
    token: '',
    userId: '',
    version: '',
    appId: '',
    tasks: {
      names: []
    } as VkTasks,
    whiteList: {
      names: []
    } as VkTasks,
    cache: Object.create(null) as Record<string, string>,
    writes: Promise.resolve(),
    init: undefined as Promise<boolean> | undefined
  };
  private operationId?: string;
  private parentOperationId?: string;
  private operation = '';
  private target?: string;
  private taskLink?: string;

  /**
   * 将原始任务 URL 限定到当前操作及其子操作。
   *
   * @param link - 任务目标链接。
   * @returns 共享账号状态且保留指定任务链接的子上下文。
   */
  forTaskLink(link: string): Context {
    const child = Object.assign(Object.create(Context.prototype) as Context, this);
    child.taskLink = link;
    return child;
  }

  private errorCode?: string;
  private skipped = false;

  /**
   * 创建 Context 实例并初始化所需状态。
   *
   * @remarks
   * 注入的请求、存储和授权依赖由当前实例持有。
   *
   * @param options - 本次操作的配置选项。
   * @throws Error - 触发 'Invalid intervalMs' 错误条件时抛出。
   */
  constructor(readonly options: VkOptions) {
    const interval = options.intervalMs ?? 1000;
    if (!Number.isFinite(interval) || interval < 0) {
      throw new Error('Invalid intervalMs');
    }
    this.storage = createGMStorage(options.gm, options.namespace || 'vk');
    this.state.version = options.apiVersion || '5.282';
    this.state.appId = options.appId || '6287487';
  }

  /**
   * 在独立操作上下文中执行任务并发送状态事件。
   *
   * @typeParam T - 操作处理的数据或返回值类型。
   * @param operation - 操作名称或执行函数。
   * @param target - 当前操作的目标。
   * @param fallback - 未取得有效数据时使用的默认值。
   * @param work - 在当前上下文中执行的工作函数。
   * @param success - 根据工作函数返回值判断操作是否成功的回调；默认值为 `(value) => { return value !== false; }`。
   * @returns Promise，完成后返回工作函数或存储读取产生的泛型结果。
   */
  async run<T>(operation: string, target: string | undefined, fallback: T, work: (ctx: Context) => Promise<T>, success: (value: T) => boolean = (value) => {
    return value !== false;
  }): Promise<T> {
    const child = Object.assign(Object.create(Context.prototype) as Context, this);
    child.operationId = crypto.randomUUID();
    child.parentOperationId = this.operationId;
    child.operation = operation;
    child.target = target;
    child.errorCode = undefined;
    child.skipped = false;
    child.emit('start', 'OPERATION_STARTED');
    let value: T;
    try {
      value = await work(child);
    } catch {
      child.progress('UNEXPECTED_ERROR', 'error');
      value = fallback;
    }
    const ok = success(value);
    child.emit(ok ? (child.skipped ? 'skipped' : 'success') : 'failure',
      ok ? (child.skipped ? 'OPERATION_SKIPPED' : 'OPERATION_COMPLETED') : (child.errorCode || 'OPERATION_FAILED'), ok ? 'info' : 'error');
    return value;
  }

  /**
   * 向监听器发送状态事件。
   *
   * @param phase - 操作所处阶段。
   * @param code - 状态代码。
   * @param level - 日志级别；默认值为 `'info'`。
   * @param details - 状态事件的补充信息；可省略。
   */
  private emit(phase: 'start' | 'progress' | 'success' | 'failure' | 'skipped', code: string, level: StatusLevel = 'info', details?: Record<string, string | number | boolean>): void {
    this.events.emit({
      operationId: this.operationId || '',
      parentOperationId: this.parentOperationId,
      operation: this.operation,
      target: this.target,
      phase,
      code,
      level,
      details: {
        ...details,
        ...(this.taskLink ? {
          taskLink: this.taskLink
        } : {})
      },
      timestamp: Date.now()
    });
  }
  /**
   * 发送操作进度状态。
   *
   * @param code - 状态代码。
   * @param level - 日志级别；默认值为 `'info'`。
   * @param details - 状态事件的补充信息；可省略。
   */
  progress(code: string, level: StatusLevel = 'info', details?: Record<string, string | number | boolean>): void {
    if (level === 'error') {
      this.errorCode = code;
    }
    this.emit('progress', code, level, details);
  }
  /**
   * 记录当前操作的跳过状态。
   *
   * @param code - 状态代码。
   * @returns true，表示当前步骤已接受或已跳过。
   */
  skip(code: string): true {
    this.skipped = true;
    this.progress(code);
    return true;
  }
  /**
   * 记录当前操作的失败状态。
   *
   * @param code - 状态代码。
   * @returns false，表示当前操作失败。
   */
  fail(code: string): false {
    this.progress(code, 'error');
    return false;
  }

  /**
   * 发送 HTTP 请求并处理传输状态。
   *
   * @param options - 本次操作的配置选项。
   * @returns Promise，完成后返回处理结果；未取得有效结果时返回 false。
   * @throws Error - 触发 'Disposed' 错误条件时抛出。
   */
  async request(options: HttpRequestOptions) {
    if (this.state.disposed) {
      throw new Error('Disposed');
    }
    this.progress('HTTP_REQUEST_STARTED', 'debug', {
      method: options.method || 'GET'
    });
    const response = await this.options.http(options);
    if (this.state.disposed) {
      throw new Error('Disposed');
    }
    this.progress('HTTP_REQUEST_COMPLETED', 'debug', {
      transportStatus: response.status,
      httpStatus: response.data?.status || 0
    });
    if (response.result !== 'Success' || response.data?.status !== 200) {
      this.fail('HTTP_REQUEST_FAILED');
      return false;
    }
    return response.data;
  }

  /**
   * 仅报告数字接口错误码，避免 VK 错误中的 request_params 泄露访问令牌。
   *
   * @param method - HTTP 请求方法。
   * @param values - 待处理的值列表。
   * @param host - 目标主机名；默认值为 `'web.api.vk.com'`。
   * @param name - 目标名称；默认值为 `''`。
   * @returns Promise，完成后返回处理结果。
   */
  async api(method: string, values: Record<string, string | number>, host = 'web.api.vk.com', name = ''): Promise<unknown | false> {
    if (!this.state.token) {
      return this.fail('AUTH_REQUIRED');
    }
    const data = await this.request({
      url: `https://${host}/method/${method}?v=${encodeURIComponent(this.state.version)}&client_id=${encodeURIComponent(this.state.appId)}`,
      method: 'POST',
      responseType: 'json',
      headers: {
        origin: 'https://vk.com',
        referer: `https://vk.com/${name}`,
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: new URLSearchParams(Object.entries({
        ...values,
        access_token: this.state.token
      }).map(([key, value]) => {
        return [key, String(value)];
      })).toString()
    });
    if (!data) {
      return false;
    }
    if (data.response?.error) {
      const code = data.response.error.error_code;
      this.progress('VK_API_ERROR', 'error', typeof code === 'number' ? {
        apiCode: code
      } : undefined);
      return false;
    }
    return data.response?.response ?? this.fail('INVALID_RESPONSE');
  }
  /**
   * 记录已处理的 VK 任务目标并避免重复记录。
   *
   * @param name - 目标名称。
   */
  record(name: string): void {
    if (!this.state.tasks.names.includes(name)) {
      this.state.tasks.names.push(name);
    }
  }
}
