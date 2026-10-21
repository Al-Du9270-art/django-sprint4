import { test, expect } from '@playwright/test';

test.describe('add ingredients to constructor works correctly', function () {
  test('записываем HAR-файл', async ({ page }) => {
    //записываем HAR
    await page.routeFromHAR('tests/hars/ingredients.har', {
      url: '**/api/ingredients',
      update: false,
    });

    await page.goto('/');

    await expect(page.getByTestId('ingredients-content')).toBeVisible();
  });

  test('добавление булки', async ({ page }) => {
    await page.goto('/');

    const buns = page.getByTestId('bun-ingredients');

    await buns.getByTestId(/^add-/).first().click();
    await expect(page.getByTestId('constructor-bun-1')).toBeVisible();
    await expect(page.getByTestId('constructor-bun-2')).toBeVisible();
  });

  test('добавление начинки', async ({ page }) => {
    await page.goto('/');

    const mains = page.getByTestId('mains-ingredients');
    await mains.getByTestId(/^add-/).first().click();

    const constructor = page.getByTestId('constructor-ingredients');
    await expect(constructor.getByText('Выберите начинку')).not.toBeVisible();
  });
});

test.describe('Модальные окна ингредиентов', () => {
  // Настраиваем моки и переход на страницу перед каждым тестом
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR('tests/hars/ingredients.har', {
      url: '**/api/ingredients',
      update: false,
    });
    await page.goto('/');

    // Ждем, пока загрузится и станет видимым хотя бы один ингредиент
    await expect(page.getByTestId(/^ingredient-/).first()).toBeVisible();
  });

  test('должен открывать модальное окно при клике на ингредиент', async ({ page }) => {
    // Кликаем по первому доступному ингредиенту
    await page
      .getByTestId(/^ingredient-/)
      .first()
      .locator('a')
      .click();

    // Проверяем, что модальное окно стало видимым
    await expect(page.getByTestId('modal')).toBeVisible();
  });

  test('должен закрывать модальное окно по клику на крестик', async ({ page }) => {
    // 1. Открываем модалку
    await page
      .getByTestId(/^ingredient-/)
      .first()
      .click();
    await expect(page.getByTestId('modal')).toBeVisible();

    // 2. Кликаем по крестику (мы добавили data-testid="modal-close")
    await page.getByTestId('modal-close').click();

    // 3. Проверяем, что модалка закрылась
    await expect(page.getByTestId('modal')).not.toBeVisible();
  });

  test('должен закрывать модальное окно по клику на оверлей', async ({ page }) => {
    // 1. Открываем модалку
    await page
      .getByTestId(/^ingredient-/)
      .first()
      .click();
    await expect(page.getByTestId('modal')).toBeVisible();

    // 2. Кликаем по оверлею (у него есть data-testid="modal-overlay")
    await page.getByTestId('modal-overlay').click({ position: { x: 5, y: 5 } });

    // 3. Проверяем, что модалка закрылась
    await expect(page.getByTestId('modal')).not.toBeVisible();
  });
});

test.describe('Создание заказа', () => {
  // моковые данные ответа на запрос данных пользователя.
  const mockUserResponse = {
    success: true,
    user: {
      email: 'test@example.com',
      name: 'Иван Иванов',
    },
  };

  // моковые данные ответа на запрос создания заказа.
  const mockOrderResponse = {
    success: true,
    name: 'Флюоресцентный бургер',
    order: {
      number: 12345,
      _id: '64f1a2b3c4d5e6f7a8b9c0d1',
      status: 'done',
      ingredients: [
        '64f1a2b3c4d5e6f7a8b9c001',
        '64f1a2b3c4d5e6f7a8b9c002',
        '64f1a2b3c4d5e6f7a8b9c003',
      ],
      createdAt: '2026-10-19T10:00:00.000Z',
      updatedAt: '2026-10-19T10:05:00.000Z',
    },
  };
  test('Собирается бургер', async ({ page }) => {
    // ингредиенты — из HAR
    await page.routeFromHAR('tests/hars/ingredients.har', {
      url: '**/api/ingredients',
    });

    await page.goto('/');

    // добавляем булку
    const buns = page.getByTestId('bun-ingredients');
    await buns.getByTestId(/^add-/).first().click();

    // добавляем начинку
    const mains = page.getByTestId('mains-ingredients');
    await mains.getByTestId(/^add-/).first().click();

    // проверяем, что конструктор собран — в нём нет заглушек «Выберите...»
    await expect(page.getByTestId('constructor-bun-1')).toBeVisible();
    await expect(page.getByTestId('constructor-bun-2')).toBeVisible();
    await expect(
      page.getByTestId('constructor-ingredients').locator('li').first()
    ).toBeVisible();
  });

  test('Вызывается клик по кнопке «Оформить заказ»', async ({ context, page }) => {
    await page.routeFromHAR('tests/hars/ingredients.har', {
      url: '**/api/ingredients',
    });

    await page.route('**/api/auth/user', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockUserResponse),
      });
    });

    await page.route('**/api/orders', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockOrderResponse),
      });
    });

    await context.addCookies([
      {
        name: 'accessToken',
        value: 'mock-access-token-string',
        domain: 'localhost',
        path: '/',
      },
    ]);

    await context.addInitScript(() => {
      localStorage.setItem('refreshToken', 'mock-refresh-token-string');
    });

    await page.goto('/');

    // сборка бургера
    const buns = page.getByTestId('bun-ingredients');
    await buns.getByTestId(/^add-/).first().click();

    const mains = page.getByTestId('mains-ingredients');
    await mains.getByTestId(/^add-/).first().click();

    // клик по кнопке оформления
    await page.getByTestId('order-button').click();

    // модальное окно и номер заказа
    await expect(page.getByTestId('modal')).toBeVisible();
    await expect(page.getByText('12345')).toBeVisible();

    // закрытие модального окна
    await page.getByTestId('modal-close').click();
    await expect(page.getByTestId('modal')).not.toBeVisible();

    // проверка на пустой конструктор
    await expect(page.getByTestId('constructor-bun-1')).not.toBeVisible();
    await expect(page.getByTestId('constructor-bun-2')).not.toBeVisible();
    await expect(page.getByTestId('constructor-ingredients')).toContainText('Выберите начинку');
  });
});
