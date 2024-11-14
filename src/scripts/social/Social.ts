/*
 * @Author       : HCLonely
 * @Date         : 2021-10-15 10:48:42
 * @LastEditTime : 2022-05-18 09:49:49
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task-new/src/scripts/social/Social.ts
 * @Description  : Social通用模板
 */

import throwError from '../tools/throwError';
import { unique } from '../tools/tools';

interface toggleParams {
  [name:string]:unknown
}

/**
 * 抽象类，表示社交功能的基类。
 *
 * @abstract
 * @class Social
 * @description
 * 该类定义了社交功能的基本结构，包括任务管理和抽象方法。
 */
abstract class Social {
  /**
   * @type {socialTasks}
   * @description 当前的社交任务列表。
   */
  tasks!: socialTasks;

  /**
   * 初始化社交功能。
   *
   * @abstract
   * @function init
   * @param {any} [options] - 可选的初始化选项。
   * @returns {Promise<boolean | 'skip'>} - 返回一个Promise，表示初始化的结果。
   *                                          - true: 初始化成功
   *                                          - false: 初始化失败
   *                                          - 'skip': 跳过初始化
   */
  abstract init(options?: any): Promise<boolean | 'skip'>;

  /**
   * 切换社交功能的状态。
   *
   * @abstract
   * @function toggle
   * @param {toggleParams} toggleParams - 切换参数。
   * @returns {Promise<boolean>} - 返回一个Promise，表示切换操作的结果。
   *                              - true: 切换成功
   *                              - false: 切换失败
   */
  abstract toggle(toggleParams: toggleParams): Promise<boolean>;

  /**
   * 获取实际参数数组，用于执行任务。
   *
   * @protected
   * @function getRealParams
   * @param {taskTypes} name - 任务类型的名称。
   * @param {Array<string>} links - 链接数组，用于转换为参数。
   * @param {boolean} doTask - 指示是否执行任务的标志。
   * @param {function} link2param - 将链接转换为参数的函数。
   * @returns {Array<string>} - 返回一个包含实际参数的数组。
   *
   * @description
   * 该方法将传入的链接转换为执行任务所需的参数。
   * 如果提供了链接，则通过`link2param`函数转换链接并添加到参数数组中。
   * 如果`doTask`为false且对应任务类型的任务数组不为空，则将该任务类型的任务参数也添加到参数数组中。
   * 最终返回的参数数组会去重。
   * 如果在处理过程中发生错误，将抛出错误并返回空数组。
   */
  protected getRealParams(
    name: taskTypes,
    links: Array<string>,
    doTask: boolean,
    link2param: (link: string) => string | undefined
  ): Array<string> {
    try {
      let realParams: Array<string> = [];
      if (links.length > 0) {
        realParams = [
          ...realParams,
          ...links
            .map((link) => link2param(link))
            .filter((link) => link) as Array<string>
        ];
      }
      if (!doTask && (this.tasks[name] as Array<string>).length > 0) {
        realParams = [
          ...realParams,
          ...this.tasks[name] as Array<string>
        ];
      }
      return unique(realParams);
    } catch (error) {
      throwError(error as Error, 'Social.getRealParams');
      return [];
    }
  }
}

export default Social;
