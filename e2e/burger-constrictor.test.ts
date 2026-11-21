import { test, expect } from '@playwright/test';

const TEST_BUN = {
  _id: '643d69a5c3f7b9001cfa093c',
  name: 'Краторная булка N-200i',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: 'https://code.s3.yandex.net/react/code/bun-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
  __v: 0,
};

const TARGET_INGREDIENT = {
  _id: '692889f16bf770001bfeb4d7',
  name: 'Плоды Фалленианского дерева',
  type: 'main',
  proteins: 20,
  fat: 5,
  carbohydrates: 55,
  calories: 77,
  price: 874,
  image: 'https://code.s3.yandex.net/react/code/sp_1.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/sp_1-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/sp_1-large.png',
  __v: 0,
};

const ORDER_NUMBER = 12345;

test('должен писать/воспроизвести HAR-файл с ингредиентами', async ({ page }) => {
  await page.routeFromHAR('./e2e/hars/ingredients.har', {
    // реальный эндпоинт, не /src/api/ingredients-api.ts - был дубль с загрузкой модуля
    url: /\/api\/ingredients(\?|$)/,
    update: false, // режим
  });

  // waitForResponse ДО goto — иначе гонка и можно пропустить ответ
  const ingredientsResponse = page.waitForResponse(
    (r) => {
      const { pathname } = new URL(r.url());
      return pathname.endsWith('/api/ingredients') && r.ok();
    },
    { timeout: 15_000 }
  );

  await page.goto('/');
  await ingredientsResponse;

  await expect(page.getByTestId('ingredients-list')).toBeVisible();
});

test('Доступ к профилю для авторизованного юзера', async ({ page }) => {
  // 1. Мок ДО навигации
  await page.route(
    (url) => url.pathname.endsWith('/api/auth/user'),
    async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          user: { email: 'test@test.com', name: 'Test User' },
        }),
      });
    }
  );

  // 2. localStorage до загрузки приложения
  await page.addInitScript(() => {
    localStorage.setItem('accessToken', JSON.stringify('access-token'));
    localStorage.setItem('refreshToken', JSON.stringify('refresh-token'));
  });

  // 3. Навигация
  await page.goto('/profile');
  await page.waitForTimeout(2000);

  // 4. Проверка
  await expect(page.getByText('Профиль')).toBeVisible();
});

