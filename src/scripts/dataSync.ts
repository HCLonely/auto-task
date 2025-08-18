/*
 * @Author       : HCLonely
 * @Date         : 2021-12-29 19:53:51
 * @LastEditTime : 2025-08-18 19:04:52
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/scripts/dataSync.ts
 * @Description  : 数据同步
 */

import throwError from './tools/throwError';
import __ from './tools/i18n';
import httpRequest from './tools/httpRequest';
import Swal from 'sweetalert2';
import echoLog from './echoLog';
import { debug } from './tools/debug';

// 在文件顶部添加类型声明
declare global {
  interface Window {
    handleUpload: () => Promise<void>;
    handleDownload: () => Promise<void>;
  }
}

/**
 * 设置 Gist 数据
 *
 * @param {string} token - GitHub 访问令牌，用于身份验证
 * @param {string} gistId - 要更新的 Gist 的 ID
 * @param {string} fileName - 要更新的文件名
 * @param {commonObject} content - 要设置的内容对象，将被序列化为 JSON
 *
 * @returns {Promise<boolean>} 返回一个 Promise，解析为布尔值，表示操作是否成功
 * @throws {Error} 如果在设置 Gist 数据的过程中发生错误
 *
 * @description
 * 该方法使用提前返回的方式处理错误情况：
 * 1. 首先验证请求是否成功
 * 2. 然后验证状态码和内容是否匹配
 * 3. 最后处理成功情况
 * 所有错误都会被记录并返回 false
 */
