import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  fetchIngredients,
  selectIngredients,
  selectIngredientsError,
  selectIngredientsLoading,
} from '@services/ingredients/actions.ts';

import type { AppDispatch } from '@services/store.ts';
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
  const dispatch = useDispatch<AppDispatch>();
  const ingredients: Ingredient[] = useSelector(selectIngredients);
  const isLoading: boolean = useSelector(selectIngredientsLoading);
  const errorMessage: string | null = useSelector(selectIngredientsError);

  const [order, setOrder] = useState<Order | null>(null);
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
    const promise = dispatch(fetchIngredients());

    return (): void => {
      promise.abort();
    };
  }, [dispatch]);

  useEffect(() => {
    setOrder(createOrder(ingredients));
  }, [ingredients]);

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
