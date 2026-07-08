# Phase Gate Modes

`phase-gate` has two modes. Both run a fresh review subagent at the phase
boundary. They differ in what happens after the review is posted.

## Mode Matrix

| | default team mode | solo `--merge` mode |
|---|---|---|
| Reviewer | subagent runs `/pr-review --comment` | subagent runs `/pr-review --comment` |
| Review posted to PR | yes, inline on GitHub/Azure | yes, inline on GitHub/Azure |
| Findings returned to main agent | no; humans drive follow-up | yes; blockers become the action list |
| Who fixes | humans during manual review | main agent, in context |
| Merge | never | main agent merges the phase PR |
| After the gate | stop for human review | proceed to the next phase |

`--no-post` makes either mode report-only: drop `--comment`, print the review,
and do not write to the host. If the host CLI is absent, posting degrades to the
same report-only path.

`--tier=light|standard|deep` passes through to `pr-review`. Omit it to use
auto-tier. For in-loop phase gates prefer explicit **`standard`**: deep buys
severity calibration (dual-judge), which you re-buy anyway at the final
pre-merge review — pay for it once, at the end, not per phase. Reserve `light`
for low-risk docs/tests/config/mechanical phases, and `deep` for the final
merge-gating review or phases touching high-stakes surfaces (auth, payments,
migrations, breaking public-API changes, security-sensitive code).

Host detection follows the shared provider contract:
`shared/contracts/references/providers.md`.

## Team Flow

1. Spawn one review-only subagent and instruct it to run
   `/pr-review <pr> --comment --tier=<t>`.
2. The subagent reviews the phase diff, posts findings inline, and returns a
   verdict summary.
3. Print the verdict and one-line summary, then stop. Do not merge and do not
   start the next phase until a human says so.

## Solo Flow

1. Spawn one review-only subagent and instruct it to run
   `/pr-review <pr> --comment --tier=<t>`.
2. Read the returned findings. Blockers are the action list; non-blockers are
   surfaced but do not gate.
3. Apply blocker fixes in the main agent context, commit, and push to the PR
   branch.
4. If `--rereview` is set, spawn one confirming review subagent scoped to the
   fix; otherwise do not loop.
5. When no blockers remain, merge the phase PR through `references/merge.md`.
   Confirm the merge, then proceed to the next phase.
