# Agent Toolbelt V2 Portal — Implementation Plan

> Current ownership: See [the migration guide](project-workflow-boundary.md).
> The 2026-11-03 cleanup removed the project lifecycle pack from Toolbelt.
> Earlier inventories and implementation records below describe their original state.

## Overview

Phase 1 established the generated discovery catalog and audit for the existing
32-skill Agent Toolbelt package. Phase 2 implemented a lightweight offline
static portal generated from that contract. Phase 3 completed integration and
release hardening without changing the native plugin surface.

## Acceptance Criteria Coverage Strategy

- One canonical JSON catalog describes all 32 real `skills/*/SKILL.md` entries
  without duplicating canonical frontmatter, display metadata, source paths, or
  host lists.
- The catalog defines an approachable taxonomy, six real workflows, central
  Cursor/Claude Code/Codex compatibility, and an honest compatibility/tooling
  audit. `ai-feature-delivery` is cataloged as specialized legacy/
  compatibility-oriented work and excluded from primary onboarding workflows.
- A dependency-free Node validator deterministically checks canonical parity,
  metadata shape, taxonomy, references, workflows, hosts, duplicates, and count.
- A checked-in Node negative-test suite mutates isolated fixtures for each
  required failure class, including stale and failed audit generation.
- A deterministic generated audit is tracked and a check fails when it is stale.
- Existing plugin/install architecture and skill exposure remain unchanged.
- The portal is static, deterministic, responsive, keyboard-accessible, and
  usable directly from `file://` without network or package dependencies.
- The umbrella package check runs focused catalog and portal checks without
  recursive self-invocation, and same-page portal anchors are validated.
- Tooling audit entries identify existing paths or intentionally absent legacy
  targets using only the approved lifecycle values.

## Global Constraints

- Preserve all pre-existing dirty plugin-conversion work; do not commit in this
  phase.
- Keep `skills/*/SKILL.md` and `skills/*/agents/openai.yaml` canonical.
- Use Node built-ins/CommonJS and Bash wrappers; add no package manager or npm
  dependency.
- Do not add portal UI, broadly rename skills, rewrite skill instructions, or
  re-enable native commands/hooks.
- Commands, hooks, build helpers, installers, and internal copies are cataloged
  as compatibility/tooling surfaces; they are not native plugin skills.
- Follow `shared/contracts/references/style-precedence.md` and
  `shared/contracts/references/anti-slop-naming.md`.

## File / Responsibility Map

| File / Module | Responsibility | Expected Phase / Task | Interfaces or Consumers | Notes |
|---|---|---|---|---|
| `catalog/agent-toolbelt.json` | Human discovery metadata, taxonomy, workflows, host policy, tooling audit | Phase 1 / Tasks 1–2 | Validator and audit generator | One companion catalog; canonical skill metadata remains derived |
| `scripts/catalog-lib.js` | Narrow canonical frontmatter/agent metadata reader and catalog loader | Phase 1 / Task 2 | Validator and audit generator | No generalized YAML/Markdown parser |
| `scripts/validate-catalog.js` | Deterministic structural and reference validation | Phase 1 / Task 2 | Shell check and CI/manual use | Node built-ins only; strict non-empty and duplicate checks |
| `scripts/test-validate-catalog.js` | Isolated negative tests for catalog invariants and audit freshness | Phase 1 / Task 2–3 | `scripts/check-catalog.sh` | Node built-ins only |
| `scripts/generate-skill-taxonomy-audit.js` | Render deterministic Markdown audit | Phase 1 / Task 3 | Tracked audit and stale check | Generated from catalog + canonical metadata |
| `scripts/check-catalog.sh` | Run validator and stale-audit comparison | Phase 1 / Task 2–3 | Developer/CI check | Also invoked by the umbrella package check |
| `docs/skill-taxonomy-audit.md` | Readable generated 32-skill discovery audit | Phase 1 / Task 3 | Human review | Never hand-maintained |
| `portal/src/index.html` | Authored semantic portal shell and landmarks | Phase 2 / Tasks 1–2; Phase 3 hardening | Portal build | No framework or remote assets; Browse anchor is checked |
| `portal/src/styles.css` | Offline responsive light/dark presentation | Phase 2 / Task 2 | Portal shell | System fonts and reduced motion |
| `portal/src/app.js` | Browser app plus small pure navigation/search/filter helpers | Phase 2 / Tasks 2–3 | Generated portal | CommonJS-testable helper exports |
| `scripts/build-portal.js` | Validate, normalize, and generate static portal output | Phase 2 / Task 1 | Build wrapper and checks | No timestamps or network |
| `scripts/build-portal.sh` | Obvious portal build entry point | Phase 2 / Task 1 | Local/static hosting | Default output `portal/generated` |
| `scripts/check-portal.js` | Focused generation, references, anchor, and portal contract checks | Phase 2 / Task 3; Phase 3 hardening | Shell check | Node built-ins only |
| `scripts/check-portal.sh` | Build-temp, freshness, syntax, and focused behavior check | Phase 2 / Task 3 | Developer/CI use | Remains focused; umbrella invokes it |
| `portal/generated/` | Deterministic checked-in static output | Phase 2 / Tasks 1–3 | `file://` and static hosting | Generated; do not hand-edit |
| `docs/agent-toolbelt-v2-portal-plan.md` | Durable workflow state | All phases | Fresh-context handoff | This plan |
| `.atb-work/dev-lite/agent-toolbelt-v2-portal/*` | Brief, report, and progress scratch state | Phase 1 | Local only; ignored | Remove only after final phase review |

