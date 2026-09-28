/*
 * @Author       : HCLonely
 * @Date         : 2021-12-29 19:53:51
 * @LastEditTime : 2026-09-28 17:38:06
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/scripts/dataSync.ts
 * @Description  : 数据同步
 */

import type { commonObject } from './dataSync.types';
import type { GlobalOptions } from './globalOptions.types';
import throwError from './tools/throwError';
import __ from './tools/i18n';
import httpRequest from './tools/httpRequest';
import { showDialog, toast } from './ui/dialog';
import echoLog from './echoLog';
import { debug } from './tools/debug';

/**
 * 设置 Gist 数据
 *
 * @remarks
 * 该方法使用提前返回的方式处理错误情况：
 * 1. 首先验证请求是否成功
 * 2. 然后验证状态码和内容是否匹配
 * 3. 最后处理成功情况
 * 所有错误都会被记录并返回 false
 *
 * 已捕获的异常通过失败返回值交付，不会从对应的 catch 分支继续抛出。
 *
 * @param token - GitHub 访问令牌，用于身份验证
 * @param gistId - 要更新的 Gist 的 ID
 * @param fileName - 要更新的文件名
 * @param content - 要设置的内容对象，将被序列化为 JSON
 * @returns 返回一个 Promise，解析为布尔值，表示操作是否成功
 */
const setGistData = async (token: string, gistId: string, fileName: string, content: commonObject): Promise<boolean> => {
  try {
    debug('开始设置Gist数据', {
      gistId,
      fileName
    });
    const logStatus = echoLog({
      text: __('settingData')
    });

    const contentData = JSON.stringify({
      files: {
        [fileName]: {
          content: JSON.stringify(content)
        }
      }
    });
    debug('准备发送的数据', {
      contentData
    });

    const {
      result, statusText, status, data
    } = await httpRequest({
      url: `https://api.github.com/gists/${gistId}`,
      headers: {
        Accept: 'application/vnd.github.v3+json',
        Authorization: `token ${token}`
      },
      data: contentData,
      responseType: 'json',
      method: 'POST',
      timeout: 30000
    });

    if (result !== 'Success') {
      debug('设置Gist数据失败', {
        result,
        statusText,
        status
      });
      logStatus.error(`${result}:${statusText}(${status})`);
      return false;
    }

    const expectedContent = JSON.stringify(content);
    if (data?.status !== 200 || data?.response?.files?.[fileName]?.content !== expectedContent) {
      debug('设置Gist数据验证失败', {
        status: data?.status,
        content: data?.response?.files?.[fileName]?.content
      });
      logStatus.error(`Error:${data?.statusText}(${data?.status})`);
      return false;
    }

    debug('设置Gist数据成功');
    logStatus.success();
    return true;
  } catch (error) {
    debug('设置Gist数据发生错误', {
      error
    });
    throwError(error as Error, 'setGistData');
    return false;
  }
};

/**
 * 获取指定 Gist 的数据
 *
 * @remarks
 * 该方法使用提前返回的方式处理各种情况：
 * 1. 首先验证请求是否成功
 * 2. 然后验证状态码
 * 3. 检查内容是否存在
 * 4. 处理测试模式
 * 5. 最后尝试解析内容
 * 所有错误都会被记录并返回 false
 *
 * 已捕获的异常通过失败返回值交付，不会从对应的 catch 分支继续抛出。
 *
 * @param token - GitHub 访问令牌，用于身份验证
 * @param gistId - 要获取的 Gist 的 ID
 * @param fileName - 要获取的文件名
 * @param test - 可选参数，指示是否进行测试，默认为 false
 * @returns 返回一个 Promise
 * 成功时返回全局选项对象，失败时返回 false，测试模式下成功返回 true
 */
