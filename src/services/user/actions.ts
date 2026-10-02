import { authApi } from '@/api/auth-api.ts';
import { getHttpErrorMessage } from '@/api/http-error.ts';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { isTokenExists } from '@utils';

import type { AuthResponse, User, UserAuthResponse } from '@utils';

export const fetchRegisterUser = createAsyncThunk<
  AuthResponse,
  User,
  { rejectValue: string }
>('user/registerUser', async (userData, { rejectWithValue, signal }) => {
  try {
    return await authApi.register(userData, signal);
  } catch (error) {
    return rejectWithValue(getHttpErrorMessage(error) ?? 'Регистрация не выполнена');
  }
});

export const fetchLoginUser = createAsyncThunk<
  AuthResponse,
  Omit<User, 'name'>,
  { rejectValue: string }
>('user/loginUser', async (userData, { rejectWithValue, signal }) => {
  try {
    // Токены при успешном ответе сохраняет сам authApi.login
    return await authApi.login(userData, signal);
  } catch (error) {
    return rejectWithValue(getHttpErrorMessage(error) ?? 'Регистрация не выполнена');
  }
});

export const fetchLogoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  'user/logoutUser',
  async (_, { rejectWithValue, signal }) => {
    try {
      await authApi.logout(signal);
    } catch (error) {
      return rejectWithValue(
        getHttpErrorMessage(error) ?? 'Не удалось выйти из системы'
      );
    }
  }
);

// Первичная проверка авторизации при старте приложения.
// Thunk всегда завершается fulfilled: user === null значит «не авторизован»,
// завершение выставляет isAuthChecked в редьюсере.
export const checkUserAuth = createAsyncThunk<UserAuthResponse['user'] | null, void>(
  'user/checkUserAuth',
  async (_, { signal }) => {
    if (!isTokenExists()) {
      return null;
    }

    try {
      const response = await authApi.getUser(signal);

      return response.user;
    } catch (error) {
      console.error(getHttpErrorMessage(error) ?? error);

      return null;
    }
  }
);
