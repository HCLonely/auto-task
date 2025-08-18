/*
 * @Author       : HCLonely
 * @Date         : 2023-10-26 14:58:11
 * @LastEditTime : 2025-08-18 19:08:05
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/scripts/tools/debug.ts
 * @Description  : 调试工具函数
 */

import util from 'node-inspect-extracted';
/**
 * 调试级别枚举
 */
enum DebugLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
  TRACE = 'trace'
}

/**
 * 调试配置接口
 */
interface DebugConfig {
  enabled: boolean;
  level: DebugLevel;
  prefix: string;
  styles: {
    [key in DebugLevel]: string;
  };
  showTimestamp: boolean;
}

/**
 * 默认调试配置
 */
const defaultConfig: DebugConfig = {
  enabled: false,
  level: DebugLevel.INFO,
  prefix: 'Auto-Task',
  styles: {
    error: 'color:#ff0000;font-weight:bold',
    warn: 'color:#ffa500',
    info: 'color:#a7a7a7',
    debug: 'color:#808080',
    trace: 'color:#87ceeb'
  },
  showTimestamp: true
};

/**
 * 调试器类
 */
class Debugger {
  private config: DebugConfig;
  private levelPriority: { [key in DebugLevel]: number };

  constructor(config: Partial<DebugConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
    this.levelPriority = {
      error: 0,
      warn: 1,
      info: 2,
      debug: 3,
      trace: 4
    };
  }

  /**
   * 获取当前时间戳
   */
  private getTimestamp(): string {
    return new Date().toLocaleString();
  }

  /**
   * 检查是否应该输出日志
   */
  private shouldLog(level: DebugLevel): boolean {
    return (
      this.config.enabled &&
      this.levelPriority[level] <= this.levelPriority[this.config.level]
    );
  }

  /**
   * 格式化日志消息
   */
  private formatMessage(level: DebugLevel, message: string): string {
    const parts = [this.config.prefix];

    if (this.config.showTimestamp) {
      parts.push(`[${this.getTimestamp()}]`);
    }

    parts.push(`[${level.toUpperCase()}]:`);
    parts.push(message);

    return parts.join(' ');
  }

  /**
   * 输出日志
   */
  private log(level: DebugLevel, message: string, ...args: unknown[]): void {
    if (!this.shouldLog(level)) return;

    const formattedMessage = this.formatMessage(level, message);
    const style = this.config.styles[level];

    if (args.length > 0) {
      console.groupCollapsed('%c%s', style, formattedMessage);
      args.forEach((arg) => {
        console.log(util.inspect(arg, { showHidden: true, depth: null, colors: false }));
        // if (typeof arg === 'object' && arg !== null) {
        //   console.dir(arg);
        // } else {
        //   console.log(arg);
        // }
      });
      console.groupEnd();
    } else {
      console.log('%c%s', style, formattedMessage);
    }
  }

  /**
   * 错误级别日志
   */
  error(message: string, ...args: unknown[]): void {
    this.log(DebugLevel.ERROR, message, ...args);
  }

  /**
   * 警告级别日志
   */
  warn(message: string, ...args: unknown[]): void {
    this.log(DebugLevel.WARN, message, ...args);
  }

  /**
   * 信息级别日志
   */
  info(message: string, ...args: unknown[]): void {
    this.log(DebugLevel.INFO, message, ...args);
  }

  /**
   * 调试级别日志
   */
  debug(message: string, ...args: unknown[]): void {
    this.log(DebugLevel.DEBUG, message, ...args);
  }

  /**
   * 跟踪级别日志
   */
  trace(message: string, ...args: unknown[]): void {
    this.log(DebugLevel.TRACE, message, ...args);
    if (this.shouldLog(DebugLevel.TRACE)) {
      console.trace();
    }
  }

  /**
   * 更新调试配置
   */
  updateConfig(config: Partial<DebugConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * 启用调试
   */
  enable(): void {
    this.config.enabled = true;
  }

  /**
   * 禁用调试
   */
  disable(): void {
    this.config.enabled = false;
  }

  /**
   * 设置调试级别
   */
  setLevel(level: DebugLevel): void {
    this.config.level = level;
  }
}

let debugInstance: Debugger;

const initDebug = () => {
  if (!debugInstance) {
    debugInstance = new Debugger({
      enabled: window.DEBUG || false
    });
    if (window.DEBUG) {
      debugInstance.setLevel(DebugLevel.DEBUG);
    }
  }
  return debugInstance;
};

const debug = (...args: Parameters<typeof debugInstance.debug>) => {
  const instance = initDebug();
  return instance.debug(...args);
};

export { debug, DebugLevel };
