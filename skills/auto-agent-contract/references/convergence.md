# Converging a review→fix loop

The toolbelt knows how to *re-review*: `review-on-open` fires on a new head SHA, `pr-review-reply
--since` re-reads changed code. Neither knows how to **stop**. In an unattended loop that gap is the
difference between a phase that lands and a phase that burns its budget arguing with itself.

This is the **within-PR** sibling of `skills/pr-review/references/rejection-memory.md`, which is the
cross-run memory. Read both: this file stops one PR's loop, that one stops the same false positive
recurring across PRs.

## The failure it prevents

Treat every finding as a requested update and the loop eats itself:

1. The reviewer raises a nit — a variable name.
2. The nit is non-empty, so the verdict is `CHANGES_REQUESTED`, so a FIX job spawns.
3. The fix changes the tree.
4. A **fresh** review of the changed tree finds *new* nits, because it is a fresh review.
5. Two rounds exhaust the attempt budget.
6. The phase lands `BLOCKED` over a variable name, and a human is paged at 2am.

Nothing in that sequence is a bug. Every step is the system working as specified. The specification
is what's wrong.

> Evidence: `dfbde2b` "Treat all review findings as requested updates (#23)" → `c47dc31` "Review-fix
> robustness (limit 2 + hardened prompt)".

---

## Rule 1 — The ratchet

**On a re-review of a fix round, only *new blocking* findings may be raised.**

Anything below blocker on a re-review is **recorded, not raised**: it lands in the report for a human
to read later, and it does not spawn a fix, does not flip the verdict, and does not consume an
attempt.

The reasoning is that a fix round is scoped. The reviewer was asked "did the blockers get fixed", not
"review this PR again from scratch". A fresh nit on round two is evidence the reviewer re-reviewed the
whole diff, not evidence the fix was bad.

The first review is unconstrained — that's where nits belong. The ratchet only tightens on rounds
≥ 2, and it only ever tightens.

## Rule 2 — Detect the no-op fix

A fixer routinely reports success while the tree is **byte-identical**. It read the finding, decided
the finding was wrong, and said "pushed".

Do not spend an attempt on it, and do not re-review. Compare the tree before and after the fix job:

```bash
before="$(git rev-parse HEAD)"
# … run the fix agent …
after="$(git rev-parse HEAD)"
[ "$before" = "$after" ] && echo "no-op fix — do not re-review"
```

A no-op fix is a **disagreement**, not a failure. The right response is to escalate with both the
finding and the fixer's stated reason, so a human adjudicates once — not to loop and let the fixer
decline three more times.

Check the worktree too: a fixer that edited files without committing has produced changes the reviewer
will never see, because the reviewer reads the PR.

## Rule 3 — Bounded attempts, with an explicit escalate state

**A budget is not a loop guard.** These are different, and only the first is safe:

```
while not clean:            # unbounded — will not terminate on a disagreement
    fix(); review()

for attempt in 1..N:        # bounded, with somewhere to land
    fix(); review()
    if clean: return COMPLETE
return BLOCKED              # explicit terminal state, escalates to a human
```

`BLOCKED` is a **state**, not an error. It is resumable: a human fixes the thing or overrules the
finding, and the loop picks up where it stopped. `agent-runner` exposes `unblock [--phase N]` for
exactly this.

**Persist the attempt count outside memory.** Count attempts from the phase's recorded FIX jobs, not
an in-memory counter. An orchestrator that restarts — including a post-merge self-restart — resets an
in-memory dict and re-spends the whole budget on the same blocked phase, forever. This one is
invisible until the day something restarts.

> Evidence: `406b24b` — "The autofix attempt budget is now counted from the phase's recorded AUTOFIX
> jobs instead of an in-memory dict".

**Escalate somewhere a human will look.** When the budget is exhausted, post the blocking message and
the fixer's log tail as a GitHub issue (deduped by an event marker so a resumed run does not repost).
A `BLOCKED` row in a SQLite table is not an escalation.

---

## What "clean" means

Clean is computed, never asserted. `skills/pr-review/references/output-format.md` derives the verdict
mechanically from bucket counts: **blockers > 0 ⇒ REQUEST CHANGES**. Do not ask the model whether the
PR is ready; count its blockers.

Under the ratchet, "clean enough to merge" on round ≥ 2 means **zero new blockers**, with recorded
should-fixes and nits attached to the PR for a human. See `references/unattended.md` for which buckets
gate when nobody is watching.
