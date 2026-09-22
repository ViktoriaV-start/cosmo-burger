import type { RootState } from '@services/store.ts';

export const getOrderName = (state: RootState) => state.order.name;
export const getOrderNumber = (state: RootState) => state.order.number;
