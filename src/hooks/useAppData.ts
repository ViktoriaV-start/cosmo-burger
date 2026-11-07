import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '@hooks/redux.ts';
import { fetchIngredients } from '@services/ingredients/actions.ts';
import { getIngredients, getIngredientsLoading } from '@services/ingredients/reducer.ts';

import type { IngredientLocationState } from '@pages/ingredient-page/use-ingredient-page.ts';

export const useAppData = () => {
  const location = useLocation();
  // const orderMatch = useMatch('/feed/:id');
  const isModal = Boolean((location.state as IngredientLocationState)?.isModal);
  const dispatch = useAppDispatch();
  const ingredients = useAppSelector(getIngredients);
  const isIngredientsLoading: boolean = useAppSelector(getIngredientsLoading);

  useEffect(() => {
    if (ingredients.length) {
      return;
    }

    const promise = dispatch(fetchIngredients());

    return (): void => {
      promise.abort();
    };
  }, [dispatch, ingredients.length]);

  return {
    isModal,
    ingredients,
    isIngredientsLoading,
  };
};
