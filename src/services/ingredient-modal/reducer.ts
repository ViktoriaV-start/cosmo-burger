import { createSlice } from '@reduxjs/toolkit';

import type { PayloadAction } from '@reduxjs/toolkit';
import type { Ingredient } from '@utils';

type SelectedIngredientState = Ingredient | null;

export const ingredientModalSlice = createSlice({
  name: 'ingredientModal',
  initialState: null as SelectedIngredientState,
  reducers: {
    setIngredientModal: (_state, action: PayloadAction<Ingredient>) => action.payload,
    clearIngredientModal: () => null,
  },
  selectors: {
    getIngredientModal: (state) => state,
  },
});

export const { setIngredientModal, clearIngredientModal } = ingredientModalSlice.actions;
export const { getIngredientModal } = ingredientModalSlice.selectors;
