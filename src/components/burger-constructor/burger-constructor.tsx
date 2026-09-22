import {
  Button,
  ConstructorElement,
  CurrencyIcon,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { INGREDIENT_DRAG_TYPE } from '@utils';
import classnames from 'classnames';
import { useMemo } from 'react';
import { useDrop } from 'react-dnd';

import { useBurgerConstructor } from './use-burger-constructor';

import type { Ingredient } from '@utils';

import styles from './burger-constructor.module.css';

export const BurgerConstructor = () => {
  const { order, onIngredientDrop, onOrderClick } = useBurgerConstructor();

  const [, dropRef] = useDrop<Ingredient>({
    accept: INGREDIENT_DRAG_TYPE,
    drop: (ingredient) => onIngredientDrop(ingredient),
  });

  const totalPrice = useMemo(
    () =>
      (order.bun?.price ?? 0) * 2 +
      order.ingredients.reduce((sum, { price }) => sum + price, 0),
    [order]
  );

  const orderIngredients = useMemo(
    () =>
      order.ingredients.map(({ id, _id, name, price, image_mobile }) => (
        <li key={id ?? _id} className={styles.order_ingredient}>
          <DragIcon type="primary" />
          <ConstructorElement price={price} text={name} thumbnail={image_mobile} />
        </li>
      )),
    [order]
  );

  const { bun, ingredients } = order;

  return (
    <section
      ref={(node) => {
        dropRef(node);
      }}
      className={classnames(styles.burger_constructor, 'mt-25', 'pl-10')}
    >
      <ul className={styles.order_list}>
        <li
          className={classnames(
            styles.order_ingredient,
            styles.ingredient_locked,
            'ml-8'
          )}
        >
          {bun ? (
            <ConstructorElement
              isLocked
              price={bun.price}
              text={`${bun.name} (верх)`}
              thumbnail={bun.image_mobile}
              type="top"
            />
          ) : (
            <div
              className={classnames(styles.placeholder, 'text text_type_main-default')}
            >
              Выберите булки
            </div>
          )}
        </li>

        <li className={styles.scroll_item}>
          <div className={classnames(styles.scroll_area, 'custom-scroll')}>
            {ingredients.length > 0 ? (
              <ul className={styles.fillings_list}>{orderIngredients}</ul>
            ) : (
              <div
                className={classnames(styles.placeholder, 'text text_type_main-default')}
              >
                Выберите начинку
              </div>
            )}
          </div>
        </li>

        <li
          className={classnames(
            styles.order_ingredient,
            styles.ingredient_locked,
            'ml-8'
          )}
        >
          {bun ? (
            <ConstructorElement
              isLocked
              price={bun.price}
              text={`${bun.name} (низ)`}
              thumbnail={bun.image_mobile}
              type="bottom"
            />
          ) : (
            <div
              className={classnames(styles.placeholder, 'text text_type_main-default')}
            >
              Выберите булки
            </div>
          )}
        </li>
      </ul>

      <div className={classnames(styles.order_total, 'mt-10', 'mb-10')}>
        <p className="text text_type_digits-medium mr-2">{totalPrice}</p>
        <CurrencyIcon className={classnames(styles.currency, 'mr-10')} type="primary" />
        <Button size="medium" type="primary" htmlType={'button'} onClick={onOrderClick}>
          Оформить заказ
        </Button>
      </div>
    </section>
  );
};
