export type Order = {
  ingredients: string[];
  _id: string;
  status: string;
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
