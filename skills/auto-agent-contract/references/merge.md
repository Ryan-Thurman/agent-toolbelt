# Merging a PR an agent authored and reviewed

`skills/phase-gate/references/merge.md` covers the in-harness case: solo mode, zero blockers, ordinary
base branch, provider-aware merge command. Everything there still applies. This file adds what an
orchestrator learns the hard way when there is no human to notice the merge did the wrong thing.

## The close precondition is three checks, not one

Before merging, verify that the thing you are about to merge is **the thing that was reviewed**. That
is three separate facts, and each one has failed independently:

1. **The worktree is clean.** Uncommitted changes are unreviewed changes. The reviewer read the PR;
   the PR does not contain them. Refuse to close, and name the paths.
2. **The current branch is the reviewed published branch.** An orchestrator that resumed on a
   different branch will merge a different PR.
3. **Local `HEAD` equals the reviewed published SHA.** If HEAD moved after the review — a late commit,
   a rebase, an autofix that landed after the verdict — then the review adjudicated code that is not
   what merges. **Re-review; do not merge.**

Store the reviewed branch and SHA when the review runs, and compare at close. Then, at the merge call
itself, re-validate the *host's* view of the PR (`headRefOid`) against that same stored SHA — the
local check and the host check catch different failures.

In an attended flow a human notices "wait, I pushed after the review". Unattended, this is a
correctness hole: **you merge code nothing reviewed.**

> Evidence: `agent_runner/phase_loop.py:2733` (`_verify_reviewed_head_for_close`), called before close
> at `:1360`; `_validate_pr_metadata` re-checks `headRefOid` at the merge preflight.

## The host API is eventually consistent

`gh pr view --json headRefOid` reports the **pre-push** head for seconds after a push. A naive
verify-then-merge reads a stale SHA, decides the PR does not match the reviewed SHA, and blocks a
perfectly mergeable PR.

Retry the preflight with a bound:

```python
MERGE_VERIFY_ATTEMPTS = 5        # ~30s total, backing off between attempts
for attempt in range(1, MERGE_VERIFY_ATTEMPTS + 1):
    payload = gh_pr_view(pr_url, fields="url,headRefName,headRefOid,state,mergeable,isDraft")
    if payload["headRefOid"] == expected_sha:
        break
    if attempt == MERGE_VERIFY_ATTEMPTS:
        raise JobError(f"PR head never caught up to {expected_sha[:12]}")
    sleep(backoff)
```

Do **not** loosen the SHA check to work around the lag. The check is the correctness rule from the
section above; the retry is the accommodation. Loosening it merges unreviewed code to fix a timing
bug.

> Evidence: `95923a3` — "retry merge preflight on stale PR head; add unblock command".

## Already-merged is success, not failure

Operators merge by hand. They merge because the bot was slow, or because they were in the UI anyway.
A merge preflight that demands `state == OPEN` treats a hand-merged PR as a failure and **re-blocks a
completed phase** — the one outcome guaranteed to make someone stop using the orchestrator.

If the PR is already merged, verify it is the *right* merge and treat it as success:

- the PR's merge commit is reachable from the local base branch (fetch the base first — a stale local
  base is not evidence of anything), **and**
- the plan marks the phase complete and its protected body hash still matches what you recorded.

Both hold → mark complete, refresh the recorded SHA, emit a `phase.reconciled` event. Either fails →
**block with a clear message** rather than guessing. "Someone merged something" is not proof that the
phase you are tracking is done.

> Evidence: `2a51c07` — "treat an already-merged phase PR as success when resuming merge".

## Make the close resumable

"Review clean" and "merged" are not adjacent. Between them sits a host call that can time out, get
rate-limited, or succeed while the response is lost. With no intermediate state, a merge failure
re-runs the entire close — including the closer agent, including the plan write-back.

Add a state between them, and make each transition idempotent:

```
REVIEWING → CLOSING → MERGING → COMPLETE
                 ↘ BLOCKED (resumable via `unblock`)
```

A run that dies in `MERGING` resumes at `MERGING`, re-reads the PR, finds it merged (see above), and
completes. A run that dies in `CLOSING` re-runs only the close.

> Evidence: `95923a3` added `CLOSING → MERGING`.

## Never let the model merge

The merge is a host action derived from a count of blockers. It never routes through the agent that
produced the findings, and the reviewer's tool allowlist must not contain `gh pr merge` — or
`Bash(gh:*)`, which contains it (`references/invocation.md` §4).

Related: an agent **cannot formally review its own PR**. GitHub rejects `APPROVE` and
`REQUEST_CHANGES` on a PR you authored; post a plain comment carrying the verdict as text.
`skills/pr-review/references/posting.md` already specifies this for both GitHub and Azure — including
that Azure *permits* self-votes and you still shouldn't cast one. Follow it.
