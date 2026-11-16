const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');
const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

const pageURL = (file) => pathToFileURL(path.resolve(__dirname, '../generated', file)).href;
const portalURL = pageURL('index.html');
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
  await expect(page.locator('#skills-grid .skill-card')).toHaveCount(44);
  await page.evaluate(() => document.fonts.ready);
});

test('readable catalog, filters, and skill details', async ({ page }, testInfo) => {
  const { errors, remoteRequests } = diagnostics.get(page);

  await expect(page.locator('#result-summary')).toHaveText('Showing all 44 skills');
  await expect(page.locator('html')).toHaveAttribute('data-theme', testInfo.project.use.colorScheme);
  await expect(page.getByRole('searchbox', { name: 'Search skills' })).toBeInViewport();
  await expect(page.getByRole('navigation', { name: 'Primary navigation' })).toBeVisible();
  await expect(page.locator('#skill-count')).toHaveText('44');
  await expect(page.getByRole('button', { name: 'Reset filters', exact: true })).toBeVisible();
  await checkLayout(page);
  await capture(page, testInfo, 'home');
  await checkAccessibility(page, testInfo, 'catalog');
  await checkTaskShortcuts(page);

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
  await expect(page.locator('#skills-grid .skill-card')).toHaveCount(44);

  await page.locator('#category-filters').getByRole('button', { name: 'Review & Quality', exact: true }).click();
  await expect(page.locator('#result-summary')).toContainText('match your filters');
  await page.getByRole('button', { name: 'Reset filters', exact: true }).click();
  await expect(page.locator('#result-summary')).toHaveText('Showing all 44 skills');

  await expect(page.getByRole('navigation', { name: 'Primary navigation' }).locator('[aria-current="page"]')).toHaveText('Skill library');
  await expect(page.locator('#workflow-list, #use-case-list, #host-setup-list')).toHaveCount(0);
  expect(errors).toEqual([]);
  expect(remoteRequests).toEqual([]);
});

