# agent-toolbelt wiki

Agent Toolbelt is an independent, general-purpose collection of reusable
skills for software delivery. It has no AI-SDLC or team-workspace dependency.

The [README](../README.md) is the concise entry point and the
[generated portal](../portal/generated/index.html) owns discovery, taxonomy,
examples, and the common workflow map. This wiki is the deeper operational and
compatibility guide. Individual `SKILL.md` files remain canonical for behavior;
commands and hooks are optional project-scoped compatibility surfaces.

## Pages

| Page | Covers |
|---|---|
| [Installation](Installation.md) | `install.sh`, cross-host skills plugin, harness selection, polyrepo `--sweep` |
| [Workflows](Workflows.md) | Product Discovery, Phased Delivery, Phase Context, Bug to Fix, Shape Up, Threat Model |
| [Code Review](Code-Review.md) | Code Quality Gate, PR Review, PR Improve and triggers: Review Reply, Review on Open, Review Queue, Phase Gate, Cursor Hooks |
| [Utilities](Utilities.md) | Style Guide Init, Simplify, Test Case Design, Cover, Security Audit, Ship It, Retrofit, Worktree, Handoff, Ticket Sync |
| [Phase → Command Map](../docs/phase-command-map.md) | Which commands each workflow phase uses (with Mermaid diagrams) |
| [Skill taxonomy audit](../docs/skill-taxonomy-audit.md) | Generated skill classification, completeness, and recommendations |

## What's included

The repository ships these toolsets:

- `pr-review`: a tiered, multi-agent pull-request and diff review workflow.
- `code-quality-gate`: an opt-in or policy-required pre-PR coordinator over repository checks,
  changed-code anti-slop/simplification assessment, standards/maintainability
  review, and bounded fix/rereview evidence.
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
- `phased-delivery`: human-guided implementation from a requirement or approved
  tickets, one reviewable PR per phase; each approved ticket is
  one phase and one PR, including approved stacked PRs.
- `phase-context-workflow`: durable phase files, handoffs, and context packets
  for long agent work that needs safe `/clear` or `/compact` boundaries. It
  composes the cross-cutting `handoff` skill for phase closeout.
- `shape-up`: interrogate a vague request into an agreed brief before building —
  the front-door to the dev lanes.
- `simplify`: actively clean up existing code on opt-in, plus `/code-smell`
  detect-only scans for structural and architecture/deepening candidates.
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
  project ticket workflows and `/to-issues` can land their work in the tracker, not
  just local markdown.
- `handoff`: a small, cross-cutting `/handoff` that writes a resumable handoff so
  a fresh agent — or a teammate — can continue work without context loss. Bundled
  with `bug-to-fix`; installs standalone for the other lanes too.
- `cursor-hooks`: project-level Cursor hooks that wire two toolbelt principles
  into Cursor's agent loop — a doc-sync gate on `git commit` and a `/pr-review`
  nudge on `git push` (Cursor-only; advisory and fail-open).

`phased-delivery` owns shared implementation and PR boundaries.
`bug-to-fix` owns defect diagnosis. Project repositories own their lifecycle
records and approvals. Review, test, and release methods remain shared Toolbelt skills.

## Repository layout

```text
agent-toolbelt/
  portal/generated/ offline discovery portal (catalog, examples, workflows)
  catalog/          canonical discovery metadata and tooling lifecycle audit
  install.sh        single installer entry point (./install.sh --harness <list> <pack...> <target>)
  install/          per-pack file lists (install/<pack>.sh) + shared install/lib.sh
  build-cursor-plugin.sh  assemble a private, user-scoped Cursor plugin from the packs
  docs/             user-facing setup and usage docs
  commands/         slash commands and reusable command prompts
  skills/           agent skills with operating instructions
  optional/cursor-hooks/
                    Opt-in Cursor hook scripts + hooks.json (cursor-hooks pack)
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
