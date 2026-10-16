const PWD_REGEX = /^[a-zA-Z0-9!@#$%^&*()_+{}[\]:;<>,.?~\\/-]{6,}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
const NAME_REGEX = /^[A-Za-zА-Яа-яЁё0-9\s-]{2,}$/;

type FieldValidator = {
  validator: (value: string) => boolean;
  message: string;
};

export type ValidatedFieldName = 'name' | 'email' | 'password';

export const validators: Record<ValidatedFieldName, FieldValidator> = {
  name: {
    validator: (value) => NAME_REGEX.test(value.trim()),
    message: 'Укажите корректное имя.',
  },
  email: {
    validator: (value) => EMAIL_REGEX.test(value.trim()),
    message: 'Укажите корректный email.',
  },
  password: {
    validator: (value) => PWD_REGEX.test(value.trim()),
    message: 'Укажите пароль посложнее.',
  },
};

export const isValidatedFieldName = (
  fieldName: string
): fieldName is ValidatedFieldName => fieldName in validators;
