import { mockIngredients } from '@utils';
import { describe, it, expect } from 'vitest';

import {
  addSelectedIngredient,
  clearSelectedIngredients,
  moveSelectedIngredient,
  removeSelectedIngredient,
  selectedIngredientsSlice,
} from './reducer';

const startState = selectedIngredientsSlice.reducer(undefined, { type: '' });

describe('selectedIngredientsSlice', () => {
  it('Должен возвращать начальное состояние', () => {
    expect(startState).toEqual({
      bun: null,
      ingredients: [],
    });
  });

  it('Должен добавлять ингредиент', () => {
    const result = selectedIngredientsSlice.reducer(
      startState,
      addSelectedIngredient(mockIngredients[1])
    );
    expect(result).toEqual({
      bun: null,
      ingredients: [mockIngredients[1]],
    });
  });

  it('Должен удалить ингредиент', () => {
    const stateWithIngredients = {
      bun: mockIngredients[0],
      ingredients: [mockIngredients[1]],
    };
    const result = selectedIngredientsSlice.reducer(
      stateWithIngredients,
      removeSelectedIngredient('692889f16bf770001bfeb4d6')
    );

    expect(result).toEqual({
      bun: mockIngredients[0],
      ingredients: [],
    });
  });

  it('Должен переместить элемент на указанную позицию в массиве ингредиентов', () => {
    const stateWithIngredients = {
      bun: mockIngredients[0],
      ingredients: [mockIngredients[1], mockIngredients[2]],
    };
    const movedIngredientState = {
      bun: mockIngredients[0],
      ingredients: [mockIngredients[2], mockIngredients[1]],
    };

    const result = selectedIngredientsSlice.reducer(
      stateWithIngredients,
      moveSelectedIngredient({ dragIndex: 0, hoverIndex: 1 })
    );

    expect(result).toEqual(movedIngredientState);
  });

  it('Должен очищать стейт для selectedIngredientsSlice', () => {
    const stateWithIngredients = {
      bun: mockIngredients[0],
      ingredients: [mockIngredients[1]],
    };

    const result = selectedIngredientsSlice.reducer(
      stateWithIngredients,
      clearSelectedIngredients()
    );

    expect(result).toEqual(startState);
  });
});
