import { CheckMarkIcon } from '@krgaa/react-developer-burger-ui-components';

import styles from './order-details.module.css';

type OrderDetailsProps = {
  orderNumber: number;
};

export const OrderDetails = ({ orderNumber }: OrderDetailsProps) => {
  return (
    <div className={styles.order_details}>
      <p className={`${styles.order_number} text text_type_digits-large mt-4`}>
        {orderNumber}
      </p>
      <p className="text text_type_main-medium mt-8">идентификатор заказа</p>
      <div className={`${styles.check_icon} mt-15 mb-15`}>
        <CheckMarkIcon type="primary" />
      </div>
      <p className="text text_type_main-default mb-2">Ваш заказ начали готовить</p>
      <p className="text text_type_main-default text_color_inactive mb-30">
        Дождитесь готовности на орбитальной станции
      </p>
    </div>
  );
};
