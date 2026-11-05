import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_API_URL, SOCKET_API_URL } from '@utils';

import type { SOCKET_ORDERS_RESPONSE } from '@services/socket/types.ts';

let ws: WebSocket | null = null;

const parseSocketData = (raw: string): unknown => {
  try {
    return JSON.parse(raw);
  } catch {
    console.error('Не удалось разобрать сообщение от сервера:', raw);
    return null;
  }
};

const initialOrdersState: SOCKET_ORDERS_RESPONSE = {
  success: false,
  orders: [],
  total: 0,
  totalToday: 0,
};

export const socketApi = createApi({
  reducerPath: 'socketApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_API_URL }),
  endpoints: (builder) => ({
    getOrders: builder.query<SOCKET_ORDERS_RESPONSE, void>({
      queryFn: () => ({ data: initialOrdersState }),

      async onCacheEntryAdded(
        _arg,
        // eslint-disable-next-line @typescript-eslint/unbound-method
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        try {
          await cacheDataLoaded;
          ws = new WebSocket(`${SOCKET_API_URL}/orders/all`);

          ws.onmessage = (event: MessageEvent<string>) => {
            const data = parseSocketData(event.data);

            if (!data) return;

            updateCachedData((draft) => {
              Object.assign(draft, data as SOCKET_ORDERS_RESPONSE);
            });
          };
        } catch (error) {
          console.error('Не удалось инициализировать ленту заказов:', error);
        }

        await cacheEntryRemoved;
        ws?.close();
        ws = null;
      },
    }),

    getUserOrders: builder.query<SOCKET_ORDERS_RESPONSE, string>({
      queryFn: () => ({ data: initialOrdersState }),
      // getLocalStorageItem<string>(REFRESH_TOKEN_KEY)
      async onCacheEntryAdded(
        accessToken,
        // eslint-disable-next-line @typescript-eslint/unbound-method
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        let userWs: WebSocket | null = null;

        try {
          await cacheDataLoaded;

          // Токен передаём только как query-параметр, без "Bearer"
          userWs = new WebSocket(`${SOCKET_API_URL}/orders?token=${accessToken}`);

          userWs.onmessage = (event: MessageEvent<string>) => {
            const data = parseSocketData(event.data);

            if (!data) return;

            // Обработка ошибки от сервера (например, устаревший токен)
            if (
              typeof data === 'object' &&
              data !== null &&
              'message' in data &&
              typeof data.message === 'string'
            ) {
              console.error(
                'Ошибка WebSocket (возможно, токен устарел):',
                (data as { message: string }).message
              );
              return;
            }

            updateCachedData((draft) => {
              Object.assign(draft, data as SOCKET_ORDERS_RESPONSE);
            });
          };
        } catch (error) {
          console.error(
            'Не удалось инициализировать персональную ленту заказов:',
            error
          );
        }

        await cacheEntryRemoved;
        userWs?.close();
        userWs = null;
      },
    }),
  }),
});

export const { useGetOrdersQuery, useGetUserOrdersQuery } = socketApi;
