import { ingredients } from '@utils/ingredients.ts';

import type { TOrder } from '@utils/types.ts';

const findIngredient = (id: string) => {
  const ingredient = ingredients.find(({ _id }) => _id === id);

  if (!ingredient) {
    throw new Error('not found');
  }

  return ingredient;
};

export const order: TOrder = {
  bun: findIngredient('60666c42cc7b410027a1a9b1'),
  fillings: [
    findIngredient('60666c42cc7b410027a1a9b9'),
    findIngredient('60666c42cc7b410027a1a9b4'),
    findIngredient('60666c42cc7b410027a1a9bc'),
    findIngredient('60666c42cc7b410027a1a9bb'),
    findIngredient('60666c42cc7b410027a1a9ba'),
  ],
};
