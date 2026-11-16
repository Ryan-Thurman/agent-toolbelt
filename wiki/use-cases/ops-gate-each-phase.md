# Gate each phase with a review before the next phase starts

This page is for a lead who builds a feature as phased pull requests (PRs) and wants an independent review at each phase boundary. You get a verdict for the phase head commit and a list of blockers with evidence. The gate then stops for people (team mode) or starts an agent loop that fixes and merges (solo mode).

| Roles | Skills and commands | Depth | You need |
| --- | --- | --- | --- |
| Lead, developer | [`phase-gate`](../../skills/phase-gate/SKILL.md) (`/phase-gate`), which runs [`pr-review`](../../skills/pr-review/SKILL.md) | Light, standard, or deep, set with `--tier`. Use standard for a normal phase. This run used standard. | A phase PR or branch, and the phase acceptance criteria in a file. A host CLI (`gh` or `az`) only to post the review. |

## Quick path

1. Start Claude Code in the repository with the Toolbelt loaded: `claude --plugin-dir <toolbelt-folder>`.
2. Write the phase acceptance criteria to a file with one checkable sentence for each criterion. The sample used `phase-1-intent.md`. One criterion reads: "A request without `limit` returns up to 10 tag names, as before."
3. Run the phase tests and keep the output. You paste the result into the gate prompt in the next step.
4. Run the gate in team mode: `/agent-toolbelt:phase-gate <pr-number-or-branch> --tier=standard --intent=<intent-file>`. The sample used `/agent-toolbelt:phase-gate phase-1-tag-limit --tier=standard --intent=phase-1-intent.md --no-post`. Add `--no-post` to print the review and post nothing.
5. Read the verdict and the acceptance coverage table. On `REQUEST CHANGES`, fix the blockers and run the gate again on the new head commit. On `NEEDS DISCUSSION`, answer the open questions first.
6. Merge only when the verdict is `APPROVE` and people agree. Then tell the agent to start the next phase.

