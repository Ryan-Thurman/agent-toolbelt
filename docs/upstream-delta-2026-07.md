# Upstream Delta Report - July 2026

This report is the source of truth for the upstream-borrow pass. It records the
watched ranges inspected, the local ideas worth lifting, and the ideas rejected
for scope, license, or product-fit reasons.

## Scope

| Source | Local path | Range inspected | License note |
|---|---|---|---|
| Kodus AI | `repos/pull-request-repos/kodus-ai` | `db1f89de6..1f0ccd78d` | Dual licensed; most source is AGPL-3.0 and `.ee.`/`ee/` paths are commercial. Lift concepts only. |
| Open Code Review | `repos/pull-request-repos/open-code-review` | `7128562..d8dfa3b` | Apache-2.0. Still prefer local wording and structure. |
| PR-Agent | `repos/pull-request-repos/pr-agent` | Supporting reference | Apache-2.0. Use prompt architecture ideas, not code. |
| GSD Core | `repos/skills-repo/gsd-core` | `eb81faae..251cfa1f` | MIT. Borrow concepts with local workflow fit. |
| Gstack | `repos/skills-repo/gstack` | `a861c00c..11de390b` | MIT. Borrow installer/workflow ideas selectively. |
| Superpowers | `repos/skills-repo/superpowers` | `896224c..f268f7c` | MIT. Borrow process and packaging discipline selectively. |
| Skills by Matt Pocock | `repos/skills-repo/skills-mattpocock` | `6eeb81b..0877403` | MIT. Borrow skill-authoring and review taxonomy ideas selectively. |

## High-Signal Files Inspected

- Kodus AI:
  - `libs/code-review/infrastructure/agents/base-code-review-agent.provider.ts`
  - `libs/code-review/infrastructure/agents/base-code-review-agent.review-focus.spec.ts`
  - `libs/code-review/pipeline/stages/agent-review.stage.diff-boundary.spec.ts`
  - `libs/code-review/infrastructure/agents/llm/dedup-prompt.ts`
  - `evals/results/README.md`
  - `evals/results/record.js`
- Open Code Review:
  - `packages/agents/skills/ocr/SKILL.md`
  - `packages/agents/skills/ocr/references/workflow.md`
  - `.claude/skills/ocr-review-loop/SKILL.md`
  - `.ocr/commands/review.md`
  - `packages/shared/config/src/team-config.ts`
- GSD Core:
  - `gsd-core/references/planner-guidance.md`
  - `gsd-core/references/honest-verifier.md`
  - `capabilities/assumption-delta/fragments/plan-pre.md`
  - `docs/adr/1817-state-md-rebuild-derivability-contract.md`
  - `docs/contributing/cross-platform-portability-rules.md`
  - `tests/fixtures/golden-install-parity/codex.json`
- Gstack:
  - `scripts/resolvers/preamble/generate-first-run-guidance.ts`
  - `bin/gstack-first-task-detect`
  - `bin/gstack-redact-prepush`
  - `test/preamble-first-task-scaffold.test.ts`
  - `test/bin-windows-bun-import-paths.test.ts`
- Superpowers:
  - `skills/writing-plans/SKILL.md`
  - `skills/writing-plans/plan-document-reviewer-prompt.md`
  - `skills/subagent-driven-development/SKILL.md`
  - `skills/subagent-driven-development/task-reviewer-prompt.md`
  - `.codex-plugin/plugin.json`
  - `tests/codex/test-marketplace-manifest.sh`
- Skills by Matt Pocock:
  - `skills/productivity/writing-great-skills/GLOSSARY.md`
  - `skills/in-progress/review/SKILL.md`
  - `skills/engineering/prototype/SKILL.md`
  - `skills/engineering/tdd/SKILL.md`
  - `.changeset/review-smell-baseline.md`
  - `.changeset/prototype-model-invoked.md`

## Now

### Dev Lite Plan Robustness

Upstream idea: Superpowers' plan writing discipline and GSD's "plans are
prompts" guidance both converge on fresh-context executability: file
responsibilities, interfaces, exact checks, and explicit constraints should be
present before implementation starts.

Local mapping:

- Update `templates/dev-implementation-plan.md`.
- Update `commands/dev-plan.md`.
- Potentially update `skills/dev-lite-workflow/SKILL.md` only if the command
  and template need matching workflow language.

Acceptance criteria covered:

- Plans become durable enough for another agent to resume a task without
  rediscovering files, tests, or interfaces.
- The workflow remains lightweight by requiring exact files/interfaces/tests,
  while limiting full code snippets to algorithmically specific or delegated
  tasks.

### Safe PR Review Focus

Upstream idea: Kodus added review directive handling with tests proving the
focus block is a priority hint, not a filter. Open Code Review similarly treats
free-text reviewer direction as scope/focus, not as authority to predetermine a
verdict.

Local mapping:

- Update `skills/pr-review/SKILL.md`.
- Update `skills/pr-review/references/targets-and-diff.md` or
  `skills/pr-review/references/review-rubric.md`.
- Update `skills/pr-review/references/output-format.md` if the final report
  needs to show the focus used.

