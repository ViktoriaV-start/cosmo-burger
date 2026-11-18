import { createSlice } from '@reduxjs/toolkit';

import { placeOrder } from './actions.ts';

type OrderState = {
  name: string | null;
  number: number | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: OrderState = {
  name: null,
  number: null,
  isLoading: false,
  error: null,
};

export const orderSlice = createSlice({
  name: 'order',
  initialState: { ...initialState },
  reducers: {
    clearOrderResult: (state) => {
      state.name = null;
      state.number = null;
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (state) => {
        state.error = null;
        state.isLoading = true;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.name = action.payload.name;
        state.number = action.payload.number;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.isLoading = false;

        if (action.meta.aborted) {
          return;
        }
        state.error = action.payload ?? 'Не удалось отправить заказ';
      });
  },
  selectors: {
    getOrderName: (state) => state.name,
    getOrderNumber: (state) => state.number,
    getOrderLoading: (state) => state.isLoading,
    getOrderError: (state) => state.error,
  },
});

export const { getOrderName, getOrderNumber, getOrderLoading, getOrderError } =
  orderSlice.selectors;
export const { clearOrderResult } = orderSlice.actions;
