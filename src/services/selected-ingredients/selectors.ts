import type { RootState } from '@services/store.ts';

export const getSelectedIngredients = (state: RootState) => state.selectedIngredients;
