import { describe, it, expect } from 'vitest';

import { mockIngredients } from '@utils/mock.ts';

import {
  clearIngredientModal,
  ingredientModalSlice,
  setIngredientModal,
} from './reducer.ts';

const startState = ingredientModalSlice.reducer(undefined, { type: '' });

describe('ingredientModalSlice', () => {
  it('Должен возвращать начальное состояние', () => {
    expect(startState).toEqual(null);
  });

  it('Должен устанавливать для модального окна ингредиент', () => {
    const result = ingredientModalSlice.reducer(
      startState,
      setIngredientModal({ ...mockIngredients[0] })
    );

    expect(result).toEqual(mockIngredients[0]);
  });

  it('Должен очищать стейт слайса', () => {
    const result = ingredientModalSlice.reducer(startState, clearIngredientModal());

    expect(result).toEqual(startState);
  });
});
