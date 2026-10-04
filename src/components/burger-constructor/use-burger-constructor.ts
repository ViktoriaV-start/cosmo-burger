import { nanoid } from '@reduxjs/toolkit';
import { ErrorType, type Ingredient, type Order } from '@utils';
import { useLocation, useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '@hooks/redux.ts';
import { placeOrder } from '@services/order/actions.ts';
import { getOrderLoading } from '@services/order/reducer.ts';
import {
  addSelectedIngredient,
  clearSelectedIngredients,
  getSelectedIngredients,
  getTotalPrice,
  moveSelectedIngredient,
  removeSelectedIngredient,
} from '@services/selected-ingredients/reducer.ts';
import { getIsAuthorized, getUserLoading } from '@services/user/reducer.ts';

type UseBurgerConstructor = {
  order: Order;
  totalPrice: number;
  isLoading: boolean;
  onOrderClick: () => void;
  onIngredientDrop: (ingredient: Ingredient) => void;
  onIngredientMove: (dragIndex: number, hoverIndex: number) => void;
  onDeleteClick: (ingredientId: string) => void;
};

export const useBurgerConstructor = (): UseBurgerConstructor => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const order = useAppSelector(getSelectedIngredients);
  const totalPrice = useAppSelector(getTotalPrice);
  const isAuthorized = useAppSelector(getIsAuthorized);
  const isUserLoading = useAppSelector(getUserLoading);
  const isOrderLoading = useAppSelector(getOrderLoading);

  const isLoading = isUserLoading || isOrderLoading;

  const redirectToLogin = (): void => {
    void navigate('/login', { state: { from: location } });
  };

  const onIngredientDrop = (ingredient: Ingredient): void => {
    dispatch(addSelectedIngredient({ ...ingredient, id: nanoid() }));
  };

  const onIngredientMove = (dragIndex: number, hoverIndex: number): void => {
    dispatch(moveSelectedIngredient({ dragIndex, hoverIndex }));
  };

  const onOrderClick = (): void => {
    if (!isAuthorized) {
      redirectToLogin();
      return;
    }

    void dispatch(placeOrder())
      .unwrap()
      .then(() => {
        dispatch(clearSelectedIngredients());
      })
      .catch((error) => {
        if (error === ErrorType.AccessToken) {
          redirectToLogin();
          return;
        }
        console.error('placeOrder failed:', error);
      });
  };

  const onDeleteClick = (ingredientId: string) => {
    dispatch(removeSelectedIngredient(ingredientId));
  };

  return {
    order,
    totalPrice,
    isLoading,
    onIngredientDrop,
    onIngredientMove,
    onOrderClick,
    onDeleteClick,
  };
};
