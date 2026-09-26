import {
  Button,
  EmailInput,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { Link } from 'react-router-dom';

import { useLoginPage } from './use-login-page';

import s from './login-page.module.css';

export const LoginPage = () => {
  const { email, password, onEmailChange, onPasswordChange, onSubmit } = useLoginPage();

  return (
    <main className={s.login_container}>
      <form className={s.form} onSubmit={onSubmit}>
        <h1 className="text text_type_main-medium">Вход</h1>
        <EmailInput
          value={email}
          onChange={onEmailChange}
          placeholder="E-mail"
          name="email"
          extraClass="mt-6"
        />
        <PasswordInput
          value={password}
          onChange={onPasswordChange}
          name="password"
          extraClass="mt-6"
        />
        <Button htmlType="submit" type="primary" size="medium" extraClass="mt-6 mb-20">
          Войти
        </Button>
        <p className="text text_type_main-default text_color_inactive">
          Вы — новый пользователь?{' '}
          <Link to="/register" className={s.link}>
            Зарегистрироваться
          </Link>
        </p>
        <p className="text text_type_main-default text_color_inactive mt-4">
          Забыли пароль?{' '}
          <Link to="/forgot-password" className={s.link}>
            Восстановить пароль
          </Link>
        </p>
      </form>
    </main>
  );
};
