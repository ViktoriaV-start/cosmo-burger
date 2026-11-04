import {
  CurrencyIcon,
  FormattedDate,
} from '@krgaa/react-developer-burger-ui-components';
import classnames from 'classnames';

import { useOrderInfo } from './use-order-info';

import type { FeedOrder } from '@utils';

import s from './order-info.module.css';

type OrderInfoProps = {
  order: FeedOrder;
};

export const OrderInfo = ({ order }: OrderInfoProps) => {
  const { statusText, isDone, ingredients } = useOrderInfo(order);

  return (
    <div className={s.order_info}>
      <h2 className="text text_type_main-medium">{order.name}</h2>
      <p
        className={classnames('text text_type_main-default mt-3', {
          text_color_success: isDone,
        })}
      >
        {statusText}
      </p>
      <h3 className="text text_type_main-medium mt-15">Состав:</h3>
      <ul className={`${s.ingredients} custom-scroll mt-6`}>
        {ingredients.map(({ name, image_mobile, price, count }) => (
          <li key={name} className={s.ingredient}>
            <div className={s.ingredient_icon}>
              <img className={s.ingredient_image} src={image_mobile} alt={name} />
            </div>
            <p className={`${s.ingredient_name} text text_type_main-default`}>{name}</p>
            <div className={s.price}>
              <span className="text text_type_digits-default">
                {count} x {price}
              </span>
              <CurrencyIcon type="primary" />
            </div>
          </li>
        ))}
      </ul>
      <div className={`${s.footer} mt-10`}>
        <FormattedDate
          date={new Date(order.createdAt)}
          className="text text_type_main-default text_color_inactive"
        />
        <div className={s.price}>
          <span className="text text_type_digits-default">{order.price}</span>
          <CurrencyIcon type="primary" />
        </div>
      </div>
    </div>
  );
};
