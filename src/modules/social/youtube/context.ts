/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 17:09:58
 * @LastEditTime : 2026-09-28 17:38:07
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/modules/social/youtube/context.ts
 * @Description  : YouTube 运行上下文与状态管理
 */

import { defaultCookieReader } from './adapters/gmCookies';
import { createGMStorage, getDefaultGM } from './adapters/gmStorage';
import { sha1 } from './auth/signature';
import { StatusEvents } from './events';
import type { HttpRequestOptions, YoutubeOptions, YoutubeStatusEvent, YoutubeTasks } from './types';

/**
 * 读取或更新当前任务集合。
 *
 * @param value - 待处理的值；可省略。
 * @returns YouTube 任务集合。
 */
export function tasks(value?: Partial<YoutubeTasks>): YoutubeTasks {
  /**
   * 筛选字符串数组项并去除重复值。
   *
   * @param items - 待处理的集合；可省略。
   * @returns 处理后的字符串列表。
   */
  const strings = (items?: unknown) => {
    return Array.isArray(items) ? [...new Set(items.filter((item): item is string => {
      return typeof item === 'string';
    }))] : [];
  };
  return {
    channels: strings(value?.channels),
    likes: strings(value?.likes)
  };
}

/**
 * 管理 YouTube 模块的授权、存储、任务状态与操作上下文。
 */
export class Context {
  readonly events = new StatusEvents();
  readonly storage;
  readonly cookies;
  readonly hash;
  readonly options;
  readonly state = {
    auth: '',
    initialized: false,
    disposed: false,
    tasks: tasks(),
    whiteList: tasks(),
    whiteListOverride: undefined as YoutubeTasks | undefined,
    init: undefined as Promise<boolean> | undefined,
    cleanups: new Set<() => void>()
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

  private failure?: string;
  private skipped?: string;

  /**
   * 创建 Context 实例并初始化所需状态。
   *
   * @remarks
   * 注入的请求、存储和授权依赖由当前实例持有。
   *
   * @param options - 本次操作的配置选项。
   * @throws Error - 触发 'Invalid taskDelayMs' 错误条件时抛出。
   */
  constructor(options: YoutubeOptions) {
    const taskDelayMs = options.taskDelayMs ?? 1000;
    if (!Number.isFinite(taskDelayMs) || taskDelayMs < 0) {
      throw new Error('Invalid taskDelayMs');
    }
    this.options = {
      ...options,
      taskDelayMs,
      verifyChannel: options.verifyChannel ?? 'UCrXUsMBcfTVqwAS7DKg9C0Q',
      doTask: {
        channels: true,
        likes: true,
        ...options.doTask
      },
      undoTask: {
        channels: true,
        likes: true,
        ...options.undoTask
      }
    };
    this.storage = createGMStorage(options.gm || getDefaultGM(), options.namespace);
    this.cookies = options.cookies || defaultCookieReader(options.cookieTimeoutMs ?? 30000);
    this.hash = options.sha1 || sha1;
    if (options.whiteList) {
      this.state.whiteListOverride = tasks(options.whiteList);
    }
    this.state.whiteList = tasks(options.whiteList);
  }

  /**
   * 在独立操作上下文中执行任务并发送状态事件。
   *
   * @typeParam T - 操作处理的数据或返回值类型。
   * @param operation - 操作名称或执行函数。
   * @param target - 当前操作的目标。
   * @param fallback - 未取得有效数据时使用的默认值。
   * @param work - 在当前上下文中执行的工作函数。
   * @param success - 根据工作函数返回值判断操作是否成功的回调；默认值为 `(value) => { return value === true; }`。
   * @returns Promise，完成后返回工作函数或存储读取产生的泛型结果。
   */
  async run<T>(operation: string, target: string | undefined, fallback: T, work: (ctx: Context) => Promise<T>, success: (value: T) => boolean = (value) => {
    return value === true;
  }): Promise<T> {
    const child = Object.assign(Object.create(Context.prototype) as Context, this);
    child.operationId = crypto.randomUUID();
    child.parentOperationId = this.operationId || undefined;
    child.operation = operation;
    child.target = target;
    child.failure = undefined;
    child.skipped = undefined;
    child.emit('start', 'info', 'OPERATION_STARTED');
    try {
      if (this.state.disposed) {
        child.fail('DISPOSED');
        throw new Error('Disposed');
      }
      const value = await work(child);
      const ok = success(value);
      child.emit(ok ? (child.skipped ? 'skipped' : 'success') : 'failure', ok ? 'info' : 'error',
        ok ? (child.skipped || 'OPERATION_COMPLETED') : (child.failure || 'OPERATION_FAILED'));
      return value;
    } catch {
      child.emit('failure', 'error', child.failure || 'UNEXPECTED_ERROR');
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
  private emit(phase: YoutubeStatusEvent['phase'], level: YoutubeStatusEvent['level'], code: string, details?: Record<string, string | number | boolean>): void {
    this.events.emit({
      operationId: this.operationId,
      parentOperationId: this.parentOperationId,
      operation: this.operation,
      target: this.target,
      phase,
      level,
      code,
      timestamp: Date.now(),
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
  progress(code: string, details?: Record<string, string | number | boolean>): void {
    this.emit('progress', 'info', code, details);
  }
  /**
   * 记录当前操作的失败状态。
   *
   * @param code - 状态代码。
   * @returns false，表示当前操作失败。
   */
  fail(code: string): false {
    this.failure = code;
    this.emit('progress', 'error', code);
    return false;
  }
  /**
   * 记录当前操作的跳过状态。
   *
   * @param code - 状态代码。
   * @returns true，表示当前步骤已接受或已跳过。
   */
  skip(code: string): true {
    this.skipped = code;
    return true;
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
    this.emit('progress', 'debug', 'HTTP_REQUEST_STARTED', {
      method: options.method || 'GET'
    });
    const result = await this.options.http(options);
    if (this.state.disposed) {
      throw new Error('Disposed');
    }
    this.emit('progress', 'debug', 'HTTP_REQUEST_COMPLETED', {
      transportStatus: result.status,
      httpStatus: result.data?.status || 0
    });
    return result;
  }
  /**
   * 等待配置的任务间隔。
   *
   * @param ms - 等待时长，单位为毫秒。
   * @returns 在操作完成后兑现的 Promise。
   */
  async delay(ms: number): Promise<void> {
    if (!ms || this.state.disposed) {
      return;
    }
    await new Promise<void>((resolve) => {
      /**
       * 完成当前操作并交付结果。
       */
      const finish = () => {
        clearTimeout(timer);
        this.state.cleanups.delete(finish);
        resolve();
      };
      const timer = setTimeout(finish, ms);
      this.state.cleanups.add(finish);
    });
  }
}
