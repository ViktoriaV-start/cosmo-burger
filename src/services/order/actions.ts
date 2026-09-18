import { getHttpErrorMessage } from '@/api/http-error.ts';
import { ingredientsApi } from '@/api/ingredients-api.ts';
import { createAsyncThunk } from '@reduxjs/toolkit';

import type { RootState } from '@services/store.ts';

type PlaceOrderResult = {
  name: string;
  number: number;
};

export const placeOrder = createAsyncThunk<
  PlaceOrderResult,
  void,
  { state: RootState; rejectValue: string }
>('order/placeOrder', async (_, { getState, rejectWithValue }) => {
  const { bun, ingredients } = getState().order;

  if (!bun) {
    return rejectWithValue('Не выбрана булка для заказа');
  }

  if (!ingredients) {
    return rejectWithValue('Не выбраны начинки для заказа');
  }

  try {
    const response = await ingredientsApi.placeOrder({
      ingredients: [bun, ...ingredients, bun],
    });

    return { name: response.name, number: response.order.number };
  } catch (error) {
    return rejectWithValue(getHttpErrorMessage(error) ?? 'Не удалось оформить заказ');
  }
});
