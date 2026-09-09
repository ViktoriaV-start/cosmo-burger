import { getHttpErrorMessage } from '@/api/http-error.ts';
import { ingredientsApi } from '@/api/ingredients-api.ts';
import { useEffect, useState } from 'react';

import type { TIngredient } from '@utils/types.ts';

export const useApp = () => {
  const [ingredients, setIngredients] = useState<TIngredient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const getIngredients = async () => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const data = await ingredientsApi.getIngredients(controller.signal);

        setIngredients(data);
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

    return () => {
      controller.abort();
    };
  }, []);

  return { ingredients, isLoading, errorMessage };
};
