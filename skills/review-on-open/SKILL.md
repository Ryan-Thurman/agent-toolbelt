---
name: review-on-open
description: Trigger /pr-review when a PR opens or updates. Use for GitHub Actions or host-agnostic poller review automation, PRs opened by other agents, or a review bot. Drives pr-review with idempotent posting.
---

# review-on-open

If you have not read `shared/contracts/references/human-readable-output.md` in this session,
read it before you write for the user.

Toolbelt paths: a path that starts with `shared/`, `skills/`, `templates/`, or `workflows/` is relative to the Toolbelt root, `${CLAUDE_PLUGIN_ROOT}`. If that variable is not replaced, use the nearest folder above this file that contains `shared/contracts/`.

The **trigger** layer for `pr-review`. It decides *when* a fresh reviewer starts. Every path ends in
`/pr-review <pr> --comment`, so this pack adds no review logic.

## Two triggers, one reviewer

Pick by host and appetite for infrastructure. They are not exclusive; a repo can wire both.

| trigger | how it fires | fresh-context source | best for |
|---|---|---|---|
| **event (CI)** | the host's `PR opened/synchronize` event runs a headless `claude -p "/pr-review <n> --comment"` | each CI run is a brand-new process | **GitHub** repos — true event-driven, zero polling, no machine kept alive |
| **poller** | `/review-on-open` lists open PRs and reviews the unseen ones; driven on an interval by `/loop` or `/schedule` | each `/pr-review` sub-run is a fresh sub-agent | **Azure Repos**, mixed hosts, or anywhere without a webhook→CI path; also good for local "watch my repos" |

Decision rule: **if the host can run CI on the PR event, prefer the event path.** Use the poller for
hosts without event CI, mixed-host watching, several repos at once, or a laptop-side watcher.
Read `references/ci-event.md` to wire the event path.
Read `references/poller.md` before you run the poller.
When another local agent opens the PR, use the `review-queue` pack instead.

## Invariants

Apply the trigger invariants in `skills/pr-review/references/triggers.md`.
This pack adds these rules:

- The event path gets a fresh agent from a new CI process. The poller runs each `/pr-review` as its
  own sub-agent.
- Both triggers fire when a PR opens and when it gets a new push.
- Unattended runs (CI, a `/schedule` routine) post without a prompt. An **interactive**
  `/review-on-open` confirms before its first post, then continues for the rest of the poll.
- Event-path hardening is in `references/ci-event.md` → "Untrusted-diff hardening".
- The poller applies the self-loop guard in `references/poller.md`.

## Inputs (the `/review-on-open` poller)

- **target filter** *(optional)* — restrict the poll: a repo path/slug, or a host filter like
  `--author=<bot>` / `--label=needs-review`. Empty = open PRs on the current repo/host.
- **`--tier=light|standard|deep`** — passed through to `/pr-review`. Omit it to let pr-review
  auto-tier per diff. This is the right default for a bot.
- **`--max=<n>`** — cap PRs reviewed per poll (default 5). The rest wait for the next tick.
- **`--dry-run`** — list the PRs that would be reviewed (and why: new / head-changed) and stop. No
  review, no posting.
- **`--host=auto|github|azure`** — override host detection (`shared/contracts/references/providers.md`).
  Default `auto` from the origin remote.

## Completion

A poll is complete when each due PR has a posted review or a logged failure.
The poll also writes a ledger entry per reviewed PR and prints the summary from `references/poller.md`.
The event path is wired when `templates/review-on-open-github.yml` is in `.github/workflows/`.
The `ANTHROPIC_API_KEY` secret must also exist.

## References

- `references/poller.md` — list open PRs per host, due check, self-loop guard, fan-out, and scheduling.
- `references/ci-event.md` — the GitHub Actions template explained, secrets, untrusted-diff hardening,
  and the Azure Pipelines sketch.
- `skills/pr-review/references/triggers.md` — the invariants that apply to every review trigger.
- `skills/pr-review/references/posting.md` — the head-SHA marker that makes every trigger idempotent.
- `shared/contracts/references/providers.md` — host detection for PR listing and SHA reads.
- `shared/contracts/references/posting.md` — the opt-in / idempotent posting policy.
- `templates/review-on-open-github.yml` — the copyable workflow target repos drop into `.github/workflows/`.
