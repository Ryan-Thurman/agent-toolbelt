# Upstream Borrow Implementation Plan

## Overview

Use the refreshed watched repos to identify and selectively adopt high-value patterns into
`agent-toolbelt`, especially for PR review quality, workflow/install robustness, skill packaging, and
review evaluation. This is not a wholesale port. Each borrowed idea must be mapped to this repo's
existing command/skill/template structure, preserve the lightweight nature of the toolbelt, and avoid
copying incompatible upstream code or licenses.

Primary upstream ranges reviewed:

- `repos/pull-request-repos/kodus-ai`: `db1f89de6..1f0ccd78d`
- `repos/pull-request-repos/open-code-review`: `7128562..d8dfa3b`
- `repos/skills-repo/gsd-core`: `eb81faae..251cfa1f`
- `repos/skills-repo/gstack`: `a861c00c..11de390b`
- `repos/skills-repo/superpowers`: `896224c..f268f7c`
- `repos/skills-repo/skills-mattpocock`: `6eeb81b..0877403`
- Supporting review references: `pr-agent`, `gentle-pi`, `open-code-review-alibaba`

## Acceptance Criteria Coverage Strategy

- The repo has a concise upstream-delta report that records what changed, what is worth lifting, and
  what is intentionally rejected.
- Every implemented change is tied to one upstream-inspired idea and one local acceptance criterion.
- PR review behavior remains command/skill based and works without adding a service, dashboard,
  database, or new runtime.
- Any install or packaging changes include installer smoke checks and skill-sync checks.
- Any PR-review behavior changes include prompt/contract updates plus focused validation using the
  existing `skills/pr-review` references and benchmarks where practical.
- Licensing risk is avoided: lift concepts and local wording, not upstream code from restrictive repos.

## Current State

Status: In Progress

Current Phase: Phase 1A - Planning Robustness Upgrade

Current Task: Add required `File / Responsibility Map` to Dev Lite plans

Current Branch: `feat/atb-namespace-install`

Last Updated: 2026-07-01

Last Completed Step: Added `Global Constraints` to the Dev Lite implementation plan template and `/dev-plan` rules.

Next Step: Add a pre-task `File / Responsibility Map` to `templates/dev-implementation-plan.md` and `commands/dev-plan.md`.

Resume Instructions: Start from Phase 1A Task 2. The current branch is already
`feat/atb-namespace-install`; do not create another branch unless the user asks.
Add a `File / Responsibility Map` to the template and `/dev-plan` rules, then
validate that generated plans must name file responsibilities before tasks.
Preserve unrelated work.

## Activity Log

| Date | Agent/Owner | Action | Evidence / Links | Next Step |
|---|---|---|---|---|
| 2026-07-01 | Codex | Updated watched repos and identified high-signal upstream diffs | Local clones under `repos/`; notes in `notes/` | Await plan approval |
| 2026-07-01 | Codex | Created implementation plan | `docs/upstream-borrow-implementation-plan.md` | Create branch and start Phase 1 |
| 2026-07-01 | Codex | Started Phase 1 and wrote upstream delta report | `docs/upstream-delta-2026-07.md`; inspected upstream paths listed there | Review/commit Phase 1 |
| 2026-07-01 | Codex | Completed Phase 1 triage checks | Path existence checks passed; `git diff --check -- docs/upstream-borrow-implementation-plan.md docs/upstream-delta-2026-07.md`; no code-looking source blocks found with `rg` | Commit Phase 1 and start Phase 1A |
| 2026-07-01 | Codex | Completed Phase 1A Task 1: Global Constraints | Updated `templates/dev-implementation-plan.md` and `commands/dev-plan.md`; reviewed generated section/rules with `sed`; confirmed references with `rg "Global Constraints|None beyond existing repo standards|cross-task"` | Commit Task 1, then start File / Responsibility Map |

## Phase 1: Upstream Delta Triage

### Goal

Convert the refreshed watched-repo diffs into a small, ranked backlog of concrete local changes.

### Tasks

- [x] Task: Write a source-of-truth delta report in `notes/upstream-delta-2026-07.md` or `docs/`.
      Test work: N/A, documentation-only.
      Status: Complete.
      Evidence: `docs/upstream-delta-2026-07.md` includes commit ranges, ranked ideas, rejected ideas, and license notes.
- [x] Task: Inspect the changed upstream files for the top candidates instead of relying only on commit
      subjects.
      Test work: N/A, research-only.
      Status: Complete.
      Evidence: Delta report cites exact upstream files inspected under "High-Signal Files Inspected".
