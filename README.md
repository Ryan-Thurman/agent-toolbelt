# agent-toolbelt

Reusable AI-agent commands, skills, workflows, and templates for software
delivery work.

The repository currently includes three main toolsets:

- `pr-review`: a tiered, multi-agent pull-request and diff review workflow.
- `dev-lite-workflow`: a lightweight development loop for app/feature ideas,
  phased implementation, per-task commits, phase reviews, and final PR review.
- `ai-feature-delivery`: a traceable feature-delivery workflow for turning a
  feature idea into design docs, implementation tickets, test evidence, QA
  handoff, and release documentation.

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
- `/qa-handoff`, `/release-manifest`, and `/release-doc-check` - prepare QA and
  release documentation.

## PR Review

The `pr-review` tool reviews a PR, branch, or local diff with escalating depth:

| Tier | Use When |
|---|---|
| `light` | quick gut-checks and tiny or low-risk diffs |
| `standard` | normal PRs that need broad facet coverage |
| `deep` | high-stakes, security-sensitive, or pre-merge reviews |

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

## Repository Safety

This public repo is meant to contain reusable prompts, skills, workflow docs,
and templates only. Do not commit private project notes, internal planning
artifacts, cloned third-party repositories, customer data, credentials, or
workspace-specific scratch files.
