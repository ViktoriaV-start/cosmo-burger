import { describe, it, expect } from 'vitest';

import {
  checkUserAuth,
  fetchLoginUser,
  fetchLogoutUser,
  fetchRegisterUser,
  fetchUpdateUser,
} from './actions';
import { setIsAuthChecked, setUser, userSlice } from './reducer';

import type { User } from '@utils';

const startState = userSlice.reducer(undefined, { type: '' });
const user = {
  email: 'test@test.ru',
  password: 'secret',
  name: 'Test',
};

describe('userSlice', () => {
  it('Должен возвращать начальное состояние', () => {
    expect(startState).toEqual({
      email: null,
      name: null,
      accessToken: null,
      refreshToken: null,
      isLoading: false,
      error: null,
      isAuthChecked: false,
    });
  });

  it('Должен сохранить имя и почту пользователя', () => {
    const mockUser = {
      email: 'test@test.ru',
      name: 'Test',
    };

    const result = userSlice.reducer(startState, setUser(mockUser));

    expect(result).toEqual({ ...startState, ...mockUser });
  });

  it('Должен установить переданное значение в свойство isAuthChecked', () => {
    const mockUser = {
      email: 'test@test.ru',
      name: 'Test',
      accessToken: null,
      refreshToken: null,
      isLoading: false,
      error: null,
      isAuthChecked: false,
    };

    let result = userSlice.reducer(mockUser, setIsAuthChecked(true));
    expect(result).toEqual({ ...mockUser, isAuthChecked: true });
    result = userSlice.reducer(result, setIsAuthChecked(false));
    expect(result).toEqual({ ...mockUser, isAuthChecked: false });
  });
});

