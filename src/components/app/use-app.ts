import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

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

import type { AppDispatch } from '@services/store.ts';
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
  const dispatch = useDispatch<AppDispatch>();
  const ingredients: Ingredient[] = useSelector(getIngredients);
  const isLoading: boolean = useSelector(getIngredientsLoading);
  const errorMessage: string | null = useSelector(getIngredientsError);
  const ingredientModal = useSelector(getIngredientModal);
  const placedOrderNumber = useSelector(getOrderNumber);

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
