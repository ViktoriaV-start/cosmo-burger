import { RESOURCE_API_URL } from '@utils/api-constants.ts';

import { HttpTransport } from './http-transport';

import type { TIngredient } from '@utils/types.ts';

const ingredientsApiInstance = new HttpTransport();

type TIngredientsResponse = {
  success: boolean;
  data: TIngredient[];
};

const isIngredientsResponse = (value: unknown): value is TIngredientsResponse => {
  return (
    !!value &&
    typeof value === 'object' &&
    (value as TIngredientsResponse).success === true &&
    Array.isArray((value as TIngredientsResponse).data)
  );
};

class IngredientsApi {
  async getIngredients(signal?: AbortSignal): Promise<TIngredient[]> {
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
