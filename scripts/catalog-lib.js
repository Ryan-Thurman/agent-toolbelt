'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

function readText(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function stripScalar(value) {
  const trimmed = value.trim();
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) ||
      (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function parseFrontmatter(filePath) {
  const text = readText(filePath);
  if (!text.startsWith('---\n')) {
    throw new Error(`${filePath}: expected YAML frontmatter`);
  }
  const end = text.indexOf('\n---', 4);
  if (end === -1) {
    throw new Error(`${filePath}: unterminated YAML frontmatter`);
  }
  const fields = {};
  for (const line of text.slice(4, end).split('\n')) {
    const match = line.match(/^([A-Za-z_][A-Za-z0-9_-]*):\s*(.*)$/);
    if (match) fields[match[1]] = stripScalar(match[2]);
  }
  for (const key of ['name', 'description']) {
    if (!fields[key]) throw new Error(`${filePath}: frontmatter missing ${key}`);
  }
  return { name: fields.name, description: fields.description };
}

function parseAgentMetadata(filePath) {
  const fields = {};
  for (const line of readText(filePath).split('\n')) {
    const match = line.match(/^\s{2}(display_name|short_description|default_prompt):\s*(.+)$/);
    if (match) fields[match[1]] = stripScalar(match[2]);
  }
  for (const key of ['display_name', 'short_description', 'default_prompt']) {
    if (!fields[key]) throw new Error(`${filePath}: metadata missing ${key}`);
  }
  return fields;
}

function discoverCanonicalSkills(root = ROOT) {
  const skillsRoot = path.join(root, 'skills');
  const entries = fs.readdirSync(skillsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
  const errors = [];
  const skills = [];
  for (const id of entries) {
    const skillPath = path.join(skillsRoot, id, 'SKILL.md');
    if (!fs.existsSync(skillPath)) continue;
    try {
      const frontmatter = parseFrontmatter(skillPath);
      const metadata = parseAgentMetadata(path.join(skillsRoot, id, 'agents', 'openai.yaml'));
      skills.push({
        id,
        name: frontmatter.name,
        description: frontmatter.description,
        display_name: metadata.display_name,
        short_description: metadata.short_description,
        default_prompt: metadata.default_prompt,
        skill_path: path.relative(root, skillPath),
        agent_path: path.relative(root, path.join(skillsRoot, id, 'agents', 'openai.yaml'))
      });
    } catch (error) {
      errors.push(error.message);
    }
  }
  return { skills, errors };
}

function loadCatalog(root = ROOT) {
  const filePath = path.join(root, 'catalog', 'agent-toolbelt.json');
  return JSON.parse(readText(filePath));
}

module.exports = {
  ROOT,
  discoverCanonicalSkills,
  loadCatalog,
  parseAgentMetadata,
  parseFrontmatter,
  readText
};
