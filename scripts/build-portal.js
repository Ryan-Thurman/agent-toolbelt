#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { ROOT, discoverCanonicalSkills, loadCatalog } = require('./catalog-lib');
const { validate } = require('./validate-catalog');

const REPOSITORY_URL = 'https://github.com/Ryan-Thurman/agent-toolbelt';
const STATIC_FILES = [
  'styles.css', 'app.js', 'brand-icon.svg',
  'favicon.svg', 'favicon-16.png', 'favicon-32.png', 'favicon-48.png'
];
// Each page is portal/src/layout.html with one fragment from portal/src/pages/ in its main element.
const PAGES = [
  { id: 'index', file: 'index.html', title: 'Agent Toolbelt — Skills for software delivery', description: 'Agent Toolbelt: reusable software delivery skills for Cursor, Claude Code, and Codex.' },
  { id: 'workflows', file: 'workflows.html', title: 'Workflows — Agent Toolbelt', description: 'Agent Toolbelt workflows: sequences of skills for one task, from the first stage to the last.' },
  { id: 'use-cases', file: 'use-cases.html', title: 'Use cases — Agent Toolbelt', description: 'Agent Toolbelt use cases: the skills on real work, grouped by role.' },
  { id: 'setup', file: 'setup.html', title: 'Setup — Agent Toolbelt', description: 'Install Agent Toolbelt in Cursor, Claude Code, or Codex, and see what the plugin contains.' }
];
const SOURCE_FILES = [...STATIC_FILES, 'layout.html', ...PAGES.map((page) => `pages/${page.file}`)];
const GENERATED_FILES = [...STATIC_FILES, ...PAGES.map((page) => page.file), 'data.js'];

function renderPage(sourceDirectory, page) {
  const layout = fs.readFileSync(path.join(sourceDirectory, 'layout.html'), 'utf8');
  const main = fs.readFileSync(path.join(sourceDirectory, 'pages', page.file), 'utf8');
  const values = { title: page.title, description: page.description, page: page.id, main };
  const html = layout.replace(/\{\{(title|description|page|main)\}\}/g, (_, key) => values[key]);
  const navLink = `data-nav="${page.id}"`;
  if (!html.includes(navLink)) throw new Error(`Portal layout has no navigation link for page: ${page.id}`);
  return html.replace(navLink, `${navLink} aria-current="page"`);
}

// The portal shows the summary as plain text, so remove the Markdown marks.
function plainText(markdown) {
  return markdown
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

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

const USE_CASE_GROUPS = [
  ['qa', 'QA and test'], ['dev', 'Developer'], ['product', 'Product'],
  ['arch', 'Architecture, SRE, and security'], ['sre', 'Architecture, SRE, and security'], ['sec', 'Architecture, SRE, and security'],
  ['lead', 'Tech lead'], ['ops', 'Platform and operators'], ['ui', 'UI and front end'], ['write', 'Writers'], ['journey', 'End-to-end journeys']
];

// Read wiki/use-cases/*.md. The pages own the content; the portal shows the title, the summary,
// the group from the file-name prefix, and the skills that the header table names.
function loadUseCases(root, skillIds) {
  const folder = path.join(root, 'wiki', 'use-cases');
  if (!fs.existsSync(folder)) return [];
  return fs.readdirSync(folder).filter((name) => name.endsWith('.md') && name !== 'README.md').sort().map((name) => {
    const slug = name.replace(/\.md$/, '');
    const text = fs.readFileSync(path.join(folder, name), 'utf8');
    const lines = text.split('\n');
    const titleLine = lines.find((line) => line.startsWith('# '));
    if (!titleLine) throw new Error(`Use-case page has no title: wiki/use-cases/${name}`);
    const start = lines.indexOf(titleLine) + 1;
    const summary = [];
    for (const line of lines.slice(start)) {
      if (!line.trim()) { if (summary.length) break; continue; }
      if (line.startsWith('|') || line.startsWith('#')) break;
      summary.push(line.trim());
    }
    const headerRow = lines.find((line, i) => i > start && line.startsWith('|') && !/^\|\s*(Roles|-)/.test(line));
    const cells = headerRow ? headerRow.split('|').slice(1, -1).map((cell) => cell.trim()) : [];
    const named = new Set((text.match(/`([a-z0-9-]+)`/g) || []).map((token) => token.slice(1, -1)));
    const headerSkills = cells[1] ? (cells[1].match(/`\/?([a-z0-9-]+)`/g) || []).map((token) => token.replace(/[`/]/g, '')) : [];
    const skills = [...new Set(headerSkills.filter((id) => skillIds.has(id)))];
    if (!skills.length) named.forEach((id) => { if (skillIds.has(id)) skills.push(id); });
    const prefix = slug.split('-')[0];
    const group = (USE_CASE_GROUPS.find(([key]) => key === prefix) || [null, 'Other'])[1];
    return {
      order: USE_CASE_GROUPS.findIndex(([key]) => key === prefix),
      slug,
      title: titleLine.slice(2).trim(),
      summary: plainText(summary.join(' ')),
      group,
      roles: cells[0] || '',
      skills,
      source_path: `wiki/use-cases/${name}`,
      source_url: `${REPOSITORY_URL}/blob/main/wiki/use-cases/${name}`
    };
  })
    // Show the groups in role order (USE_CASE_GROUPS), not in file-name order.
    .sort((a, b) => (a.order < 0 ? 99 : a.order) - (b.order < 0 ? 99 : b.order) || a.slug.localeCompare(b.slug))
    .map(({ order, ...useCase }) => useCase);
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
    use_cases: loadUseCases(root, new Set(skills.map((skill) => skill.id))),
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
  prepareOutputDirectory(output, GENERATED_FILES);
  for (const staticFile of STATIC_FILES) fs.copyFileSync(path.join(sourceDirectory, staticFile), path.join(output, staticFile));
  for (const page of PAGES) fs.writeFileSync(path.join(output, page.file), renderPage(sourceDirectory, page));
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

module.exports = { build, normalizePortalPayload, plainText, prepareOutputDirectory, renderPage, GENERATED_FILES, PAGES, REPOSITORY_URL };
