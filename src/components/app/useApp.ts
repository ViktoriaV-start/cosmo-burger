import { getHttpErrorMessage } from '@/api/http-error.ts';
import { ingredientsApi } from '@/api/ingredients-api.ts';
import { useEffect, useState } from 'react';

import type { TIngredient, TOrder } from '@utils/types.ts';

type UseAppReturn = {
  ingredients: TIngredient[];
  isLoading: boolean;
  errorMessage: string | null;
  order: TOrder | null;
};

const findIngredient = (list: TIngredient[], id: string): TIngredient | null => {
  const ingredient = list.find(({ _id }) => _id === id);

  if (!ingredient) {
    return null;
  }

  return ingredient;
};

export const useApp = (): UseAppReturn => {
  const [ingredients, setIngredients] = useState<TIngredient[]>([]);
  const [order, setOrder] = useState<TOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const createOrder = (list: TIngredient[]): TOrder | null => {
    if (list.length === 0) {
      return null;
    }

    const bun = findIngredient(list, '692889f16bf770001bfeb4cc');

    if (!bun) {
      return null;
    }

    const fillings = [
      findIngredient(list, '692889f16bf770001bfeb4d6'),
      findIngredient(list, '692889f16bf770001bfeb4d7'),
      findIngredient(list, '692889f16bf770001bfeb4d8'),
      findIngredient(list, '692889f16bf770001bfeb4d9'),
      findIngredient(list, '692889f16bf770001bfeb4da'),
    ].filter((ingredient): ingredient is TIngredient => ingredient !== null);

    return { bun, fillings };
  };

  useEffect(() => {
    const controller = new AbortController();

    const getIngredients = async (): Promise<void> => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const data = await ingredientsApi.getIngredients(controller.signal);

        setIngredients(data);
        setOrder(createOrder(data));
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        setErrorMessage(
          getHttpErrorMessage(error) ?? 'Не удалось загрузить список ингредиентов'
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    void getIngredients();

    return (): void => {
      controller.abort();
    };
  }, []);

  return { ingredients, isLoading, errorMessage, order };
};