## Current State

Status: Ready for parent final review

Current Phase: Phase 3 — Integration and release hardening

Current Task: Phase 3 portal correction handoff — parent final review and verification

Current Branch: `dev/agent-toolbelt-v2-portal`

Last Updated: 2026-09-07

Last Completed Step: Diagnosed and fixed generated-portal search initialization, added catalog-driven category walkthrough, regenerated output, and completed browser/package validation.

Next Step: Parent reviews the Phase 3 output and decides whether to proceed to any later release or PR workflow.

Resume Instructions: Read this plan and `.atb-work/dev-lite/agent-toolbelt-v2-portal/phase-3-report.md`, inspect the final diff and evidence, then begin only an explicitly approved follow-up. Keep plugin manifests, skill exposure, default commands/hooks suppression, and `SKILL.md` files unchanged.

## Activity Log

| Date | Agent/Owner | Action | Evidence / Links | Next Step |
|---|---|---|---|---|
| 2026-09-07 | Luna High | Created focused branch and ignored task workspace; preserved dirty conversion changes | `git status --short`, branch `dev/agent-toolbelt-v2-portal` | Define catalog schema and metadata |
| 2026-09-07 | Luna High | Added canonical JSON catalog for 32 skills, taxonomy, six workflows, host policy, and tooling lifecycle audit | `catalog/agent-toolbelt.json`, `scripts/validate-catalog.js` | Generate and freshness-check audit |
| 2026-09-07 | Luna High | Added narrow reader, validator, shell wrapper, generated audit, and negative-path checks | `scripts/check-catalog.sh`, `docs/skill-taxonomy-audit.md` | Parent review and Phase 1 handoff |
| 2026-09-07 | Luna High | Applied review corrections: strict non-empty/duplicate validation, structured host records, specialized AI Feature Delivery status, and checked-in negative fixtures | `scripts/test-validate-catalog.js`, `catalog/agent-toolbelt.json` | Final Phase 1 verification |
| 2026-09-07 | Luna High | Phase 2 explicitly approved; moved plan state to offline static portal implementation with generated output and focused app checks | `portal/src/`, `portal/generated/`, `scripts/build-portal.js` | Add normalized build and shell |
| 2026-09-07 | Luna High | Implemented responsive offline portal, deterministic build, generated payload, pure app checks, output checks, and Chrome desktop/mobile smoke screenshots | `portal/src/`, `portal/generated/`, `scripts/check-portal.sh`, `.atb-work/dev-lite/agent-toolbelt-v2-portal/portal-*.png` | Parent review and Phase 2 handoff |
| 2026-09-07 | Luna High | Started Phase 2 review-correction pass for build safety, accessibility, copy/theme behavior, curated discovery, and centralized host setup | Parent review findings; no plugin-boundary changes | Tighten sources, catalog, tests, and regenerate output |
| 2026-09-07 | Luna High | Completed review corrections: safe known-file output replacement, explicit theme state, dialog/card/copy accessibility, curated discovery tags, catalog-owned host setup/templates, tooling disclosure, tests, and refreshed screenshots | `scripts/check-portal.sh`, `scripts/check-catalog.sh`, `.atb-work/dev-lite/agent-toolbelt-v2-portal/portal-*.png` | Parent review and Phase 2 handoff |
| 2026-09-07 | Luna High | Started Phase 2 review-correction pass for build safety, accessibility, copy/theme behavior, curated discovery, and centralized host setup | Parent review findings; no plugin-boundary changes | Tighten sources, catalog, tests, and regenerate output |
| 2026-09-07 | Luna High | Completed Phase 3 hardening: fixed Browse anchor validation and announceable/failure-aware copy status, made package check umbrella catalog and portal checks, clarified documentation ownership, and expanded path-validated tooling audit | `scripts/check-plugin-package.sh`, `scripts/check-portal.sh`, `scripts/check-catalog.sh`, `catalog/agent-toolbelt.json`, generated audit | Parent final review |
| 2026-09-08 | Luna High | Diagnosed the portal correction from a real generated `file://` browser: `#browse` had replaced `#skills-grid`, so app initialization stopped before rendering cards; restored the grid ID, added catalog-driven category guidance/buckets, compact search layout, browser smoke, and fresh screenshots | `portal/src/`, `catalog/agent-toolbelt.json`, `scripts/test-portal-browser.js`, Chrome smoke: 32 initial cards, `discovery` → 6 cards, bucket expansion | Parent final review |

