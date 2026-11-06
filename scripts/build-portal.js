#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { ROOT, discoverCanonicalSkills, loadCatalog } = require('./catalog-lib');
const { validate } = require('./validate-catalog');

const REPOSITORY_URL = 'https://github.com/Ryan-Thurman/agent-toolbelt';
const SOURCE_FILES = [
  'index.html', 'styles.css', 'app.js', 'brand-icon.svg',
  'favicon.svg', 'favicon-16.png', 'favicon-32.png', 'favicon-48.png'
];

function prepareOutputDirectory(output, generatedFiles) {
  let outputStat = null;
  try { outputStat = fs.lstatSync(output); } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  if (outputStat) {
    if (outputStat.isSymbolicLink()) throw new Error(`Refusing symlink generated output directory: ${output}`);
    if (!outputStat.isDirectory()) throw new Error(`Generated output path is not a directory: ${output}`);
  } else {
    fs.mkdirSync(output, { recursive: true });
  }
  for (const file of generatedFiles) {
    const filePath = path.join(output, file);
    let fileStat = null;
    try { fileStat = fs.lstatSync(filePath); } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
    if (!fileStat) continue;
    if (fileStat.isSymbolicLink()) throw new Error(`Refusing symlink generated file: ${filePath}`);
    if (!fileStat.isFile()) throw new Error(`Generated file path is not a file: ${filePath}`);
    fs.unlinkSync(filePath);
  }
}

function normalizePortalPayload(root = ROOT) {
  const errors = validate(root);
  if (errors.length) throw new Error(`Catalog validation failed before portal build:\n${errors.join('\n')}`);
  const catalog = loadCatalog(root);
  const canonicalResult = discoverCanonicalSkills(root);
  const canonicalById = new Map(canonicalResult.skills.map((skill) => [skill.id, skill]));
  const hostPolicy = catalog.catalog.host_compatibility;
  const skills = catalog.skills.map((entry) => {
    const canonical = canonicalById.get(entry.id);
    return {
      id: entry.id,
      display_name: canonical.display_name,
      short_description: canonical.short_description,
      default_prompt: canonical.default_prompt,
      description: canonical.description,
      category: entry.category,
      tags: entry.tags,
      primary_purpose: entry.primary_purpose,
      use_when: entry.use_when,
      avoid_when: entry.avoid_when,
      preferred_context: entry.preferred_context,
      expected_outputs: entry.expected_outputs,
      example_prompts: entry.example_prompts,
      related_skills: entry.related_skills,
      workflow_membership: entry.workflow_membership,
      documentation_completeness: entry.documentation_completeness,
      recommended_changes: entry.recommended_changes,
      source_path: canonical.skill_path,
      source_url: `${REPOSITORY_URL}/blob/main/${canonical.skill_path}`
    };
  });
  return {
    generated_from: 'catalog/agent-toolbelt.json + skills/*/SKILL.md + skills/*/agents/openai.yaml',
    repository_url: REPOSITORY_URL,
    title: catalog.catalog.display_name,
    description: catalog.catalog.description,
    categories: catalog.catalog.categories,
    category_guidance: catalog.catalog.category_guidance,
    discovery_tags: catalog.catalog.discovery_tags,
    hosts: hostPolicy.hosts,
    native_skill_surface: hostPolicy.native_skill_surface,
    workflow_membership_note: hostPolicy.workflow_membership_note,
    surface_note: catalog.catalog.surface_note,
    skills,
    workflows: catalog.workflows,
    tooling_audit: catalog.tooling_audit
  };
}

function build(outputDirectory, root = ROOT) {
  const sourceDirectory = path.join(root, 'portal', 'src');
  const output = path.resolve(outputDirectory || path.join(root, 'portal', 'generated'));
  const payload = normalizePortalPayload(root);
  if ([path.resolve(root), path.resolve(path.join(root, 'portal')), path.resolve(sourceDirectory)].includes(output)) {
    throw new Error('Refusing to use the repository root, portal directory, or portal source directory as generated output');
  }
  for (const sourceFile of SOURCE_FILES) {
    if (!fs.existsSync(path.join(sourceDirectory, sourceFile))) throw new Error(`Missing portal source: portal/src/${sourceFile}`);
  }
  prepareOutputDirectory(output, [...SOURCE_FILES, 'data.js']);
  for (const sourceFile of SOURCE_FILES) fs.copyFileSync(path.join(sourceDirectory, sourceFile), path.join(output, sourceFile));
  const dataScript = `window.AGENT_TOOLBELT_DATA = ${JSON.stringify(payload, null, 2)};\n`;
  fs.writeFileSync(path.join(output, 'data.js'), dataScript);
  return { output, payload };
}

function main() {
  const output = process.argv[2] || path.join(ROOT, 'portal', 'generated');
  try {
    const result = build(output, ROOT);
    console.log(`Built portal: ${path.relative(ROOT, result.output)} (${result.payload.skills.length} skills, ${result.payload.workflows.length} workflows)`);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

if (require.main === module) main();

module.exports = { build, normalizePortalPayload, prepareOutputDirectory, REPOSITORY_URL };
