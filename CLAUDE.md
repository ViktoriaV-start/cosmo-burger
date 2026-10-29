# Stellar Burger (cosmo-burger)

Учебный проект по спринтам: космическая бургерная. React 19 + TypeScript (strict) + Vite 7 + Redux Toolkit + react-router-dom 7 + react-dnd.
UI-кит: `@krgaa/react-developer-burger-ui-components` — использовать его, а не писать свои аналоги (подробнее в разделе «UI-библиотека»).
Бэкенд: `https://new-stellarburgers.education-services.ru` (константы в `src/utils/api/api-constants.ts`).

## Общение и работа
- Отвечать на русском, тексты в UI и сообщения об ошибках — на русском.
- Работа ведётся в ветках `sprintN` (текущая — `sprint5`), PR в `main`.
- Макеты экранов — скриншоты в `../img/*.png` (на уровень выше проекта). Смотреть только нужный, когда задача касается вёрстки.
- Не читать `node_modules` (кроме `dist/index.d.ts` UI-кита при необходимости), `dist`, `package-lock.json`, `*.module.d.css.ts` (генерируются автоматически).

## Команды
```
npm run dev        # dev-сервер (vite, http://localhost:5173)
npm run build      # сборка
npm run check      # stylelint + eslint без автофикса — быстрая проверка после правок
npm run lint       # stylelint --fix + eslint --fix + prettier --write
npm test           # vitest (jsdom); юнит-тестов пока нет
npm run e2e        # playwright (e2e/), нужен запущенный dev-сервер
npx tsc -p tsconfig.app.json --noEmit   # проверка типов
```
Pre-commit (husky + lint-staged) гоняет eslint/stylelint/prettier по staged-файлам. Коммиты — Conventional Commits (`npm run commit`).

## Структура
```
src/
├── main.tsx                 # точка входа: Provider store + App
├── index.css                # глобальные стили, подключает assets/css
├── app/
│   ├── app.tsx              # dispatch(checkUserAuth()) при старте
│   └── router/              # createBrowserRouter; routes.tsx — все маршруты
├── api/                     # слой HTTP (классы-синглтоны)
│   ├── http-transport.ts    # обёртка над fetch: таймаут 10с, AbortSignal, JSON/FormData
│   ├── http-error.ts        # HttpError(status, body), NetworkError, getHttpErrorMessage()
│   ├── auth-api.ts          # authApi: register/login/logout/refresh/getUser/updateUser,
│   │                        #   requestWithRefresh() — повтор запроса после обновления токена
│   └── ingredients-api.ts   # ingredientsApi: getIngredients, placeOrder (таймаут 30с)
├── services/                # Redux: store.ts + папка на слайс
│   ├── store.ts             # combineSlices, RootState, AppDispatch
│   ├── ingredients/         # reducer.ts + actions.ts (fetchIngredients)
│   ├── order/               # оформление заказа
│   ├── selected-ingredients/# содержимое конструктора (bun + ingredients), цена, счётчики
│   ├── ingredient-modal/    # выбранный ингредиент для модалки
│   └── user/                # авторизация, профиль, isAuthChecked
├── hooks/
│   ├── redux.ts             # useAppDispatch / useAppSelector — использовать только их
│   └── use-form-with-validation.ts
├── components/              # переиспользуемые компоненты
│   ├── app-layout/          # AppHeader + <Outlet/>
│   ├── app-header/
│   ├── burger-ingredients/  # список ингредиентов (табы, карточки, drag source)
│   ├── burger-constructor/  # конструктор (drop target, сортировка, drag layer)
│   ├── modal/, modal-overlay/
│   ├── ingredient-details/, order-details/
│   ├── profile-form/        # форма профиля (index-роут /profile)
│   ├── protected-route/     # ProtectedRoute { onlyUnAuth?, component }
│   ├── order-card/          # карточка заказа в ленте (номер, дата, иконки ингредиентов, цена)
│   ├── orders-stats/        # статистика ленты: «Готовы», «В работе», выполнено всего/сегодня
│   └── recipe/
├── pages/                   # страницы-роуты
│   ├── home-page/           # "/" + вложенный "ingredients/:id"
│   ├── ingredient-page/     # модалка (state.isModal) или отдельная страница по прямой ссылке
│   ├── login-page/, register-page/, forgot-password-page/, reset-password-page/  # onlyUnAuth
│   ├── profile-page/        # protected; дети: ProfileForm (index), orders
│   ├── profile-order-page/  # заглушка
│   ├── feed-page/           # "/feed" — лента заказов (пока на тестовых данных FEED_MOCK)
│   └── not-found-page/
├── utils/                   # реэкспорт через `@utils`
│   ├── types.ts             # Ingredient, Order, User, *Response, FeedOrder, OrdersFeed
│   ├── feed-mock.ts         # FEED_MOCK — тестовые данные ленты (не реэкспортируется из @utils)
│   ├── format-order-number.ts # 34535 → "034535"
│   ├── api/                 # api-constants.ts (URL эндпоинтов, METHODS), query-stringify
│   ├── app-constants.ts     # ключи localStorage, ErrorType
│   ├── local-storage.ts     # get/set/removeLocalStorageItem (JSON)
│   ├── tokens.ts            # isTokenExists()
│   ├── dnd-constants.ts
│   └── validators.ts
└── assets/css/              # reset.css, vars.css (CSS-переменные)
e2e/                         # playwright-тесты
```