test('Путь пользователя от просмотра ингредиента до заказа', async ({ page }) => {
  // ---------- Моки API ----------

  await page.route(
    (url) => url.pathname.endsWith('/api/ingredients'),
    (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: [TEST_BUN, TARGET_INGREDIENT],
        }),
      })
  );

  await page.route(
    (url) => url.pathname.endsWith('/api/auth/login'),
    (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          user: { email: 'test@test.com', name: 'Test User' },
          accessToken: 'fake-access-token',
          refreshToken: 'fake-refresh-token',
        }),
      })
  );

  await page.route(
    (url) => url.pathname.endsWith('/api/orders'),
    (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          name: 'Тестовый бургер',
          order: { number: ORDER_NUMBER },
        }),
      })
  );

  await page.goto('/');

  // ---------- Шаг 1. Модалка с деталями ----------
  await test.step('Клик по ингредиенту открывает модальное окно с деталями', async () => {
    await expect(page.getByTestId('ingredients-list')).toBeVisible();
    await page.getByAltText(TARGET_INGREDIENT.name).click();
    await expect(page).toHaveURL(new RegExp(`/ingredients/${TARGET_INGREDIENT._id}$`));
    await expect(page.getByText('Детали ингредиента')).toBeVisible();
  });

  await test.step('Модальное окно закрывается, возвращаемся на конструктор', async () => {
    await page.getByRole('button', { name: 'Закрыть' }).click();
    await expect(page.getByText('Детали ингредиента')).toBeHidden();
    await expect(page).toHaveURL(/\/$/);
  });

  // ---------- Шаг 2. Перетаскивание начинки ----------
  await test.step('Перетаскивание начинки в конструктор', async () => {
    const source = page
      .getByTestId('ingredients-list')
      .getByRole('listitem')
      .filter({ hasText: TARGET_INGREDIENT.name });
    const target = page.getByText('Выберите начинку');

    await source.dragTo(target);

    await expect(page).toHaveURL(/\/$/);
    const constructor = page.locator('section').filter({ hasText: 'Оформить заказ' });
    await expect(constructor.getByText(TARGET_INGREDIENT.name)).toBeVisible();
  });

  // ---------- Шаг 3. Перетаскивание булки (НУЖНО для placeOrder) ----------
  await test.step('Перетаскивание булки в конструктор', async () => {
    const constructor = page.locator('section').filter({ hasText: 'Оформить заказ' });
    const bunSource = page
      .getByTestId('ingredients-list')
      .getByRole('listitem')
      .filter({ hasText: TEST_BUN.name });

    await bunSource.dragTo(constructor);

    // После drop булка отображается и сверху, и снизу (ConstructorElement)
    await expect(constructor.getByText(`${TEST_BUN.name} (верх)`)).toBeVisible();
    await expect(constructor.getByText(`${TEST_BUN.name} (низ)`)).toBeVisible();
  });

  // ---------- Шаг 4. Авторизация через UI ----------
  await test.step('Авторизация через форму входа', async () => {
    // SPA-переход (клик по ссылке в хедере, не goto!) — иначе Redux сбросится
    await page.getByRole('link', { name: /Личный кабинет/i }).click();

    // Не авторизован → ProtectedRoute редиректит на /login
    await expect(page).toHaveURL(/\/login/);

    // Поля формы. Если селекторы не сработают — пришлите login-page.tsx
    await page
      .locator('input[name="email"], input[type="email"]')
      .first()
      .fill('test@test.com');
    await page
      .locator('input[name="password"], input[type="password"]')
      .first()
      .fill('password');

    const loginResponse = page.waitForResponse(
      (r) => new URL(r.url()).pathname.endsWith('/api/auth/login') && r.ok()
    );
    await page.getByRole('button', { name: 'Войти' }).click();
    await loginResponse;

    // После успешного логина ProtectedRoute onlyUnAuth уводит с /login
    await expect(page).not.toHaveURL(/\/login/);

    // Возвращаемся на конструктор — состояние Redux (собранный бургер) сохраняется
    await page.getByRole('link', { name: 'Конструктор' }).click();
    await expect(page).toHaveURL(/\/$/);

    // Убеждаемся, что бургер всё ещё в конструкторе после навигации
    const constructor = page.locator('section').filter({ hasText: 'Оформить заказ' });
    await expect(constructor.getByText(TARGET_INGREDIENT.name)).toBeVisible();
    await expect(constructor.getByText(`${TEST_BUN.name} (верх)`)).toBeVisible();
  });

  // ---------- Шаг 5. Оформление заказа + модалка ----------
  await test.step('Оформление заказа и модалка с номером', async () => {
    const constructor = page.locator('section').filter({ hasText: 'Оформить заказ' });

    const orderResponse = page.waitForResponse(
      (r) => new URL(r.url()).pathname.endsWith('/api/orders') && r.ok()
    );
    await constructor.getByRole('button', { name: 'Оформить заказ' }).click();
    await orderResponse;

    // Модалка заказа — OrderDetails рендерит номер + тексты
    await expect(page.getByText(String(ORDER_NUMBER))).toBeVisible();
    await expect(page.getByText('идентификатор заказа')).toBeVisible();
    await expect(page.getByText('Ваш заказ начали готовить')).toBeVisible();

    // Закрытие модалки
    await page.getByRole('button', { name: 'Закрыть' }).click();
    await expect(page.getByText(String(ORDER_NUMBER))).toBeHidden();

    // clearSelectedIngredients в .then → конструктор пуст
    await expect(page.getByText('Выберите начинку')).toBeVisible();
    await expect(page.getByText('Выберите булки').first()).toBeVisible();
  });
});
