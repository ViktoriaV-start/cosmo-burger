import { createSlice } from '@reduxjs/toolkit';

import { fetchIngredients } from './actions.ts';

import type { Ingredient } from '@utils';

type IngredientsState = {
  items: Ingredient[];
  isLoading: boolean;
  error: string | null;
};

const initialState: IngredientsState = {
  items: [],
  isLoading: false,
  error: null,
};

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.items = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        if (action.meta.aborted) {
          return;
        }

        state.isLoading = false;
        state.error = action.payload ?? 'Не удалось загрузить список ингредиентов';
      });
  },
  selectors: {
    getIngredients: (state) => state.items,
    getIngredientsLoading: (state) => state.isLoading,
    getIngredientsError: (state) => state.error,
    getIngredientById: (state, id: string | undefined) =>
      state.items.find(({ _id }) => _id === id) ?? null,
  },
});

export const {
  getIngredients,
  getIngredientsLoading,
  getIngredientsError,
  getIngredientById,
} = ingredientsSlice.selectors;
