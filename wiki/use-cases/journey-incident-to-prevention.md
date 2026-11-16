# From an incident to prevention

This page is for an SRE and a tech lead after an incident that they have mitigated. You get a fix with a regression test and a register of the failure modes that the incident showed (a table of what can fail and what detects each). You also get test plans for the gaps and a readiness check that shows which gaps are still open. Each stage links to the use-case page that shows it in detail.

| Roles | Skills and commands | Depth | You need |
| --- | --- | --- | --- |
| SRE, tech lead, with a developer for the fix and QA for the tests | [`bug-to-fix`](../../skills/bug-to-fix/SKILL.md), [`reliability-review`](../../skills/reliability-review/SKILL.md), [`failure-scenario-design`](../../skills/failure-scenario-design/SKILL.md), [`test-case-design`](../../skills/test-case-design/SKILL.md), [`cover`](../../skills/cover/SKILL.md), [`pr-review`](../../skills/pr-review/SKILL.md) (`/pr-ready-check`), [`ship-it`](../../skills/ship-it/SKILL.md). Workflows: [incident follow-up](../../workflows/incident-follow-up-workflow.md) and [production readiness](../../workflows/production-readiness-workflow.md). | `reliability-review` and `failure-scenario-design` have Light, Standard, and Deep. This path uses Standard first and Deep for the staging plans. The other skills have no levels. | The service repository at the revision that failed. The incident report. The name of the person who owns each open decision. |

## Quick path

Before you start: if the incident is still live, mitigate first and come back. If the bug has no missing alert or recovery step, use [Fix a reported bug with a failing test first](dev-fix-a-reported-bug.md) and stop after step 2.

1. Start Claude Code in the service repository after the incident is mitigated, with the Toolbelt loaded: `claude --plugin-dir <toolbelt-folder>`. Create a branch at the failing revision: `git checkout -b <fix-branch> <failing-revision>`. Install the dependencies and run the existing tests once. In the sample, use `npm ci --ignore-scripts`, then `DATABASE_URL=postgresql://u:p@localhost:5432/db JWT_SECRET=x npx jest src/tests`. If the tests need a database that you do not have, record the failures as the baseline and go on. Save the incident report in a file with no secrets.
2. Fix the cause: `/agent-toolbelt:bug-intake <incident-report-file>`. It creates `bug-investigation-<slug>.md`. Then run `/agent-toolbelt:reproduce <investigation-file>`, `/agent-toolbelt:rca <investigation-file>`, and `/agent-toolbelt:fix-plan <investigation-file>`. With no database, ask `/reproduce` for a test with a stub and write down what the stub did not observe. Then ask for the fix: `Implement the fix brief in <investigation-file>. Run the failing test before you change code, then again after.`
3. Record and plan: `/agent-toolbelt:reliability-review <service-name> and the failure mode of <incident-id> --standard. Save the report to reliability-review.md.` Then `/agent-toolbelt:failure-scenario-design reliability-review.md --standard`. Then commit the fix on `<fix-branch>`. Name a report folder, or use the default `.atb-work/test-case-design/<scope-slug>.md`. Run `/agent-toolbelt:test-case-design <failing-revision>..<fix-commit>`, where `<fix-commit>` is the commit that you made.
4. Plan the staging tests: `/agent-toolbelt:failure-scenario-design reliability-review.md --deep. Save the cards and plans to failure-scenarios-deep.md.` Give each plan to the team that owns the chaos tooling.
5. Check what is still open: `/agent-toolbelt:reliability-review <service-name> --readiness. Review: reliability-review.md. Evidence: <paths to SLO, alert, runbook, and experiment result files>.` Give each `Decision needed` row and each `Failed` row to its owner. Stop here.

You get a resolved investigation file, a regression test, a failure-mode register, scenario cards, staging plans, and a status for each requirement.
The Quick path leaves out the unit tests (step 4 of the Steps table), the review of the fix (step 5), and the release (step 8). Do them from the Steps table.
The sections below explain each stage, when to stop, and what the output looks like.

## Situation

The incident report on this page is invented. No such incident happened. The bug behind it is real. The sample is the RealWorld "Conduit" API in TypeScript (Express, Prisma, Jest). Commit 88b258c has the bug. Its child, 30b68e1, fixes it with one line. The function `getCurrentUser` did not select the user `id`. So the token from `GET /api/user` had no user id. The invented report says that every write failed for 3 days for some users and that no alert fired. The repository names no service owner. In the test output, `INC-0412` is the ID of the invented report.

You mitigated the incident. Now you must answer three questions. Is the cause fixed? Why did nobody see the failure for 3 days? How do you know that it cannot happen again without an alert?

This page does not run a new session. It connects three earlier runs. Each run is a separate headless run on the same service. No person answered the skills' questions, so each run used the skills' own defaults. The page does not show that one run fed the next.

