import { nanoid } from '@reduxjs/toolkit';

import { useAppDispatch, useAppSelector } from '@hooks/redux.ts';
import { placeOrder } from '@services/order/actions.ts';
import {
  addSelectedIngredient,
  clearSelectedIngredients,
  getSelectedIngredients,
  getTotalPrice,
  moveSelectedIngredient,
  removeSelectedIngredient,
} from '@services/selected-ingredients/reducer.ts';

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
  const dispatch = useAppDispatch();
  const order = useAppSelector(getSelectedIngredients);
  const totalPrice = useAppSelector(getTotalPrice);

  const onIngredientDrop = (ingredient: Ingredient): void => {
    dispatch(addSelectedIngredient({ ...ingredient, id: nanoid() }));
  };

  const onIngredientMove = (dragIndex: number, hoverIndex: number): void => {
    dispatch(moveSelectedIngredient({ dragIndex, hoverIndex }));
  };

  const onOrderClick = (): void => {
    void dispatch(placeOrder())
      .unwrap()
      .then(() => {
        dispatch(clearSelectedIngredients());
      })
      .catch((error) => {
        console.log(error);
      });
  };

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
