import { describe, it, expect } from 'vitest';

import { formatOrderNumber } from '../format-order-number';

describe('Функция formatOrderNumber', () => {
  it('должна корректно форматировать номер заказа', () => {
    const initialNumber = 587;
    const formattedNumber = formatOrderNumber(initialNumber);
    expect(formattedNumber).toBe('000587');
  });
});
