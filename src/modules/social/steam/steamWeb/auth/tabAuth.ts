import { requestTabAuth } from '../adapters/gmTabAuth';
import type { Context } from '../context';

export function updateStoreAuthTab(ctx: Context): Promise<boolean> {
  return ctx.run('auth.store.tab', undefined, async (child) => {
    try {
      return await requestTabAuth(child, 'store');
    } catch {
      child.reportError();
      return false;
    }
  });
}

export function updateCommunityAuthTab(ctx: Context): Promise<boolean> {
  return ctx.run('auth.community.tab', undefined, async (child) => {
    try {
      return await requestTabAuth(child, 'community');
    } catch {
      child.reportError();
      return false;
    }
  });
}
