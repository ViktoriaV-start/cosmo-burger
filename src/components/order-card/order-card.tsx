import {
  CurrencyIcon,
  FormattedDate,
} from '@krgaa/react-developer-burger-ui-components';
import { formatOrderNumber } from '@utils';

import { useAppSelector } from '@hooks/redux.ts';
import { getIngredients } from '@services/ingredients/reducer.ts';

import type { Order } from '@services/socket/types';

import s from './order-card.module.css';

// Сколько иконок ингредиентов помещается в карточку; на последней — «+N»
const MAX_VISIBLE_INGREDIENTS = 6;

type OrderCardProps = {
  order: Order;
};

export const OrderCard = ({ order }: OrderCardProps) => {
  const { number, createdAt, ingredients: ingredientIds } = order;
  const ingredients = useAppSelector(getIngredients);

  const orderIngredients = ingredientIds
    .map((id) => ingredients.find((item) => item._id === id))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  const price = orderIngredients.reduce((sum, ingredient) => sum + ingredient.price, 0);

  const visibleIngredients = orderIngredients.slice(0, MAX_VISIBLE_INGREDIENTS);
  const hiddenCount = orderIngredients.length - MAX_VISIBLE_INGREDIENTS + 1;

  return (
    <article className={`${s.order_card} p-6`}>
      <div className={s.order_header}>
        <p className="text text_type_digits-default">#{formatOrderNumber(number)}</p>
        <FormattedDate
          date={new Date(createdAt)}
          className="text text_type_main-default text_color_inactive"
        />
      </div>
      <div className={`${s.order_footer} mt-6`}>
        <ul className={s.ingredients}>
          {visibleIngredients.map((ingredient, index) => {
            const isLastWithHidden =
              index === MAX_VISIBLE_INGREDIENTS - 1 && hiddenCount > 1;

            return (
              <li
                key={index}
                className={s.ingredient}
                style={{ zIndex: MAX_VISIBLE_INGREDIENTS - index }}
              >
                <img
                  className={s.ingredient_image}
                  src={ingredient.image_mobile}
                  alt={ingredient.name}
                />
                {isLastWithHidden && (
                  <span className={`${s.ingredient_more} text text_type_main-default`}>
                    +{hiddenCount}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
        <div className={`${s.price} ml-6`}>
          <span className="text text_type_digits-default">{price}</span>
          <CurrencyIcon type="primary" />
        </div>
      </div>
    </article>
  );
};