describe('UserSlice - extraReducers', () => {
  it('checkUserAuth:pending должен сбрасывать error и установить isLoading равным true', () => {
    const state = userSlice.reducer(
      { ...startState, error: 'Некоторая ошибка' },
      checkUserAuth.pending('test-user-slice-checkUserAuth-pending')
    );

    expect(state).toEqual({ ...startState, isLoading: true, error: null });
  });
  it('checkUserAuth:fulfilled должен установить isLoading равным true, сбросить ошибку и, если переданы, email/name', () => {
    const payload = {
      isLoading: false,
      error: null,
      email: 'test#test.ru',
      name: 'Test',
      isAuthChecked: true,
    };
    const state = userSlice.reducer(
      { ...startState },
      checkUserAuth.fulfilled({ ...payload }, 'test-user-slice-checkUserAuth-fulfilled')
    );

    expect(state).toEqual({ ...startState, ...payload });
  });
  it('checkUserAuth:rejected должен установить isAuthChecked = true и isLoading = false', () => {
    const state = userSlice.reducer(
      { ...startState, isLoading: true },
      checkUserAuth.rejected(null, 'test-user-slice-checkUserAuth-rejected')
    );

    expect(state).toEqual({ ...startState, isLoading: false, isAuthChecked: true });
  });

  it('fetchRegisterUser:pending должен сбрасывать error и установить isAuthChecked = true, isLoading = true', () => {
    const state = userSlice.reducer(
      {
        ...startState,
        error: 'Некоторая ошибка',
        isAuthChecked: false,
        isLoading: true,
      },
      fetchRegisterUser.pending('test-user-slice-fetchRegisterUser-pending', {} as User)
    );

    expect(state).toEqual({
      ...startState,
      isAuthChecked: false,
      isLoading: true,
      error: null,
    });
  });
  it('fetchRegisterUser:fulfilled должен сбросить ошибку, установить isLoading = false, isAuthChecked = true и сохранить данные пользователя', () => {
    const payload = {
      user: { email: 'test@test.ru', name: 'Test' },
      accessToken: 'test-123',
      refreshToken: 'test-12345',
      success: true,
    };

    const result = userSlice.reducer(
      { ...startState, isLoading: true, error: 'была ошибка' },
      fetchRegisterUser.fulfilled(
        payload,
        'test-user-slice-fetchRegisterUser-fulfilled',
        { email: 'test@rest.ru', name: 'Test', password: 'secret' } // arg (второй после payload — requestId, третий — arg)
      )
    );

    expect(result).toEqual({
      ...startState,
      email: 'test@test.ru',
      name: 'Test',
      accessToken: 'test-123',
      refreshToken: 'test-12345',
      isLoading: false,
      error: null,
      isAuthChecked: true,
    });
  });
  it('fetchRegisterUser:rejected должен установить error и isLoading = false', () => {
    const state = userSlice.reducer(
      { ...startState, isLoading: true },
      fetchRegisterUser.rejected(
        null,
        'test-user-slice-fetchRegisterUser-rejected',
        {} as User,
        'Ошибка'
      )
    );

    expect(state).toEqual({ ...startState, isLoading: false, error: 'Ошибка' });
  });

  it('fetchLoginUser:pending должен сбрасывать error и установить isLoading = true', () => {
    const state = userSlice.reducer(
      {
        ...startState,
        error: 'Некоторая ошибка',
        isLoading: false,
      },
      fetchLoginUser.pending('test-user-slice-fetch-login-user-pending', {} as User)
    );

    expect(state).toEqual({
      ...startState,
      isLoading: true,
      error: null,
    });
  });
  it('fetchLoginUser:fulfilled должен сбросить ошибку, установить isLoading = false, isAuthChecked = true и сохранить данные пользователя', () => {
    const payload = {
      success: true,
      user: {
        email: 'test@test.ru',
        name: 'Test',
      },
      accessToken: 'test-access-token',
      refreshToken: 'refresh-access-token',
    };

    const result = userSlice.reducer(
      { ...startState, isLoading: true, error: 'была ошибка' },
      fetchLoginUser.fulfilled(payload, 'test-user-slice-fetch-login-user-fulfilled', {
        email: 'test@rest.ru',
        password: 'secret',
      })
    );

    expect(result).toEqual({
      ...startState,
      email: 'test@test.ru',
      name: 'Test',
      accessToken: 'test-access-token',
      refreshToken: 'refresh-access-token',
      isLoading: false,
      error: null,
      isAuthChecked: true,
    });
  });
  it('fetchLoginUser:rejected должен установить error и isLoading = false', () => {
    const state = userSlice.reducer(
      { ...startState, isLoading: true },
      fetchLoginUser.rejected(
        null,
        'test-user-slice-fetch-login-user-rejected',
        {} as User,
        'Ошибка'
      )
    );

    expect(state).toEqual({ ...startState, isLoading: false, error: 'Ошибка' });
  });

  it('fetchUpdateUser:pending должен сбрасывать error и установить isLoading = true', () => {
    const currentUser = {
      ...user,
      accessToken: 'test-123',
      refreshToken: 'test-567',
      isLoading: false,
      error: 'Какая-то ошибка',
      isAuthChecked: true,
    };

    const state = userSlice.reducer(
      {
        ...currentUser,
      },
      fetchUpdateUser.pending('test-user-slice-fetch-update-user-pending', {} as User)
    );

    expect(state).toEqual({
      ...currentUser,
      isLoading: true,
      error: null,
    });
  });
  it('fetchUpdateUser:fulfilled должен установить isLoading = false и сохранить данные пользователя', () => {
    const payload = {
      email: 'alex@test.ru',
      name: 'Alex',
    };

    const currentState = {
      ...user,
      accessToken: 'test-access-token',
      refreshToken: 'refresh-access-token',
      isLoading: true,
      error: null,
      isAuthChecked: true,
    };

    const result = userSlice.reducer(
      { ...currentState },
      fetchUpdateUser.fulfilled(payload, 'test-user-slice-fetch-update-user-fulfilled', {
        email: 'test@rest.ru',
        name: 'Test',
      } as User)
    );

    expect(result).toEqual({
      ...currentState,
      ...payload,
      isLoading: false,
    });
  });
  it('fetchUpdateUser:rejected должен установить error и isLoading = false', () => {
    const state = userSlice.reducer(
      { ...startState, isLoading: true },
      fetchLoginUser.rejected(
        null,
        'test-user-slice-fetch-update-user-rejected',
        {} as User,
        'Ошибка'
      )
    );

    expect(state).toEqual({ ...startState, isLoading: false, error: 'Ошибка' });
  });

  it('fetchLogoutUser:pending должен сбрасывать error и установить isLoading = true', () => {
    const state = userSlice.reducer(
      { ...startState, error: 'Некоторая ошибка', isLoading: false },
      fetchLogoutUser.pending('test-user-slice-fetch-logout-user-pending')
    );

    expect(state).toEqual({
      ...startState,
      isLoading: true,
      error: null,
    });
  });
  it('fetchLogoutUser:fulfilled должен сбросить ошибку, установить isLoading = false и очистить данные пользователя', () => {
    const currentState = {
      ...startState,
      email: 'test@test.ru',
      name: 'Test',
      accessToken: 'test-access-token',
      refreshToken: 'refresh-token',
      isLoading: true,
      error: 'была ошибка',
      isAuthChecked: true,
    };

    const result = userSlice.reducer(
      currentState,
      fetchLogoutUser.fulfilled(undefined, 'test-user-slice-fetch-logout-user-fulfilled')
    );

    expect(result).toEqual({
      ...startState,
      email: null,
      name: null,
      accessToken: null,
      refreshToken: null,
      isLoading: false,
      error: null,
      isAuthChecked: true,
    });
  });
  it('fetchLogoutUser:rejected должен установить error, isLoading = false и очистить данные пользователя', () => {
    const currentState = {
      ...startState,
      email: 'test@test.ru',
      name: 'Test',
      accessToken: 'test-access-token',
      refreshToken: 'refresh-token',
      isLoading: true,
      isAuthChecked: true,
    };

    const state = userSlice.reducer(
      currentState,
      fetchLogoutUser.rejected(
        null,
        'test-user-slice-fetch-logout-user-rejected',
        undefined,
        'Ошибка'
      )
    );

    expect(state).toEqual({
      ...startState,
      email: null,
      name: null,
      accessToken: null,
      refreshToken: null,
      isLoading: false,
      error: 'Ошибка',
      isAuthChecked: true,
    });
  });
  it('fetchLogoutUser:rejected должен использовать дефолтное сообщение, если payload не передан', () => {
    const state = userSlice.reducer(
      { ...startState, isLoading: true },
      fetchLogoutUser.rejected(
        null,
        'test-user-slice-fetch-logout-user-rejected-default'
      )
    );

    expect(state).toEqual({
      ...startState,
      isLoading: false,
      error: 'Не удалось выйти из системы',
    });
  });
  it('fetchLogoutUser:rejected при aborted не должен менять состояние', () => {
    const currentState = {
      ...startState,
      email: 'test@test.ru',
      name: 'Test',
      accessToken: 'test-access-token',
      refreshToken: 'refresh-token',
      isLoading: true,
      error: null,
      isAuthChecked: true,
    };

    // эмулируем aborted-экшен: meta.aborted = true
    const abortedAction = {
      type: fetchLogoutUser.rejected.type,
      payload: undefined,
      error: { name: 'AbortError', message: 'Aborted' },
      meta: {
        requestId: 'test-user-slice-fetch-logout-user-aborted',
        arg: undefined,
        aborted: true,
        condition: false,
        rejectedWithValue: false,
        requestStatus: 'rejected' as const,
      },
    };

    const state = userSlice.reducer(currentState, abortedAction);

    // состояние должно остаться неизменным (включая isLoading = true и данные пользователя)
    expect(state).toEqual(currentState);
  });
});
