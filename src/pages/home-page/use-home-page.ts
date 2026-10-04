import { useEffect, useState } from 'react';
import { useLocation, useMatch, useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '@hooks/redux.ts';
import { fetchIngredients } from '@services/ingredients/actions.ts';
import {
  getIngredients,
  getIngredientsError,
  getIngredientsLoading,
} from '@services/ingredients/reducer.ts';
import { getOrderLoading, getOrderNumber } from '@services/order/reducer.ts';
import { getUserLoading } from '@services/user/reducer.ts';

import type { IngredientLocationState } from '@/pages/ingredient-page/use-ingredient-page';
import type { Ingredient } from '@utils';

type UseAppReturn = {
  ingredients: Ingredient[];
  isLoading: boolean;
  errorMessage: string | null;
  isIngredientPage: boolean;
  onIngredientClick: (ingredient: Ingredient) => void;
  orderNumber: number | null;
  onCloseOrderModal: () => void;
};

export const useApp = (): UseAppReturn => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const ingredientMatch = useMatch('/ingredients/:id');
  const isModal = Boolean((location.state as IngredientLocationState)?.isModal);
  const ingredients: Ingredient[] = useAppSelector(getIngredients);

  const isUserLoading = useAppSelector(getUserLoading);
  const isOrderLoading = useAppSelector(getOrderLoading);
  const isIngredientsLoading: boolean = useAppSelector(getIngredientsLoading);
  const isLoading = isIngredientsLoading || isOrderLoading || isUserLoading;

  const errorMessage: string | null = useAppSelector(getIngredientsError);
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
    const state: IngredientLocationState = { isModal: true };
    void navigate(`/ingredients/${ingredient._id}`, { state });
  };

  const onCloseOrderModal = (): void => {
    setIsOrderModalOpen(false);
  };

  return {
    ingredients,
    isLoading,
    errorMessage,
    isIngredientPage: ingredientMatch !== null && !isModal,
    onIngredientClick,
    orderNumber: isOrderModalOpen ? placedOrderNumber : null,
    onCloseOrderModal,
  };
};
