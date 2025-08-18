/*
 * @Author       : HCLonely
 * @Date         : 2021-12-28 18:53:41
 * @LastEditTime : 2025-08-18 19:06:40
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/scripts/website/History.ts
 * @Description  : 任务历史页面
 */

import __ from '../tools/i18n';
import throwError from '../tools/throwError';
import Swal from 'sweetalert2';
import Keylol from './Keylol';
import dayjs from 'dayjs';
import { debug } from '../tools/debug';

/**
 * 表示历史记录的类，继承自 Keylol。
 *
 * @class History
 * @extends Keylol
 *
 * @property {string} name - 类的名称，默认为 'History'。
 * @property {Array<string>} buttons - 包含可用操作的按钮名称数组。
 *
 * @method static test - 检查当前域名和路径是否为历史记录页面。
 * @returns {boolean} 如果当前域名为 'auto-task.hclonely.com' 或 'auto-task.js.org' 且路径为 '/history.html'，则返回 true；否则返回 false。
 *
 * @method before - 在执行操作之前清空页面的主体内容并添加类。
 * @returns {void} 无返回值。
 * @throws {Error} 如果在执行过程中发生错误，将抛出错误。
 *
 * @method clearHistory - 清除历史记录的方法。
 * @returns {void} 无返回值。
 * @throws {Error} 如果在清除过程中发生错误，将抛出错误。
 *
 * @method #addItem - 添加任务项的方法。
 * @param {string} item - 要添加的任务项名称。
 * @returns {void} 无返回值。
 * @throws {Error} 如果在添加过程中发生错误，将抛出错误。
 */

type TasksData = fawGMTasks | gasGMTasks | gkGMTasks | khGMTasks | prysGMTasks;

class History extends Keylol {
  name = 'History';
  buttons: Array<string> = [
    'doTask',
    'undoTask',
    'selectAll',
    'selectNone',
    'invertSelect',
    'clearHistory'
  ];

  /**
   * 检查当前域名和路径是否为历史记录页面的静态方法
   *
   * @returns {boolean} 如果当前域名为 'auto-task.hclonely.com' 或 'auto-task.js.org' 且路径为 '/history.html'，则返回 true；否则返回 false。
   *
   * @description
   * 该方法通过比较当前窗口的域名和路径来判断是否为历史记录页面。
   * 如果域名和路径匹配，则返回 true；否则返回 false。
   */
  static test(): boolean {
    try {
      const { host, pathname } = window.location;
      const isMatch = ['auto-task.hclonely.com', 'auto-task.js.org'].includes(host) && pathname === '/history.html';
      debug('检查是否为历史记录页面', { host, pathname, isMatch });
      return isMatch;
    } catch (error) {
      debug('检查历史记录页面时出错', { error });
      throwError(error as Error, 'History.test');
      return false;
    }
  }

  /**
   * 在执行操作之前的函数
   *
   * @returns {void} 无返回值。
   *
   * @throws {Error} 如果在执行过程中发生错误，将抛出错误。
   *
   * @description
   * 该方法在执行操作之前清空页面的主体内容，并为主体添加 'auto-task-history' 类。
   * 然后获取存储中的所有值，并筛选出以 'Tasks-' 开头的任务历史记录。
   * 遍历每个任务历史记录，调用私有方法 `#addItem` 将其添加到页面中。
   */
  before(): void {
    try {
      debug('开始初始化历史记录页面');
      $('body').html('<div class="container"></div>')
        .addClass('auto-task-history');
      debug('页面基础结构已创建');

      const data = GM_listValues() || [];
      debug('获取存储的所有值', { count: data.length });

      const tasksHistory = data
        .map((value) => (/^[\w]+?Tasks-/.test(value) ? value : null))
        .filter((value) => value) as Array<string>;
      debug('筛选任务历史记录', { count: tasksHistory.length });

      tasksHistory.forEach((item) => {
        debug('处理任务项', { item });
        this.#addItem(item);
      });
      debug('历史记录页面初始化完成');
    } catch (error) {
      debug('初始化历史记录页面时出错', { error });
      throwError(error as Error, 'History.before');
    }
  }

  /**
   * 清除历史记录的方法
   *
   * @returns {void} 无返回值。
   *
   * @throws {Error} 如果在清除过程中发生错误，将抛出错误。
   *
   * @description
   * 该方法从存储中获取所有值，并筛选出以 'Tasks-' 开头的任务历史记录。
   * 遍历每个任务历史记录，调用 `GM_deleteValue` 删除对应的值。
   * 清除完成后，弹出成功提示框。
   */
  clearHistory(): void {
    try {
      debug('开始清除历史记录');
      const data = GM_listValues() || [];
      debug('获取存储的所有值', { count: data.length });

      const tasksHistory = data
        .map((value) => (/^[\w]+?Tasks-/.test(value) ? value : null))
        .filter((value) => value) as Array<string>;
      debug('筛选要清除的任务历史记录', { count: tasksHistory.length });

      tasksHistory.forEach((item) => {
        debug('删除任务项', { item });
        GM_deleteValue(item);
      });

      debug('历史记录清除完成');
      Swal.fire({
        title: __('clearHistoryFinished'),
        icon: 'success'
      });
    } catch (error) {
      debug('清除历史记录时出错', { error });
      throwError(error as Error, 'History.clearHistory');
    }
  }

