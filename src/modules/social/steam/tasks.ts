import { Context, SteamError } from './context';
import { dispatch, resetRegion } from './executors';
import { linkTasks, parseLink } from './links';
import { getCuratorId } from './lookups';
import { playGames, stopPlayGames } from './playTime';
import { loadState } from './storage';
import type { LinkType, SteamTaskDetailResult, SteamTaskOptions, SteamTaskResult, TaskType } from './types';

function setResult(result: SteamTaskDetailResult, type: LinkType, link: string, success: boolean): void {
  result.results[type] ||= {};
  // Keep ordinary result objects without allowing special input keys to change their prototype.
  Object.defineProperty(result.results[type], link, {
    value: success,
    enumerable: true,
    configurable: true,
    writable: true
  });
  result.success &&= success;
}
const irreversible = new Set<TaskType>(['workshopVotes', 'announcements', 'licenses', 'playtests']);

function executeTasks(ctx: Context, options: SteamTaskOptions, action: 'do' | 'undo'): Promise<SteamTaskResult> {
  const doTask = action === 'do';
  return ctx.run<SteamTaskResult>(action, undefined, false, async (child) => {
    await loadState(child);
    const result: SteamTaskDetailResult = {
      success: true,
      results: {}
    };
    if (linkTasks.some(([key]) => {
      return options[key]?.length;
    }) && !child.executors.some((executor) => {
      return executor.ready.size;
    })) {
      throw new SteamError('NEED_INIT');
    }
    try {
      for (const [key, type] of linkTasks) {
        const links = [...new Set(options[key] || [])];
        const flag = type === 'curatorLikes' ? 'curators' : type;
        const enabled = (doTask ? child.options.doTask[flag] : child.options.undoTask[flag]) && (doTask || !irreversible.has(type));
        if (!enabled) {
          for (const link of links) {
            await child.run('task.skip', link, true, async (step) => {
              step.skip('TASK_DISABLED');
              return true;
            }, undefined, {
              taskType: type,
              action
            });
            setResult(result, key, link, true);
          }
          continue;
        }
        if (type === 'playTime') {
          const valid: Array<{ link: string; id: string; minutes: number }> = [];
          for (const link of links) {
            const parsed = parseLink(type, link);
            if (!parsed?.minutes) {
              child.progress('INVALID_LINK', {
                type: key
              });
              setResult(result, key, link, false);
            } else {
              valid.push({
                link,
                id: parsed.id,
                minutes: parsed.minutes
              });
            }
          }
          if (valid.length) {
            const ok = doTask ? await playGames(child, [...new Set(valid.map((item) => {
              return item.id;
            }))], Math.max(...valid.map((item) => {
              return item.minutes;
            }))) : await stopPlayGames(child);
            for (const item of valid) {
              setResult(result, key, item.link, ok);
            }
            await child.delay();
          }
          continue;
        }
        for (const link of links) {
          const ok = await child.run('task.execute', link, false, async (step) => {
            const parsed = parseLink(type, link);
            if (!parsed) {
              throw new SteamError('INVALID_LINK');
            }
            if (type === 'curatorLikes') {
              if (!doTask && step.state.whiteList.curatorLikes.includes(parsed.id)) {
                step.skip('WHITELIST_SKIPPED');
                return true;
              }
              const divider = parsed.id.indexOf('/');
              const id = await getCuratorId(step, parsed.id.slice(0, divider), parsed.id.slice(divider + 1));
              if (!id) {
                return false;
              }
              if (!doTask && step.state.whiteList.curators.includes(id)) {
                step.skip('WHITELIST_SKIPPED');
                return true;
              }
              if (!await dispatch(step, 'curators', id, doTask)) {
                return false;
              }
              const values = step.state.tasks.curatorLikes;
              step.state.tasks.curatorLikes = doTask ? [...new Set([...values, parsed.id])] : values.filter((value) => {
                return value !== parsed.id;
              });
              await step.storage.set('tasks', step.state.tasks);
              return true;
            }
            if (type === 'licenses') {
              const [prefix, ids] = parsed.id.split('-');
              let all = true;
              for (const id of new Set(ids.split(','))) {
                all = await dispatch(step, 'licenses', `${prefix}-${id}`, true) && all;
                await step.delay();
              }
              return all;
            }
            return dispatch(step, type, parsed.id, doTask);
          }, undefined, {
            taskType: type,
            action
          });
          setResult(result, key, link, ok);
          await child.delay();
        }
      }
    } finally {
      if (!await resetRegion(child)) {
        result.success = false;
      }
    }
    return result;
  }, (value) => {
    return typeof value === 'boolean' ? value : value.success;
  });
}

export function doTasks(ctx: Context, options: SteamTaskOptions = {}): Promise<SteamTaskResult> {
  return executeTasks(ctx, options, 'do');
}
export function undoTasks(ctx: Context, options: SteamTaskOptions = {}): Promise<SteamTaskResult> {
  return executeTasks(ctx, options, 'undo');
}
