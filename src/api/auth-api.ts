import { HttpTransport } from '@/api/http-transport.ts';
import { REGISTER_API_URL, type RegisterResponse, type User } from '@utils';

const isRegisterResponse = (value: unknown): value is RegisterResponse => {
  return (
    !!value && typeof value === 'object' && (value as RegisterResponse).success === true
  );
};

const authApiInstance = new HttpTransport();

export class AuthApi {
  async register(data: User, signal?: AbortSignal): Promise<RegisterResponse> {
    const response = await authApiInstance.post(REGISTER_API_URL, {
      data,
      signal,
    });

    if (!isRegisterResponse(response)) {
      throw new Error('Сервер вернул некорректный ответ на запрос регистрации');
    }

    return response;
  }
}

export const authApi = new AuthApi();
