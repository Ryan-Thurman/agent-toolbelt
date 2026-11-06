const path = require('path');
const { defineConfig } = require('@playwright/test');

const artifacts = path.resolve(__dirname, '.atb-work/portal');

module.exports = defineConfig({
  testDir: './portal/tests',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  workers: 2,
  retries: 0,
  timeout: 45000,
  expect: { timeout: 5000 },
  outputDir: path.join(artifacts, 'test-results'),
  reporter: [
    ['list'],
    ['html', { outputFolder: path.join(artifacts, 'playwright-report'), open: 'never' }],
  ],
  use: {
    browserName: 'chromium',
    launchOptions: process.env.PLAYWRIGHT_SINGLE_PROCESS === '1'
      ? { args: ['--single-process', '--no-zygote', '--disable-gpu'] }
      : {},
    reducedMotion: 'reduce',
    deviceScaleFactor: 1,
    locale: 'en-US',
    timezoneId: 'UTC',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'desktop-light', use: { viewport: { width: 1440, height: 1000 }, colorScheme: 'light' } },
    { name: 'desktop-dark', use: { viewport: { width: 1440, height: 1000 }, colorScheme: 'dark' } },
    { name: 'mobile-light', use: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, colorScheme: 'light' } },
    { name: 'mobile-dark', use: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, colorScheme: 'dark' } },
  ],
});
