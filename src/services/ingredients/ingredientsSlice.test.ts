import { mockIngredients } from '@utils';
import { describe, it, expect } from 'vitest';

import { fetchIngredients } from './actions';
import { ingredientsSlice, initialState } from './reducer';

const initialTestState = ingredientsSlice.reducer(undefined, { type: '' });

describe('IngredientsSlice', () => {
  it('Должен возвращать начальное состояние', () => {
    expect(initialTestState).toEqual(initialState);
  });
});

describe('IngredientsSlice - extraReducers', () => {
  it('pending: включает isLoading и сбрасывает error', () => {
    const state = ingredientsSlice.reducer(
      { ...initialTestState, error: 'Некоторая ошибка' },
      fetchIngredients.pending('test-ingredient-slice-pending')
    );

    expect(state).toEqual({ ...initialState, isLoading: true, error: null });
  });

  it('fulfilled: сохраняет список и выключает isLoading', () => {
    const state = ingredientsSlice.reducer(
      { ...initialState, isLoading: true },
      fetchIngredients.fulfilled(mockIngredients, 'test-ingredient-slice-fulfilled')
    );

    expect(state).toEqual({ items: mockIngredients, isLoading: false, error: null });
  });

  it('rejected: сохраняет текст ошибки и выключает isLoading', () => {
    const state = ingredientsSlice.reducer(
      { ...initialState, isLoading: true },
      fetchIngredients.rejected(
        null,
        'test-ingredient-slice-rejected',
        undefined,
        'Ошибка сети'
      )
    );

    expect(state).toEqual({
      items: [],
      isLoading: false,
      error: 'Ошибка сети',
    });
  });
});
