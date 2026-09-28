import { authApi } from '@/api/auth-api.ts';
import { getHttpErrorMessage } from '@/api/http-error.ts';
import { createAsyncThunk } from '@reduxjs/toolkit';

import type { AuthResponse, User } from '@utils';

export const fetchRegisterUser = createAsyncThunk<
  AuthResponse,
  User,
  { rejectValue: string }
>('user/registerUser', async (userData, { rejectWithValue, signal }) => {
  try {
    // Токены при успешном ответе сохраняет сам authApi.register
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
