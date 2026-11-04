import { formatOrderNumber } from '@utils';

import { Modal } from '@components/modal';
import { OrderInfo } from '@components/order-info';

import { useFeedOrderPage } from './use-feed-order-page';

import s from './feed-order-page.module.css';

export const FeedOrderPage = () => {
  const { order, isModal, onCloseModal } = useFeedOrderPage();

  if (isModal) {
    return order ? (
      <Modal
        header={`#${formatOrderNumber(order.number)}`}
        headerClassName="text text_type_digits-default"
        onClose={onCloseModal}
      >
        <div className="mb-10">
          <OrderInfo order={order} />
        </div>
      </Modal>
    ) : null;
  }

  return (
    <main className={s.order_container}>
      {order ? (
        <>
          <p className="text text_type_digits-default mb-10">
            #{formatOrderNumber(order.number)}
          </p>
          <OrderInfo order={order} />
        </>
      ) : (
        <p className="text text_type_main-default text_color_inactive">
          Заказ не найден
        </p>
      )}
    </main>
  );
};
