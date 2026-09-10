import classnames from 'classnames';

import type { Ingredient } from '@utils/types';

import styles from './ingredient-details.module.css';

type IngredientDetailsProps = {
  ingredient: Ingredient;
};

export const IngredientDetails = ({ ingredient }: IngredientDetailsProps) => {
  const { name, image_large, calories, proteins, fat, carbohydrates } = ingredient;

  return (
    <div className={classnames(styles.ingredient_details, 'mb-15')}>
      <img className={styles.details_image} src={image_large} alt={name} />
      <p className="text text_type_main-medium mt-4 mb-8">{name}</p>
      <ul className={styles.details_nutrients}>
        <li className={styles.details_nutrient}>
          <p className="text text_type_main-default text_color_inactive">Калории,ккал</p>
          <p className="text text_type_digits-default text_color_inactive">{calories}</p>
        </li>
        <li className={styles.details_nutrient}>
          <p className="text text_type_main-default text_color_inactive">Белки, г</p>
          <p className="text text_type_digits-default text_color_inactive">{proteins}</p>
        </li>
        <li className={styles.details_nutrient}>
          <p className="text text_type_main-default text_color_inactive">Жиры, г</p>
          <p className="text text_type_digits-default text_color_inactive">{fat}</p>
        </li>
        <li className={styles.details_nutrient}>
          <p className="text text_type_main-default text_color_inactive">Углеводы, г</p>
          <p className="text text_type_digits-default text_color_inactive">
            {carbohydrates}
          </p>
        </li>
      </ul>
    </div>
  );
};