## Phase 1: Foundation Catalog and Audit

### Goal

Create a truthful, deterministic discovery catalog for the existing 32 skills,
common workflows, host compatibility, and remaining tooling surfaces, plus a
generated audit that exposes documentation gaps and targeted recommendations.

### Tasks

- [x] Task 1: Define `catalog/agent-toolbelt.json` with 32 skill entries, taxonomy, workflows, host policy, and tooling audit.
      Files: `catalog/agent-toolbelt.json`
      Interfaces: canonical skills and future portal consumers
      Test work: catalog validator catches count, IDs, categories, metadata, and references
      Status: Complete
      Evidence: `node scripts/validate-catalog.js`; temporary duplicate-ID, broken-related-reference, and broken-next-step mutations were caught.
- [x] Task 2: Add shared narrow catalog reader, validator, and shell wrapper.
      Files: `scripts/catalog-lib.js`, `scripts/validate-catalog.js`, `scripts/check-catalog.sh`
      Interfaces: Node CommonJS and repository check conventions
      Test work: deterministic negative fixtures or temporary mutations for each required invariant
      Status: Complete
      Evidence: `scripts/check-catalog.sh` passed with strict metadata, duplicate, host, canonical count, and reference checks; `scripts/test-validate-catalog.js` covers isolated negative fixtures.
- [x] Task 3: Generate and freshness-check the comprehensive taxonomy audit.
      Files: `scripts/generate-skill-taxonomy-audit.js`, `docs/skill-taxonomy-audit.md`
      Interfaces: catalog + canonical metadata
      Test work: generated output matches tracked file; stale output fails
      Status: Complete
      Evidence: `scripts/check-catalog.sh` confirmed `docs/skill-taxonomy-audit.md` is current and negative tests detect stale/generation failures.

### Expected Commits

- No commit in this user-requested execution phase.

### Tests / Checks

- `scripts/check-catalog.sh`
- `scripts/check-portal.sh` and `scripts/check-plugin-package.sh` umbrella run
- official Codex plugin validator
- strict Claude manifest/marketplace validation and isolated Claude/Codex local marketplace smoke
- existing plugin/build/skill checks
- installer list/dry-run, shell/Node syntax, and `git diff --check`

