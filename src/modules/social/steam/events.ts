/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 17:09:58
 * @LastEditTime : 2026-09-28 17:38:06
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/modules/social/steam/events.ts
 * @Description  : Steam 任务状态事件管理
 */

import type { SteamEvent, SteamListener } from './types';

/**
 * 管理 Steam 模块实例的状态事件订阅与分发。
 */
export class SteamEvents {
  private readonly listeners = new Set<SteamListener>();
  /**
   * 注册状态事件监听器。
   *
   * @param listener - 接收状态变化的监听函数。
   * @returns 用于移除当前监听器的清理函数。
   */
  on(listener: SteamListener): () => void {
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
  emit(event: SteamEvent): void {
    const value = Object.freeze({
      ...event,
      details: event.details && Object.freeze({
        ...event.details
      })
    });
    for (const listener of [...this.listeners]) {
      try {
        void Promise.resolve(listener(value)).catch(() => {
          return undefined;
        });
      } catch { /* Observers are isolated. */ }
    }
  }
  /**
   * 清除当前实例注册的全部状态监听器。
   */
  clear(): void {
    this.listeners.clear();
  }
}
