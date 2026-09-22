import { Counter, CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';
import { INGREDIENT_DRAG_TYPE } from '@utils';
import classnames from 'classnames';
import { useDrag } from 'react-dnd';

import type { Ingredient } from '@utils';

import styles from './burger-ingredients.module.css';

type BurgerIngredientCardProps = {
  ingredient: Ingredient;
  onClick: (ingredient: Ingredient) => void;
};

export const BurgerIngredientCard = ({
  ingredient,
  onClick,
}: BurgerIngredientCardProps) => {
  const { name, image_large, price } = ingredient;

  const [, dragRef] = useDrag<Ingredient>({
    type: INGREDIENT_DRAG_TYPE,
    item: ingredient,
  });

  return (
    <li
      ref={(node) => {
        dragRef(node);
      }}
      className={styles.burger_ingredient}
      onClick={() => onClick(ingredient)}
    >
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
  );
};
