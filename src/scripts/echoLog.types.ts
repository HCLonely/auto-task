export interface logStatus {
  font?: JQuery
  success: (text?: string, html?: boolean) => logStatus
  error: (text?: string, html?: boolean) => logStatus
  warning: (text?: string, html?: boolean) => logStatus
  info: (text?: string, html?: boolean) => logStatus
  view: (text?: string, html?: boolean) => logStatus
}
