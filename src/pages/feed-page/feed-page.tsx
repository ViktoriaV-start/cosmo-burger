import { Link, Outlet, useLocation, useMatch } from 'react-router-dom';

import { OrderCard } from '@components/order-card';
import { OrdersStats } from '@components/orders-stats';

import { useFeedPage } from './use-feed-page';

import type { IngredientLocationState } from '@/pages/ingredient-page/use-ingredient-page';

import s from './feed-page.module.css';

const MODAL_STATE: IngredientLocationState = { isModal: true };

export const FeedPage = () => {
  const { orders, ready, inProgress, total, totalToday } = useFeedPage();
  const location = useLocation();
  const orderMatch = useMatch('/feed/:id');
  const isModal = Boolean((location.state as IngredientLocationState)?.isModal);

  // Детальная страница заказа по прямой ссылке — без ленты
  if (orderMatch && !isModal) {
    return <Outlet />;
  }

  return (
    <main className={s.feed_container}>
      <h1 className="text text_type_main-large mt-10 mb-5">Лента заказов</h1>
      <div className={s.feed_content}>
        <ul className={`${s.orders_list} custom-scroll`}>
          {orders.map((order) => (
            <li key={order.number}>
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
          ready={ready}
          inProgress={inProgress}
          total={total}
          totalToday={totalToday}
        />
      </div>
      <Outlet />
    </main>
  );
};
