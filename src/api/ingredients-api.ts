import { RESOURCE_API_URL } from '@utils/api-constants.ts';

import { HttpTransport } from './http-transport';

import type { Ingredient } from '@utils/types.ts';

const ingredientsApiInstance = new HttpTransport();

type IngredientsResponse = {
  success: boolean;
  data: Ingredient[];
};

const isIngredientsResponse = (value: unknown): value is IngredientsResponse => {
  return (
    !!value &&
    typeof value === 'object' &&
    (value as IngredientsResponse).success === true &&
    Array.isArray((value as IngredientsResponse).data)
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
}

export const ingredientsApi = new IngredientsApi();
