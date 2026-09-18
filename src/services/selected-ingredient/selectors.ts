import type { RootState } from '@services/store.ts';

export const getSelectedIngredient = (state: RootState) => state.selectedIngredient;
