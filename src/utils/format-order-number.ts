// Номер заказа в ленте всегда из 6 цифр: 34535 → 034535
export const formatOrderNumber = (orderNumber: number): string =>
  String(orderNumber).padStart(6, '0');
