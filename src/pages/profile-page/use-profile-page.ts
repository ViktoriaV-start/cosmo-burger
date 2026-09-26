import { useState } from 'react';

import type { ChangeEvent } from 'react';

type UseProfilePageReturn = {
  name: string;
  email: string;
  password: string;
  onNameChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onEmailChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onLogout: () => void;
};

export const useProfilePage = (): UseProfilePageReturn => {
  // TODO: брать начальные значения из данных пользователя
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

  const onLogout = (): void => {
    // TODO: выход через API
  };

  return {
    name,
    email,
    password,
    onNameChange,
    onEmailChange,
    onPasswordChange,
    onLogout,
  };
};
