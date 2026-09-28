/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 17:09:58
 * @LastEditTime : 2026-09-28 17:38:07
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/modules/social/steam/steamASF/features/groups.ts
 * @Description  : Steam ASF 群组加入与退出
 */

import { invalidateGroups, loadGroups } from '../cache';
import { execute, JOINED } from '../commands';
import { Context, OperationError } from '../context';

/**
 * 校验群组目标。
 *
 * @param groupName - 群组名称。
 * @throws OperationError - 触发 'INVALID_ARGUMENT' 错误条件时抛出。
 */
function validateGroup(groupName: string): void {
  if (!groupName || /\s/.test(groupName)) {
    throw new OperationError('INVALID_ARGUMENT');
  }
}

/**
 * 加入指定群组。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @param groupName - 群组名称。
 * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
 */
export function joinGroup(ctx: Context, groupName: string): Promise<boolean> {
  return ctx.run('groups.join', groupName, false, async (child) => {
    validateGroup(groupName);
    await execute(child, `!JOINGROUP ${child.bot} ${groupName}`, JOINED);
    await invalidateGroups(child);
    return true;
  });
}

/**
 * 退出指定群组。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @param groupName - 群组名称。
 * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
 */
export function leaveGroup(ctx: Context, groupName: string): Promise<boolean> {
  return ctx.run('groups.leave', groupName, false, async (child) => {
    validateGroup(groupName);
    const groupId = await child.run<string>('groups.resolveId', groupName, '', async (lookup) => {
      let groups = await loadGroups(lookup);
      if (!groups[groupName]) {
        groups = await loadGroups(lookup, true);
      }
      if (!groups[groupName]) {
        throw new OperationError('GROUP_NOT_FOUND');
      }
      return groups[groupName];
    });
    if (!groupId) {
      throw new OperationError('GROUP_NOT_FOUND');
    }
    await execute(child, `!LEAVEGROUP ${child.bot} ${groupId}`);
    await invalidateGroups(child);
    return true;
  });
}
