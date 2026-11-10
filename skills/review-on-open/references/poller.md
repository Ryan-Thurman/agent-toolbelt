# The poller — list open PRs, review the unseen ones

The host-agnostic trigger. One invocation of `/review-on-open` does a single **poll**: list the open
PRs, work out which are *due* (new or pushed since last review), and run `/pr-review … --comment` on
each in a fresh sub-agent. Repetition is delegated to `/loop` or `/schedule` — the poller itself is
one pass and must be safe to run again at any time.

Use this on **Azure Repos**, on **mixed-host** setups, when watching **several repos at once**, or as
a laptop-side watcher — anywhere the host can't (or doesn't) run CI on the PR event. On GitHub with
the event workflow wired, you don't need the poller; the event already fires the review
(`ci-event.md`).

## 1. Detect host & list open PRs

Detect the provider once (`shared/contracts/references/providers.md`), then list open PRs through it.
The fields you need per PR: **number/id**, **head SHA**, **author**, **title**, **draft state**, and an
**age** field (`updatedAt` on GitHub, `creationDate` on Azure).

```bash
# GitHub
gh pr list --state open \
  --json number,headRefOid,author,title,updatedAt,isDraft \
  --limit 100
```

```bash
# Azure Repos
az repos pr list --status active \
  --query '[].{id:pullRequestId, head:lastMergeSourceCommit.commitId, author:createdBy.uniqueName, title:title, isDraft:isDraft, created:creationDate}'
```

No host CLI installed/authenticated → there's nothing to poll: say so and stop (the poller can't
fall back to "git-only" the way a single review can — it needs the host to enumerate PRs).

Apply the **target filter** if given: a repo slug restricts to one repo; `--author=<x>` /
`--label=<y>` narrow the list (host-side flags where available, else filter the JSON). **Skip drafts**
by default (a draft isn't ready for review) unless the filter explicitly asks for them.

## 2. The due check (idempotency)

Idempotency is keyed on the PR's **head SHA** — review a given commit at most once.
The host-side head-SHA marker (`skills/pr-review/references/posting.md` → "Idempotency") is the
record of truth. A local seen-ledger caches it to save host calls:

```
.git/pr-review-seen.jsonl     # one JSON object per line, append-only
{"pr": 142, "sha": "9c1f…", "tier": "standard", "verdict": "REQUEST CHANGES", "at": "<iso>"}
```

A PR is **due** when both conditions are true:
1. The ledger has no entry for its current head SHA (no entry, or a new push).
2. The PR has no `pr-review:head=<current head SHA>` marker on the host.

Check condition 2 even when condition 1 passes. A CI run or another poller can review the same head.
In a `/schedule` cloud routine, the ledger does not persist between runs. There, condition 2 is the
only dedup.

`at` is a real timestamp — stamp it from the shell (`date -u +%FT%TZ`) when you append, since skill
runs can't call `Date.now()`.

## 3. Self-loop guard

A review bot must not chase its own tail:
- The **head-SHA marker** prevents re-reviewing an unchanged head. Posting a review does not change the
  head SHA, so the PR does not come back as due.
- **Optional author guard:** if the review bot account also *opens* PRs, skip PRs authored by it
  (`--author` of your own bot) unless explicitly told to self-review. State the rule you applied.

## 4. Honor `--max`

Take the first **N** due PRs, oldest age field first (longest-waiting served first). If more
than N are due, `log` the deferred PRs by number — never silently truncate; they're picked up next
tick. Default N small (e.g. 5) so an unattended routine can't spend unbounded tokens in one wake.

`--dry-run`: print the due list with the reason per PR (`new` / `head-changed <old>→<new>`) and the
deferred remainder, then stop. No review, no ledger write.

## 5. Review each in a fresh sub-agent

For each due PR, run the existing reviewer — **one fresh sub-agent per PR** (Task tool), so the
reviewer never shares context with the poller or with the agent that wrote the PR, and a slow review
doesn't block the others:

```
/pr-review <number-or-id> --comment            # + --tier=<t> if the poller was given one
```

Omit `--tier` to let `pr-review` auto-tier per diff — the right default for unattended review. The
sub-agent does all host-touching work (diff, inline posting, verdict) through the `pr-review`
provider layer, so GitHub/Azure differences are already handled there.

Apply the posting-confirmation invariant in `../SKILL.md` before the first post.

## 6. Record & summarize

After each review returns, **append** its `{pr, sha, tier, verdict, at}` to the ledger so the next
tick skips that commit. Then print a one-line summary per PR:

```
PR #142  REQUEST CHANGES  3 findings (1 blocker)  @9c1f… [standard]
PR #145  APPROVE          0 findings              @4d20… [light]
deferred (--max=5): #150, #151
```

## Scheduling

Don't build a loop inside this skill — compose with the runtime's schedulers:

- **Local, while you work:** `/loop 10m /review-on-open` — polls every 10 minutes in your session.
  Add a filter to scope it: `/loop 10m /review-on-open --author=my-bot --max=3`.
- **Hands-off / no machine kept awake:** a `/schedule` cloud routine running `/review-on-open` on a
  cron (e.g. every 15 min during work hours). It starts from a fresh clone, so it depends on the
  host marker, not the ledger.

Both just re-invoke this one-pass poller; the head-SHA marker makes every re-invocation safe.