test('workflows page shows the index, then one workflow at a time', async ({ page }, testInfo) => {
  const { errors, remoteRequests } = diagnostics.get(page);
  await page.goto(pageURL('workflows.html'));
  await expect(page.getByRole('navigation', { name: 'Primary navigation' }).locator('[aria-current="page"]')).toHaveText('Workflows');
  const cards = page.locator('#start-here-list .start-card');
  await expect(cards).toHaveCount(11);
  await expect(page.locator('#workflow-detail')).toBeHidden();
  await expect(cards.first().locator('.stage-dot')).toHaveCount(6);
  await checkLayout(page);
  await capture(page, testInfo, 'workflows');
  await checkAccessibility(page, testInfo, 'workflow-index');

  await cards.first().click();
  await expect(page).toHaveURL(/#workflow\/product-learning$/);
  await expect(page.locator('#start-here-list')).toBeHidden();
  await expect(page.locator('#workflow-list .workflow-card')).toHaveCount(1);
  await expect(page.locator('#workflow-rail-list [aria-current="true"]')).toHaveText('Product decisions and learning');
  await checkLayout(page);
  await capture(page, testInfo, 'workflow-stages');
  await checkProductLearningWorkflow(page, testInfo);

  await page.locator('#workflow-rail-list').getByRole('link', { name: 'Technical health and modernization' }).click();
  const improvement = page.locator('#workflow-codebase-improvement');
  await expect(improvement.locator('.stage-skill').first()).toHaveText('Technical Debt Discovery');
  await expect(improvement.locator('.stage-skill[data-open-skill="tech-backlog-assessment"]')).toHaveText('Tech Backlog Assessment');
  await expect(page.locator('#workflow-product-learning')).toHaveCount(0);
  await page.goto(`${pageURL('workflows.html')}#workflow/security-sensitive-change`);
  const architecture = page.locator('#workflow-security-sensitive-change');
  await expect(architecture.locator('.stage-skill').first()).toHaveText('System Design');
  await expect(architecture.locator('.stage-skill[data-open-skill="threat-model"]')).toHaveText('Threat Model');

  await page.locator('#workflow-back').click();
  await expect(cards).toHaveCount(11);
  await expect(page.locator('#start-here-list')).toBeVisible();
  await expect(page.locator('#workflow-detail')).toBeHidden();
  expect(errors).toEqual([]);
  expect(remoteRequests).toEqual([]);
});

test('use cases page groups by role, filters, and links to skill details', async ({ page }, testInfo) => {
  const { errors } = diagnostics.get(page);
  await page.goto(pageURL('use-cases.html'));
  await expect(page.getByRole('navigation', { name: 'Primary navigation' }).locator('[aria-current="page"]')).toHaveText('Use cases');
  const cards = page.locator('#use-case-list .use-case-card');
  const total = await cards.count();
  expect(total).toBeGreaterThan(0);
  expect(await page.locator('#use-case-list .use-case-section').count()).toBeGreaterThan(1);
  for (const summary of await page.locator('.use-case-summary').allTextContents()) expect(summary).not.toMatch(/`|\]\(/);
  await checkLayout(page);
  await capture(page, testInfo, 'use-cases');
  await checkAccessibility(page, testInfo, 'use-cases');
  const qa = page.locator('#use-case-groups').getByRole('button', { name: 'QA and test' });
  await qa.click();
  await expect(qa).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#use-case-list .use-case-section')).toHaveCount(1);
  const qaCount = await cards.count();
  expect(qaCount).toBeGreaterThan(0);
  expect(qaCount).toBeLessThan(total);
  await expect(page.locator('#use-case-list .use-case-group-name')).toHaveText('QA and test');
  await checkAccessibility(page, testInfo, 'use-cases-filtered');
  await cards.first().locator('.detail-related button').first().click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.locator('.detail-use-cases li').first()).toBeVisible();
  await page.locator('.detail-workflows button').first().click();
  await expect(page).toHaveURL(/workflows\.html#workflow\//);
  await expect(page.locator('#workflow-list .workflow-card')).toHaveCount(1);
  expect(errors).toEqual([]);
});

test('setup page shows host commands and the plugin contents', async ({ page }, testInfo) => {
  const { errors, remoteRequests } = diagnostics.get(page);
  await page.goto(pageURL('setup.html'));
  await expect(page.getByRole('navigation', { name: 'Primary navigation' }).locator('[aria-current="page"]')).toHaveText('Setup');
  await expect(page.locator('#host-setup-list .host-setup-card')).toHaveCount(3);
  await expect(page.locator('#plugin-skill-count')).toHaveText('44');
  await expect(page.locator('#tooling-groups .tooling-group').first()).toBeVisible();
  await checkLayout(page);
  await capture(page, testInfo, 'setup');
  await checkAccessibility(page, testInfo, 'setup');
  expect(errors).toEqual([]);
  expect(remoteRequests).toEqual([]);
});

test('links to the earlier one-page portal reach the new pages', async ({ page }) => {
  await page.goto(`${portalURL}#workflow/bug-fixing`);
  await expect(page).toHaveURL(/workflows\.html#workflow\/bug-fixing$/);
  await expect(page.locator('#workflow-bug-fixing')).toBeVisible();
  await page.goto(`${portalURL}#use-cases`);
  await expect(page).toHaveURL(/use-cases\.html$/);
  await page.goto(`${portalURL}#hosts`);
  await expect(page).toHaveURL(/setup\.html$/);
  await page.goto(`${portalURL}#skill/pr-review`);
  await expect(page.locator('#detail-title')).toHaveText('PR Review');
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
  await expect(page.locator('#skills-grid .skill-card')).toHaveCount(44);
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

test('hero install tabs switch hosts and copy commands', async ({ page, context }, testInfo) => {
  test.skip(testInfo.project.name.startsWith('mobile'), 'The hero install block is hidden on phones.');
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  const tabs = page.getByRole('tablist', { name: 'Install commands by agent host' });
  const panel = page.locator('#hero-install-panel');
  await expect(tabs.getByRole('tab')).toHaveCount(3);
  await expect(tabs.getByRole('tab', { name: 'Cursor' })).toHaveAttribute('aria-selected', 'true');
  await expect(panel).toContainText('cursor-agent --plugin-dir /path/to/agent-toolbelt');
  await tabs.getByRole('tab', { name: 'Codex' }).click();
  await expect(panel.locator('.install-line')).toHaveCount(2);
  await expect(panel).toContainText('codex plugin add agent-toolbelt@agent-toolbelt');
  await page.keyboard.press('ArrowLeft');
  await expect(tabs.getByRole('tab', { name: 'Claude Code' })).toBeFocused();
  await expect(tabs.getByRole('tab', { name: 'Claude Code' })).toHaveAttribute('aria-selected', 'true');
  await expect(panel).toContainText('claude --plugin-dir /path/to/agent-toolbelt');
  const copy = page.getByRole('button', { name: 'Copy Claude Code install commands' }).first();
  await copy.click();
  await expect(copy.locator('.copy-status')).toHaveText('Copied');
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('claude --plugin-dir /path/to/agent-toolbelt');
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


async function checkProductLearningWorkflow(page, testInfo) {
  const learning = page.locator('#workflow-product-learning');
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
  await expect(page).toHaveURL(/#workflow\/product-learning$/);
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
}
