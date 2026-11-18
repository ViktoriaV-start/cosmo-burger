import { configureStore } from '@reduxjs/toolkit';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { socketApi } from './api';

const instances: FakeWebSocket[] = [];

class FakeWebSocket {
  public url: string;
  onmessage: ((e: MessageEvent) => void) | null = null;
  close = vi.fn();
  constructor(url: string) {
    this.url = url;
    instances.push(this);
  }
}
vi.stubGlobal('WebSocket', FakeWebSocket);

const makeStore = () =>
  configureStore({
    reducer: { [socketApi.reducerPath]: socketApi.reducer },
    middleware: (gdm) => gdm().concat(socketApi.middleware),
  });

describe('socketApi', () => {
  it('Должен возвращать начальное состояние', async () => {
    const store = makeStore();
    const promise = store.dispatch(socketApi.endpoints.getOrders.initiate());

    try {
      await promise;

      const result = socketApi.endpoints.getOrders.select()(store.getState());

      expect(result.data).toEqual({
        success: false,
        orders: [],
        total: 0,
        totalToday: 0,
      });
    } finally {
      promise.unsubscribe();
    }
  });
});

describe('socketApi — закрытие сокета', () => {
  let store: ReturnType<typeof makeStore>;

  beforeEach(() => {
    instances.length = 0;
    store = makeStore();
  });

  afterEach(() => {
    vi.useRealTimers(); // страховка, если тест упал с включёнными фейк-таймерами
  });

  it('Закрывает WebSocket после unsubscribe + keepUnusedDataFor', async () => {
    const promise = store.dispatch(socketApi.endpoints.getOrders.initiate());

    try {
      await promise;

      // onCacheEntryAdded асинхронный — после `await promise` сокет
      // может быть ещё не создан. Ждём его на РЕАЛЬНЫХ таймерах.
      await vi.waitFor(() => {
        expect(instances).toHaveLength(1);
      });

      const instance = instances[0];
      expect(instance.close).not.toHaveBeenCalled();

      // Включаем фейковые таймеры ДО unsubscribe,
      // чтобы setTimeout(removeQueryResult, 60_000) попал под мок.
      vi.useFakeTimers();
      promise.unsubscribe();

      // Промотать keepUnusedDataFor (60 секунд по умолчанию)
      await vi.advanceTimersByTimeAsync(60_000);

      expect(instance.close).toHaveBeenCalledTimes(1);
      expect(instance.close).toHaveBeenCalledWith();
    } finally {
      vi.useRealTimers();
      // Повторный unsubscribe безопасен: RTK Query делает его идемпотентным,
      // а если запись уже удалена — это no-op.
      promise.unsubscribe();
    }
  });
});