## Соглашения по коду
**Папка компонента/страницы** (kebab-case):
```
foo-bar/
├── index.ts              # export { FooBar } from './foo-bar';
├── foo-bar.tsx           # только разметка, логика — в хуке
├── use-foo-bar.ts        # хук с логикой, явный тип возврата UseFooBarReturn
└── foo-bar.module.css    # CSS Modules, классы в snake_case
```
- Компоненты — именованные `export const Foo = () => ...` (без default export, кроме `App`).
- Импорт стилей: `import s from './foo.module.css'` (или `styles`), `className={s.foo_container}`. Утилитарные классы UI-кита (`text text_type_main-medium`, `mt-6`, `pl-5`, `text_color_inactive`) — прямо в className.
- Алиасы (источник истины — `tsconfig.app.json`, README устарел): `@/*`, `@app`, `@components`, `@hooks`, `@pages`, `@services`, `@utils`. Импорт слайсов/экшенов — с расширением: `@services/user/reducer.ts`.
- Только `type` (не `interface`); type-импорты отдельной строкой `import type {...}`.
- Порядок импортов (perfectionist): внешние → внутренние алиасы → относительные → type-импорты → стили, группы через пустую строку. Проще всего прогнать `npm run eslint` после правки.
- Prettier: одинарные кавычки, `;`, ширина 89, trailing comma es5. Отступ 2 пробела.
- Комментарии — на русском, кратко, только «почему».

**Redux:**
- Слайс: `createSlice` с полем `selectors`; селекторы экспортируются из `reducer.ts` (`getUser`, `getIsAuthorized`…). Производные данные — через `createSelector`.
- Асинхронщина — `createAsyncThunk<Return, Arg, { rejectValue: string }>` в `actions.ts`; внутри вызов `xxxApi.method(..., signal)` и `rejectWithValue(getHttpErrorMessage(error) ?? 'Текст ошибки')`.
- В `rejected` сначала `if (action.meta.aborted) return;`.
- В эффектах сохранять промис thunk и вызывать `promise.abort()` в cleanup.

**API:**
- Новый эндпоинт: URL в `api-constants.ts` → метод в классе `*Api` с type guard `isXxxResponse` → thunk.
- Запросы с авторизацией — через `authApi.requestWithRefresh(token => transport.x(url, { headers: { authorization: token } }))`.
- Токены хранятся в localStorage (`accessToken`, `refreshToken`); сервер сообщает об истёкшем токене кодом 403 + `jwt expired`.

**Роутинг:**
- Новые страницы добавлять в `src/app/router/routes.tsx` внутрь `AppLayout`. Защищённые — `<ProtectedRoute component={<Page/>} />`, только для гостей — `onlyUnAuth`.
- Модалка ингредиента: переход с `state: { isModal: true }`; без него `/ingredients/:id` рендерится как отдельная страница.

## UI-библиотека `@krgaa/react-developer-burger-ui-components`
Типы: `node_modules/@krgaa/react-developer-burger-ui-components/dist/index.d.ts` (~6 КБ, читать его, а не бандл). Документация: https://react-burger-ui-components.practicum.com.ru. Стили библиотеки подключаются автоматически при импорте.

**Компоненты:**
- `Button` — `{ type: 'primary' | 'secondary', size: 'small' | 'medium' | 'large', htmlType, onClick, extraClass }`
- `Input` — `{ type?: 'text' | 'email' | 'password', value, onChange, name, placeholder, error, errorText, icon, size?: 'default' | 'small', extraClass }`; `EmailInput` (`isIcon`, `checkValid`), `PasswordInput` (`icon?: 'HideIcon' | 'ShowIcon' | 'EditIcon'`)
- `Tab` — `{ active, value, onClick(value) }`
- `ConstructorElement` — `{ type?: 'top' | 'bottom', text, thumbnail, price, isLocked, handleClose, extraClass }`
- `Counter` — `{ count, size?: 'default' | 'small' }`
- `FormattedDate` — `{ date: Date, className }` → «Сегодня, 16:20», «Вчера, 13:50», «2 дня назад, 21:53»
- `Preloader`, `Logo`

**Иконки** (`{ type: 'primary' | 'secondary' | 'error' | 'success' | 'disabled', className }`): `BurgerIcon`, `ListIcon`, `ProfileIcon`, `CurrencyIcon`, `CheckMarkIcon`, `CloseIcon`, `DeleteIcon`, `DragIcon`, `EditIcon`, `LockIcon`, `LogoutIcon`, `ArrowUpIcon`, `ArrowDownIcon`, `MenuIcon`, `InfoIcon`, `ShowIcon`, `HideIcon`.

**Классы типографики** (всегда вместе с `text`):
- Шрифт текста: `text_type_main-small | -default | -medium | -large`
- Цифры (моноширинный шрифт): `text_type_digits-default | -medium | -large`
- Цвет: `text_color_primary | _inactive | _accent | _success | _error`

**Отступы:** `m|mt|mr|mb|ml|p|pt|pr|pb|pl-N`, где N — шаг 4px (`mt-6` = 24px, `mt-15` = 60px). Скроллбар в стиле макета — класс `custom-scroll`.

**Палитра макетов:** фон `#131316`, карточки `#1c1c21`, неактивный текст `#8585ad`, акцент `#4c4cff`, «готово» `#00cccc`, градиент обводки иконок `#801ab2 → #4c4cff`.

## Как экономить время и токены
- Сначала смотреть `routes.tsx` и нужную папку, а не весь `src`.
- Точечные правки через Edit, без переписывания файлов целиком.
- После изменений — `npm run check` и `npx tsc -p tsconfig.app.json --noEmit`; не запускать `dev`/`build` без необходимости.
- Не добавлять новые зависимости без согласования.

## Известные нюансы
- Хук главной страницы называется `useApp` (файл `use-home-page.ts`).
- `use-login-page.ts`: редирект после логина закомментирован — его выполняет `ProtectedRoute`.
