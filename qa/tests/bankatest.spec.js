import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('https://parabank.parasoft.com/parabank/index.htm');
  await page.locator('input[name="username"]').fill('bekotest');
  await page.locator('input[name="password"]').fill('testuser');
  await page.locator('input[value="Log In"]').click();
});

test('1 - Login', async ({ page }) => {
  await expect(page.locator('h1')).toContainText('Accounts Overview');
});

test('2 - Hesaplar arasi para transferi', async ({ page }) => {
  await page.locator('a:text("Transfer Funds")').click();
  await page.locator('#amount').fill('100');
  await page.locator('#fromAccountId').selectOption({ index: 0 });
  await page.locator('#toAccountId').selectOption({ index: 1 });
  await page.locator('input[value="Transfer"]').click();
  await expect(page.locator('h1')).toContainText('Transfer Complete');
});

test('3 - Fatura Odeme - Elektrik Faturasi', async ({ page }) => {
  await page.locator('a:text("Bill Pay")').click();
  await page.locator('input[name="payee.name"]').fill('Elektrik');
  await page.locator('input[name="payee.address.street"]').fill('Test Sokak');
  await page.locator('input[name="payee.address.city"]').fill('Istanbul');
  await page.locator('input[name="payee.address.state"]').fill('TR');
  await page.locator('input[name="payee.address.zipCode"]').fill('34000');
  await page.locator('input[name="payee.phoneNumber"]').fill('5555555555');
  await page.locator('input[name="payee.accountNumber"]').fill('12345');
  await page.locator('input[name="payee.verifyAccount"]').fill('12345');
  await page.locator('input[name="amount"]').fill('250');
  await page.locator('input[value="Send Payment"]').click();
  await expect(page.locator('h1')).toContainText('Bill Payment Complete');
});