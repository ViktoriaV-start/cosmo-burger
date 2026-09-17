import { getHttpErrorMessage } from '@/api/http-error.ts';
import { ingredientsApi } from '@/api/ingredients-api.ts';
import { useEffect, useState } from 'react';

import type { Ingredient, Order } from '@utils/types.ts';

type UseAppReturn = {
  ingredients: Ingredient[];
  isLoading: boolean;
  errorMessage: string | null;
  order: Order | null;
  selectedIngredient: Ingredient | null;
  onIngredientClick: (ingredient: Ingredient) => void;
  onCloseIngredientModal: () => void;
  orderNumber: number | null;
  onOrderClick: () => void;
  onCloseOrderModal: () => void;
};

const findIngredient = (list: Ingredient[], id: string): Ingredient | null => {
  const ingredient = list.find(({ _id }) => _id === id);

  if (!ingredient) {
    return null;
  }

  return ingredient;
};

export const useApp = (): UseAppReturn => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  const [orderNumber, setOrderNumber] = useState<number | null>(null);

  const createOrder = (list: Ingredient[]): Order | null => {
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
    ].filter((ingredient): ingredient is Ingredient => ingredient !== null);

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

  const onIngredientClick = (ingredient: Ingredient): void => {
    setSelectedIngredient(ingredient);
  };

  const onCloseIngredientModal = (): void => {
    setSelectedIngredient(null);
  };

  const onOrderClick = (): void => {
    setOrderNumber(Math.floor(100000 + Math.random() * 900000));
  };

  const onCloseOrderModal = (): void => {
    setOrderNumber(null);
  };

  return {
    ingredients,
    isLoading,
    errorMessage,
    order,
    selectedIngredient,
    onIngredientClick,
    onCloseIngredientModal,
    orderNumber,
    onOrderClick,
    onCloseOrderModal,
  };
};
