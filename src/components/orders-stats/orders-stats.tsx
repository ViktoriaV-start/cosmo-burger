import { formatOrderNumber } from '@utils';

import s from './orders-stats.module.css';

type OrdersStatsProps = {
  ready: number[];
  inProgress: number[];
  total: number;
  totalToday: number;
};

const formatCount = (count: number): string => count.toLocaleString('ru-RU');

export const OrdersStats = ({
  ready,
  inProgress,
  total,
  totalToday,
}: OrdersStatsProps) => {
  return (
    <section className={s.stats}>
      <div className={s.statuses}>
        <div className={s.status_column}>
          <h2 className="text text_type_main-medium mb-6">Готовы:</h2>
          <ul className={s.numbers}>
            {ready.map((orderNumber) => (
              <li
                key={orderNumber}
                className="text text_type_digits-default text_color_success"
              >
                {formatOrderNumber(orderNumber)}
              </li>
            ))}
          </ul>
        </div>
        <div className={s.status_column}>
          <h2 className="text text_type_main-medium mb-6">В работе:</h2>
          <ul className={s.numbers}>
            {inProgress.map((orderNumber) => (
              <li key={orderNumber} className="text text_type_digits-default">
                {formatOrderNumber(orderNumber)}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-15">
        <h2 className="text text_type_main-medium">Выполнено за все время:</h2>
        <p className={`${s.counter} text text_type_digits-large`}>
          {formatCount(total)}
        </p>
      </div>
      <div className="mt-15">
        <h2 className="text text_type_main-medium">Выполнено за сегодня:</h2>
        <p className={`${s.counter} text text_type_digits-large`}>
          {formatCount(totalToday)}
        </p>
      </div>
    </section>
  );
};
