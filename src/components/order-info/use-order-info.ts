import type { FeedOrder, FeedOrderIngredient, FeedOrderStatus } from '@utils';

const STATUS_TEXT: Record<FeedOrderStatus, string> = {
  created: 'Создан',
  pending: 'Готовится',
  done: 'Выполнен',
};

export type OrderInfoIngredient = FeedOrderIngredient & {
  count: number;
};

type UseOrderInfoReturn = {
  statusText: string;
  isDone: boolean;
  ingredients: OrderInfoIngredient[];
};

export const useOrderInfo = (order: FeedOrder): UseOrderInfoReturn => {
  // Одинаковые ингредиенты (например, две булки) показываем одной строкой «N x цена»
  const groups = new Map<string, OrderInfoIngredient>();

  order.ingredients.forEach((ingredient) => {
    const group = groups.get(ingredient.name);

    if (group) {
      group.count += 1;
    } else {
      groups.set(ingredient.name, { ...ingredient, count: 1 });
    }
  });

  return {
    statusText: STATUS_TEXT[order.status],
    isDone: order.status === 'done',
    ingredients: [...groups.values()],
  };
};
