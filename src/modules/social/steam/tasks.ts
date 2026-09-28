/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 17:09:58
 * @LastEditTime : 2026-09-28 17:38:06
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/modules/social/steam/tasks.ts
 * @Description  : Steam 批量任务执行与结果汇总
 */

import { Context, SteamError } from './context';
import { dispatch, resetRegion } from './executors';
import { linkTasks, parseLink } from './links';
import { getCuratorId } from './lookups';
import { playGames, stopPlayGames } from './playTime';
import { loadState } from './storage';
import type { LinkType, SteamTaskDetailResult, SteamTaskOptions, SteamTaskResult, TaskType } from './types';

/**
 * 写入任务执行结果。
 *
 * @param result - 当前操作结果。
 * @param type - 操作或数据类型。
 * @param link - 任务目标链接。
 * @param success - 成功状态或成功判定回调。
 */
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

/**
 * 按选项调度批量任务并记录每项结果。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @param options - 本次操作的配置选项。
 * @param action - 待执行的动作。
 * @returns Promise，完成后返回Steam 任务执行汇总。
 */
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

/**
 * 执行所选社交任务并汇总结果。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @param options - 本次操作的配置选项；默认值为 `{}`。
 * @returns Promise，完成后返回Steam 任务执行汇总。
 */
export function doTasks(ctx: Context, options: SteamTaskOptions = {}): Promise<SteamTaskResult> {
  return executeTasks(ctx, options, 'do');
}
/**
 * 撤销所选社交任务并汇总结果。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @param options - 本次操作的配置选项；默认值为 `{}`。
 * @returns Promise，完成后返回Steam 任务执行汇总。
 */
export function undoTasks(ctx: Context, options: SteamTaskOptions = {}): Promise<SteamTaskResult> {
  return executeTasks(ctx, options, 'undo');
}