### Risks

- Catalog metadata can become stale as skills evolve; freshness checking and
  canonical derivation reduce duplicated drift.
- `ai-feature-delivery` contains specialized regulated/SDD-era assumptions; the
  catalog must flag this honestly without changing its implementation.

### Phase Review Checklist

- [x] All 32 canonical skills represented exactly once
- [x] Taxonomy and workflows are useful without forcing every skill into a workflow
- [x] Host policy and tooling audit are explicit and truthful
- [x] Validator negative cases cover every required invariant
- [x] Generated audit is current and readable
- [x] Existing plugin/install checks remain green

## Phase 2: Offline Static Portal

### Goal

Make the validated catalog useful to first-time and experienced users through a
polished static portal that works offline and links back to canonical skills.

### Style and implementation packet

- Authority: `shared/contracts/references/style-precedence.md` and
  `shared/contracts/references/anti-slop-naming.md`.
- Representative neighbors: `scripts/check-plugin-package.js`,
  `scripts/generate-skill-taxonomy-audit.js`, and `scripts/test-validate-catalog.js`.
- Vocabulary: skill, catalog, workflow, host, plugin skill, optional utility,
  compatibility tool, generated portal.
- Boundary: Node built-ins/CommonJS and Bash wrappers; no package manager,
  framework, network runtime, or external assets.
- Test strategy: pure app helper checks plus deterministic generated-output,
  reference, syntax, and offline URL checks; no browser dependency assumed.
- Assumption: the tracked generated folder is the source of direct `file://`
  use and static hosting, while `portal/src/` remains the authored source.

### Tasks

- [x] Task 1: Build normalized static portal output from canonical metadata and catalog.
      Files: `portal/src/index.html`, `portal/src/app.js`, `scripts/build-portal.js`, `scripts/build-portal.sh`, `portal/generated/`
      Test work: build to a temporary directory, validate source references and deterministic output
      Status: Complete
      Evidence: `scripts/build-portal.sh`, `scripts/check-portal.js`, and deterministic temp-output comparison passed.
- [x] Task 2: Implement responsive discovery UI, workflows, host guidance, and progressive skill details.
      Files: `portal/src/styles.css`, `portal/src/index.html`, `portal/src/app.js`
      Test work: pure search/filter/hash/invocation tests and static accessibility/reference checks
      Status: Complete
      Evidence: `portal/src/index.html`, `portal/src/styles.css`, and `portal/src/app.js`; helper tests and Chrome screenshots passed.
- [x] Task 3: Add portal checks, generated freshness, and final Phase 2 verification.
      Files: `scripts/check-portal.js`, `scripts/check-portal.sh`, `portal/generated/`
      Test work: deterministic rebuild, output references, no remote dependencies, existing repository checks
      Status: Complete
      Evidence: `scripts/check-portal.sh` plus full catalog/plugin/build/skill/Codex/syntax/diff checks passed.
- [x] Review corrections: harden generated-output safety, fix theme/dialog/card/copy behavior, add curated discovery tags and host setup, and extend focused tests.
      Files: `catalog/agent-toolbelt.json`, `scripts/build-portal.js`, `portal/src/`, `scripts/check-portal.js`, `scripts/test-portal-app.js`
      Test work: sentinel-preserving build, theme/dialog/card/copy helper checks, catalog template/tag validation, refreshed screenshots
      Status: Complete
      Evidence: Safe sentinel-preserving build, theme/template/discovery/dialog/copy assertions, full checks, and refreshed Chrome screenshots passed.

### Phase 2 acceptance criteria

