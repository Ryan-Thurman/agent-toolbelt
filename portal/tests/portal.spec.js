const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');
const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

const portalURL = pathToFileURL(path.resolve(__dirname, '../generated/index.html')).href;
const diagnostics = new WeakMap();

async function capture(page, testInfo, name) {
  const target = path.resolve(__dirname, '../../.atb-work/portal/screenshots', testInfo.project.name, `${name}.png`);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  await page.screenshot({ path: target, animations: 'disabled' });
  await testInfo.attach(name, { path: target, contentType: 'image/png' });
}

async function checkAccessibility(page, testInfo, name) {
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  await testInfo.attach(`${name}-accessibility`, {
    body: JSON.stringify({ violations: results.violations, incomplete: results.incomplete }, null, 2),
    contentType: 'application/json',
  });
  expect(results.violations, `${name}: ${JSON.stringify(results.violations.map(({ id, nodes }) => ({ id, targets: nodes.map((node) => node.target) })))}`).toEqual([]);
}

async function checkLayout(page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
}

test.beforeEach(async ({ page }) => {
  const problems = { errors: [], remoteRequests: [] };
  diagnostics.set(page, problems);
  page.on('pageerror', (error) => problems.errors.push(error.message));
  page.on('request', (request) => { if (/^https?:/.test(request.url())) problems.remoteRequests.push(request.url()); });
  await page.goto(portalURL);
  await expect(page.locator('#skills-grid .skill-card')).toHaveCount(37);
  await page.evaluate(() => document.fonts.ready);
});

test('readable catalog, filters, and skill details', async ({ page }, testInfo) => {
  const { errors, remoteRequests } = diagnostics.get(page);

  await expect(page.locator('#result-summary')).toHaveText('Showing all 37 skills');
  await expect(page.locator('html')).toHaveAttribute('data-theme', testInfo.project.use.colorScheme);
  await expect(page.getByRole('searchbox', { name: 'Search skills' })).toBeInViewport();
  await expect(page.getByRole('navigation', { name: 'Primary navigation' })).toBeVisible();
  await expect(page.locator('#skill-count')).toHaveText('37');
  await expect(page.getByRole('button', { name: 'Reset filters', exact: true })).toBeVisible();
  await checkLayout(page);
  await capture(page, testInfo, 'home');
  await checkAccessibility(page, testInfo, 'catalog');
  await checkTaskShortcuts(page);
  await checkProductDesignWorkflows(page, testInfo);

  const guide = page.locator('.discovery-walkthrough');
  await expect(guide).not.toHaveAttribute('open');
  await guide.locator('summary').click();
  const bucket = page.locator('[data-category-bucket]').first();
  await bucket.click();
  await expect(bucket).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#category-bucket-panel')).toBeVisible();
  await expect(page.locator('#category-bucket-skills .category-skill-card').first()).toBeVisible();
  await checkLayout(page);
  await bucket.click();
  await expect(page.locator('#category-bucket-panel')).toBeHidden();
  await guide.locator('summary').click();

  const search = page.getByRole('searchbox', { name: 'Search skills' });
  await search.fill('pr-review');
  const category = page.locator('#category-filters').getByRole('button', { name: 'Review & Quality', exact: true });
  await category.click();
  await expect(category).toHaveAttribute('aria-pressed', 'true');
  await expect(category).toBeFocused();
  const tag = page.locator('#tag-filters').getByRole('button', { name: '#review', exact: true });
  await tag.click();
  await expect(tag).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#result-summary')).toContainText('match your filters');
  const card = page.locator('#skills-grid .skill-card').filter({ has: page.locator('.skill-id', { hasText: /^pr-review$/ }) });
  await expect(card).toHaveCount(1);
  await search.scrollIntoViewIfNeeded();
  await capture(page, testInfo, 'finder');
  await checkAccessibility(page, testInfo, 'filtered-catalog');
  await page.locator('.results-bar').evaluate((element) => element.scrollIntoView({ block: 'start' }));
  await capture(page, testInfo, 'results');

  const open = card.locator('.card-open');
  await open.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.locator('#detail-title')).toContainText('PR Review');
  await checkLayout(page);
  await capture(page, testInfo, 'skill-details');
  await checkAccessibility(page, testInfo, 'skill-details');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toBeHidden();
  await expect(open).toBeFocused();

  await search.fill('no-such-skill-908172');
  await expect(page.locator('#empty-state')).toBeVisible();
  await page.locator('#empty-clear').click();
  await expect(page.locator('#skills-grid .skill-card')).toHaveCount(37);

  await page.locator('#category-filters').getByRole('button', { name: 'Review & Quality', exact: true }).click();
  await expect(page.locator('#result-summary')).toContainText('match your filters');
  await page.getByRole('button', { name: 'Reset filters', exact: true }).click();
  await expect(page.locator('#result-summary')).toHaveText('Showing all 37 skills');

  await page.locator('#workflows .section-heading').evaluate((element) => {
    const headerHeight = document.querySelector('.site-header').getBoundingClientRect().height;
    window.scrollTo({ top: element.getBoundingClientRect().top + window.scrollY - headerHeight - 20, behavior: 'instant' });
  });
  await capture(page, testInfo, 'workflows');
  await checkLayout(page);
  expect(errors).toEqual([]);
  expect(remoteRequests).toEqual([]);
});

