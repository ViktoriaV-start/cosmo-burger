import { Preloader } from '@krgaa/react-developer-burger-ui-components';

import { IngredientDetails } from '@components/ingredient-details';
import { Modal } from '@components/modal';

import { useIngredientPage } from './use-ingredient-page';

import s from './ingredient-page.module.css';

export const IngredientPage = () => {
  const { ingredient, isLoaded, isModal, onCloseModal } = useIngredientPage();

  if (isModal) {
    return ingredient ? (
      <Modal header="Детали ингредиента" onClose={onCloseModal}>
        <IngredientDetails ingredient={ingredient} />
      </Modal>
    ) : null;
  }

  return (
    <main className={s.ingredient_container}>
      <h1 className="text text_type_main-large">Детали ингредиента</h1>
      {!isLoaded && <Preloader />}
      {isLoaded && !ingredient && (
        <p className="text text_type_main-default text_color_inactive mt-8">
          Ингредиент не найден
        </p>
      )}
      {ingredient && (
        <div className="mt-8">
          <IngredientDetails ingredient={ingredient} />
        </div>
      )}
    </main>
  );
};
