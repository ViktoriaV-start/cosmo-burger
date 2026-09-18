import type { RootState } from '@services/store.ts';

export const getIngredients = (state: RootState) => state.ingredients.items;
export const getIngredientsLoading = (state: RootState) => state.ingredients.isLoading;
export const getIngredientsError = (state: RootState) => state.ingredients.error;
