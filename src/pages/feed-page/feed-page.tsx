// НЕ РАБОТАЕТ МОДАЛЬНОЕ ОКНО. ПРАВИТЬ ТОЛЬКО ЭТОТ ФАЙЛ

import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { DONE_STATUS, IN_PROGRESS_STATUSES, MAX_PER_STATUS } from '@utils';
import { Outlet, useMatch } from 'react-router-dom';

import { OrderFeed } from '@components/order-feed/order-feed.tsx';
import { OrdersStats } from '@components/orders-stats';
import { useAppData } from '@hooks/useAppData.ts';
import { useGetOrdersQuery } from '@services/socket/api';

import s from './feed-page.module.css';

export const FeedPage = () => {
  const { isModal, ingredients, isIngredientsLoading } = useAppData();

  const orderMatch = useMatch('/feed/:id');

  const { data } = useGetOrdersQuery();
  const hasOrdersAndIngredients = !!data?.total && !!ingredients.length;

  const orders = data?.orders ?? [];

  const total = data?.total ?? 0;
  const totalToday = data?.totalToday ?? 0;

  const ready = orders
    .filter((order) => order.status === DONE_STATUS)
    .slice(0, MAX_PER_STATUS)
    .map((order) => order.number);

  const inProgress = orders
    .filter((order) => IN_PROGRESS_STATUSES.includes(order.status))
    .slice(0, MAX_PER_STATUS)
    .map((order) => order.number);

  if (orderMatch && !isModal) {
    return <Outlet context={{ orders }} />;
  }

  const path = '/feed';

  return (
    <>
      {isIngredientsLoading && <Preloader />}

      {!isIngredientsLoading && hasOrdersAndIngredients && (
        <main className={s.feed_container}>
          <h1 className="text text_type_main-large mt-10 mb-5">Лента заказов</h1>
          <div className={s.feed_content}>
            <OrderFeed orders={orders} path={path} />
            <OrdersStats
              isIngredientsLoading={isIngredientsLoading}
              ready={ready}
              inProgress={inProgress}
              total={total}
              totalToday={totalToday}
            />
          </div>
        </main>
      )}

      <Outlet context={{ orders }} />
    </>
  );
};
