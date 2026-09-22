import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  clearIngredientModal,
  setIngredientModal,
} from '@services/ingredient-modal/reducer.ts';
import { getIngredientModal } from '@services/ingredient-modal/selectors.ts';
import {
  fetchIngredients,
  selectIngredients,
  selectIngredientsError,
  selectIngredientsLoading,
} from '@services/ingredients/actions.ts';
import { getOrderNumber } from '@services/order/selectors.ts';

import type { AppDispatch } from '@services/store.ts';
import type { Ingredient } from '@utils/types.ts';

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
  const ingredients: Ingredient[] = useSelector(selectIngredients);
  const isLoading: boolean = useSelector(selectIngredientsLoading);
  const errorMessage: string | null = useSelector(selectIngredientsError);
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
