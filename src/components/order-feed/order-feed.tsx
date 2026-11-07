import { MODAL_STATE } from '@utils';
import { Link } from 'react-router-dom';

import { OrderCard } from '../order-card';

import type { SOCKET_ORDERS_RESPONSE } from '@services/socket/types.ts';

import s from './order-feed.module.css';

export const OrderFeed = ({
  orders,
  path,
}: {
  orders: SOCKET_ORDERS_RESPONSE['orders'];
  path: string;
}) => {
  return (
    <ul className={`${s.orders_list} custom-scroll`}>
      {orders.map((order) => {
        return (
          <li key={order._id}>
            <Link
              className={s.order_link}
              to={`${path}/${order._id}`}
              state={MODAL_STATE}
            >
              <OrderCard order={order} />
            </Link>
          </li>
        );
      })}
    </ul>
  );
};
