import { authApi } from '@/api/auth-api.ts';
import { getHttpErrorMessage } from '@/api/http-error.ts';
import { createAsyncThunk } from '@reduxjs/toolkit';

import type { RegisterResponse, User } from '@utils';

export const fetchRegisterUser = createAsyncThunk<
  RegisterResponse,
  User,
  { rejectValue: string }
>('user/registerUser', async (userData, { rejectWithValue, signal }) => {
  try {
    return await authApi.register(userData, signal);
  } catch (error) {
    return rejectWithValue(getHttpErrorMessage(error) ?? 'Регистрация не выполнена');
  }
});
