# agent-toolbelt wiki

Reusable AI-agent commands, skills, workflows, and templates for software
delivery work.

This wiki is the deep-dive companion to the [README](../README.md). Start with
[Installation](Installation.md), then pick a lane.

## Pages

| Page | Covers |
|---|---|
| [Installation](Installation.md) | `install.sh`, harness selection, polyrepo `--sweep`, the private Cursor plugin |
| [Workflows](Workflows.md) | The delivery lanes: Dev Lite, Phase Context, AI Feature Delivery, Bug to Fix, Shape Up |
| [Code Review](Code-Review.md) | PR Review and its triggers: Review Reply, Review on Open, Review Queue, Phase Gate, Cursor Hooks |
| [Utilities](Utilities.md) | Simplify, Cover, Ship It, Retrofit, Worktree, Handoff, Ticket Sync |
| [Phase → Command Map](../docs/phase-command-map.md) | Which commands each workflow phase uses (with Mermaid diagrams) |

## What's included

The repository ships these toolsets:

- `pr-review`: a tiered, multi-agent pull-request and diff review workflow.
- `pr-review-reply`: the round-trip half of `pr-review` — read a human
  reviewer's PR threads, triage each, re-review only the code changed since the
  review, and reply per-thread (posting opt-in).
- `review-on-open`: the trigger layer for `pr-review` — auto-run a fresh review
  when a PR is opened or updated, via a GitHub Actions event workflow or a
  host-agnostic poller driven by `/loop` or `/schedule`.
- `review-queue`: a local, SQLite-backed work queue that decouples PR-opening
  agents from the reviewer — a producer enqueues a PR, a worker claims it and
  runs `/pr-review --comment`. The push-based trigger; fully local, no
  CI/webhook/API key.
- `phase-gate`: the in-loop (synchronous) third trigger — at each phase boundary
  the main agent delegates the PR review to a fresh subagent running `pr-review`,
  which posts inline findings; then either stops for human merge (team) or feeds
  the findings back so the main agent fixes and merges (solo, `--merge`).
- `bug-to-fix`: a diagnostic lane that takes a bug report through triage,
  reproduction, root-cause analysis, a minimal fix, and verification.
- `dev-lite-workflow`: a lightweight development loop for app/feature ideas,
  phased implementation, per-task commits, phase reviews, and final PR review.
- `phase-context-workflow`: durable phase files, handoffs, and context packets
  for long agent work that needs safe `/clear` or `/compact` boundaries. It
  composes the cross-cutting `handoff` skill for phase closeout.
- `ai-feature-delivery`: a traceable feature-delivery workflow for turning a
  feature idea into design docs, implementation tickets, test evidence, QA
  handoff, and release documentation.
- `shape-up`: interrogate a vague request into an agreed brief before building —
  the front-door to the dev lanes.
- `simplify`: actively clean up existing code, applying high-conviction
  simplifications on opt-in — the active counterpart to `pr-review`.
- `cover`: author and strengthen tests for a diff, module, or bug reproduction
  (behavior-pinning, applied on opt-in) + a detect-only coverage-gap scan.
- `ship-it`: lightweight release readiness — go/no-go check, rollback plan,
  release notes, and a rollout/monitor plan; pipeline-aware.
- `retrofit`: apply one defined change across every site that needs it (library
  swap, API rename, framework upgrade) — discover, transform in isolation, verify
  exhaustively.
- `worktree`: isolated git worktrees so multiple agents can share a directory of
  repos without clobbering each other's branch — one worktree per task on its own
  branch, collision-safe naming, for independent sessions.
- `ticket-sync`: a provider-agnostic issue-tracker adapter that publishes the
  tickets the slicers produce to GitHub Issues, Jira, or Azure Boards — so
  `/refine-to-tickets` and `/to-issues` can land their work in the tracker, not
  just local markdown.
- `handoff`: a small, cross-cutting `/handoff` that writes a resumable handoff so
  a fresh agent — or a teammate — can continue work without context loss. Bundled
  with `bug-to-fix`; installs standalone for the other lanes too.
- `cursor-hooks`: project-level Cursor hooks that wire two toolbelt principles
  into Cursor's agent loop — a doc-sync gate on `git commit` and a `/pr-review`
  nudge on `git push` (Cursor-only; advisory and fail-open).

The lanes are different shapes: `ai-feature-delivery` / `dev-lite-workflow` are
**generative** (start from an idea), while `bug-to-fix` is **diagnostic** (start
from broken behavior). `shape-up` shapes a fuzzy request before either; `pr-review`,
`simplify`, and `cover` are the review / cleanup / test-authoring utilities; `ship-it`
is the release step at the tail. They share a back half — dev implementation and PR
review.

## Repository layout

```text
agent-toolbelt/
  install.sh        single installer entry point (./install.sh --harness <list> <pack...> <target>)
  install/          per-pack file lists (install/<pack>.sh) + shared install/lib.sh
  build-cursor-plugin.sh  assemble a private, user-scoped Cursor plugin from the packs
  docs/             user-facing setup and usage docs
  commands/         slash commands and reusable command prompts
  skills/           agent skills with operating instructions
  hooks/            Cursor hook scripts + hooks.json (cursor-hooks pack)
  workflows/        multi-step workflow playbooks
  templates/        reusable starting files and Cursor rules
  examples/         worked reference material
```

Each major folder has a `README.md` describing what belongs there.

## Repository safety

This public repo is meant to contain reusable prompts, skills, workflow docs,
and templates only. Do not commit private project notes, internal planning
artifacts, cloned third-party repositories, customer data, credentials, or
workspace-specific scratch files.
