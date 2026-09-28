/*
 * @Author       : HCLonely
 * @Date         : 2021-11-19 14:42:43
 * @LastEditTime : 2026-09-28 17:38:06
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/modules/website/GiveawayHopper.ts
 * @Description  : GiveawayHopper 网站任务处理（https://giveawayhopper.com/）
 */

import type { WebsiteStoredTasksInput, WebsiteTask, giveawayHopperReturnTaskInfo } from './types';
import { showDialog } from '../../scripts/ui/dialog';
import Website from './Website';
import throwError from '../../scripts/tools/throwError';
import echoLog from '../../scripts/echoLog';
import __ from '../../scripts/tools/i18n';
import httpRequest from '../../scripts/tools/httpRequest';
import { delay, getRedirectLink } from '../../scripts/tools/tools';
import { globalOptions } from '../../scripts/globalOptions';
import { debug } from '../../scripts/tools/debug';
import { normalizeStoredTasks, uniqueWebsiteTasks } from './taskModel';

/**
 * 表示 GiveawayHopper 网站的任务处理类。
 *
 * @remarks
 * - `name`（`string`）：网站名称，默认为 'GiveawayHopper'。
 *
 * - `tasks`（`Array<WebsiteTask>`）：统一任务列表。
 *
 * - `rawTasks`（`Array<giveawayHopperReturnTaskInfo>`）：API 原始任务列表。
 *
 * - `buttons`（`Array<string>`）：可用的操作按钮数组，包括 'doTask'、'undoTask' 和 'verifyTask'。
 */
class GiveawayHopper extends Website {
  name = 'GiveawayHopper';
  tasks: Array<WebsiteTask> = [];
  rawTasks: Array<giveawayHopperReturnTaskInfo> = [];
  buttons: Array<string> = [
    'doTask',
    'undoTask',
    'verifyTask'
  ];

  /**
   * 检查当前域名是否为 GiveawayHopper 网站的静态方法
   *
   * @remarks
   * 该方法通过比较当前窗口的域名来判断是否为 GiveawayHopper 网站。
   * 如果域名匹配，则返回 true；否则返回 false。
   *
   * @returns 如果当前域名为 'giveawayHopper.io'，则返回 true；否则返回 false。
   */
  static test(): boolean {
    const { host } = window.location;
    const isMatch = host === 'giveawayhopper.com';
    debug('检查网站匹配', {
      host,
      isMatch
    });
    return isMatch;
  }
  /**
   * 页面加载后的异步方法
   *
   * @remarks
   * 该方法在页面加载后执行初始化操作：
   * 1. 检查用户登录状态，如果检查失败则记录警告信息
   * 2. 获取抽奖ID
   *
   * @returns 无返回值。
   */
  async after(): Promise<void> {
    try {
      debug('开始执行后续操作');
      if (!this.#checkLogin()) {
        debug('登录检查失败');
        echoLog({}).warning(__('checkLoginFailed'));
      }
      const giveawayIdResult = this.#getGiveawayId();
      debug('获取抽奖ID', {
        success: giveawayIdResult,
        id: this.giveawayId
      });
    } catch (error) {
      debug('后续操作失败', {
        error
      });
      throwError(error as Error, 'GiveawayHopper.after');
    }
  }

  /**
   * 初始化方法
   *
   * @remarks
   * 该方法执行以下初始化步骤：
   * 1. 检查剩余密钥数量，如果检查失败则记录警告信息
   * 2. 设置初始化标志
   * 3. 记录成功状态
   *
   * 已捕获的异常通过失败返回值交付，不会从对应的 catch 分支继续抛出。
   *
   * @returns 如果初始化成功，则返回 true；否则返回 false。
   */
  async init(): Promise<boolean> {
    try {
      debug('初始化 GiveawayHopper');
      const logStatus = echoLog({
        text: __('initing')
      });

      const leftKeyResult = await this.#checkLeftKey();
      if (!leftKeyResult) {
        debug('检查剩余密钥失败');
        echoLog({}).warning(__('checkLeftKeyFailed'));
      }

      this.initialized = true;
      debug('初始化完成');
      logStatus.success();
      return true;
    } catch (error) {
      debug('初始化失败', {
        error
      });
      throwError(error as Error, 'GiveawayHopper.init');
      return false;
    }
  }

