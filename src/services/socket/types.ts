import type { FeedOrderStatus } from '@utils';

export type Order = {
  ingredients: string[];
  _id: string;
  status: FeedOrderStatus;
  name: string;
  number: number;
  createdAt: string;
  updatedAt: string;
};

export type SOCKET_ORDERS_RESPONSE = {
  success: boolean;
  orders: Order[];
  total: number;
  totalToday: number;
};

export type SOCKET_ORDER_BY_ID_RESPONSE = {
  success: boolean;
  order: Order;
};
