/*
 * @Author       : HCLonely
 * @Date         : 2025-05-31 14:17:14
 * @LastEditTime : 2025-08-18 19:04:25
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/scripts/globalOptionsEdit.ts
 * @Description  : 全局选项编辑模块
 */
import Swal from 'sweetalert2';
import __ from './tools/i18n';
import throwError from './tools/throwError';
import { stringToColour } from './tools/tools';
import { globalOptions } from './globalOptions';
import { debug } from './tools/debug';

/**
 * 表单数据项的接口定义
 * @interface FormDataItem
 * @property {string} name - 表单项的名称
 * @property {string} value - 表单项的值
 */
interface FormDataItem {
  name: string;
  value: string;
}

/**
 * 显示类型的类型定义
 * @typedef {('page'|'swal')} ShowType
 * @description 定义选项显示的方式：page-页面内显示，swal-弹窗显示
 */
type ShowType = 'page' | 'swal';

/**
 * 处理表单数据并更新全局选项
 * @param {FormDataItem[]} formData - 序列化后的表单数据数组
 * @returns {Record<string, any>} 处理后的数据对象，键为表单项名称，值为表单项的值
 */
const processFormData = (formData: FormDataItem[]): Record<string, any> => {
  debug('开始处理表单数据', { formDataLength: formData.length });
  const data: Record<string, any> = {};
  formData.forEach((value) => {
    data[value.name] = value.value;
  });
  debug('表单数据处理完成', { processedData: data });
  return data;
};

/**
 * 更新全局选项值
 * @param {HTMLElement} element - 包含选项数据的 DOM 元素
 * @param {Record<string, any>} data - 处理后的表单数据对象
 * @description 根据表单元素的 name 属性（使用点号分隔的路径）更新 globalOptions 对象中的对应值
 */
const updateGlobalOption = (element: HTMLElement, data: Record<string, any>): void => {
  const name = $(element).attr('name');
  if (!name) {
    debug('元素缺少name属性', { element });
    return;
  }

  debug('开始更新全局选项', { name });
  const keys = name.split('.');
  const value = data[name];
  const processedValue = value ? (value === 'on' ? true : value) : (value ?? false);
  debug('处理选项值', { keys, originalValue: value, processedValue });

  if (keys.length === 3) {
    (globalOptions as any)[keys[0]][keys[1]][keys[2]] = processedValue;
    debug('更新三级选项', { path: keys.join('.'), value: processedValue });
  } else if (keys.length === 2) {
    (globalOptions as any)[keys[0]][keys[1]] = processedValue;
    debug('更新二级选项', { path: keys.join('.'), value: processedValue });
  }
};

/**
 * 生成表单行 HTML
 * @param type - 选项类型
 * @param option - 选项名称
 * @param data - 选项数据
 * @param isFirstOption - 是否为第一个选项
 * @param totalOptions - 选项总数
 * @returns 生成的 HTML 字符串
 */
const generateFormRow = (
  type: string,
  option: string,
  data: any,
  isFirstOption: boolean,
  totalOptions: number
): string => {
  debug('开始生成表单行', { type, option, isFirstOption, totalOptions });
  const backgroundColor = `${stringToColour(type)}44`;
  const headerBackgroundColor = `${stringToColour(type)}66`;

  if (['other', 'position', 'hotKey', 'ASF'].includes(type)) {
    const header = isFirstOption ?
      `<th rowspan="${totalOptions}" style="background-color: ${headerBackgroundColor}">${__(type)}</th>` :
      '';

    if (typeof data === 'boolean') {
      debug('生成布尔类型选项行', { type, option, value: data });
      return `
        <tr style="background-color: ${backgroundColor}">
          ${header}
          <td>${__(option)}</td>
          <td>
            <label>
              <input type="checkbox" name="${type}.${option}"${data ? ' checked="checked"' : ''}/>
              <span><i></i></span>
            </label>
          </td>
        </tr>`;
    }

    debug('生成文本类型选项行', { type, option, value: data });
    return `
      <tr style="background-color: ${backgroundColor}">
        ${header}
        <td>${__(option)}</td>
        <td>
          <input class="editOption" type="text" name="${type}.${option}" value="${data}"/>
        </td>
      </tr>`;
  }

  debug('生成社交媒体选项行', { type, option, dataKeys: Object.keys(data) });
  return Object.entries(data as Record<string, boolean>).map(([socialType, value]) => `
    <tr style="background-color: ${stringToColour(option)}66">
      ${isFirstOption ? `<th rowspan="${totalOptions}" style="background-color: ${headerBackgroundColor}">${__(type)}</th>` : ''}
      <td>${option}.${__(socialType)}</td>
      <td>
        <label>
          <input type="checkbox" name="${type}.${option}.${socialType}"${value ? ' checked="checked"' : ''}/>
          <span><i></i></span>
        </label>
      </td>
    </tr>`)
    .join('');
};

