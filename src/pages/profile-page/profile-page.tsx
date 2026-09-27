import { NavLink, Outlet, useMatch } from 'react-router-dom';

import { useProfilePage } from './use-profile-page';

import s from './profile-page.module.css';

const getLinkClassName = ({ isActive }: { isActive: boolean }): string =>
  `${s.profile_link} ${isActive ? s.profile_link_active : ''} text text_type_main-medium`;

export const ProfilePage = () => {
  const { onLogout } = useProfilePage();
  const isOrdersPage = useMatch('/profile/orders');

  // email: 'lan@mail.ru',
  //   password: '1234567A',
  //   name: 'Lan',

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
          {isOrdersPage
            ? 'В этом разделе вы можете просмотреть свою историю заказов'
            : 'В этом разделе вы можете изменить свои персональные данные'}
        </p>
      </div>

      <Outlet />
    </main>
  );
};
