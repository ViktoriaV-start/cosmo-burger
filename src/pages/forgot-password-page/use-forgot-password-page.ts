import { useState } from 'react';

import type { ChangeEvent, FormEvent } from 'react';

type UseForgotPasswordPageReturn = {
  email: string;
  onEmailChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
};

export const useForgotPasswordPage = (): UseForgotPasswordPageReturn => {
  const [email, setEmail] = useState('');

  const onEmailChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setEmail(e.target.value);
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    // TODO: запрос на восстановление пароля через API и переход на /reset-password
  };

  return { email, onEmailChange, onSubmit };
};