/**
 * 生成全局选项表单
 * @returns 生成的表单 HTML 字符串
 */
const generateGlobalOptionsForm = (): string => {
  debug('开始生成全局选项表单');
  const formRows = Object.entries(globalOptions).map(([type, data1]) => {
    debug('处理选项类型', { type, optionsCount: Object.keys(data1).length });
    return Object.entries(data1).map(([option, data2], index) => {
      const totalOptions = ['other', 'position', 'hotKey', 'ASF'].includes(type) ?
        Object.keys(data1).length :
        Object.values(data1).reduce((acc: number, cur) => acc + Object.keys(cur as object).length, 0);

      return generateFormRow(type, option, data2, index === 0, totalOptions);
    })
      .join('');
  })
    .join('');

  debug('表单生成完成');
  return `
    <form id="globalOptionsForm" class="auto-task-form">
      <table class="auto-task-table">
        <thead>
          <tr>
            <td>${__('type')}</td>
            <td>${__('option')}</td>
            <td>${__('value')}</td>
          </tr>
        </thead>
        <tbody>
          ${formRows}
        </tbody>
      </table>
    </form>`;
};

/**
 * 保存全局选项数据
 * 将表单中的值序列化并更新 globalOptions 对象
 * @throws {Error} 如果在保存过程中发生错误
 */
const saveData = (): void => {
  try {
    debug('开始保存全局选项数据');
    const formData = $('#globalOptionsForm').serializeArray();
    debug('获取表单数据', { formDataLength: formData.length });

    const data = processFormData(formData);

    debug('开始更新全局选项');
    $.makeArray($('#globalOptionsForm input')).forEach((element) => {
      updateGlobalOption(element, data);
    });

    GM_setValue('globalOptions', globalOptions);
    debug('全局选项保存完成');

    Swal.fire({
      title: __('changeGlobalOptionsSuccess'),
      icon: 'success'
    });
  } catch (error) {
    debug('保存全局选项时发生错误', { error });
    throwError(error as Error, 'saveData');
  }
};

/**
 * 显示全局选项配置界面
 * @param showType - 显示类型，支持页面内显示或弹窗显示
 * @throws {Error} 如果在显示过程中发生错误
 */
const changeGlobalOptions = (showType: ShowType): void => {
  try {
    debug('开始显示全局选项配置界面', { showType });
    const formHtml = generateGlobalOptionsForm();

    if (showType === 'swal') {
      debug('使用弹窗显示选项');
      Swal.fire({
        title: __('globalOptions'),
        html: formHtml,
        showConfirmButton: true,
        confirmButtonText: __('save'),
        showCancelButton: true,
        cancelButtonText: __('close')
      }).then(({ isConfirmed }) => {
        if (isConfirmed) {
          debug('用户确认保存选项');
          saveData();
        } else {
          debug('用户取消保存选项');
        }
      });
    } else {
      debug('使用页面内显示选项');
      $('body').append(`<h2>${__('globalOptions')}</h2>${formHtml}`);
    }
  } catch (error) {
    debug('显示全局选项配置界面时发生错误', { error });
    throwError(error as Error, 'changeGlobalOptions');
  }
};

export { changeGlobalOptions, saveData };
