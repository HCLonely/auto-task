/*
 * @Author       : HCLonely
 * @Date         : 2021-12-25 19:00:53
 * @LastEditTime : 2025-08-18 19:05:24
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/scripts/website/Setting.ts
 * @Description  : 设置页面
 */

import __ from '../tools/i18n';
import { changeGlobalOptions, saveData } from '../globalOptionsEdit';
import whiteListOptions from '../social/whiteList';
import throwError from '../tools/throwError';
import Twitter from '../social/Twitter';
import { getInfo } from '../social/Youtube';
import Swal from 'sweetalert2';
import syncOptions from '../dataSync';
import { debug } from '../tools/debug';
import browser from 'browser-tool';

// 定义常量和类型
const VALID_SIDES_X = ['right', 'left'] as const;
const VALID_SIDES_Y = ['top', 'bottom'] as const;
type SideX = typeof VALID_SIDES_X[number];
type SideY = typeof VALID_SIDES_Y[number];
type SocialType = 'twitterUser' | 'youtubeChannel';

interface PositionConfig {
  distance: string;
  sideX: SideX;
  sideY: SideY;
}

/**
 * 表示设置页面的类。
 *
 * @class Setting
 * @description
 * 该类用于管理设置页面的功能，包括保存全局选项、同步数据、查看任务历史记录等。
 * 提供了一系列方法来处理用户输入和界面交互。
 *
 * @property {string} name - 设置页面的名称。
 * @property {Array<string>} buttons - 包含可用按钮的名称数组。
 * @property {Function} syncData - 同步数据的选项。
 *
 * @method tasksHistory - 打开任务历史记录页面。
 * @method static test - 检查当前域名和路径是否为设置页面。
 * @method before - 在执行操作之前清空页面内容并添加类。
 * @method after - 初始化页面设置并处理用户输入。
 * @method saveGlobalOptions - 保存当前的全局设置。
 * @method #getId - 获取社交媒体ID。
 * @method #environment - 展示环境信息。
 */
class Setting {
  readonly name = 'Setting';
  readonly buttons: string[] = [
    'saveGlobalOptions',
    'syncData',
    'tasksHistory'
  ];
  readonly syncData = syncOptions;

  // 私有属性存储常用的选择器
  private readonly selectors = {
    body: 'body',
    autoTaskInfo: '#auto-task-info',
    autoTaskButtons: '#auto-task-buttons',
    showButtonDiv: 'div.show-button-div',
    positionInputs: 'input[name^="position"]',
    hotKeyInputs: 'input[name^="hotKey"]'
  };

  /**
   * 打开任务历史记录的函数
   *
   * @returns {void} 无返回值。
   *
   * @description
   * 该方法用于在新标签页中打开任务历史记录页面。
   * 用户可以通过此方法查看之前的任务记录。
   */
  tasksHistory(): void {
    debug('打开任务历史记录页面');
    GM_openInTab('https://auto-task.hclonely.com/history.html', { active: true });
  }

  /**
   * 检查当前域名和路径是否为设置页面的静态方法
   *
   * @returns {boolean} 如果当前域名为 'auto-task.hclonely.com' 或 'auto-task.js.org' 且路径为 '/setting.html'，则返回 true；否则返回 false。
   *
   * @description
   * 该方法通过比较当前窗口的域名和路径来判断是否为设置页面。
   * 如果域名和路径匹配，则返回 true；否则返回 false。
   */
  static test(): boolean {
    const { host, pathname } = window.location;
    const isMatch = ['auto-task.hclonely.com', 'auto-task.js.org'].includes(host) && pathname === '/setting.html';
    debug('检查设置页面匹配', { host, pathname, isMatch });
    return isMatch;
  }

  /**
   * 在执行操作之前的函数
   *
   * @returns {void} 无返回值。
   *
   * @description
   * 该方法在执行操作之前清空页面的主体内容，并为主体添加 'auto-task-options' 类。
   * 这通常用于重置页面状态，以便进行新的操作或设置。
   */
  before(): void {
    try {
      debug('开始清空页面内容');
      $(this.selectors.body)
        .html('')
        .addClass('auto-task-options');
      debug('页面内容已清空');
    } catch (error) {
      debug('清空页面内容失败', { error });
      throwError(error as Error, 'Setting.before');
    }
  }

