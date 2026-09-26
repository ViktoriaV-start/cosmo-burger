import { useState } from 'react';

import type { ChangeEvent, FormEvent } from 'react';

type UseResetPasswordPageReturn = {
  password: string;
  token: string;
  onPasswordChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onTokenChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
};

export const useResetPasswordPage = (): UseResetPasswordPageReturn => {
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');

  const onPasswordChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setPassword(e.target.value);
  };

  const onTokenChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setToken(e.target.value);
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    // TODO: сохранение нового пароля через API
  };

  return { password, token, onPasswordChange, onTokenChange, onSubmit };
};
