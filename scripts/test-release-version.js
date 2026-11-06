#!/usr/bin/env node
'use strict';

const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');
const { compareVersions, checkReleaseVersion } = require('./check-release-version');

assert.strictEqual(compareVersions('1.10.0', '1.9.9'), 1);
assert.strictEqual(compareVersions('2.0.0', '1.99.99'), 1);
assert.strictEqual(compareVersions('1.0.0', '1.0.0'), 0);
assert.strictEqual(compareVersions('0.9.0', '1.0.0'), -1);
for (const version of ['01.0.0', 'v1.0.0', '1.0', '1.0.0-rc.1', '1.0.0+build', '1.0.0\nversion_increased=true', undefined]) {
  assert.throws(() => compareVersions(version, '1.0.0'), /stable major\.minor\.patch/);
}

const root = fs.mkdtempSync(path.join(os.tmpdir(), 'toolbelt-release-gate-'));
function git(...args) {
  return execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
}
function commit(message) {
  git('add', '--all');
  git('commit', '--quiet', '-m', message);
  return git('rev-parse', 'HEAD');
}
function setVersion(version, changelogVersion = version) {
  fs.mkdirSync(path.join(root, '.cursor-plugin'), { recursive: true });
  fs.writeFileSync(path.join(root, '.cursor-plugin/plugin.json'), JSON.stringify({ version }) + '\n');
  fs.writeFileSync(path.join(root, 'CHANGELOG.md'), `# Changelog\n\n## Unreleased\n\n## v${changelogVersion} - 2026-11-06\n\n- Release notes.\n`);
}

try {
  git('init', '--quiet', '--initial-branch=main');
  git('config', 'user.name', 'Portal release tests');
  git('config', 'user.email', 'portal-tests@example.invalid');
  git('config', 'commit.gpgsign', 'false');
  git('config', 'core.hooksPath', path.join(root, 'empty-hooks'));

  fs.writeFileSync(path.join(root, 'CHANGELOG.md'), '# Changelog\n\n## v0.2.0 - 2026-07-07\n');
  const legacy = commit('Legacy release without plugin manifests');
  setVersion('1.0.0');
  const first = commit('Add the versioned plugin');
  assert.deepStrictEqual(checkReleaseVersion(root, legacy, first), {
    version_increased: 'true', previous_version: '0.2.0', version: '1.0.0'
  });
  assert.strictEqual(checkReleaseVersion(root, '0'.repeat(40), first).version_increased, 'true');

  fs.writeFileSync(path.join(root, 'portal.txt'), 'Ordinary portal update.\n');
  const ordinary = commit('Change the portal without a release');
  assert.strictEqual(checkReleaseVersion(root, first, ordinary).version_increased, 'false');

  setVersion('1.0.1');
  const patch = commit('Bump the patch version');
  assert.strictEqual(checkReleaseVersion(root, ordinary, patch).version_increased, 'true');
  fs.appendFileSync(path.join(root, 'portal.txt'), 'Another commit in the same push.\n');
  const tip = commit('Finish the release');
  assert.strictEqual(checkReleaseVersion(root, ordinary, tip).version_increased, 'true', 'compare the complete push, not only the last commit');
  assert.strictEqual(checkReleaseVersion(root, patch, tip).version_increased, 'false');

  const output = path.join(root, 'github-output');
  const cli = spawnSync(process.execPath, [path.join(__dirname, 'check-release-version.js')], {
    cwd: root,
    encoding: 'utf8',
    env: { ...process.env, RELEASE_BEFORE_SHA: ordinary, RELEASE_AFTER_SHA: tip, GITHUB_OUTPUT: output }
  });
  assert.strictEqual(cli.status, 0, cli.stderr);
  assert.strictEqual(fs.readFileSync(output, 'utf8'), 'version_increased=true\nprevious_version=1.0.0\nversion=1.0.1\n');

  setVersion('1.0.2', '1.0.1');
  const noNotes = commit('Omit the release notes');
  assert.throws(() => checkReleaseVersion(root, tip, noNotes), /release heading for 1\.0\.2/);

  setVersion('1.0.0');
  const decreased = commit('Decrease the version');
  assert.throws(() => checkReleaseVersion(root, tip, decreased), /decreased/);

  setVersion('1.0.3-rc.1');
  const prerelease = commit('Use a prerelease version');
  assert.throws(() => checkReleaseVersion(root, tip, prerelease), /stable major\.minor\.patch/);

  fs.rmSync(path.join(root, '.cursor-plugin/plugin.json'));
  const missing = commit('Remove the release manifest');
  assert.throws(() => checkReleaseVersion(root, tip, missing), /No release version/);

  git('checkout', '--quiet', '--detach', first);
  setVersion('2.0.0');
  const unrelated = commit('Create a divergent history');
  assert.throws(() => checkReleaseVersion(root, tip, unrelated), /must be an ancestor/);
  assert.throws(() => checkReleaseVersion(root, '--all', tip), /full Git commit IDs/);
  assert.throws(() => checkReleaseVersion(root, first, '0'.repeat(40)), /cannot be empty/);
  assert.throws(() => checkReleaseVersion(root, 'f'.repeat(40), tip));

  const rejectedOutput = path.join(root, 'rejected-output');
  const rejected = spawnSync(process.execPath, [path.join(__dirname, 'check-release-version.js')], {
    cwd: root,
    encoding: 'utf8',
    env: { ...process.env, RELEASE_BEFORE_SHA: tip, RELEASE_AFTER_SHA: decreased, GITHUB_OUTPUT: rejectedOutput }
  });
  assert.strictEqual(rejected.status, 1);
  assert(!fs.existsSync(rejectedOutput), 'a rejected version must not produce deployment outputs');
} finally {
  fs.rmSync(root, { recursive: true, force: true });
}

console.log('Release gate checks passed: ordinary pushes, version increases, legacy releases, release notes, rejected versions, history, and workflow outputs.');
