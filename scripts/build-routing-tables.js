#!/usr/bin/env node
'use strict';

// Copy the task-to-skill table from commands/workflow-router.md into README.md.
//
// Usage: build-routing-tables.js [--check]
//
// The source file holds the table between this marker pair:
//   <!-- BEGIN routing table -->
//   <!-- END routing table -->
// README.md holds the same marker pair. The script replaces the text between the
// README markers with a generated notice and the source table.
// --check exits 1 when a marker is missing or a target is not current.

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SOURCE = 'commands/workflow-router.md';
const TARGETS = ['README.md'];

const BEGIN = '<!-- BEGIN routing table -->\n';
const END = '<!-- END routing table -->';
const BLOCK = /(<!-- BEGIN routing table -->\n)([\s\S]*?)(<!-- END routing table -->)/;
const NOTICE = `<!-- Generated from ${SOURCE} by scripts/build-routing-tables.js. Do not edit. -->\n\n`;

function readTable(root) {
  const text = fs.readFileSync(path.join(root, SOURCE), 'utf8');
  const match = text.match(BLOCK);
  if (!match) throw new Error(`${SOURCE}: routing table markers not found`);
  const table = match[2];
  if (!/^\| Task \| Shared owner \|\n/.test(table)) {
    throw new Error(`${SOURCE}: the routing table must start with the header "| Task | Shared owner |"`);
  }
  return table;
}

function build(root = ROOT) {
  const table = readTable(root);
  const errors = [];
  const changed = [];
  for (const name of TARGETS) {
    const filePath = path.join(root, name);
    const text = fs.readFileSync(filePath, 'utf8');
    if (!BLOCK.test(text)) {
      errors.push(`${name}: routing table markers not found`);
      continue;
    }
    const next = text.replace(BLOCK, () => `${BEGIN}${NOTICE}${table}${END}`);
    if (next !== text) changed.push({ filePath, name, text: next });
  }
  return { errors, changed };
}

function main() {
  const check = process.argv.includes('--check');
  let result;
  try {
    result = build(ROOT);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
    return;
  }
  const { errors, changed } = result;
  if (errors.length) {
    errors.forEach((error) => console.error(error));
    process.exitCode = 1;
    return;
  }
  if (check) {
    if (changed.length) {
      changed.forEach(({ name }) => console.error(`${name}: routing table is not current. Run node scripts/build-routing-tables.js.`));
      process.exitCode = 1;
      return;
    }
    console.log('Routing tables match commands/workflow-router.md.');
    return;
  }
  changed.forEach(({ filePath, text }) => fs.writeFileSync(filePath, text));
  console.log(`Updated ${changed.length} routing table copy(ies).`);
}

if (require.main === module) main();

module.exports = { build, readTable };
