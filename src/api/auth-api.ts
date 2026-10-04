import { getHttpErrorMessage, HttpError } from '@/api/http-error.ts';
import { HttpTransport } from '@/api/http-transport.ts';
import {
  ACCESS_TOKEN_KEY,
  getLocalStorageItem,
  LOGIN_API_URL,
  LOGOUT_API_URL,
  REFRESH_TOKEN_KEY,
  REGISTER_API_URL,
  removeLocalStorageItem,
  setLocalStorageItem,
  TOKEN_API_URL,
  type AuthResponse,
  type AuthRequestResponse,
  type RefreshTokenResponse,
  type User,
  RECOVERY_PASSWORD_API_URL,
  RESET_PASSWORD_API_URL,
  AUTH_USER_API_URL,
  type UserAuthResponse,
  ErrorType,
} from '@utils';

const isAuthResponse = (value: unknown): value is AuthResponse => {
  return (
    !!value && typeof value === 'object' && (value as AuthResponse).success === true
  );
};

const isUserAuthResponse = (value: unknown): value is UserAuthResponse => {
  return (
    !!value && typeof value === 'object' && (value as UserAuthResponse).success === true
  );
};

const isRefreshTokenResponse = (value: unknown): value is RefreshTokenResponse => {
  return (
    !!value &&
    typeof value === 'object' &&
    (value as RefreshTokenResponse).success === true
  );
};

const isAuthRequestResponse = (value: unknown): value is AuthRequestResponse => {
  return !!value && typeof value === 'object' && (value as AuthRequestResponse).success;
};

// Сервер сообщает о просроченном accessToken не 401, а 403 с message: 'jwt expired'
const isTokenExpiredError = (error: unknown): boolean => {
  if (!(error instanceof HttpError)) {
    return false;
  }

  return (
    error.status === 401 ||
    (error.status === 403 && getHttpErrorMessage(error) === 'jwt expired')
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

  async recoveryPassword(
    data: Pick<User, 'email'>,
    signal?: AbortSignal
  ): Promise<AuthRequestResponse> {
    const response = await authApiInstance.post(RECOVERY_PASSWORD_API_URL, {
      data,
      signal,
    });

    if (!isAuthRequestResponse(response)) {
      throw new Error('Сервер вернул некорректный ответ');
    }

    return response;
  }

  async resetPassword(
    data: { password: string; token: string },
    signal?: AbortSignal
  ): Promise<AuthRequestResponse> {
    const response = await authApiInstance.post(RESET_PASSWORD_API_URL, {
      data,
      signal,
    });

    if (!isAuthRequestResponse(response)) {
      throw new Error('Сервер вернул некорректный ответ');
    }

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

  async logout(signal?: AbortSignal): Promise<AuthRequestResponse> {
    const refreshToken = getLocalStorageItem<string>(REFRESH_TOKEN_KEY);

    try {
      const response = await authApiInstance.post(LOGOUT_API_URL, {
        data: { token: refreshToken },
        signal,
      });

      if (!isAuthRequestResponse(response)) {
        throw new Error('Сервер вернул некорректный ответ при выходе из системы');
      }

      return response;
    } finally {
      removeLocalStorageItem(ACCESS_TOKEN_KEY);
      removeLocalStorageItem(REFRESH_TOKEN_KEY);
    }
  }

  async requestWithRefresh<T>(
    makeRequest: (accessToken: string | null) => Promise<T>
  ): Promise<T> {
    const accessToken = getLocalStorageItem<string>(ACCESS_TOKEN_KEY);

    if (!accessToken) {
      throw new HttpError(401, { reason: ErrorType.AccessToken });
    }

    try {
      return await makeRequest(accessToken);
    } catch (error) {
      if (!isTokenExpiredError(error)) {
        throw error;
      }

      const refreshed = await this.refreshToken();

      return makeRequest(refreshed.accessToken);
    }
  }

  async getUser(signal?: AbortSignal): Promise<UserAuthResponse> {
    const response = await this.requestWithRefresh((accessToken) =>
      authApiInstance.get(AUTH_USER_API_URL, {
        signal,
        headers: accessToken ? { authorization: accessToken } : {},
      })
    );

    if (!isUserAuthResponse(response)) {
      throw new Error('Сервер вернул некорректный ответ');
    }

    return response;
  }

  async updateUser(data: User, signal?: AbortSignal): Promise<UserAuthResponse> {
    const response = await this.requestWithRefresh((accessToken) =>
      authApiInstance.patch(AUTH_USER_API_URL, {
        data,
        signal,
        headers: accessToken ? { authorization: accessToken } : {},
      })
    );

    if (!isUserAuthResponse(response)) {
      throw new Error('Сервер вернул некорректный ответ при обновлении данных');
    }

    return response;
  }
}

export const authApi = new AuthApi();
