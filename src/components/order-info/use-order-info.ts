import { useAppSelector } from '@hooks/redux.ts';
import { getIngredients } from '@services/ingredients/reducer.ts';

import type { Order } from '@services/socket/types.ts';
import type { FeedOrderStatus, Ingredient } from '@utils';

const STATUS_TEXT: Record<FeedOrderStatus, string> = {
  created: 'Создан',
  pending: 'Готовится',
  done: 'Выполнен',
};

export type OrderInfoIngredient = Ingredient & {
  count: number;
};

type UseOrderInfoReturn = {
  statusText: string;
  isDone: boolean;
  ingredients: OrderInfoIngredient[];
};

export const useOrderInfo = (order: Order): UseOrderInfoReturn => {
  const allIngredients: Ingredient[] = useAppSelector(getIngredients);

  const groups = new Map<string, OrderInfoIngredient>();

  order.ingredients.forEach((ingredientId) => {
    const ingredient = allIngredients.find((item) => item._id === ingredientId);

    if (!ingredient) return;

    const group = groups.get(ingredient._id);

    if (group) {
      group.count += 1;
    } else {
      groups.set(ingredient._id, {
        ...ingredient,
        count: 1,
      });
    }
  });

  return {
    statusText: STATUS_TEXT[order.status],
    isDone: order.status === 'done',
    ingredients: [...groups.values()],
  };
};
