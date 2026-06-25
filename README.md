# agent-toolbelt

Reusable AI-agent commands, skills, workflows, and templates for software
delivery work.

The repository currently includes these toolsets:

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
- `cover`: author and strengthen tests for a diff, module, or bug reproduction
  (behavior-pinning, applied on opt-in) + a detect-only coverage-gap scan.
- `ship-it`: lightweight release readiness — go/no-go check, rollback plan,
  release notes, and a rollout/monitor plan; pipeline-aware.
- `retrofit`: apply one defined change across every site that needs it (library
  swap, API rename, framework upgrade) — discover, transform in isolation, verify
  exhaustively.
- `ticket-sync`: a provider-agnostic issue-tracker adapter that publishes the
  tickets the slicers produce to GitHub Issues, Jira, or Azure Boards — so
  `/refine-to-tickets` and `/to-issues` can land their work in the tracker, not
  just local markdown.

The lanes are different shapes: `ai-feature-delivery` / `dev-lite-workflow` are
**generative** (start from an idea), while `bug-to-fix` is **diagnostic** (start
from broken behavior). `shape-up` shapes a fuzzy request before either; `pr-review`,
`simplify`, and `cover` are the review / cleanup / test-authoring utilities; `ship-it`
is the release step at the tail. They share a back half — dev implementation and PR
review.

## What Is Included

```text
agent-toolbelt/
  install.sh        single installer entry point (./install.sh <pack...> <target>)
  install/          per-pack file lists (install/<pack>.sh) + shared install/lib.sh
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

Everything installs through one entry point — `./install.sh` — which takes one or
more pack names (or `all`) and a target folder:

```sh
./install.sh <pack> [<pack> ...] <target-folder>
./install.sh --list                 # see the available packs
./install.sh ai-feature-delivery /path/to/pilot-folder
./install.sh bug-to-fix simplify shape-up /path/to/project
./install.sh all /path/to/project
```

Each pack's file list lives in `install/<pack>.sh`; the shared logic is in
`install/lib.sh`. Use `--dry-run` to preview and `--force` only when replacing a
previous install:

```sh
./install.sh --dry-run ai-feature-delivery /path/to/pilot-folder
```

On macOS, non-developer pilot users can double-click `install.command`, which
asks which pack(s) to install and then for the target folder (drag it into the
Terminal prompt and press Enter).

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
./install.sh dev-lite-workflow /path/to/project
```

Use `--dry-run` to preview the install:

```sh
./install.sh --dry-run dev-lite-workflow /path/to/project
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
./install.sh pr-review /path/to/project
```

Use `--dry-run` to preview and `--force` only when replacing a previous install.
The installer adds the `/pr-review` command, the full `pr-review` skill tree, the
`templates/pr-review.md` config sample, and the `examples/` reference material. On
macOS, double-click `install.command` and follow the prompts.

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

## PR Review Reply

The `pr-review-reply` tool is the **round-trip** half of `pr-review`: where
`/pr-review` produces a one-shot review, `/pr-review-reply` answers a human
reviewer's threads on a PR.

```sh
./install.sh pr-review-reply /path/to/project
```

It reads the reviewer's **open** threads (GitHub `gh` or Azure Repos `az`,
reusing the `pr-review` provider layer), re-reviews **only the code changed
since the review** (`<reviewedSha>..HEAD`, not the whole PR), and triages each
thread into exactly one of `answered`, `changed`, or `needs-follow-up` — never
claiming a thread resolved without citing the commit/lines. It emits one reply
block per thread:

```text
[[thread:<id>]]
Status: answered | changed | needs-follow-up
Response: <concise, evidence-bearing>
```

Run it with:

```text
/pr-review-reply [target] [--post] [--since=<sha>]
```

By default it prints the reply blocks (a report). `--post` writes the replies
back via the host CLI, **opt-in, confirmed, and idempotent** (a re-run skips
threads already replied to) — and never auto-resolves a human's thread. With no
host CLI or no open PR it degrades to report-only. It complements `pr-review`:
run `/pr-review` to produce the findings, then `/pr-review-reply` to close the
loop.

## Review on Open

The `review-on-open` tool is the **trigger** layer over `pr-review`: it answers
*when a fresh agent should start a review* so that PRs other agents (or people)
open get reviewed automatically — no one pressing the button. It adds no review
logic; every path ends in `/pr-review … --comment`.

```sh
./install.sh review-on-open /path/to/project
```

Two triggers, pick by host:

- **Event-driven (GitHub).** Copy `templates/review-on-open-github.yml` into the
  repo's `.github/workflows/`. On `pull_request: [opened, synchronize, reopened]`
  it runs Claude Code headless — `claude -p "/pr-review <n> --comment"` — and
  posts inline findings. Each CI run is a brand-new process, so the reviewer is
  structurally isolated from the agent that wrote the PR. Uses the untrusted
  `pull_request` context with a read-scoped token (never `pull_request_target`);
  hardening notes in `skills/review-on-open/references/ci-event.md`.
