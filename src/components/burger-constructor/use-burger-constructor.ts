import { nanoid } from '@reduxjs/toolkit';
import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { placeOrder } from '@services/order/actions.ts';
import {
  addSelectedIngredient,
  moveSelectedIngredient,
  removeSelectedIngredient,
} from '@services/selected-ingredients/reducer.ts';
import { getSelectedIngredients } from '@services/selected-ingredients/selectors.ts';

import type { AppDispatch } from '@services/store.ts';
import type { Ingredient, Order } from '@utils';

type UseBurgerConstructor = {
  order: Order;
  totalPrice: number;
  onOrderClick: () => void;
  onIngredientDrop: (ingredient: Ingredient) => void;
  onIngredientMove: (dragIndex: number, hoverIndex: number) => void;
  onDeleteClick: (ingredientId: string) => void;
};

export const useBurgerConstructor = (): UseBurgerConstructor => {
  const dispatch = useDispatch<AppDispatch>();
  const order = useSelector(getSelectedIngredients);

  const onIngredientDrop = (ingredient: Ingredient): void => {
    dispatch(addSelectedIngredient({ ...ingredient, id: nanoid() }));
  };

  const onIngredientMove = (dragIndex: number, hoverIndex: number): void => {
    dispatch(moveSelectedIngredient({ dragIndex, hoverIndex }));
  };

  const onOrderClick = (): void => {
    void dispatch(placeOrder());
  };

  const totalPrice = useMemo(
    () =>
      (order.bun?.price ?? 0) * 2 +
      order.ingredients.reduce((sum, { price }) => sum + price, 0),
    [order]
  );

  const onDeleteClick = (ingredientId: string) => {
    dispatch(removeSelectedIngredient(ingredientId));
  };

  return {
    order,
    totalPrice,
    onIngredientDrop,
    onIngredientMove,
    onOrderClick,
    onDeleteClick,
  };
};
