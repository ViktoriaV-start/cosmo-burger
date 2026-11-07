import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { skipToken } from '@reduxjs/toolkit/query';
import { ACCESS_TOKEN_KEY, getLocalStorageItem } from '@utils';
import { Outlet, useMatch } from 'react-router-dom';

import { OrderFeed } from '@components/order-feed/order-feed.tsx';
import { useAppData } from '@hooks/useAppData.ts';
import { useGetUserOrdersQuery } from '@services/socket/api';

import s from './profile-order-page.module.css';

export const ProfileOrderPage = () => {
  const { isModal, ingredients, isIngredientsLoading } = useAppData();
  const orderMatch = useMatch('/profile/orders/:id');
  const accessToken = getLocalStorageItem<string>(ACCESS_TOKEN_KEY);
  const normalisedToken = accessToken ? accessToken.replace('Bearer', '').trim() : null;

  const { data: userOrders } = useGetUserOrdersQuery(normalisedToken ?? skipToken);
  const hasOrdersAndIngredients = !!userOrders?.total && !!ingredients.length;
  const orders = userOrders?.orders ?? [];

  const path = '/profile/orders';

  if (orderMatch && !isModal) {
    return <Outlet context={{ orders }} />;
  }

  return (
    <>
      {isIngredientsLoading && <Preloader />}

      {!isIngredientsLoading && hasOrdersAndIngredients && (
        <section className={`${s.orders_container} ml-15`}>
          <OrderFeed orders={orders} path={path} />
        </section>
      )}

      <Outlet context={{ orders }} />
    </>
  );
};