  /**
   * 页面加载后的的方法
   *
   * @returns {void} 无返回值。
   *
   * @throws {Error} 如果在处理过程中发生错误，将抛出错误。
   *
   * @description
   * 该方法用于初始化页面设置，包括环境配置和全局选项的更改。
   * 为 Twitter 和 YouTube 的验证输入框添加按钮，并绑定点击事件以获取用户ID。
   * 监听与按钮位置相关的输入框变化，根据输入的值动态调整按钮和显示区域的位置。
   * 处理热键输入，允许用户通过按键组合设置热键。
   */
  async after(): Promise<void> {
    try {
      debug('开始初始化设置页面');
      await this.#initializeEnvironment();
      this.#initializeGlobalSettings();
      this.#setupSocialButtons();
      this.#setupPositionHandlers();
      this.#setupHotKeyHandlers();
      debug('设置页面初始化完成');
    } catch (error) {
      debug('设置页面初始化失败', { error });
      throwError(error as Error, 'Setting.after');
    }
  }

  /**
   * 保存全局选项的方法
   *
   * @returns {void} 无返回值。
   *
   * @description
   * 该方法用于保存当前的全局设置。
   * 调用 `saveData` 函数以执行保存操作。
   */
  saveGlobalOptions(): void {
    try {
      debug('开始保存全局选项');
      saveData();
      debug('全局选项保存完成');
    } catch (error) {
      debug('保存全局选项失败', { error });
      throwError(error as Error, 'Setting.saveGlobalOptions');
    }
  }

