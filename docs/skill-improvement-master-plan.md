# Skill Improvement Master Plan

Date: 2026-07-01

This master plan merges the two skill review passes into one working plan. When
both plans recommend the same change, this document keeps it as a consolidated
recommendation. When one plan adds something the other does not, this document
keeps it. Previously open decision points are now resolved and should drive the
implementation order below.

## Executive Summary

The skill set is healthy: the repo has a clear skill inventory, most complex
skills already use `references/`, and the large workflows are below the rough
progressive-disclosure danger zone. The main improvements are not about making
skills smaller for its own sake. They are about making invocation more
predictable, keeping always-loaded context focused, and clarifying which file is
authoritative for each behavior.

The highest-value edits are:

1. Tighten overloaded `description` fields.
2. Align invocation claims with actual frontmatter behavior.
3. Move mode-specific, harness-specific, and provenance/reference-only material
   out of top-level `SKILL.md` files.
4. Standardize mutation/posting policies for report-only and apply-on-opt-in
   skills.
5. Create a shared reference pack so cross-pack contracts are fixed once instead
   of patched skill-by-skill.
6. Add Codex, Claude Code, and Cursor metadata after runtime cleanup.
7. Add validation checks so the skill shape stays healthy after this pass.

## Resolved Decisions

- Description budget: use the recommended rule. Aim for 35 words; enforce 45
  words as the default hard budget unless a distinct trigger branch or
  competing-skill exclusion earns the extra load.
- Metadata timing: clean runtime skills first, then generate host metadata from
  the cleaned names, descriptions, and prompts.
- Metadata scope: cover Codex, Claude Code, and Cursor where each host has a
  real package or metadata surface. Do not stop at `agents/openai.yaml`.
- Cross-pack contracts: build a shared reference pack now. Avoid one-off sibling
  reference patches that will need to be revisited.
- Provenance: use one repo-level provenance document.
- Invocation model: this repo should have no user-invoked skills. Skills are
  agent-invoked capabilities with model-facing descriptions; explicit human
  entry points are commands.

## Shared Recommendations

### 1. Normalize Skill Descriptions

Both reviews identify overloaded descriptions as a top priority. The
frontmatter `description` is the primary model-visible trigger surface, so it
should state what the skill does and the distinct branches that should trigger
it. It should not carry mode details, examples, implementation mechanics, or
full safety policy.

Highest-priority candidates:

- `skills/phase-gate/SKILL.md`
- `skills/worktree/SKILL.md`
- `skills/ticket-sync/SKILL.md`
- `skills/cover/SKILL.md`
- `skills/bug-to-fix/SKILL.md`
- `skills/pr-review-reply/SKILL.md`
- `skills/review-queue/SKILL.md`
- `skills/retrofit/SKILL.md`
- `skills/simplify/SKILL.md`
- `skills/ship-it/SKILL.md`

Target pattern:

```yaml
description: <what it does>. Use when <clear triggers>. Avoid for <nearest competing skills>.
```

Default budget: roughly 25-45 words. A longer description is acceptable only
when it carries a distinct trigger branch that prevents a real misfire.

Completion criterion: each description contains the skill identity, trigger
branches, and essential routing exclusions only.

### 2. Move Mode-Specific Detail Out Of Large Top-Level Skill Files

Both reviews identify the same large orchestration skills as candidates for
more progressive disclosure:

- `dev-lite-workflow`: 223 lines
- `phase-context-workflow`: 158 lines
- `pr-review`: 157 lines
- `review-on-open`: 127 lines
- `phase-gate`: 112 lines
- `worktree`: 104 lines
- `review-queue`: 102 lines

Recommended split:

- Keep top-level `SKILL.md` focused on workflow selection, invariants, gates,
  completion criteria, and a direct reference map.
- Move sub-mode procedure into references such as
  `references/planning.md`, `references/phase-review.md`,
  `references/modes.md`, `references/install-and-harness.md`, or existing
  branch-specific references.
- Ensure every reference is linked from `SKILL.md` with precise "read when"
  wording.

Priority applications:

- `dev-lite-workflow`: keep planning approval, living plan rule, branch safety,
  and current-state preservation inline; move harness notes, scratch ledger
  detail, optional subagent dispatch, and commit/review details to references.
- `phase-context-workflow`: keep durable phase context and file map inline; move
  exact command recipes, storage variants, and future CLI notes to references.
