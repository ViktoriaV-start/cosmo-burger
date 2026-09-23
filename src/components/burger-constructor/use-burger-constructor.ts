import { nanoid } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';

import { placeOrder } from '@services/order/actions.ts';
import { getOrderNumber } from '@services/order/reducer.ts';
import {
  addSelectedIngredient,
  getSelectedIngredients,
  getTotalPrice,
  moveSelectedIngredient,
  removeSelectedIngredient,
} from '@services/selected-ingredients/reducer.ts';

import type { AppDispatch } from '@services/store.ts';
import type { Ingredient, Order } from '@utils';

type UseBurgerConstructor = {
  order: Order;
  totalPrice: number;
  isOrderPlaced: boolean;
  onOrderClick: () => void;
  onIngredientDrop: (ingredient: Ingredient) => void;
  onIngredientMove: (dragIndex: number, hoverIndex: number) => void;
  onDeleteClick: (ingredientId: string) => void;
};

export const useBurgerConstructor = (): UseBurgerConstructor => {
  const dispatch = useDispatch<AppDispatch>();
  const order = useSelector(getSelectedIngredients);
  const totalPrice = useSelector(getTotalPrice);
  const placedOrderNumber = useSelector(getOrderNumber);

  const isOrderPlaced = !!placedOrderNumber;

  const onIngredientDrop = (ingredient: Ingredient): void => {
    dispatch(addSelectedIngredient({ ...ingredient, id: nanoid() }));
  };

  const onIngredientMove = (dragIndex: number, hoverIndex: number): void => {
    dispatch(moveSelectedIngredient({ dragIndex, hoverIndex }));
  };

  const onOrderClick = (): void => {
    void dispatch(placeOrder());
  };

  const onDeleteClick = (ingredientId: string) => {
    dispatch(removeSelectedIngredient(ingredientId));
  };

  return {
    order,
    totalPrice,
    isOrderPlaced,
    onIngredientDrop,
    onIngredientMove,
    onOrderClick,
    onDeleteClick,
  };
};