const setGistData = async (token: string, gistId: string, fileName: string, content: commonObject): Promise<boolean> => {
  try {
    debug('开始设置Gist数据', { gistId, fileName });
    const logStatus = echoLog({ text: __('settingData') });

    const contentData = JSON.stringify({
      files: {
        [fileName]: {
          content: JSON.stringify(content)
        }
      }
    });
    debug('准备发送的数据', { contentData });

    const { result, statusText, status, data } = await httpRequest({
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
      debug('设置Gist数据失败', { result, statusText, status });
      logStatus.error(`${result}:${statusText}(${status})`);
      return false;
    }

    const expectedContent = JSON.stringify(content);
    if (data?.status !== 200 || data?.response?.files?.[fileName]?.content !== expectedContent) {
      debug('设置Gist数据验证失败', { status: data?.status, content: data?.response?.files?.[fileName]?.content });
      logStatus.error(`Error:${data?.statusText}(${data?.status})`);
      return false;
    }

    debug('设置Gist数据成功');
    logStatus.success();
    return true;
  } catch (error) {
    debug('设置Gist数据发生错误', { error });
    throwError(error as Error, 'setGistData');
    return false;
  }
};

/**
 * 获取指定 Gist 的数据
 *
 * @param {string} token - GitHub 访问令牌，用于身份验证
 * @param {string} gistId - 要获取的 Gist 的 ID
 * @param {string} fileName - 要获取的文件名
 * @param {boolean} [test=false] - 可选参数，指示是否进行测试，默认为 false
 *
 * @returns {Promise<boolean | globalOptions>} 返回一个 Promise
 *          成功时返回全局选项对象，失败时返回 false，测试模式下成功返回 true
 * @throws {Error} 如果在获取 Gist 数据的过程中发生错误
 *
 * @description
 * 该方法使用提前返回的方式处理各种情况：
 * 1. 首先验证请求是否成功
 * 2. 然后验证状态码
 * 3. 检查内容是否存在
 * 4. 处理测试模式
 * 5. 最后尝试解析内容
 * 所有错误都会被记录并返回 false
 */
const getGistData = async (token: string, gistId: string, fileName: string, test = false): Promise<boolean | globalOptions> => {
  try {
    debug('开始获取Gist数据', { gistId, fileName, test });
    const logStatus = echoLog({ text: __('gettingData') });

    const { result, statusText, status, data } = await httpRequest({
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
      debug('获取Gist数据失败', { result, statusText, status });
      logStatus.error(`${result}:${statusText}(${status})`);
      return false;
    }

    if (data?.status !== 200) {
      debug('获取Gist数据状态码错误', { status: data?.status });
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
      debug('Gist数据解析成功', { contentLength: Object.keys(formatedContent).length });
      logStatus.success();
      return formatedContent;
    } catch (error) {
      debug('Gist数据解析失败', { error });
      logStatus.error(`Error:${__('errorRemoteDataFormat')}`);
      console.log('%c%s', 'color:white;background:red', `Auto-Task[Error]: getGistData\n${(error as Error).stack}`);
      return false;
    }
  } catch (error) {
    debug('获取Gist数据发生错误', { error });
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
 * @returns {Promise<void>} 无返回值
 * @throws {Error} 如果在同步过程中发生错误
 *
 * @description
 * 该方法显示一个配置对话框，允许用户：
 * 1. 设置 GitHub Token、Gist ID 和文件名
 * 2. 选择是否同步历史记录
 * 3. 上传或下载数据
 * 所有操作都有适当的错误处理和用户反馈
 */
const syncOptions = async (): Promise<void> => {
  try {
    debug('开始同步选项配置');
    const defaultOptions: GistOptions = {
      TOKEN: '',
      GIST_ID: '',
      FILE_NAME: '',
      SYNC_HISTORY: true
    };

    let syncOptions = GM_getValue<GistOptions>('gistOptions') || defaultOptions;
    debug('获取已保存的同步选项', syncOptions);

    const createForm = (options: GistOptions): string => `
      <div class="gist-options-form">
        <p>
          <label for="github-token">Github Token</label>
          <input
            id="github-token"
            class="swal2-input"
            placeholder="Github Token"
            value="${options.TOKEN}"
            autocomplete="off"
            spellcheck="false"
          />
        </p>
        <p>
          <label for="gist-id">Gist ID</label>
          <input
            id="gist-id"
            class="swal2-input"
            placeholder="Gist ID"
            value="${options.GIST_ID}"
            autocomplete="off"
            spellcheck="false"
          />
        </p>
        <p>
          <label for="file-name">${__('fileName')}</label>
          <input
            id="file-name"
            class="swal2-input"
            placeholder="${__('fileName')}"
            value="${options.FILE_NAME}"
            autocomplete="off"
            spellcheck="false"
          />
        </p>
        <p class="sync-history-wrapper">
          <label for="sync-history" class="swal2-checkbox-custom">
            <input
              id="sync-history"
              type="checkbox"
              ${options.SYNC_HISTORY ? 'checked="checked"' : ''}
            />
            <span class="swal2-label">${__('syncHistory')}</span>
          </label>
        </p>
        <div class="button-group">
          <button id="upload-data" type="button" class="swal2-confirm swal2-styled" onclick="handleUpload()">
            ${__('upload2gist')}
          </button>
          <button id="download-data" type="button" class="swal2-confirm swal2-styled" onclick="handleDownload()">
            ${__('downloadFromGist')}
          </button>
        </div>
      </div>
    `;

    /**
     * 显示配置对话框并处理用户交互
     *
     * @returns {Promise<void>} 无返回值
     * @throws {Error} 如果在显示对话框或处理用户交互过程中发生错误
     *
     * @description
     * 该方法显示一个 SweetAlert2 对话框，允许用户：
     * 1. 编辑 Gist 配置选项
     * 2. 测试配置的有效性
     * 3. 保存配置到存储
     * 配置测试成功或失败都会显示相应的提示，并重新显示配置对话框
     */
    const showConfigDialog = async (): Promise<void> => {
      debug('显示配置对话框');
      const result = await Swal.fire({
        title: __('gistOptions'),
        html: createForm(syncOptions),
        focusConfirm: false,
        showLoaderOnConfirm: true,
        footer: `<a href="https://auto-task-doc.js.org/guide/#%E6%95%B0%E6%8D%AE%E5%90%8C%E6%AD%A5" target="_blank">${__('help')}</a>`,
        preConfirm: async () => {
          const options: GistOptions = {
            TOKEN: ($('#github-token').val() as string).trim(),
            GIST_ID: ($('#gist-id').val() as string).trim(),
            FILE_NAME: ($('#file-name').val() as string).trim(),
            SYNC_HISTORY: $('#sync-history').prop('checked')
          };
          debug('保存新的同步选项', options);

          GM_setValue('gistOptions', options);
          syncOptions = options;

          return await getGistData(options.TOKEN, options.GIST_ID, options.FILE_NAME, true);
        },
        allowOutsideClick: () => !Swal.isLoading(),
        confirmButtonText: __('saveAndTest'),
        showCancelButton: true,
        cancelButtonText: __('close')
      });

      if (result.value) {
        debug('配置测试成功');
        await Swal.fire({
          icon: 'success',
          title: __('testSuccess'),
          timer: 2000,
          timerProgressBar: true
        });
        await showConfigDialog();
      } else if (result.value !== undefined) {
        debug('配置测试失败');
        await Swal.fire({
          icon: 'error',
          title: __('testFailed'),
          timer: 2000,
          timerProgressBar: true
        });
        await showConfigDialog();
      }
    };

    /**
     * 处理数据上传事件
     *
     * @returns {Promise<void>} 无返回值
     * @throws {Error} 如果在上传过程中发生错误
     *
     * @description
     * 该方法执行以下操作：
     * 1. 验证必要的配置信息是否存在
     * 2. 收集需要同步的数据
     * 3. 过滤掉不需要同步的数据（如认证信息）
     * 4. 根据用户选择决定是否同步历史记录
     * 5. 上传数据到 Gist
     * 6. 显示操作结果提示
     */
    const handleUpload = async (): Promise<void> => {
      debug('开始处理数据上传');
      const options = GM_getValue<GistOptions>('gistOptions');
      if (!options?.TOKEN || !options?.GIST_ID || !options?.FILE_NAME) {
        debug('配置信息不完整');
        await Swal.fire({
          icon: 'error',
          title: __('saveAndTestNotice')
        });
        await showConfigDialog();
        return;
      }

      debug('显示数据处理提示');
      Swal.fire({
        icon: 'info',
        title: __('processingData'),
        allowOutsideClick: false
      });

      const data: commonObject = {};
      const names = GM_listValues();
      const syncHistory = $('#sync-history').prop('checked');
      debug('开始收集数据', { namesCount: names.length, syncHistory });

      for (const name of names) {
        if (name === 'gistOptions' || /^[\w]+?Auth$/.test(name)) continue;
        if (!syncHistory && /^[\w]+?Tasks-/.test(name)) continue;
        data[name] = GM_getValue(name);
      }
      debug('数据收集完成', { dataKeysCount: Object.keys(data).length });

      Swal.update({
        icon: 'info',
        title: __('updatingData')
      });

      const success = await setGistData(options.TOKEN, options.GIST_ID, options.FILE_NAME, data);
      debug('数据上传完成', { success });
      await Swal.fire({
        icon: success ? 'success' : 'error',
        title: __(success ? 'syncDataSuccess' : 'syncDataFailed'),
        timer: 2000,
        timerProgressBar: true
      });
    };

    /**
     * 处理数据下载事件
     *
     * @returns {Promise<void>} 无返回值
     * @throws {Error} 如果在下载过程中发生错误
     *
     * @description
     * 该方法执行以下操作：
     * 1. 验证必要的配置信息是否存在
     * 2. 从 Gist 获取数据
     * 3. 验证获取的数据是否有效
     * 4. 根据用户选择决定是否同步历史记录
     * 5. 将数据保存到本地存储
     * 6. 显示操作结果提示
     */
    const handleDownload = async (): Promise<void> => {
      debug('开始处理数据下载');
      const options = GM_getValue<GistOptions>('gistOptions');
      if (!options?.TOKEN || !options?.GIST_ID || !options?.FILE_NAME) {
        debug('配置信息不完整');
        await Swal.fire({
          icon: 'error',
          title: __('saveAndTestNotice')
        });
        await showConfigDialog();
        return;
      }

      debug('显示数据下载提示');
      Swal.fire({
        icon: 'info',
        title: __('downloadingData'),
        allowOutsideClick: false
      });

      const data = await getGistData(options.TOKEN, options.GIST_ID, options.FILE_NAME);
      if (!data || typeof data === 'boolean') {
        debug('未检测到远程数据');
        await Swal.fire({
          icon: 'error',
          title: __('checkedNoData')
        });
        await showConfigDialog();
        return;
      }

      debug('开始保存数据');
      Swal.update({
        icon: 'info',
        title: __('savingData')
      });

      const syncHistory = $('#sync-history').prop('checked');
      let savedCount = 0;
      for (const [name, value] of Object.entries(data)) {
        if (!syncHistory && /^[\w]+?Tasks-/.test(name)) continue;
        GM_setValue(name, value);
        savedCount += 1;
      }
      debug('数据保存完成', { savedCount });

      await Swal.fire({
        icon: 'success',
        title: __('syncDataSuccess'),
        timer: 2000,
        timerProgressBar: true
      });
    };

    unsafeWindow.handleUpload = handleUpload;
    unsafeWindow.handleDownload = handleDownload;
    await showConfigDialog();
  } catch (error) {
    debug('同步选项发生错误', { error });
    throwError(error as Error, 'syncOptions');
    await Swal.fire({
      icon: 'error',
      title: __('error'),
      text: error instanceof Error ? error.message : 'Unknown error occurred',
      timer: 3000,
      timerProgressBar: true
    });
  }
};

export default syncOptions;