- [x] Task: Rank ideas into `Now`, `Later`, and `Reject`.
      Test work: N/A, planning-only.
      Status: Complete.
      Evidence: Delta report has `Now`, `Later`, and `Reject` sections with local file mappings and rationale.
- [x] Task: Add a `skills-mattpocock` section to the delta report focused on `writing-great-skills`,
      `improve-codebase-architecture`, and the updated review smell baseline.
      Test work: N/A, research-only.
      Status: Complete.
      Evidence: Delta report maps skill authoring discipline and architecture vocabulary to local skill guidance, `simplify`, and `pr-review`, with broad catalog/persona expansion rejected.

### Expected Commits

- `docs: summarize upstream deltas for borrowed improvements`

### Tests / Checks

Automated tests to add/update during this phase: none.

Manual or integration checks, if automation is not practical:

- Confirm all cited upstream local paths exist.
- Confirm no restrictive upstream source code is copied into tracked files.

### Risks

- Large upstream diffs can create false signal. Mitigation: inspect exact changed files for each
  candidate before planning implementation.
- `codeql` and `semgrep` are listed in `repos.txt` but not cloned locally. Treat them as out of scope
  unless the user explicitly asks to clone and review them.

### Phase Review Checklist

- [x] Phase goal met
- [x] Acceptance criteria covered or still tracked
- [x] Tests/checks completed or gaps listed
- [x] No blocking performance/security/code quality issues

## Phase 1A: Planning Robustness Upgrade

### Goal

Make Dev Lite implementation plans robust enough for fresh-context execution: a future agent or
subagent should be able to pick up one task without re-deriving file boundaries, interfaces,
constraints, test commands, or acceptance-criteria intent.

### Candidate Scope

- Superpowers v6 `writing-plans`: file responsibility map before task decomposition, global constraints
  copied verbatim from the spec, per-task `Files` and `Interfaces` blocks, bite-sized checkbox steps,
  exact commands with expected results, no placeholders, and an inline self-review pass.
- GSD Core: advisory assumption-delta checkpoint before planning when a phase changes a core
  assumption, stale-plan/codebase-drift pre-checks before planning, and explicit verifier abstention
  for requirements that cannot be inferred from the spec.
- Local Dev Lite strengths to preserve: feature brief, acceptance coverage strategy, current state,
  activity log, resume instructions, phase review gates, branch/PR safety.

### Tasks

- [x] Task: Add a `Global Constraints` section to the Dev Lite plan template and `/dev-plan` rules.
      Test work: Create or review one sample plan and verify cross-task rules are stated once and reused.
      Status: Complete.
      Evidence: Updated `templates/dev-implementation-plan.md` and `commands/dev-plan.md`; focused review confirmed the template has one reusable section and `/dev-plan` instructs agents to put cross-task rules there once.
- [ ] Task: Add a required pre-task `File / Responsibility Map` so decomposition choices are explicit
      before phases/tasks are written.
      Test work: Validate that each task's file list matches the map or explains a deviation.
      Status: Pending.
      Evidence: Updated template and command guidance.
- [ ] Task: Add per-task `Files` and `Interfaces` fields for behavior-changing tasks.
      Test work: Spot-check a generated plan: each task names created/modified/test files and what it
      consumes/produces for neighboring tasks.
      Status: Pending.
      Evidence: Updated task scaffold.
- [ ] Task: Add a `No Placeholders` and self-review checklist to `/dev-plan`.
      Test work: Search generated plan for `TBD`, vague "add tests", "handle edge cases", and undefined
      references before plan approval.
      Status: Pending.
      Evidence: Updated command guidance.
- [ ] Task: Decide how strict code-in-plan should be for this repo.
      Test work: Document the policy: exact test names/commands are required; full code snippets are
      required only when the task is algorithmically specific or subagent-dispatched.
      Status: Pending.
      Evidence: Updated planning rules with a balanced standard.
- [ ] Task: Add a lightweight assumption-delta prompt to `/dev-plan` for phases that introduce a
      second platform/provider/auth method/source of truth, make a required field optional, or turn a
      derived constant into user choice.
      Test work: Verify normal plans are not burdened; when the trigger appears, the plan records the
      promoted primary noun or accepted debt.
      Status: Pending.
      Evidence: Updated command guidance.
- [ ] Task: Add a planning pre-check for stale assumptions: compare the feature brief against current
      repo state before finalizing file/interface plans.
      Test work: Run on one local plan and confirm it either records "no drift found" or lists concrete
      files that changed the plan.
      Status: Pending.
      Evidence: Updated `/dev-plan` rules or implementation reference.

### Expected Commits

- `feat: harden dev-lite planning template`

### Tests / Checks