- `pr-review`: keep tier choice, reviewer safety, and execution skeleton inline;
  move benchmark/token-cost narrative and detailed anti-noise memory mechanics
  deeper if top-level length is reduced.
- `review-on-open`: keep event-vs-poller decision rules inline; move CI setup
  and poller mechanics fully behind branch references.
- `phase-gate`: keep gate purpose and team-vs-solo choice inline; move merge
  mechanics and detailed mode procedures to references.
- `worktree` and `review-queue`: keep the operational model inline; move CLI,
  layout, storage, and flag details to references.

### 3. Create A Shared Reference Pack For Cross-Pack Contracts

Both reviews call out sibling-skill references as a reliability risk for
standalone installs. Current examples include:

- `pr-review-reply` referencing `skills/pr-review/references/providers.md`
- `review-on-open` referencing `skills/pr-review/references/providers.md`
- `phase-gate` referencing `skills/pr-review/references/targets-and-diff.md`
- `review-queue` referencing `skills/pr-review/SKILL.md`
- `pr-review` installing `simplify/references/smell-taxonomy.md` without the
  whole `simplify` skill.

Resolved approach: create a shared reference pack that owns reusable contracts
needed by more than one skill. Dependent skills should point to that shared pack
instead of reaching into another skill's private `references/` tree.

Initial shared pack candidates:

- Host/provider abstraction for GitHub, Azure Repos, and generic git.
- PR comment/posting confirmation and idempotency contract.
- Untrusted-input boundary for PR diffs, comments, issue text, logs, and remote
  tracker data.
- Optional graph/RCT acceleration contract.
- Shared maintainability taxonomy if it remains consumed by both `pr-review`
  and `simplify`.

Packaging guidance from upstream patterns:

- Superpowers keeps host package metadata explicit and validates plugin sync and
  marketplace manifests. Mirror that discipline by making the shared pack a
  first-class installable unit with tests, not an implicit copied file.
- Gstack uses carved/sectioned shared material with manifest consistency tests.
  For this repo, a simpler manifest can list shared reference files, their
  owner, and which packs consume them.
- GSD Core uses a broad shared `references/` surface and golden install parity
  fixtures. Use that idea for install checks: each standalone pack install
  should include the shared references it links to, and hashes/fixtures should
  catch drift.

Implementation shape:

```text
shared/contracts/
  references/providers.md
  references/posting.md
  references/untrusted-input.md
  references/graph-acceleration.md
  references/maintainability-taxonomy.md
  manifest.json             # file ownership + consumer packs
```

Keep support-only shared contracts out of `skills/` so they are not mistaken for
runtime skills. If a shared contract later needs agent discovery on its own,
promote that branch into a real model-visible skill with a concise
`description`; otherwise install the files as pack support material.

Completion criterion: a dry-run or real standalone install leaves no dead
`skills/...` references in installed files, and shared contracts are installed
through the manifest rather than by ad hoc file copies.

### 4. Clarify `SKILL.md` As Router, Invariants, And Reference Map

Both reviews converge on the same target shape:

```text
skill-name/
  SKILL.md                 # trigger-loaded router, invariants, gates, reference map
  agents/openai.yaml       # host metadata if adopted for that host
  references/*.md          # mode-specific and provider/framework details
  bin/ or scripts/         # deterministic fragile/repeated operations
```

Top-level skill files should answer:

- Should this skill run for this user request?
- Which branch/mode should run?
- What invariants and safety gates always apply?
- What is the completion criterion?
- Which reference should be loaded next, and under what condition?

They should usually not carry:

- Harness install documentation.
- Full CLI flag contracts.
- Long examples.
- Provider-specific mechanics.
- Credits/provenance.
- Optional acceleration mechanics that apply only when a tool exists.

## Recommendations From Plan A Only

### 5. Add Host Metadata After Runtime Cleanup

Plan A recommends adding `agents/openai.yaml` for UI-facing skill lists and
chips. The resolved scope is broader: after runtime cleanup, add or update the
metadata surfaces for Codex, Claude Code, and Cursor where this repo actually
ships that host surface.

Add it first for high-traffic skills:

- `dev-lite-workflow`
- `pr-review`
- `bug-to-fix`
- `shape-up`
- `simplify`
- `cover`
- `ship-it`
- `handoff`

Initial fields:

- `display_name`
- `short_description`
- `default_prompt`

Host targets to evaluate:

