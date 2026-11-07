import type { IngredientLocationState } from '@pages/ingredient-page/use-ingredient-page.ts';

export const ACCESS_TOKEN_KEY = 'accessToken';
export const REFRESH_TOKEN_KEY = 'refreshToken';
export const RESET_PASSWORD_FLAG_KEY = 'resetPasswordRequested';

export const ErrorType = {
  AccessToken: 'accessToken',
} as const;

export const MODAL_STATE: IngredientLocationState = { isModal: true };

export const MAX_PER_STATUS = 20;

export const DONE_STATUS = 'done';
export const IN_PROGRESS_STATUSES = ['pending', 'created'];
