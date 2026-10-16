import { useAppDispatch, useAppSelector } from '@hooks/redux.ts';
import {
  useFormWithValidation,
  type FormErrors,
} from '@hooks/use-form-with-validation.ts';
import { fetchUpdateUser } from '@services/user/actions.ts';
import { getUser, getUserError, getUserLoading } from '@services/user/reducer.ts';

import type { ChangeEvent, SubmitEvent } from 'react';

type ProfileFormValues = {
  name: string;
  email: string;
  password: string;
};

type UseProfileFormReturn = {
  values: ProfileFormValues;
  errors: FormErrors<ProfileFormValues>;
  isValid: boolean;
  isChanged: boolean;
  isLoading: boolean;
  errorMessage: string | null;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onCancel: () => void;
  onSubmit: (e: SubmitEvent<HTMLFormElement>) => void;
};

export const useProfileForm = (): UseProfileFormReturn => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(getUser);
  const isLoading = useAppSelector(getUserLoading);
  const errorMessage = useAppSelector(getUserError);

  const initialValues: ProfileFormValues = {
    name: user.name ?? '',
    email: user.email ?? '',
    password: '',
  };

  // Пустой пароль допустим: он означает «пароль не меняется»
  const { values, errors, isValid, handleChange, resetForm } =
    useFormWithValidation<ProfileFormValues>(initialValues, {
      optionalFields: ['password'],
    });

  // Исходные значения берём из стора: после сохранения они обновятся, и кнопки скроются сами
  const isChanged =
    values.name !== initialValues.name ||
    values.email !== initialValues.email ||
    values.password !== '';

  const onCancel = (): void => {
    resetForm(initialValues);
  };

  const onSubmit = (e: SubmitEvent<HTMLFormElement>): void => {
    e.preventDefault();

    if (!isValid) {
      return;
    }

    // Если пароль не редактировали, password === '' — сервер его не меняет
    dispatch(fetchUpdateUser(values))
      .unwrap()
      .then((updatedUser) => resetForm({ ...updatedUser, password: '' }))
      .catch((error) => console.log(error));
  };

  return {
    values,
    errors,
    isValid,
    isChanged,
    isLoading,
    errorMessage,
    onChange: handleChange,
    onCancel,
    onSubmit,
  };
};
