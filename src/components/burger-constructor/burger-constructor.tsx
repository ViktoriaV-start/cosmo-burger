import {
  Button,
  ConstructorElement,
  CurrencyIcon,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';
import classnames from 'classnames';

import type { TOrder } from '@utils/types';

import styles from './burger-constructor.module.css';

type TBurgerConstructorProps = {
  order: TOrder;
};

export const BurgerConstructor = ({ order }: TBurgerConstructorProps) => {
  const { bun, fillings } = order;

  const totalPrice = bun.price * 2 + fillings.reduce((sum, { price }) => sum + price, 0);

  const orderIngredients = fillings.map(({ _id, name, price, image_mobile }) => (
    <li key={`order-${_id}`} className={styles.order_ingredient}>
      <DragIcon type="primary" />
      <ConstructorElement price={price} text={name} thumbnail={image_mobile} />
    </li>
  ));

  return (
    <section className={classnames(styles.burger_constructor, 'mt-25', 'pl-10')}>
      <ul className={styles.order_list}>
        <li
          className={classnames(
            styles.order_ingredient,
            styles.ingredient_locked,
            'ml-8'
          )}
        >
          <ConstructorElement
            isLocked
            price={bun.price}
            text={`${bun.name} (верх)`}
            thumbnail={bun.image_mobile}
            type="top"
          />
        </li>

        <li className={styles.scroll_item}>
          <div className={classnames(styles.scroll_area, 'custom-scroll')}>
            <ul className={styles.fillings_list}>{orderIngredients}</ul>
          </div>
        </li>

        <li
          className={classnames(
            styles.order_ingredient,
            styles.ingredient_locked,
            'ml-8'
          )}
        >
          <ConstructorElement
            isLocked
            price={bun.price}
            text={`${bun.name} (низ)`}
            thumbnail={bun.image_mobile}
            type="bottom"
          />
        </li>
      </ul>

      <div className={classnames(styles.order_total, 'mt-10', 'mb-10')}>
        <p className="text text_type_digits-medium mr-2">{totalPrice}</p>
        <CurrencyIcon className={classnames(styles.currency, 'mr-10')} type="primary" />
        <Button size="medium" type="primary" htmlType={'button'}>
          Оформить заказ
        </Button>
      </div>
    </section>
  );
};