  /**
   * 分类任务的异步方法
   *
   * @remarks
   * 该方法执行以下步骤：
   * 1. 检查并获取抽奖ID
   * 2. 如果是 'undo' 操作，从存储中恢复任务信息
   * 3. 从API获取当前任务列表
   * 4. 遍历任务并根据类型分类到相应的社交任务列表
   * 5. 对任务列表进行去重处理
   * 6. 将更新后的任务信息保存到存储中
   *
   * 已捕获的异常通过失败返回值交付，不会从对应的 catch 分支继续抛出。
   *
   * @param action - 要执行的操作类型，'do' 表示执行任务，'undo' 表示撤销任务。
   * @returns 如果任务分类成功，则返回 true；否则返回 false。
   */
  async classifyTask(action: 'do' | 'undo'): Promise<boolean> {
    try {
      debug('开始分类任务', {
        action
      });
      if (!this.giveawayId) {
        debug('未找到抽奖ID，尝试获取');
        await this.#getGiveawayId();
      }

      const logStatus = echoLog({
        text: __('getTasksInfo')
      });
      if (action === 'undo') {
        debug('恢复已保存的任务信息');
        this.tasks = normalizeStoredTasks(GM_getValue<WebsiteStoredTasksInput>(`giveawayHopperTasks-${this.giveawayId}`));
        logStatus.success();
        return true;
      }

      debug('请求任务列表');
      const {
        result, statusText, status, data
      } = await httpRequest({
        url: `https://giveawayhopper.com/api/v1/campaigns/${this.giveawayId}/with-auth`,
        method: 'GET',
        responseType: 'json',
        headers: {
          authorization: `Bearer ${window.sessionStorage.gw_auth}`,
          'x-xsrf-token': decodeURIComponent(document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1] as string)
        }
      });

      if (result !== 'Success') {
        debug('请求任务列表失败', {
          result,
          statusText,
          status
        });
        logStatus.error(`${result}:${statusText}(${status})`);
        return false;
      }

      if (data?.status !== 200 || !data?.response?.tasks) {
        debug('任务列表数据异常', {
          status: data?.status,
          response: data?.response
        });
        logStatus.error(`Error:${data?.statusText}(${data?.status})`);
        return false;
      }

      debug('获取到任务列表', {
        count: data.response.tasks.length
      });
      this.rawTasks = data.response.tasks;
      this.tasks = [];

      for (const task of data.response.tasks) {
        debug('处理任务', {
          taskId: task.id,
          category: task.category,
          type: task.type
        });
        if (!task.isDone) {
          await httpRequest({
            url: `https://giveawayhopper.com/api/v1/campaigns/${this.giveawayId}/tasks/${task.id}/visited`,
            method: 'GET',
            responseType: 'json',
            headers: {
              authorization: `Bearer ${window.sessionStorage.gw_auth}`,
              'x-xsrf-token': decodeURIComponent(document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1] as string)
            }
          });
        }

        const taskTitle = task.displayName?.replace(':target', task.targetName) || task.name;

        if (task.category === 'Steam' && task.type === 'JoinGroup') {
          debug('处理 Steam 组任务');
          if (!task.group_id) {
            debug('缺少 Steam 组 ID，跳过任务', {
              taskId: task.id
            });
            continue;
          }
          const steamGroupLink = await getRedirectLink(`https://steamcommunity.com/gid/${task.group_id}`);
          if (!steamGroupLink) {
            debug('获取 Steam 组链接失败');
            continue;
          }

          debug('添加 Steam 组链接', {
            action,
            link: steamGroupLink
          });
          this.tasks.push({
            done: task.isDone,
            social: 'steam',
            type: 'group',
            link: steamGroupLink,
            id: task.id,
            title: taskTitle,
            category: task.category,
            sourceType: task.type,
            hash: task.hash,
            groupId: task.group_id
          });
          continue;
        }

        if (task.category === 'Discord' && task.type === 'JoinServer') {
          continue;
        }

        if (['TikTok', 'YouTube', 'General'].includes(task.category)) {
          debug('跳过特殊任务类型', {
            category: task.category
          });
          continue;
        }

        debug('发现未知任务类型', {
          category: task.category,
          type: task.type
        });
        echoLog({}).warning(`${__('unKnownTaskType')}: ${task.category}-${task.type}`);
      }

      logStatus.success();
      this.tasks = uniqueWebsiteTasks(this.tasks);
      const tasksForUndo = uniqueWebsiteTasks(this.tasks
        .filter((task) => {
          return !task.done && task.social !== 'extra' && task.social !== 'links';
        })
        .map((task) => {
          return {
            ...task,
            done: true
          };
        }));

      debug('任务分类完成', {
        tasks: this.tasks
      });

