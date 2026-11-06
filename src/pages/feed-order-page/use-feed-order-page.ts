import { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '@hooks/redux.ts';
import { fetchIngredients } from '@services/ingredients/actions.ts';
import { getIngredients, getIngredientsLoading } from '@services/ingredients/reducer.ts';
import { useGetOrdersQuery, useLazyGetOrderByIdQuery } from '@services/socket/api.ts';

import type { IngredientLocationState } from '@/pages/ingredient-page/use-ingredient-page';
import type { Order } from '@services/socket/types.ts';

type UseFeedOrderPageReturn = {
  order: Order | null;
  isModal: boolean;
  onCloseModal: () => void;
  isLoading: boolean;
};

export const useFeedOrderPage = (): UseFeedOrderPageReturn => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const ingredients = useAppSelector(getIngredients);
  const isIngredientsLoading = useAppSelector(getIngredientsLoading);

  const { data } = useGetOrdersQuery();

  const isOrdersLoaded = data?.success === true;

  const orders = data?.orders ?? [];
  const socketOrder = orders.find((item) => item._id === id) ?? null;

  const [getOrderById, { data: orderResponse, isFetching: isOrderFetching }] =
    useLazyGetOrderByIdQuery();

  useEffect(() => {
    if (!isOrdersLoaded || socketOrder || !id) {
      return;
    }

    void getOrderById(id);
  }, [id, isOrdersLoaded, socketOrder, getOrderById]);

  useEffect(() => {
    if (ingredients.length || isIngredientsLoading) {
      return;
    }

    const promise = dispatch(fetchIngredients());

    return (): void => {
      promise.abort();
    };
  }, [dispatch, ingredients.length, isIngredientsLoading]);

  const restOrder = orderResponse?.order ?? null;

  const order = socketOrder ?? (restOrder?._id === id ? restOrder : null);

  const isModal = Boolean((location.state as IngredientLocationState)?.isModal);

  const onCloseModal = (): void => {
    void navigate('/feed');
  };

  return {
    order,
    isModal,
    onCloseModal,
    isLoading: !isOrdersLoaded || isOrderFetching,
  };
};
