import { Context, OperationError } from './context';

export const SUCCESS = ['成功', 'Success', 'Успех'];
export const JOINED = ['已加入', '已申请', 'Joined', 'Applied', 'Присоединился', 'costs'];
export const PLAYING = ['正在运行', '正在掛', 'Playing', 'Играет'];
export const RESUMED = ['已经恢复', '已恢复', '已經繼續', '已繼續', 'resumed', 'возобновлён'];

export function validIds(value: string): boolean { return /^\d+(?:,\d+)*$/.test(value); }
export function requireId(value: string): void { if (!/^\d+$/.test(value)) throw new OperationError('INVALID_ARGUMENT'); }
export function containsId(line: string, id: string): boolean {
  return (line.match(/\d+/g) || []).some((value) => value === id);
}

/** Keep the original localized reply vocabulary; never treat an explicitly negative reply as success. */
export function matchesReply(reply: string, words = SUCCESS): boolean {
  if (/(?:\b(?:failed|failure|unsuccessful|not\s+(?:successful|joined|applied|playing|resumed))\b|失败|失敗|неудач|ошибк)/i.test(reply)) return false;
  return words.some((word) => new RegExp(/[a-z]/i.test(word) ? `\\b${word}\\b` : word, 'i').test(reply));
}

export async function execute(ctx: Context, command: string, words = SUCCESS): Promise<boolean> {
  const reply = await ctx.command(command);
  if (!matchesReply(reply, words)) throw new OperationError('ASF_RESULT_REJECTED');
  return true;
}
