export interface AxiosGMConfig extends Tampermonkey.Request {
  // method?: string;
  url: string;
  headers?: Record<string, string>;
  data?: any;
  // responseType?: string;
  timeout?: number;
  retry?: number;
  retryDelay?: number;
}

export interface AxiosGMResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, any>;
  config: AxiosGMConfig;
  request: any;
}

export interface AxiosGMInstance {
  (config: AxiosGMConfig): Promise<AxiosGMResponse>;
  defaults: Partial<AxiosGMConfig>;
  get(url: string, config?: Omit<AxiosGMConfig, 'url' | 'method'>): Promise<AxiosGMResponse>;
  post(url: string, data?: any, config?: Omit<AxiosGMConfig, 'url' | 'method' | 'data'>): Promise<AxiosGMResponse>;
  head(url: string, config?: Omit<AxiosGMConfig, 'url' | 'method'>): Promise<AxiosGMResponse>;
  create(defaults?: Partial<AxiosGMConfig>): AxiosGMInstance;
}

const parseResponseHeaders = (headerStr: string): Record<string, any> => {
  const headers: Record<string, any> = {};
  if (!headerStr) return headers;
  headerStr.split('\r\n').forEach((line) => {
    if (line) {
      const parts = line.split(':');
      const key = parts.shift()?.trim();
      const value = parts.join(':').trim();
      if (key) {
        if (key.toLowerCase() === 'set-cookie') {
          if (headers[key]) {
            if (Array.isArray(headers[key])) {
              headers[key].push(value);
            } else {
              headers[key] = [headers[key], value];
            }
          } else {
            headers[key] = value;
          }
        } else {
          headers[key] = value;
        }
      }
    }
  });
  return headers;
};

export const axiosGM = (function (config: AxiosGMConfig): Promise<AxiosGMResponse> {
  const finalConfig: AxiosGMConfig = { ...axiosGM.defaults, ...config } as AxiosGMConfig;

  const retries = finalConfig.retry ?? 0;
  const retryDelay = finalConfig.retryDelay ?? 0;

  const requestAttempt = (attempt: number): Promise<AxiosGMResponse> => new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: finalConfig.method ? finalConfig.method.toUpperCase() as Tampermonkey.Request['method'] : 'GET',
      url: finalConfig.url,
      headers: finalConfig.headers,
      data: finalConfig.data,
      responseType: finalConfig.responseType as Tampermonkey.Request['responseType'] || 'json',
      timeout: finalConfig.timeout,
      fetch: finalConfig.fetch ?? true,
      onload(response: Tampermonkey.Response<any>) {
        const axiosResponse: AxiosGMResponse = {
          data: response.response || response.responseText,
          status: response.status,
          statusText: response.statusText,
          headers: parseResponseHeaders(response.responseHeaders),
          config: finalConfig,
          request: response
        };
        resolve(axiosResponse);
      },
      onerror(error: any) {
        if (attempt < retries) {
          setTimeout(() => {
            requestAttempt(attempt + 1).then(resolve)
              .catch(reject);
          }, retryDelay);
        } else {
          reject(error);
        }
      },
      ontimeout() {
        if (attempt < retries) {
          setTimeout(() => {
            requestAttempt(attempt + 1).then(resolve)
              .catch(reject);
          }, retryDelay);
        } else {
          reject('Error: timeout');
        }
      }
    });
  });

  return requestAttempt(0);
} as AxiosGMInstance);

axiosGM.defaults = {} as Partial<AxiosGMConfig>;

axiosGM.get = function (url: string, config: Omit<AxiosGMConfig, 'url' | 'method'> = {}): Promise<AxiosGMResponse> {
  return axiosGM({ ...config, url, method: 'GET' });
};

axiosGM.post = function (url: string, data?: any, config: Omit<AxiosGMConfig, 'url' | 'method' | 'data'> = {}): Promise<AxiosGMResponse> {
  return axiosGM({ ...config, url, data, method: 'POST' });
};

axiosGM.head = function (url: string, config: Omit<AxiosGMConfig, 'url' | 'method'> = {}): Promise<AxiosGMResponse> {
  return axiosGM({ ...config, url, method: 'HEAD' });
};

axiosGM.create = function (instanceDefaults: Partial<AxiosGMConfig> = {}): AxiosGMInstance {
  const instance = (config: AxiosGMConfig): Promise<AxiosGMResponse> => {
    const mergedConfig: AxiosGMConfig = { ...axiosGM.defaults, ...instanceDefaults, ...config } as AxiosGMConfig;
    return axiosGM(mergedConfig);
  };
  instance.defaults = { ...axiosGM.defaults, ...instanceDefaults };

  instance.get = function (url: string, config: Omit<AxiosGMConfig, 'url' | 'method'> = {}): Promise<AxiosGMResponse> {
    return instance({ ...config, url, method: 'GET' });
  };

  instance.post = function (url: string, data?: any, config: Omit<AxiosGMConfig, 'url' | 'method' | 'data'> = {}): Promise<AxiosGMResponse> {
    return instance({ ...config, url, data, method: 'POST' });
  };

  instance.head = function (url: string, config: Omit<AxiosGMConfig, 'url' | 'method'> = {}): Promise<AxiosGMResponse> {
    return instance({ ...config, url, method: 'HEAD' });
  };

  instance.create = axiosGM.create;

  return instance;
};
