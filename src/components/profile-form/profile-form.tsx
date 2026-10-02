import { Button, Input } from '@krgaa/react-developer-burger-ui-components';

import { useProfileForm } from './use-profile-form';

import s from './profile-form.module.css';

export const ProfileForm = () => {
  const {
    values,
    errors,
    isValid,
    isChanged,
    isLoading,
    errorMessage,
    onChange,
    onCancel,
    onSubmit,
  } = useProfileForm();

  return (
    <form className={`${s.form} ml-15`} onSubmit={onSubmit} noValidate>
      <Input
        type="text"
        value={values.name}
        onChange={onChange}
        placeholder="Имя"
        name="name"
        icon="EditIcon"
        error={!!errors.name}
        errorText={errors.name}
      />
      {/* Базовый Input вместо EmailInput/PasswordInput: только у него в типах есть error,
          а встроенная проверка тех компонентов расходилась бы с нашими валидаторами */}
      <Input
        type="email"
        value={values.email}
        onChange={onChange}
        placeholder="Логин"
        name="email"
        icon="EditIcon"
        extraClass="mt-6"
        error={!!errors.email}
        errorText={errors.email}
      />
      <Input
        type="password"
        value={values.password}
        onChange={onChange}
        placeholder="Пароль"
        name="password"
        icon="EditIcon"
        extraClass="mt-6"
        error={!!errors.password}
        errorText={errors.password}
      />
      {errorMessage && (
        <p className="text text_type_main-default text_color_error mt-6">
          {errorMessage}
        </p>
      )}
      {isChanged && (
        <div className={`${s.actions} mt-6`}>
          <Button htmlType="button" type="secondary" size="medium" onClick={onCancel}>
            Отмена
          </Button>
          <Button
            htmlType="submit"
            type="primary"
            size="medium"
            disabled={isLoading || !isValid}
          >
            Сохранить
          </Button>
        </div>
      )}
    </form>
  );
};
