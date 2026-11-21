import { getHttpErrorMessage } from '@/api/http-error';
import { ingredientsApi } from '@/api/ingredients-api';
import { createAsyncThunk } from '@reduxjs/toolkit';

import type { Ingredient } from '@utils';

export const fetchIngredients = createAsyncThunk<
  Ingredient[],
  void,
  { rejectValue: string }
>('ingredients/fetchIngredients', async (_, { rejectWithValue, signal }) => {
  try {
    return await ingredientsApi.getIngredients(signal);
  } catch (error) {
    return rejectWithValue(
      getHttpErrorMessage(error) ?? 'Не удалось загрузить список ингредиентов'
    );
  }
});
