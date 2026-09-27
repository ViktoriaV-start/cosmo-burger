import { HttpError } from '@/api/http-error.ts';
import { HttpTransport } from '@/api/http-transport.ts';
import {
  ACCESS_TOKEN_KEY,
  getLocalStorageItem,
  LOGIN_API_URL,
  REFRESH_TOKEN_KEY,
  REGISTER_API_URL,
  removeLocalStorageItem,
  setLocalStorageItem,
  TOKEN_API_URL,
  type AuthResponse,
  type RefreshTokenResponse,
  type User,
} from '@utils';

const isAuthResponse = (value: unknown): value is AuthResponse => {
  return (
    !!value && typeof value === 'object' && (value as AuthResponse).success === true
  );
};

const isRefreshTokenResponse = (value: unknown): value is RefreshTokenResponse => {
  return (
    !!value &&
    typeof value === 'object' &&
    (value as RefreshTokenResponse).success === true
  );
};

const saveAuthTokens = (response: {
  accessToken: string;
  refreshToken: string;
}): void => {
  setLocalStorageItem(ACCESS_TOKEN_KEY, response.accessToken);
  setLocalStorageItem(REFRESH_TOKEN_KEY, response.refreshToken);
};

const authApiInstance = new HttpTransport();

export class AuthApi {
  private refreshPromise: Promise<RefreshTokenResponse> | null = null;

  async register(data: User, signal?: AbortSignal): Promise<AuthResponse> {
    const response = await authApiInstance.post(REGISTER_API_URL, {
      data,
      signal,
    });

    if (!isAuthResponse(response)) {
      throw new Error('Сервер вернул некорректный ответ на запрос регистрации');
    }

    saveAuthTokens(response);

    return response;
  }

  async login(data: Omit<User, 'name'>, signal?: AbortSignal): Promise<AuthResponse> {
    const response = await authApiInstance.post(LOGIN_API_URL, {
      data,
      signal,
    });

    if (!isAuthResponse(response)) {
      throw new Error('Сервер вернул некорректный ответ');
    }

    saveAuthTokens(response);

    return response;
  }

  refreshToken(): Promise<RefreshTokenResponse> {
    this.refreshPromise ??= this.performRefresh().finally(() => {
      this.refreshPromise = null;
    });

    return this.refreshPromise;
  }

  private async performRefresh(): Promise<RefreshTokenResponse> {
    const refreshToken = getLocalStorageItem<string>(REFRESH_TOKEN_KEY);

    if (!refreshToken) {
      removeLocalStorageItem(ACCESS_TOKEN_KEY);
      throw new Error('Токен обновления отсутствует, требуется повторная авторизация');
    }

    try {
      const response = await authApiInstance.post(TOKEN_API_URL, {
        data: { token: refreshToken },
      });

      if (!isRefreshTokenResponse(response)) {
        throw new Error('Сервер вернул некорректный ответ при обновлении токена');
      }

      saveAuthTokens(response);

      return response;
    } catch (error) {
      removeLocalStorageItem(ACCESS_TOKEN_KEY);
      removeLocalStorageItem(REFRESH_TOKEN_KEY);
      throw error;
    }
  }

  async requestWithRefresh<T>(
    makeRequest: (accessToken: string | null) => Promise<T>
  ): Promise<T> {
    const accessToken = getLocalStorageItem<string>(ACCESS_TOKEN_KEY);

    try {
      return await makeRequest(accessToken);
    } catch (error) {
      if (!(error instanceof HttpError) || error.status !== 401) {
        throw error;
      }

      const refreshed = await this.refreshToken();

      return makeRequest(refreshed.accessToken);
    }
  }
}

export const authApi = new AuthApi();
