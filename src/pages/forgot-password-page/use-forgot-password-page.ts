import { authApi } from '@/api/auth-api.ts';
import { RESET_PASSWORD_FLAG_KEY, setLocalStorageItem } from '@utils';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { ChangeEvent } from 'react';

type UseForgotPasswordPageReturn = {
  email: string;
  onEmailChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: SubmitEvent) => Promise<void>;
};

export const useForgotPasswordPage = (): UseForgotPasswordPageReturn => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');

  const onEmailChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setEmail(e.target.value);
  };

  const onSubmit = async (e: SubmitEvent): Promise<void> => {
    e.preventDefault();

    try {
      const response = await authApi.recoveryPassword({ email });

      if (response.success) {
        setLocalStorageItem(RESET_PASSWORD_FLAG_KEY, true);
        await navigate('/reset-password');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return { email, onEmailChange, onSubmit };
};
