import { Button, Input } from '@krgaa/react-developer-burger-ui-components';
import { Link } from 'react-router-dom';

import { useRegisterPage } from './use-register-page';

import s from './register-page.module.css';

export const RegisterPage = () => {
  const { values, errors, isValid, onChange, onSubmit } = useRegisterPage();

  return (
    <main className={s.profile_container}>
      <form className={s.profile_form} onSubmit={onSubmit} noValidate>
        <h1 className="text text_type_main-medium">Регистрация</h1>
        <Input
          type="text"
          value={values.name}
          onChange={onChange}
          placeholder="Имя"
          name="name"
          extraClass="mt-6"
          error={!!errors.name}
          errorText={errors.name}
        />
        {/* Базовый Input вместо EmailInput/PasswordInput: только у него в типах есть error,
            а встроенная проверка тех компонентов расходилась бы с нашими валидаторами */}
        <Input
          type="email"
          value={values.email}
          onChange={onChange}
          placeholder="E-mail"
          name="email"
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
          extraClass="mt-6"
          error={!!errors.password}
          errorText={errors.password}
        />
        <Button
          htmlType="submit"
          type="primary"
          size="medium"
          extraClass="mt-6 mb-20"
          disabled={!isValid}
        >
          Зарегистрироваться
        </Button>
        <p className="text text_type_main-default text_color_inactive">
          Уже зарегистрированы?{' '}
          <Link to="/login" className={s.profile_link}>
            Войти
          </Link>
        </p>
      </form>
    </main>
  );
};
