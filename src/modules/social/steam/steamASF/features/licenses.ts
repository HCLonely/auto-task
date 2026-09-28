/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 17:09:58
 * @LastEditTime : 2026-09-28 17:38:07
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/modules/social/steam/steamASF/features/licenses.ts
 * @Description  : Steam ASF 游戏许可获取与添加
 */

import { containsId, matchesReply, validIds } from '../commands';
import { Context, OperationError } from '../context';

/**
 * 为账号添加游戏许可。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @param id - 目标标识。
 * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
 */
export function addLicense(ctx: Context, id: string): Promise<boolean> {
  return ctx.run('licenses.add', id, false, async (child) => {
    const match = /^(appid|subid)-(\d+(?:,\d+)*)$/.exec(id);
    if (!match || !validIds(match[2])) {
      throw new OperationError('INVALID_ARGUMENT');
    }
    const [, type, values] = match;
    const ids = [...new Set(values.split(','))];
    const prefix = type === 'appid' ? 'app' : 'sub';
    const reply = await child.command(`!addlicense ${child.bot} ${ids.map((value) => {
      return `${prefix}/${value}`;
    }).join(',')}`);
    const lines = reply.split('\n').filter((line) => {
      return line.trim();
    });
    const words = type === 'appid' ? ['AlreadyPurchased', 'OK'] : ['成功', 'Success', 'Успех', 'AlreadyPurchased', 'OK'];
    let allSucceeded = true;
    for (const value of ids) {
      const candidates = lines.filter((line) => {
        return containsId(line, value);
      });
      // Preserve the original single-app reply format, which may not echo the ID.
      if (!candidates.length && ids.length === 1 && type === 'appid') {
        candidates.push(...lines);
      }
      const ok = candidates.length > 0 && candidates.every((line) => {
        return matchesReply(line, words);
      });
      child.progress(ok ? 'LICENSE_ADDED' : 'LICENSE_FAILED', {
        id: value
      }, ok ? 'info' : 'error');
      allSucceeded &&= ok;
    }
    return allSucceeded;
  });
}
