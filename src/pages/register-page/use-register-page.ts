import { useState } from 'react';

import type { ChangeEvent, FormEvent } from 'react';

type UseRegisterPageReturn = {
  name: string;
  email: string;
  password: string;
  onNameChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onEmailChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
};

export const useRegisterPage = (): UseRegisterPageReturn => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onNameChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setName(e.target.value);
  };

  const onEmailChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setEmail(e.target.value);
  };

  const onPasswordChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setPassword(e.target.value);
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    // TODO: регистрация через API
  };

  return {
    name,
    email,
    password,
    onNameChange,
    onEmailChange,
    onPasswordChange,
    onSubmit,
  };
};