Automated tests to add/update during this phase:

- None unless a template-sync check is added.

Manual or integration checks:

- Generate or revise one plan and run the self-review checklist manually.
- Confirm the plan remains lightweight enough for normal single-agent use.

### Risks

- Superpowers plans can become too prescriptive for exploratory repo work. Mitigation: require exact
  files/interfaces/tests, but only require full code snippets when they materially reduce ambiguity.
- Adding structure without enforcement can become decoration. Mitigation: update both the template and
  `/dev-plan` command rules.

### Phase Review Checklist

- [ ] Phase goal met
- [ ] Acceptance criteria covered or still tracked
- [ ] Tests/checks completed or gaps listed
- [ ] No blocking performance/security/code quality issues

## Phase 2: PR Review Quality Updates

### Goal

Improve `skills/pr-review` and related commands with the strongest upstream review patterns while
keeping the existing light/standard/deep model.

### Candidate Scope

- Kodus: user-directed review focus, anti-hallucination rules, severity thresholding, eval ledger ideas.
- Open Code Review: review-to-approval loop, verdict invariants, blocker/should-fix/suggestion buckets,
  reviewer discourse pattern.
- PR-Agent: line-anchored diff presentation and self-reflection scoring/filtering pattern.

### Tasks

- [ ] Task: Add a review focus/directive contract to `/pr-review` without allowing user instructions to
      predetermine a verdict.
      Test work: Run markdown/prompt inspection and at least one dry-run style review against a known
      diff.
      Status: Pending.
      Evidence: Updated command/skill references document safe focus handling.
- [ ] Task: Tighten verdict and finding taxonomy if gaps remain after comparing current
      `output-format.md` and `review-rubric.md` against upstream patterns.
      Test work: Validate examples still produce a single clear verdict and blocker semantics.
      Status: Pending.
      Evidence: Updated references and examples/benchmarks as needed.
- [ ] Task: Add or refine a critic/safeguard pass for false-positive filtering, scoped to standard/deep
      tiers if light tier should remain cheap.
      Test work: Run existing pr-review reference checks or benchmark notes update.
      Status: Pending.
      Evidence: Updated `skills/pr-review/references/` files and benchmark/report notes.
- [ ] Task: Add an eval-results ledger pattern if it can be done as simple repo-local markdown/JSONL,
      not a platform.
      Test work: Verify append/read instructions are deterministic and documented.
      Status: Pending.
      Evidence: New or updated benchmark/eval reference.

### Expected Commits

- `feat: add safe review focus handling`
- `feat: refine pr-review verdict and critic rules`
- `docs: add pr-review eval ledger guidance`

### Tests / Checks

Automated tests to add/update during this phase:

- Use existing repo checks where available, especially `scripts/check-skill-sync.sh`.

Manual or integration checks:

- Run `/pr-review` prompt path mentally or with a local diff and verify focus directives cannot override
  verdict rules.
- Compare final report format against existing `skills/pr-review/references/output-format.md`.

### Risks

- Prompt bloat can make the skill less usable. Mitigation: prefer reference files and tier-specific
  behavior over stuffing all rules into the command.
- Review focus can become prompt injection. Mitigation: treat focus text as untrusted review scope, not
  instruction hierarchy.

### Phase Review Checklist

- [ ] Phase goal met
- [ ] Acceptance criteria covered or still tracked
- [ ] Tests/checks completed or gaps listed
- [ ] No blocking performance/security/code quality issues

## Phase 3: Workflow, Install, and Packaging Hardening

### Goal

Borrow practical repo/tooling robustness patterns without expanding the product surface unnecessarily,
with special attention to Superpowers v6's lower-token subagent workflow.

### Candidate Scope

- GSD Core: golden install parity fixtures, runtime/capability descriptor discipline, verifier/security
  references.
- GSD Core fixes: state rebuild/derivability contract, install golden parity normalization, stale static
  config warnings, path/write confinement, CRLF/cross-platform guards, and "verify reach equals spec
  reach" discipline.
- Gstack: first-run/router front door ideas, redaction/prepush checks, focused skill wrappers.
- Superpowers: lean bootstrap, Codex marketplace manifest, tests that ensure Codex packaging does not
  ship incompatible hooks.
- Superpowers v6 SDD: file-based task briefs, file-based review packages, one combined task reviewer
  for spec compliance plus quality, explicit model selection per dispatch, scratch/ledger files outside
  `.git/`, and short subagent return messages.

### Tasks

- [ ] Task: Evaluate whether install parity should be tested with golden fixtures for supported
      harnesses.
      Test work: Add focused fixture/check only if it covers a real current risk.
      Status: Pending.
      Evidence: New test/script or documented rejection.
