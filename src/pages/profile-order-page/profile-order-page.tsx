import s from './profile-order-page.module.css';

export const ProfileOrderPage = () => {
  return (
    <section className={`${s.orders_container} ml-15`}>
      <p className="text text_type_main-medium">Страница находится в разработке</p>
      <p className="text text_type_main-default text_color_inactive mt-4">
        Скоро здесь появится история ваших заказов
      </p>
    </section>
  );
};
