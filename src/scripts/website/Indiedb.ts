/*
 * @Author       : HCLonely
 * @Date         : 2021-11-08 14:37:33
 * @LastEditTime : 2025-08-18 19:06:27
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/scripts/website/Indiedb.ts
 * @Description  : https://www.indiedb.com/giveaways
 */

import Swal from 'sweetalert2';
import throwError from '../tools/throwError';
import echoLog from '../echoLog';
import __ from '../tools/i18n';
import { getUrlQuery } from '../tools/tools';
import httpRequest from '../tools/httpRequest';
import { globalOptions } from '../globalOptions';
import { debug } from '../tools/debug';

declare function urlPath(value?: string): string

/**
 * 表示 IndieDB 网站的操作类。
 *
 * @class Indiedb
 * @description
 * 该类提供了与 IndieDB 网站交互的功能，包括检查用户登录状态、执行任务和加入抽奖等操作。
 *
 * @property {string} name - 类的名称。
 * @property {Array<string>} buttons - 可用的按钮列表。
 *
 * @method static test - 检查当前域名是否为 IndieDB 网站。
 * @returns {boolean} 如果当前域名为 'www.indiedb.com'，则返回 true；否则返回 false。
 *
 * @method after - 页面加载后的异步方法，检查用户登录状态和剩余密钥状态。
 * @returns {Promise<void>} 无返回值。
 * @throws {Error} 如果在检查过程中发生错误，将抛出错误。
 *
 * @method doTask - 执行任务的异步方法。
 * @returns {Promise<boolean>} 如果任务成功执行，则返回 true；否则返回 false。
 * @throws {Error} 如果在检查过程中发生错误，将抛出错误。
 *
 * @private
 * @method #join - 加入抽奖的私有异步方法。
 * @returns {Promise<boolean>} 如果成功加入抽奖，则返回 true；否则返回 false。
 * @throws {Error} 如果在检查过程中发生错误，将抛出错误。
 *
 * @private
 * @method #do - 执行任务的私有异步方法。
 * @returns {Promise<boolean>} 如果所有任务成功执行，则返回 true；否则返回 false。
 * @throws {Error} 如果在检查过程中发生错误，将抛出错误。
 *
 * @private
 * @method #checkLogin - 检查用户是否已登录的私有方法。
 * @returns {boolean} 如果用户已登录，则返回 true；否则返回 false。
 * @throws {Error} 如果在检查过程中发生错误，将抛出错误。
 *
 * @private
 * @method #checkLeftKey - 检查剩余密钥的私有异步方法。
 * @returns {Promise<boolean>} 如果检查成功或不需要检查，则返回 true；如果发生错误，则返回 false。
 * @throws {Error} 如果在检查过程中发生错误，将抛出错误。
 *
 * @description
 * 该方法按以下顺序执行：
 * 1. 首先检查全局选项中是否启用了检查剩余密钥的功能，如果未启用直接返回 true。
 * 2. 检查页面中是否存在"下次"或"抽奖已关闭"的按钮，如果不存在直接返回 true。
 * 3. 如果存在结束按钮，则弹出警告框提示用户抽奖已结束。
 * 4. 用户在警告框中选择确认时，将关闭当前窗口。
 * 5. 无论用户选择确认还是取消，最终都返回 true（除非发生错误）。
 */
class Indiedb {
  name = 'Indiedb';
  buttons: Array<string> = [
    'doTask'
  ];

  /**
   * 检查当前域名是否为 IndieDB 网站的静态方法
   *
   * @returns {boolean} 如果当前域名为 'www.indiedb.com'，则返回 true；否则返回 false。
   *
   * @description
   * 该方法通过比较当前窗口的域名来判断是否为 IndieDB 网站。
   * 如果域名匹配，则返回 true；否则返回 false。
   */
  static test(): boolean {
    const { host } = window.location;
    const isMatch = host === 'www.indiedb.com';
    debug('检查网站匹配', { host, isMatch });
    return isMatch;
  }

