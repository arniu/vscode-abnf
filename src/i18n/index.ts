import { Messages } from "./types";
import { zhCN } from "./zh-CN";
import { en } from "./en";

let currentMessages: Messages;

// 消息映射
const messageMap: { [locale: string]: Messages } = {
  "zh-CN": zhCN,
  en: en,
};

/**
 * 初始化消息系统
 * @param locale 语言环境
 */
export function initializeMessages(locale: string): void {
  currentMessages = messageMap[locale] || zhCN;
}

/**
 * 获取当前语言的消息
 * @returns 当前语言的消息对象
 */
export function getMessages(): Messages {
  if (!currentMessages) {
    initializeMessages("zh-CN");
  }

  return currentMessages!;
}

/**
 * 格式化消息模板
 * @param template 消息模板
 * @param args 参数
 * @returns 格式化后的消息
 */
export function formatMessage(template: string, ...args: string[]): string {
  return template.replace(/\{(\d+)\}/g, (match, index) => {
    return args[parseInt(index)] || match;
  });
}
