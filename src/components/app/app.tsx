import { Preloader } from '@krgaa/react-developer-burger-ui-components';

import { AppHeader } from '@components/app-header/app-header';
import { useApp } from '@components/app/useApp.ts';
import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';
import { IngredientDetails } from '@components/ingredient-details/ingredient-details';
import { Modal } from '@components/modal/modal';
import { OrderDetails } from '@components/order-details/order-details';

import styles from './app.module.css';

export const App = () => {
  const {
    ingredients,
    isLoading,
    errorMessage,
    order,
    selectedIngredient,
    onIngredientClick,
    onCloseIngredientModal,
    orderNumber,
    onOrderClick,
    onCloseOrderModal,
  } = useApp();

  return (
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
          <BurgerConstructor order={order} onOrderClick={onOrderClick} />
        </main>
      )}

      {selectedIngredient && (
        <Modal header="Детали ингредиента" onClose={onCloseIngredientModal}>
          <IngredientDetails ingredient={selectedIngredient} />
        </Modal>
      )}

      {orderNumber !== null && (
        <Modal onClose={onCloseOrderModal}>
          <OrderDetails orderNumber={orderNumber} />
        </Modal>
      )}
    </div>
  );
};

export default App;
