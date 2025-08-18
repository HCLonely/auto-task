/*
 * @Author       : HCLonely
 * @Date         : 2021-12-11 13:22:26
 * @LastEditTime : 2025-08-18 19:05:44
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/scripts/website/options.ts
 * @Description  : 网站设置
 */

import Swal from 'sweetalert2';
import __ from '../tools/i18n';
import throwError from '../tools/throwError';
import { debug } from '../tools/debug';
interface WebsiteOptions {
  [name: string]: string;
}

interface FormValue {
  name: string;
  value: string;
}

/**
 * 生成网站选项表单的 HTML
 *
 * @param {WebsiteOptions} options - 包含网站选项的对象，键为选项名，值为选项值
 * @returns {string} 返回生成的表单 HTML 字符串
 *
 * @description
 * 该方法根据传入的选项对象生成一个包含表单的 HTML 字符串。
 * 表单包含一个表格，每行显示一个选项及其对应的输入框。
 * 生成的表单具有 'auto-task-form' 类，表格具有 'auto-task-table' 类。
 */
const generateFormHtml = (options: WebsiteOptions): string => {
  debug('开始生成网站选项表单HTML', { options });
  const tableRows = Object.entries(options)
    .map(([option, value]) => `
      <tr>
        <td>${option}</td>
        <td>
          <input
            class="editOption"
            type="text"
            name="${option}"
            value="${value}"
          />
        </td>
      </tr>
    `)
    .join('');

  const formHtml = `
    <form id="websiteOptionsForm" class="auto-task-form">
      <table class="auto-task-table">
        <thead>
          <tr>
            <td>${__('option')}</td>
            <td>${__('value')}</td>
          </tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>
    </form>
  `;
  debug('表单HTML生成完成');
  return formHtml;
};

/**
 * 保存网站选项到存储
 *
 * @param {string} website - 网站的名称
 * @param {WebsiteOptions} options - 包含网站选项的对象
 * @param {FormValue[]} formValues - 表单中的值数组，每个元素包含 name 和 value
 * @returns {void} 无返回值
 *
 * @description
 * 该方法将表单中的值保存到存储中。
 * 遍历表单值数组，更新选项对象中对应的值。
 * 使用 GM_setValue 将更新后的选项保存到存储中。
 * 保存成功后显示成功提示。
 */
const saveOptions = (website: string, options: WebsiteOptions, formValues: FormValue[]): void => {
  debug('开始保存网站选项', { website, formValues });
  formValues.forEach(({ name, value }) => {
    options[name] = value;
    debug('更新选项值', { name, value });
  });

  GM_setValue(`${website}Options`, options);
  debug('选项已保存到存储', { website });

  Swal.fire({
    title: __('changeWebsiteOptionsSuccess'),
    icon: 'success'
  });
};

/**
 * 设置网站选项的函数
 *
 * @param {string} website - 网站的名称，用于存储和识别不同网站的选项
 * @param {WebsiteOptions} options - 包含网站选项的对象，键为选项名，值为选项值
 * @returns {Promise<void>} 无返回值的 Promise
 * @throws {Error} 如果参数无效或在设置过程中发生错误，将抛出错误
 *
 * @description
 * 该方法显示一个对话框，允许用户编辑网站的选项。
 * 对话框包含一个表单，显示当前的选项值。
 * 用户可以修改选项值并保存更改。
 * 所有的操作都包含在 try-catch 块中以处理可能的错误。
 * 使用 SweetAlert2 库来显示对话框和提示信息。
 */
const websiteOptions = async (website: string, options: WebsiteOptions): Promise<void> => {
  try {
    debug('开始设置网站选项', { website });
    // 参数验证
    if (!website || typeof website !== 'string') {
      debug('无效的网站参数', { website });
      throw new Error('Invalid website parameter');
    }

    if (!options || typeof options !== 'object') {
      debug('无效的选项参数', { options });
      throw new Error('Invalid options parameter');
    }

    // 显示选项编辑对话框
    debug('显示选项编辑对话框');
    const result = await Swal.fire({
      title: __('websiteOptions'),
      html: generateFormHtml(options),
      showConfirmButton: true,
      confirmButtonText: __('save'),
      showCancelButton: true,
      cancelButtonText: __('close')
    });

    // 如果用户点击了保存按钮
    if (result.isConfirmed) {
      debug('用户确认保存选项');
      const form = document.getElementById('websiteOptionsForm') as HTMLFormElement;
      if (!form) {
        debug('未找到表单元素');
        throw new Error('Form element not found');
      }

      const formData = $('#websiteOptionsForm').serializeArray();
      debug('获取表单数据', { formData });
      saveOptions(website, options, formData);
    } else {
      debug('用户取消保存选项');
    }
  } catch (error) {
    debug('设置网站选项时发生错误', { error });
    throwError(error as Error, 'websiteOptions');
  }
};

export default websiteOptions;
