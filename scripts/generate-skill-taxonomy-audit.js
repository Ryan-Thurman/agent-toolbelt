#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { ROOT, discoverCanonicalSkills, loadCatalog } = require('./catalog-lib');

function cell(value) {
  return String(value == null ? '' : value).replace(/\|/g, '\\|').replace(/\r?\n/g, ' ').trim();
}

function list(values) {
  if (!values || values.length === 0) return 'None recorded';
  return values.map(cell).join('<br>');
}

function render(root = ROOT) {
  const catalog = loadCatalog(root);
  const canonicalResult = discoverCanonicalSkills(root);
  if (canonicalResult.errors.length) throw new Error(canonicalResult.errors.join('; '));
  const canonical = new Map(canonicalResult.skills.map((skill) => [skill.id, skill]));
  const workflows = new Map(catalog.workflows.map((workflow) => [workflow.id, workflow]));
  const hostRecords = catalog.catalog.host_compatibility.hosts;
  const hosts = hostRecords.map((host) => `${host.name}: ${host.invocation_template.replace('{skill_id}', 'skill-name')}`);
  const lines = [
    '<!-- GENERATED FILE: run scripts/generate-skill-taxonomy-audit.js to update. -->',
    '',
    '# Agent Toolbelt skill taxonomy audit',
    '',
    `This generated audit covers **${canonicalResult.skills.length} canonical skills** from \`skills/*/SKILL.md\`.`,
    `The companion catalog defines **${catalog.catalog.categories.length} categories**, **${catalog.workflows.length} workflows**, and central host compatibility for ${list(hosts)}.`,
    '',
    'Commands, hooks, installers, build helpers, and internal copies are compatibility/tooling surfaces; they are not native plugin skills.',
    '',
    '| Skill | Category | Primary purpose | Typical trigger/user intent | Related skills | workflow(s) | host compatibility | documentation completeness | recommended changes |',
    '| --- | --- | --- | --- | --- | --- | --- | --- | --- |'
  ];
  for (const entry of catalog.skills) {
    const skill = canonical.get(entry.id);
    const workflowNames = entry.workflow_membership.map((id) => workflows.get(id) ? workflows.get(id).name : id);
    const docs = entry.documentation_completeness;
    const docSummary = `${docs.status}: ${docs.notes}`;
    lines.push(`| ${cell(skill.display_name)} (${cell(entry.id)}) | ${cell(entry.category)} | ${cell(entry.primary_purpose)} | ${list(entry.use_when)} | ${list(entry.related_skills)} | ${list(workflowNames)} | ${list(hosts)} | ${cell(docSummary)} | ${list(entry.recommended_changes)} |`);
  }
  lines.push('', '## Workflow index', '', '| Workflow | Purpose | Stages |', '| --- | --- | --- |');
  for (const workflow of catalog.workflows) {
    const stages = workflow.stages.map((stage) => `${stage.skill}: ${stage.rationale}`);
    lines.push(`| ${cell(workflow.name)} (${cell(workflow.id)}) | ${cell(workflow.purpose)} | ${list(stages)} |`);
  }
  lines.push('', '## Compatibility and tooling audit', '', '| Surface | Paths | Kind | Lifecycle | Native skill surface | Purpose | Recommendation |', '| --- | --- | --- | --- | --- | --- | --- |');
  for (const entry of catalog.tooling_audit) {
    const paths = [...(entry.paths || []).map((item) => `\`${item}\``), ...(entry.absent_paths || []).map((item) => `absent: \`${item}\``)];
    lines.push(`| ${cell(entry.label)} | ${list(paths)} | ${cell(entry.kind)} | ${cell(entry.lifecycle)} | ${entry.native_skill_surface ? 'Yes' : 'No'} | ${cell(entry.purpose)} | ${cell(entry.recommendation)} |`);
  }
  lines.push('', '## Canonical metadata derived for this audit', '', '| Skill | Canonical description | Display name | Short description | Default prompt |', '| --- | --- | --- | --- | --- |');
  for (const skill of canonicalResult.skills) {
    lines.push(`| ${cell(skill.id)} | ${cell(skill.description)} | ${cell(skill.display_name)} | ${cell(skill.short_description)} | ${cell(skill.default_prompt)} |`);
  }
  lines.push('');
  return `${lines.join('\n')}`;
}

function isCurrent(root = ROOT, output = path.join(root, 'docs', 'skill-taxonomy-audit.md')) {
  try {
    return fs.readFileSync(output, 'utf8') === render(root);
  } catch (_) {
    return false;
  }
}

function main() {
  const check = process.argv.includes('--check');
  const output = path.join(ROOT, 'docs', 'skill-taxonomy-audit.md');
  let generated;
  try {
    generated = render(ROOT);
  } catch (error) {
    console.error(`Audit generation failed: ${error.message}`);
    process.exitCode = 1;
    return;
  }
  if (check) {
    if (!isCurrent(ROOT, output)) {
      console.error(`Generated audit is stale or missing: ${path.relative(ROOT, output)}`);
      process.exitCode = 1;
      return;
    }
    console.log(`Generated audit is current: ${path.relative(ROOT, output)}`);
    return;
  }
  fs.writeFileSync(output, generated);
  console.log(`Generated ${path.relative(ROOT, output)} from the canonical skill tree and catalog.`);
}

if (require.main === module) main();

module.exports = { isCurrent, render };