const getGistData = async (token: string, gistId: string, fileName: string, test = false): Promise<boolean | GlobalOptions> => {
  try {
    debug('开始获取Gist数据', {
      gistId,
      fileName,
      test
    });
    const logStatus = echoLog({
      text: __('gettingData')
    });

    const {
      result, statusText, status, data
    } = await httpRequest({
      url: `https://api.github.com/gists/${gistId}`,
      headers: {
        Accept: 'application/vnd.github.v3+json',
        Authorization: `token ${token}`
      },
      responseType: 'json',
      method: 'GET',
      timeout: 30000
    });

    if (result !== 'Success') {
      debug('获取Gist数据失败', {
        result,
        statusText,
        status
      });
      logStatus.error(`${result}:${statusText}(${status})`);
      return false;
    }

    if (data?.status !== 200) {
      debug('获取Gist数据状态码错误', {
        status: data?.status
      });
      logStatus.error(`Error:${data?.statusText}(${data?.status})`);
      return false;
    }

    const content = data.response?.files?.[fileName]?.content;

    if (!content) {
      debug('获取的Gist数据为空');
      logStatus.error(`Error:${__('noRemoteData')}`);
      return false;
    }

    if (test) {
      debug('Gist数据测试成功');
      logStatus.success();
      return true;
    }

    try {
      const formatedContent = JSON.parse(content);
      debug('Gist数据解析成功', {
        contentLength: Object.keys(formatedContent).length
      });
      logStatus.success();
      return formatedContent;
    } catch (error) {
      debug('Gist数据解析失败', {
        error
      });
      logStatus.error(`Error:${__('errorRemoteDataFormat')}`);
      console.log('%c%s', 'color:white;background:red', `Auto-Task[Error]: getGistData\n${(error as Error).stack}`);
      return false;
    }
  } catch (error) {
    debug('获取Gist数据发生错误', {
      error
    });
    throwError(error as Error, 'getGistData');
    return false;
  }
};

interface GistOptions {
  TOKEN: string;
  GIST_ID: string;
  FILE_NAME: string;
  SYNC_HISTORY: boolean;
}

/**
 * 同步 Gist 配置选项
 *
 * @remarks
 * 该方法显示一个配置对话框，允许用户：
 * 1. 设置 GitHub Token、Gist ID 和文件名
 * 2. 选择是否同步历史记录
 * 3. 上传或下载数据
 * 所有操作都有适当的错误处理和用户反馈
 *
 * @returns 无返回值
 */
