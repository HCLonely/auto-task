/*
 * @Author       : HCLonely
 * @Date         : 2021-10-15 10:48:42
 * @LastEditTime : 2026-09-28 17:35:45
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/scripts/social/Social.ts
 * @Description  : Social通用模板
 */

import type { socialTasks, taskTypes } from './types';
import type { SocialToggleDetailResult, SocialToggleResult } from '../../modules/website/types';
import throwError from '../tools/throwError';
import { getRealParams, setTaskResult } from '../../modules/social/social/results';
import { SocialAdapter } from '../../modules/social/social/adapter';
import type { SocialModule, TaskOptions } from '../../modules/social/social/types';
import { bindModuleStatus } from './moduleBridge';
import { debug } from '../tools/debug';

export interface toggleParams {
  [name:string]:unknown
}

/**
 * 抽象类，表示社交功能的基类。
 *
 * @remarks
 * 该类定义了社交功能的基本结构，包括任务管理和抽象方法。
 */
abstract class Social {
  /**
   * @type {socialTasks}
   * @description 当前的社交任务列表。
   */
  protected tasks!: socialTasks;

  /**
   * 初始化社交功能。
   *
   * @param options - 可选的初始化选项。
   * @returns 返回一个Promise，表示初始化的结果。
   *     - true: 初始化成功
   *     - false: 初始化失败
   *     - 'skip': 跳过初始化
   */
  abstract init(options?: any): Promise<boolean | 'skip'>;

  /**
   * 切换社交功能的状态。
   *
   * @param toggleParams - 切换参数。
   * @returns 返回一个Promise，表示切换操作的结果。
   *  - boolean: 兼容旧整体结果
   *  - SocialToggleDetailResult: 每个任务的执行结果
   */
  abstract toggle(toggleParams: toggleParams): Promise<SocialToggleResult>;

  /**
   * 创建任务切换操作的初始结果。
   *
   * @returns 处理结果（SocialToggleDetailResult）。
   */
  protected createToggleResult(): SocialToggleDetailResult {
    return {
      success: true,
      results: {}
    };
  }

  /**
   * 记录单项任务切换操作的结果。
   *
   * @param result - 当前操作结果。
   * @param type - 操作或数据类型。
   * @param value - 待处理的值。
   * @param success - 成功状态或成功判定回调。
   */
  protected setToggleResult(
    result: SocialToggleDetailResult,
    type: string,
    value: string,
    success: boolean
  ): void {
    setTaskResult(result, type, value, success);
  }

  /**
   * 获取实际参数数组，用于执行任务。
   *
   * @remarks
   * 该方法将传入的链接转换为执行任务所需的参数。
   * 如果提供了链接，则通过`link2param`函数转换链接并添加到参数数组中。
   * 如果`doTask`为false且对应任务类型的任务数组不为空，则将该任务类型的任务参数也添加到参数数组中。
   * 最终返回的参数数组会去重。
   * 如果在处理过程中发生错误，将抛出错误并返回空数组。
   *
   * 撤销任务时会合并此前记录的目标，再对规范化结果去重。
   *
   * @param name - 任务类型的名称。
   * @param links - 链接数组，用于转换为参数。
   * @param doTask - 指示是否执行任务的标志。
   * @param link2param - 将链接转换为参数的函数。
   * @returns 返回一个包含实际参数的数组。
   */
  protected getRealParams(
    name: taskTypes,
    links: Array<string>,
    doTask: boolean,
    link2param: (link: string) => string | undefined
  ): Array<string> {
    try {
      debug('开始获取实际参数', {
        name,
        linksCount: links.length,
        doTask
      });
      return getRealParams(links, doTask, this.tasks[name] || [], link2param);
    } catch (error) {
      debug('获取实际参数时发生错误', {
        error
      });
      throwError(error as Error, 'Social.getRealParams');
      return [];
    }
  }
}

export default Social;

/**
 * 将独立的社交任务适配器接入项目配置与日志。
 *
 * @typeParam C - C 泛型参数的类型约束。
 */
export class ProjectSocial<C extends SocialModule & { tasks: object; whiteList: C['tasks'] }> extends SocialAdapter<C> {
  private readonly unsubscribe: /** 注销已注册的监听器。 */ () => void;
  /**
   * 创建 ProjectSocial 实例并初始化所需状态。
   *
   * @param client - 目标模块客户端。
   * @param platform - 社交平台名称。
   */
  constructor(client: C, platform: string) {
    super(client);
    this.unsubscribe = bindModuleStatus(client, platform);
  }
  /**
   * 读取当前任务集合。
   *
   * @returns 处理结果（C["tasks"]）。
   */
  get tasks(): C['tasks'] {
    return this.client.tasks;
  }
  /**
   * 更新当前任务集合。
   *
   * @param value - 替换当前任务列表的数据集合。
   */
  set tasks(value: C['tasks']) {
    this.client.tasks = value;
  }
  /**
   * 读取当前任务白名单。
   *
   * @returns 处理结果（C["tasks"]）。
   */
  get whiteList(): C['tasks'] {
    return this.client.whiteList;
  }
  /**
   * 更新当前任务白名单。
   *
   * @param value - 替换当前白名单的任务集合。
   */
  set whiteList(value: C['tasks']) {
    this.client.whiteList = value;
  }
  /**
   * 执行当前模块的任务。
   *
   * @param options - 本次操作的配置选项。
   * @returns Promise，完成后返回处理结果（SocialToggleResult）。
   */
  async do(options: TaskOptions<C>): Promise<SocialToggleResult> {
    const result = await super.do(options);
    if (typeof result === 'boolean') {
      return result;
    }
    const results: Record<string, Record<string, boolean>> = {};
    for (const [key, values] of Object.entries(result.results)) {
      if (values) {
        Object.defineProperty(results, key, {
          value: values,
          enumerable: true,
          writable: true,
          configurable: true
        });
      }
    }
    return {
      success: result.success,
      results
    };
  }
  /**
   * 撤销当前模块的任务。
   *
   * @param options - 本次操作的配置选项。
   * @returns Promise，完成后返回处理结果（SocialToggleResult）。
   */
  async undo(options: TaskOptions<C>): Promise<SocialToggleResult> {
    const result = await super.undo(options);
    if (typeof result === 'boolean') {
      return result;
    }
    const results: Record<string, Record<string, boolean>> = {};
    for (const [key, values] of Object.entries(result.results)) {
      if (values) {
        Object.defineProperty(results, key, {
          value: values,
          enumerable: true,
          writable: true,
          configurable: true
        });
      }
    }
    return {
      success: result.success,
      results
    };
  }
  /**
   * 释放模块资源并结束待处理的监听或等待。
   */
  dispose(): void {
    this.unsubscribe();
    super.dispose();
  }
}
