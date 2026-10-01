// @ts-check
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './qa/tests',
  timeout: 30 * 1000,
  workers: 1,
  reporter: 'html',
  use: {
    baseURL: 'https://parabank.parasoft.com',
    headless: false,
    screenshot: 'on',
    video: 'on',
    trace: 'on',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});