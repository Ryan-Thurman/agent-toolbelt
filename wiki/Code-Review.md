# Code Review

`pr-review` is the review engine; the rest of this page is the triggers and
round-trip tooling layered over it. All three triggers end in `/pr-review --comment`.

- [PR Review](#pr-review) — the tiered review engine.
- [PR Review Reply](#pr-review-reply) — answer a human reviewer's threads.
- [Review on Open](#review-on-open) — event/poller trigger.
- [Review Queue](#review-queue) — local push-queue trigger.
- [Phase Gate](#phase-gate) — in-loop trigger at phase boundaries.
- [Cursor Hooks](#cursor-hooks) — commit/push advisory gates.

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
The installer adds the `/pr-review` and `/pr-review-init` commands, the full
`pr-review` skill tree, the `templates/pr-review.md` config sample, and the
`examples/` reference material. On
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

Target repos declare local review priorities in a `.pr-review.md` at their
root — domain context, always-run facets, concrete budgets, severity overrides,
do-not-flag suppressions, and a minimum tier. Draft one from repo evidence with
`/pr-review-init` (it mines the docs, revert/hotfix history, review threads, and
rejection memory, then leaves a draft for the team to prune and commit), or copy
`templates/pr-review.md` as a blank starter. When a review runs in a repo
without one and hits a situation the config would solve, the report footer
nudges once toward the generator.

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
