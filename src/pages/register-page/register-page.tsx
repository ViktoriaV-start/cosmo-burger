import {
  Button,
  EmailInput,
  Input,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { Link } from 'react-router-dom';

import { useRegisterPage } from './use-register-page';

import s from './register-page.module.css';

export const RegisterPage = () => {
  const {
    name,
    email,
    password,
    onNameChange,
    onEmailChange,
    onPasswordChange,
    onSubmit,
  } = useRegisterPage();

  return (
    <main className={s.profile_container}>
      <form className={s.profile_form} onSubmit={onSubmit}>
        <h1 className="text text_type_main-medium">Регистрация</h1>
        <Input
          type="text"
          value={name}
          onChange={onNameChange}
          placeholder="Имя"
          name="name"
          extraClass="mt-6"
        />
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
