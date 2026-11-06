#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { ROOT, discoverCanonicalSkills, loadCatalog } = require('./catalog-lib');

const EXPECTED_SKILL_COUNT = 29;
const SUPPORTED_HOSTS = new Set(['cursor', 'claude-code', 'codex']);
const LIFECYCLES = new Set(['still-required', 'optional-compatibility', 'deprecated', 'removable']);
const DOC_STATUSES = new Set(['complete', 'partial', 'specialized', 'missing']);
const REQUIRED_SKILL_SCALARS = ['id', 'category', 'primary_purpose', 'preferred_context'];
const REQUIRED_NONEMPTY_ARRAYS = ['tags', 'use_when', 'avoid_when', 'expected_outputs', 'example_prompts'];
const OPTIONAL_ARRAYS = ['related_skills', 'workflow_membership', 'recommended_changes'];

function unique(values) {
  return new Set(values).size === values.length;
}

function asArray(value) {
  return Array.isArray(value) ? value : null;
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function validateStringArray(errors, prefix, key, value, allowEmpty) {
  if (!Array.isArray(value) || (!allowEmpty && value.length === 0) || value.some((item) => !isNonEmptyString(item))) {
    errors.push(`${prefix}: ${key} must be an array of non-empty strings${allowEmpty ? '' : ' with at least one item'}`);
    return false;
  }
  return true;
}

function validateHostClaim(errors, prefix, claim) {
  const hosts = Array.isArray(claim) ? claim : claim && (claim.hosts || claim.supported_hosts || claim.default_hosts);
  if (!validateStringArray(errors, prefix, 'host compatibility', hosts, false)) return;
  if (!unique(hosts)) errors.push(`${prefix}: duplicate host compatibility IDs`);
  if (hosts.some((host) => !SUPPORTED_HOSTS.has(host))) errors.push(`${prefix}: unsupported host claim`);
}

function validate(root = ROOT) {
  const errors = [];
  let catalog;
  try {
    catalog = loadCatalog(root);
  } catch (error) {
    return [`catalog/agent-toolbelt.json: ${error.message}`];
  }

  const canonical = discoverCanonicalSkills(root);
  errors.push(...canonical.errors);
  if (canonical.skills.length !== EXPECTED_SKILL_COUNT) {
    errors.push(`canonical skill count is ${canonical.skills.length}; expected ${EXPECTED_SKILL_COUNT}`);
  }

  const canonicalIds = new Set(canonical.skills.map((skill) => skill.id));
  const catalogInfo = catalog.catalog;
  let categories = [];
  let discoveryTags = [];
  if (!catalogInfo || typeof catalogInfo !== 'object') {
    errors.push('catalog.catalog must be an object');
  } else {
    if (catalog.schema_version !== 1) errors.push('catalog.schema_version must be 1');
    if (catalogInfo.id !== 'agent-toolbelt') errors.push('catalog.catalog.id must be agent-toolbelt');
    if (!isNonEmptyString(catalogInfo.display_name)) errors.push('catalog.catalog.display_name must be a non-empty string');
    if (!isNonEmptyString(catalogInfo.description)) errors.push('catalog.catalog.description must be a non-empty string');
    categories = asArray(catalogInfo.categories) || [];
    if (categories.length < 6 || categories.length > 9 || !unique(categories) || categories.some((category) => !isNonEmptyString(category))) {
      errors.push('catalog.catalog.categories must contain 6–9 unique categories');
    }
    const categoryGuidance = catalogInfo.category_guidance;
    if (!categoryGuidance || typeof categoryGuidance !== 'object' || Array.isArray(categoryGuidance)) {
      errors.push('catalog.catalog.category_guidance must be an object');
    } else {
      const guidanceIds = Object.keys(categoryGuidance);
      if (!unique(guidanceIds) || guidanceIds.length !== categories.length || guidanceIds.some((category) => !categories.includes(category))) {
        errors.push('catalog.catalog.category_guidance must cover each category exactly once');
      }
      for (const category of categories) {
        if (!isNonEmptyString(categoryGuidance[category])) errors.push(`category guidance ${category}: must be a non-empty string`);
      }
    }
    discoveryTags = asArray(catalogInfo.discovery_tags) || [];
    if (!discoveryTags.length || !unique(discoveryTags) || discoveryTags.some((tag) => !isNonEmptyString(tag))) {
      errors.push('catalog.catalog.discovery_tags must contain unique non-empty strings');
    }
    const hostPolicy = catalogInfo.host_compatibility;
    if (!hostPolicy || typeof hostPolicy !== 'object' || !asArray(hostPolicy.default_hosts) ||
        hostPolicy.default_hosts.length !== SUPPORTED_HOSTS.size ||
        !unique(hostPolicy.default_hosts) ||
        hostPolicy.default_hosts.some((host) => !SUPPORTED_HOSTS.has(host))) {
      errors.push('catalog.catalog.host_compatibility.default_hosts must be cursor, claude-code, and codex exactly once');
    }
    const hostRecords = hostPolicy && asArray(hostPolicy.hosts);
    if (!hostRecords || hostRecords.length !== SUPPORTED_HOSTS.size) {
      errors.push('catalog.catalog.host_compatibility.hosts must contain exactly three host records');
    } else {
      const hostIds = hostRecords.map((host) => host && host.id);
      if (!unique(hostIds) || hostIds.some((id) => !SUPPORTED_HOSTS.has(id))) {
        errors.push('catalog.catalog.host_compatibility.hosts must use supported host IDs exactly once');
      }
      for (const host of hostRecords) {
        const prefix = `host ${host && host.id ? host.id : '<missing id>'}`;
        for (const key of ['id', 'name', 'invocation_template', 'browser_hint', 'installation']) {
          if (!host || !isNonEmptyString(host[key])) errors.push(`${prefix}: ${key} must be a non-empty string`);
        }
        if (host && isNonEmptyString(host.invocation_template) && !host.invocation_template.includes('{skill_id}')) errors.push(`${prefix}: invocation_template must contain {skill_id}`);
        if (!host || !validateStringArray(errors, prefix, 'local_install_commands', host.local_install_commands, false)) {
          // The helper reports the malformed command list.
        }
        if (!host || typeof host.implicit_matching !== 'boolean') errors.push(`${prefix}: implicit_matching must be boolean`);
      }
    }
    if (!isNonEmptyString(hostPolicy && hostPolicy.native_skill_surface)) errors.push('catalog.catalog.host_compatibility.native_skill_surface must be a non-empty string');
    if (!isNonEmptyString(hostPolicy && hostPolicy.workflow_membership_note)) errors.push('catalog.catalog.host_compatibility.workflow_membership_note must be a non-empty string');
    if (!isNonEmptyString(catalogInfo.surface_note) || !catalogInfo.surface_note.includes('not native plugin skills')) {
      errors.push('catalog.catalog.surface_note must distinguish tooling surfaces from native plugin skills');
    }
  }

  const catalogSkills = asArray(catalog.skills);
  if (!catalogSkills) {
    errors.push('catalog.skills must be an array');
  } else {
    const ids = catalogSkills.map((skill) => skill && skill.id);
    if (!unique(ids)) errors.push('catalog.skills contains duplicate skill IDs');
    for (const id of ids) {
      if (!canonicalIds.has(id)) errors.push(`catalog skill is not canonical: ${id}`);
    }
    for (const id of canonicalIds) {
      if (!ids.includes(id)) errors.push(`canonical skill missing from catalog: ${id}`);
    }
    const categorySet = new Set(categories);
    const aliases = [];
    for (const skill of catalogSkills) {
      if (!skill || typeof skill !== 'object') {
        errors.push('catalog.skills entries must be objects');
        continue;
      }
      const prefix = `skill ${skill.id || '<missing id>'}`;
      const required = [
        'id', 'category', 'tags', 'primary_purpose', 'use_when', 'avoid_when',
        'preferred_context', 'expected_outputs', 'example_prompts', 'related_skills',
        'workflow_membership', 'documentation_completeness', 'recommended_changes'
      ];
      for (const key of required) {
        if (!(key in skill)) errors.push(`${prefix}: missing required metadata ${key}`);
      }
      for (const key of REQUIRED_SKILL_SCALARS) {
        if (!isNonEmptyString(skill[key])) errors.push(`${prefix}: ${key} must be a non-empty string`);
      }
      if (!categorySet.has(skill.category)) errors.push(`${prefix}: invalid category ${skill.category}`);
      for (const key of REQUIRED_NONEMPTY_ARRAYS) validateStringArray(errors, prefix, key, skill[key], false);
      for (const key of OPTIONAL_ARRAYS) validateStringArray(errors, prefix, key, skill[key], true);
      for (const key of ['tags', 'expected_outputs', 'example_prompts', 'related_skills', 'workflow_membership']) {
        if (asArray(skill[key]) && !unique(skill[key])) errors.push(`${prefix}: duplicate ${key}`);
      }
      if (asArray(skill.aliases)) {
        validateStringArray(errors, prefix, 'aliases', skill.aliases, true);
        if (!unique(skill.aliases)) errors.push(`${prefix}: duplicate aliases`);
        aliases.push(...skill.aliases);
      }
      if (skill.documentation_completeness && typeof skill.documentation_completeness === 'object') {
        if (!DOC_STATUSES.has(skill.documentation_completeness.status)) errors.push(`${prefix}: invalid documentation completeness status`);
        if (!isNonEmptyString(skill.documentation_completeness.notes)) errors.push(`${prefix}: documentation completeness needs non-empty notes`);
      }
      if (asArray(skill.related_skills)) {
        for (const related of skill.related_skills) {
          if (!canonicalIds.has(related)) errors.push(`${prefix}: broken related skill reference ${related}`);
          if (related === skill.id) errors.push(`${prefix}: skill cannot relate to itself`);
        }
      }
      if (skill.hosts || skill.supported_hosts || skill.host_compatibility) {
        validateHostClaim(errors, prefix, skill.hosts || skill.supported_hosts || skill.host_compatibility);
      }
    }
    if (!unique(aliases)) errors.push('catalog.skills contains duplicate aliases');
    for (const discoveryTag of discoveryTags) {
      if (!catalogSkills.some((skill) => Array.isArray(skill.tags) && skill.tags.includes(discoveryTag))) {
        errors.push(`catalog discovery tag is unused: ${discoveryTag}`);
      }
    }
  }

  const workflows = asArray(catalog.workflows);
  const workflowIds = new Set();
  if (!workflows) {
    errors.push('catalog.workflows must be an array');
  } else {
    for (const workflow of workflows) {
      if (!workflow || typeof workflow !== 'object') {
        errors.push('catalog.workflows entries must be objects');
        continue;
      }
      if (!isNonEmptyString(workflow.id)) errors.push('workflow is missing an id');
      if (workflowIds.has(workflow.id)) errors.push(`duplicate workflow id: ${workflow.id}`);
      workflowIds.add(workflow.id);
      if (!isNonEmptyString(workflow.name)) errors.push(`workflow ${workflow.id}: missing name`);
      if (!isNonEmptyString(workflow.purpose)) errors.push(`workflow ${workflow.id}: missing purpose`);
      if (!Array.isArray(workflow.stages) || workflow.stages.length === 0) {
        errors.push(`workflow ${workflow.id}: stages must be a non-empty array`);
        continue;
      }
      const stageSkills = [];
      for (const [index, stage] of workflow.stages.entries()) {
        const prefix = `workflow ${workflow.id} stage ${index + 1}`;
        if (!stage || typeof stage !== 'object') {
          errors.push(`${prefix}: must be an object`);
          continue;
        }
        for (const key of ['skill', 'rationale', 'example_invocation', 'next_steps']) {
          if (!(key in stage)) errors.push(`${prefix}: missing ${key}`);
        }
        if (!canonicalIds.has(stage.skill)) errors.push(`${prefix}: broken skill reference ${stage.skill}`);
        if (canonicalIds.has(stage.skill)) stageSkills.push(stage.skill);
        if (!isNonEmptyString(stage.rationale)) errors.push(`${prefix}: rationale must be non-empty`);
        if (!isNonEmptyString(stage.example_invocation)) errors.push(`${prefix}: example_invocation must be non-empty`);
        if (!validateStringArray(errors, prefix, 'next_steps', stage.next_steps, true)) continue;
        if (!unique(stage.next_steps)) errors.push(`${prefix}: duplicate next_steps`);
        if (stage.next_steps.some((next) => !canonicalIds.has(next))) errors.push(`${prefix}: next_steps must reference canonical skills only`);
      }
      if (!unique(stageSkills)) errors.push(`workflow ${workflow.id}: duplicate stage skill IDs`);
    }
  }
  if (catalogSkills && workflows) {
    for (const skill of catalogSkills) {
      if (Array.isArray(skill.workflow_membership)) {
        for (const workflowId of skill.workflow_membership) {
          if (!workflowIds.has(workflowId)) errors.push(`skill ${skill.id}: broken workflow reference ${workflowId}`);
        }
      }
    }
  }

  const tooling = asArray(catalog.tooling_audit);
  if (!tooling) {
    errors.push('catalog.tooling_audit must be an array');
  } else {
    const ids = tooling.map((entry) => entry && entry.id);
    if (!unique(ids)) errors.push('catalog.tooling_audit contains duplicate IDs');
    for (const entry of tooling) {
      if (!entry || typeof entry !== 'object') {
        errors.push('catalog.tooling_audit entries must be objects');
        continue;
      }
      for (const key of ['id', 'label', 'kind', 'lifecycle', 'purpose', 'recommendation']) {
        if (!isNonEmptyString(entry[key])) errors.push(`tooling audit ${entry.id || '<missing>'}: missing ${key}`);
      }
      if (!LIFECYCLES.has(entry.lifecycle)) errors.push(`tooling audit ${entry.id || '<missing>'}: invalid lifecycle`);
      if (typeof entry.native_skill_surface !== 'boolean') errors.push(`tooling audit ${entry.id || '<missing>'}: native_skill_surface must be boolean`);
      const prefix = `tooling audit ${entry.id || '<missing>'}`;
      const paths = entry.paths == null ? [] : entry.paths;
      const absentPaths = entry.absent_paths == null ? [] : entry.absent_paths;
      validateStringArray(errors, prefix, 'paths', paths, true);
      validateStringArray(errors, prefix, 'absent_paths', absentPaths, true);
      if (!paths.length && !absentPaths.length) errors.push(`${prefix}: paths or absent_paths must identify an audited surface`);
      for (const relativePath of paths) {
        const resolved = path.resolve(root, relativePath);
        if (resolved !== root && !resolved.startsWith(`${root}${path.sep}`)) {
          errors.push(`${prefix}: path escapes repository root: ${relativePath}`);
        } else if (!fs.existsSync(resolved)) {
          errors.push(`${prefix}: required path is missing: ${relativePath}`);
        }
      }
      for (const relativePath of absentPaths) {
        const resolved = path.resolve(root, relativePath);
        if (resolved !== root && !resolved.startsWith(`${root}${path.sep}`)) {
          errors.push(`${prefix}: absent path escapes repository root: ${relativePath}`);
        } else if (fs.existsSync(resolved)) {
          errors.push(`${prefix}: intentionally absent path exists: ${relativePath}`);
        }
      }
    }
  }
  return errors;
}

function main() {
  const root = path.resolve(__dirname, '..');
  const errors = validate(root);
  if (errors.length) {
    console.error(`Catalog validation failed (${errors.length} issue${errors.length === 1 ? '' : 's'}):`);
    for (const error of errors) console.error(`- ${error}`);
    process.exitCode = 1;
    return;
  }
  console.log('Catalog validation passed: 29 standard skills, 5 workflows, and tooling audit are consistent.');
}

if (require.main === module) main();

module.exports = { EXPECTED_SKILL_COUNT, SUPPORTED_HOSTS, validate };
