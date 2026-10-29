import { OrderCard } from '@components/order-card';
import { OrdersStats } from '@components/orders-stats';

import { useFeedPage } from './use-feed-page';

import s from './feed-page.module.css';

export const FeedPage = () => {
  const { orders, ready, inProgress, total, totalToday } = useFeedPage();

  return (
    <main className={s.feed_container}>
      <h1 className="text text_type_main-large mt-10 mb-5">Лента заказов</h1>
      <div className={s.feed_content}>
        <ul className={`${s.orders_list} custom-scroll`}>
          {orders.map((order) => (
            <li key={order.number}>
              <OrderCard order={order} />
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
    </main>
  );
};
