const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  await page.goto('/parabank/index.htm');
  await page.locator('input[name="username"]').fill('bekotest');
  await page.locator('input[name="password"]').fill('testuser');
  await page.locator('input[value="Log In"]').click();
  await expect(page.locator('#leftPanel')).toContainText('Accounts Overview', { timeout: 10000 });
});

test('1 - Login', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Accounts Overview' })).toBeVisible();
});

test('2 - Hesaplar arasi para transferi', async ({ page }) => {
  await page.click('text=Transfer Funds');
  await page.locator('#amount').fill('100');
  await page.locator('#fromAccountId').selectOption({ index: 0 });
  const toCount = await page.locator('#toAccountId option').count();
  if (toCount > 1) {
    await page.locator('#toAccountId').selectOption({ index: 1 });
  }
  await page.click('input[value="Transfer"]');
  await expect(page.locator('#showResult')).toContainText('Transfer Complete!');
});

test('3 - Fatura Odeme - Elektrik Faturasi', async ({ page }) => {
  await page.click('text=Bill Pay');
  await page.locator('input[name="payee.name"]').fill('Enerjisa Elektrik');
  await page.locator('input[name="payee.address.street"]').fill('Levent Mah. No:5');
  await page.locator('input[name="payee.address.city"]').fill('Istanbul');
  await page.locator('input[name="payee.address.state"]').fill('TR');
  await page.locator('input[name="payee.address.zipCode"]').fill('34000');
  await page.locator('input[name="payee.phoneNumber"]').fill('02121234567');
  await page.locator('input[name="payee.accountNumber"]').fill('12345678');
  await page.locator('input[name="verifyAccount"]').fill('12345678');
  await page.locator('input[name="amount"]').fill('250');
  await page.locator('input[value="Send Payment"]').click();
  await expect(page.locator('#billpayResult')).toContainText('Bill Payment Complete');
});