import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './qa/tests',
  timeout: 120000,
  retries: 1,
  workers: 1,
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    headless: true,
    screenshot: 'on',
    video: 'on',
    trace: 'on-first-retry',
    actionTimeout: 20000,
    navigationTimeout: 60000,
  },
});