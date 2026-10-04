import { authApi } from '@/api/auth-api.ts';
import {
  getLocalStorageItem,
  removeLocalStorageItem,
  RESET_PASSWORD_FLAG_KEY,
} from '@utils';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { ChangeEvent, SubmitEvent } from 'react';

type UseResetPasswordPageReturn = {
  password: string;
  token: string;
  canReset: boolean;
  onPasswordChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onTokenChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: SubmitEvent<HTMLFormElement>) => void;
};

export const useResetPasswordPage = (): UseResetPasswordPageReturn => {
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');

  const canReset = getLocalStorageItem<boolean>(RESET_PASSWORD_FLAG_KEY) === true;

  const onPasswordChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setPassword(e.target.value);
  };

  const onTokenChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setToken(e.target.value);
  };

  const onSubmit = (e: SubmitEvent<HTMLFormElement>): void => {
    e.preventDefault();
    authApi
      .resetPassword({ password, token })
      .then(() => {
        removeLocalStorageItem(RESET_PASSWORD_FLAG_KEY);
        return navigate('/login');
      })
      .catch((error) => console.log(error));
  };

  return { password, token, canReset, onPasswordChange, onTokenChange, onSubmit };
};
