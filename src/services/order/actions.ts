import { getHttpErrorMessage } from '@/api/http-error.ts';
import { ingredientsApi } from '@/api/ingredients-api.ts';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { getSelectedIngredients } from '@services/selected-ingredients/reducer.ts';

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
  const { bun, ingredients } = getSelectedIngredients(getState());

  if (!bun) {
    return rejectWithValue('Не выбрана булка для заказа');
  }

  try {
    const response = await ingredientsApi.placeOrder({
      ingredients: [bun._id, ...ingredients.map(({ _id }) => _id), bun._id],
    });

    return { name: response.name, number: response.order.number };
  } catch (error) {
    return rejectWithValue(getHttpErrorMessage(error) ?? 'Не удалось оформить заказ');
  }
});
