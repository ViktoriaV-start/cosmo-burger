import {
  Button,
  Input,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { Link, Navigate } from 'react-router-dom';

import { useResetPasswordPage } from './use-reset-password-page';

import s from './reset-password-page.module.css';

export const ResetPasswordPage = () => {
  const { password, token, canReset, onPasswordChange, onTokenChange, onSubmit } =
    useResetPasswordPage();

  if (!canReset) {
    return <Navigate to="/forgot-password" replace />;
  }

  return (
    <main className={s.reset_password_container}>
      <form className={s.reset_password_form} onSubmit={onSubmit}>
        <h1 className="text text_type_main-medium">Восстановление пароля</h1>
        <PasswordInput
          value={password}
          onChange={onPasswordChange}
          placeholder="Введите новый пароль"
          name="password"
          extraClass="mt-6"
        />
        <Input
          type="text"
          value={token}
          onChange={onTokenChange}
          placeholder="Введите код из письма"
          name="token"
          extraClass="mt-6"
        />
        <Button htmlType="submit" type="primary" size="medium" extraClass="mt-6 mb-20">
          Сохранить
        </Button>
        <p className="text text_type_main-default text_color_inactive">
          Вспомнили пароль?{' '}
          <Link to="/login" className={s.reset_password_link}>
            Войти
          </Link>
        </p>
      </form>
    </main>
  );
};
