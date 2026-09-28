import type { Context } from '../context';

export function initialize(ctx: Context): Promise<boolean> {
  if (ctx.state.initializing) {
    return ctx.state.initializing;
  }
  const work = ctx.run('init', undefined, false, async (child) => {
    if (child.state.initialized) {
      return true;
    }
    await child.command('!stats');
    child.state.initialized = true;
    return true;
  });
  ctx.state.initializing = work.finally(() => {
    ctx.state.initializing = undefined;
  });
  return ctx.state.initializing;
}
