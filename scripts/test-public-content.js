#!/usr/bin/env node
'use strict';

const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const { privatePaths, trackedPrivatePaths, checkPackage } = require('./check-public-content');

const root = path.resolve(__dirname, '..');
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-toolbelt-public-content-'));

function run(command, args, cwd) {
  const result = spawnSync(command, args, { cwd, encoding: 'utf8' });
  assert.strictEqual(result.status, 0, result.stderr || result.stdout);
}

function write(rootPath, name, content) {
  const target = path.join(rootPath, name);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content);
}

try {
  const source = path.join(temp, 'source');
  fs.mkdirSync(source);
  run('git', ['init', '-q'], source);
  write(source, '.gitignore', '/docs/\n/evals/\n');
  write(source, 'docs/private.md', 'Private maintainer document.\n');
  write(source, 'evals/private.json', '{"private":true}\n');
  write(source, 'skills/sample/SKILL.md', '# Runtime skill\n');
  write(source, 'shared/contracts/references/runtime.md', '# Required runtime reference\n');
  write(source, '.cursor-plugin/plugin.json', fs.readFileSync(path.join(root, '.cursor-plugin/plugin.json')));
  fs.copyFileSync(path.join(root, 'build-cursor-plugin.sh'), path.join(source, 'build-cursor-plugin.sh'));
  write(source, 'scripts/check-public-content.js', fs.readFileSync(path.join(root, 'scripts/check-public-content.js')));
  for (const name of ['templates', 'workflows', 'examples']) fs.mkdirSync(path.join(source, name));

  run('git', ['add', '.gitignore', 'skills'], source);
  assert.deepStrictEqual(trackedPrivatePaths(source), [], 'ignored private files should remain local');
  run('git', ['add', '--force', 'docs/private.md', 'evals/private.json'], source);
  assert.deepStrictEqual(trackedPrivatePaths(source).sort(), ['docs/private.md', 'evals/private.json']);
  run('git', ['rm', '--cached', '--', 'docs/private.md', 'evals/private.json'], source);
  assert.deepStrictEqual(trackedPrivatePaths(source), [], 'removal from the index must restore the publication boundary');

  const privateExamples = ['.env', 'nested/.env.local', '.aws/credentials', 'keys/private.pem',
    'id_ed25519', 'debug.log', 'queue.sqlite', 'skills/sample/benchmarks/results.md',
    'skills/sample/benchmarks/eval-ledger.jsonl', 'notes/report.md', 'roadmap.md'];
  assert.deepStrictEqual(privatePaths(privateExamples), privateExamples);
  assert.deepStrictEqual(privatePaths(['.env.example', '.env.local.template',
    'skills/sample/references/method.md', 'skills/sample/benchmarks/style-contract/cases.md']), []);
  write(source, 'nested/.env.local', 'TOKEN=synthetic-test-value\n');
  run('git', ['add', '--force', 'nested/.env.local'], source);
  assert.deepStrictEqual(trackedPrivatePaths(source), ['nested/.env.local']);
  run('git', ['rm', '--cached', '--', 'nested/.env.local'], source);

  const output = path.join(temp, 'package');
  run('bash', [path.join(source, 'build-cursor-plugin.sh'), output], source);
  checkPackage(output);
  assert(fs.existsSync(path.join(output, 'skills/sample/SKILL.md')));
  assert(fs.existsSync(path.join(output, 'shared/contracts/references/runtime.md')));
  write(source, 'skills/sample/.env', 'TOKEN=synthetic-test-value\n');
  const rejected = spawnSync('bash', [path.join(source, 'build-cursor-plugin.sh'), output], { cwd: source, encoding: 'utf8' });
  assert.notStrictEqual(rejected.status, 0, 'a credential file inside a copied skill must block the build');
  assert(rejected.stderr.includes('private content'));
  fs.rmSync(path.join(source, 'skills/sample/.env'));
  run('bash', [path.join(source, 'build-cursor-plugin.sh'), output], source);
  fs.mkdirSync(path.join(output, 'docs'));
  assert.throws(() => checkPackage(output), /private content/);
  fs.rmSync(path.join(output, 'docs'), { recursive: true });
  fs.mkdirSync(path.join(output, 'evals'));
  assert.throws(() => checkPackage(output), /private content/);
  console.log('Public content tests passed: ignored files, forced additions, index removal, and actual package exclusion.');
} finally {
  fs.rmSync(temp, { recursive: true, force: true });
}