For solo mode, run `/agent-toolbelt:phase-gate <pr-number-or-branch> --merge --tier=standard --intent=<intent-file>`. It needs a real PR and a signed-in `gh` or `az`. For a Phased Delivery PR, you must also approve the solo merge in the session. See [Solo mode](#solo-mode).

You get a review of the phase head commit and a stop before the next phase. The tool derives the verdict from the findings.
The sections below explain each step, when to stop, how solo mode differs, and what the output looks like.

## Situation

The sample is the RealWorld "Conduit" API in TypeScript (Express, Prisma, Jest). A feature of two phases is planned: phase 1 lets a client set how many tags `GET /api/tags` returns, and phase 2 adds an author filter. Phase 1 is built on the branch `phase-1-tag-limit`, off `master` at commit 30b68e1, in two commits (78970ed and 855b151).

The sample has no phased history. The runner wrote phase 1 for this page, so the review has something to find. The runner left the limit check partial on purpose: it rejects only values that are not numbers. The runner did not plan the second defect. The new test file does not compile, and the run found that when it ran the tests.

The four acceptance criteria of phase 1 are in the file `phase-1-intent.md`:

1. `GET /api/tags?limit=<n>` returns at most n tag names, ordered by article count, highest first.
2. A request without `limit` returns up to 10 tag names, as before.
3. A `limit` that is not a whole number from 1 to 50 returns status 422 with an error message for the field `limit`.
4. Unit tests cover the default limit, a custom limit, and each invalid-limit case.

The branch is local. No PR exists, so nothing was posted. The run was headless and had no subagent tool. The run applied each review lens itself and labeled the result Self-review. In your session, the gate starts a fresh subagent for the review.

## Why this path

The obvious alternative is to run `pr-review` yourself on each phase PR. That works for one review. It costs you the loop around the review. You must remember to pass the acceptance criteria and to choose the depth each time. Nothing stops the agent from starting phase 2 on top of an unreviewed phase 1. The gate adds only the phase-boundary rules: a fresh reviewer, an independent packet, a stop, and a re-review after each fix. The review itself is `pr-review`.

The other alternatives are asynchronous. `review-on-open` and `review-queue` start a review when a PR opens or when a job arrives, so the build session does not wait. Use them when review must not block the builder. See [ops-review-every-pr-on-open](ops-review-every-pr-on-open.md) and [ops-agent-to-agent-review-queue](ops-agent-to-agent-review-queue.md). The gate is synchronous: the next phase waits for the verdict. That costs you the time of one review for each phase.

The steps have this order for two reasons that the skill states. The reviewer must not share context with the agent that wrote the code, so the gate never reviews inside the build session. A fix commit changes the head commit, so every fix needs a new review before a merge.

## Steps

The steps follow the team workflow in [`phase-gate-team-workflow.md`](../../workflows/phase-gate-team-workflow.md).

| Step | Do | Why | Done when |
| --- | --- | --- | --- |
| 1 | Load the Toolbelt in Claude Code: `claude --plugin-dir /path/to/agent-toolbelt`. Or install the skills into the project: `./install.sh --harness all phase-gate pr-review pr-improve /path/to/project`. | The gate and the review skill must be available in your session. | You type `/` and see `/agent-toolbelt:phase-gate` (plugin) or `/phase-gate` (installed copy) in the list. |
| 2 | Agree the phases before you build. One phase is one PR. For a ticket, use [`phased-delivery`](../../skills/phased-delivery/SKILL.md) (see [Deliver an approved ticket as phased pull requests](dev-deliver-a-ticket-as-phased-prs.md)). | The gate reviews one phase at a time, so the phase boundary must exist. | You have a plan with one entry for each phase. |
| 3 | Build the phase on a focused branch, and commit as you go. Open the phase PR against the base branch. In the sample, the branch is `phase-1-tag-limit` and no PR exists. | The review reads the diff between the base and the head of this branch. | `git log <base>..<branch> --format='%h %s'` lists only this phase. |
| 4 | Write the phase acceptance criteria to a file. In the sample, the file is `phase-1-intent.md`. Copy the clauses from the ticket. Do not write them from the code. | The gate passes the file as `--intent`. The review then checks each clause, and it does not invent requirements. | Each criterion is one checkable sentence. |
| 5 | Run the tests that you can run, and keep the output. In the sample: `DATABASE_URL=postgresql://u:p@localhost:5432/db JWT_SECRET=x npx jest src/tests/services/tag.service.test.ts`. This needs the installed dependencies and the generated Prisma client. It needs no database, because the sample tests mock Prisma. | The gate packet carries test evidence. The skill does not say which command to run, so you choose it. A failed check or a check that did not run is a scope gap in the review. You paste the result, with its command, exit code, and date, into the gate prompt in step 6. | You have a result for the phase tests and a result for the same file on the base. In step 6, paste the test result, the base, the head, and the plan section into the gate prompt. |
| 6 | Start the agent in the repository folder and run the gate: `/agent-toolbelt:phase-gate <pr-number-or-branch> --tier=standard --intent=<intent-file>`. In the sample: `/agent-toolbelt:phase-gate phase-1-tag-limit --tier=standard --intent=phase-1-intent.md --no-post`. | Team mode is the default. It starts a fresh review subagent, posts the review to the PR, and stops. `--no-post` drops the posting. | The gate prints a verdict and a one-line summary for one head commit. |
| 7 | Read the verdict, the coverage line, and the acceptance coverage table. Compare the commit that the review names with `git rev-parse HEAD`. A posted review names it in the marker `pr-review:head=<sha>`. | The verdict belongs to the commit that the reviewer read. | The commit matches, and each criterion has the status `Verified`, `Failed`, or `Not verified`. |
| 8 | Fix each blocker on the phase branch. Run the gate again on the new head. | A new head commit is a new review target, and the marker for the old commit does not cover it. | The latest review at the current head says `APPROVE`. |
| 9 | Humans review and merge the phase PR. For the human threads, use [`pr-review-reply`](../../skills/pr-review-reply/SKILL.md). Tell the agent to continue. | In team mode the gate never merges and never starts the next phase. | The PR shows as merged, and you said to continue. |

## Decision points

- If the phase touches auth, payments, migrations, a public API contract, or security-sensitive code, pass `--tier=deep` for the final review. If the phase holds only docs, tests, configuration, or mechanical changes, pass `--tier=light`. The tier advice is in `modes.md` of the skill. Omit `--tier` only when you want the automatic choice. In this run the automatic choice and the explicit choice were both standard.
- If the verdict is `REQUEST CHANGES`, fix the blockers and run the gate again. The gate does not fix code in team mode.
- If the verdict is `NEEDS DISCUSSION`, answer the open questions or close the scope gap. A scope gap is a failed review stage, a failed required check, or a file that nobody read. A gap always blocks approval.
- If a criterion is `Not verified`, run the check that the table names. In this run, criterion 1 needs a database for the count and the order.
- If you run the gate again on a head commit that already has a review marker, the host review repeats only with `--repost`. In solo mode, `--rereview` adds one confirming review before the merge. With `--no-post`, `--rereview` needs no `--repost`.
- In solo mode, stop and hand off as team mode in four cases: the loop ends capped-not-converged after 2 fix rounds, the verdict is `NEEDS DISCUSSION`, the host refuses the merge, or the review was a self-review because no subagent tool exists. For a Phased Delivery PR, also stop without your explicit approval for a solo merge. If you do not trust the agent to merge alone, choose team mode.
- If the target has no PR, or the host CLI is missing, the review stays local. Solo mode never merges a branch that has no PR. Posting needs a real PR and a signed-in `gh` or `az`. The host rules are in `shared/contracts/references/providers.md` of the Toolbelt.
- If you need the review to run when a PR opens, with no wait in the build session, choose `review-on-open` or `review-queue` instead.
- If you want one review with no phase loop, use [`pr-review`](../../skills/pr-review/SKILL.md) directly, as in [Check a branch before you open a pull request](dev-self-review-before-a-pr.md).
- Stop when the latest review at the current head says `APPROVE` and a human has merged the phase PR. Stop earlier, and do not start the next phase, whenever the verdict is not `APPROVE`.

## Solo mode

This section comes from the skill files. The run did not execute solo mode, and nothing was merged. The loop is in [`phase-gate-solo-workflow.md`](../../workflows/phase-gate-solo-workflow.md).

Solo mode (`/phase-gate --merge`) is for personal work. The main agent fixes blockers, re-reviews, and merges an approved phase PR. The flow in `modes.md` has the first four rules below. Items 5 and 6 come from `merge.md`.

1. A fresh review subagent runs `pr-review --comment`. The main agent records the reviewed head branch and SHA.
2. On `APPROVE`, the agent goes to the merge. On `REQUEST CHANGES`, it runs one fix round with [`pr-improve`](../../skills/pr-improve/SKILL.md) on the blockers. On `NEEDS DISCUSSION`, it stops and reports the open questions.
3. The gate allows 2 fix rounds in total, unless you set another bound. After the last round, a remaining blocker stops the gate with the status capped-not-converged.
4. Each fix commit changes the head, so a fresh subagent reviews the new head before any merge.
5. The merge needs a clean worktree, the reviewed branch, and the reviewed SHA. It uses the host merge, for example `gh pr merge <pr> --squash`. It never force-pushes. If the host refuses the merge, the gate stops and reports.
6. A Phased Delivery PR (a phase PR planned with `phased-delivery`) needs your explicit approval for a solo merge in that session. Without the approval, the gate hands off as team mode.

For the review on this page, solo mode takes this route. The verdict `REQUEST CHANGES` sends the loop to a fix round, with 0 of 2 rounds used. The loop does not merge. The run printed the three read-only checks of the merge precondition against the reviewed head (clean worktree, branch `phase-1-tag-limit`, commit 855b151). It did not run `gh pr view` or `gh pr merge`.

Choose solo mode only when you trust the agent to review, fix, and merge, and you accept that no human reads the PR. For a team repository, use the default team mode.

## What you get

The run was headless. No person answered a question, and the review ran as a Self-review of the agent that wrote the phase. The team flow printed the verdict and stopped.

Excerpt from a run on the Conduit sample API at phase head 855b151 (base 30b68e1). The first line is the review header. The last line is the gate output, which the run report prints on one line. Text between them is left out.

```text
## PR Review — phase-1-tag-limit  ·  tier: standard  ·  **REQUEST CHANGES**
...
Gate output (team mode): REQUEST CHANGES at 855b151. 2 blockers, 1 should-fix. Not posted (`--no-post`, no pull request). The gate stops here. It does not fix, merge, or start phase 2.
```

This run predates PR #60. The skill now prints the full `pr-review` report with `--no-post`, and the one-line verdict summary applies only when the review posts.

The acceptance coverage table shows the result for each criterion.

Excerpt from a run on the Conduit sample API at phase head 855b151 (base 30b68e1). Condensed from the run report: the rows for criteria 2 and 3 are shown. The cell text is verbatim.

| # | Criterion | Status | Evidence |
|---|---|---|---|
| 2 | A request without `limit` returns up to 10 tag names | Verified | Probe: no `limit` gives `take=10` (mocked Prisma). |
| 3 | A `limit` that is not a whole number from 1 to 50 returns 422 with an error for `limit` | Failed | tag.controller.ts:18 rejects only NaN. Probe: 0, -5, 2.5, empty, and 1000000 return status 200. |

Criterion 1 had the status `Not verified`, because the count and the order need a database. Criterion 4 had the status `Failed`.

The probe is a small test that the runner wrote for this run. It mounts the route on an Express app with a mocked Prisma client and sends nine query strings. It is not part of the skill. The probe line shows the value that the route passes to the query as `take`.

Excerpt from a run on the Conduit sample API at phase head 855b151 (base 30b68e1). These are seven of the nine lines of the probe output. The lines for an empty `limit` and for a repeated `limit` are left out. The mock returns one tag, so the body is not evidence about the data.

```text
?                 status=200 take=10 body={"tags":["t"]}
?limit=3          status=200 take=3 body={"tags":["t"]}
?limit=abc        status=422 take=not called body={"errors":{"limit":["must be a number"]}}
?limit=0          status=200 take=0 body={"tags":["t"]}
?limit=-5         status=200 take=-5 body={"tags":["t"]}
?limit=1000000    status=200 take=1000000 body={"tags":["t"]}
?limit=2.5        status=200 take=2.5 body={"tags":["t"]}
```

The second blocker is the test file. The base file passes with one `todo` test. The head file does not compile.

Excerpt from a run on the Conduit sample API at phase head 855b151 (base 30b68e1). The first two lines come from the head run and the last line from the base run. Both runs used `src/tests/services/tag.service.test.ts`. The head run also printed the message "Test suite failed to run".

```text
Test Suites: 1 failed, 1 total
Tests:       0 total
Tests:       1 todo, 1 total
```

What you must check in the output:

- The verdict matches the findings: blockers give `REQUEST CHANGES`. The tool derives it, and you cannot argue it up to `APPROVE`.
- The reviewed commit is the head of your branch. A review of an older commit says nothing about the current one.
- The coverage line names what the review did not read or run. In this run, no database was available, so criterion 1 and every database-backed test stayed unverified. The 7 failing tests in `auth.service.test.ts` fail on the base and the head with the same cause.
- Each `Failed` criterion has a finding with a blocker or should-fix bucket.
- The nits are hidden when a blocker exists. One nit was hidden here.

Two things differ on your side. In this run the review was a Self-review, so the independence rule was not met. A real gate runs the review in a fresh subagent. The run also did not post. In team mode without `--no-post`, the subagent posts the findings inline to the PR on GitHub or Azure Repos. The humans see them before their own review.

## Common mistakes

- You review in the build session. The reviewer then shares the author's context and misses what the author missed. Let the gate start a fresh subagent.
- You merge after a fix without a new review. The fix commit is new code that no review has read. Run the gate on the new head.
- You pass the coding agent's summary as the intent. The reviewer then confirms the summary, not the ticket. Pass the acceptance criteria from the ticket.
- You treat a green or missing test run as a pass. In this run, the phase test file failed to compile, and the run count shows "0 tests". Read the suite line.
- You expect the gate to fix blockers in team mode. It does not. Humans or the author fix them. Only solo mode fixes, through `pr-improve` (the skill that fixes an agreed list of review findings).
- You use `--tier=deep` on every phase. Deep costs about 8 times a light review, and the skill advises standard for a normal phase and one deep review at the end. Pay for deep once.
- You trust a limit check on a public route because the code has one. The phase here checked for NaN only. Read the criteria against the code.

## Next

- [Deliver an approved ticket as phased pull requests](dev-deliver-a-ticket-as-phased-prs.md): to plan and build the phases that this gate reviews.
- [ops-review-every-pr-on-open](ops-review-every-pr-on-open.md): when review must start with no wait in the build session.
- [ops-agent-to-agent-review-queue](ops-agent-to-agent-review-queue.md): when another agent runs the reviews from a queue.
- [ops-enforce-a-pre-pr-gate](ops-enforce-a-pre-pr-gate.md): to check a branch before the PR opens.
- [Answer review comments on your pull request](dev-answer-review-comments.md): when humans or the gate leave comments on the PR.
- [Check a branch before you open a pull request](dev-self-review-before-a-pr.md): when you want one review and no phase loop.
- [Run two agents in one repository at the same time](dev-run-agents-in-parallel.md): when agents share one folder during the phase loop.
- [Survive a context reset in the middle of a task](dev-survive-a-context-reset.md): when a long phase loop outlasts one session.
- [Prepare a release and decide go or no-go](lead-prepare-a-release.md): when the last phase is merged.
- [ops-install-for-a-team](ops-install-for-a-team.md): to set up the skills for each developer.
