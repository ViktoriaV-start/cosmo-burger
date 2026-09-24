import { useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from '@hooks/redux.ts';
import {
  clearIngredientModal,
  getIngredientModal,
  setIngredientModal,
} from '@services/ingredient-modal/reducer.ts';
import { fetchIngredients } from '@services/ingredients/actions.ts';
import {
  getIngredients,
  getIngredientsError,
  getIngredientsLoading,
} from '@services/ingredients/reducer.ts';
import { getOrderNumber } from '@services/order/reducer.ts';

import type { Ingredient } from '@utils';

type UseAppReturn = {
  ingredients: Ingredient[];
  isLoading: boolean;
  errorMessage: string | null;
  ingredientModal: Ingredient | null;
  onIngredientClick: (ingredient: Ingredient) => void;
  onCloseIngredientModal: () => void;
  orderNumber: number | null;
  onCloseOrderModal: () => void;
};

export const useApp = (): UseAppReturn => {
  const dispatch = useAppDispatch();
  const ingredients: Ingredient[] = useAppSelector(getIngredients);
  const isLoading: boolean = useAppSelector(getIngredientsLoading);
  const errorMessage: string | null = useAppSelector(getIngredientsError);
  const ingredientModal = useAppSelector(getIngredientModal);
  const placedOrderNumber = useAppSelector(getOrderNumber);

  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  useEffect(() => {
    const promise = dispatch(fetchIngredients());

    return (): void => {
      promise.abort();
    };
  }, [dispatch]);

  useEffect(() => {
    if (placedOrderNumber !== null) {
      setIsOrderModalOpen(true);
    }
  }, [placedOrderNumber]);

  const onIngredientClick = (ingredient: Ingredient): void => {
    dispatch(setIngredientModal(ingredient));
  };

  const onCloseIngredientModal = (): void => {
    dispatch(clearIngredientModal());
  };

  const onCloseOrderModal = (): void => {
    setIsOrderModalOpen(false);
  };

  return {
    ingredients,
    isLoading,
    errorMessage,
    ingredientModal,
    onIngredientClick,
    onCloseIngredientModal,
    orderNumber: isOrderModalOpen ? placedOrderNumber : null,
    onCloseOrderModal,
  };
};