test('theme preference persists and keyboard focus is visible', async ({ page }, testInfo) => {
  const initial = testInfo.project.use.colorScheme;
  const next = initial === 'dark' ? 'light' : 'dark';
  const toggle = page.locator('#theme-toggle');
  await toggle.click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', next);
  await expect(toggle).toHaveAccessibleName(`Use ${initial} theme`);
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', next);
  await expect(page.locator('#skills-grid .skill-card')).toHaveCount(37);
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: 'Skip to content' });
  await expect(skip).toBeFocused();
  const outline = await skip.evaluate((element) => {
    const style = getComputedStyle(element);
    return { width: parseFloat(style.outlineWidth), style: style.outlineStyle };
  });
  expect(outline.width).toBeGreaterThanOrEqual(2);
  expect(outline.style).not.toBe('none');
  await page.keyboard.press('Control+k');
  await expect(page.getByRole('searchbox', { name: 'Search skills' })).toBeFocused();
  await expect(page.getByRole('searchbox', { name: 'Search skills' })).toBeInViewport();
});

async function checkTaskShortcuts(page) {
  const tasks = [
    { id: 'product-discovery', title: 'Product Discovery' },
    { id: 'bug-to-fix', title: 'Bug To Fix' },
    { id: 'pr-review', title: 'PR Review' },
    { id: 'user-research-synthesis', title: 'User Research Synthesis' },
    { id: 'tech-debt-discovery', title: 'Technical Debt Discovery' },
    { id: 'system-design', title: 'System Design' },
  ];
  for (const task of tasks) {
    const shortcut = page.locator(`#task-shortcuts [data-open-skill="${task.id}"]`);
    await shortcut.click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.locator('#detail-title')).toHaveText(task.title);
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toBeHidden();
    await expect(shortcut).toBeFocused();
  }
}


async function checkProductDesignWorkflows(page, testInfo) {
  await expect(page.locator('#workflow-count')).toHaveText('6');
  const learning = page.locator('#workflow-product-learning');
  await learning.scrollIntoViewIfNeeded();
  const stages = learning.getByRole('list', { name: 'Product decisions and learning stages' });
  await expect(stages.getByRole('listitem')).toHaveCount(6);
  const firstStage = stages.getByRole('listitem').first();
  await expect(firstStage.locator('.stage-category')).toHaveText('Discovery & Planning');
  await expect(firstStage.locator('.stage-output')).toContainText('Evidence-linked themes');
  const prompt = firstStage.locator('.stage-prompt');
  await expect(prompt.locator('.stage-example')).toBeHidden();
  await prompt.locator('summary').click();
  await expect(prompt.locator('.stage-example')).toHaveText('Synthesize this customer research.');
  await expect(prompt.locator('.stage-example')).toBeVisible();
  await checkAccessibility(page, testInfo, 'workflow-example');
  await prompt.locator('summary').click();
  const first = learning.locator('.workflow-start');
  await first.click();
  await expect(page.locator('#detail-title')).toHaveText('User Research Synthesis');
  await page.keyboard.press('Escape');
  await expect(first).toBeFocused();
  // The timeline shows the following stage, so only branches appear as handoff links.
  await expect(firstStage.locator('.next-link')).toHaveCount(0);
  const handoff = stages.getByRole('listitem').nth(1).locator('.next-link[data-open-skill="product-outcome-review"]');
  await handoff.click();
  await expect(page.locator('#detail-title')).toHaveText('Product Outcome Review');
  await page.keyboard.press('Escape');
  await expect(handoff).toBeFocused();
  const outcome = learning.locator('.stage-skill[data-open-skill="product-outcome-review"]');
  await outcome.click();
  await expect(page.locator('#detail-title')).toHaveText('Product Outcome Review');
  await expect(page.getByRole('dialog')).toContainText('population');
  await page.keyboard.press('Escape');
  await expect(outcome).toBeFocused();
  const architecture = page.locator('#workflow-security-sensitive-change');
  await expect(architecture.locator('.stage-skill').first()).toHaveText('System Design');
  await expect(architecture.locator('.stage-skill[data-open-skill="threat-model"]')).toHaveText('Threat Model');
  const improvement = page.locator('#workflow-codebase-improvement');
  await expect(improvement.locator('.stage-skill').first()).toHaveText('Technical Debt Discovery');
  await expect(improvement.locator('.stage-skill[data-open-skill="tech-backlog-assessment"]')).toHaveText('Tech Backlog Assessment');
}