| Stage group | Page | Commit | What that run did |
| --- | --- | --- | --- |
| Fix, register, cards, cases | [Follow up an incident](sre-follow-up-an-incident.md) | 88b258c, then the fix | Used the invented incident report. Wrote a failing test, the fix, a register of 5 failure modes, 5 cards, and 11 cases. |
| Staging plans | [Plan failure tests for a service in staging](qa-plan-staging-failure-tests.md) | 30b68e1 | Reviewed the whole service. Wrote 13 register rows, 9 cards, and 3 staging plans. |
| Readiness | [Run a production readiness review](sre-run-a-production-readiness-review.md) | 30b68e1 | Checked 14 requirements of a whole-service review. Gave 6 `Failed`, 8 `Not verified`, and 0 `Verified`. |

The second and third run used the commit that holds the fix. Their reviews cover the whole service, not only the incident. When this page compares two runs, it says so.

These items did not run: a database, the HTTP 500 itself, `cover`, `pr-review`, `ship-it` on the incident fix, and every staging experiment. No run used `--deep` on the incident review, and no run checked the incident requirements in readiness mode. The incident run saw the failure one layer above the 500, with a stub for the data layer.

## Why this path

The obvious alternative is the bug fix alone: [Fix a reported bug with a failing test first](dev-fix-a-reported-bug.md). It ends with a one-line change and a green test. It does not ask why 3 days passed with no alert. Use it when the bug has no operational gap to review.

The next alternative is to stop after the incident follow-up. That page ends with cards and cases. It leaves the card for the detection gap (FS-004) at the level `Staging experiment`. The Standard level does not plan that experiment. The staging stage plans it. The cost of the longer path is two more reports and a longer list of decisions for other people.

The third alternative is to run `/ship-it` on the fix. Its reliability section uses requirement statuses, and the readiness stage gives it those. The rollback trigger comes from the project's release policy or an SLO, and no stage can invent one. See [Prepare a release](lead-prepare-a-release.md).

The order has these reasons:

- Each stage reads the output of the one before it. `failure-scenario-design` takes its risks from a `reliability-review` report, and `test-case-design` can take the cards as input.
- A staging plan needs a steady-state signal (the normal value of the metric that you watch). The staging stage tells you if that signal exists before anyone runs a fault.
- Readiness mode checks the results of the failure scenarios. It reads the actual result, because a finished tool run is not a pass. Running it last, when the experiments have results, gives it the most evidence to read. That placement is practice. The production readiness workflow orders readiness first, then the plans, then readiness again.

The incident follow-up workflow ends at `cover` and `pr-review`. The staging and readiness stages come from the production readiness workflow. Applying that workflow after an incident is this page's practice, not a rule of either workflow.

## Steps

| Step | Do | Why | Done when |
| --- | --- | --- | --- |
| 1 | Set up. Confirm that the incident is mitigated. Create `<fix-branch>` at the failing revision, save a redacted incident report, install the dependencies, and run the existing tests once. Commands: see Quick path step 1. Details: [Follow up an incident](sre-follow-up-an-incident.md), steps 1 to 2b. | `bug-to-fix` requires mitigation first for the two highest severities, and a baseline tells new failures from old ones. | `git log --format='%h %s' -1` shows the failing revision. The baseline is saved. In the sample, 7 tests in `auth.service.test.ts` fail without a database. |
| 2 | Fix the cause. Run `/bug-intake` (it creates the investigation file), then `/reproduce`, `/rca`, and `/fix-plan` on that file, then ask for the fix. Details: [Follow up an incident](sre-follow-up-an-incident.md), steps 3 to 6, and [Fix a reported bug](dev-fix-a-reported-bug.md). | The fix needs a confirmed cause, and the first test must fail for the reported reason. | The test failed before the change and passes after it. The investigation file has `status: resolved`, or `resolved-unverified` when an end-to-end check cannot run here. |
| 3 | Record the failure modes and plan the cases. Run `/reliability-review ... --standard`, `/failure-scenario-design ... --standard`, and `/test-case-design <first>..<last>`. Details: [Follow up an incident](sre-follow-up-an-incident.md), steps 7 to 9. | The register shows what the system did not detect, contain, or recover from. Each card gives a test level. | Each register row has a detection signal or says that none exists. Each open target is `Decision needed` with an owner. |
| 4 | Write the unit-level tests. Run `/cover <case-report-path> <case-ids>`. `<case-report-path>` is the folder that you named in step 3, or `.atb-work/test-case-design/<scope-slug>.md`. Use the cases whose level is Unit. Details: [Turn approved test cases into automated unit tests](qa-turn-test-cases-into-tests.md). | The cases protect the fix and the code next to it. | Each new test shows a red run and a green run, or the label `Not verified`. |
| 5 | Review the fix before the pull request. Run `/agent-toolbelt:pr-ready-check <fix-branch>`, which runs the required checks itself, and `/pr-review` for code findings. Details: [Check a branch before you open a pull request](dev-self-review-before-a-pr.md). | You find a missing check or a code defect before a reviewer does. | The `/pr-ready-check` verdict is `Ready`, `Needs Work`, or `Blocked`, and you fixed the gap if it is not `Ready`. |
| 6 | Plan the staging tests. Run `/failure-scenario-design reliability-review.md --deep`. Check each plan against the six no-go conditions. Details: [Plan failure tests for a service in staging](qa-plan-staging-failure-tests.md), steps 5 to 8. | A card at the `Staging experiment` level has no plan at Standard. The plan holds the abort conditions and the rollback. | Each plan has an owner field, abort conditions, a rollback, and a no-go check. A blocked plan names who must clear the block. |
| 7 | Check readiness. Run `/reliability-review <service-name> --readiness` with the review and the evidence. Run it again after the experiments have results. Details: [Run a production readiness review](sre-run-a-production-readiness-review.md), steps 2 to 6. | Each requirement gets `Verified`, `Failed`, or `Not verified` with evidence, so you see which gaps are still open. | Every requirement has a status and an evidence cell. No row says `Verified` without evidence. |
| 8 | Hand off. Give each `Decision needed` row to its owner. Then run `/ship-it` for the fix. Details: [Prepare a release](lead-prepare-a-release.md). | The agent cannot set an SLO target or a policy for you. A rollback trigger needs one of them. | Each decision has an owner. The release verdict is GO or NO-GO, and each blocking gap has an owner. A `Failed` requirement or a missing rollback trigger gives NO-GO. In the sample, NO-GO is the expected result until the gaps close. No run executed `/ship-it` on the incident fix. |

