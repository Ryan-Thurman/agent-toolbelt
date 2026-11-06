#!/usr/bin/env node
/* Cross-host package checks for the tracked root plugin and Cursor build. */

const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("child_process");

const root = path.resolve(process.argv[2] || path.join(__dirname, ".."));
const errors = [];

function readJson(relativePath) {
  const file = path.join(root, relativePath);
  if (!fs.existsSync(file)) {
    errors.push(`missing JSON file: ${relativePath}`);
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (error) {
    errors.push(`invalid JSON in ${relativePath}: ${error.message}`);
    return null;
  }
}

const cursor = readJson(".cursor-plugin/plugin.json");
const claude = readJson(".claude-plugin/plugin.json");
const codex = readJson(".codex-plugin/plugin.json");
const claudeMarketplace = readJson(".claude-plugin/marketplace.json");
const codexMarketplace = readJson(".agents/plugins/marketplace.json");
const autoAgentRoot = "plugins/agent-toolbelt-auto-agent";
const catalog = readJson("catalog/agent-toolbelt.json");
const projectBoundary = catalog?.tooling_audit?.find((entry) => entry.id === "project-workflow-boundary");
if (!projectBoundary?.absent_paths?.includes("skills/ai-feature-delivery")) {
  errors.push("catalog must record the retired project lifecycle paths");
}
const autoAgentManifests = [
  ["Cursor", readJson(`${autoAgentRoot}/.cursor-plugin/plugin.json`)],
  ["Claude Code", readJson(`${autoAgentRoot}/.claude-plugin/plugin.json`)],
  ["Codex", readJson(`${autoAgentRoot}/.codex-plugin/plugin.json`)],
];

const manifests = [
  ["Cursor", cursor],
  ["Claude Code", claude],
  ["Codex", codex],
].filter(([, manifest]) => manifest);

for (const [host, manifest] of manifests) {
  if (manifest.name !== "agent-toolbelt") {
    errors.push(`${host} manifest name must be agent-toolbelt`);
  }
  if (manifest.version !== "1.0.0") {
    errors.push(`${host} manifest version must be 1.0.0`);
  }
  if (!manifest.author || manifest.author.name !== "Ryan Thurman") {
    errors.push(`${host} manifest author must be Ryan Thurman`);
  }
  if (manifest.repository !== "https://github.com/Ryan-Thurman/agent-toolbelt") {
    errors.push(`${host} manifest repository is not canonical`);
  }
  if (manifest.license !== "MIT") {
    errors.push(`${host} manifest license must be MIT`);
  }
  if (manifest.description !== "Reusable AI-agent skills for software delivery workflows.") {
    errors.push(`${host} manifest must describe the skills-only plugin surface`);
  }
  if (Object.prototype.hasOwnProperty.call(manifest, "hooks")) {
    errors.push(`${host} manifest must not declare hooks by default`);
  }
}

if (cursor && cursor.skills !== "./skills/") {
  errors.push("Cursor skills path must be ./skills/");
}
if (cursor && (!Array.isArray(cursor.commands) || cursor.commands.length !== 0)) {
  errors.push("Cursor commands must be explicitly suppressed with an empty array");
}
if (claude && (!Array.isArray(claude.commands) || claude.commands.length !== 0)) {
  errors.push("Claude Code commands must be explicitly suppressed with an empty array");
}
if (codex && codex.skills !== "./skills/") {
  errors.push("Codex skills path must be ./skills/");
}
if (codex && codex.interface && codex.interface.category !== "Developer Tools") {
  errors.push("Codex interface category must be Developer Tools");
}
if (codex && codex.interface && (!Array.isArray(codex.interface.capabilities) || codex.interface.capabilities.length !== 1 || codex.interface.capabilities[0] !== "Skills")) {
  errors.push("Codex capabilities must advertise the skills-only plugin surface");
}

const skillCount = fs.readdirSync(path.join(root, "skills"), { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && fs.existsSync(path.join(root, "skills", entry.name, "SKILL.md")))
  .length;
if (skillCount !== 29) {
  errors.push(`expected 29 standard skills, found ${skillCount}`);
}
for (const id of ["auto-agent-contract", "auto-agent-dev-lite"]) {
  if (fs.existsSync(path.join(root, "skills", id))) {
    errors.push(`private skill must not appear in the standard plugin: ${id}`);
  }
  if (!fs.existsSync(path.join(root, autoAgentRoot, "skills", id, "SKILL.md"))) {
    errors.push(`missing private skill: ${id}`);
  }
}
if (fs.existsSync(path.join(root, "commands", "auto-agent-plan.md"))) {
  errors.push("private auto-agent-plan command must not appear in the standard plugin");
}
if (!fs.existsSync(path.join(root, autoAgentRoot, "commands", "auto-agent-plan.md"))) {
  errors.push("missing private auto-agent-plan command");
}
for (const [host, manifest] of autoAgentManifests) {
  if (!manifest) continue;
  if (manifest.name !== "agent-toolbelt-auto-agent" || manifest.version !== "1.0.0" || manifest.skills !== "./skills/") {
    errors.push(`${host} Auto Agent manifest must identify the opt-in 1.0.0 skills package`);
  }
}

function checkCatalog(catalog, relativePath, sourceResolver, manifestPath) {
  if (!catalog) return;
  if (!Array.isArray(catalog.plugins)) {
    errors.push(`${relativePath} must contain a plugins array`);
    return;
  }
  const entry = catalog.plugins.find((plugin) => plugin && plugin.name === "agent-toolbelt");
  if (!entry) {
    errors.push(`${relativePath} must contain an agent-toolbelt entry`);
    return;
  }
  if (entry.version && entry.version !== "1.0.0") {
    errors.push(`${relativePath} plugin version must be 1.0.0`);
  }
  if (entry.description && entry.description !== "Reusable AI-agent skills for software delivery workflows.") {
    errors.push(`${relativePath} plugin description must describe the skills-only surface`);
  }
  const source = typeof entry.source === "string"
    ? entry.source
    : entry.source && entry.source.path;
  if (!source) {
    errors.push(`${relativePath} plugin source is missing`);
    return;
  }
  const resolved = sourceResolver(source);
  if (path.resolve(resolved) !== root) {
    errors.push(`${relativePath} source ${source} must resolve to repository root`);
  }
  if (!fs.existsSync(path.join(resolved, manifestPath))) {
    errors.push(`${relativePath} source ${source} does not contain the plugin root`);
  }
}

checkCatalog(
  claudeMarketplace,
  ".claude-plugin/marketplace.json",
  (source) => path.resolve(root, source),
  ".claude-plugin/plugin.json",
);
checkCatalog(
  codexMarketplace,
  ".agents/plugins/marketplace.json",
  (source) => path.resolve(root, source),
  ".codex-plugin/plugin.json",
);

function checkPrivateCatalog(catalog, relativePath, manifestPath) {
  if (!catalog || !Array.isArray(catalog.plugins)) return;
  const entry = catalog.plugins.find((plugin) => plugin && plugin.name === "agent-toolbelt-auto-agent");
  if (!entry) {
    errors.push(`${relativePath} must contain the opt-in Auto Agent entry`);
    return;
  }
  const source = typeof entry.source === "string" ? entry.source : entry.source && entry.source.path;
  const resolved = source && path.resolve(root, source);
  if (resolved !== path.join(root, autoAgentRoot) || !fs.existsSync(path.join(resolved, manifestPath))) {
    errors.push(`${relativePath} Auto Agent source must resolve to ${autoAgentRoot}`);
  }
}
checkPrivateCatalog(claudeMarketplace, ".claude-plugin/marketplace.json", ".claude-plugin/plugin.json");
checkPrivateCatalog(codexMarketplace, ".agents/plugins/marketplace.json", ".codex-plugin/plugin.json");

for (const relativePath of ["hooks/hooks.json", "rules", ".cursor/hooks.json"]) {
  if (fs.existsSync(path.join(root, relativePath))) {
    errors.push(`default root plugin must not expose opt-in payload: ${relativePath}`);
  }
}
for (const relativePath of ["optional/cursor-hooks/hooks.json", "optional/cursor-hooks/doc-sync-guard.sh", "optional/cursor-hooks/review-nudge.sh"]) {
  if (!fs.existsSync(path.join(root, relativePath))) {
    errors.push(`missing opt-in Cursor hook payload: ${relativePath}`);
  }
}

const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "agent-toolbelt-plugin-check-"));
const build = spawnSync(path.join(root, "build-cursor-plugin.sh"), [tempRoot], {
  cwd: root,
  encoding: "utf8",
});
if (build.status !== 0) {
  errors.push(`Cursor build failed: ${build.stderr || build.stdout}`.trim());
} else {
  const builtManifest = readJsonFrom(tempRoot, ".cursor-plugin/plugin.json");
  if (!builtManifest || builtManifest.name !== "agent-toolbelt" || builtManifest.version !== "1.0.0") {
    errors.push("Cursor build manifest is not aligned with the root plugin");
  }
  const builtSkills = fs.readdirSync(path.join(tempRoot, "skills"), { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && fs.existsSync(path.join(tempRoot, "skills", entry.name, "SKILL.md")))
    .length;
  if (builtSkills !== skillCount) {
    errors.push(`Cursor build skill count mismatch: root=${skillCount}, build=${builtSkills}`);
  }
  for (const id of ["auto-agent-contract", "auto-agent-dev-lite"]) {
    if (fs.existsSync(path.join(tempRoot, "skills", id))) {
      errors.push(`Cursor default build must omit private skill: ${id}`);
    }
  }
  if (fs.existsSync(path.join(tempRoot, "commands"))) {
    errors.push("Cursor build must contain 0 commands (commands directory is present)");
  }
  for (const relativePath of ["hooks", "rules", ".cursor", ".claude", ".agents"]) {
    if (fs.existsSync(path.join(tempRoot, relativePath))) {
      errors.push(`Cursor default build must omit opt-in/harness payload: ${relativePath}`);
    }
  }
  for (const relativePath of ["templates", "workflows", "examples", "docs"]) {
    if (!fs.existsSync(path.join(tempRoot, relativePath))) {
      errors.push(`Cursor build is missing skill support directory: ${relativePath}`);
    }
  }
}

function checkInstall(args, target, label) {
  fs.mkdirSync(target);
  const result = spawnSync(path.join(root, "install.sh"), [...args, target], {
    cwd: root,
    encoding: "utf8",
  });
  if (result.status !== 0) {
    errors.push(`${label} installer failed: ${result.stderr || result.stdout}`.trim());
    return false;
  }
  return true;
}
const standardTarget = path.join(tempRoot, "standard-install");
if (checkInstall(["--harness", "all", "all"], standardTarget, "standard all-pack")) {
  for (const relativePath of [
    ".atb/skills/phased-delivery/SKILL.md",
    ".agents/skills/phased-delivery/SKILL.md",
    ".cursor/commands/dev-plan.md",
    ".atb/templates/phased-delivery-plan.md",
    ".atb/workflows/phased-delivery-workflow.md",
  ]) {
    if (!fs.existsSync(path.join(standardTarget, relativePath))) {
      errors.push(`standard all-pack install is missing Phased Delivery payload: ${relativePath}`);
    }
  }
  if (fs.existsSync(path.join(standardTarget, ".atb", "skills", "dev-lite-workflow"))) {
    errors.push("standard all-pack install must omit the deprecated Dev Lite skill path");
  }
  for (const id of ["auto-agent-contract", "auto-agent-dev-lite"]) {
    if (fs.existsSync(path.join(standardTarget, ".atb", "skills", id))) {
      errors.push(`standard all-pack install must omit private skill: ${id}`);
    }
  }
  if (fs.existsSync(path.join(standardTarget, ".cursor", "commands", "auto-agent-plan.md"))) {
    errors.push("standard all-pack install must omit private auto-agent-plan command");
  }
  for (const surface of [".atb", ".agents"]) {
    const installedCount = fs.readdirSync(path.join(standardTarget, surface, "skills"))
      .filter((id) => fs.existsSync(path.join(standardTarget, surface, "skills", id, "SKILL.md"))).length;
    if (installedCount !== skillCount) {
      errors.push(`${surface} must install exactly ${skillCount} standard skills; found ${installedCount}`);
    }
  }
  for (const host of [".cursor", ".claude"]) {
    for (const command of ["workflow-router", "implementation-plan", "write-tests", "review-diff", "pr-ready-check", "role-review"]) {
      if (!fs.existsSync(path.join(standardTarget, host, "commands", `${command}.md`))) {
        errors.push(`shared command helper is missing from ${host}: ${command}`);
      }
    }
  }
  for (const relativePath of projectBoundary?.absent_paths || []) {
    const destinations = relativePath.startsWith("commands/")
      ? [`.cursor/${relativePath}`, `.claude/${relativePath}`]
      : relativePath.startsWith("skills/")
        ? [`.atb/${relativePath}`, `.agents/${relativePath}`]
        : [`.atb/${relativePath}`];
    for (const destination of destinations) {
      if (fs.existsSync(path.join(standardTarget, destination))) {
        errors.push(`standard install restored project lifecycle payload: ${destination}`);
      }
    }
    if (fs.existsSync(path.join(tempRoot, relativePath))) {
      errors.push(`Cursor build restored project lifecycle payload: ${relativePath}`);
    }
  }
  const cursorRules = fs.readdirSync(path.join(standardTarget, ".cursor", "rules"));
  if (cursorRules.length !== 1 || cursorRules[0] !== "agent-toolbelt-router.mdc") {
    errors.push("standard install must contain only the minimal shared Cursor rule");
  }
}
// A shared update must preserve a project's lifecycle and same-name adapters.
const projectFiles = [
  ".atb/skills/ai-feature-delivery/SKILL.md",
  ".agents/skills/ai-feature-delivery/SKILL.md",
  ".cursor/commands/workflow-router.md",
  ".claude/commands/implementation-plan.md",
  ".cursor/rules/000-core-process.mdc",
];
for (const relativePath of projectFiles) {
  const targetPath = path.join(standardTarget, relativePath);
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.writeFileSync(targetPath, `Project-owned ${relativePath}\n`);
}
const projectUpdate = spawnSync(path.join(root, "install.sh"), ["--harness", "all", "all", standardTarget], {
  cwd: root,
  encoding: "utf8",
});
if (projectUpdate.status !== 0) {
  errors.push(`project-preserving update failed: ${projectUpdate.stderr || projectUpdate.stdout}`);
}
for (const relativePath of projectFiles) {
  if (fs.readFileSync(path.join(standardTarget, relativePath), "utf8") !== `Project-owned ${relativePath}\n`) {
    errors.push(`shared update changed project-owned content: ${relativePath}`);
  }
}
for (const [label, args, diagnostic] of [
  ["retired-pack", ["--harness", "all", "ai-feature-delivery"], /ai-feature-delivery is project-owned/],
  ["retired-rules", ["--harness", "cursor", "--rules", "full", "all"], /--rules full is retired/],
]) {
  const target = path.join(tempRoot, label);
  const rejected = spawnSync(path.join(root, "install.sh"), [...args, target], { cwd: root, encoding: "utf8" });
  if (rejected.status !== 2 || !diagnostic.test(rejected.stderr) || fs.existsSync(target)) {
    errors.push(`${label} must fail with migration guidance before creating the target`);
  }
}
const legacyTarget = path.join(tempRoot, "legacy-selector-install");
if (checkInstall(["--harness", "all", "dev-lite-workflow"], legacyTarget, "legacy Dev Lite selector")) {
  if (!fs.existsSync(path.join(legacyTarget, ".atb", "skills", "phased-delivery", "SKILL.md"))) {
    errors.push("legacy Dev Lite selector must resolve to the Phased Delivery skill");
  }
}
const privateTarget = path.join(tempRoot, "private-install");
if (checkInstall(["--harness", "all", "auto-agent-contract"], privateTarget, "private pack")) {
  for (const id of ["auto-agent-contract", "auto-agent-dev-lite"]) {
    for (const surface of [".atb", ".agents"]) {
      if (!fs.existsSync(path.join(privateTarget, surface, "skills", id, "SKILL.md"))) {
        errors.push(`private pack must install ${id} on ${surface}`);
      }
    }
  }
  for (const host of [".cursor", ".claude"]) {
    if (!fs.existsSync(path.join(privateTarget, host, "commands", "auto-agent-plan.md"))) {
      errors.push(`private pack must install auto-agent-plan on ${host}`);
    }
  }
}
fs.rmSync(tempRoot, { recursive: true, force: true });

function readJsonFrom(base, relativePath) {
  try {
    return JSON.parse(fs.readFileSync(path.join(base, relativePath), "utf8"));
  } catch {
    return null;
  }
}

if (errors.length) {
  console.error("Plugin package check failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log(`ok: cross-host manifests/catalogs aligned, ${skillCount} standard skills, private pack isolated, Cursor build and installs clean`);
