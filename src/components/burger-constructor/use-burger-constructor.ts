import { nanoid } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';

import { placeOrder } from '@services/order/actions.ts';
import { addSelectedIngredient } from '@services/selected-ingredients/reducer.ts';
import { getSelectedIngredients } from '@services/selected-ingredients/selectors.ts';

import type { AppDispatch } from '@services/store.ts';
import type { Ingredient, Order } from '@utils/types.ts';

type UseBurgerConstructor = {
  order: Order;
  onOrderClick: () => void;
  onIngredientDrop: (ingredient: Ingredient) => void;
};

export const useBurgerConstructor = (): UseBurgerConstructor => {
  const dispatch = useDispatch<AppDispatch>();
  const order = useSelector(getSelectedIngredients);

  const onIngredientDrop = (ingredient: Ingredient): void => {
    dispatch(addSelectedIngredient({ ...ingredient, id: nanoid() }));
  };

  const onOrderClick = (): void => {
    void dispatch(placeOrder());
  };

  return {
    order,
    onIngredientDrop,
    onOrderClick,
  };
};
