import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { AppHeader } from '@components/app-header';
import { useApp } from '@components/app/useApp.ts';
import { BurgerConstructor } from '@components/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients';
import { IngredientDetails } from '@components/ingredient-details';
import { Modal } from '@components/modal';
import { OrderDetails } from '@components/order-details';

import styles from './app.module.css';

export const App = () => {
  const {
    ingredients,
    isLoading,
    errorMessage,
    ingredientModal,
    onIngredientClick,
    onCloseIngredientModal,
    orderNumber,
    onCloseOrderModal,
  } = useApp();

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={styles.app}>
        <AppHeader />
        <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
          Соберите бургер
        </h1>
        {isLoading && <Preloader />}
        {errorMessage && !isLoading && (
          <p className="text text_type_main-default pl-5 pr-5">{errorMessage}</p>
        )}

        {!isLoading && !errorMessage && (
          <main className={`${styles.main} pl-5 pr-5`}>
            <BurgerIngredients
              ingredients={ingredients}
              onIngredientClick={onIngredientClick}
            />
            <BurgerConstructor />
          </main>
        )}

        {ingredientModal && (
          <Modal header="Детали ингредиента" onClose={onCloseIngredientModal}>
            <IngredientDetails ingredient={ingredientModal} />
          </Modal>
        )}

        {orderNumber !== null && (
          <Modal onClose={onCloseOrderModal}>
            <OrderDetails orderNumber={orderNumber} />
          </Modal>
        )}
      </div>
    </DndProvider>
  );
};

export default App;
