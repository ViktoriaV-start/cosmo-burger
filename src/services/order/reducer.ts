import { createSlice } from '@reduxjs/toolkit';

import { placeOrder } from './actions.ts';

type OrderState = {
  name: string | null;
  number: number | null;
};

const initialState: OrderState = {
  name: null,
  number: null,
};

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrderResult: (state) => {
      state.name = null;
      state.number = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(placeOrder.fulfilled, (state, action) => {
      state.name = action.payload.name;
      state.number = action.payload.number;
    });
  },
  selectors: {
    getOrderName: (state) => state.name,
    getOrderNumber: (state) => state.number,
  },
});

export const { getOrderName, getOrderNumber } = orderSlice.selectors;
