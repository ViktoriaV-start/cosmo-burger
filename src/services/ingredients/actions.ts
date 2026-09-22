import { getHttpErrorMessage } from '@/api/http-error.ts';
import { ingredientsApi } from '@/api/ingredients-api.ts';
import { createAsyncThunk } from '@reduxjs/toolkit';

import {
  getIngredients,
  getIngredientsError,
  getIngredientsLoading,
} from './selectors.ts';

import type { RootState } from '@services/store.ts';
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

export const selectIngredients = (state: RootState) => getIngredients(state);
export const selectIngredientsLoading = (state: RootState) =>
  getIngredientsLoading(state);
export const selectIngredientsError = (state: RootState) => getIngredientsError(state);
