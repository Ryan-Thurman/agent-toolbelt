# agent-toolbelt

Reusable AI-agent commands, skills, workflows, and templates for software
delivery work.

The repository currently includes these toolsets:

- `pr-review`: a tiered, multi-agent pull-request and diff review workflow.
- `bug-to-fix`: a diagnostic lane that takes a bug report through triage,
  reproduction, root-cause analysis, a minimal fix, and verification.
- `dev-lite-workflow`: a lightweight development loop for app/feature ideas,
  phased implementation, per-task commits, phase reviews, and final PR review.
- `ai-feature-delivery`: a traceable feature-delivery workflow for turning a
  feature idea into design docs, implementation tickets, test evidence, QA
  handoff, and release documentation.
- `shape-up`: interrogate a vague request into an agreed brief before building —
  the front-door to the dev lanes.
- `simplify`: actively clean up existing code, applying high-conviction
  simplifications on opt-in — the active counterpart to `pr-review`.

The lanes are different shapes: `ai-feature-delivery` / `dev-lite-workflow` are
**generative** (start from an idea), while `bug-to-fix` is **diagnostic** (start
from broken behavior). `shape-up` shapes a fuzzy request before either; `pr-review`
and `simplify` are the review/cleanup utilities. They share a back half — dev
implementation and PR review.

## What Is Included

```text
agent-toolbelt/
  docs/             user-facing setup and usage docs
  commands/         slash commands and reusable command prompts
  skills/           agent skills with operating instructions
  workflows/        multi-step workflow playbooks
  templates/        reusable starting files and Cursor rules
  examples/         worked reference material
```

Each major folder has a `README.md` describing what belongs there.

## Quick Start

For the guided path, start with:

- `docs/README.md` for the documentation map.
- `docs/tutorial.md` for a first install and first feature walkthrough.

To install the AI Feature Delivery pack into a pilot repo or folder:

```sh
./install-ai-feature-delivery.sh /path/to/pilot-folder
```

Use `--dry-run` to preview the install:

```sh
./install-ai-feature-delivery.sh --dry-run /path/to/pilot-folder
```

Use `--force` only when replacing a previous install.

On macOS, non-developer pilot users can double-click
`install-ai-feature-delivery.command`, drag the target folder into the Terminal
prompt, and press Enter.

After install, open the target folder in Cursor and run `/workflow-router` or
`/feature-start` from chat.

## Dev Lite Workflow

The Dev Lite Workflow is for practical feature or app delivery when you want a
smaller loop than the full AI Feature Delivery process. It works from:

```text
Idea -> Feature Brief -> Implementation Plan -> Task -> Commit -> Phase Review -> Final PR Review
```

Install it into a project for Cursor, Claude Code, and Codex skill use:

```sh
./install-dev-lite-workflow.sh /path/to/project
```

Use `--dry-run` to preview the install:

```sh
./install-dev-lite-workflow.sh --dry-run /path/to/project
```

The installer adds Cursor commands/rules, Claude commands, a repo-scoped
`.agents/skills/dev-lite-workflow` Codex skill, shared `skills/` copy,
templates, and the workflow playbook.

In Cursor or Claude Code, start with `/dev-intake`, then `/dev-plan`. In Codex,
invoke the skill with `/skills` or by mentioning `$dev-lite-workflow`, then ask
for the action you want:

```text
$dev-lite-workflow
Run a PR readiness review for this bug fix against the current diff.
```

## AI Feature Delivery

The AI Feature Delivery System is for cross-functional feature work where
requirements, tickets, tests, docs, QA handoff, and release eligibility need to
stay connected.

Start with:

- `workflows/ai-feature-delivery-lifecycle.md` for the full lifecycle and gates.
- `workflows/dev-ticket-to-pr.md` for the implementation-ticket-to-PR path.
- `skills/ai-feature-delivery/SKILL.md` for agent operating rules.
- `skills/webapp-testing/SKILL.md` for browser/user-flow verification.
- `templates/feature-master-record.md` for the central traceability record.

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

The AI Feature Delivery pack installs Cursor commands/rules only (no
`.claude/commands`); the Dev Lite pack installs both Cursor and Claude Code
commands.

## PR Review

The `pr-review` tool reviews a PR, branch, or local diff with escalating depth:

| Tier | Use When |
|---|---|
| `light` | quick gut-checks and tiny or low-risk diffs |
| `standard` | normal PRs that need broad facet coverage |
| `deep` | high-stakes, security-sensitive, or pre-merge reviews |

Install it into a project for Cursor, Claude Code, and Codex skill use:

```sh
./install-pr-review.sh /path/to/project
```

Use `--dry-run` to preview and `--force` only when replacing a previous install.
The installer adds the `/pr-review` command, the full `pr-review` skill tree, the
`templates/pr-review.md` config sample, and the `examples/` reference material. On
macOS, double-click `install-pr-review.command` and drag the target folder into the
Terminal prompt.

Run it with:

```text
/pr-review [target] [--tier=light|standard|deep] [--comment]
```

Useful options:

- Omit `--tier` to let the workflow auto-select a tier from the diff.
- Add `--comment` for inline PR review comments when a supported host CLI is
  available.
- Add `--focus=<facet>` to emphasize correctness, security, performance, tests,
  maintainability, standards, or another supported review facet.

Target repos can copy `templates/pr-review.md` to `.pr-review.md` to declare
local review priorities.

## Bug to Fix

The `bug-to-fix` tool is the diagnostic lane: it takes a bug report from triage
to a verified fix.

```text
Bug report -> /bug-intake -> /reproduce -> /rca -> /fix-plan -> /dev-implement-task -> /pr-review
```

Install it into a project for Cursor, Claude Code, and Codex skill use:

```sh
./install-bug-to-fix.sh /path/to/project
```

Use `--dry-run` to preview and `--force` only when replacing a previous install.
The installer adds the `/bug-*` commands, the `bug-to-fix` skill tree, the
investigation/RCA/fix-brief templates, and the workflow playbook. On macOS,
double-click `install-bug-to-fix.command` and drag the target folder into the
Terminal prompt.

Key ideas:

- A **durable investigation file** (`templates/bug-investigation.md`) is updated
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
./install-shape-up.sh /path/to/project
```

It grills the request one question at a time (resolving from the codebase first, each
question with a recommended answer), hunts contradictions and overloaded terms, and emits
a lean brief — gated on your approval. Then it hands off: `/shape-up` -> `/dev-intake` ->
`/dev-plan`, or `/to-issues` to slice the brief into vertical-slice tickets. It is lighter
than `/feature-fleshout` (no gates/compliance) and complements `/dev-intake` (which captures
a brief but does not grill).

## Simplify

The `simplify` tool is the active counterpart to `pr-review`: where review *finds* problems
and applies nothing, simplify *drives the cleanup* and applies it on opt-in.

```sh
./install-simplify.sh /path/to/project
```

- `/simplify` — diff/feature-scoped: propose high-conviction cleanups (dead code, debug
  remnants, thin wrappers, reuse, small inefficiencies), then apply the ones you select.
  Every candidate must state `rootIssue -> consequence -> benefit`, and changes are
  behavior-preserving (existing tests must pass unmodified).
- `/code-smell` — detect-only scan of an area, ranked by severity × confidence; applies
  nothing.

## Repository Safety

This public repo is meant to contain reusable prompts, skills, workflow docs,
and templates only. Do not commit private project notes, internal planning
artifacts, cloned third-party repositories, customer data, credentials, or
workspace-specific scratch files.
