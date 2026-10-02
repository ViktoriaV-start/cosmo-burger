import { useAppDispatch } from '@hooks/redux.ts';
import {
  useFormWithValidation,
  type FormErrors,
} from '@hooks/use-form-with-validation.ts';
import { fetchRegisterUser } from '@services/user/actions.ts';

import type { ChangeEvent, SubmitEvent } from 'react';

type RegisterFormValues = {
  name: string;
  email: string;
  password: string;
};

type UseRegisterPageReturn = {
  values: RegisterFormValues;
  errors: FormErrors<RegisterFormValues>;
  isValid: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: SubmitEvent<HTMLFormElement>) => void;
};

export const useRegisterPage = (): UseRegisterPageReturn => {
  const dispatch = useAppDispatch();

  // Все поля обязательные; после успешной регистрации редирект делает ProtectedRoute
  const { values, errors, isValid, handleChange } =
    useFormWithValidation<RegisterFormValues>({ name: '', email: '', password: '' });

  const onSubmit = (e: SubmitEvent<HTMLFormElement>): void => {
    e.preventDefault();

    if (!isValid) {
      return;
    }

    dispatch(fetchRegisterUser(values))
      .unwrap()
      .catch((error) => console.log(error));
  };

  return {
    values,
    errors,
    isValid,
    onChange: handleChange,
    onSubmit,
  };
};