## Decision points

- If the incident is still live, mitigate first. This path starts after mitigation.
- If the bug has no operational gap, skip steps 3 to 8. A missing alert or a missing recovery step is an operational gap. Use [Fix a reported bug](dev-fix-a-reported-bug.md) or [From a bug report to a regression test](journey-bug-report-to-regression-test.md).
- If no card has the level `Staging experiment` or `Game day`, skip step 6. Go to step 7.
- If a plan fails the no-go condition "the steady-state signal does not report", do not start it. Add the telemetry first. In the sample, that means a request log and an error count.
- If nobody can set the SLO, the review keeps `Decision needed`. Do not enter a guessed number to unblock the rollback trigger.
- If a decision changes how the service treats credentials, run [`threat-model`](../../skills/threat-model/SKILL.md) on it first. See [Review the threats of a design before it is built](sec-threat-model-a-design.md). In the sample, decisions D2 and D4 of the follow-up run are of this kind.
- If the incident was in code that the risk-area list does not cover, run `/risk-areas` again. See [Map risk areas in an inherited repository](qa-map-risk-areas-in-an-inherited-repo.md).
- If a paging alert needs a runbook, see [Rewrite a README setup section as a plain runbook](write-make-a-runbook-plain.md).
- Stop when the investigation file is `resolved` or `resolved-unverified`, each decision has an owner, and each requirement has a status. For the release, stop at the verdict in [Prepare a release](lead-prepare-a-release.md).
- Choose [From an idea to a release](journey-idea-to-release.md) when the work is a new feature and not a follow-up.

## What you get

The same gap appears in each run: the service gives no signal of a failing request. The table compares three rows. They come from three separate runs and reviews, so the IDs differ. The fix is one line and adds no telemetry.

| Run | Row | What the run found |
| --- | --- | --- |
| Follow up an incident | REL-004 | The Detection signal cell says: "None. No metric, log line per request, alert, or health endpoint exists." |
| Plan failure tests in staging | REL-009 | The Journey impact cell says: "The steady-state signal that every staging card needs does not exist in the app." |
| Production readiness review | REL-REQ-1 | `Failed`. The server log held one line after 9 requests. |

The fix does not change this. The readiness run used commit 30b68e1, which holds the fix, and it still found no signal. This matches the invented report, where no alert fired for 3 days.

The excerpts below come from the runs. IDs: `REL-<n>` is a failure mode and `REL-REQ-<n>` is a requirement in a reliability review. REL-REQ numbers restart in each run, so REL-REQ-3 in the incident run (a write success metric) is not REL-REQ-3 in the readiness run (the runbook). `FS-<n>` is a failure-scenario card. `D<n>` is an open decision.

Step 2, the fix. Excerpt from the run behind [Follow up an incident](sre-follow-up-an-incident.md), on the Conduit sample API at commit 88b258c. The test file is `src/tests/incident/profile-load-writes.test.ts`, which the run wrote.

