# agent-toolbelt

Reusable AI-agent commands, skills, workflows, and templates for software
delivery work.

The lanes are different shapes: `ai-feature-delivery` / `dev-lite-workflow` are
**generative** (start from an idea), while `bug-to-fix` is **diagnostic** (start
from broken behavior). `shape-up` shapes a fuzzy request before either; `pr-review`,
`simplify`, and `cover` are the review / cleanup / test-authoring utilities; `ship-it`
is the release step at the tail. They share a back half — dev implementation and PR
review.

## Quick start

Everything installs through one entry point — `./install.sh` — which answers three
questions: **which packs**, **which harness(es)**, and **into which folder**:

```sh
./install.sh --harness <cursor|claude|codex|all> <pack ...|all> <target-folder>

./install.sh --harness cursor all /path/to/project   # the common case
./install.sh --list                                  # list available packs
```

After install, open the target folder and run `/workflow-router` from chat. Full
install mechanics — harness selection, polyrepo `--sweep`, the private Cursor
plugin — are in the [Installation](wiki/Installation.md) guide.

## Documentation

The **[wiki](wiki/Home.md)** is the deep dive. Quick map:

| Page | Covers |
|---|---|
| [Installation](wiki/Installation.md) | `install.sh`, harness selection, polyrepo `--sweep`, private Cursor plugin |
| [Workflows](wiki/Workflows.md) | Dev Lite, Phase Context, AI Feature Delivery, Bug to Fix, Shape Up |
| [Code Review](wiki/Code-Review.md) | PR Review + triggers: Review Reply, Review on Open, Review Queue, Phase Gate, Cursor Hooks |
| [Utilities](wiki/Utilities.md) | Simplify, Cover, Ship It, Retrofit, Handoff, Ticket Sync |
| [Phase → Command Map](docs/phase-command-map.md) | Which commands each workflow phase uses (Mermaid diagrams) |
| [docs/tutorial.md](docs/tutorial.md) | Guided first install and first feature walkthrough |

## Packs

| Pack | What it does |
|---|---|
| `pr-review` | Tiered, multi-agent pull-request and diff review. |
| `pr-review-reply` | Round-trip half of `pr-review`: triage and answer a reviewer's PR threads (posting opt-in). |
| `review-on-open` | Trigger layer: auto-review on PR open/update, via GitHub Actions event or a host-agnostic poller. |
| `review-queue` | Local, SQLite-backed work queue — a producer enqueues a PR, a worker runs `/pr-review --comment`. |
| `phase-gate` | In-loop trigger: at each phase boundary a fresh subagent reviews the PR (team stop / solo merge). |
| `bug-to-fix` | Diagnostic lane: triage → reproduce → root-cause → minimal fix → verify. |
| `dev-lite-workflow` | Lightweight dev loop: brief → plan → task → commit → phase review → final PR review. |
| `phase-context-workflow` | Durable phase files, handoffs, and context packets for safe `/clear` / `/compact`. |
| `ai-feature-delivery` | Traceable feature delivery: design docs, tickets, tests, QA handoff, release docs. |
| `shape-up` | Interrogate a vague request into an agreed brief before building. |
| `simplify` | Active cleanup plus `/code-smell` detect-only scans, including architecture/deepening candidates. |
| `cover` | Author/strengthen behavior-pinning tests + a detect-only coverage-gap scan. |
| `ship-it` | Lightweight release readiness: go/no-go, rollback plan, release notes, rollout plan. |
| `retrofit` | Apply one defined change across every site that needs it — discover, transform, verify. |
| `worktree` | Isolated git worktrees so parallel agents share a polyrepo dir without clobbering each other's branch — one worktree per task, collision-safe naming. |
| `ticket-sync` | Provider-agnostic adapter: publish tickets to GitHub Issues, Jira, or Azure Boards. |
| `handoff` | Cross-cutting `/handoff` that writes a resumable handoff so a fresh agent can continue. |
| `cursor-hooks` | Project-level Cursor hooks: doc-sync gate on `git commit`, `/pr-review` nudge on `git push`. |

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
