#!/usr/bin/env node
'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { ROOT, discoverCanonicalSkills } = require('./catalog-lib');

function readPayload(outputDirectory) {
  const scriptPath = path.join(outputDirectory, 'data.js');
  const source = fs.readFileSync(scriptPath, 'utf8');
  const context = { window: {} };
  vm.runInNewContext(source, context, { filename: scriptPath });
  return context.window.AGENT_TOOLBELT_DATA;
}

function checkSamePageAnchors(html, label) {
  const ids = new Set(Array.from(html.matchAll(/\bid="([^"]+)"/g), (match) => match[1]));
  const links = Array.from(html.matchAll(/\bhref="#([^"#]+)"/g), (match) => match[1]);
  links.forEach((target) => assert(ids.has(target), `${label} has a broken same-page anchor: #${target}`));
  assert(links.includes('browse'), `${label} must keep the Browse all anchor: #browse`);
}

function check(outputDirectory, root = ROOT) {
  const output = path.resolve(outputDirectory);
  const requiredFiles = [
    'index.html', 'styles.css', 'app.js', 'data.js', 'brand-icon.svg',
    'favicon.svg', 'favicon-16.png', 'favicon-32.png', 'favicon-48.png'
  ];
  requiredFiles.forEach((file) => assert(fs.existsSync(path.join(output, file)), `missing generated portal file: ${file}`));
  const index = fs.readFileSync(path.join(output, 'index.html'), 'utf8');
  const styles = fs.readFileSync(path.join(output, 'styles.css'), 'utf8');
  const app = fs.readFileSync(path.join(output, 'app.js'), 'utf8');
  checkSamePageAnchors(index, 'generated portal index');
  const authoredIndex = fs.readFileSync(path.join(root, 'portal', 'src', 'index.html'), 'utf8');
  checkSamePageAnchors(authoredIndex, 'authored portal index');
  assert(index.includes('href="styles.css"'), 'index must reference styles.css');
  assert(index.includes('src="data.js"'), 'index must reference data.js');
  assert(index.includes('src="app.js"'), 'index must reference app.js');
  assert(index.includes('id="hosts"'), 'index must include host setup guidance');
  assert(index.includes('aria-labelledby="detail-title"'), 'dialog must label itself with detail-title');
  assert(index.includes('id="category-buckets"'), 'portal must include the guided category walkthrough');
  assert(index.includes('id="category-bucket-panel"'), 'portal must include the category bucket panel');
  assert(!/fetch\s*\(|\bimport\s*\(/.test(`${index}\n${styles}\n${app}`), 'portal runtime must not fetch or import remote data');
  assert(!/https?:\/\//.test(`${index}\n${styles}\n${app}`), 'portal shell must not depend on remote URLs');
  assert(!/https?:\/\//.test(index), 'portal index must not include remote assets');
  assert(styles.includes('.search-field'), 'portal must style the search control');
  assert(styles.includes('grid-column: 1 / -1'), 'search control should use a compact full-width row');
  const payload = readPayload(output);
  assert(payload && payload.skills && payload.workflows, 'generated data payload is incomplete');
  const canonical = discoverCanonicalSkills(root).skills;
  assert.strictEqual(payload.skills.length, 33, 'generated portal must contain 33 standard skills');
  assert.strictEqual(JSON.stringify(Array.from(payload.skills, (skill) => skill.id).sort()), JSON.stringify(canonical.map((skill) => skill.id).sort()), 'generated skill IDs must match canonical IDs');
  assert.strictEqual(payload.workflows.length, 6, 'generated portal must contain six workflows');
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
