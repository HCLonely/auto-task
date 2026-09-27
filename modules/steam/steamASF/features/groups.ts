import { invalidateGroups, loadGroups } from '../cache';
import { execute, JOINED } from '../commands';
import { Context, OperationError } from '../context';

function validateGroup(groupName: string): void {
  if (!groupName || /\s/.test(groupName)) throw new OperationError('INVALID_ARGUMENT');
}

export function joinGroup(ctx: Context, groupName: string): Promise<boolean> {
  return ctx.run('groups.join', groupName, false, async (child) => {
    validateGroup(groupName);
    await execute(child, `!JOINGROUP ${child.bot} ${groupName}`, JOINED);
    await invalidateGroups(child);
    return true;
  });
}

export function leaveGroup(ctx: Context, groupName: string): Promise<boolean> {
  return ctx.run('groups.leave', groupName, false, async (child) => {
    validateGroup(groupName);
    const groupId = await child.run<string>('groups.resolveId', groupName, '', async (lookup) => {
      let groups = await loadGroups(lookup);
      if (!groups[groupName]) groups = await loadGroups(lookup, true);
      if (!groups[groupName]) throw new OperationError('GROUP_NOT_FOUND');
      return groups[groupName];
    });
    if (!groupId) throw new OperationError('GROUP_NOT_FOUND');
    await execute(child, `!LEAVEGROUP ${child.bot} ${groupId}`);
    await invalidateGroups(child);
    return true;
  });
}