```text
FAIL api src/tests/incident/profile-load-writes.test.ts
  write after profile load (INC-0412)
    ✕ the token that GET /api/user returns carries the user id (24 ms)
    ✓ control: a write with the login token names the author (52 ms)
    ✕ a write with the token from GET /api/user names the author (28 ms)
```

The control test passes and the two tests of the reported symptom fail. After the one-line fix, the same file gave 3 passed. The run never observed the HTTP 500. It read the 500 from code.

Step 3, the cards. Excerpt from the run behind [Follow up an incident](sre-follow-up-an-incident.md), on the Conduit sample API at commit 88b258c. This is the steady-state cell of card FS-004 (detection of failing writes). Its level is `Staging experiment`, and the Standard level does not plan it.

> `Conditional`. The signal does not exist. The write success ratio needs a metric (D1). Add it as REL-REQ-3 before this card can run.

The run predates PR #60. `failure-scenario-design` now gives a `Conditional` card the result `Blocked` until the signal exists, and it names the missing signal.

Step 6, the staging plans. Excerpt from the run behind [Plan failure tests for a service in staging](qa-plan-staging-failure-tests.md), on the Conduit sample API at commit 30b68e1. This is the No-go check cell of the plan FS-008 (one instance stopped during requests). The wording "Not clear" is that run's choice. The template gives no value for a failed check. The run predates PR #60, and the skill now records the result `Blocked` and names the no-go condition.

> Not clear. Condition 4 fails (no signal). Conditions 3 and 5 are `Decision needed`.

All three staging plans of that run were blocked for this reason, and nothing ran in staging.

Step 7, readiness. Excerpt from the run behind [Run a production readiness review](sre-run-a-production-readiness-review.md), on the Conduit sample API at commit 30b68e1. Condensed from the run report: the second sentence of the Evidence cell is left out.

| Requirement | Status | Evidence |
| --- | --- | --- |
| REL-REQ-1 Each journey emits the signals for its SLI. | `Failed` | Executed: after 9 requests, 5 of them 500 responses, the server log held one line, `server up on port 3055`. |

The run chose its own rule for `Failed`: it set the status only when it executed something and saw the requirement unmet. The skill states no such rule, and it now allows a read-only probe of a local copy only when the user agrees.

What you must check in the outputs:

- Each statement about the 500 says if the run observed it or read it from code. In the sample, it was read from code.
- Each register row has a detection signal, or says that none exists.
- Each open decision has an owner. A blank owner means that nobody will answer it.
- No card has the result `Supported` or `Contradicted` unless an experiment ran. The staging and readiness runs show `Not run`.
- A `Not verified` row is not a pass.
- A tool run that finished is not a pass. Read the signals.

Two facts connect the runs. The follow-up run found the cause of the 7 failing tests in `auth.service.test.ts`: the file imports the service before the Prisma mock. In a scratch copy, a swap of the two import lines gave 12 passed of 12. The readiness run listed the same 7 failures as a blocking gap and did not investigate them. The swap was not applied to the repository.

## Common mistakes

- You close the incident when the fix merges. The fix did not add a signal. Clients that stored a bad token keep it until it expires, which takes 60 days in the sample, unless a client change clears it first. Decision D2 of the follow-up run covers stored tokens: the API rejects them or issues new ones. The 60 days is read from the code, not executed. Finish steps 3 to 7 for the missing signal.
- You treat the staging plans as test results. The skill writes plans only. The team that owns the chaos tooling runs them in staging, and every card stays `Not run` until then.
- You run the readiness check once and stop. Without experiment results and evidence, most rows read `Not verified`. Run it again when the evidence exists.
- You read the table above as one chain. The three runs used different reviews. Run the stages in your own repository to get one chain.
- You count the existing `getCurrentUser` test as coverage. It returns a full user row for any query and asserts only that a token exists. It cannot fail on this bug.
- You enter an SLO target to close a `Decision needed` row. The skills give no default target. Ask the owner.

## Next

- [Follow up an incident](sre-follow-up-an-incident.md): the first three stages in detail.
- [Plan failure tests for a service in staging](qa-plan-staging-failure-tests.md): the staging stage in detail.
- [Run a production readiness review](sre-run-a-production-readiness-review.md): the readiness stage in detail.
- [Prepare a release](lead-prepare-a-release.md): the release steps after the verdict.
- [Turn approved test cases into automated unit tests](qa-turn-test-cases-into-tests.md): when you write the unit-level tests.
- [Check a branch before you open a pull request](dev-self-review-before-a-pr.md): the review of the fix.
- [From a bug report to a regression test](journey-bug-report-to-regression-test.md): the same fix without the operational stages.
- [From an idea to a release](journey-idea-to-release.md): the path for a new feature.
- [Use-case index](README.md): the full list of use-case pages.