Acceptance criteria covered:

- A user can steer attention to an area without suppressing findings elsewhere.
- Focus text is explicitly untrusted and cannot force `Approve`, downgrade a
  blocker, or override the review rubric.

### PR Review Verdict and Critic Discipline

Upstream idea: Open Code Review has a strict verdict invariant and separate
finding buckets. Kodus and PR-Agent both use a second-pass safeguard/critic to
reduce false positives and anchor findings to changed code.

Local mapping:

- Compare and update `skills/pr-review/references/output-format.md`.
- Compare and update `skills/pr-review/references/review-rubric.md`.
- Update `skills/pr-review/references/deep-tier.md` or `dual-judge.md` for a
  scoped critic pass if current wording leaves gaps.

Acceptance criteria covered:

- PR review output keeps one clear verdict.
- Blocker semantics are not diluted by suggestions.
- Standard/deep tiers get a stronger false-positive filter without bloating the
  light tier.

### Repo-Local PR Review Eval Ledger

Upstream idea: Kodus moved toward lightweight eval result capture in
`evals/results/`, while PR-Agent's self-reflection pattern shows the value of
recording scoring/filtering decisions.

Local mapping:

- Update `skills/pr-review/references/benchmarking.md`.
- Update `skills/pr-review/benchmarks/results.md`.
- Add a small markdown or JSONL convention only if it stays repo-local and
  optional.

Acceptance criteria covered:

- Review changes can be validated over time without adding a service,
  dashboard, database, or runtime dependency.

### Skill Authoring Discipline

Upstream idea: `skills-mattpocock` clarifies model-invoked vs user-invoked
skills, context load vs cognitive load, progressive disclosure, single source
of truth, and no-op pruning.

Local mapping:

- Update `skills/README.md` or local skill-creator guidance if this repo owns a
  skill-authoring section.
- Apply the checklist to a small set of existing skill descriptions before
  broad edits.

Acceptance criteria covered:

- Skill changes reduce trigger duplication and context load without making
  model-invoked skills harder to discover.

## Later

### Install Golden Parity

Upstream idea: GSD Core added golden install parity fixtures across supported
hosts. This repo already has installer smoke checks and skill-sync checks, so
golden fixtures should be added only if they catch drift the current scripts
miss.

Local mapping:

- Evaluate `install/`, `install.sh`, and `scripts/check-skill-sync.sh`.
- Add fixtures only for real current gaps.

Reason for later: useful but higher-maintenance; inspect current install risk
first.

### Codex Plugin Manifest Discipline

Upstream idea: Superpowers added Codex marketplace manifest coverage and tests
that keep host-specific packaging synchronized.

Local mapping:

- Compare `.codex/`, build output, `build-cursor-plugin.sh`, and any plugin
  manifests.
- Add manifest checks only where this repo actually ships host packages.

Reason for later: packaging value depends on the current distribution path.

### Low-Token Subagent Handoffs

Upstream idea: Superpowers uses file-based task briefs and review packets so
subagents return short results and keep context bounded.

Local mapping:

- Consider adding optional task-brief/review-package guidance to
  `skills/dev-lite-workflow/references/`.

Reason for later: useful for large work, but optional for the normal single
agent workflow.

### Architecture Review Vocabulary

Upstream idea: `skills-mattpocock` separates standards review from spec review
and uses a compact maintainability smell baseline when repo standards are thin.

Local mapping:

- Fold selected vocabulary into `skills/simplify/SKILL.md` or
  `skills/pr-review/facets/maintainability.md`.

Reason for later: avoid duplicating the existing simplify/pr-review taxonomy.

## Reject

### Full PR Review Platforms

Reject Kodus platform components, Open Code Review's CLI/dashboard/session
database, and PR-Agent provider integrations. They add services, storage, or
runtime coupling that conflict with this repo's command/skill model.

### Wholesale Upstream Prompt or Code Copies

Reject copying Kodus prompt/source text because of AGPL/commercial boundaries
and product coupling. For permissive sources, still prefer locally written
guidance that fits this repo's terminology and existing files.

### Large Persona Catalogs

Reject broad reviewer-persona catalogs for this pass. The local PR review skill
already uses facets; adding many persona options would increase prompt and
configuration load without a clear acceptance-criteria benefit.

### Heavy State Machines for Dev Lite

Reject mandatory SQLite/session-state machinery or CLI phase transitions for
Dev Lite. The local plan file and activity log are the durable state; borrow
state-rebuild and verification principles, not the machinery.

## Phase Mapping

| Phase | Now/Later items |
|---|---|
| Phase 1A | Dev Lite plan robustness |
| Phase 2 | Safe review focus, verdict/critic discipline, eval ledger |
| Phase 3 | Install parity, plugin manifest discipline, low-token handoffs |
| Phase 3A | Skill authoring discipline, architecture review vocabulary |
| Phase 4 | Final checks, sync checks, PR readiness review |

## Local Validation Notes

- All cited upstream paths above were checked against local clones.
- No upstream source code was copied into this report.
- License handling is conservative: concepts only, local wording, no AGPL or
  commercial-source reuse.
