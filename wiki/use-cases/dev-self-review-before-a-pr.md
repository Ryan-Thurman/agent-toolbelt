# Check a branch before you open a pull request

This page is for a developer who has a finished branch and wants to find problems before a reviewer does. You get a local review report with a verdict, a list of findings and open questions, and a readiness verdict. Nothing is posted anywhere. If your PR is already open, use `/pr-review` instead (see Decision points).

| Roles | Skills and commands | Depth | You need |
| --- | --- | --- | --- |
| Developer | [`pr-review`](../../skills/pr-review/SKILL.md) (`/review-diff`, then `/pr-ready-check`) | Chosen from the diff: light, standard, or deep. `--tier=<level>` overrides the choice. This run chose deep. | A local branch with your change, the commands that run your tests, type check, and lint, and read access to the repository. A ticket is optional. |

## Quick path

1. Start Claude Code in your repository, on your branch, with the Toolbelt loaded: `claude --plugin-dir <toolbelt-folder>`.
2. Run your own checks inside the Claude Code session, or ask the agent to run them, so that you know the results before step 4. The readiness check runs the required checks itself: `<test-command>`, `<type-check-command>`, and `<lint-command>`.
3. Review the local change: `/agent-toolbelt:review-diff` (or `/review-diff` for an installed copy). Add `--intent=<ticket-file-or-url>` when you have a ticket. Do not pass a branch name or a PR. The skill saves the report to `.atb-work/pr-review/<scope-slug>.md` and prints the path. Keep that file before you start fixing.
4. Fix each blocker and should-fix finding, and answer each question. Then run `/agent-toolbelt:pr-ready-check <branch-name>`.
5. Open the PR when the verdict is `Ready`. If the verdict is `Needs Work` or `Blocked`, fix the gap and run step 4 again. Stop and ask your team if a check cannot run. Copy the open questions and the check results into the PR description.

You get a review report that names the file and line of each finding, and a readiness report with one verdict.
The sections below explain each step, when to stop, and what the output looks like.

## Situation

The sample is the RealWorld "Conduit" API in TypeScript (Express, Prisma, Jest). It is the public repository `gothinkster/node-express-realworld-example-app` on GitHub. The commands that name commit 30b68e1 on this page are examples. Replace them with your own branch. To follow the sample, clone the public repository, run `npm ci --ignore-scripts`, then run `npx prisma generate` with a dummy `DATABASE_URL`. Without these, the test, type check, and lint commands fail. On the unmodified sample, 7 of the 27 tests fail. This is expected, so do not count it as a wrong result.

You have a local branch that holds the change of commit 30b68e1 over its parent 88b258c. The commit message is "fix: missing user id". It adds one line, `id: true`, to the `select` in `getCurrentUser`, in `src/app/routes/auth/auth.service.ts`. You want to know if the branch is ready for a reviewer.

To build the sample branch, run `git switch -c self-review-demo 88b258c`, then `git cherry-pick 30b68e1`. A cherry-pick copies the change to a new commit with a new SHA. In this run the copy is 667bbe6.

This page uses these terms:

- Tier: the depth of a review. Light is one pass. Standard and deep split the review into facets.
- Facet: one angle of a review, such as correctness, security, or tests.
- Merge base: the commit where your branch left the base branch.
- Hot path: a changed path that matches a risk word, such as `auth`, `token`, or `payment`.
- Judge: a second pass that tries to refute each finding.
- Probe: an extra check that the run added, such as a test run on two commits.

## Why this path

The obvious alternative is to push the branch, open the PR, and run `/pr-review <pr-number>`. The review is the same skill. The cost is that the PR is already visible to your reviewers when the findings arrive. With `--comment`, `/pr-review` can also post findings to the PR. `/review-diff` never posts. It accepts only `--tier`, `--intent`, `--focus`, `--focus-note`, and `--show-nits`.

The other alternatives each do a different job:

- [`/simplify`](../../skills/simplify/SKILL.md) applies cleanups. `/review-diff` only reports findings and edits no code.
- [`/code-quality-gate`](../../skills/code-quality-gate/SKILL.md) gives a durable `PASS`, `FAIL`, `CAPPED`, or `BLOCKED` status. The skill describes it for a gate that repository policy, your request, or the risk of the change calls for. Its own text leaves the findings to `/pr-review`. The page [Enforce a pre-PR gate](ops-enforce-a-pre-pr-gate.md) covers it.

The order is `/review-diff` first and `/pr-ready-check` second. The skill does not state this order. It is practice: fix the findings first, so that the readiness check reads the final branch and its checks. `/pr-ready-check` is a readiness check. Its command text sends you to `/pr-review` for code findings.

