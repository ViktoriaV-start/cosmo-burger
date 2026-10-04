import { createSlice } from '@reduxjs/toolkit';

import { fetchIngredients } from '@services/ingredients/actions.ts';

import { placeOrder } from './actions.ts';

type OrderState = {
  name: string | null;
  number: number | null;
  isLoading: boolean;
};

const initialState: OrderState = {
  name: null,
  number: null,
  isLoading: false,
};

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrderResult: (state) => {
      state.name = null;
      state.number = null;
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.name = action.payload.name;
        state.number = action.payload.number;
        state.isLoading = false;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        if (action.meta.aborted) {
          return;
        }

        state.isLoading = false;
      });
  },
  selectors: {
    getOrderName: (state) => state.name,
    getOrderNumber: (state) => state.number,
    getOrderLoading: (state) => state.isLoading,
  },
});

export const { getOrderName, getOrderNumber, getOrderLoading } = orderSlice.selectors;
