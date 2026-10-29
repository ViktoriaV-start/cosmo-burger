import {
  CurrencyIcon,
  FormattedDate,
} from '@krgaa/react-developer-burger-ui-components';
import { formatOrderNumber } from '@utils';

import type { FeedOrder } from '@utils';

import s from './order-card.module.css';

// Сколько иконок ингредиентов помещается в карточку; на последней — «+N»
const MAX_VISIBLE_INGREDIENTS = 6;

type OrderCardProps = {
  order: FeedOrder;
};

export const OrderCard = ({ order }: OrderCardProps) => {
  const { number, name, createdAt, ingredients, price } = order;

  const visibleIngredients = ingredients.slice(0, MAX_VISIBLE_INGREDIENTS);
  const hiddenCount = ingredients.length - MAX_VISIBLE_INGREDIENTS + 1;

  return (
    <article className={`${s.order_card} p-6`}>
      <div className={s.order_header}>
        <p className="text text_type_digits-default">#{formatOrderNumber(number)}</p>
        <FormattedDate
          date={new Date(createdAt)}
          className="text text_type_main-default text_color_inactive"
        />
      </div>
      <h2 className="text text_type_main-medium mt-6">{name}</h2>
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
