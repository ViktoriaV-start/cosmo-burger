import { type SubmitEvent, type ChangeEvent, useState } from 'react';
// import { useNavigate } from 'react-router-dom';

import { useAppDispatch } from '@hooks/redux.ts';
import { fetchLoginUser } from '@services/user/actions.ts';

type UseLoginPageReturn = {
  email: string;
  password: string;
  onEmailChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: SubmitEvent<HTMLFormElement>) => void;
};

export const useLoginPage = (): UseLoginPageReturn => {
  // const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onEmailChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setEmail(e.target.value);
  };

  const onPasswordChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setPassword(e.target.value);
  };

  const onSubmit = (e: SubmitEvent<HTMLFormElement>): void => {
    e.preventDefault();
    dispatch(
      fetchLoginUser({
        email,
        password,
      })
    )
      .unwrap()
      // .then(() => navigate('/'))
      .catch((error) => console.log(error));
  };

  return { email, password, onEmailChange, onPasswordChange, onSubmit };
};
