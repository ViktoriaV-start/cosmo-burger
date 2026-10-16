import { useState } from 'react';

import { isValidatedFieldName, validators } from '@utils/validators.ts';

import type { ChangeEvent } from 'react';

type FormValues = Record<string, string>;

// Текст ошибки по каждому полю; пустая строка — поле валидно
export type FormErrors<T extends FormValues> = Record<keyof T, string>;

type UseFormWithValidationOptions<T extends FormValues> = {
  // Поля, которые можно оставить пустыми (например, пароль в профиле)
  optionalFields?: (keyof T)[];
};

type UseFormWithValidationReturn<T extends FormValues> = {
  values: T;
  errors: FormErrors<T>;
  isValid: boolean;
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  resetForm: (nextValues?: T) => void;
};

const REQUIRED_FIELD_MESSAGE = 'Заполните поле.';

const initErrors = <T extends FormValues>(formValues: T): FormErrors<T> => {
  return Object.keys(formValues).reduce(
    (errors, fieldName) => ({ ...errors, [fieldName]: '' }),
    {} as FormErrors<T>
  );
};

const validateField = (
  fieldName: string,
  value: string,
  isOptional: boolean
): string => {
  const normalizedValue = value.trim();

  if (normalizedValue === '') {
    return isOptional ? '' : REQUIRED_FIELD_MESSAGE;
  }

  if (!isValidatedFieldName(fieldName)) {
    return '';
  }

  const { validator, message } = validators[fieldName];

  return validator(normalizedValue) ? '' : message;
};

const validateForm = <T extends FormValues>(
  formValues: T,
  optionalFields: (keyof T)[]
): FormErrors<T> => {
  return Object.entries(formValues).reduce(
    (errors, [fieldName, fieldValue]) => ({
      ...errors,
      [fieldName]: validateField(
        fieldName,
        fieldValue,
        optionalFields.includes(fieldName)
      ),
    }),
    {} as FormErrors<T>
  );
};

export function useFormWithValidation<T extends FormValues>(
  initialValues: T,
  { optionalFields = [] }: UseFormWithValidationOptions<T> = {}
): UseFormWithValidationReturn<T> {
  const [values, setValues] = useState<T>(initialValues);
  // Ошибки показываем только по полям, которые пользователь уже редактировал
  const [errors, setErrors] = useState<FormErrors<T>>(() => initErrors(initialValues));

  // Валидность считаем по всем полям, включая нетронутые
  const isValid = Object.values(validateForm(values, optionalFields)).every(
    (errorMessage) => errorMessage === ''
  );

  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    const { name, value } = event.target;

    setValues((prevValues) => ({ ...prevValues, [name]: value }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: validateField(name, value, optionalFields.includes(name)),
    }));
  }

  function resetForm(nextValues: T = initialValues): void {
    setValues(nextValues);
    setErrors(initErrors(nextValues));
  }

  return { values, errors, isValid, handleChange, resetForm };
}