  /**
   * 初始化环境设置
   *
   * @private
   * @returns {void} 无返回值
   * @throws {Error} 如果在初始化过程中发生错误，将抛出错误
   *
   * @description
   * 该方法获取用户代理信息并生成环境信息的 HTML 表单。
   * 将生成的环境信息添加到页面主体中。
   */
  async #initializeEnvironment(): Promise<void> {
    try {
      debug('开始初始化环境信息');
      const userAgent = await browser.getInfo();
      debug('获取用户代理信息', { userAgent });
      const environmentHtml = this.#generateEnvironmentHtml(userAgent);
      $(this.selectors.body).append(`<h2>${__('environment')}</h2>${environmentHtml}`);
      debug('环境信息初始化完成');
    } catch (error) {
      debug('初始化环境信息失败', { error });
      throwError(error as Error, 'Setting.initializeEnvironment');
    }
  }

  /**
   * 生成环境信息HTML
   *
   * @private
   * @param {any} userAgent - 用户代理信息对象，包含操作系统和浏览器信息
   * @returns {string} 包含环境信息的 HTML 表格字符串
   *
   * @description
   * 该方法根据传入的用户代理信息生成一个包含环境详情的 HTML 表格。
   * 表格包含操作系统、浏览器、脚本管理器和脚本本身的信息。
   */
  #generateEnvironmentHtml(userAgent: any): string {
    return `
      <form id="environmentForm" class="auto-task-form">
        <table class="auto-task-table">
          <thead>
            <tr>
              <td>${__('type')}</td>
              <td>${__('name')}</td>
              <td>${__('version')}</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${__('os')}</td>
              <td>${userAgent.system}</td>
              <td>${userAgent.systemVersion}</td>
            </tr>
            <tr>
              <td>${__('browser')}</td>
              <td>${userAgent.browser}</td>
              <td>${userAgent.browserVersion}</td>
            </tr>
            <tr>
              <td>${__('scriptManager')}</td>
              <td>${GM_info.scriptHandler}</td>
              <td>${GM_info.version}</td>
            </tr>
            <tr>
              <td>${__('script')}</td>
              <td>${GM_info.script.name}</td>
              <td>${GM_info.script.version}</td>
            </tr>
          </tbody>
        </table>
      </form>
    `;
  }

  /**
   * 初始化全局设置
   *
   * @private
   * @returns {void} 无返回值
   *
   * @description
   * 该方法初始化页面的全局选项和白名单选项。
   * 调用 changeGlobalOptions 和 whiteListOptions 方法进行初始化。
   */
  #initializeGlobalSettings(): void {
    debug('开始初始化全局设置');
    changeGlobalOptions('page');
    whiteListOptions('page');
    debug('全局设置初始化完成');
  }

  /**
   * 设置社交媒体按钮
   *
   * @private
   * @returns {void} 无返回值
   *
   * @description
   * 该方法为 Twitter 和 YouTube 验证添加获取 ID 的按钮。
   * 为每个按钮绑定点击事件处理器。
   */
  #setupSocialButtons(): void {
    debug('开始设置社交媒体按钮');
    this.#addSocialButton('other.twitterVerifyId', 'getTwitterUserId', 'twitterUser');
    this.#addSocialButton('other.youtubeVerifyChannel', 'getYoutubeChannelId', 'youtubeChannel');
    debug('社交媒体按钮设置完成');
  }

  /**
   * 添加社交媒体按钮
   *
   * @private
   * @param {string} inputName - 输入框的 name 属性值
   * @param {string} buttonId - 按钮的 ID
   * @param {SocialType} socialType - 社交媒体类型
   * @returns {void} 无返回值
   *
   * @description
   * 该方法在指定的输入框后添加一个按钮，用于获取社交媒体 ID。
   * 为添加的按钮绑定点击事件，点击时调用 #getId 方法。
   */
  #addSocialButton(inputName: string, buttonId: string, socialType: SocialType): void {
    debug('添加社交媒体按钮', { inputName, buttonId, socialType });
    $(`input[name="${inputName}"]`).after(
      `<button id="${buttonId}" type="button">${__(`get${buttonId}`)}</button>`
    );
    $(`#${buttonId}`).on('click', () => this.#getId(socialType));
    debug('社交媒体按钮添加完成');
  }

  /**
   * 设置位置处理器
   *
   * @private
   * @returns {void} 无返回值
   *
   * @description
   * 该方法为所有位置相关的输入框添加输入事件监听器。
   * 当输入值改变时，更新相应元素的位置。
   */
  #setupPositionHandlers(): void {
    debug('开始设置位置处理器');
    $(this.selectors.positionInputs).on('input', (event) => {
      const input = $(event.target);
      const type = input.attr('name')?.replace('position.', '');
      if (!type) {
        debug('无效的位置类型');
        return;
      }

      debug('处理位置变化', { type });
      this.#handlePositionChange(type);
    });
    debug('位置处理器设置完成');
  }

  /**
   * 处理位置变化
   *
   * @private
   * @param {string} type - 位置类型
   * @returns {void} 无返回值
   *
   * @description
   * 该方法处理位置输入的变化，获取新的位置配置并更新目标元素的位置。
   * 包括验证位置值的有效性和更新 DOM 元素的样式。
   */
  #handlePositionChange(type: string): void {
    debug('开始处理位置变化', { type });
    const config = this.#getPositionConfig(type);
    if (!config) {
      debug('获取位置配置失败');
      return;
    }

    const { distance, sideX, sideY } = config;
    if (!this.#isValidPosition(distance, sideX, sideY)) {
      debug('无效的位置配置', { distance, sideX, sideY });
      return;
    }

    const [x, y] = distance.split(',');
    const target = this.#getPositionTarget(type);
    if (!target) {
      debug('获取目标元素失败');
      return;
    }

    debug('更新元素位置', { target, sideX, sideY, x, y });
    this.#updateElementPosition(target, sideX, sideY, x, y);
  }

  /**
   * 获取位置配置
   *
   * @private
   * @param {string} type - 位置类型
   * @returns {PositionConfig | null} 返回位置配置对象，如果无法获取则返回 null
   *
   * @description
   * 该方法根据类型获取位置相关的配置信息，包括距离和方向。
   * 从对应的输入框中获取值并返回配置对象。
   */
  #getPositionConfig(type: string): PositionConfig | null {
    debug('获取位置配置', { type });
    const baseType = type.replace(/(?:button|log|show)(?:SideX|SideY|Distance)$/, '');
    const distance = $(`input[name="position.${baseType}Distance"]`).val() as string;
    const sideX = $(`input[name="position.${baseType}SideX"]`).val() as SideX;
    const sideY = $(`input[name="position.${baseType}SideY"]`).val() as SideY;

    const config = { distance, sideX, sideY };
    debug('位置配置', config);
    return config;
  }

  /**
   * 验证位置是否有效
   *
   * @private
   * @param {string} distance - 距离值，格式为 "x,y"
   * @param {SideX} sideX - 水平方向
   * @param {SideY} sideY - 垂直方向
   * @returns {boolean} 如果位置配置有效则返回 true，否则返回 false
   *
   * @description
   * 该方法验证位置配置的有效性，检查方向值是否有效以及距离格式是否正确。
   */
  #isValidPosition(distance: string, sideX: SideX, sideY: SideY): boolean {
    const isValid = VALID_SIDES_X.includes(sideX) &&
      VALID_SIDES_Y.includes(sideY) &&
      /^[\d]+?,[\d]+$/.test(distance);
    debug('验证位置配置', { distance, sideX, sideY, isValid });
    return isValid;
  }

  /**
   * 获取位置目标元素
   *
   * @private
   * @param {string} type - 位置类型
   * @returns {string} 返回目标元素的选择器
   *
   * @description
   * 该方法根据位置类型返回对应的 DOM 元素选择器。
   * 支持按钮、显示按钮和日志元素的选择器获取。
   */
  #getPositionTarget(type: string): string {
    const targetMap = {
      button: this.selectors.autoTaskButtons,
      showButton: this.selectors.showButtonDiv,
      log: this.selectors.autoTaskInfo
    };

    const baseType = type.replace(/(?:SideX|SideY|Distance)$/, '');
    return targetMap[baseType as keyof typeof targetMap];
  }

  /**
   * 更新元素位置
   *
   * @private
   * @param {string} selector - 目标元素的选择器
   * @param {SideX} sideX - 水平方向
   * @param {SideY} sideY - 垂直方向
   * @param {string} x - X 坐标值
   * @param {string} y - Y 坐标值
   * @returns {void} 无返回值
   *
   * @description
   * 该方法更新指定元素的位置样式。
   * 设置元素的位置并清除相反方向的样式。
   */
  #updateElementPosition(selector: string, sideX: SideX, sideY: SideY, x: string, y: string): void {
    debug('更新元素位置', { selector, sideX, sideY, x, y });
    const $element = $(selector);
    const oppositeX = sideX === 'right' ? 'left' : 'right';
    const oppositeY = sideY === 'top' ? 'bottom' : 'top';

    $element
      .css(sideX, `${x}px`)
      .css(sideY, `${y}px`)
      .css(oppositeX, '')
      .css(oppositeY, '');
    debug('元素位置更新完成');
  }

  /**
   * 设置热键处理器
   *
   * @private
   * @returns {void} 无返回值
   *
   * @description
   * 该方法为热键输入框设置事件处理器。
   * 将输入框设置为只读并添加键盘事件监听器。
   */
  #setupHotKeyHandlers(): void {
    debug('开始设置热键处理器');
    $(this.selectors.hotKeyInputs)
      .attr('readonly', 'readonly')
      .off('keydown')
      .on('keydown', this.#handleHotKeyPress);
    debug('热键处理器设置完成');
  }

  /**
   * 处理热键按下事件
   *
   * @private
   * @param {JQuery.KeyDownEvent} event - 键盘事件对象
   * @returns {void} 无返回值
   *
   * @description
   * 该方法处理热键输入框的键盘事件。
   * 检测功能键（Alt、Ctrl、Shift）的组合并更新输入框的值。
   */
  #handleHotKeyPress(event: JQuery.KeyDownEvent): void {
    debug('处理热键按下事件', { key: event.key });
    const functionKeys = [];
    if (event.altKey) functionKeys.push('alt');
    if (event.ctrlKey) functionKeys.push('ctrl');
    if (event.shiftKey) functionKeys.push('shift');

    const key = event.key.length === 1 ? event.key.toLowerCase() : '';
    const value = functionKeys.length ? `${functionKeys.join(' + ')} + ${key}` : key;
    debug('设置热键值', { functionKeys, key, value });
    $(event.target).val(value);
  }

  /**
   * 获取社交媒体ID的方法
   *
   * @param {string} social - 社交媒体类型，例如 'twitterUser' 或 'youtubeChannel'。
   * @returns {void} 无返回值。
   *
   * @throws {Error} 如果在获取过程中发生错误，将抛出错误。
   *
   * @description
   * 该方法弹出一个输入框，允许用户输入社交媒体链接以获取对应的ID。
   * 根据社交媒体类型，调用相应的API获取ID并将其填入输入框中。
   * 如果输入的链接为空，则不执行任何操作。
   */
  async #getId(social: SocialType): Promise<void> {
    try {
      debug('开始获取社交媒体ID', { social });
      const result = await Swal.fire({
        title: __('getId', __(social)),
        html: this.#generateIdInputHtml(social),
        showCancelButton: true,
        cancelButtonText: __('close'),
        showConfirmButton: false
      });

      if (!result.isDismissed) {
        debug('用户确认获取ID');
        await this.#handleIdRetrieval(social);
      } else {
        debug('用户取消获取ID');
      }
    } catch (error) {
      debug('获取社交媒体ID失败', { error });
      throwError(error as Error, 'Setting.getId');
    }
  }

  /**
   * 生成ID输入HTML
   *
   * @private
   * @param {SocialType} social - 社交媒体类型
   * @returns {string} 返回包含输入框和按钮的 HTML 字符串
   *
   * @description
   * 该方法生成用于获取社交媒体 ID 的输入框和按钮的 HTML。
   */
  #generateIdInputHtml(social: SocialType): string {
    return `
      <input id="socialLink" class="swal2-input" placeholder="在此处输入链接获取id">
      <button id="link2id" data-type="${social}" class="swal2-confirm swal2-styled">获取id</button>
    `;
  }

  /**
   * 处理ID获取
   *
   * @private
   * @param {SocialType} social - 社交媒体类型
   * @returns {Promise<void>} 无返回值的 Promise
   *
   * @description
   * 该方法处理社交媒体 ID 的获取过程。
   * 根据不同的社交媒体类型调用相应的 API 获取 ID。
   * 获取到 ID 后更新输入框的值。
   */
  async #handleIdRetrieval(social: SocialType): Promise<void> {
    const link = $('#socialLink').val() as string;
    if (!link) {
      debug('链接为空');
      return;
    }

    debug('开始处理ID获取', { social, link });
    let id = '';
    if (social === 'twitterUser') {
      const name = link.match(/https:\/\/twitter\.com\/(.+)/)?.[1] || link;
      debug('获取Twitter用户ID', { name });
      id = await new Twitter().userName2id(name) || '';
    } else if (social === 'youtubeChannel') {
      const name = this.#extractYoutubeUrl(link);
      debug('获取YouTube频道信息', { name });
      const info = await getInfo(name, 'channel');
      id = info?.params?.channelId || '';
    }

    debug('ID获取结果', { id });
    $('#socialLink').val(id);
  }

  /**
   * 提取YouTube URL
   *
   * @private
   * @param {string} link - 原始链接
   * @returns {string} 提取后的 YouTube URL
   *
   * @description
   * 该方法从 Google 搜索结果链接中提取 YouTube URL。
   * 如果输入的是 Google 搜索结果链接，则提取其中的 YouTube URL；
   * 否则返回原始链接。
   */
  #extractYoutubeUrl(link: string): string {
    debug('提取YouTube URL', { link });
    if (/^https:\/\/(www\.)?google\.com.*?\/url\?.*?url=https:\/\/www.youtube.com\/.*/.test(link)) {
      const extractedUrl = link.match(/url=(https:\/\/www\.youtube\.com\/.*)/)?.[1] || link;
      debug('从Google搜索结果提取URL', { extractedUrl });
      return extractedUrl;
    }
    return link;
  }
}

export default Setting;
