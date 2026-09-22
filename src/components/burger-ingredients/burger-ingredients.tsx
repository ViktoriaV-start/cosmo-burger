import { Tab } from '@krgaa/react-developer-burger-ui-components';
import classnames from 'classnames';
import { useMemo } from 'react';

import { BurgerIngredientCard } from '@components/burger-ingredients/burger-ingredient-card.tsx';
import { useBurgerIngredients } from '@components/burger-ingredients/use-burger-ingredients.ts';

import type { Ingredient } from '@utils';

import styles from './burger-ingredients.module.css';

type BurgerIngredientsProps = {
  ingredients: Ingredient[];
  onIngredientClick: (ingredient: Ingredient) => void;
};

export const BurgerIngredients = ({
  ingredients,
  onIngredientClick,
}: BurgerIngredientsProps) => {
  const {
    activeTab,
    containerRef,
    bunsTitleRef,
    saucesTitleRef,
    mainsTitleRef,
    handleScroll,
  } = useBurgerIngredients();

  const createPackElement = (ingredients: Ingredient[]) =>
    ingredients.map((ingredient) => (
      <BurgerIngredientCard
        key={ingredient._id}
        ingredient={ingredient}
        onClick={onIngredientClick}
      />
    ));

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
            active={activeTab === 'bun'}
            onClick={() => {
              /* TODO */
            }}
          >
            Булки
          </Tab>
          <Tab
            value="main"
            active={activeTab === 'main'}
            onClick={() => {
              /* TODO */
            }}
          >
            Начинки
          </Tab>
          <Tab
            value="sauce"
            active={activeTab === 'sauce'}
            onClick={() => {
              /* TODO */
            }}
          >
            Соусы
          </Tab>
        </ul>
      </nav>
      <article
        ref={containerRef}
        className={classnames(styles.ingredients_scroll, 'custom-scroll')}
        onScroll={handleScroll}
      >
        <div className="mb-10">
          <h2 ref={bunsTitleRef} className="text text_type_main-medium">
            Булки
          </h2>
          <ul className={classnames(styles.ingredients_pack, 'ml-4 mr-4 pt-6')}>
            {bunsIngredients}
          </ul>
        </div>

        <div className="mb-10">
          <h2 ref={saucesTitleRef} className="text text_type_main-medium">
            Соусы
          </h2>
          <ul className={classnames(styles.ingredients_pack, 'ml-4 pt-6')}>
            {saucesIngredients}
          </ul>
        </div>

        <div className="mb-10">
          <h2 ref={mainsTitleRef} className="text text_type_main-medium">
            Начинки
          </h2>
          <ul className={classnames(styles.ingredients_pack, 'ml-4 pt-6')}>
            {mainsIngredients}
          </ul>
        </div>
      </article>
    </section>
  );
};
