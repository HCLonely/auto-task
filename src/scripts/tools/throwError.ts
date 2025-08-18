/*
 * @Author       : HCLonely
 * @Date         : 2021-10-13 14:08:18
 * @LastEditTime : 2025-08-18 19:07:44
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/scripts/tools/throwError.ts
 * @Description  : 错误处理函数
 */

import Swal from 'sweetalert2';
import browser from 'browser-tool';
import __ from './i18n';
import { debug } from './debug';

/**
 * 错误报告平台类型
 */
type ReportPlatform = 'github';

/**
 * 错误报告数据接口
 */
interface ErrorReportData {
  readonly website: string;
  readonly browser: string;
  readonly manager: string;
  readonly userScript: string;
  logs: string;
  readonly runLogs: string;
}

/**
 * GitHub Issue参数接口
 */
interface GithubIssueParams extends Record<string, string> {
  readonly title: string;
  readonly labels: string;
  readonly template: string;
  readonly website: string;
  readonly browser: string;
  readonly manager: string;
  readonly 'user-script': string;
  readonly logs: string;
  readonly 'run-logs': string;
}

/**
 * 获取运行日志
 * @returns {string} 格式化的运行日志
 */
const getRunLogs = (): string => {
  debug('开始获取运行日志');
  const logElements = $('#auto-task-info>li');
  const logs = logElements.length > 0 ? $.makeArray(logElements).map((element) => element.innerText)
    .join('\n') : '';
  debug('运行日志获取完成', { logsLength: logs.length });
  return logs;
};

/**
 * 获取环境信息
 * @returns {ErrorReportData} 错误报告所需的环境信息
 */
const getEnvironmentInfo = async (): Promise<ErrorReportData> => {
  debug('开始获取环境信息');
  const envInfo = {
    website: window.location.href,
    browser: JSON.stringify(await browser.getInfo(), null, 2),
    manager: `${GM_info.scriptHandler} ${GM_info.version}`,
    userScript: GM_info.script.version,
    logs: '',
    runLogs: getRunLogs()
  };
  debug('环境信息获取完成', envInfo);
  return envInfo;
};

/**
 * 构建GitHub Issue参数
 * @param {string} name - 错误名称
 * @param {string} errorStack - 错误堆栈信息
 * @param {ErrorReportData} envInfo - 环境信息
 * @returns {GithubIssueParams} GitHub Issue参数对象
 */
const buildGithubIssueParams = async (name: string, errorStack: string, envInfo: ErrorReportData): Promise<GithubIssueParams> => {
  debug('开始构建GitHub Issue参数', { name, errorStackLength: errorStack.length });
  const params = {
    title: `[BUG] 脚本报错: ${name}`,
    labels: 'bug',
    template: 'bug_report.yml',
    website: envInfo.website,
    browser: envInfo.browser,
    manager: envInfo.manager,
    'user-script': envInfo.userScript,
    logs: errorStack || '',
    'run-logs': ''
  };
  // copy window.__allLogs.join('\n')
  const runLogs = window.__allLogs.join('\n');
  await GM_setClipboard(runLogs);

  debug('GitHub Issue参数构建完成', params);
  return params;
};

/**
 * 生成GitHub issue链接
 * @param {string} name - 错误名称
 * @param {string} errorStack - 错误堆栈信息
 * @param {ErrorReportData} envInfo - 环境信息
 * @returns {string} GitHub issue链接
 */
const generateGithubLink = async (name: string, errorStack: string, envInfo: ErrorReportData): Promise<string> => {
  debug('开始生成GitHub Issue链接');
  const params = new URLSearchParams(await buildGithubIssueParams(name, errorStack, envInfo) as Record<string, string>);
  const link = `https://github.com/HCLonely/auto-task/issues/new?${params.toString()}`;
  debug('GitHub Issue链接生成完成', { link });
  return link;
};

/**
 * 记录错误日志
 * @param {string} name - 错误名称
 * @param {string} errorStack - 错误堆栈信息
 */
const logError = (name: string, errorStack: string): void => {
  debug('记录错误日志', { name });
  console.log('%c%s', 'color:white;background:red', `Auto-Task[Error]: ${name}\n${errorStack}`);
};

/**
 * 处理错误报告提交
 * @param {ReportPlatform} platform - 报告平台
 * @param {string} name - 错误名称
 * @param {string} errorStack - 错误堆栈信息
 * @param {ErrorReportData} envInfo - 环境信息
 */
const handleErrorReport = async (platform: ReportPlatform, name: string, errorStack: string, envInfo: ErrorReportData): Promise<void> => {
  debug('开始处理错误报告', { platform, name });
  if (platform === 'github') {
    const githubLink = await generateGithubLink(name, errorStack, envInfo);
    debug('打开GitHub Issue链接', { githubLink });
    GM_openInTab(githubLink, { active: true });
  }
};

/**
 * 处理错误并显示相应的提示框
 *
 * @param {Error} error - 错误对象
 * @param {string} name - 错误名称
 * @returns {Promise<void>}
 *
 * @description
 * 该函数处理错误并提供以下功能：
 * 1. 显示错误报告对话框
 * 2. 支持提交到 GitHub Issues
 * 3. 自动收集环境信息和错误日志
 * 4. 提供错误信息的复制功能
 */
export default async function throwError(error: Error, name: string): Promise<void> {
  debug('开始处理错误', { name, error });

  if (window.TRACE) {
    debug('启用跟踪模式');
    console.trace('%cAuto-Task[Trace]:', 'color:blue');
  }

  const errorStack = error.stack || '';
  logError(name, errorStack);

  debug('获取环境信息');
  const envInfo = await getEnvironmentInfo();
  envInfo.logs = errorStack;

  debug('显示错误报告对话框');
  const { isConfirmed } = await Swal.fire({
    title: __('errorReport'),
    icon: 'error',
    showCancelButton: true,
    confirmButtonText: __('toGithub'),
    cancelButtonText: __('close')
  });

  if (isConfirmed) {
    debug('用户确认提交错误报告');
    await handleErrorReport('github', name, errorStack, envInfo);

    Swal.fire({
      title: __('logCopied'),
      icon: 'success',
      showConfirmButton: false,
      showCancelButton: true,
      cancelButtonText: __('close')
    });
  } else {
    debug('用户取消提交错误报告');
  }
}
