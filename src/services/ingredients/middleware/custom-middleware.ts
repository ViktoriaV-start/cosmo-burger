import type { Middleware } from '@reduxjs/toolkit';

/**
 * Генератор посредника (фабрика), который принимает любые аргументы
 * и возвращает настоящий middleware.
 */
export const customMiddleware =
  (...values: unknown[]): Middleware =>
  (storeApi) =>
  (next) =>
  (action) => {
    console.log(storeApi.getState());
    console.log(`middleware with ${values.join(', ')}`);

    return next(action);
  };
