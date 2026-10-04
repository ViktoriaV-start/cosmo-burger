import { Link } from 'react-router-dom';

import s from './not-found-page.module.css';

export const NotFoundPage = () => {
  return (
    <main className={s.not_found_container}>
      <div className={s.not_found_content}>
        <p className={`${s.not_found_code} text text_type_digits-large`}>404</p>
        <h1 className="text text_type_main-medium mt-8">Страница не найдена</h1>
        <p className="text text_type_main-default mt-10">
          <Link to="/" className={s.not_found_link}>
            На главную
          </Link>
        </p>
      </div>
    </main>
  );
};