- Codex: `agents/openai.yaml` and any tracked or generated Codex plugin
  manifest/marketplace metadata if this repo starts shipping one.
- Claude Code: `.claude-plugin/plugin.json` or the equivalent installed skill
  metadata if this repo ships a Claude package surface.
- Cursor: `.cursor-plugin/plugin.json` and generated private Cursor plugin
  metadata from `build-cursor-plugin.sh`.

Avoid optional icon/color fields unless the project intentionally standardizes
them. Generate host metadata from the cleaned skill descriptions so metadata
does not drift immediately after the runtime cleanup.

### 6. Standardize Mutation Policy

Plan A explicitly calls out report-only vs apply-mutating behavior. Plan B
touches the same theme through confirmation gates, but does not propose a
standard section.

Skills that should get a consistent mutation/posting policy:

- `cover`
- `simplify`
- `tech-backlog-assessment`
- `ticket-discovery`
- `pr-review`
- `pr-review-reply`
- `ticket-sync`
- `retrofit`
- `ship-it`

Recommended section:

```md
## Mutation Policy

Default: report-only.
Edit files only when the user explicitly asks to apply the change.
Posting to external systems requires confirmation unless running in a configured
unattended mode.
```

Adjust wording only where the skill truly differs. For example, `ship-it`
should distinguish preparing release artifacts from actually deploying, and
`ticket-sync` should distinguish dry-run planning from confirmed tracker writes.

### 7. Add A Validation Script For Skill Shape

Plan A proposes a lightweight validation script. Plan B proposes acceptance
checks that can be folded into the same script.

The script should check:

- Every `SKILL.md` has required frontmatter.
- Description word count stays under the chosen budget, or is explicitly
  allowlisted.
- Referenced `references/*.md` files exist.
- Standalone pack installs include shared contract references they mention.
- No misleading invocation claims remain.
- No top-level provenance or optional-acceleration sediment remains after the
  refactor.
- Mirrored skill copies stay in sync, especially `dev-lite-workflow`.

## Recommendations From Plan B Only

### 8. Align Invocation Claims With The Repo Invocation Model

Plan B identifies an invocation mismatch that Plan A does not call out.

Affected skills:

- `skills/shape-up/SKILL.md`
- `skills/bug-to-fix/SKILL.md`
- Potentially any command-backed skill intended to fire only by explicit user
  command.

Resolved model: this repo should have no user-invoked skills. Skills are
agent-invoked capabilities with model-facing descriptions. Human-triggered
entry points belong in `commands/`.

Issue: every current `SKILL.md` has a model-visible `description`, but some
bodies describe themselves or their sub-steps as "user-invoked" or
"model-invoked" in ways that do not match the desired model. This creates mixed
signals.

Recommendation:

- Keep model-facing `description` frontmatter for skills.
- Remove `disable-model-invocation` from the target design unless a future host
  requires it for non-runtime support files.
- Replace "user-invoked" with "command entry point", "human-started command",
  or "manual command" when describing slash commands.
- Keep command files as the explicit human interface and skill files as the
  agent process/reference interface.

Completion criterion: `rg -n "user-invoked|model-invoked|Invocation" skills/*/SKILL.md`
shows no misleading invocation claims.

### 9. Move Credits, Provenance, And Optional Acceleration Out Of Top-Level Skills

Plan B calls this out as sediment. Plan A mentions optional RCT acceleration for
`bug-to-fix`, but does not propose removing top-level provenance.

Affected skills:

- `bug-to-fix`
- `simplify`
- `ship-it`
- `handoff`
- `worktree`
- `pr-review-reply`
- `review-on-open`
- `retrofit`
- `shape-up`
- Skills with `references/rct-acceleration.md`

Recommendation:

- Move credits into `docs/skill-provenance.md` or per-skill
  `references/provenance.md`.
- Keep only license-required or operationally necessary attribution inline.
- Consider one shared optional acceleration reference, with top-level skills
  pointing to it only when graph tooling is available.

Completion criterion: top-level `SKILL.md` files do not spend runtime context on
provenance or optional acceleration details unless those details change the
current run.

### 10. Clarify Single Source Of Truth Between Commands And Skills

Plan B identifies command/skill duplication more directly than Plan A.

Affected packs:

- `dev-lite-workflow`
- `ai-feature-delivery`
- `bug-to-fix`
- `pr-review`
- `phase-gate`
- `shape-up`
- `cover`
- `simplify`