## Steps

| Step | Do | Why | Done when |
| --- | --- | --- | --- |
| 1 | Load the Toolbelt: `claude --plugin-dir /path/to/agent-toolbelt`. Or install the skill into the project: `./install.sh --harness all pr-review /path/to/project`. | The commands must exist in your session. | You type `/` and see `/agent-toolbelt:review-diff` and `/agent-toolbelt:pr-ready-check` (plugin), or `/review-diff` and `/pr-ready-check` (installed copy). |
| 2 | Open the repository on your branch. Run `git log --format='%h %s' <base>..HEAD` and `git diff <base>...HEAD --stat`. For the sample, `<base>` is 88b258c. | You see the range that the review covers. The review uses the merge base with `origin/HEAD`, then `main`, then `master`. A wrong base adds work that is not yours. | The list shows only your commits and files. |
| 3 | Run your checks inside the agent session, or ask the agent to run them. For the sample: `DATABASE_URL=postgresql://u:p@localhost:5432/db JWT_SECRET=x npx jest src`, then `npx tsc --noEmit -p tsconfig.app.json`, then `npx eslint src/app/routes/auth/auth.service.ts`. | The readiness check needs current results for your tests and repository checks. The skill now says that the check runs the required checks itself. This run predates that rule. | Each command has a result. Run the same commands on the merge base (`git switch --detach <base>`). You know which failures are not yours. |
| 4 | Run `/agent-toolbelt:review-diff`. For a ticket, run `/agent-toolbelt:review-diff --intent=<ticket-file-or-url>`. | An empty target reviews your committed, staged, unstaged, and untracked changes against the merge base. It never fetches a PR. The ticket gives the acceptance criteria. Without it, the report says "No acceptance criteria supplied". | The report has a header with tier and verdict, a summary, and a coverage line. |
| 5 | Read the tier in the header. The skill states the choice and the trigger. | The tier sets the cost. Deep costs about 8 times light, and the skill chose it here because the path has `auth/`. | You can say why the tier fits. If it does not fit, run `--tier=standard` or `--tier=light`. An explicit tier always wins. |
| 6 | Read each blocker, should-fix, and question. Open the cited file and line. | A finding names a cause and a consequence. You check it against the code before you act. | You marked each finding as true, false, or unknown. |
| 7 | Check a claim with a probe when you can. In the sample, add the test that the review proposes to `src/tests/services/auth.service.test.ts` and run it on the merge base and on your branch. The test and the import move are shown under What you get. For your own change, write the test that the review proposes. | A test that fails without the fix and passes with it proves the finding. | The test fails on the base and passes on your branch. |
| 8 | Fix each blocker and should-fix finding. Answer each question in writing. Commit. Run `/agent-toolbelt:review-diff` again. | A second review reads the new head. | The report has no blocker. You wrote an answer for each question in your notes or the PR description. |
| 9 | Run `/agent-toolbelt:pr-ready-check <branch-name>`. | The skill checks scope, checks, documentation, branch, and handoff, and gives one verdict. | The report covers each area (scope, checks, documentation, branch, handoff) and gives one verdict: `Ready`, `Needs Work`, or `Blocked`. |
| 10 | Open the PR. Put the open questions and the check results in its description. | The handoff area asks for current risks and reviewer notes. | The description names each open question and each check result. |

## Decision points

- If the report says "No changes to review.", stop. Your branch has no diff against the merge base. Check that you are on the right branch and base.
- If the arguments name a PR, a PR URL, or a branch, `/review-diff` stops. It tells you to use `/pr-review`. Use `/pr-review <pr-number>` after the PR exists.
- If you have a ticket or a spec, pass it with `--intent`. The report then adds an acceptance table with `Verified`, `Failed`, or `Not verified` for each clause.
- If the repository holds a `.pr-review.md`, the review reads it from the base branch. A change to that file on your branch is not honored. The review reports it as a standards finding. Draft a file with `/pr-review-init`.
- If the repository declares risk areas and your diff touches one, the tier is at least standard. The skill does not select deep for a risk area alone.
- If you force `--tier=deep` on a trivial diff, the skill warns and asks. If you force `--tier=light` on a hot path, it adds a one-line note. Neither choice is blocked.
- If a check does not run, as in this run, record it as failed or not run. Never write that it passes. The skill treats an unavailable check as `Blocked`.
- If your team makes the readiness check a gate, follow the team rule. Without such a rule, the skill says the result "does not grant merge or release approval" and that it creates no new approval gates.
- Skip the second review run in step 8 when your fixes touch only the findings and the first report had no blocker. Skip the probe in step 7 when no runnable test exists. Skip `/pr-ready-check` for a tiny, doc-only branch, unless your team requires it.
- If the review verdict is `APPROVE` with a should-fix finding, fix it or say in the PR description why you did not. If the readiness verdict is `Needs Work`, fix the gap. If it is `Blocked`, a required check cannot run: get it to run or ask your team.
- Stop when the report has no blocker, you wrote an answer for each question, and the readiness verdict is `Ready`.
- Choose [`/code-quality-gate`](../../skills/code-quality-gate/SKILL.md) when policy requires a gate. Choose [`/simplify`](../../skills/simplify/SKILL.md) when you want cleanups applied.
- Choose [Answer review comments](dev-answer-review-comments.md) after the PR gets comments from a reviewer.

