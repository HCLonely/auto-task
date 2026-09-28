export interface MonkeyXhrResponse {
  finalUrl: string
  readyState: number
  status: number
  statusText: string
  responseHeadersText: string
  responseHeaders: any
  response: any
  responseXML: Document
  responseText: string
}

export interface MonkeyXhrBasicDetails {
  method: 'GET' | 'POST' | 'HEAD' | 'DELETE'
  url: string
  headers?: { [name: string]: string },
  data?: string | FormData
  binary?: boolean
  timeout?: number
  nochche?: boolean
  context?: any
  responseType?: 'arraybuffer' | 'blob' | 'json'
  overrideMimeType?: string
  anonymous?: boolean
  fetch?: boolean
  username?: string
  password?: string,
  redirect?: 'follow' | 'error' | 'manual'
}

export interface MonkeyXhrDetails extends MonkeyXhrBasicDetails {
  onabort?: () => void
  onerror?: (response: MonkeyXhrResponse) => void
  onloadstart?: (response: MonkeyXhrResponse) => void
  onprogress?: (response: MonkeyXhrResponse) => void
  onreadystatechange?: (response: MonkeyXhrResponse) => void
  ontimeout?: (response: MonkeyXhrResponse) => void
  onload?: (response: MonkeyXhrResponse) => void
}

export interface httpRequestOptions extends MonkeyXhrDetails {
  dataType?: 'arraybuffer' | 'blob' | 'json'
}

export interface httpResponse {
  result: string
  statusText: string
  status: number
  options: httpRequestOptions
  data?: MonkeyXhrResponse
  error?: Error
}