Authority model:

- Command files own argument syntax and user-facing entry text.
- `SKILL.md` owns process, gates, mutation policy, and output contracts.
- References own provider/framework mechanics, long examples, and branch-only
  detail.

Completion criterion: a maintainer can tell where to edit a behavior without
searching every matching command, skill, and reference file.

### 11. Strengthen Completion Criteria In Planning And Discovery Skills

Plan B adds a predictable "done" bar for planning/discovery skills.

Affected skills:

- `shape-up`
- `tech-backlog-assessment`
- `ticket-discovery`
- `ai-feature-delivery`

Recommended bars:

- `shape-up`: approved brief has no unresolved overloaded terms, unanswered
  scope boundary, or `TBD`.
- `tech-backlog-assessment`: recommendation includes confidence, rejected
  options, concrete repo evidence, test strategy, risks, and next workflow.
- `ticket-discovery`: every referenced precedent has a path/command citation or
  is explicitly not found.
- `ai-feature-delivery`: every gate-ready claim has feature ID, release scope,
  reviewer list, test evidence, and doc-delta state.

### 12. Normalize Leading Words Across The Skill Family

Plan B adds this as a predictability tool. Plan A did not address leading words
directly.

Keep and strengthen existing leading words:

- `traceable` / Feature Master Record in `ai-feature-delivery`
- `diagnostic`, `root cause`, and `verified fix` in `bug-to-fix`
- `pin behavior` in `cover`
- `gate` in `phase-gate`
- `round-trip` in `pr-review-reply`
- `adapter` in `ticket-sync`
- `worktree per task` in `worktree`
- `reversible, observable, incremental` in `ship-it`
- `behavior-preserving cleanup` in `simplify`
- `durable phase context` in `phase-context-workflow`

Use the strongest leading word in each description and body, then remove
sentence-level restatements that say the same thing.

## Closed Decision Points

These decisions are resolved and should drive implementation.

### A. Description Budget: 35 Words Or 45 Words?

Plan A suggests 25-45 words. Plan B suggests roughly 35 words unless a distinct
trigger branch earns more.

Recommended decision: use 45 words as the hard default budget and treat 35 as
the target. Allowlist only descriptions that need an extra competing-skill
exclusion.

### B. Add UI Metadata Now Or After Runtime Cleanup?

Plan A recommends `agents/openai.yaml` early. Plan B focuses on runtime
predictability first.

Recommended decision: do runtime cleanup first, then generate metadata from the
cleaned descriptions so UI fields do not immediately drift. Cover Codex, Claude
Code, and Cursor metadata surfaces where applicable.

### C. Shared Reference Pack Or Local Stable Contracts?

Both plans want less cross-pack fragility, but the mechanism is open.

Options:

- Shared reference pack: less duplication, but adds install/package complexity.
- Local stable contracts: simpler standalone installs, but repeats a small
  amount of text.
- Installer dependency checks only: lowest effort, but does not reduce coupling.

Recommended decision: create a shared reference pack now. Use upstream patterns
as guardrails: explicit host manifests and sync tests from Superpowers,
manifest-driven carved sections and validation from Gstack, and shared
references plus golden install parity from GSD Core.

### D. Provenance Location

Plan B proposes repo-level or per-skill provenance references. Plan A does not
discuss provenance.

Options:

- Repo-level `docs/skill-provenance.md`: easiest to maintain and keeps runtime
  skills clean.
- Per-skill `references/provenance.md`: closest to each skill, but more files.

Recommended decision: create one repo-level provenance document and link to it
from contributor docs, not runtime skill files.

### E. `disable-model-invocation` Adoption

Plan B raises the possibility of truly user-invoked skills. The resolved repo
model rejects that split for runtime skills.

Recommended decision: no user-invoked skills. Skills remain model-visible and
agent-invoked. If a human needs an explicit trigger, provide a command that
loads or points to the skill.

## Per-Skill Master Notes

