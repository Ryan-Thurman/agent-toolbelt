#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

function isPrivatePath(name) {
  const parts = name.split('/');
  const base = parts[parts.length - 1];
  if (/^(docs|evals|notes|repos|\.atb-work)(\/|$)/.test(name) || name === 'roadmap.md') return true;
  if (/(^|\/)benchmarks\/(results\.md|eval-ledger\.jsonl)$/.test(name)) return true;
  if (/^\.env(?:\.|$)/.test(base) && !/^\.env(?:\..+)?\.(example|template)$/.test(base)) return true;
  if (parts.some((part) => ['.aws', '.ssh', '.auth'].includes(part))) return true;
  return /\.(pem|key|p12|pfx|log|sqlite|sqlite3|db)$/.test(base) || /^id_(rsa|ed25519|ecdsa)$/.test(base);
}

function privatePaths(paths) {
  return paths.filter(isPrivatePath);
}

function trackedPrivatePaths(root) {
  const result = spawnSync('git', ['ls-files', '-z'], {
    cwd: root, encoding: 'utf8',
  });
  if (result.error || result.status !== 0) throw new Error('Cannot inspect the Git index for private content.');
  return privatePaths(result.stdout.split('\0').filter(Boolean));
}

function checkPackage(root) {
  const leaked = [];
  function visit(directory, prefix = '') {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const relative = prefix ? `${prefix}/${entry.name}` : entry.name;
      if (isPrivatePath(relative)) leaked.push(relative);
      else if (entry.isDirectory()) visit(path.join(directory, entry.name), relative);
    }
  }
  visit(root);
  if (leaked.length) throw new Error(`Package contains private content: ${leaked.join(', ')}`);
}

function main() {
  if (process.argv[2] === '--package') {
    if (!process.argv[3]) throw new Error('--package requires a directory');
    checkPackage(path.resolve(process.argv[3]));
    console.log('Package content check passed: private reports and credential artifacts are excluded.');
    return;
  }
  const root = path.resolve(process.argv[2] || path.join(__dirname, '..'));
  const leaked = trackedPrivatePaths(root);
  if (leaked.length) throw new Error(`Git index contains private content: ${leaked.join(', ')}`);
  console.log('Public content check passed: private reports and credential artifacts are absent from the Git index.');
}

if (require.main === module) {
  try { main(); } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

module.exports = { privatePaths, trackedPrivatePaths, checkPackage };
