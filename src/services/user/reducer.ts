import { createSelector, createSlice, type PayloadAction } from '@reduxjs/toolkit';

import {
  checkUserAuth,
  fetchLoginUser,
  fetchLogoutUser,
  fetchRegisterUser,
} from '@services/user/actions.ts';

import type { User } from '@utils';

type UserState = {
  email: string | null;
  name: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthChecked: boolean;
};

const initialState: UserState = {
  email: null,
  name: null,
  accessToken: null,
  refreshToken: null,
  isLoading: false,
  error: null,
  isAuthChecked: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<Omit<User, 'password'>>) => {
      state.email = action.payload.email;
      state.name = action.payload.name;
    },
    setIsAuthChecked: (state, action: PayloadAction<boolean>) => {
      state.isAuthChecked = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.email = action.payload?.email ?? null;
        state.name = action.payload?.name ?? null;
        state.isAuthChecked = true;
      })
      .addCase(checkUserAuth.rejected, (state) => {
        state.isAuthChecked = true;
      })
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
        state.isAuthChecked = true;
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
        state.isAuthChecked = true;
      })
      .addCase(fetchLoginUser.rejected, (state, action) => {
        if (action.meta.aborted) {
          return;
        }

        state.isLoading = false;
        state.error = action.payload ?? 'Ошибка при входе';
      })
      .addCase(fetchLogoutUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLogoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
        state.email = null;
        state.name = null;
        state.accessToken = null;
        state.refreshToken = null;
      })
      .addCase(fetchLogoutUser.rejected, (state, action) => {
        if (action.meta.aborted) {
          return;
        }

        state.isLoading = false;
        state.error = action.payload ?? 'Не удалось выйти из системы';
        state.email = null;
        state.name = null;
        state.accessToken = null;
        state.refreshToken = null;
      });
  },
  selectors: {
    // Мемоизирован: возвращает тот же объект, пока name и email не изменились,
    // иначе useSelector получал бы новую ссылку на каждый вызов и лишне перерендерил компонент
    getUser: createSelector(
      [(state: UserState) => state.name, (state: UserState) => state.email],
      (name, email) => ({ name, email })
    ),
    getUserLoading: (state) => state.isLoading,
    getUserError: (state) => state.error,
    getIsAuthChecked: (state) => state.isAuthChecked,
    getIsAuthorized: (state) => state.email !== null,
  },
});

export const { setUser, setIsAuthChecked } = userSlice.actions;
export const {
  getUser,
  getUserLoading,
  getUserError,
  getIsAuthChecked,
  getIsAuthorized,
} = userSlice.selectors;
