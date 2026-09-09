import { Counter, CurrencyIcon, Tab } from '@krgaa/react-developer-burger-ui-components';
import classnames from 'classnames';
import { useMemo } from 'react';

import type { TIngredient } from '@utils/types';

import styles from './burger-ingredients.module.css';

type TBurgerIngredientsProps = {
  ingredients: TIngredient[];
};

export const BurgerIngredients = ({ ingredients }: TBurgerIngredientsProps) => {
  const createPackElement = (ingredients: TIngredient[]) => {
    const packElement = ingredients.map(({ _id, name, image_large, price }) => (
      <li key={_id} className={styles.burger_ingredient}>
        <img
          className={classnames(styles.ingredient_image, 'pl-4 pr-4')}
          src={image_large}
          alt={name}
        />
        <p
          className={`${styles.ingredient_price} text text_type_digits-default mt-1 mb-1`}
        >
          {price}
          <CurrencyIcon type="primary" />
        </p>
        <p className="text text_type_main-default mt-2">{name}</p>
        <Counter count={1} size="default" extraClass={styles.ingredient_counter} />
      </li>
    ));

    return packElement;
  };

  const { buns, sauces, mains } = useMemo(
    () => ({
      buns: ingredients.filter(({ type }) => type === 'bun'),
      sauces: ingredients.filter(({ type }) => type === 'sauce'),
      mains: ingredients.filter(({ type }) => type === 'main'),
    }),
    [ingredients]
  );

  const bunsIngredients = useMemo(() => createPackElement(buns), [buns]);
  const saucesIngredients = useMemo(() => createPackElement(sauces), [sauces]);
  const mainsIngredients = useMemo(() => createPackElement(mains), [mains]);

  return (
    <section className={styles.burger_ingredients}>
      <nav className={classnames(styles.menu_wrap, 'mb-10')}>
        <ul className={styles.menu}>
          <Tab
            value="bun"
            active={true}
            onClick={() => {
              /* TODO */
            }}
          >
            Булки
          </Tab>
          <Tab
            value="main"
            active={false}
            onClick={() => {
              /* TODO */
            }}
          >
            Начинки
          </Tab>
          <Tab
            value="sauce"
            active={false}
            onClick={() => {
              /* TODO */
            }}
          >
            Соусы
          </Tab>
        </ul>
      </nav>
      <article className={classnames(styles.ingredients_scroll, 'custom-scroll')}>
        <div className="mb-10">
          <h2 className="text text_type_main-medium">Булки</h2>
          <ul className={classnames(styles.ingredients_pack, 'ml-4 mr-4 pt-6')}>
            {bunsIngredients}
          </ul>
        </div>

        <div className="mb-10">
          <h2 className="text text_type_main-medium">Соусы</h2>
          <ul className={classnames(styles.ingredients_pack, 'ml-4 pt-6')}>
            {saucesIngredients}
          </ul>
        </div>

        <div className="mb-10">
          <h2 className="text text_type_main-medium">Начинки</h2>
          <ul className={classnames(styles.ingredients_pack, 'ml-4 pt-6')}>
            {mainsIngredients}
          </ul>
        </div>
      </article>
    </section>
  );
};
