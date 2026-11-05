import { skipToken } from '@reduxjs/toolkit/query';
import { ACCESS_TOKEN_KEY, getLocalStorageItem } from '@utils';

import { useGetUserOrdersQuery } from '@services/socket/api';

import s from './profile-order-page.module.css';

export const ProfileOrderPage = () => {
  const accessToken = getLocalStorageItem<string>(ACCESS_TOKEN_KEY);
  const normalisedToken = accessToken ? accessToken.replace('Bearer', '').trim() : null;

  const { data: userOrders } = useGetUserOrdersQuery(normalisedToken ?? skipToken);

  console.log(userOrders);

  return (
    <section className={`${s.orders_container} ml-15`}>
      <p className="text text_type_main-medium">Страница находится в разработке</p>
      <p className="text text_type_main-default text_color_inactive mt-4">
        Скоро здесь появится история ваших заказов
      </p>
    </section>
  );
};
