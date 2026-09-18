import { createSlice } from '@reduxjs/toolkit';

import type { PayloadAction } from '@reduxjs/toolkit';
import type { Ingredient } from '@utils/types.ts';

type SelectedIngredientState = Ingredient | null;

export const selectedIngredientSlice = createSlice({
  name: 'selectedIngredient',
  initialState: null as SelectedIngredientState,
  reducers: {
    setSelectedIngredient: (_state, action: PayloadAction<Ingredient>) => action.payload,
    clearSelectedIngredient: () => null,
  },
});

export const { setSelectedIngredient, clearSelectedIngredient } =
  selectedIngredientSlice.actions;
