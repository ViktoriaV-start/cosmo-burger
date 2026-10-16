import { Button, EmailInput } from '@krgaa/react-developer-burger-ui-components';
import { Link } from 'react-router-dom';

import { useForgotPasswordPage } from './use-forgot-password-page';

import s from './forgot-password-page.module.css';

export const ForgotPasswordPage = () => {
  const { email, onEmailChange, onSubmit } = useForgotPasswordPage();

  return (
    <main className={s.forgot_password_container}>
      <form className={s.forgot_password_form} onSubmit={onSubmit}>
        <h1 className="text text_type_main-medium">Восстановление пароля</h1>
        <EmailInput
          value={email}
          onChange={onEmailChange}
          placeholder="Укажите e-mail"
          name="email"
          extraClass="mt-6"
        />
        <Button htmlType="submit" type="primary" size="medium" extraClass="mt-6 mb-20">
          Восстановить
        </Button>
        <p className="text text_type_main-default text_color_inactive">
          Вспомнили пароль?{' '}
          <Link to="/login" className={s.forgot_password_link}>
            Войти
          </Link>
        </p>
      </form>
    </main>
  );
};
