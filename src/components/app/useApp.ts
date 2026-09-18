import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  fetchIngredients,
  selectIngredients,
  selectIngredientsError,
  selectIngredientsLoading,
} from '@services/ingredients/actions.ts';
import { placeOrder } from '@services/order/actions.ts';
import { getOrderNumber } from '@services/order/selectors.ts';
import {
  clearSelectedIngredient,
  setSelectedIngredient,
} from '@services/selected-ingredient/reducer.ts';
import { getSelectedIngredient } from '@services/selected-ingredient/selectors.ts';

import type { AppDispatch } from '@services/store.ts';
import type { Ingredient, Order } from '@utils/types.ts';

type UseAppReturn = {
  ingredients: Ingredient[];
  isLoading: boolean;
  errorMessage: string | null;
  order: Order | null;
  selectedIngredient: Ingredient | null;
  onIngredientClick: (ingredient: Ingredient) => void;
  onCloseIngredientModal: () => void;
  orderNumber: number | null;
  onOrderClick: () => void;
  onCloseOrderModal: () => void;
};

const findIngredient = (list: Ingredient[], id: string): Ingredient | null => {
  const ingredient = list.find(({ _id }) => _id === id);

  if (!ingredient) {
    return null;
  }

  return ingredient;
};

export const useApp = (): UseAppReturn => {
  const dispatch = useDispatch<AppDispatch>();
  const ingredients: Ingredient[] = useSelector(selectIngredients);
  const isLoading: boolean = useSelector(selectIngredientsLoading);
  const errorMessage: string | null = useSelector(selectIngredientsError);
  const selectedIngredient = useSelector(getSelectedIngredient);
  const placedOrderNumber = useSelector(getOrderNumber);

  const [order, setOrder] = useState<Order | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const createOrder = (list: Ingredient[]): Order | null => {
    if (list.length === 0) {
      return null;
    }

    const bun = findIngredient(list, '692889f16bf770001bfeb4cc');

    if (!bun) {
      return null;
    }

    const fillings = [
      findIngredient(list, '692889f16bf770001bfeb4d6'),
      findIngredient(list, '692889f16bf770001bfeb4d7'),
      findIngredient(list, '692889f16bf770001bfeb4d8'),
      findIngredient(list, '692889f16bf770001bfeb4d9'),
      findIngredient(list, '692889f16bf770001bfeb4da'),
    ].filter((ingredient): ingredient is Ingredient => ingredient !== null);

    return { bun, fillings };
  };

  useEffect(() => {
    const promise = dispatch(fetchIngredients());

    return (): void => {
      promise.abort();
    };
  }, [dispatch]);

  useEffect(() => {
    setOrder(createOrder(ingredients));
  }, [ingredients]);

  useEffect(() => {
    if (placedOrderNumber !== null) {
      setIsOrderModalOpen(true);
    }
  }, [placedOrderNumber]);

  const onIngredientClick = (ingredient: Ingredient): void => {
    dispatch(setSelectedIngredient(ingredient));
  };

  const onCloseIngredientModal = (): void => {
    dispatch(clearSelectedIngredient());
  };

  const onOrderClick = (): void => {
    void dispatch(placeOrder());
  };

  const onCloseOrderModal = (): void => {
    setIsOrderModalOpen(false);
  };

  return {
    ingredients,
    isLoading,
    errorMessage,
    order,
    selectedIngredient,
    onIngredientClick,
    onCloseIngredientModal,
    orderNumber: isOrderModalOpen ? placedOrderNumber : null,
    onOrderClick,
    onCloseOrderModal,
  };
};
