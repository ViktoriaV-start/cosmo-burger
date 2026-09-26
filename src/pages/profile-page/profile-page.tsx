import {
  EmailInput,
  Input,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { NavLink } from 'react-router-dom';

import { useProfilePage } from './use-profile-page';

import s from './profile-page.module.css';

const getLinkClassName = ({ isActive }: { isActive: boolean }): string =>
  `${s.profile_link} ${isActive ? s.profile_link_active : ''} text text_type_main-medium`;

export const ProfilePage = () => {
  const {
    name,
    email,
    password,
    onNameChange,
    onEmailChange,
    onPasswordChange,
    onLogout,
  } = useProfilePage();

  return (
    <main className={s.profile_container}>
      <div className={s.profile_menu}>
        <nav className={s.profile_navigation}>
          <NavLink to="/profile" end className={getLinkClassName}>
            Профиль
          </NavLink>
          <NavLink to="/profile/orders" className={getLinkClassName}>
            История заказов
          </NavLink>
          <button
            type="button"
            className={`${s.profile_link} text text_type_main-medium`}
            onClick={onLogout}
          >
            Выход
          </button>
        </nav>
        <p
          className={`${s.profile_description} text text_type_main-default text_color_inactive mt-20`}
        >
          В этом разделе вы можете изменит&nbsp;свои персональные данные
        </p>
      </div>

      <form className={`${s.form} ml-15`}>
        <Input
          type="text"
          value={name}
          onChange={onNameChange}
          placeholder="Имя"
          name="name"
          icon="EditIcon"
        />
        <EmailInput
          value={email}
          onChange={onEmailChange}
          placeholder="Логин"
          name="email"
          isIcon
          extraClass="mt-6"
        />
        <PasswordInput
          value={password}
          onChange={onPasswordChange}
          name="password"
          icon="EditIcon"
          extraClass="mt-6"
        />
      </form>
    </main>
  );
};
