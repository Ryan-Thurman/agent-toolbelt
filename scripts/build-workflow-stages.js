#!/usr/bin/env node
'use strict';

// Build the stage table in each workflows/*.md file from catalog/agent-toolbelt.json.
//
// Usage: build-workflow-stages.js [--check]
//
// A workflow file opts in with this marker pair:
//   <!-- BEGIN catalog stages: <workflow-id> -->
//   <!-- END catalog stages -->
// The script replaces the text between the markers with the stages of that catalog workflow.
// --check exits 1 when a marker names an unknown workflow or a table is not current.

const fs = require('fs');
const path = require('path');
const { ROOT, loadCatalog } = require('./catalog-lib');

const BLOCK = /(<!-- BEGIN catalog stages: ([a-z0-9-]+) -->\n)([\s\S]*?)(<!-- END catalog stages -->)/g;

function code(id) {
  return `\`${id}\``;
}

function renderStages(workflow) {
  const lines = [
    '<!-- Generated from catalog/agent-toolbelt.json by scripts/build-workflow-stages.js. Do not edit. -->',
    '',
    '| Stage | Skill | Purpose | Next |',
    '| --- | --- | --- | --- |'
  ];
  workflow.stages.forEach((stage, index) => {
    lines.push(`| ${index + 1} | ${code(stage.skill)} | ${stage.rationale} | ${stage.next_steps.map(code).join(', ')} |`);
  });
  return `${lines.join('\n')}\n`;
}

function build(root = ROOT) {
  const workflows = new Map(loadCatalog(root).workflows.map((workflow) => [workflow.id, workflow]));
  const directory = path.join(root, 'workflows');
  const errors = [];
  const changed = [];
  for (const name of fs.readdirSync(directory).filter((file) => file.endsWith('.md')).sort()) {
    const filePath = path.join(directory, name);
    const text = fs.readFileSync(filePath, 'utf8');
    const next = text.replace(BLOCK, (match, begin, id, body, end) => {
      const workflow = workflows.get(id);
      if (!workflow) {
        errors.push(`workflows/${name}: unknown catalog workflow ${id}`);
        return match;
      }
      return `${begin}${renderStages(workflow)}${end}`;
    });
    if (next !== text) changed.push({ filePath, name, text: next });
  }
  return { errors, changed };
}

function main() {
  const check = process.argv.includes('--check');
  const { errors, changed } = build(ROOT);
  if (errors.length) {
    errors.forEach((error) => console.error(error));
    process.exitCode = 1;
    return;
  }
  if (check) {
    if (changed.length) {
      changed.forEach(({ name }) => console.error(`workflows/${name}: stage table is not current. Run node scripts/build-workflow-stages.js.`));
      process.exitCode = 1;
      return;
    }
    console.log('Workflow stage tables match the catalog.');
    return;
  }
  changed.forEach(({ filePath, text }) => fs.writeFileSync(filePath, text));
  console.log(`Updated ${changed.length} workflow stage table(s).`);
}

if (require.main === module) main();

module.exports = { build, renderStages };
