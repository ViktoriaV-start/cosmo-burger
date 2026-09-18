import type { RootState } from '@services/store.ts';

export const getOrderBun = (state: RootState) => state.order.bun;
export const getOrderIngredients = (state: RootState) => state.order.ingredients;
export const getOrderName = (state: RootState) => state.order.name;
export const getOrderNumber = (state: RootState) => state.order.number;
export const getOrderPrice = (state: RootState) => state.order.price;