| Skill                     | Consolidated next edit                                                                                                                                                                                   |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ai-feature-delivery`     | Add concise contrast with `dev-lite-workflow`; strengthen gate-ready completion bars; consider UI metadata.                                                                                              |
| `bug-to-fix`              | Shorten description; fix invocation wording; move credits and optional acceleration out of top level; keep RCA/repro gates prominent.                                                                    |
| `cover`                   | Shorten description; keep behavior-pinning as leading word; standardize mutation policy; move red/green details deeper if needed.                                                                        |
| `dev-lite-workflow`       | Split harness notes, scratch ledger, subagent dispatch, branch safety detail, and review/commit rules into references while preserving planning gate and living plan rule inline. Add UI metadata later. |
| `handoff`                 | Keep compact; move credits out; add UI metadata; resolve save-location wording against phase-context tracked handoffs.                                                                                   |
| `phase-context-workflow`  | Move lifecycle command detail, storage variants, and future CLI note to references; keep durable file map and reset-safety rules inline.                                                                 |
| `phase-gate`              | Shorten description sharply; keep gate purpose inline; move team/solo merge mechanics to `references/merge.md` or `references/modes.md`.                                                                 |
| `pr-review`               | Preserve mature reference/facet architecture; move benchmark/token-cost narrative and some rejection-memory detail deeper; add UI metadata later.                                                        |
| `pr-review-reply`         | Shorten description; route provider/posting references through the shared reference pack.                                                                                                                |
| `retrofit`                | Add explicit mutation policy; move credits out; strengthen "all sites accounted for" completion criterion.                                                                                               |
| `review-on-open`          | Keep event vs poller decision rule inline; move CI/poller setup details into references; route provider/posting references through the shared reference pack.                                             |
| `review-queue`            | Shorten description; add a one-command quick start; move CLI/storage/flag detail to references.                                                                                                          |
| `shape-up`                | Replace user-invoked language with command-entry wording; add brief completeness checklist; add UI metadata later.                                                                                       |
| `ship-it`                 | Add "not deployment automation when pipeline owns deploy" boundary; move credits out; keep rollback trigger central.                                                                                     |
| `simplify`                | Standardize mutation policy; move credits out; keep shared smell taxonomy as source of truth with `pr-review`.                                                                                           |
| `tech-backlog-assessment` | Add stronger trigger contrast with `ticket-discovery` and `shape-up`; strengthen output completion bar; split checklist only if it grows.                                                                |
| `ticket-discovery`        | Add precedent-proven-by-path/command hard gate; add one or two trigger examples; split output contract only if adoption grows.                                                                           |
| `ticket-sync`             | Shorten description; standardize dry-run/apply policy; keep provider mechanics in references; consider CLI/script only if sync becomes fragile.                                                          |
| `webapp-testing`          | Keep compact; add evidence completion convention if screenshots/traces become shared across workflows.                                                                                                   |
| `worktree`                | Shorten description; move branch/worktree policy, layout, and CLI details into `references/isolation.md` and `references/cli.md`.                                                                        |

## Implementation Order

1. Fix invocation wording to match the no-user-invoked-skills model.
2. Tighten descriptions over the word budget.
3. Standardize mutation policy for report-only/apply-on-opt-in skills.
4. Design and install `shared-contracts` as a first-class shared reference pack.
5. Move top-level provenance, credits, and optional acceleration details out of
   runtime skill files.
6. Refactor the largest top-level skills into router/invariants/reference-map
   shape.
7. Clarify command vs skill vs reference ownership in contributor docs.
8. Audit and validate cross-pack references for standalone installs.
9. Strengthen completion criteria in planning/discovery skills.
10. Normalize leading words while pruning duplicated explanatory sentences.
11. Add Codex, Claude Code, and Cursor metadata for high-traffic skills using
    the cleaned descriptions.
12. Add or extend validation scripts to enforce the agreed skill shape.

## Acceptance Checks

- `rg -n "user-invoked|model-invoked|Invocation" skills/*/SKILL.md` has no
  misleading invocation claims.
- All non-allowlisted descriptions are at or under the chosen word budget.
- `rg -n "Credits|Lifts concepts|optional.*rct|future .*CLI" skills/*/SKILL.md`
  returns no top-level sediment that should live in references or docs.
- Report/apply skills have a consistent mutation policy.
- No runtime skill uses `disable-model-invocation` unless a future support-only
  artifact is intentionally excluded from agent invocation.
- Dry-run standalone installs include shared-contract references via the shared
  pack manifest, with no ad hoc sibling private-reference copies.
- Referenced `references/*.md` files exist.
- `scripts/check-skill-sync.sh` passes after edits.
- Codex, Claude Code, and Cursor metadata, where applicable, is generated from
  the final cleaned skill descriptions.
