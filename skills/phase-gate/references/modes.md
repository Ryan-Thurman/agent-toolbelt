# Phase Gate Modes

`phase-gate` has two modes. Both run a fresh review subagent at the phase
boundary. They differ in what happens after the review is posted.

## Mode Matrix

| | default team mode | solo `--merge` mode |
|---|---|---|
| Reviewer | subagent runs `/pr-review --comment` | subagent runs `/pr-review --comment` |
| Review posted to PR | yes, inline on GitHub/Azure | yes, inline on GitHub/Azure |
| Findings returned to main agent | verdict summary only; humans drive follow-up | yes; blockers become the action list |
| Who fixes | humans during manual review | main agent, in context, through `pr-improve` |
| Re-review | humans decide | automatic after every fix commit |
| Merge | never | main agent merges when the verdict is `APPROVE` |
| After the gate | stop for human review | proceed to the next phase |

`--no-post` makes either mode report-only: drop `--comment`, print the review,
and do not write to the host. With `--no-post`, `--rereview` needs no `--repost`.
If the host CLI is absent, posting degrades to the same report-only path. Host detection follows `shared/contracts/references/providers.md`.

## Tier

`--tier=light|standard|deep` passes through to `pr-review`. This section is the
single source of tier advice for phase gates.

- Pass **`standard`** for a normal phase. Deep buys severity calibration (dual-judge),
  which the final pre-merge review buys again. Pay for it once, at the end.
- Pass **`light`** for low-risk docs, tests, config, or mechanical phases.
- Pass **`deep`** for the final merge-gating review, or for phases on high-stakes surfaces:
  auth, payments, migrations, breaking public-API changes, or security-sensitive code.
- Omit `--tier` only when you want `pr-review` auto-tier.

## Team Flow

1. Spawn one review-only subagent and instruct it to run
   `/pr-review <pr> --comment --tier=<t> --intent=<source>`.
   With `--no-post`, drop `--comment`.
2. The subagent reviews the phase diff, posts findings inline, and returns a
   verdict summary.
3. Print the verdict and one-line summary, then stop. Do not merge and do not
   start the next phase until a human says so.

## Solo Flow

The gate counts fix rounds across the whole flow. The total bound is 2, unless the user
sets another bound.

1. Spawn one review-only subagent with the same command as Team Flow step 1.
   Record the reviewed head branch and SHA.
2. Route by verdict:
   - `APPROVE` — go to step 5. With `--rereview`, first spawn one more review subagent with
     `--repost` added, because the head SHA already has a review marker. Route its verdict
     again, but do not run `--rereview` a second time.
   - `REQUEST CHANGES` — if the gate has used all fix rounds, stop and report
     capped-not-converged with the remaining blockers. Otherwise, go to step 3.
   - `NEEDS DISCUSSION` — stop and report the open questions and scope gaps. Do not merge.
     Continue only after the user resolves each one.
3. Run one fix round with the `pr-improve` skill and these settings:
   - findings: the review's blockers, pre-accepted by this gate;
   - scope: the phase PR's changed paths;
   - round bound: 1 (this gate owns the total count).

   `--merge` authorizes commit and push to the phase branch. Non-blocker findings are
   surfaced but do not gate. If `pr-improve` reports escalated, stop and report it.
4. Add 1 to the fix-round count. Commit, push, and spawn a fresh review subagent on the new
   head. This review replaces `pr-improve`'s own re-review step. Go back to step 2.
5. Merge the phase PR through `merge.md`. Confirm the merge, then proceed to the next phase.