const syncOptions = async (): Promise<void> => {
  const saved = GM_getValue<GistOptions>('gistOptions') || {
    TOKEN: '',
    GIST_ID: '',
    FILE_NAME: '',
    SYNC_HISTORY: true
  };
  try {
    await showDialog({
      title: __('gistOptions'),
      html: `
        <form class="gist-options-form">
          <label for="github-token">Github Token</label>
          <input id="github-token" type="password" class="at-input" autocomplete="off" required />
          <label for="gist-id">Gist ID</label>
          <input id="gist-id" class="at-input" autocomplete="off" required />
          <label for="file-name">${__('fileName')}</label>
          <input id="file-name" class="at-input" autocomplete="off" required />
          <label class="at-checkbox"><input id="sync-history" type="checkbox" />${__('syncHistory')}</label>
          <div class="button-group">
            <button id="upload-data" type="button" class="at-button">${__('upload2gist')}</button>
            <button id="download-data" type="button" class="at-button">${__('downloadFromGist')}</button>
          </div>
        </form>`,
      footer: `<a href="https://auto-task-doc.js.org/guide/#%E6%95%B0%E6%8D%AE%E5%90%8C%E6%AD%A5" target="_blank" rel="noopener noreferrer">${__('help')}</a>`,
      confirmButtonText: __('saveAndTest'),
      showCancelButton: true,
      cancelButtonText: __('close'),
      keepOpenOnConfirm: true,
      /**
       * 处理对话框确认前的校验。
       *
       * @param context - 当前运行上下文。
       * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
       */
      preConfirm: async (context) => {
        const options = readOptions(context.root);
        GM_setValue('gistOptions', options);
        context.status(__('processingData'));
        const success = await getGistData(options.TOKEN, options.GIST_ID, options.FILE_NAME, true);
        context.status(__(success ? 'testSuccess' : 'testFailed'), success ? 'success' : 'error');
        return !!success;
      },
      /**
       * 处理对话框打开事件。
       *
       * @param context - 当前运行上下文。
       */
      onOpen: (context) => {
        /**
         * 按标识查找数据同步对话框中的输入框。
         *
         * @param id - 目标标识。
         * @returns 匹配的输入框元素。
         */
        const field = (id: string): HTMLInputElement => {
          return context.root.querySelector<HTMLInputElement>(`#${id}`)!;
        };
        field('github-token').value = saved.TOKEN;
        field('gist-id').value = saved.GIST_ID;
        field('file-name').value = saved.FILE_NAME;
        field('sync-history').checked = saved.SYNC_HISTORY;
        /**
         * 根据同步方向上传或下载 Gist 配置。
         *
         * @param direction - 操作方向。
         * @returns 在操作完成后兑现的 Promise。
         */
        const transfer = async (direction: 'upload' | 'download'): Promise<void> => {
          await context.run(async () => {
            // Snapshot the current form before any asynchronous work. No dialog replacement or global handlers.
            const options = readOptions(context.root);
            GM_setValue('gistOptions', options);
            /**
             * 检查目标是否包含在集合中。
             *
             * @param name - 目标名称。
             * @returns 输入是否满足当前校验条件。
             */
            const include = (name: string): boolean => {
              return name !== 'gistOptions' &&
              !/^[\w]+?Auth$/.test(name) && (options.SYNC_HISTORY || !/^[\w]+?Tasks-/.test(name));
            };
            if (direction === 'upload') {
              context.status(__('processingData'));
              const data: commonObject = {};
              for (const name of GM_listValues()) {
                if (include(name)) {
                  data[name] = GM_getValue(name);
                }
              }
              context.status(__('updatingData'));
              const success = await setGistData(options.TOKEN, options.GIST_ID, options.FILE_NAME, data);
              context.status(__(success ? 'syncDataSuccess' : 'syncDataFailed'), success ? 'success' : 'error');
            } else {
              context.status(__('downloadingData'));
              const data = await getGistData(options.TOKEN, options.GIST_ID, options.FILE_NAME);
              if (!data || typeof data !== 'object' || Array.isArray(data)) {
                context.status(__('checkedNoData'), 'error');
                return;
              }
              context.status(__('savingData'));
              for (const [name, value] of Object.entries(data)) {
                if (include(name)) {
                  GM_setValue(name, value);
                }
              }
              context.status(__('syncDataSuccess'), 'success');
            }
          });
        };
        context.root.querySelector('#upload-data')!.addEventListener('click', () => {
          void transfer('upload');
        });
        context.root.querySelector('#download-data')!.addEventListener('click', () => {
          void transfer('download');
        });
      }
    });
  } catch (error) {
    toast({
      title: __('error'),
      text: error instanceof Error ? error.message : String(error),
      icon: 'error'
    });
  }
};

/**
 * 读取并应用已保存的配置选项。
 *
 * @param root - 查找或渲染的根节点。
 * @returns 从表单读取的 Gist 同步配置。
 * @throws Error - 触发 __('saveAndTestNotice') 错误条件时抛出。
 */
const readOptions = (root: HTMLDialogElement): GistOptions => {
  /**
   * 读取当前值。
   *
   * @param id - 目标标识。
   * @returns 处理后的字符串。
   */
  const value = (id: string): string => {
    return root.querySelector<HTMLInputElement>(`#${id}`)!.value.trim();
  };
  const options = {
    TOKEN: value('github-token'),
    GIST_ID: value('gist-id'),
    FILE_NAME: value('file-name'),
    SYNC_HISTORY: root.querySelector<HTMLInputElement>('#sync-history')!.checked
  };
  if (!options.TOKEN || !options.GIST_ID || !options.FILE_NAME) {
    throw new Error(__('saveAndTestNotice'));
  }
  return options;
};

export default syncOptions;
