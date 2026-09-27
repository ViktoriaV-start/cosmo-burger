import { createSlice } from '@reduxjs/toolkit';

import { fetchLoginUser, fetchRegisterUser } from '@services/user/actions.ts';

type UserState = {
  email: string | null;
  name: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: UserState = {
  email: null,
  name: null,
  accessToken: null,
  refreshToken: null,
  isLoading: false,
  error: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRegisterUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRegisterUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.email = action.payload.user.email;
        state.name = action.payload.user.name;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
      })
      .addCase(fetchRegisterUser.rejected, (state, action) => {
        if (action.meta.aborted) {
          return;
        }

        state.isLoading = false;
        state.error = action.payload ?? 'Регистрация не произведена';
      })
      .addCase(fetchLoginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLoginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.email = action.payload.user.email;
        state.name = action.payload.user.name;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
      })
      .addCase(fetchLoginUser.rejected, (state, action) => {
        if (action.meta.aborted) {
          return;
        }

        state.isLoading = false;
        state.error = action.payload ?? 'Ошибка при входе';
      });
  },
  selectors: {
    getUser: (state) => ({
      name: state.name,
      email: state.email,
    }),
    getUserLoading: (state) => state.isLoading,
    getUserError: (state) => state.error,
  },
});

export const { getUser, getUserLoading, getUserError } = userSlice.selectors;