- **Host-agnostic poller** (Azure Repos, mixed hosts, or local watching):

  ```text
  /review-on-open [repo-or-filter] [--tier=…] [--max=N] [--host=…] [--dry-run]
  ```

  One poll lists open PRs, reviews the ones whose head SHA it hasn't seen
  (ledger: `.git/pr-review-seen.jsonl`, plus a per-SHA marker so a poll and a CI
  run never double-post), each in a fresh sub-agent, and records the reviewed
  SHA. Run it on an interval with `/loop 10m /review-on-open` (local) or a
  `/schedule` cloud routine (hands-off). `--dry-run` lists what would be reviewed
  and posts nothing.

The decision rule: if the host can run CI on the PR event, prefer the event path
(the event already names the PR, so no ledger is needed); the poller covers
everything that can't. After a review posts, `/pr-review-reply` handles the
inbound threads — `review-on-open` → `pr-review` → `pr-review-reply` is the full
loop.

## Review Queue

The `review-queue` tool is the **push-based** third trigger: a local work queue
that decouples the agent that *opens* a PR from the agent that *reviews* it.
Instead of polling a host or waiting on CI, the producing agent enqueues a job
and a worker claims it — fully local, so it runs on your subscription with no
GitHub webhook, no CI, and no `ANTHROPIC_API_KEY`. Any harness (Claude Code,
Cursor, Codex) can produce or consume against the one shared queue.

```sh
./install.sh review-queue /path/to/project
```

State is a single SQLite file (`$REVIEW_QUEUE_DB`, else `~/.review-queue/queue.db`)
driven by a shipped CLI — pure bash + `sqlite3`, nothing to install. Two lanes:

- **Producer** — after opening/updating a PR, enqueue it (idempotent on the head
  SHA, so re-runs are safe and a new push gets its own job):

  ```text
  /enqueue-review [target] [--repo=…] [--sha=…] [--tier=…] [--reason=…]
  ```

- **Consumer** — a worker drains the queue, running `/pr-review --comment` on each
  claimed job in a fresh sub-agent:

  ```text
  /review-queue-worker [--worker=id] [--max=N] [--tier=…]
  ```

  Run it on an interval with `/loop 5m /review-queue-worker` (local) or a
  `/schedule` routine (hands-off).

Claiming is an atomic `BEGIN IMMEDIATE` transaction (exactly-once — two workers
never grab the same job, verified under concurrency). A claim takes a lease
(default 30m), so a job whose worker dies mid-review is reaped back to the queue;
a job that fails `MAX_ATTEMPTS` times is **dead-lettered** rather than retried
forever (`review-queue list --status dead`). Full CLI contract:
`skills/review-queue/references/cli.md`.

**Caveat:** a queue still needs a worker draining it — it removes *remote
polling*, not the need for a live consumer. Use the queue for agent-to-agent
hand-off; use `review-on-open` (event/poller) for host-originated PRs. All three
end in `/pr-review --comment`.

## Bug to Fix

The `bug-to-fix` tool is the diagnostic lane: it takes a bug report from triage
to a verified fix.

```text
Bug report -> /bug-intake -> /reproduce -> /rca -> /fix-plan -> /dev-implement-task -> /pr-review
```

Install it into a project for Cursor, Claude Code, and Codex skill use:

```sh
./install.sh bug-to-fix /path/to/project
```

