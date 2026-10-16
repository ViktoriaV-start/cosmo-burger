import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from './app-constants';
import { getLocalStorageItem } from './local-storage';

// Достаточно refreshToken: по нему можно получить новый accessToken
export const isTokenExists = (): boolean => {
  return (
    !!getLocalStorageItem<string>(REFRESH_TOKEN_KEY) ||
    !!getLocalStorageItem<string>(ACCESS_TOKEN_KEY)
  );
};
