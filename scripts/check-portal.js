#!/usr/bin/env node
'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { ROOT, discoverCanonicalSkills } = require('./catalog-lib');
const { GENERATED_FILES, PAGES } = require('./build-portal');

function readPayload(outputDirectory) {
  const scriptPath = path.join(outputDirectory, 'data.js');
  const source = fs.readFileSync(scriptPath, 'utf8');
  const context = { window: {} };
  vm.runInNewContext(source, context, { filename: scriptPath });
  return context.window.AGENT_TOOLBELT_DATA;
}

// Each link must point to an anchor on its page, to another generated page, or to an anchor on that page.
function checkLinks(pages, label) {
  const idsByFile = new Map(Array.from(pages, ([file, html]) => [file, new Set(Array.from(html.matchAll(/\bid="([^"]+)"/g), (match) => match[1]))]));
  pages.forEach((html, file) => {
    Array.from(html.matchAll(/\bhref="([^"]*)"/g), (match) => match[1]).forEach((href) => {
      if (!href.startsWith('#') && !/\.html(#|$)/.test(href)) return;
      const [target, anchor] = href.split('#');
      const targetFile = target || file;
      assert(idsByFile.has(targetFile), `${label} ${file} links to a page that does not exist: ${href}`);
      if (anchor) assert(idsByFile.get(targetFile).has(anchor), `${label} ${file} has a broken anchor: ${href}`);
    });
  });
}

function check(outputDirectory, root = ROOT) {
  const output = path.resolve(outputDirectory);
  GENERATED_FILES.forEach((file) => assert(fs.existsSync(path.join(output, file)), `missing generated portal file: ${file}`));
  const pages = new Map(PAGES.map((page) => [page.file, fs.readFileSync(path.join(output, page.file), 'utf8')]));
  const index = pages.get('index.html');
  const allPages = Array.from(pages.values()).join('\n');
  const styles = fs.readFileSync(path.join(output, 'styles.css'), 'utf8');
  const app = fs.readFileSync(path.join(output, 'app.js'), 'utf8');
  checkLinks(pages, 'generated portal page');
  assert(index.includes('href="#browse"') && index.includes('id="browse"'), 'the skill library must keep the Browse results anchor: #browse');
  pages.forEach((html, file) => {
    assert(html.includes('href="styles.css"'), `${file} must reference styles.css`);
    assert(html.includes('src="data.js"'), `${file} must reference data.js`);
    assert(html.includes('src="app.js"'), `${file} must reference app.js`);
    assert(html.includes('aria-labelledby="detail-title"'), `${file}: dialog must label itself with detail-title`);
    assert(/<h1[ >]/.test(html), `${file} must have a level-one heading`);
    assert((html.match(/aria-current="page"/g) || []).length === 1, `${file} must mark one navigation link as the current page`);
    assert(!/\{\{/.test(html), `${file} has a layout placeholder with no value`);
  });
  assert(pages.get('setup.html').includes('id="hosts"'), 'the setup page must include host setup guidance');
  assert(pages.get('workflows.html').includes('id="workflow-list"'), 'the workflows page must include the workflow stages target');
  assert(pages.get('use-cases.html').includes('id="use-case-list"'), 'the use-cases page must include the use-case list target');
  assert(index.includes('id="category-buckets"'), 'portal must include the guided category walkthrough');
  assert(index.includes('id="category-bucket-panel"'), 'portal must include the category bucket panel');
  assert(!/fetch\s*\(|\bimport\s*\(/.test(`${allPages}\n${styles}\n${app}`), 'portal runtime must not fetch or import remote data');
  assert(!/https?:\/\//.test(`${allPages}\n${styles}\n${app}`), 'portal shell must not depend on remote URLs');
  assert(!/https?:\/\//.test(allPages), 'portal pages must not include remote assets');
  assert(styles.includes('.search-field'), 'portal must style the search control');
  assert(styles.includes('grid-column: 1 / -1'), 'search control should use a compact full-width row');
  const payload = readPayload(output);
  assert(payload && payload.skills && payload.workflows, 'generated data payload is incomplete');
  const canonical = discoverCanonicalSkills(root).skills;
  assert.strictEqual(payload.skills.length, 44, 'generated portal must contain 44 standard skills');
  assert.strictEqual(JSON.stringify(Array.from(payload.skills, (skill) => skill.id).sort()), JSON.stringify(canonical.map((skill) => skill.id).sort()), 'generated skill IDs must match canonical IDs');
  assert.strictEqual(payload.workflows.length, 11, 'generated portal must contain eleven workflows');
  assert(Array.isArray(payload.use_cases) && payload.use_cases.length > 0, 'generated portal must list the use-case pages');
  const skillIds = new Set(payload.skills.map((skill) => skill.id));
  payload.use_cases.forEach((useCase) => {
    assert(useCase.title && useCase.summary && useCase.group, `use case is incomplete: ${useCase.slug}`);
    assert(!/`|\]\(/.test(useCase.summary), `use-case summary must be plain text, not Markdown: ${useCase.slug}`);
    assert(fs.existsSync(path.join(root, useCase.source_path)), `use-case source is missing: ${useCase.source_path}`);
    useCase.skills.forEach((id) => assert(skillIds.has(id), `use case ${useCase.slug} names an unknown skill: ${id}`));
  });
  assert.strictEqual(JSON.stringify(Object.keys(payload.category_guidance)), JSON.stringify(Array.from(payload.categories)), 'generated category guidance must cover the catalog taxonomy exactly');
  payload.categories.forEach((category) => assert(payload.category_guidance[category].trim(), `generated category guidance is empty: ${category}`));
  assert(payload.hosts.length === 3 && payload.hosts.every((host) => host.id && host.name && host.invocation_template && host.invocation_template.includes('{skill_id}') && host.local_install_commands && host.local_install_commands.length), 'generated host records are incomplete');
  const hostCommands = new Map(payload.hosts.map((host) => [host.id, host.local_install_commands]));
  assert.strictEqual(JSON.stringify(Array.from(hostCommands.get('cursor'))), JSON.stringify(['cursor-agent --plugin-dir /path/to/agent-toolbelt']), 'Cursor local install command changed');
  assert.strictEqual(JSON.stringify(Array.from(hostCommands.get('claude-code'))), JSON.stringify(['claude --plugin-dir /path/to/agent-toolbelt']), 'Claude Code local install command changed');
  assert.strictEqual(JSON.stringify(Array.from(hostCommands.get('codex'))), JSON.stringify(['codex plugin marketplace add /path/to/agent-toolbelt', 'codex plugin add agent-toolbelt@agent-toolbelt']), 'Codex local install commands changed');
  assert(Array.isArray(payload.discovery_tags) && payload.discovery_tags.length === 10 && payload.discovery_tags.every((tag) => payload.skills.some((skill) => skill.tags.includes(tag))), 'curated discovery tags must be present and used');
  assert(app.includes('copy-status'), 'copy behavior must preserve structured host markup with a status element');
  assert(app.includes("copyStatus.setAttribute('role', 'status')"), 'copy status must be announceable');
  assert(app.includes('() => done(true), () => done(fallbackCopy(text))'), 'copy rejection must not be treated as success');
  assert(app.includes("done(fallbackCopy(text))"), 'copy rejection must use the bounded local fallback');
  assert(app.includes('invocationFor(host, skill.id)'), 'skill host invocations must use centralized host templates');
  assert(app.includes('detailTitle.id = \'detail-title\''), 'rendered dialog title must receive detail-title');
  assert(app.includes('dialogReturnFocus'), 'dialog should restore focus after close or Escape');
  payload.skills.forEach((skill) => {
    assert(fs.existsSync(path.join(root, skill.source_path)), `missing skill source: ${skill.source_path}`);
    skill.related_skills.forEach((related) => assert(payload.skills.some((candidate) => candidate.id === related), `missing related skill: ${related}`));
    skill.workflow_membership.forEach((workflow) => assert(payload.workflows.some((candidate) => candidate.id === workflow), `missing workflow membership: ${workflow}`));
  });
  payload.workflows.forEach((workflow) => workflow.stages.forEach((stage) => {
    assert(payload.skills.some((skill) => skill.id === stage.skill), `missing workflow stage skill: ${stage.skill}`);
    stage.next_steps.forEach((next) => assert(payload.skills.some((skill) => skill.id === next), `missing workflow next skill: ${next}`));
  }));
  return payload;
}

function main() {
  const output = process.argv[2] || path.join(ROOT, 'portal', 'generated');
  try {
    const payload = check(output, ROOT);
    console.log(`Portal output check passed: ${payload.skills.length} skills, ${payload.workflows.length} workflows, local sources, and offline references are valid.`);
  } catch (error) {
    console.error(`Portal output check failed: ${error.message}`);
    process.exitCode = 1;
  }
}

if (require.main === module) main();

module.exports = { check, readPayload };
