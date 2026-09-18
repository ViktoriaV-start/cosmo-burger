import { PLACE_ORDER_API_URL, RESOURCE_API_URL } from '@utils/api-constants.ts';

import { HttpTransport } from './http-transport';

import type { Ingredient } from '@utils/types.ts';

const ingredientsApiInstance = new HttpTransport();

type IngredientsResponse = {
  success: boolean;
  data: Ingredient[];
};

type OrderResponse = {
  name: string;
  order: {
    number: number;
  };
  success: boolean;
};

type OrderData = {
  ingredients: string[];
};

const isIngredientsResponse = (value: unknown): value is IngredientsResponse => {
  return (
    !!value &&
    typeof value === 'object' &&
    (value as IngredientsResponse).success === true &&
    Array.isArray((value as IngredientsResponse).data)
  );
};

const isOrderResponse = (value: unknown): value is OrderResponse => {
  return (
    !!value &&
    typeof value === 'object' &&
    (value as IngredientsResponse).success === true
  );
};

class IngredientsApi {
  async getIngredients(signal?: AbortSignal): Promise<Ingredient[]> {
    const response = await ingredientsApiInstance.get(RESOURCE_API_URL, {
      signal,
    });

    if (!isIngredientsResponse(response)) {
      throw new Error('Сервер вернул некорректный ответ на запрос ингредиентов');
    }

    return response.data;
  }

  async placeOrder(data: OrderData, signal?: AbortSignal): Promise<OrderResponse> {
    const response = await ingredientsApiInstance.post(PLACE_ORDER_API_URL, {
      data,
      signal,
    });

    if (!isOrderResponse(response)) {
      throw new Error('Сервер вернул некорректный ответ на запрос ингредиентов');
    }

    return response;
  }
}

export const ingredientsApi = new IngredientsApi();
