import { mockOrder } from '@utils';
import { describe, it, expect } from 'vitest';

import { placeOrder } from './actions';
import { orderSlice, clearOrderResult } from './reducer';

const startState = orderSlice.reducer(undefined, { type: '' });

describe('orderSlice', () => {
  it('Должен возвращать начальное состояние', () => {
    expect(startState).toEqual({
      name: null,
      number: null,
      isLoading: false,
      error: null,
    });
  });

  it('Должен очищать стейт слайса', () => {
    const result = orderSlice.reducer(mockOrder, clearOrderResult());

    expect(result).toEqual(startState);
  });
});

describe('orderSlice - extraReducers', () => {
  it('pending: включает isLoading', () => {
    const state = orderSlice.reducer(
      { ...startState },
      placeOrder.pending('test-order-slice-pending')
    );

    expect(state).toEqual({ ...startState, isLoading: true });
  });

  it('fulfilled: сохраняет заказ и выключает isLoading/error', () => {
    const state = orderSlice.reducer(
      { ...startState, isLoading: true },
      placeOrder.fulfilled(mockOrder, 'test-order-slice-fulfilled')
    );

    expect(state).toEqual({ ...mockOrder, isLoading: false });
  });

  it('rejected: выключает isLoading', () => {
    const state = orderSlice.reducer(
      { ...startState, isLoading: true },
      placeOrder.rejected(
        null,
        'test-order-slice-rejected',
        undefined,
        'Ошибка оформления заказа'
      )
    );

    expect(state).toEqual({
      name: null,
      number: null,
      isLoading: false,
      error: 'Ошибка оформления заказа',
    });
  });
});
