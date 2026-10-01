// @ts-check
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './qa/tests',
  timeout: 60 * 1000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html'], ['github']],

  use: {
    headless: true, // CI'da ekran olmadığı için true OLMAK ZORUNDA
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    baseURL: 'http://localhost:3000', // burayı kendi sitene göre değiştir
  },

  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
});