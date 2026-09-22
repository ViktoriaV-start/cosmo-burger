import { createSlice } from '@reduxjs/toolkit';

import type { PayloadAction } from '@reduxjs/toolkit';
import type { Ingredient, Order } from '@utils';

const initialSelectedIngredientsState: Order = {
  bun: null,
  ingredients: [],
};

export const selectedIngredientsSlice = createSlice({
  name: 'selectedIngredients',
  initialState: initialSelectedIngredientsState,
  reducers: {
    addSelectedIngredient: (state, action: PayloadAction<Ingredient>) => {
      const ingredient = { ...action.payload };
      if (ingredient.type === 'bun') {
        return { ...state, bun: ingredient };
      } else {
        return { ...state, ingredients: [...state.ingredients, ingredient] };
      }
    },
    removeSelectedIngredient: (state, action: PayloadAction<string>) => {
      return {
        ...state,
        ingredients: state.ingredients.filter(({ id }) => id !== action.payload),
      };
    },
    clearSelectedIngredients: () => initialSelectedIngredientsState,
  },
});

export const {
  addSelectedIngredient,
  removeSelectedIngredient,
  clearSelectedIngredients,
} = selectedIngredientsSlice.actions;
