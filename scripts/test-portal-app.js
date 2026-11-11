#!/usr/bin/env node
'use strict';

const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { build, normalizePortalPayload } = require('./build-portal');
const { categoryBucketState, categorySkillIds, filterSkills, invocationFor, parseHash, serializeHash, clearFilters, skillSearchText, themeState } = require('../portal/src/app');

const payload = normalizePortalPayload();

assert.strictEqual(payload.skills.length, 39, 'app fixture must contain 39 standard skills');
assert.deepStrictEqual(payload.discovery_tags, ['planning', 'bug-debugging', 'review', 'testing', 'security', 'refactor', 'documentation', 'release', 'automation', 'react-frontend'], 'discovery tags should be curated by the catalog');
payload.discovery_tags.forEach((tag) => assert(payload.skills.some((skill) => skill.tags.includes(tag)), `discovery tag should be used: ${tag}`));
assert.deepStrictEqual(Object.keys(payload.category_guidance), payload.categories, 'each catalog category should have one guidance summary');
payload.categories.forEach((category) => {
  assert(payload.category_guidance[category].trim(), `category guidance should be non-empty: ${category}`);
  assert(categorySkillIds(payload.skills, category).length > 0, `category should contain skills: ${category}`);
});
assert.strictEqual(categoryBucketState(null, payload.categories[0], payload.categories), payload.categories[0], 'bucket selection should expand a valid category');
assert.strictEqual(categoryBucketState(payload.categories[0], payload.categories[0], payload.categories), null, 'selecting an open bucket should collapse it');
assert(filterSkills(payload.skills, { query: 'browser flow' }).some((skill) => skill.id === 'webapp-testing'), 'search should include prompts and use-when text');
assert(filterSkills(payload.skills, { category: 'Security & Risk', tags: ['security'] }).every((skill) => skill.category === 'Security & Risk' && skill.tags.includes('security')), 'combined category and tag filters should narrow results');
assert.strictEqual(filterSkills(payload.skills, { query: 'phrase-that-does-not-exist' }).length, 0, 'no-result search should be empty');
assert.deepStrictEqual(clearFilters(), { query: '', category: 'all', tags: [] }, 'clearFilters should restore the neutral filter state');
assert.deepStrictEqual(parseHash('#skill/pr-review'), { type: 'skill', id: 'pr-review' }, 'skill hash should parse');
assert.deepStrictEqual(parseHash('#workflow/bug-fixing'), { type: 'workflow', id: 'bug-fixing' }, 'workflow hash should parse');
assert.strictEqual(serializeHash('skill', 'pr-review'), '#skill/pr-review', 'skill hash should serialize');
const cursorHost = payload.hosts.find((host) => host.id === 'cursor');
const claudeHost = payload.hosts.find((host) => host.id === 'claude-code');
const codexHost = payload.hosts.find((host) => host.id === 'codex');
assert.strictEqual(invocationFor(cursorHost, 'pr-review'), '/pr-review', 'Cursor invocation should come from its template');
assert.strictEqual(invocationFor(claudeHost, 'pr-review'), '/agent-toolbelt:pr-review', 'Claude Code invocation should come from its template');
assert.strictEqual(invocationFor(codexHost, 'pr-review'), '$pr-review', 'Codex invocation should come from its template');
assert.strictEqual(cursorHost.local_install_commands[0], 'cursor-agent --plugin-dir /path/to/agent-toolbelt', 'Cursor setup command should be centralized');
assert.deepStrictEqual(Array.from(codexHost.local_install_commands), ['codex plugin marketplace add /path/to/agent-toolbelt', 'codex plugin add agent-toolbelt@agent-toolbelt'], 'Codex setup commands should be centralized');
assert.deepStrictEqual(themeState('light', true), { theme: 'light', isDark: false, buttonText: 'Dark mode', ariaLabel: 'Use dark theme' }, 'saved light theme should override system dark');
assert.deepStrictEqual(themeState('dark', false), { theme: 'dark', isDark: true, buttonText: 'Light mode', ariaLabel: 'Use light theme' }, 'saved dark theme should update toggle semantics');
assert.deepStrictEqual(themeState(null, true), { theme: 'dark', isDark: true, buttonText: 'Light mode', ariaLabel: 'Use light theme' }, 'system dark should be respected without a saved theme');
assert(skillSearchText(payload.skills.find((skill) => skill.id === 'threat-model')).includes('trust-boundary'), 'search text should include tags and metadata');

const indexSource = fs.readFileSync(path.join(__dirname, '..', 'portal', 'src', 'index.html'), 'utf8');
const appSource = fs.readFileSync(path.join(__dirname, '..', 'portal', 'src', 'app.js'), 'utf8');
assert(indexSource.includes('aria-labelledby="detail-title"'), 'dialog should identify its title');
assert(indexSource.includes('id="browse"'), 'Browse all navigation must target the results anchor');
assert(indexSource.includes('id="category-buckets"'), 'Find a Skill should include the category walkthrough');
assert(indexSource.includes('id="category-bucket-panel"'), 'category walkthrough should include an inline panel');
assert(appSource.includes("detailTitle.id = 'detail-title'"), 'dialog title should receive the referenced ID');
assert(appSource.includes('copy-status'), 'host copy status should preserve structured markup');
assert(appSource.includes("copyStatus.setAttribute('role', 'status')"), 'host copy status should be announceable');
assert(appSource.includes('Copy failed'), 'copy rejection should report failure accurately');
assert(appSource.includes("addEventListener('input'"), 'search should update from input events');
assert(appSource.includes('toggleCategoryBucket'), 'category buckets should have an expansion behavior');

const tempOutput = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-toolbelt-portal-sentinel-'));
try {
  fs.writeFileSync(path.join(tempOutput, 'unrelated-sentinel.txt'), 'preserve me');
  build(tempOutput);
  assert.strictEqual(fs.readFileSync(path.join(tempOutput, 'unrelated-sentinel.txt'), 'utf8'), 'preserve me', 'portal build must preserve unrelated output files');
} finally {
  fs.rmSync(tempOutput, { recursive: true, force: true });
}

console.log('Portal app helper tests passed: search, combined filters, clear/no-result, hashes, related identifiers, and host invocations.');
