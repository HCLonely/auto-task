import type { Context } from '../context';

export function unsupported(ctx: Context, name: string): Promise<boolean> {
  return ctx.run(name, undefined, false, async (child) => {
    child.progress('ASF_UNSUPPORTED', undefined, 'warning');
    return false;
  });
}
