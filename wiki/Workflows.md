# Workflows

The delivery lanes. For a per-phase command breakdown with Mermaid diagrams, see
the [Phase → Command Map](../docs/phase-command-map.md).

- [Dev Lite Workflow](#dev-lite-workflow) — lightweight feature/app delivery loop.
- [Phase Context Workflow](#phase-context-workflow) — durable state across resets.
- [AI Feature Delivery](#ai-feature-delivery) — traceable, gated, cross-functional.
- [Bug to Fix](#bug-to-fix) — the diagnostic lane.
- [Shape Up](#shape-up) — interrogate a vague request before building.

## Dev Lite Workflow

The Dev Lite Workflow is for practical feature or app delivery when you want a
smaller loop than the full AI Feature Delivery process. It works from:

```text
Idea -> Feature Brief -> Implementation Plan -> Task -> Commit -> Phase Review -> Final PR Review
```

Install it into a project for Cursor, Claude Code, and Codex skill use:

```sh
./install.sh --harness all dev-lite-workflow /path/to/project
```

Use `--dry-run` to preview the install:

```sh
./install.sh --dry-run --harness all dev-lite-workflow /path/to/project
```

The installer adds Cursor commands/rules, Claude commands, a repo-scoped
`.agents/skills/dev-lite-workflow` Codex skill, shared `.atb/skills/` copy,
templates, and the workflow playbook.

In Cursor or Claude Code, start with `/dev-intake`, then `/dev-plan`. In Codex,
invoke the skill with `/skills` or by mentioning `$dev-lite-workflow`, then ask
for the action you want:

```text
$dev-lite-workflow
Run a PR readiness review for this bug fix against the current diff.
```

## Phase Context Workflow

The Phase Context Workflow keeps long agent work resumable by writing phase
state into repo files before context resets:

```text
Plan -> Phase File -> Context Packet -> Implement -> Phase Handoff -> Clear/Compact
```

Install it into a project:

```sh
./install.sh --harness all phase-context-workflow /path/to/project
```

It adds `/handoff`, `/phase-create`, `/phase-start`, `/phase-close`, and
`/phase-status`, plus templates for `.acc/phases/<room>/` phase files,
handoffs, and context packets. `/phase-close` reuses the `handoff` rules
(reference durable artifacts, lead with the next action, capture ruled-out
paths, redact secrets, keep it compact) but saves into the tracked phase
directory. It pairs well with `dev-lite-workflow` for phased implementation and
with `phase-gate` when each phase opens its own PR.

## AI Feature Delivery

The AI Feature Delivery System is for cross-functional feature work where
requirements, tickets, tests, docs, QA handoff, and release eligibility need to
stay connected.

Start with:

- `.atb/workflows/ai-feature-delivery-lifecycle.md` for the full lifecycle and gates.
- `.atb/workflows/dev-ticket-to-pr.md` for the implementation-ticket-to-PR path.
- `.atb/skills/ai-feature-delivery/SKILL.md` for agent operating rules.
- `.atb/skills/webapp-testing/SKILL.md` for browser/user-flow verification.
- `.atb/templates/feature-master-record.md` for the central traceability record.

Common commands:

- `/workflow-router` - choose the smallest useful next command.
- `/feature-start` and `/feature-fleshout` - define and complete a feature
  package.
- `/sdd-draft`, `/doc-impact`, and `/doc-delta` - manage design and controlled
  document impacts.
- `/refine-to-tickets` - slice feature work into traceable implementation
  tickets.
- `/start-dev-from-feature`, `/implementation-plan`, `/write-tests`,
  `/webapp-test`, `/review-diff`, `/pr-ready-check`, and
  `/pr-traceability-review` - carry a ticket through development and PR review.
- `/role-review` - run a product, engineering, design, QA, security, or release
  review gate from one role's point of view.
- `/qa-handoff`, `/release-manifest`, and `/release-doc-check` - prepare QA and
  release documentation.

Which harnesses receive files is controlled by `--harness` (see [Choosing
harnesses](Installation.md#choosing-harnesses)). Note that the AI Feature Delivery
pack ships Cursor-only commands and optional full-mode rules, so installing it
with `--harness claude` writes only its shared `.atb/skills/`, `.atb/templates/`,
and `.atb/workflows/` (the installer prints a note for each pack that contributes
nothing harness-specific).

## Bug to Fix

The `bug-to-fix` tool is the diagnostic lane: it takes a bug report from triage
to a verified fix.

```text
Bug report -> /bug-intake -> /reproduce -> /rca -> /fix-plan -> /dev-implement-task -> /pr-review
```

Install it into a project for Cursor, Claude Code, and Codex skill use:

```sh
./install.sh --harness all bug-to-fix /path/to/project
```

Use `--dry-run` to preview and `--force` only when replacing a previous install.
The installer adds the `/bug-*` commands, the `bug-to-fix` skill tree, the
investigation/RCA/fix-brief templates, and the workflow playbook. On macOS,
double-click `install.command` and follow the prompts.

Key ideas:

- A **durable investigation file** (`.atb/templates/bug-investigation.md`) is updated
  *before* each action, so the work survives a context reset and hands off cleanly.
- **No fix without a confirmed root cause**, and **no "fixed" without verification**.
- **Reproduction is manual-first**: `/reproduce` asks whether you or QA reproduced
  the bug before dev, and keeps the automated failing-test path for when a test
  harness exists.
- `/rca --diagnose` runs a read-only root-cause analysis that never edits files.

## Shape Up

The `shape-up` tool interrogates a vague request into an agreed brief **before** anyone
plans or writes code — the front-door to the dev lanes.

```sh
./install.sh --harness all shape-up /path/to/project
```

It grills the request one question at a time (resolving from the codebase first, each
question with a recommended answer), hunts contradictions and overloaded terms, and emits
a lean brief — gated on your approval. Then it hands off: `/shape-up` -> `/dev-intake` ->
`/dev-plan`, or `/to-issues` to slice the brief into vertical-slice tickets. It is lighter
than `/feature-fleshout` (no gates/compliance) and complements `/dev-intake` (which captures
a brief but does not grill).
