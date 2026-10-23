import { test, expect } from '@playwright/test';

// HAR-перехват всех запросов к бэкенду — до page.goto() в каждом тесте.
test.beforeEach(async ({ page }) => {
  await page.routeFromHAR('tests/hars/ingredients.har', {
    url: /\/api\/ingredients$/,
    update: false,
  });
  await page.routeFromHAR('tests/hars/user.har', {
    url: /\/api\/auth\/user$/,
    update: false,
  });
  await page.routeFromHAR('tests/hars/orders-all.har', {
    url: /\/api\/orders\/all$/,
    update: false,
  });
  await page.routeFromHAR('tests/hars/orders.har', {
    url: /\/api\/orders$/,
    update: false,
  });
});

test.describe('add ingredients to constructor works correctly', () => {
  test('подключаем HAR-файлы при загрузке приложения', async ({ page }) => {
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
    await expect(
      page.getByTestId('constructor-ingredients').getByText('Выберите начинку')
    ).not.toBeVisible();
  });
});

test.describe('Модальные окна ингредиентов', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId(/^ingredient-/).first()).toBeVisible();
  });

  test('должен открывать модальное окно при клике на ингредиент', async ({ page }) => {
    await page.getByTestId('ingredient-643d69a5c3f7b9001cfa0942').locator('a').click();
    await expect(page.getByTestId('modal')).toBeVisible();
    await expect(page.getByTestId('modal')).toContainText('Соус Spicy-X');
  });

  test('должен закрывать модальное окно по клику на крестик', async ({ page }) => {
    await page
      .getByTestId(/^ingredient-/)
      .first()
      .click();
    await expect(page.getByTestId('modal')).toBeVisible();
    await page.getByTestId('modal-close').click();
    await expect(page.getByTestId('modal')).not.toBeVisible();
  });

  test('должен закрывать модальное окно по клику на оверлей', async ({ page }) => {
    await page
      .getByTestId(/^ingredient-/)
      .first()
      .click();
    await expect(page.getByTestId('modal')).toBeVisible();
    await page.getByTestId('modal-overlay').click({ position: { x: 5, y: 5 } });
    await expect(page.getByTestId('modal')).not.toBeVisible();
  });
});

test.describe('Создание заказа', () => {
  test('Собирается бургер', async ({ page }) => {
    await page.goto('/');

    const buns = page.getByTestId('bun-ingredients');
    await buns.getByTestId(/^add-/).first().click();

    const mains = page.getByTestId('mains-ingredients');
    await mains.getByTestId(/^add-/).first().click();

    await expect(page.getByTestId('constructor-bun-1')).toBeVisible();
    await expect(page.getByTestId('constructor-bun-2')).toBeVisible();
    await expect(
      page.getByTestId('constructor-ingredients').locator('li').first()
    ).toBeVisible();
  });

  test('Вызывается клик по кнопке «Оформить заказ»', async ({ context, page }) => {
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

    const buns = page.getByTestId('bun-ingredients');
    await buns.getByTestId(/^add-/).first().click();

    const mains = page.getByTestId('mains-ingredients');
    await mains.getByTestId(/^add-/).first().click();

    await page.getByTestId('order-button').click();

    await expect(page.getByTestId('modal')).toBeVisible();
    await expect(page.getByText('12345')).toBeVisible();

    await page.getByTestId('modal-close').click();
    await expect(page.getByTestId('modal')).not.toBeVisible();

    await expect(page.getByTestId('constructor-bun-1')).not.toBeVisible();
    await expect(page.getByTestId('constructor-bun-2')).not.toBeVisible();
    await expect(page.getByTestId('constructor-ingredients')).toContainText(
      'Выберите начинку'
    );
  });
});
