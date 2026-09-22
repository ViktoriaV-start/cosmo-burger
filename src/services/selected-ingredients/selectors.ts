import { createSelector } from '@reduxjs/toolkit';

import type { RootState } from '@services/store.ts';

export const getSelectedIngredients = (state: RootState) => state.selectedIngredients;

export const getTotalPrice = createSelector(
  [getSelectedIngredients],
  ({ bun, ingredients }): number =>
    (bun?.price ?? 0) * 2 + ingredients.reduce((sum, { price }) => sum + price, 0)
);

export const getIngredientCounts = createSelector(
  [getSelectedIngredients],
  ({ bun, ingredients }): Record<string, number> => {
    const counts: Record<string, number> = {};

    if (bun) {
      counts[bun._id] = 2;
    }

    ingredients.forEach(({ _id }) => {
      counts[_id] = (counts[_id] ?? 0) + 1;
    });

    return counts;
  }
);