- [ ] Task: Review Codex/plugin packaging against Superpowers' manifest discipline.
      Test work: Run plugin build or manifest validation if present.
      Status: Pending.
      Evidence: Packaging files updated or rejection documented.
- [ ] Task: Decide whether a lightweight router/front-door command belongs in this repo, or whether
      existing `/workflow-router` already covers the need.
      Test work: Documentation-only unless a real gap is found.
      Status: Pending.
      Evidence: Updated command docs or explicit no-change rationale.
- [ ] Task: Adapt the Superpowers file-handoff pattern into dev-lite/phase review guidance.
      Test work: Exercise generated task brief and review package on a small local diff, or document why
      prose-only guidance is sufficient for this pass.
      Status: Pending.
      Evidence: Updated dev-lite references, new helper scripts, or explicit rejection.
- [ ] Task: Evaluate replacing two-step per-task reviews with one combined task review contract where
      applicable: spec/acceptance compliance plus code quality in a single reviewer pass.
      Test work: Run the new review prompt against a completed task or fixture diff and confirm both
      verdicts are present.
      Status: Pending.
      Evidence: Updated review rules or phase-review template.
- [ ] Task: Add durable scratch/ledger conventions for subagent-style execution that stay out of `.git/`
      and out of commits.
      Test work: Verify `git status --short` stays clean after scratch files are created.
      Status: Pending.
      Evidence: Workspace convention documented or implemented.
- [ ] Task: Add explicit subagent dispatch/model-selection guidance for Codex-capable runs, while keeping
      the workflow usable without multi-agent support.
      Test work: Check command/skill text still has a sequential fallback and does not require unavailable
      tools.
      Status: Pending.
      Evidence: Updated dev-lite or worktree references.
- [ ] Task: Add a "verify reach" rule to phase and PR review guidance: reviewers must distinguish
      verified, failed, and not inferable from the available spec/diff.
      Test work: Review one sample report and confirm uncertain/non-inferable items do not silently pass.
      Status: Pending.
      Evidence: Updated review rules.
- [ ] Task: Evaluate a lightweight state-rebuild/sync check for Dev Lite plan files: derived fields
      such as current phase/task should be reconcilable from task checkboxes and activity log, while
      human notes remain preserved.
      Test work: Document no-change rationale or add a manual "reconcile current state" checklist.
      Status: Pending.
      Evidence: Updated plan template or rejection note.
- [ ] Task: Add portability/path hardening guidance for installer and helper scripts inspired by GSD's
      recent fixes: path-final `mktemp`, CRLF-safe parsing, no hardcoded temp/home paths, and confined
      writes.
      Test work: Run relevant shell syntax checks and installer dry-runs when touched.
      Status: Pending.
      Evidence: Updated install/review checklist or tests.

### Expected Commits

- `test: add install packaging parity coverage`
- `docs: clarify workflow router scope`
- `feat: add low-token dev-lite handoff guidance`
- `docs: add gsd-inspired process hardening`

### Tests / Checks

Automated tests to add/update during this phase:

- `scripts/check-skill-sync.sh`
- Installer dry-run checks for impacted packs.
- Any plugin build/manifest checks if packaging changes are made.

Manual or integration checks:

- Confirm generated/install outputs still land in expected harness directories.

### Risks

- Golden fixtures can become noisy maintenance overhead. Mitigation: add them only where current checks
  cannot catch real drift.
- The existing unrelated `install/lib.sh` change touches install layout; coordinate before editing that
  file.

### Phase Review Checklist

- [ ] Phase goal met
- [ ] Acceptance criteria covered or still tracked
- [ ] Tests/checks completed or gaps listed
- [ ] No blocking performance/security/code quality issues

## Phase 3A: Skill Authoring and Architecture Review Discipline

### Goal

Borrow the best `skills-mattpocock` process ideas to make our skills easier for agents to invoke,
cheaper to carry in context, and sharper when reviewing architecture or code smells.

### Candidate Scope

- `writing-great-skills`: model-invoked vs user-invoked distinction, context load vs cognitive load,
  router skills for user-invoked sets, branch-based progressive disclosure, completion criteria,
  leading words, single source of truth, no-op pruning, sprawl/sediment/duplication failure modes.
- `improve-codebase-architecture`: deepening opportunities, shallow vs deep modules, interface vs
  implementation, locality, leverage, deletion test, ADR conflict handling, domain vocabulary.
- Updated `review` skill: compact Fowler smell baseline as an always-on standards/maintainability
  reference when repo standards are missing or thin.

### Tasks

