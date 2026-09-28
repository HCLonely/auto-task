import { Context, SteamError } from './context';
import { loadState } from './storage';
import type { Executor, InitType, TaskType } from './types';

export async function initialize(ctx: Context, type: InitType): Promise<boolean> {
  return ctx.run('init', type, false, async (child) => {
    if (!['all', 'store', 'community'].includes(type)) {
      throw new SteamError('INVALID_INIT_TYPE');
    }
    await loadState(child);
    let any = false;
    for (const executor of child.executors) {
      try {
        const ok = await child.invoke(executor, () => {
          return executor.source === 'steamASF' ? executor.client.init() : executor.client.init(type);
        });
        if (ok) {
          if (executor.source === 'steamASF' || type === 'all') {
            executor.ready.add('store');
            executor.ready.add('community');
          } else {
            executor.ready.add(type);
          }
          any = true;
        } else {
          child.progress('EXECUTOR_INIT_FAILED', {
            executor: executor.source
          });
        }
      } catch {
        child.progress('EXECUTOR_INIT_FAILED', {
          executor: executor.source
        });
      }
    }
    return any;
  });
}

const community = new Set<TaskType>(['groups', 'officialGroups', 'forums', 'workshops', 'workshopVotes']);
const webOnly = new Set<TaskType>(['forums', 'workshops', 'workshopVotes', 'announcements']);
export function candidates(ctx: Context, type: TaskType): Executor[] {
  return ctx.executors.filter((executor) => {
    return executor.ready.has(community.has(type) ? 'community' : 'store') &&
    (!webOnly.has(type) || executor.source === 'steamWeb') && (type !== 'playTime' || executor.source === 'steamASF');
  });
}

export function dispatch(ctx: Context, type: TaskType, id: string, doTask: boolean): Promise<boolean> {
  return ctx.run(`${type}.${doTask ? 'do' : 'undo'}`, id, false, async (child) => {
    if (!doTask && child.state.whiteList[type].includes(id)) {
      child.skip('WHITELIST_SKIPPED');
      return true;
    }
    for (const executor of candidates(child, type)) {
      child.progress('EXECUTOR_ATTEMPT', {
        executor: executor.source
      });
      let ok = false;
      try {
        ok = await child.invoke(executor, () => {
          return perform(executor, type, id, doTask);
        });
      } catch {
        child.progress('EXECUTOR_ERROR', {
          executor: executor.source
        });
      }
      if (ok) {
        const values = child.state.tasks[type];
        child.state.tasks[type] = doTask ? [...new Set([...values, id])] : values.filter((value) => {
          return value !== id;
        });
        await child.storage.set('tasks', child.state.tasks);
        return true;
      }
      child.progress('EXECUTOR_FALLBACK', {
        executor: executor.source
      });
    }
    throw new SteamError('NO_EXECUTOR_SUCCEEDED');
  });
}

async function perform(executor: Executor, type: TaskType, id: string, doTask: boolean): Promise<boolean> {
  const client = executor.client;
  switch (type) {
      case 'groups': return doTask ? client.joinGroup(id) : client.leaveGroup(id);
      case 'officialGroups': return doTask ? client.joinOfficialGroup(id) : client.leaveOfficialGroup(id);
      case 'wishlists': return doTask ? client.addToWishlist(id) : client.removeFromWishlist(id);
      case 'follows': return client[doTask ? 'doFollowGame' : 'undoFollowGame'](id);
      case 'curators': return client[doTask ? 'doCurator' : 'undoCurator'](id);
      case 'licenses': return client.addLicense(id);
      case 'playtests': return client.requestPlayTestAccess(id);
      case 'forums': return executor.source === 'steamWeb' && executor.client[doTask ? 'doForum' : 'undoForum'](id);
      case 'workshops': return executor.source === 'steamWeb' && executor.client[doTask ? 'doFavoriteWorkshop' : 'undoFavoriteWorkshop'](id);
      case 'workshopVotes': return executor.source === 'steamWeb' && executor.client.voteUpWorkshop(id);
      case 'announcements': return executor.source === 'steamWeb' && executor.client.likeAnnouncement(id);
      default: return false;
  }
}

export async function resetRegion(ctx: Context): Promise<boolean> {
  let success = true;
  for (const executor of ctx.executors) {
    if (executor.source !== 'steamWeb' || !executor.ready.has('store')) {
      continue;
    }
    try {
      success = await ctx.invoke(executor, () => {
        return executor.client.resetArea();
      }) && success;
    } catch {
      success = false;
    }
  }
  if (!success) {
    ctx.progress('REGION_RESET_FAILED');
  }
  return success;
}