## What you get

The run was headless. No subagent tool existed, so one agent ran each facet lens in turn and then the two judge passes. The run labels these as Self-review. The run predates the self-review path in `fan-out.md`, which now names this case. Self-review is not independent of the author of the findings. In a session with subagents, the standard and deep tiers start one subagent for each facet, and deep adds two separate judges. The skill asked no person a question in this run.

The header and the coverage line come first.

Excerpt from a run on the Conduit sample API at commit 667bbe6 (the cherry-pick of 30b68e1). Lines are wrapped, and `...` marks skipped text.

```markdown
## PR Review - local changes on branch self-review-demo (merge base 88b258c)
  ·  tier: deep (auto - hot path: `auth/` path segment, 1 file, 1 added line)
  ·  **NEEDS DISCUSSION**
...
_coverage: inspected 1 changed file (1 added line) with its callers
(`getCurrentUser`, `generateToken`, 16 reads of `req.auth?.user?.id`) and the
existing test file. Not run: the end-to-end test (needs a database and a
running API). Facets and judges ran as Self-review in one agent, not as
independent subagents, so the review is not independent of its author. No
acceptance criteria supplied. React rules: 0 listed · 0 applied · 0 not
applicable (skipped: no React files)._
```

The verdict follows from three facts. The report has no blocker. It has one question with confidence 0.45, which is below the 0.5 line for a statement. The skill at that time gave `NEEDS DISCUSSION` for no blocker plus an open question that needs the author's input. The should-fix finding does not move the verdict. The run decided that the old-token question needs the author. The run predates the current rule. The skill now gives `NEEDS DISCUSSION` only for an approval-blocking question, which the critic or judge marks. A question from a finding below confidence 0.5 is not approval-blocking unless the critic marks it, so this verdict can now be `APPROVE`. The run did not treat the unrun end-to-end test as a gap in the review scope. The coverage line also lists the unrun test and the judges that were not independent.

Next, the one should-fix finding and the one question.

Excerpt from a run on the Conduit sample API at commit 667bbe6. Lines are wrapped, and `...` marks skipped text.

```markdown
### Should-fix (1)
- **src/app/routes/auth/auth.service.ts:137** - The bug fix has no regression
  test: the only `getCurrentUser` test mocks `findUnique` to return `id: 123`
  whatever the select asks for, and asserts only that the result has a `token`
  property. If a later change drops `id` from the select again, no test fails
  and the 14 routes that read the token ID break again. ...

### Questions (1)
- **src/app/routes/auth/auth.service.ts:137** - Tokens that `GET /user` signed
  before this fix carry no user ID and stay valid for 60 days
  (`token.utils.ts`, `expiresIn: '60d'`). Does the API need to reject or
  refresh them, or is it enough that new tokens carry the ID? ...
```

The "14 routes" count comes from a search of the source for `req.auth?.user?.id`. It finds 16 reads, 2 in the auth controller and 14 in the article, profile, and tag controllers. So the 14 is a count of reads, and the run did not check the count of routes. The run did not call those routes on a running API. The claim about their failure with a token that has no ID comes from reading the code.

The skill hides a nit when a higher finding exists. The run found one nit: the same five-field `select` appears in `createUser`, `getCurrentUser`, and `updateUser`. The report does not show it. The run predates the `--show-nits` option, which `/review-diff` now accepts.

The report also lists re-entry notes. These are not graded and never change the verdict. One note says that the cast `as User` types `user.id` as a number even when the select omits it. This is why the compiler did not catch the original bug.

The should-fix claim is not only a reading of the code. The run added the proposed test and ran it on both commits.

