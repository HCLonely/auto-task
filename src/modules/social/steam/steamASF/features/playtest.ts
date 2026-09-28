import { execute, requireId } from '../commands';
import type { Context } from '../context';

export function requestPlayTestAccess(ctx: Context, id: string): Promise<boolean> {
  return ctx.run('playtest.request', id, false, async (child) => {
    requireId(id);
    return execute(child, `!REQUESTACCESS ${child.bot} ${id}`);
  });
}