      GM_setValue(`giveawayHopperTasks-${this.giveawayId}`, {
        tasks: tasksForUndo,
        time: new Date().getTime()
      });
      return true;
    } catch (error) {
      debug('任务分类失败', {
        error
      });
      throwError(error as Error, 'GiveawayHopper.classifyTask');
      return false;
    }
  }

  /**
   * 验证任务的异步方法
   *
   * @remarks
   * 该方法遍历所有未完成的任务，对每个任务：
   * 1. 获取任务链接（如果需要）
   * 2. 访问任务链接（如果存在）
   * 3. 等待指定时间
   * 4. 验证任务完成状态
   *
   * 已捕获的异常通过失败返回值交付，不会从对应的 catch 分支继续抛出。
   *
   * @returns 如果所有任务成功验证，则返回 true；否则返回 false。
   */
  async verifyTask(): Promise<boolean> {
    try {
      debug('开始验证任务');
      for (const task of this.rawTasks) {
        if (task.isDone) {
          debug('跳过已完成任务', {
            taskId: task.id
          });
          continue;
        }

        debug('验证任务', {
          taskId: task.id,
          name: task.displayName?.replace(':target', task.targetName) || task.name
        });
        const logStatus = echoLog({
          text: `${__('verifyingTask')}[${task.displayName?.replace(':target', task.targetName) || task.name}]`
        });

        if (!task.link) {
          debug('获取任务链接');
          task.link = this.#getTaskLink(task);
        }

        if (task.link) {
          debug('访问任务链接', {
            link: task.link
          });
          await this.#visitTaskLink(task);
        }

        await delay(1000);
        const verifyResult = await this.#verifyTask(task, logStatus);
        debug('任务验证结果', {
          taskId: task.id,
          success: verifyResult
        });
        if (!verifyResult) {
          continue;
        }
      }
      debug('所有任务验证完成');
      return true;
    } catch (error) {
      debug('任务验证失败', {
        error
      });
      throwError(error as Error, 'GiveawayHopper.verifyTask');
      return false;
    }
  }

  /**
   * 获取任务链接的私有方法
   *
   * @remarks
   * 根据任务类型和目标生成对应的链接：
   * - YouTube：生成频道订阅链接
   * - TikTok：生成用户关注链接
   * - Steam：返回空字符串（链接在其他地方处理）
   *
   * @param task - 任务信息对象
   * @returns 返回任务对应的链接，如果没有对应链接则返回空字符串
   */
  #getTaskLink(task: giveawayHopperReturnTaskInfo): string {
    try {
      debug('生成任务链接', {
        category: task.category,
        type: task.type
      });
      let link = '';

      if (task.category === 'YouTube' && task.type === 'FollowAccount') {
        link = `https://www.youtube.com/@${task.targetName}`;
      } else if (task.category === 'TikTok' && task.type === 'FollowAccount') {
        link = `https://www.tiktok.com/@${task.targetName}`;
      } else if (task.category === 'Steam' && task.type === 'JoinGroup') {
        link = '';
      }

      debug('生成的任务链接', {
        link
      });
      return link;
    } catch (error) {
      debug('生成任务链接失败', {
        error
      });
      throwError(error as Error, 'GiveawayHopper.getTaskLink');
      return '';
    }
  }

  /**
   * 访问任务链接的私有异步方法
   *
   * @remarks
   * 向服务器发送任务访问记录：
   * 1. 构建包含任务信息的URL
   * 2. 发送GET请求记录访问
   * 3. 包含必要的认证信息
   *
   * @param task - 任务信息对象
   * @returns 无返回值
   */
  async #visitTaskLink(task: giveawayHopperReturnTaskInfo): Promise<void> {
    debug('访问任务链接', {
      taskId: task.id,
      link: task.link
    });
    await httpRequest({
      url: `https://giveawayhopper.com/fw?url=${encodeURIComponent(task.link as string)}&src=campaign&src_id=${this.giveawayId}&ref=task&ref_id=${task.id}&token=${window.sessionStorage.gw_auth}`,
      method: 'GET',
      headers: {
        authorization: `Bearer ${window.sessionStorage.gw_auth}`,
        'x-xsrf-token': decodeURIComponent(document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1] as string)
      }
    });
  }

  /**
   * 验证单个任务的私有异步方法
   *
   * @remarks
   * 向服务器发送任务完成验证请求：
   * 1. 构建验证数据（包括特殊处理YouTube和TikTok任务）
   * 2. 发送POST请求进行验证
   * 3. 处理响应结果并更新日志状态
   *
   * @param task - 要验证的任务信息
   * @param logStatus - 日志状态对象，用于记录验证过程
   * @returns 如果任务验证成功返回 true，否则返回 false
   */
  async #verifyTask(task: giveawayHopperReturnTaskInfo, logStatus: any): Promise<boolean> {
    debug('验证任务', {
      taskId: task.id,
      category: task.category,
      type: task.type
    });
    const postData: {
      taskcategory: string
      taskname: string
      username?: string
    } = {
      taskcategory: task.category,
      taskname: task.type
    };

    if (['YouTube', 'TikTok'].includes(task.category)) {
      postData.username = '1';
    }

    const {
      result, statusText, status, data
    } = await httpRequest({
      url: `https://giveawayhopper.com/api/v1/campaigns/${this.giveawayId}/tasks/${task.id}/complete`,
      method: 'POST',
      headers: {
        authorization: `Bearer ${window.sessionStorage.gw_auth}`,
        'x-xsrf-token': decodeURIComponent(document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1] as string),
        'content-type': 'application/json'
      },
      dataType: 'json',
      data: JSON.stringify(postData)
    });

    if (result !== 'Success') {
      debug('任务验证请求失败', {
        result,
        statusText,
        status
      });
      logStatus.error(`${result}:${statusText}(${status})`);
      return false;
    }

    if (data?.status !== 200 || !data?.response?.completed) {
      debug('任务验证响应异常', {
        status: data?.status,
        response: data?.response
      });
      logStatus.error(`Error:${data?.statusText}(${data?.status})`);
      return false;
    }

    debug('任务验证成功', {
      taskId: task.id
    });
    logStatus.success();
    return true;
  }

  /**
   * 获取抽奖ID的私有方法
   *
   * @remarks
   * 从当前页面URL中提取抽奖ID：
   * 1. 从路径中获取最后一个部分作为ID
   * 2. 验证ID是否存在
   * 3. 保存ID到实例属性
   *
   * 已捕获的异常通过失败返回值交付，不会从对应的 catch 分支继续抛出。
   *
   * @returns 如果成功获取抽奖ID返回 true，否则返回 false
   */
  #getGiveawayId(): boolean {
    try {
      debug('从URL获取抽奖ID');
      const giveawayId = window.location.pathname.split('/').at(-1);
      if (!giveawayId) {
        debug('获取抽奖ID失败');
        echoLog({
          text: __('getFailed', 'GiveawayId')
        });
        return false;
      }

      this.giveawayId = giveawayId;
      debug('获取抽奖ID成功', {
        giveawayId
      });
      return true;
    } catch (error) {
      debug('获取抽奖ID出错', {
        error
      });
      throwError(error as Error, 'GiveawayHopper.getGiveawayId');
      return false;
    }
  }

  /**
   * 检查用户登录状态的私有方法
   *
   * @remarks
   * 检查用户登录状态：
   * 1. 检查是否启用了登录检查功能
   * 2. 查找登录按钮并在需要时自动点击
   * 3. 返回检查结果
   *
   * 已捕获的异常通过失败返回值交付，不会从对应的 catch 分支继续抛出。
   *
   * @returns 如果用户已登录或不需要检查登录状态返回 true，发生错误返回 false
   */
  #checkLogin(): boolean {
    try {
      debug('检查登录状态');
      if (!globalOptions.other.checkLogin) {
        debug('跳过登录检查');
        return true;
      }

      const needLogin = $('div.widget-connections-edit:contains("Log in")').length > 0;
      if (needLogin) {
        debug('未登录，自动点击登录按钮');
        $('div.widget-connections-edit:contains("Log in") a')[0].click();
      }
      debug('登录检查完成', {
        needLogin
      });
      return true;
    } catch (error) {
      debug('登录检查失败', {
        error
      });
      throwError(error as Error, 'GiveawayHopper.checkLogin');
      return false;
    }
  }

  /**
   * 检查剩余密钥数量的私有异步方法
   *
   * @remarks
   * 检查抽奖是否还有剩余密钥：
   * 1. 检查是否启用了密钥检查功能
   * 2. 获取并解析页面上的密钥数量信息
   * 3. 如果没有剩余密钥，显示确认对话框
   * 4. 根据用户选择决定是否关闭窗口
   *
   * 已捕获的异常通过失败返回值交付，不会从对应的 catch 分支继续抛出。
   *
   * @returns 如果检查成功返回 true，发生错误返回 false
   */
  async #checkLeftKey(): Promise<boolean> {
    try {
      debug('检查剩余密钥');
      if (!globalOptions.other.checkLeftKey) {
        debug('跳过密钥检查');
        return true;
      }

      const keyCount = parseInt($('p.widget-single-prize span').text()
        ?.match(/\d+/)?.[0] || '0', 10);
      debug('剩余密钥数量', {
        keyCount
      });

      if (keyCount > 0) {
        return true;
      }

      debug('没有剩余密钥，显示确认对话框');
      const { value } = await showDialog({
        icon: 'warning',
        title: __('notice'),
        text: __('noKeysLeft'),
        confirmButtonText: __('confirm'),
        cancelButtonText: __('cancel'),
        showCancelButton: true
      });

      if (value) {
        debug('用户确认关闭窗口');
        window.close();
      }
      return true;
    } catch (error) {
      debug('检查剩余密钥失败', {
        error
      });
      throwError(error as Error, 'GiveawayHopper.checkLeftKey');
      return false;
    }
  }
}

export default GiveawayHopper;
