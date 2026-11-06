#!/usr/bin/env node
'use strict';

const fs = require('fs');
const { execFileSync } = require('child_process');

const VERSION_PATH = '.cursor-plugin/plugin.json';
const STABLE_VERSION = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;
const COMMIT_ID = /^(?:[a-f0-9]{40}|[a-f0-9]{64})$/;

function compareVersions(current, previous) {
  for (const version of [current, previous]) {
    if (typeof version !== 'string' || !STABLE_VERSION.test(version)) {
      throw new Error(`Expected a stable major.minor.patch version, received: ${version}`);
    }
  }
  const left = current.split('.').map(BigInt);
  const right = previous.split('.').map(BigInt);
  for (let index = 0; index < left.length; index += 1) {
    if (left[index] !== right[index]) return left[index] > right[index] ? 1 : -1;
  }
  return 0;
}

function git(root, args) {
  return execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
}

function readAt(root, ref, file) {
  try {
    return git(root, ['show', `${ref}:${file}`]);
  } catch (error) {
    if (error.status === 128) return null;
    throw error;
  }
}

function versionAt(root, ref, allowChangelog) {
  const manifest = readAt(root, ref, VERSION_PATH);
  if (manifest !== null) {
    const version = JSON.parse(manifest).version;
    compareVersions(version, version);
    return version;
  }
  // Older releases did not have native plugin manifests.
  if (allowChangelog) {
    const changelog = readAt(root, ref, 'CHANGELOG.md') || '';
    const match = changelog.match(/^## v?(\d+\.\d+\.\d+)(?:\s|$)/m);
    if (match) {
      compareVersions(match[1], match[1]);
      return match[1];
    }
  }
  throw new Error(`No release version found at ${ref}`);
}

function checkReleaseVersion(root, before, after) {
  for (const ref of [before, after]) {
    if (!COMMIT_ID.test(ref || '')) throw new Error('Release comparisons require full Git commit IDs.');
  }
  if (/^0+$/.test(after)) throw new Error('The current commit cannot be empty.');
  git(root, ['cat-file', '-e', `${after}^{commit}`]);
  const initialPush = /^0+$/.test(before);
  if (!initialPush) {
    git(root, ['cat-file', '-e', `${before}^{commit}`]);
    try {
      git(root, ['merge-base', '--is-ancestor', before, after]);
    } catch {
      throw new Error('The previous commit must be an ancestor of the current commit.');
    }
  }
  const previous = initialPush ? '0.0.0' : versionAt(root, before, true);
  const version = versionAt(root, after, false);
  const comparison = compareVersions(version, previous);
  if (comparison < 0) throw new Error(`Release version decreased from ${previous} to ${version}.`);
  if (comparison > 0) {
    const changelog = readAt(root, after, 'CHANGELOG.md') || '';
    const heading = new RegExp(`^## v?${version.replace(/\./g, '\\.')}[ \\t]*(?:-|$)`, 'm');
    if (!heading.test(changelog)) throw new Error(`CHANGELOG.md needs a release heading for ${version}.`);
  }
  return { version_increased: String(comparison > 0), previous_version: previous, version };
}

function main() {
  const result = checkReleaseVersion(process.cwd(), process.env.RELEASE_BEFORE_SHA, process.env.RELEASE_AFTER_SHA);
  if (process.env.GITHUB_OUTPUT) {
    fs.appendFileSync(process.env.GITHUB_OUTPUT, Object.entries(result).map(([key, value]) => `${key}=${value}\n`).join(''));
  }
  console.log(result.version_increased === 'true'
    ? `Release version increased: ${result.previous_version} → ${result.version}`
    : `Release version remains ${result.version}; Pages publication is skipped.`);
}

if (require.main === module) {
  try { main(); } catch (error) {
    console.error(`Release version check failed: ${error.message}`);
    process.exitCode = 1;
  }
}

module.exports = { STABLE_VERSION, compareVersions, checkReleaseVersion };
