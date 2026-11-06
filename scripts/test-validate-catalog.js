#!/usr/bin/env node
'use strict';

const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { validate } = require('./validate-catalog');
const { isCurrent, render } = require('./generate-skill-taxonomy-audit');

const REPO_ROOT = path.resolve(__dirname, '..');

function makeFixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-toolbelt-catalog-'));
  fs.cpSync(path.join(REPO_ROOT, 'skills'), path.join(root, 'skills'), { recursive: true });
  fs.mkdirSync(path.join(root, 'catalog'), { recursive: true });
  const catalog = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, 'catalog', 'agent-toolbelt.json'), 'utf8'));
  fs.copyFileSync(path.join(REPO_ROOT, 'catalog', 'agent-toolbelt.json'), path.join(root, 'catalog', 'agent-toolbelt.json'));
  for (const entry of catalog.tooling_audit) {
    for (const relativePath of entry.paths || []) {
      const target = path.join(root, relativePath);
      if (fs.existsSync(path.join(REPO_ROOT, relativePath)) && fs.statSync(path.join(REPO_ROOT, relativePath)).isDirectory()) {
        fs.mkdirSync(target, { recursive: true });
      } else {
        fs.mkdirSync(path.dirname(target), { recursive: true });
        fs.writeFileSync(target, 'fixture path\n');
      }
    }
  }
  fs.mkdirSync(path.join(root, 'docs'), { recursive: true });
  return root;
}

function catalogPath(root) {
  return path.join(root, 'catalog', 'agent-toolbelt.json');
}

function readCatalog(root) {
  return JSON.parse(fs.readFileSync(catalogPath(root), 'utf8'));
}

function writeCatalog(root, catalog) {
  fs.writeFileSync(catalogPath(root), JSON.stringify(catalog, null, 2));
}

