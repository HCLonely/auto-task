/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 17:09:58
 * @LastEditTime : 2026-09-28 17:35:45
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/modules/social/twitch/context.ts
 * @Description  : Twitch 运行上下文与状态管理
 */

import { createGMStorage, getDefaultGM } from './adapters/gmStorage';
import { StatusEvents } from './events';
import type { Auth, HttpRequestOptions, StatusLevel, TwitchOptions, TwitchTasks } from './types';

/**
 * 管理 Twitch 模块的授权、存储、任务状态与操作上下文。
 */
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

  private code?: string;
  private skipped = false;

  /**
   * 创建 Context 实例并初始化所需状态。
   *
   * @remarks
   * 注入的请求、存储和授权依赖由当前实例持有。
   *
   * @param options - 本次操作的配置选项。
   * @throws Error - 触发 'Invalid authTimeoutMs' 错误条件时抛出。
   * @throws Error - 触发 'Invalid channelDelayMs' 错误条件时抛出。
   */
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

  /**
   * 在独立操作上下文中执行任务并发送状态事件。
   *
   * @typeParam T - 操作处理的数据或返回值类型。
   * @param operation - 操作名称或执行函数。
   * @param target - 当前操作的目标。
   * @param work - 在当前上下文中执行的工作函数。
   * @param success - 根据工作函数返回值判断操作是否成功的回调。
   * @returns Promise，完成后返回工作函数或存储读取产生的泛型结果。
   * @throws 执行过程中发生的异常会继续向调用方传播。
   */
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

  /**
   * 向监听器发送状态事件。
   *
   * @param phase - 操作所处阶段。
   * @param level - 日志级别。
   * @param code - 状态代码。
   * @param details - 状态事件的补充信息；可省略。
   */
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
  /**
   * 发送操作进度状态。
   *
   * @param code - 状态代码。
   * @param level - 日志级别；默认值为 `'info'`。
   * @param details - 状态事件的补充信息；可省略。
   */
  progress(code: string, level: StatusLevel = 'info', details?: Record<string, string | number | boolean>): void {
    if (level === 'error') {
      this.code = code;
    }
    this.emit('progress', level, code, details);
  }
  /**
   * 记录当前操作的跳过状态。
   *
   * @param code - 状态代码。
   */
  skip(code: string): void {
    this.skipped = true;
    this.code = code;
  }
  /**
   * 发送 HTTP 请求并处理传输状态。
   *
   * @param options - 本次操作的配置选项。
   * @returns Promise，完成后返回处理结果。
   * @throws Error - 触发 'Disposed' 错误条件时抛出。
   */
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