Excerpt from a run on the Conduit sample API at commit 667bbe6. Lines are wrapped. Output of the regression probe, with the test added to the existing test file and run with `-t getCurrentUser`. The first block is the branch with the fix. The second block is the merge base.

```text
### head (667bbe6, with fix)
      ✓ should return a token (3 ms)
      ✓ should select the user id that the token needs (1 ms)
Tests:       11 skipped, 2 passed, 13 total
### base (88b258c, without fix)
      ✓ should return a token (3 ms)
      ✕ should select the user id that the token needs (3 ms)
    Expected: ObjectContaining {"select": ObjectContaining {"id": true}}
    Received: {"select": {"bio": true, "email": true, "image": true,
"username": true}, "where": {"id": 123}}
Tests:       1 failed, 11 skipped, 1 passed, 13 total
```

The new test comes from the proposed test in the run's diff of the test file. It builds a full mock user, calls `getCurrentUser(123)`, and expects that `findUnique` gets a `select` that contains `id: true`. The same diff moves the `prismaMock` import to the top of the file.

The existing test passes on both commits in this probe. It cannot tell the fixed code from the broken code. The probe also needs one other change. The proposed diff moves the `prismaMock` import to the top of the file. Without that move, the service loads the real Prisma client first. Then 7 of 12 tests in the file fail on both commits with no database. With the import first, 12 of 12 pass. The run found this cause by trying it. The Toolbelt skills did not find it.

Last, the readiness check.

Excerpt from a run on the Conduit sample API at commit 667bbe6. Condensed from the run report. The table layout and the status words are the run's choice. The skill now prescribes a layout with the columns Area, Result, and Evidence: the Evidence column and the rows for scope, documentation, and branch are left out. The text of the cells that remain is verbatim.

| Area | Status | Blocking gap |
| --- | --- | --- |
| Checks | Failed | Yes. The test file that holds the only `getCurrentUser` test fails, so no current result covers the change. |
| Handoff | Gap | Not blocking. Put the question and the test result in the PR description. |

The verdict was `Needs Work`. The reason is the failed test file, and moving the import fixes it. Two other checks did not block in this run. The lint run had 2 errors (`no-explicit-any`, lines 84 and 151), and the same 2 errors exist on 88b258c. The end-to-end suite did not run, because it needs a database and a running API. The repository names no required checks, so the run chose the unit tests as the required check. The skill now names a default set for this case: the test command, the lint command, and the build or type-check command. The report must say that the default set was used. If your team requires the end-to-end suite, the verdict is `Blocked` until you can run it.

What you must check in the output:

- The header names the tier and the trigger. You agree with the tier or you set another.
- Each finding cites a file and a line that you can open, and names a consequence.
- The coverage line lists what the review did not run. A check that did not run is not a pass.
- Each question has an answer before you ask a reviewer to approve.
- The readiness report covers each area (scope, checks, documentation, branch, handoff), and the verdict follows from the blocking gaps.

## Common mistakes

- You pass your branch name to `/review-diff`. The command stops and sends you to `/pr-review`. Run it with no target, or with only `--tier`, `--intent`, `--focus`, `--focus-note`, and `--show-nits`.
- You read `NEEDS DISCUSSION` as a soft `REQUEST CHANGES`. The skill forbids that reading. The verdict means that an open question needs your answer. Answer it, then run the review again.
- You count the existing `getCurrentUser` test as coverage. It returns `id: 123` whatever the query selects, so it cannot fail on this bug. In this repository it also fails to run.
- You skip the base run in step 3. You then blame your change for the 7 failing tests and the 2 lint errors that exist before it.
- You review with a wrong base. A branch cut from an old base shows other work in the diff. Check the `--stat` in step 2.
- You treat `Ready` as approval. The readiness result grants no merge approval. A person or the team policy decides.
- You copy the cherry-pick output into a note. It prints the name and email of the original author. Use the short SHA only.

## Next

- [Fix a reported bug with a failing test first](dev-fix-a-reported-bug.md): the other side of this commit, from the report to the fix.
- [Plan tests for a small authentication pull request](qa-plan-tests-for-a-small-pr.md): when you want a test case list for the same change.
- [Turn test cases into tests](qa-turn-test-cases-into-tests.md): when the report asks for tests and you want them written.
- [Enforce a pre-PR gate](ops-enforce-a-pre-pr-gate.md): when your team requires a quality gate before each PR.
- [Review every PR on open](ops-review-every-pr-on-open.md): when you want each PR reviewed when it opens, in addition to this local check.
- [Answer review comments](dev-answer-review-comments.md): when the PR has comments from a reviewer.
- [Use-case index](README.md): the full list of use-case pages.
