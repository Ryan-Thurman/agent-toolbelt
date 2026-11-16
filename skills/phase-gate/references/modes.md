# Phase gate modes

`phase-gate` has two modes. Both run a fresh review subagent at the phase
boundary. They differ in what happens after the review is posted.

## Mode matrix

| | default team mode | solo `--merge` mode |
|---|---|---|
| Reviewer | subagent runs `/pr-review --comment` | subagent runs `/pr-review --comment` |
| Review posted to PR | yes, inline on GitHub/Azure | yes, inline on GitHub/Azure |
| Findings returned to main agent | verdict summary only (humans drive follow-up) | yes (blockers become the action list) |
| Who fixes | humans during manual review | main agent, in context, through `pr-improve` |
| Re-review | humans decide | automatic after every fix commit |
| Merge | never | main agent merges when the verdict is `APPROVE` |
| After the gate | stop for human review | proceed to the next phase |

`--no-post` makes either mode report-only: drop `--comment`, print the full review report as
`pr-review` renders it (`skills/pr-review/references/output-format.md`), and do not write to the host.
The verdict-summary row of the matrix applies only when the review posts. With `--no-post`,
`--rereview` needs no `--repost`. If the host CLI is absent, posting degrades to the same report-only
path. Host detection follows `shared/contracts/references/providers.md`.

## Inputs before the review

- **Test evidence.** The main agent runs the project's required checks on the phase head before the
  review starts. Team mode: the author runs them. The reviewer is read-only and does not run tests.
  Put each result in the reviewer packet with its command, exit code, and run date. A failed check or a
  check that did not run is a scope gap in the review. Team mode reports it. Solo mode stops and reports it.
- **Branch with no PR.** Team and solo flows need a PR to post to. For a branch target with no open PR,
  run as `--no-post`, print the verdict, and stop. Solo mode never merges a branch.
- **No sub-agent tool.** The main agent runs the review in its own session, labeled
  `Self-review: facets not independent`. Team mode posts it with that label. Solo mode does not merge a
  self-review. It stops and reports, and the user decides the next step.

## Tier

`--tier=light|standard|deep` passes through to `pr-review`. This section is the
single source of tier advice for phase gates.

- Pass **`standard`** for a normal phase. Deep buys severity calibration (dual-judge),
  which the final pre-merge review buys again. Pay for it once, at the end.
- Pass **`light`** for low-risk docs, tests, config, or mechanical phases.
- Pass **`deep`** for the final merge-gating review, or for phases on high-stakes surfaces:
  auth, payments, migrations, breaking public-API changes, or security-sensitive code.
- Omit `--tier` only when you want `pr-review` auto-tier.

## Team flow

1. Spawn one review-only subagent and instruct it to run
   `/pr-review <pr> --comment --tier=<t> --intent=<source>`.
   With `--no-post`, drop `--comment`.
2. The subagent reviews the phase diff, posts findings inline, and returns a
   verdict summary.
3. Print the verdict and one-line summary, then stop. Do not merge and do not
   start the next phase until a human says so.

## Solo flow

The gate counts fix rounds across the whole flow. The total bound is 2, unless the user
sets another bound.

1. Spawn one review-only subagent with the same command as Team flow step 1.
   Record the reviewed head branch and SHA.
2. Route by verdict:
   - `APPROVE`: go to step 5. With `--rereview`, first spawn one more review subagent with
     `--repost` added, because the head SHA already has a review marker. Route its verdict
     again, but do not run `--rereview` a second time.
   - `REQUEST CHANGES`: if the gate has used all fix rounds, stop and report
     capped-not-converged with the remaining blockers. Otherwise, go to step 3.
   - `NEEDS DISCUSSION`: stop and report the open questions and scope gaps. Do not merge.
     Continue only after the user resolves each one.
3. Run one fix round with the `pr-improve` skill and these settings:
   - findings: the review's blockers, pre-accepted by this gate
   - scope: the phase PR's changed paths
   - round bound: 1 (this gate owns the total count).

   `--merge` authorizes commit and push to the phase branch. Non-blocker findings are
   surfaced but do not gate. If `pr-improve` reports escalated, stop and report it.
4. Add 1 to the fix-round count. Commit, push, and spawn a fresh review subagent on the new
   head. This review replaces `pr-improve`'s own re-review step. Go back to step 2.
5. Merge the phase PR through `merge.md`. Confirm the merge, then proceed to the next phase.
