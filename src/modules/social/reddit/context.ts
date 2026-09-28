/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 17:09:58
 * @LastEditTime : 2026-09-28 17:38:06
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/modules/social/reddit/context.ts
 * @Description  : Reddit 运行上下文与状态管理
 */

import { createGMStorage, getDefaultGM } from './adapters/gmStorage';
import { getDefaultCookieReader } from './adapters/gmCookie';
import { StatusEvents } from './events';
import type { CookieReader, HttpClient, RedditOptions, RedditStatusEvent, RedditTasks } from './types';

/**
 * 管理 Reddit 模块的授权、存储、任务状态与操作上下文。
 */
export class Context {
  readonly state = {
    csrfToken: '',
    initialized: false,
    disposed: false,
    tasks: {
      reddits: []
    } as RedditTasks,
    whiteList: {
      reddits: []
    } as RedditTasks
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

  private failureCode?: string;
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
  constructor(options: RedditOptions) {
    this.http = options.http;
    this.storage = createGMStorage(options.gm || getDefaultGM(), options.namespace || 'reddit');
    this.cookies = options.cookies || getDefaultCookieReader(options.cookieTimeoutMs);
    this.intervalMs = options.intervalMs ?? 1000;
    if (!Number.isFinite(this.intervalMs) || this.intervalMs < 0) {
      throw new Error('Invalid intervalMs');
    }
    this.doTaskEnabled = options.doTaskEnabled ?? true;
    this.undoTaskEnabled = options.undoTaskEnabled ?? true;
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
      child.emit(ok ? (child.skipped ? 'skipped' : 'success') : 'failure',
        ok ? (child.skipped ? 'OPERATION_SKIPPED' : 'OPERATION_COMPLETED') : (child.failureCode || 'OPERATION_FAILED'));
      return result;
    } catch (error) {
      child.emit('failure', child.failureCode || 'UNEXPECTED_ERROR');
      throw error;
    }
  }

  /**
   * 向监听器发送状态事件。
   *
   * @param phase - 操作所处阶段。
   * @param code - 状态代码。
   * @param details - 状态事件的补充信息；可省略。
   */
  private emit(phase: RedditStatusEvent['phase'], code: string, details?: RedditStatusEvent['details']): void {
    this.events.emit({
      operationId: this.operationId,
      parentOperationId: this.parentOperationId,
      operation: this.operation,
      target: this.target,
      phase,
      code,
      timestamp: Date.now(),
      level: (phase === 'failure' || code === this.failureCode) ? 'error' : (code.startsWith('HTTP_') ? 'debug' : 'info'),
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
   * @param details - 状态事件的补充信息；可省略。
   */
  progress(code: string, details?: RedditStatusEvent['details']): void {
    this.emit('progress', code, details);
  }
  /**
   * 记录当前操作的失败状态。
   *
   * @param code - 状态代码。
   * @returns false，表示当前操作失败。
   */
  fail(code: string): false {
    this.failureCode = code;
    this.progress(code);
    return false;
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
   * 发送 HTTP 请求并处理传输状态。
   *
   * @param options - 本次操作的配置选项。
   * @returns Promise，完成后返回处理结果。
   * @throws Error - 触发 'DISPOSED' 错误条件时抛出。
   */
  async request(options: Parameters<HttpClient>[0]): ReturnType<HttpClient> {
    if (this.state.disposed) {
      throw new Error('DISPOSED');
    }
    this.progress('HTTP_REQUEST_STARTED', {
      method: options.method || 'GET'
    });
    const result = await this.http(options);
    if (this.state.disposed) {
      throw new Error('DISPOSED');
    }
    this.progress('HTTP_REQUEST_COMPLETED', {
      transportStatus: result.status,
      httpStatus: result.data?.status || 0
    });
    return result;
  }

  /**
   * 等待配置的任务间隔。
   *
   * @returns 在操作完成后兑现的 Promise。
   */
  async delay(): Promise<void> {
    if (this.state.disposed || this.intervalMs === 0) {
      return;
    }
    await new Promise<void>((resolve) => {
      /**
       * 结束当前等待并清理相关资源。
       */
      const done = () => {
        clearTimeout(timer);
        this.cancellations.delete(done);
        resolve();
      };
      const timer = setTimeout(done, this.intervalMs);
      this.cancellations.add(done);
    });
  }
}