  /**
   * 页面加载后的异步方法
   *
   * @returns {Promise<void>} 无返回值。
   *
   * @throws {Error} 如果在处理过程中发生错误，将抛出错误。
   *
   * @description
   * 该方法首先检查用户是否已登录，如果未登录，则记录警告信息。
   * 然后检查剩余密钥的状态，如果检查失败，则记录相应的警告信息。
   */
  async after(): Promise<void> {
    try {
      debug('开始执行后续操作');
      if (!this.#checkLogin()) {
        debug('检查登录失败');
        echoLog({}).warning(__('checkLoginFailed'));
      }
      if (!await this.#checkLeftKey()) {
        debug('检查剩余密钥失败');
        echoLog({}).warning(__('checkLeftKeyFailed'));
      }
    } catch (error) {
      debug('后续操作失败', { error });
      throwError(error as Error, 'Indiedb.after');
    }
  }

  /**
   * 执行任务的异步方法
   *
   * @returns {Promise<boolean>} 如果任务成功执行，则返回 true；否则返回 false。
   *
   * @throws {Error} 如果在执行过程中发生错误，将抛出错误。
   *
   * @description
   * 该方法首先调用私有方法 `#join` 来加入任务。
   * 如果加入失败，则返回 false。
   * 如果成功加入，则调用私有方法 `#do` 执行任务并返回其结果。
   */
  async doTask(): Promise<boolean> {
    try {
      debug('开始执行任务');
      if (!await this.#join()) {
        debug('加入抽奖失败');
        return false;
      }
      return await this.#do();
    } catch (error) {
      debug('执行任务失败', { error });
      throwError(error as Error, 'Indiedb.doTask');
      return false;
    }
  }

  /**
   * 加入抽奖的私有异步方法
   *
   * @returns {Promise<boolean>} 如果成功加入抽奖，则返回 true；否则返回 false。
   *
   * @throws {Error} 如果在加入过程中发生错误，将抛出错误。
   *
   * @description
   * 该方法检查用户是否已登录，如果未登录，则记录错误信息并返回 false。
   * 然后检查当前按钮是否为"加入抽奖"按钮。
   * 如果是，则发送 POST 请求以加入抽奖。
   * 如果请求成功且返回状态为 200，且响应中包含成功信息，则更新按钮状态并记录成功信息。
   * 如果请求失败或返回错误信息，则记录相应的错误信息并返回 false。
   * 如果按钮文本为"成功"，则直接返回 true。
   * 如果按钮文本不符合预期，则记录警告信息并返回 false。
   */
  async #join(): Promise<boolean> {
    try {
      debug('开始加入抽奖');
      if ($('a.buttonenter:contains(Register to join)').length > 0) {
        debug('需要登录');
        echoLog({}).error(__('needLogin'));
        return false;
      }

      const currentoption = $('a.buttonenter.buttongiveaway');
      const buttonText = currentoption.text();
      debug('检查按钮状态', { buttonText });

      if (/success/gim.test($('a.buttonenter.buttongiveaway').text())) {
        debug('已成功加入抽奖');
        return true;
      }

      if (!/join giveaway/gim.test(buttonText)) {
        debug('需要加入抽奖');
        echoLog({}).warning(__('needJoinGiveaway'));
        return false;
      }

      const logStatus = echoLog({ text: `${__('joiningGiveaway')}...` });
      debug('发送加入请求');
      const { result, statusText, status, data } = await httpRequest({
        url: currentoption.attr('href') as string,
        method: 'POST',
        data: 'ajax=t',
        dataType: 'json',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          Accept: 'application/json, text/javascript, */*; q=0.01',
          Origin: window.location.origin,
          referer: window.location.href
        }
      });

      if (result !== 'Success') {
        debug('请求失败', { result, statusText, status });
        logStatus.error(`${result}:${statusText}(${status})`);
        return false;
      }

      if (data?.status !== 200) {
        debug('尝试备用加入方法');
        if (await this.#join2()) {
          debug('备用加入方法成功');
          logStatus.success('Success');
          return true;
        }
        debug('加入失败', { status: data?.status, statusText: data?.statusText });
        logStatus.error(`Error:${data?.statusText}(${data?.status})`);
        return false;
      }

