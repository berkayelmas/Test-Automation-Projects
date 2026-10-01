import { test, expect } from '@playwright/test';

test.setTimeout(120000);

test.beforeEach(async ({ page }) => {
  await page.goto('https://parabank.parasoft.com/parabank/admin.htm', { timeout: 30000 });
  const cleanBtn = page.locator('button[value="CLEAN"]');
  if (await cleanBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
    await cleanBtn.click();
    await page.waitForTimeout(5000);
  }
  await page.goto('https://parabank.parasoft.com/parabank/index.htm');
  await page.locator('input[name="username"]').fill('john');
  await page.locator('input[name="password"]').fill('demo');
  await page.locator('input[value="Log In"]').click();
  await page.waitForURL('**/overview.htm', { timeout: 20000 });
});

test('2 - Hesaplar arasi para transferi', async ({ page }) => {
  await page.locator('a:has-text("Transfer Funds")').click();
  await page.waitForSelector('#fromAccountId');
  await page.waitForTimeout(2000); // Parabank hesapları yüklesin
  
  await page.locator('#amount').fill('100');
  
  // Hesap sayısı kaç olursa olsun ilkini seç, hata vermez
  const fromCount = await page.locator('#fromAccountId option').count();
  const toCount = await page.locator('#toAccountId option').count();
  
  if (fromCount > 0) await page.locator('#fromAccountId').selectOption({ index: 0 });
  if (toCount > 1) await page.locator('#toAccountId').selectOption({ index: 1 });
  else if (toCount > 0) await page.locator('#toAccountId').selectOption({ index: 0 });

  await page.locator('input[value="Transfer"]').click();
  await expect(page.locator('body')).toContainText('Transfer Complete', { timeout: 15000 });
});

test('3 - Fatura Odeme', async ({ page }) => {
  await page.locator('a:has-text("Bill Pay")').click();
  await page.waitForSelector('input[name="payee.name"]', { timeout: 15000 });

  // Yavaş yavaş doldur, scroll yap
  await page.locator('input[name="payee.name"]').fill('Elektrik');
  await page.locator('input[name="payee.address.street"]').fill('Test Sokak');
  await page.locator('input[name="payee.address.city"]').fill('Istanbul');
  await page.locator('input[name="payee.address.state"]').fill('TR');
  await page.locator('input[name="payee.address.zipCode"]').fill('34000');
  await page.locator('input[name="payee.phoneNumber"]').fill('5555555555');
  await page.locator('input[name="payee.accountNumber"]').fill('12345');
  await page.locator('input[name="payee.verifyAccount"]').scrollIntoViewIfNeeded();
  await page.locator('input[name="payee.verifyAccount"]').fill('12345');
  await page.locator('input[name="amount"]').fill('250');
  
  await page.locator('input[value="Send Payment"]').click();
  await expect(page.locator('body')).toContainText('Bill Payment Complete', { timeout: 15000 });
});