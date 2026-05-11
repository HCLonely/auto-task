/*
 * @Author       : HCLonely
 * @Date         : 2026-05-11 10:00:00
 * @LastEditTime : 2026-05-11 10:00:00
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/types/EventBus.d.ts
 * @Description  : 事件总线共享类型定义
 */

export type {
  TaskAction,
  EventTarget as TaskEventTarget,
  BaseEventPayload,
  RequestedPayload,
  CompletedPayload,
  EventMap,
} from '../scripts/events/eventTypes'
