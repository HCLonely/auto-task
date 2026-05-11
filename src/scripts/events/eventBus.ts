/*
 * @Author       : HCLonely
 * @Date         : 2026-05-11 10:00:00
 * @LastEditTime : 2026-05-11 10:00:00
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/scripts/events/eventBus.ts
 * @Description  : 事件总线核心
 */

import type { EventMap } from './eventTypes'

export type EventHandler<K extends keyof EventMap> = (payload: EventMap[K]) => void | Promise<void>

type ListenerMap = {
  [K in keyof EventMap]?: Set<EventHandler<K>>
}

class EventBus {
  private readonly listeners: ListenerMap = {}

  on<K extends keyof EventMap>(event: K, handler: EventHandler<K>): void {
    const set = this.listeners[event] as Set<EventHandler<K>> | undefined
    if (set) {
      set.add(handler)
      return
    }
    this.listeners[event] = new Set<EventHandler<K>>([handler]) as ListenerMap[K]
  }

  off<K extends keyof EventMap>(event: K, handler: EventHandler<K>): void {
    const set = this.listeners[event] as Set<EventHandler<K>> | undefined
    if (!set) return
    set.delete(handler)
    if (set.size === 0) {
      delete this.listeners[event]
    }
  }

  once<K extends keyof EventMap>(event: K, handler: EventHandler<K>): void {
    const wrapper: EventHandler<K> = async (payload) => {
      this.off(event, wrapper)
      await handler(payload)
    }
    this.on(event, wrapper)
  }

  async emit<K extends keyof EventMap>(event: K, payload: EventMap[K]): Promise<void> {
    const set = this.listeners[event] as Set<EventHandler<K>> | undefined
    if (!set || set.size === 0) return
    await Promise.allSettled(Array.from(set, (handler) => handler(payload)))
  }
}

export default EventBus
