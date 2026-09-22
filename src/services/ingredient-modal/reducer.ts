import { createSlice } from '@reduxjs/toolkit';

import type { PayloadAction } from '@reduxjs/toolkit';
import type { Ingredient } from '@utils/types.ts';

type SelectedIngredientState = Ingredient | null;

export const ingredientModalSlice = createSlice({
  name: 'ingredientModal',
  initialState: null as SelectedIngredientState,
  reducers: {
    setIngredientModal: (_state, action: PayloadAction<Ingredient>) => action.payload,
    clearIngredientModal: () => null,
  },
});

export const { setIngredientModal, clearIngredientModal } = ingredientModalSlice.actions;