function expectValidationFailure(label, mutate, pattern) {
  const root = makeFixture();
  try {
    mutate(root);
    const errors = validate(root);
    assert(errors.some((error) => pattern.test(error)), `${label}: expected ${pattern}, got ${errors.join('; ')}`);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}

{
  const root = makeFixture();
  try {
    const localPaths = ['.cursor/rules', 'notes', 'repos'];
    for (const relativePath of localPaths) {
      assert(!fs.existsSync(path.join(root, relativePath)), `${relativePath} must be absent from the clean fixture`);
    }
    assert.deepStrictEqual(validate(root), [], 'catalog must validate without local maintainer directories');
    for (const relativePath of localPaths) fs.mkdirSync(path.join(root, relativePath), { recursive: true });
    assert.deepStrictEqual(validate(root), [], 'local maintainer directories must remain optional when present');
    assert(render(root).includes('optional: `notes`'), 'audit must label optional paths');
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}

expectValidationFailure(
  'optional path outside repository',
  (root) => { const c = readCatalog(root); c.tooling_audit[0].optional_paths = ['../outside']; writeCatalog(root, c); },
  /optional path escapes repository root/
);

expectValidationFailure(
  'malformed optional paths',
  (root) => { const c = readCatalog(root); c.tooling_audit[0].optional_paths = 'notes'; writeCatalog(root, c); },
  /optional_paths must be an array/
);

expectValidationFailure(
  'missing canonical skill',
  (root) => fs.rmSync(path.join(root, 'skills', 'cover'), { recursive: true }),
  /catalog skill is not canonical: cover/
);

expectValidationFailure(
  'nonexistent catalog skill',
  (root) => { const c = readCatalog(root); c.skills[0].id = 'not-a-real-skill'; writeCatalog(root, c); },
  /catalog skill is not canonical: not-a-real-skill/
);

expectValidationFailure(
  'duplicate skill IDs',
  (root) => { const c = readCatalog(root); c.skills[1].id = c.skills[0].id; writeCatalog(root, c); },
  /duplicate skill IDs/
);

expectValidationFailure(
  'duplicate aliases',
  (root) => { const c = readCatalog(root); c.skills[0].aliases = ['shared-alias']; c.skills[1].aliases = ['shared-alias']; writeCatalog(root, c); },
  /duplicate aliases/
);

expectValidationFailure(
  'broken related skill',
  (root) => { const c = readCatalog(root); c.skills[0].related_skills.push('missing-skill'); writeCatalog(root, c); },
  /broken related skill reference/
);

expectValidationFailure(
  'broken workflow membership',
  (root) => { const c = readCatalog(root); c.skills[0].workflow_membership.push('missing-workflow'); writeCatalog(root, c); },
  /broken workflow reference/
);

expectValidationFailure(
  'broken workflow stage reference',
  (root) => { const c = readCatalog(root); c.workflows[0].stages[0].skill = 'missing-skill'; writeCatalog(root, c); },
  /broken skill reference/
);

expectValidationFailure(
  'broken workflow next step',
  (root) => { const c = readCatalog(root); c.workflows[0].stages[0].next_steps = ['missing-skill']; writeCatalog(root, c); },
  /next_steps must reference canonical skills/
);

expectValidationFailure(
  'empty required scalar',
  (root) => { const c = readCatalog(root); c.skills[0].primary_purpose = '   '; writeCatalog(root, c); },
  /primary_purpose must be a non-empty string/
);

expectValidationFailure(
  'empty required array',
  (root) => { const c = readCatalog(root); c.skills[0].tags = []; writeCatalog(root, c); },
  /tags must be an array of non-empty strings with at least one item/
);

expectValidationFailure(
  'unsupported host claim',
  (root) => { const c = readCatalog(root); c.skills[0].host_compatibility = { hosts: ['unsupported-host'] }; writeCatalog(root, c); },
  /unsupported host claim/
);

expectValidationFailure(
  'invalid host invocation template',
  (root) => { const c = readCatalog(root); c.catalog.host_compatibility.hosts[0].invocation_template = '/skill-name'; writeCatalog(root, c); },
  /invocation_template must contain \{skill_id\}/
);

expectValidationFailure(
  'unused discovery tag',
  (root) => { const c = readCatalog(root); c.catalog.discovery_tags.push('unused-tag'); writeCatalog(root, c); },
  /catalog discovery tag is unused/
);

expectValidationFailure(
  'missing category guidance',
  (root) => { const c = readCatalog(root); delete c.catalog.category_guidance['Agent Operations']; writeCatalog(root, c); },
  /category_guidance must cover each category exactly once/
);

expectValidationFailure(
  'empty category guidance',
  (root) => { const c = readCatalog(root); c.catalog.category_guidance['Agent Operations'] = ' '; writeCatalog(root, c); },
  /category guidance Agent Operations: must be a non-empty string/
);

expectValidationFailure(
  'missing tooling path',
  (root) => { const c = readCatalog(root); c.tooling_audit[0].paths.push('missing-tooling-path'); writeCatalog(root, c); },
  /required path is missing/
);

expectValidationFailure(
  'deprecated path restored',
  (root) => { const c = readCatalog(root); c.tooling_audit.find((entry) => entry.id === 'legacy-root-hooks').absent_paths.push('skills'); writeCatalog(root, c); },
  /intentionally absent path exists/
);

expectValidationFailure(
  'project lifecycle path restored',
  (root) => { fs.writeFileSync(path.join(root, 'commands', 'feature-start.md'), 'retired project command\n'); },
  /intentionally absent path exists/
);

expectValidationFailure(
  'wrong canonical count',
  (root) => {
    const c = readCatalog(root);
    c.skills = c.skills.filter((skill) => skill.id !== 'cover');
    fs.rmSync(path.join(root, 'skills', 'cover'), { recursive: true });
    writeCatalog(root, c);
  },
  /canonical skill count is 28; expected 29/
);

expectValidationFailure(
  'malformed schema version',
  (root) => { const c = readCatalog(root); c.schema_version = 2; writeCatalog(root, c); },
  /schema_version must be 1/
);

expectValidationFailure(
  'duplicate expected outputs',
  (root) => { const c = readCatalog(root); c.skills[0].expected_outputs[1] = c.skills[0].expected_outputs[0]; writeCatalog(root, c); },
  /duplicate expected_outputs/
);

expectValidationFailure(
  'duplicate tags',
  (root) => { const c = readCatalog(root); c.skills[0].tags[1] = c.skills[0].tags[0]; writeCatalog(root, c); },
  /duplicate tags/
);

expectValidationFailure(
  'duplicate example prompts',
  (root) => { const c = readCatalog(root); c.skills[0].example_prompts[1] = c.skills[0].example_prompts[0]; writeCatalog(root, c); },
  /duplicate example_prompts/
);

expectValidationFailure(
  'duplicate related skills',
  (root) => { const c = readCatalog(root); c.skills[0].related_skills[1] = c.skills[0].related_skills[0]; writeCatalog(root, c); },
  /duplicate related_skills/
);

expectValidationFailure(
  'duplicate workflow membership',
  (root) => { const c = readCatalog(root); c.skills.find((skill) => skill.id === 'code-quality-gate').workflow_membership.push('feature-delivery'); writeCatalog(root, c); },
  /duplicate workflow_membership/
);

expectValidationFailure(
  'duplicate workflow next step',
  (root) => { const c = readCatalog(root); c.workflows[0].stages[0].next_steps.push(c.workflows[0].stages[0].next_steps[0]); writeCatalog(root, c); },
  /duplicate next_steps/
);

expectValidationFailure(
  'duplicate workflow stage skill',
  (root) => { const c = readCatalog(root); c.workflows[0].stages[1].skill = c.workflows[0].stages[0].skill; writeCatalog(root, c); },
  /duplicate stage skill IDs/
);

{
  const root = makeFixture();
  try {
    const auditPath = path.join(root, 'docs', 'skill-taxonomy-audit.md');
    fs.writeFileSync(auditPath, `${render(root)}stale\n`);
    assert.strictEqual(isCurrent(root, auditPath), false, 'stale audit should fail freshness check');
    fs.writeFileSync(auditPath, render(root));
    assert.strictEqual(isCurrent(root, auditPath), true, 'fresh audit should pass freshness check');
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}

{
  const root = makeFixture();
  try {
    const skillPath = path.join(root, 'skills', 'cover', 'SKILL.md');
    fs.writeFileSync(skillPath, fs.readFileSync(skillPath, 'utf8').replace(/^---\n/, '---broken\n'));
    assert.throws(() => render(root), /expected YAML frontmatter/);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}

console.log('Catalog negative tests passed: required metadata, references, duplicates, hosts, count, and audit freshness/generation failures are detected.');
