import { createSlice } from '@reduxjs/toolkit';

import { placeOrder } from './actions.ts';

type OrderState = {
  bun: string | null;
  ingredients: string[] | null;
  name: string | null;
  number: number | null;
  price: number | null;
};

const initialState: OrderState = {
  bun: '692889f16bf770001bfeb4cc',
  ingredients: ['692889f16bf770001bfeb4d8'],
  name: null,
  number: null,
  price: null,
};

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrderResult: (state) => {
      state.bun = null;
      state.ingredients = null;
      state.name = null;
      state.number = null;
      state.price = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(placeOrder.fulfilled, (state, action) => {
      state.name = action.payload.name;
      state.number = action.payload.number;
    });
  },
});
