import { BASE_API_URL, METHODS } from '@utils/api-constants.ts';
import { queryStringify } from '@utils/query-stringify.ts';

import { HttpError, NetworkError } from './http-error';

type Options = {
  method: (typeof METHODS)[keyof typeof METHODS];
  headers?: Record<string, string>;
  data?: Record<string, unknown> | FormData;
  timeout?: number;
  signal?: AbortSignal;
  isAppHost?: boolean;
};

type RequestOptions = Omit<Options, 'method'>;

const TIMEOUT = 10000;

export class HttpTransport {
  get = (url: string, options: RequestOptions = {}) => {
    return this.request(url, { ...options, method: METHODS.GET });
  };

  post = (url: string, options: RequestOptions = {}) => {
    return this.request(url, { ...options, method: METHODS.POST });
  };

  put = (url: string, options: RequestOptions = {}) => {
    return this.request(url, { ...options, method: METHODS.PUT });
  };

  delete = (url: string, options: RequestOptions = {}) => {
    return this.request(url, { ...options, method: METHODS.DELETE });
  };

  request = async (url: string, options: Options = { method: METHODS.GET }) => {
    const timeout = options.timeout ?? TIMEOUT;

    const { method, headers = {}, data, signal } = options;

    const isGet = method === METHODS.GET;
    const isFormData = data instanceof FormData;

    const currentHost = BASE_API_URL;

    const requestUrl =
      isGet && data && !isFormData
        ? `${currentHost}${url}${queryStringify(data)}`
        : `${currentHost}${url}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort('Запрос превысил допустимое время ожидания'),
      timeout
    );

    // Пробрасываем внешнюю отмену (напр. при размонтировании компонента) на fetch
    if (signal) {
      if (signal.aborted) {
        controller.abort(signal.reason);
      } else {
        signal.addEventListener('abort', () => controller.abort(signal.reason), {
          once: true,
        });
      }
    }

    const fetchHeaders = new Headers(headers);

    const fetchOptions: RequestInit = {
      method,
      headers: fetchHeaders,
      signal: controller.signal,
    };

    if (!isGet && data !== undefined && data !== null) {
      if (data instanceof FormData) {
        fetchOptions.body = data;
      } else {
        fetchOptions.body = JSON.stringify(data);

        if (!fetchHeaders.has('Content-Type')) {
          fetchHeaders.set('Content-Type', 'application/json');
        }
      }
    }

    let response: Response;

    try {
      response = await fetch(requestUrl, fetchOptions);
    } catch (error) {
      // fetch() зареджектился раньше получения ответа: сеть недоступна, CORS, DNS, таймаут/отмена
      throw new NetworkError(
        'Не удалось выполнить запрос. Проверьте подключение к сети',
        error
      );
    } finally {
      clearTimeout(timeoutId);
    }

    if (response.ok) {
      const contentType = response.headers.get('Content-Type') ?? '';
      let data: unknown;

      if (contentType.includes('application/json')) {
        data = await response.json();
      } else if (
        contentType.startsWith('image/') ||
        contentType.startsWith('audio/') ||
        contentType.startsWith('video/')
      ) {
        data = await response.blob();
      } else {
        data = await response.text(); // credentials не можем установить по CORS, ответ приходит text/html
      }

      return data;
    }

    // Ответ получен, но статус не 2xx — сохраняем status и тело ответа для вызывающего кода
    const errorContentType = response.headers.get('Content-Type') ?? '';
    const errorBody: unknown = errorContentType.includes('application/json')
      ? await response.json().catch(() => null)
      : await response.text();

    throw new HttpError(response.status, errorBody);
  };
}