- [ ] Task: Add a concise skill-authoring checklist to our skill creation/update guidance.
      Test work: Apply the checklist to one existing skill and record at least one concrete keep/cut
      decision.
      Status: Pending.
      Evidence: Updated skill-creator guidance or local `skills/README.md` authoring section.
- [ ] Task: Review existing model-invoked skill descriptions for context load and trigger duplication.
      Test work: Pick 3 skills, classify each description's branches, and trim only no-op/repeated
      trigger phrasing.
      Status: Pending.
      Evidence: Updated descriptions or a no-change audit note.
- [ ] Task: Add a progressive-disclosure rule of thumb to authoring guidance: inline what every branch
      needs, move branch-only reference behind a strongly worded context pointer.
      Test work: Check one long skill for sprawl/sediment and identify whether reference should move.
      Status: Pending.
      Evidence: Updated guidance and candidate notes.
- [ ] Task: Fold the compact Fowler smell baseline into `simplify`/`code-smell` or `pr-review`
      maintainability guidance without duplicating our existing taxonomy.
      Test work: Verify the final taxonomy has one source of truth and labels smells as heuristics, not
      hard violations.
      Status: Pending.
      Evidence: Updated `skills/simplify/references/smell-taxonomy.md` or PR review facet.
- [ ] Task: Evaluate whether `improve-codebase-architecture` should become a new detect-only command,
      or whether its vocabulary should be absorbed into `/code-smell` as an architecture review mode.
      Test work: Produce a no-code architecture candidate report for one small local area, or document
      why this is out of scope.
      Status: Pending.
      Evidence: New command proposal or rejected-item note.

### Expected Commits

- `docs: add skill authoring discipline`
- `docs: strengthen architecture smell guidance`

### Tests / Checks

Automated tests to add/update during this phase:

- `scripts/check-skill-sync.sh` if `dev-lite-workflow` guidance changes.

Manual or integration checks:

- Review changed skill descriptions for accidental loss of invocation coverage.
- Confirm no new command overlaps confusingly with `/simplify`, `/code-smell`, or `/pr-review`.

### Risks

- Over-pruning descriptions can make model-invoked skills harder to discover. Mitigation: trim
  duplicate branches, not distinct triggers.
- A full HTML architecture report command may be too product-heavy for this repo. Mitigation: borrow
  the vocabulary and candidate-card structure first; defer visuals unless we see real demand.

### Phase Review Checklist

- [ ] Phase goal met
- [ ] Acceptance criteria covered or still tracked
- [ ] Tests/checks completed or gaps listed
- [ ] No blocking performance/security/code quality issues

## Phase 4: Final Hardening and PR Readiness

### Goal

Ensure the borrowed updates are coherent, documented, and ready for review.

### Tasks

- [ ] Task: Run final checks across changed docs/skills/install scripts.
      Test work: `scripts/check-skill-sync.sh`, relevant shell syntax checks, installer dry-runs, and any
      added tests.
      Status: Pending.
      Evidence: Command output summarized in Activity Log.
- [ ] Task: Update README/docs only where user-facing behavior changed.
      Test work: Documentation review.
      Status: Pending.
      Evidence: Changed docs cite the new behavior without duplicating implementation details.
- [ ] Task: Run final PR readiness review.
      Test work: Dev-lite PR review pass against branch diff.
      Status: Pending.
      Evidence: Final PR Review Result updated below.

### Expected Commits

- `docs: document borrowed workflow improvements`
- `test: cover borrowed workflow behavior`

### Tests / Checks

Automated tests to add/update during this phase:

- `scripts/check-skill-sync.sh`
- Relevant installer dry-runs.
- Any tests introduced by Phases 2 or 3.

Manual or integration checks:

- Review final diff for copied upstream code, prompt bloat, and user-facing contradictions.

### Risks

- Scope creep from multiple upstreams. Mitigation: keep `Later` items in the delta report rather than
  implementing them in this pass.

### Phase Review Checklist

- [ ] Phase goal met
- [ ] Acceptance criteria covered or still tracked
- [ ] Tests/checks completed or gaps listed
- [ ] No blocking performance/security/code quality issues

## Final PR Review Plan

Before PR is marked ready, review:

- Correctness of prompt and workflow behavior
- Acceptance criteria coverage
- Review-focus injection safety
- Installer/package drift risk
- Tests and dry-run evidence
- Performance/token cost implications for review tiers
- Documentation consistency
- License/copying risk from upstream repos

## PR / Branch Status

Work Branch: `feat/atb-namespace-install`

PR Target Branch: `main`

PR URL: TBD

Final PR Review Result: Not Started
