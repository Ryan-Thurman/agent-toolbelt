#!/usr/bin/env node
'use strict';

// Keep the package-check entry point while using Playwright's managed Chromium.
const path = require('path');
const { spawnSync } = require('child_process');
let cli;
try {
  cli = require.resolve('@playwright/test/cli');
} catch {
  console.error('Portal browser checks require: npm ci && npx playwright install chromium');
  process.exit(1);
}
const result = spawnSync(process.execPath, [
  cli, 'test', '--config', path.resolve(__dirname, '../playwright.config.js'), ...process.argv.slice(2),
], { cwd: path.resolve(__dirname, '..'), stdio: 'inherit' });
if (result.error) console.error(result.error.message);
process.exit(result.status ?? 1);
