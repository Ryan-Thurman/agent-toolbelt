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

## What Is Included

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

## Quick Start

Everything installs through one entry point — `./install.sh` — which answers three
questions: **which packs**, **which harness(es)**, and **into which folder**:

```sh
./install.sh --harness <cursor|claude|codex|all> <pack ...|all> <target-folder>
```

The most common command — install every pack into one project for Cursor:

```sh
./install.sh --harness cursor all /path/to/project
```

Other shapes:

```sh
./install.sh --list                                          # list the available packs
./install.sh --harness cursor ai-feature-delivery ~/pilot    # one pack, one harness
./install.sh --harness cursor,claude bug-to-fix simplify shape-up ~/project
./install.sh --harness all all ~/project                     # every pack, every harness
```

New here? Take the guided path:

- `docs/tutorial.md` — a first install and first feature walkthrough.
- `docs/README.md` — the documentation map.

After install, open the target folder and run `/workflow-router` (or a specific
pack's entry command from the sections below) from chat.

### Choosing harnesses

`--harness` is required (there is no implicit default) and takes a comma-separated
list of `cursor`, `claude`, `codex`, or `all`. Only the selected harness' files are
written:

| Harness | Installs |
|---|---|
| `cursor` | `.cursor/commands/`, `.cursor/rules/`, and skills into `.agents/skills/` |
| `claude` | `.claude/commands/` |
| `codex`  | skills into `.agents/skills/` |
| _always_ | the canonical `skills/` tree (commands reference it by path), plus `templates/`, `workflows/`, `examples/` |

**Skills:** Cursor and Codex both auto-discover skills under `.agents/skills/`, so the
installer writes that one native copy for either harness (a separate `.cursor/skills/`
would make Cursor list every skill twice). The bare `skills/` tree at the root is *not*
an auto-discovery root, so it never double-registers — it exists only because the
commands reference it by relative path. Each `SKILL.md` carries `name`/`description`
frontmatter, so Cursor surfaces them as first-class, on-demand skills alongside the
`/commands`.

When `cursor` or `codex` is selected, the installer also writes an **`AGENTS.md`
pointer** at the target — a marker-delimited "Available workflows" block listing the
installed commands and skills so the agent discovers them. It is regenerated
idempotently and never disturbs the rest of your `AGENTS.md`.

### Polyrepo / `--sweep`

For repos kept side-by-side under a common parent, `--sweep` treats the target as
the **parent** and installs into it **and** every immediate child git repo, so the
tooling works both inside a single repo and across the whole application:

```sh
./install.sh --sweep --harness cursor all /path/to/parent
```

Each level is a full, self-contained install — its own `skills/` tree (commands
reference it by relative path), `AGENTS.md`, and `.cursor/rules` — so a repo opened
on its own carries its guardrails.

**Multi-root caveat (verified against Cursor):** in a Cursor multi-root workspace,
only the **top root's `AGENTS.md`** reliably loads into context (nested per-repo
`AGENTS.md` files do not auto-apply), and per-root `.cursor/rules` are not applied
consistently across the session. This is a documented Cursor limitation, not an
installer issue. The per-repo project rules this installs are reliable when you
**open a single repo as the project**; for always-on behavior across the *whole
application* in a multi-root workspace, promote those rules to **Cursor User Rules**
(Settings → Rules, Skills, Subagents → User) instead of relying on a repo's
`.cursor/rules`.

### Private Cursor plugin (one global install)

Instead of installing into each repo, you can bundle the toolbelt as a **private,
user-scoped Cursor plugin** — its skills become available in *every* project from a
single install, with nothing published. `build-cursor-plugin.sh` assembles the plugin:

```sh
./build-cursor-plugin.sh                       # skills + commands (recommended)
ln -s "$(pwd)/build/cursor-plugin/agent-toolbelt" ~/.cursor/plugins/local/agent-toolbelt
# then enable "agent-toolbelt" in Cursor → Settings → Plugins, and run Developer: Reload Window
```

Notes:
- **Skills** are the reliable, self-contained unit here — Cursor auto-discovers them
  globally and surfaces them on demand. This is the main reason to use the plugin.
- **Rules are omitted by default**: most of the repo's rules are `alwaysApply: true`,
  and a user-scoped plugin would fire them in *every* project. Pass `--with-rules` only
  if you want that. For scoped, per-project rules, use the per-repo `install.sh` instead.
- **Commands** are included for the `/command` UX, but some reference skill files by
  project-relative `skills/...` paths; for the full command-driven flow with those
  references resolving, a per-repo `install.sh --harness cursor` is still the way.

The symlink picks up rebuilds live (Reload Window); `build/` is gitignored.

Each pack's file list lives in `install/<pack>.sh`; the shared logic is in
`install/lib.sh`. Use `--dry-run` to preview and `--force` only when replacing a
previous install:

