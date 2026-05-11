/*
 * @Author       : HCLonely
 * @Date         : 2026-05-11 10:00:00
 * @LastEditTime : 2026-05-11 10:00:00
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/scripts/events/eventTypes.ts
 * @Description  : 事件总线类型定义
 */

export type TaskAction = 'do' | 'undo'

export type EventTarget = 'reddit' | 'twitch' | 'twitter' | 'vk' | 'youtube' | 'steamStore' | 'steamCommunity' | 'links'

export interface BaseEventPayload {
  runId: string
  timestamp: number
  source: 'website' | 'social' | 'link' | 'system'
}

export interface RequestedPayload extends BaseEventPayload {
  action: TaskAction
  target: EventTarget
  tasks: Record<string, Array<string>>
}

export interface CompletedPayload extends BaseEventPayload {
  target: EventTarget
  ok: boolean
  processedCount?: number
  error?: string
}

export interface EventMap {
  'task.classified': BaseEventPayload & { action: TaskAction }
  'social.init.requested': RequestedPayload
  'social.init.completed': CompletedPayload
  'social.toggle.requested': RequestedPayload
  'social.toggle.completed': CompletedPayload
  'task.links.requested': RequestedPayload
  'task.links.completed': CompletedPayload
  'task.batch.completed': BaseEventPayload & {
    ok: boolean
    successCount: number
    failedTargets: Array<EventTarget>
  }
}
