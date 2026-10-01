import { test, expect } from '@playwright/test';

test.setTimeout(90000);

test.beforeEach(async ({ page }) => {
  await page.goto('https://parabank.parasoft.com/parabank/admin.htm', { timeout: 30000 });
  const cleanBtn = page.locator('button[value="CLEAN"]');
  if (await cleanBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
    await cleanBtn.click();
    await page.waitForTimeout(3000);
  }

  await page.goto('https://parabank.parasoft.com/parabank/index.htm');
  await page.locator('input[name="username"]').fill('john');
  await page.locator('input[name="password"]').fill('demo');
  await page.locator('input[value="Log In"]').click();
  await expect(page.getByRole('heading', { name: 'Accounts Overview' })).toBeVisible({ timeout: 15000 });
});

test('1 - Login basarili', async ({ page }) => {
  await expect(page.locator('#showOverview')).toBeVisible();
});

test('2 - Hesaplar arasi para transferi', async ({ page }) => {
  await page.locator('a:has-text("Transfer Funds")').click();
  await page.locator('#amount').fill('100');
  await page.locator('#fromAccountId').selectOption({ index: 0 });
  await page.locator('#toAccountId').selectOption({ index: 1 });
  await page.locator('input[value="Transfer"]').click();
  await expect(page.getByRole('heading', { name: 'Transfer Complete' })).toBeVisible();
});

test('3 - Fatura Odeme', async ({ page }) => {
  await page.locator('a:has-text("Bill Pay")').click();
  // Sayfa tam yuklensin
  await page.waitForLoadState('networkidle');
  
  await page.locator('input[name="payee.name"]').fill('Elektrik');
  await page.locator('input[name="payee.address.street"]').fill('Test Sokak');
  await page.locator('input[name="payee.address.city"]').fill('Istanbul');
  await page.locator('input[name="payee.address.state"]').fill('TR');
  await page.locator('input[name="payee.address.zipCode"]').fill('34000');
  await page.locator('input[name="payee.phoneNumber"]').fill('5555555555');
  await page.locator('input[name="payee.accountNumber"]').fill('12345');
  // BU SATIR SORUN CIKARIYORDU - bekleterek doldur
  const verify = page.locator('input[name="payee.verifyAccount"]');
  await verify.waitFor({ state: 'visible', timeout: 15000 });
  await verify.fill('12345');
  
  await page.locator('input[name="amount"]').fill('250');
  await page.locator('input[value="Send Payment"]').click();
  await expect(page.getByRole('heading', { name: 'Bill Payment Complete' })).toBeVisible({ timeout: 15000 });
});