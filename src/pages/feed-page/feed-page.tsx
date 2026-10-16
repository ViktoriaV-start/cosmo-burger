import s from './feed-page.module.css';

export const FeedPage = () => {
  return (
    <main className={s.feed_container}>
      <h1 className="text text_type_main-large">Лента заказов</h1>
      <div className={s.feed_content}>
        <p className="text text_type_main-medium">Страница находится в разработке</p>
        <p className="text text_type_main-default text_color_inactive mt-4">
          Скоро здесь появится лента заказов
        </p>
      </div>
    </main>
  );
};