Use `--dry-run` to preview and `--force` only when replacing a previous install.
The installer adds the `/bug-*` commands, the `bug-to-fix` skill tree, the
investigation/RCA/fix-brief templates, and the workflow playbook. On macOS,
double-click `install.command` and follow the prompts.

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
./install.sh shape-up /path/to/project
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
./install.sh simplify /path/to/project
```

- `/simplify` — diff/feature-scoped: propose high-conviction cleanups (dead code, debug
  remnants, thin wrappers, reuse, small inefficiencies), then apply the ones you select.
  Every candidate must state `rootIssue -> consequence -> benefit`, and changes are
  behavior-preserving (existing tests must pass unmodified).
- `/code-smell` — detect-only scan of an area, ranked by severity × confidence; applies
  nothing.

## Cover

The `cover` tool is the test-authoring lane — the active/detect pair that mirrors `simplify`. It
authors and strengthens **behavior-pinning** tests for a diff, a module, or a bug reproduction, and
turns a bug repro into a committed regression test. It writes tests only — it never edits production
code.

```sh
./install.sh cover /path/to/project
```

- `/cover` — author/strengthen tests for a diff, module, or bug reproduction, applied on opt-in.
  Tests pin observable behavior (not implementation); every new test is **falsified** (confirmed to
  fail when the behavior is broken); for a bug repro it writes the test that fails before the fix and
  passes after (a red→green regression lock). It detects the repo's test framework first and keeps
  tests deterministic (no real network/time/RNG, no flaky sleeps).
- `/cover-gaps` — detect-only scan of an area for missing/weak coverage (untested branches, error
  paths, boundary conditions, regressions waiting to happen), ranked by risk × likelihood; applies
  nothing and hands its top gaps to `/cover`.

It is the hand-off target from `bug-to-fix`: `/reproduce` establishes a manual or failing-test repro,
and `/cover` turns it into the committed regression test. `/ship-it`'s readiness checklist wants that
suite green.

## Ship It

The `ship-it` tool is the lightweight release step at the tail of the dev lanes — they end at
"PR merged," this takes it to "released safely."

```sh
./install.sh ship-it /path/to/project
```

Run `/ship-it` after a change is merged/approved. It produces a **go/no-go readiness check**, a
**rollback plan + trigger**, a **release-notes draft** (`templates/release-notes.md`), and a
**rollout/monitor plan** with advance/hold/roll-back thresholds.

It is **pipeline-aware**: when an external CI/CD pipeline you don't control owns the deploy (a
common org setup), `/ship-it` prepares the release package and **hands off** — it does not run
deploy steps, and frames the monitor plan as the watch-list for after the pipeline deploys. When
*you* own the deploy, it walks the staged rollout and proposes the exact commands, never executing
a deploy without explicit confirmation. It's the lightweight sibling of the regulated
`/release-manifest` + `/release-doc-check` path.

## Retrofit

The `retrofit` tool applies **one defined change across every site that needs it** — a library
swap (moment → dayjs), an API/symbol rename across N call sites, a framework upgrade, a pattern
replacement. It is *not* a database migration and does *not* decide what the change is.

```sh
./install.sh retrofit /path/to/project
```

`/retrofit` runs **discover → transform → verify**: enumerate every site (grep / AST / the rct graph
when available), classify mechanical vs. judgment, transform each in worktree isolation (a codemod
for the mechanical bulk), and verify exhaustively — full suite green, the judgment sites
adversarially checked, zero references to the old path before it's removed. Every site ends
`done` or `skipped (reason)` — no silent truncation.

It's a deterministic fan-out, so it maps onto the `Workflow` orchestration tool and is **explicitly
opt-in** (it can spawn many agents). Distinct from `/simplify`, which makes many small *different*
cleanups in a diff; retrofit makes the *same* change in *many* places.

## Handoff

The `handoff` tool is a small, cross-cutting capability: `/handoff` writes a resumable handoff so a
fresh agent — or a teammate — can continue work without context loss (the most common cause of
multi-session and multi-agent failure). Useful in any lane.

```sh
./install.sh handoff /path/to/project
```

It leads with the single concrete **next action**, references the lane's durable state file (the
bug-investigation file, the implementation plan, or the retrofit plan) instead of duplicating it,
captures what's been ruled out, redacts secrets, and stays compact. It's bundled with the
`bug-to-fix` pack and also installs standalone for the other lanes.

## Ticket Sync

The `ticket-sync` tool is a **provider-agnostic issue-tracker adapter**. The lanes already slice work
into tickets (`/refine-to-tickets`, `/to-issues`, `/bug-intake`) but only ever as local markdown or
GitHub Issues; `/ticket-sync` publishes those same ticket files to whichever tracker a repo declares
— **GitHub Issues, Jira, or Azure Boards** — so `/refine-to-tickets` can land its tickets in Jira
instead of staying as markdown. It mirrors how `pr-review` abstracts the gh-vs-az *host*; here the
abstraction is the *tracker*.

```sh
./install-ticket-sync.sh /path/to/project
```

A target repo declares the tracker in a repo-local `.tickets.md` (copy `templates/tickets-config.md`)
— `provider`, the project/board key, default issue type, labels/components, and FIELD MAPPINGS from
the ticket-template fields (feature ID, release ID, acceptance criteria, dependencies, test
expectation, doc-delta status) to the tracker's fields. When absent, ticket-sync infers the provider
from the remote and asks for the project key.

`/ticket-sync` is **idempotent** — it records the created issue's key back into each ticket (a
`Tracker:` line) and on re-run **updates** rather than duplicating. It **never creates or modifies
remote issues without confirmation** (a dry-run preview first), takes credentials only from the
tracker CLI's own auth, and **degrades to a publish-ready manifest** when no tracker CLI/credentials
are present. Like pr-review, it loads `.tickets.md` from the base branch so a working branch can't
silently retarget publishing.

## Repository Safety

This public repo is meant to contain reusable prompts, skills, workflow docs,
and templates only. Do not commit private project notes, internal planning
artifacts, cloned third-party repositories, customer data, credentials, or
workspace-specific scratch files.