- [x] Product header explains Agent Toolbelt as independent/general-purpose and names the three supported hosts.
- [x] Start Here, Find a Skill, Common Workflows, and Browse All Skills are prominent and useful without a mandatory wizard.
- [x] Search, category/tag filters, no-results/clear behavior, 32 responsive skill cards, keyboard focus, and progressive detail are functional.
- [x] All six workflows render real clickable stages with rationale, example invocation, and next steps.
- [x] Host guidance is centralized and generates Cursor, Claude Code, and Codex invocations without treating commands/hooks as native skills.
- [x] Tooling surfaces are separated from plugin skills, with specialized `ai-feature-delivery` discoverable but not primary onboarding.
- [x] Light/dark mode, responsive layout, semantic labels, escape behavior, reduced motion, and skill/workflow deep links work offline.
- [x] Generated output is deterministic, direct-openable via `file://`, fresh, and covered by focused checks.

## Phase 3: Integration and Release Hardening

### Goal

Finish the bounded integration work after portal review while preserving the
skills-only native plugin surface and the existing project-scoped installer.

### Tasks

- [x] Fix and validate the Browse all same-page anchor, announce copy status,
      and report clipboard fallback failure accurately.
      Status: Complete
      Evidence: `scripts/check-portal.sh` and `scripts/test-portal-app.js` cover
      authored/generated anchors, `#browse`, status semantics, and failure text.
- [x] Make `scripts/check-plugin-package.sh` the umbrella check by invoking the
      focused catalog and portal checks without recursion.
      Status: Complete
      Evidence: `scripts/check-plugin-package.sh` output shows both focused
      checks and the host/package checks pass.
- [x] Clarify README/docs/wiki ownership and reduce the manual skills catalog;
      mark AI Feature Delivery as a specialized compatibility lane.
      Status: Complete
      Evidence: `README.md`, `docs/README.md`, `wiki/*.md`, `commands/README.md`,
      `skills/README.md`, and `workflows/README.md` point discovery to the portal
      and behavior to `SKILL.md`.
- [x] Expand the tooling audit with concrete required and intentionally absent
      paths and validate those paths deterministically.
      Status: Complete
      Evidence: `catalog/agent-toolbelt.json`, `scripts/validate-catalog.js`,
      `scripts/test-validate-catalog.js`, and the regenerated audit pass.

### Phase 3 acceptance criteria

- [x] Native manifests remain unchanged in identity, 32-skill exposure, command
      suppression, and default hook suppression.
- [x] Portal and catalog checks remain focused and deterministic; the umbrella
      package check does not recurse.
- [x] Documentation establishes portal/catalog, wiki/docs, `SKILL.md`, commands,
      and generated-audit ownership without duplicating the 32-skill catalog.
- [x] Tooling audit covers installer, contributor config, support content,
      operational docs, maintainer material, specialized AI Feature Delivery
      assets, and portal/catalog surfaces.

### Portal correction follow-up

- [x] Repair the generated portal search root cause and preserve the `#browse`
      anchor without replacing the app's `#skills-grid` target.
      Status: Complete
      Evidence: Chrome smoke renders 32 initial cards and filters `discovery`
      to six cards with an updated result summary.
- [x] Add validated category guidance and an accessible one-bucket-at-a-time
      walkthrough with generated skill cards and existing detail navigation.
      Status: Complete
      Evidence: catalog validation, app tests, browser smoke, and desktop/mobile
      screenshots pass.
- [x] Keep search compact, responsive, and composed with bucket filtering;
      regenerate and rerun all package checks.
      Status: Complete
      Evidence: `scripts/check-portal.sh`, `scripts/check-catalog.sh`, umbrella
      checks, host validators, syntax checks, and `git diff --check` pass.

## State Reconciliation Checklist

- [x] `Current Phase` matches the phase containing the next incomplete task.
- [x] `Current Task` matches the next incomplete task.
- [x] `Last Completed Step` matches the latest Activity Log entry.
- [x] `Next Step` and `Resume Instructions` point to the same action.
- [x] Task status and evidence agree with the checks actually run.

## PR / Branch Status

Work Branch: `dev/agent-toolbelt-v2-portal`

PR Target Branch: `main`

PR URL: Not created

Final PR Review Result: Not Started

Code Quality Gate Result: Not Started

Code Quality Gate Evidence Path: Not applicable in Phase 1
