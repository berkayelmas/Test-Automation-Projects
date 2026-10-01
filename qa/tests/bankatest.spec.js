import { test, expect } from '@playwright/test';

test.setTimeout(120000);

test.beforeEach(async ({ page }) => {
  await page.goto('https://parabank.parasoft.com/parabank/index.htm', { 
    timeout: 60000,
    waitUntil: 'domcontentloaded'
  });
  await page.locator('input[name="username"]').waitFor({ timeout: 20000 });
  await page.locator('input[name="username"]').fill('john');
  await page.locator('input[name="password"]').fill('demo');
  await page.locator('input[value="Log In"]').click();
  await page.waitForURL('**/overview.htm', { timeout: 30000 });
});

test('1 - Login basarili', async ({ page }) => {
  await expect(page.locator('#showOverview')).toBeVisible({ timeout: 10000 });
  await expect(page.locator('body')).toContainText('Accounts Overview');
});

test('2 - Hesaplar arasi para transferi', async ({ page }) => {
  await page.locator('a:has-text("Transfer Funds")').click();
  await page.waitForSelector('#fromAccountId', { timeout: 20000 });
  await page.waitForTimeout(2000);
  await page.locator('#amount').fill('100');
  const toCount = await page.locator('#toAccountId option').count();
  if (toCount > 1) {
    await page.locator('#fromAccountId').selectOption({ index: 0 });
    await page.locator('#toAccountId').selectOption({ index: 1 });
  } else {
    await page.locator('#fromAccountId').selectOption({ index: 0 });
    await page.locator('#toAccountId').selectOption({ index: 0 });
  }
  await page.locator('input[value="Transfer"]').click();
  await expect(page.locator('body')).toContainText('Transfer Complete', { timeout: 20000 });
});

test('3 - Fatura Odeme', async ({ page }) => {
  await page.locator('a:has-text("Bill Pay")').click();
  await page.waitForSelector('input[name="payee.name"]', { timeout: 20000 });
  await page.evaluate(() => {
    const fill = (name, value) => {
      const el = document.querySelector(`input[name="${name}"]`);
      if (el) {
        el.value = value;
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      }
    };
    fill('payee.name', 'Elektrik');
    fill('payee.address.street', 'Test Sokak');
    fill('payee.address.city', 'Istanbul');
    fill('payee.address.state', 'TR');
    fill('payee.address.zipCode', '34000');
    fill('payee.phoneNumber', '5555555555');
    fill('payee.accountNumber', '12345');
    fill('payee.verifyAccount', '12345');
    fill('amount', '250');
  });
  await page.waitForTimeout(1000);
  await page.locator('input[value="Send Payment"]').click();
  await expect(page.locator('body')).toContainText('Bill Payment Complete', { timeout: 20000 });
});