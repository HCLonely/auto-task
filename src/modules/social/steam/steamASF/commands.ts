/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 17:09:58
 * @LastEditTime : 2026-09-28 17:38:07
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/modules/social/steam/steamASF/commands.ts
 * @Description  : Steam ASF 命令发送与响应校验
 */

import { Context, OperationError } from './context';

export const SUCCESS = ['成功', 'Success', 'Успех'];
export const JOINED = ['已加入', '已申请', 'Joined', 'Applied', 'Присоединился', 'costs'];
export const PLAYING = ['正在运行', '正在掛', 'Playing', 'Играет'];
export const RESUMED = ['已经恢复', '已恢复', '已經繼續', '已繼續', 'resumed', 'возобновлён'];

/**
 * 检查标识列表是否有效。
 *
 * @param value - 待处理的值。
 * @returns 检查结果；满足条件时为 true，否则为 false。
 */
export function validIds(value: string): boolean {
  return /^\d+(?:,\d+)*$/.test(value);
}
/**
 * 校验操作所需的目标标识。
 *
 * @param value - 待处理的值。
 * @throws OperationError - 触发 'INVALID_ARGUMENT' 错误条件时抛出。
 */
export function requireId(value: string): void {
  if (!/^\d+$/.test(value)) {
    throw new OperationError('INVALID_ARGUMENT');
  }
}
/**
 * 检查回复中是否包含指定标识。
 *
 * @param line - 当前文本行。
 * @param id - 目标标识。
 * @returns 检查结果；满足条件时为 true，否则为 false。
 */
export function containsId(line: string, id: string): boolean {
  return (line.match(/\d+/g) || []).some((value) => {
    return value === id;
  });
}

/**
 * 按已支持的本地化回复判断结果，明确的否定回复视为失败。
 *
 * @param reply - 服务端回复内容。
 * @param words - 词项列表；默认值为 `SUCCESS`。
 * @returns 检查结果；满足条件时为 true，否则为 false。
 */
export function matchesReply(reply: string, words = SUCCESS): boolean {
  if (/(?:\b(?:failed|failure|unsuccessful|not\s+(?:successful|joined|applied|playing|resumed))\b|失败|失敗|неудач|ошибк)/i.test(reply)) {
    return false;
  }
  return words.some((word) => {
    return new RegExp(/[a-z]/i.test(word) ? `\\b${word}\\b` : word, 'i').test(reply);
  });
}

/**
 * 发送 ASF 命令并按成功回复词校验结果。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @param command - 待发送的 ASF 命令。
 * @param words - 词项列表；默认值为 `SUCCESS`。
 * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
 * @throws OperationError - 触发 'ASF_RESULT_REJECTED' 错误条件时抛出。
 */
export async function execute(ctx: Context, command: string, words = SUCCESS): Promise<boolean> {
  const reply = await ctx.command(command);
  if (!matchesReply(reply, words)) {
    throw new OperationError('ASF_RESULT_REJECTED');
  }
  return true;
}
