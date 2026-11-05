import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useEffect } from 'react';
import { Link, Outlet, useLocation, useMatch } from 'react-router-dom';

import { OrderCard } from '@components/order-card';
import { OrdersStats } from '@components/orders-stats';
import { useAppDispatch, useAppSelector } from '@hooks/redux.ts';
import { fetchIngredients } from '@services/ingredients/actions.ts';
import { getIngredients, getIngredientsLoading } from '@services/ingredients/reducer.ts';
import { useGetOrdersQuery } from '@services/socket/api';

import type { IngredientLocationState } from '@/pages/ingredient-page/use-ingredient-page';

import s from './feed-page.module.css';

const MODAL_STATE: IngredientLocationState = { isModal: true };

const MAX_PER_STATUS = 20;

const DONE_STATUS = 'done';
const IN_PROGRESS_STATUSES = ['pending', 'created'];

export const FeedPage = () => {
  const location = useLocation();
  const orderMatch = useMatch('/feed/:id');
  const isModal = Boolean((location.state as IngredientLocationState)?.isModal);
  const dispatch = useAppDispatch();
  const ingredients = useAppSelector(getIngredients);
  const isIngredientsLoading: boolean = useAppSelector(getIngredientsLoading);

  const { data } = useGetOrdersQuery();

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

  useEffect(() => {
    if (ingredients.length) {
      return;
    }

    const promise = dispatch(fetchIngredients());

    return (): void => {
      promise.abort();
    };
  }, [dispatch, ingredients.length]);

  if (orderMatch && !isModal) {
    return <Outlet />;
  }

  return (
    <>
      {isIngredientsLoading && <Preloader />}

      {!isIngredientsLoading && (
        <main className={s.feed_container}>
          <h1 className="text text_type_main-large mt-10 mb-5">Лента заказов</h1>
          <div className={s.feed_content}>
            <ul className={`${s.orders_list} custom-scroll`}>
              {orders.map((order) => (
                <li key={order._id}>
                  <Link
                    className={s.order_link}
                    to={`/feed/${order.number}`}
                    state={MODAL_STATE}
                  >
                    <OrderCard order={order} />
                  </Link>
                </li>
              ))}
            </ul>
            <OrdersStats
              isIngredientsLoading={isIngredientsLoading}
              ready={ready}
              inProgress={inProgress}
              total={total}
              totalToday={totalToday}
            />
          </div>
          <Outlet />
        </main>
      )}
    </>
  );
};
