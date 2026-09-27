import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAppDispatch } from '@hooks/redux.ts';
import { fetchRegisterUser } from '@services/user/actions.ts';

import type { ChangeEvent, SubmitEvent } from 'react';

type UseRegisterPageReturn = {
  name: string;
  email: string;
  password: string;
  onNameChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onEmailChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: SubmitEvent<HTMLFormElement>) => void;
};

export const useRegisterPage = (): UseRegisterPageReturn => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
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

  const onSubmit = (e: SubmitEvent<HTMLFormElement>): void => {
    e.preventDefault();
    dispatch(fetchRegisterUser({ name, email, password }))
      .unwrap()
      .then(() => navigate('/'))
      .catch((error) => console.log(error));
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