      if (!data.response?.success) {
        debug('响应失败', { text: data.response?.text });
        logStatus.error(`Error${data.response?.text ? (`:${data.response?.text}`) : ''}`);
        return false;
      }

      debug('加入成功');
      currentoption.addClass('buttonentered').text('Success - Giveaway joined');
      $('#giveawaysjoined').slideDown();
      $('#giveawaysrecommend').slideDown();
      logStatus.success(`Success${data.response?.text ? (`:${data.response?.text}`) : ''}`);
      return true;
    } catch (error) {
      debug('加入抽奖失败', { error });
      throwError(error as Error, 'Indiedb.join');
      return false;
    }
  }

  async #join2(): Promise<boolean> {
    try {
      debug('开始备用加入方法');
      return await new Promise((resolve) => {
        const targetNode = document.getElementById('giveawaysjoined') as HTMLElement;
        const config = { attributes: true };
        const observer = new MutationObserver(() => {
          if ($('#giveawaysjoined').is(':visible')) {
            debug('检测到加入成功');
            resolve(true);
            observer.disconnect();
          }
        });
        observer.observe(targetNode, config);
        debug('点击加入按钮');
        $('a.buttonenter.buttongiveaway')[0]?.click();
        setTimeout(() => {
          debug('加入超时');
          resolve(false);
          observer.disconnect();
        }, 30000);
      });
    } catch (error) {
      debug('备用加入方法失败', { error });
      throwError(error as Error, 'Indiedb.join2');
      return false;
    }
  }

  /**
   * 执行任务的私有异步方法
   *
   * @returns {Promise<boolean>} 如果所有任务成功执行，则返回 true；否则返回 false。
   *
   * @throws {Error} 如果在执行过程中发生错误，将抛出错误。
   *
   * @description
   * 该方法首先从页面中的脚本标签中提取任务ID。
   * 如果成功提取到ID，则遍历已加入的抽奖任务，并对每个任务执行相应的操作。
   * 根据任务的类型（如 Facebook、Twitter、邮件订阅等），发送相应的 AJAX 请求。
   * 如果请求成功且返回状态为成功，则更新任务的状态并记录成功信息。
   * 如果请求失败，则记录错误信息。
   * 最后，等待所有任务完成并返回结果。
   */
  async #do(): Promise<boolean> {
    try {
      debug('开始执行任务');
      const id = $('script').map((index, script) => {
        if (!/\$\(document\)/gim.test(script.innerHTML)) {
          return null;
        }
        return [
          script.innerHTML.match(/"\/[\d]+"/gim)?.[0]?.match(/[\d]+/)?.[0],
          script.innerHTML.match(/"\/newsletter\/ajax\/subscribeprofile\/optin\/[\d]+"/gim)?.[0]?.match(/[\d]+/)?.[0]
        ];
      });

      if (id.length < 2) {
        debug('获取任务ID失败');
        echoLog({}).error(__('getFailed', 'TaskId'));
        return false;
      }

      const pro = [];
      const tasks = $('#giveawaysjoined a[class*=promo]');
      debug('找到任务', { count: tasks.length });

      for (const task of tasks) {
        const promo = $(task);
        if (promo.hasClass('buttonentered')) {
          debug('跳过已完成任务');
          continue;
        }

        const taskText = promo.parents('p').text();
        debug('处理任务', { taskText });
        const status = echoLog({ text: `${__('doing')}:${taskText}...` });

        if (/the-challenge-of-adblock/gim.test(promo.attr('href') as string)) {
          debug('跳过未知任务类型');
          status.error(`Error:${__('unKnownTaskType')}`);
          continue;
        }

        if (/facebookpromo|twitterpromo|visitpromo/gim.test(task.className)) {
          let text = '';
          if (promo.hasClass('facebookpromo')) {
            text = 'facebookpromo';
          } else if (promo.hasClass('twitterpromo')) {
            text = 'twitterpromo';
          } else {
            text = 'visitpromo';
          }

          debug('处理社交媒体任务', { type: text });
          pro.push(this.#handleSocialPromo(text, id[0] as string, status, promo));
        } else if (promo.hasClass('emailoptinpromo')) {
          debug('处理邮件订阅任务');
          pro.push(this.#handleEmailPromo(id[1] as string, status, promo));
        } else if (promo.hasClass('watchingpromo')) {
          debug('处理关注任务');
          pro.push(this.#handleWatchingPromo(promo, status));
        } else {
          debug('处理默认任务');
          pro.push(this.#handleDefaultPromo(promo, status));
        }
      }

      await Promise.all(pro);
      debug('所有任务完成');
      echoLog({}).success(__('allTasksComplete'));
      return true;
    } catch (error) {
      debug('执行任务失败', { error });
      throwError(error as Error, 'Indiedb.do');
      return false;
    }
  }

  /**
   * 处理社交媒体相关的任务
   *
   * @param {string} text - 任务类型，可能是 'facebookpromo'、'twitterpromo' 或 'visitpromo'
   * @param {string} id - 任务的唯一标识符
   * @param {any} status - 用于显示任务状态的日志对象
   * @param {JQuery<HTMLElement>} promo - 任务对应的 DOM 元素的 jQuery 对象
   * @returns {Promise<boolean>} 始终返回 true，表示任务已处理（无论成功与否）
   *
   * @description
   * 该方法通过 AJAX 请求处理社交媒体相关的任务：
   * 1. 发送 POST 请求到对应的任务 URL
   * 2. 如果请求成功且返回成功状态，更新按钮状态并显示成功信息
   * 3. 如果请求失败或返回失败状态，显示错误信息
   * 4. 无论成功与否，都会返回 true 表示任务已处理
   */
  async #handleSocialPromo(text: string, id: string, status: any, promo: JQuery<HTMLElement>): Promise<boolean> {
    try {
      debug('处理社交媒体任务', { text, id });
      return await new Promise((resolve) => {
        $.ajax({
          type: 'POST',
          url: urlPath(`/giveaways/ajax/${text}/${id}`),
          timeout: 60000,
          dataType: 'json',
          data: { ajax: 't' },
          error(response, error, exception) {
            debug('请求失败', { response, error, exception });
            if (window.DEBUG) console.log('%cAuto-Task[Debug]:', 'color:red', { response, error, exception });
            status.error('Error:An error has occurred performing the action requested. Please try again shortly.');
            resolve(true);
          },
          success(response) {
            if (response.success) {
              debug('任务完成', { response });
              status.success(`Success:${response.text}`);
              promo.addClass('buttonentered').closest('p')
                .html(promo.closest('p').find('span')
                  .html());
            } else {
              debug('任务失败', { response });
              status.error(`Error:${response.text}`);
            }
            resolve(true);
          }
        });
      });
    } catch (error) {
      debug('处理社交媒体任务失败', { error });
      throwError(error as Error, 'Indiedb.handleSocialPromo');
      return false;
    }
  }

  /**
   * 处理邮件订阅相关的任务
   *
   * @param {string} id - 任务的唯一标识符
   * @param {any} status - 用于显示任务状态的日志对象
   * @param {JQuery<HTMLElement>} promo - 任务对应的 DOM 元素的 jQuery 对象
   * @returns {Promise<boolean>} 始终返回 true，表示任务已处理（无论成功与否）
   *
   * @description
   * 该方法通过 AJAX 请求处理邮件订阅任务：
   * 1. 发送 POST 请求到邮件订阅的 URL，包含必要的 emailsystoggle 参数
   * 2. 如果请求成功且返回成功状态，切换按钮状态并显示成功信息
   * 3. 如果请求失败或返回失败状态，显示错误信息
   * 4. 无论成功与否，都会返回 true 表示任务已处理
   */
  async #handleEmailPromo(id: string, status: any, promo: JQuery<HTMLElement>): Promise<boolean> {
    try {
      debug('处理邮件订阅任务', { id });
      return await new Promise((resolve) => {
        $.ajax({
          type: 'POST',
          url: urlPath(`/newsletter/ajax/subscribeprofile/optin/${id}`),
          timeout: 60000,
          dataType: 'json',
          data: { ajax: 't', emailsystoggle: 4 },
          error(response, error, exception) {
            debug('请求失败', { response, error, exception });
            if (window.DEBUG) console.log('%cAuto-Task[Debug]:', 'color:red', { response, error, exception });
            status.error('Error:An error has occurred performing the action requested. Please try again shortly.');
            resolve(true);
          },
          success(response) {
            if (response.success) {
              debug('任务完成', { response });
              status.success(`Success:${response.text}`);
              promo.toggleClass('buttonentered').closest('p')
                .html(promo.closest('p').find('span')
                  .html());
            } else {
              debug('任务失败', { response });
              status.error(`Error:${response.text}`);
            }
            resolve(true);
          }
        });
      });
    } catch (error) {
      debug('处理邮件订阅任务失败', { error });
      throwError(error as Error, 'Indiedb.handleEmailPromo');
      return false;
    }
  }

  /**
   * 处理关注相关的任务
   *
   * @param {JQuery<HTMLElement>} promo - 任务对应的 DOM 元素的 jQuery 对象
   * @param {any} status - 用于显示任务状态的日志对象
   * @returns {Promise<boolean>} 始终返回 true，表示任务已处理（无论成功与否）
   *
   * @description
   * 该方法通过 AJAX 请求处理关注类任务：
   * 1. 首先验证任务链接的有效性
   * 2. 从 URL 中提取查询参数并添加必要的 ajax 参数
   * 3. 发送 POST 请求到处理后的 URL
   * 4. 如果请求成功且返回成功状态，切换按钮状态并显示成功信息
   * 5. 如果在任何步骤中发生错误，显示相应的错误信息
   * 6. 无论成功与否，都会返回 true 表示任务已处理
   */
  async #handleWatchingPromo(promo: JQuery<HTMLElement>, status: any): Promise<boolean> {
    try {
      debug('处理关注任务');
      return await new Promise((resolve) => {
        const href = promo.attr('href');
        if (!href) {
          debug('无效的链接');
          status.error('Error: Invalid href');
          resolve(true);
          return;
        }

        const data = getUrlQuery(href);
        data.ajax = 't';
        const [baseUrl] = href.split(/[?#]/);
        if (!baseUrl) {
          debug('无效的URL');
          status.error('Error: Invalid URL');
          resolve(true);
          return;
        }

        debug('发送请求', { url: baseUrl, data });
        $.ajax({
          type: 'POST',
          url: urlPath(baseUrl),
          timeout: 60000,
          dataType: 'json',
          data,
          error(response, error, exception) {
            debug('请求失败', { response, error, exception });
            if (window.DEBUG) console.log('%cAuto-Task[Debug]:', 'color:red', { response, error, exception });
            status.error('Error:An error has occurred performing the action requested. Please try again shortly.');
            resolve(true);
          },
          success(response) {
            if (response.success) {
              debug('任务完成', { response });
              status.success(`Success:${response.text}`);
              promo.toggleClass('buttonentered').closest('p')
                .html(promo.closest('p').find('span')
                  .html());
            } else {
              debug('任务失败', { response });
              status.error(`Error:${response.text}`);
            }
            resolve(true);
          }
        });
      });
    } catch (error) {
      debug('处理关注任务失败', { error });
      throwError(error as Error, 'Indiedb.handleWatchingPromo');
      return false;
    }
  }

  /**
   * 处理默认类型的任务
   *
   * @param {JQuery<HTMLElement>} promo - 任务对应的 DOM 元素的 jQuery 对象
   * @param {any} status - 用于显示任务状态的日志对象
   * @returns {Promise<boolean>} 始终返回 true，表示任务已处理（无论成功与否）
   *
   * @description
   * 该方法通过 AJAX 请求处理不属于其他特定类型的任务：
   * 1. 首先验证任务链接的有效性
   * 2. 发送带有 ajax 参数的 POST 请求到任务 URL
   * 3. 如果请求成功且返回成功状态，切换按钮状态并显示成功信息
   * 4. 如果在任何步骤中发生错误，显示相应的错误信息
   * 5. 无论成功与否，都会返回 true 表示任务已处理
   */
  async #handleDefaultPromo(promo: JQuery<HTMLElement>, status: any): Promise<boolean> {
    try {
      debug('处理默认任务');
      return await new Promise((resolve) => {
        const href = promo.attr('href');
        if (!href) {
          debug('无效的链接');
          status.error('Error: Invalid href');
          resolve(true);
          return;
        }

        debug('发送请求', { url: href });
        $.ajax({
          type: 'POST',
          url: urlPath(href),
          timeout: 60000,
          dataType: 'json',
          data: { ajax: 't' },
          error(response, error, exception) {
            debug('请求失败', { response, error, exception });
            if (window.DEBUG) console.log('%cAuto-Task[Debug]:', 'color:red', { response, error, exception });
            status.error('Error:An error has occurred performing the action requested. Please try again shortly.');
            resolve(true);
          },
          success(response) {
            if (response.success) {
              debug('任务完成', { response });
              status.success(`Success:${response.text}`);
              promo.toggleClass('buttonentered').closest('p')
                .html(promo.closest('p').find('span')
                  .html());
            } else {
              debug('任务失败', { response });
              status.error(`Error:${response.text}`);
            }
            resolve(true);
          }
        });
      });
    } catch (error) {
      debug('处理默认任务失败', { error });
      throwError(error as Error, 'Indiedb.handleDefaultPromo');
      return false;
    }
  }

  /**
   * 检查用户是否已登录的私有方法
   *
   * @returns {boolean} 如果用户已登录，则返回 true；否则返回 false。
   *
   * @throws {Error} 如果在检查过程中发生错误，将抛出错误。
   *
   * @description
   * 该方法检查全局选项中是否启用了登录检查功能。
   * 如果启用且页面中存在"注册以加入"按钮，则重定向用户到登录页面。
   * 如果没有找到登录链接，则返回 true，表示用户已登录或不需要登录。
   */
  #checkLogin(): boolean {
    try {
      debug('检查登录状态');
      if (!globalOptions.other.checkLogin) {
        debug('跳过登录检查');
        return true;
      }
      if ($('a.buttonenter:contains(Register to join)').length > 0) {
        debug('未登录，重定向到登录页面');
        window.open('/members/login', '_self');
      }
      debug('登录检查完成');
      return true;
    } catch (error) {
      debug('检查登录失败', { error });
      throwError(error as Error, 'Indiedb.checkLogin');
      return false;
    }
  }

  /**
   * 检查剩余密钥的私有异步方法
   *
   * @returns {Promise<boolean>} 如果检查成功或不需要检查，则返回 true；如果发生错误，则返回 false。
   *
   * @throws {Error} 如果在检查过程中发生错误，将抛出错误。
   *
   * @description
   * 该方法按以下顺序执行：
   * 1. 首先检查全局选项中是否启用了检查剩余密钥的功能，如果未启用直接返回 true。
   * 2. 检查页面中是否存在"下次"或"抽奖已关闭"的按钮，如果不存在直接返回 true。
   * 3. 如果存在结束按钮，则弹出警告框提示用户抽奖已结束。
   * 4. 用户在警告框中选择确认时，将关闭当前窗口。
   * 5. 无论用户选择确认还是取消，最终都返回 true（除非发生错误）。
   */
  async #checkLeftKey(): Promise<boolean> {
    try {
      debug('检查剩余密钥');
      if (!globalOptions.other.checkLeftKey) {
        debug('跳过密钥检查');
        return true;
      }

      const hasEndedButton = $('a.buttonenter:contains("next time"), a.buttonenter:contains("Giveaway is closed")').length > 0;
      debug('检查抽奖状态', { hasEndedButton });
      if (!hasEndedButton) return true;

      debug('抽奖已结束，显示确认对话框');
      const { value } = await Swal.fire({
        icon: 'warning',
        title: __('notice'),
        text: __('giveawayEnded'),
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
      debug('检查剩余密钥失败', { error });
      throwError(error as Error, 'Indiedb.checkLeftKey');
      return false;
    }
  }
}

export default Indiedb;