  /**
   * 添加任务项的方法
   *
   * @param {string} item - 要添加的任务项名称。
   * @returns {void} 无返回值。
   *
   * @throws {Error} 如果在添加过程中发生错误，将抛出错误。
   *
   * @description
   * 该方法从存储中获取指定任务项的数据，并根据任务项的类型生成相应的 HTML。
   * 然后将生成的 HTML 添加到页面的容器中，以便用户查看。
   * 如果在过程中发生错误，则记录错误信息。
   */
  #addItem(item: string): void {
    try {
      debug('开始添加任务项', { item });
      const tasksData = GM_getValue<TasksData>(item);
      if (!tasksData?.tasks) {
        debug('任务数据无效', { item });
        return;
      }

      const { title, link } = this.#getTaskInfo(item);
      if (!title || !link) {
        debug('获取任务信息失败', { item });
        return;
      }

      debug('生成任务HTML', { item, title, link });
      const html = this.#generateTaskHtml(tasksData.tasks);
      this.#appendTaskToContainer(item, title, link, html, tasksData.time);
      this.#bindDeleteEvent();
      debug('任务项添加完成', { item });
    } catch (error) {
      debug('添加任务项时出错', { error, item });
      throwError(error as Error, 'History.addItem');
    }
  }

  /**
   * 获取任务信息的私有方法
   *
   * @param {string} item - 任务项的标识符，格式为 "website-id"
   * @returns {{ title: string; link: string }} 返回包含任务标题和链接的对象
   * @throws {Error} 如果在获取过程中发生错误，将抛出错误
   *
   * @description
   * 该方法解析任务项标识符，从中提取网站标识和任务ID。
   * 根据不同的网站类型，生成对应的任务标题和链接。
   * 如果发生错误或找不到匹配的网站类型，则返回空标题和链接。
   */
  #getTaskInfo(item: string): { title: string; link: string } {
    try {
      debug('开始获取任务信息', { item });
      const [website, id] = item.split('-');
      debug('解析任务标识符', { website, id });

      const taskInfoMap = {
        fawTasks: {
          title: `Freeanywhere[${id}]`,
          link: `https://freeanywhere.net/#/giveaway/${id}`
        },
        gasTasks: {
          title: `Giveawaysu[${id}]`,
          link: `https://giveaway.su/giveaway/view/${id}`
        },
        gcTasks: {
          title: `GiveeClub[${id}]`,
          link: `https://givee.club/event/${id}`
        },
        gkTasks: {
          title: `Givekey[${id}]`,
          link: `https://givekey.ru/giveaway/${id}`
        },
        gleamTasks: {
          title: `Gleam[${id}]`,
          link: `https://gleam.io${id}`
        },
        khTasks: {
          title: `keyhub[${id}]`,
          link: `https://key-hub.eu/giveaway/${id}`
        },
        prysTasks: {
          title: `Prys[${id}]`,
          link: `https://prys.revadike.com/giveaway/?id=${id}`
        }
      };

      const result = taskInfoMap[website as keyof typeof taskInfoMap] || { title: '', link: '' };
      debug('获取任务信息结果', { result });
      return result;
    } catch (error) {
      debug('获取任务信息时出错', { error, item });
      throwError(error as Error, 'History.getTaskInfo');
      return { title: '', link: '' };
    }
  }

  /**
   * 生成任务HTML的私有方法
   *
   * @param {TasksData['tasks']} tasks - 任务数据对象
   * @returns {string} 返回生成的HTML字符串
   * @throws {Error} 如果在生成过程中发生错误，将抛出错误
   *
   * @description
   * 该方法遍历任务数据对象，为每个任务生成对应的HTML列表项。
   * 对于过长的任务链接，会进行截断处理。
   * 生成的HTML包含任务的社交平台、类型和链接信息。
   * 如果发生错误，则返回空字符串。
   */
  #generateTaskHtml(tasks: TasksData['tasks']): string {
    try {
      debug('开始生成任务HTML');
      let html = '';
      for (const [social, types] of Object.entries(tasks)) {
        for (const [type, taskList] of Object.entries(types)) {
          for (const task of taskList as Array<string>) {
            debug('处理任务', { social, type, task });
            const displayTask = task.length > 55 ? `${task.slice(0, 55)}...` : task;
            html += `<li>
              <font class="auto-task-capitalize">${social}.${__(type.replace('Link', ''))}: </font>
              <a href="${task}" target="_blank">${displayTask}</a>
            </li>`;
          }
        }
      }
      debug('任务HTML生成完成');
      return html;
    } catch (error) {
      debug('生成任务HTML时出错', { error });
      throwError(error as Error, 'History.generateTaskHtml');
      return '';
    }
  }

  /**
   * 将任务添加到容器的私有方法
   *
   * @param {string} item - 任务项的标识符
   * @param {string} title - 任务的标题
   * @param {string} link - 任务的链接
   * @param {string} html - 任务的HTML内容
   * @param {number} time - 任务的时间戳
   * @returns {void}
   * @throws {Error} 如果在添加过程中发生错误，将抛出错误
   *
   * @description
   * 该方法将任务信息添加到页面容器中。
   * 生成的卡片包含任务标题、链接、删除按钮和时间信息。
   * 使用dayjs格式化时间戳为可读格式。
   */
  #appendTaskToContainer(item: string, title: string, link: string, html: string, time: number): void {
    try {
      debug('开始添加任务到容器', { item, title, link });
      $('.container').append(`
        <div class="card" data-name="${item}">
          <div class="title">
            <a href="${link}" target="_blank">${title}</a>
            <span class="delete-task" data-name="${item}" title="${__('deleteTask')}">
              <svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2734" width="32" height="32">
                <path d="M607.897867 768.043004c-17.717453 0-31.994625-14.277171-31.994625-31.994625L575.903242 383.935495c0-17.717453 14.277171-31.994625 31.994625-31.994625s31.994625 14.277171 31.994625 31.994625l0 351.94087C639.892491 753.593818 625.61532 768.043004 607.897867 768.043004z" p-id="2735" fill="#d81e06"></path>
                <path d="M415.930119 768.043004c-17.717453 0-31.994625-14.277171-31.994625-31.994625L383.935495 383.935495c0-17.717453 14.277171-31.994625 31.994625-31.994625 17.717453 0 31.994625 14.277171 31.994625 31.994625l0 351.94087C447.924744 753.593818 433.647573 768.043004 415.930119 768.043004z" p-id="2736" fill="#d81e06"></path>
                <path d="M928.016126 223.962372l-159.973123 0L768.043004 159.973123c0-52.980346-42.659499-95.983874-95.295817-95.983874L351.94087 63.989249c-52.980346 0-95.983874 43.003528-95.983874 95.983874l0 63.989249-159.973123 0c-17.717453 0-31.994625 14.277171-31.994625 31.994625s14.277171 31.994625 31.994625 31.994625l832.032253 0c17.717453 0 31.994625-14.277171 31.994625-31.994625S945.73358 223.962372 928.016126 223.962372zM319.946246 159.973123c0-17.545439 14.449185-31.994625 31.994625-31.994625l320.806316 0c17.545439 0 31.306568 14.105157 31.306568 31.994625l0 63.989249L319.946246 223.962372 319.946246 159.973123 319.946246 159.973123z" p-id="2737" fill="#d81e06"></path>
                <path d="M736.048379 960.010751 288.123635 960.010751c-52.980346 0-95.983874-43.003528-95.983874-95.983874L192.139761 383.591466c0-17.717453 14.277171-31.994625 31.994625-31.994625s31.994625 14.277171 31.994625 31.994625l0 480.435411c0 17.717453 14.449185 31.994625 31.994625 31.994625l448.096758 0c17.717453 0 31.994625-14.277171 31.994625-31.994625L768.215018 384.795565c0-17.717453 14.277171-31.994625 31.994625-31.994625s31.994625 14.277171 31.994625 31.994625l0 479.231312C832.032253 916.835209 789.028725 960.010751 736.048379 960.010751z" p-id="2738" fill="#d81e06"></path>
              </svg>
            </span>
          </div>
          <ul>${html}</ul>
          <span class="time">${__('lastChangeTime')}: ${dayjs(time).format('YYYY-MM-DD HH:mm:ss')}</span>
        </div>
      `);
      debug('任务已添加到容器', { item });
    } catch (error) {
      debug('添加任务到容器时出错', { error, item });
      throwError(error as Error, 'History.appendTaskToContainer');
    }
  }

  /**
   * 绑定删除事件的私有方法
   *
   * @returns {void}
   * @throws {Error} 如果在绑定过程中发生错误，将抛出错误
   *
   * @description
   * 该方法为所有删除按钮绑定点击事件。
   * 点击删除按钮时，会从存储中删除对应的任务数据，
   * 并从页面中移除相应的任务卡片元素。
   * 操作成功或失败都会显示相应的提示信息。
   */
  #bindDeleteEvent(): void {
    try {
      debug('开始绑定删除事件');
      $('span.delete-task').on('click', function () {
        const itemName = $(this).attr('data-name');
        debug('点击删除按钮', { itemName });

        if (!itemName) {
          debug('删除失败：未找到任务名称');
          Swal.fire({
            title: __('clearTaskFailed'),
            icon: 'error'
          });
          return;
        }

        GM_deleteValue(itemName);
        $(`div.card[data-name="${itemName}"]`).remove();
        debug('任务删除成功', { itemName });
        Swal.fire({
          title: __('clearTaskFinished'),
          text: itemName,
          icon: 'success'
        });
      });
      debug('删除事件绑定完成');
    } catch (error) {
      debug('绑定删除事件时出错', { error });
      throwError(error as Error, 'History.bindDeleteEvent');
    }
  }
}

export default History;
