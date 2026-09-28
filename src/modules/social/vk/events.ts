/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 17:09:58
 * @LastEditTime : 2026-09-28 17:38:07
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/modules/social/vk/events.ts
 * @Description  : VK 任务状态事件管理
 */

import type { StatusListener, VkStatusEvent } from './types';

/**
 * 监听器属于当前实例；监听器异常不会改变操作结果。
 */
export class StatusEvents {
  private readonly listeners = new Set<StatusListener>();

  /**
   * 注册状态事件监听器。
   *
   * @param listener - 接收状态变化的监听函数。
   * @returns 用于移除当前监听器的清理函数。
   */
  on(listener: StatusListener): () => void {
    this.listeners.add(listener);
    return () => {
      return this.listeners.delete(listener);
    };
  }

  /**
   * 向监听器发送状态事件。
   *
   * @param event - 事件名称或事件对象。
   */
  emit(event: VkStatusEvent): void {
    const snapshot = Object.freeze({
      ...event,
      details: event.details && Object.freeze({
        ...event.details
      })
    });
    for (const listener of [...this.listeners]) {
      try {
        void Promise.resolve(listener(snapshot)).catch(() => {
          return undefined;
        });
      } catch { /* A synchronous observer failure must not interrupt VK requests. */ }
    }
  }

  /**
   * 清除当前实例注册的全部状态监听器。
   */
  clear(): void {
    this.listeners.clear();
  }
}