```sh
./install.sh --dry-run --harness cursor ai-feature-delivery /path/to/pilot-folder
```

On macOS, non-developer pilot users can double-click `install.command`, which
asks which pack(s) to install, which harness(es), whether to sweep child repos,
and then the target folder (drag it into the Terminal prompt and press Enter).

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
`.agents/skills/dev-lite-workflow` Codex skill, shared `skills/` copy,
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

Which harnesses receive files is controlled by `--harness` (see [Choosing
harnesses](#choosing-harnesses)). Note that the AI Feature Delivery pack ships
Cursor-only commands and rules, so installing it with `--harness claude` writes
only its shared `skills/`, `templates/`, and `workflows/` (the installer prints a
note for each pack that contributes nothing harness-specific).

## PR Review

The `pr-review` tool reviews a PR, branch, or local diff with escalating depth:

| Tier | Use When |
|---|---|
| `light` | quick gut-checks and tiny or low-risk diffs |
| `standard` | normal PRs that need broad facet coverage |
| `deep` | high-stakes, security-sensitive, or pre-merge reviews |

Install it into a project for Cursor, Claude Code, and Codex skill use:

```sh
./install.sh --harness all pr-review /path/to/project
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
./install.sh --harness all pr-review-reply /path/to/project
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
./install.sh --harness all review-on-open /path/to/project
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
./install.sh --harness all review-queue /path/to/project
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

## Phase Gate

The `phase-gate` tool is the **in-loop (synchronous)** third PR-review trigger —
the sibling of the async `review-on-open` (CI event + poller) and `review-queue`
(local push queue). In a phased build loop (plan → build phase → open PR → **gate**
→ next phase) it removes the manual "stop and review each phase PR" step: the main
agent delegates the review to a **fresh subagent** (clean context, not biased by the
build reasoning) that runs `/pr-review --comment` and posts inline findings to the PR.

```sh
./install.sh --harness all phase-gate /path/to/project
```

Run it at a phase boundary with:

```text
/phase-gate [target] [--merge] [--tier=light|standard|deep] [--rereview] [--no-post]
```

**Both flows post the review to the PR**; they differ only in what happens *after*:

- **Team (default).** Post the review, then **stop** — humans do the manual review
  and merge; the auto-review supplements theirs. No auto-merge.
- **Solo (`--merge`).** Post the review **and** return the findings to the main
  agent, which fixes blockers in-context and **merges** the phase PR (`gh pr merge
  --squash` / `az repos pr update --status completed`) before the next phase.

`--no-post` makes it report-only (also the automatic fallback when no host CLI is
present); `--rereview` adds one confirming pass after solo fixes. The host (GitHub
`gh` / Azure `az`) is auto-detected from the remote. It adds no review logic — it
wraps `pr-review`'s provider and posting layers — and pairs with
`phase-context-workflow` when each phase opens its own PR. All three triggers end in
`/pr-review --comment`.

## Cursor Hooks

`cursor-hooks` installs project-level [Cursor hooks](https://cursor.com/docs/hooks)
(`.cursor/hooks.json` + `.cursor/hooks/*.sh`) that wire two toolbelt principles into
Cursor's agent loop. Cursor-only (gated on `--harness cursor`); the scripts are pure
bash, invoked as `bash .cursor/hooks/<script>`, and run in cloud agents too since they
live in version control.

```sh
./install.sh --harness cursor cursor-hooks /path/to/project
```

| Hook | Fires on | Behavior |
|---|---|---|
| `doc-sync-guard.sh` | `git commit` (`beforeShellExecution`) | If the commit changes code but no docs (README, `docs/**`, `*.md`, `AGENTS.md`, `CLAUDE.md`), returns `ask` so you confirm — the local counterpart to the PR-open doc gate. |
| `review-nudge.sh` | `git push` (`beforeShellExecution`) | Returns `ask` to nudge running `/pr-review` before the branch leaves your machine. |

Both are **advisory** (worst case they prompt; never hard-block) and **fail-open** (a
hook error allows the action). Bypass per-action with `[skip-docs]` / `[skip-review]` in
the command, or disable entirely with `TOOLBELT_DOC_CHECK=0` / `TOOLBELT_REVIEW_NUDGE=0`.
If the target already has a `.cursor/hooks.json`, the installer **skips** it rather than
clobber your hooks — merge the two entries from `hooks/hooks.json` by hand.

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
./install.sh --harness all shape-up /path/to/project
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
./install.sh --harness all simplify /path/to/project
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
./install.sh --harness all cover /path/to/project
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
./install.sh --harness all ship-it /path/to/project
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
./install.sh --harness all retrofit /path/to/project
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
./install.sh --harness all handoff /path/to/project
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
./install.sh --harness all ticket-sync /path/to/project
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
