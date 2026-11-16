# Follow up an incident after it is mitigated

This page is for an SRE who has mitigated an incident and must now fix the cause and close the gaps that let it run. You get a root cause with a regression test and a register of failure modes (a table of what can fail, how you detect it, and who owns the control) with open decisions. You also get failure scenario cards and a case list for the fix and the code next to it.

| Roles | Skills and commands | Depth | You need |
| --- | --- | --- | --- |
| SRE, with a developer for the fix | [`bug-to-fix`](../../skills/bug-to-fix/SKILL.md) (`/bug-intake`, `/reproduce`, `/rca`, `/fix-plan`), [`reliability-review`](../../skills/reliability-review/SKILL.md) (`/reliability-review`), [`failure-scenario-design`](../../skills/failure-scenario-design/SKILL.md) (`/failure-scenario-design`), [`test-case-design`](../../skills/test-case-design/SKILL.md) (`/test-case-design`), then [`cover`](../../skills/cover/SKILL.md) (`/cover`). Workflow: [incident follow-up](../../workflows/incident-follow-up-workflow.md). | `bug-to-fix` and `test-case-design` have no levels. `reliability-review` and `failure-scenario-design` have Light, Standard, and Deep. Only `failure-scenario-design` writes cards, and Light writes none, so pass `--standard` to it. The run also chose Standard for `reliability-review`. | The service repository at the revision that failed. The incident report. The name of the person who owns each open decision. |

## Quick path

1. Start Claude Code in the service repository, after the incident is mitigated, with the Toolbelt loaded: `claude --plugin-dir <toolbelt-folder>`. Then run `git checkout <failing-revision>`.
2. Save the incident report in a file in the repository. Remove tokens, passwords, and personal data. Write at least the symptom, the time range, the affected routes, and the severity if you know it.
3. Install the dependencies and run the existing tests once. Save the result as a baseline. In the sample, use `DATABASE_URL=postgresql://u:p@localhost:5432/db JWT_SECRET=x npx jest src/tests`.
4. Find and fix the cause: `/agent-toolbelt:bug-intake <incident-report-file>`, then `/agent-toolbelt:reproduce <investigation-file>`, `/agent-toolbelt:rca <investigation-file>`, and `/agent-toolbelt:fix-plan <investigation-file>`. With no database, ask `/reproduce` for a test with a stub and write down what the stub did not observe. Then ask for the fix: `Implement the fix brief in <investigation-file>. Run the failing test before you change code, then again after.`
5. Record the failure mode: `/agent-toolbelt:reliability-review <service-name> and the failure mode of <incident-id> --standard. Save the report to reliability-review.md.` Give each `Decision needed` row to its owner.
6. Plan the scenarios: `/agent-toolbelt:failure-scenario-design reliability-review.md --standard. Save the cards to failure-scenarios.md.`
7. Commit the fix and the regression test on a branch. Then plan the tests: `/agent-toolbelt:test-case-design <failing-revision>..<fix-commit>`. Send unit-level cases to `/agent-toolbelt:cover <case-report-path> <case-ids>`. This run stopped before `cover`. The page [Turn approved test cases into automated unit tests](qa-turn-test-cases-into-tests.md) shows that step.

Stop if the incident is still live, or if nobody can reproduce the failure. Use [Fix a reported bug with a failing test first](dev-fix-a-reported-bug.md) when the bug has no operational gap to review. The finish line is the Stop rule in Decision points.

You get a resolved investigation file, a fix with a regression test, a register of failure modes with owners, scenario cards, and a case list.
The sections below explain each step, when to stop, and what the output looks like.

## Situation

The incident report on this page is invented. No such incident happened. The bug behind it is real. The sample is the RealWorld "Conduit" API in TypeScript (Express, Prisma, Jest). It is the public repository `gothinkster/node-express-realworld-example-app` on GitHub. Commit 30b68e1 has the message "fix: missing user id". It adds `id: true` to the select of `getCurrentUser`. Its parent, 88b258c, has the bug.

The invented report says that for 3 days some users read the site without trouble, but every write failed with an HTTP 500 response. The writes were to publish, comment, favorite, follow, and update the profile. Logging in again helped until the next page load. Support raised 14 tickets, and no alert fired. The front-end team mitigated the incident with a client change. The report states no cause, and the API code did not change. All figures in the report, such as the 6% of affected users and the 3 days, are invented.

You are the SRE. The incident is mitigated. You must fix the cause in the API and find out why nobody saw it for 3 days. You must also plan the tests that keep it from coming back. You have the repository and no database. Mitigation is outside this workflow. The workflow starts after it.

A headless run answered the skills' questions with the skills' own defaults. These are the questions and the default for each:

- `/reproduce` asks if you or QA reproduced the bug before. The run answered no, so the agent reproduced it.
- `/rca` can show the ranked hypotheses to a person. The run showed none and recorded them in the investigation file.
- The adversarial check of the root cause needs a fresh subagent. The run had no subagent tool, so the author did a Self-review, which is not independent.
- `/test-case-design` calibrates with a person when the set has more than ten cases. The run had no person, so it wrote the full set and listed each calibration point as an assumption.

## Why this path

The obvious alternative is the bug fix alone. The page [Fix a reported bug with a failing test first](dev-fix-a-reported-bug.md) shows it. In this incident, that path ends with a one-line change and a green test. It does not ask why 3 days passed with no alert. It also does not ask about the clients that still hold a bad token. The register in step 7 finds both gaps. The cost of the longer path is three more reports and a list of decisions that other people must answer.

The other alternative is a readiness review. The page [Run a production readiness review before a launch](sre-run-a-production-readiness-review.md) checks a whole service against its reliability requirements before a launch. It does not start from one failure. Use it when the question is "is this service ready", not "what did this incident show".

The order has a reason. The workflow states that mitigation comes first. In the `bug-to-fix` skill, the fix needs a confirmed root cause, and the first test captures the confirmed symptom. `failure-scenario-design` takes its risks from a `reliability-review` report. `test-case-design` accepts the scenario cards as input. Each stage reads the output of the one before it, so a later stage has less to guess.

For the tests, the sibling alternative is the gap scan of `cover` (`/cover-gaps`). It ranks missing or weak coverage in the code and writes no tests. It reads no incident and no scenario card. It cannot tell you which behavior the incident needs. Use `test-case-design` for that question, and `/cover` to write the tests.

## Steps

| Step | Do | Why | Done when |
| --- | --- | --- | --- |
| 1 | Load the Toolbelt: `claude --plugin-dir /path/to/agent-toolbelt`. Or install the skills with the steps on the [installation page](../Installation.md). | The commands must be available in your session. | You type `/` and see `/agent-toolbelt:bug-intake`. |
| 2 | Check out the revision that failed. In the sample, run `git checkout 88b258c`. Save the incident report in a file. Remove tokens, passwords, and personal data from it. | The skill requires redacted evidence. | `git log --format='%h %s' -1` shows the failing revision, and the report file holds no secret. |
| 2b | Install the dependencies. In the sample, run `npm ci --ignore-scripts`, then `DATABASE_URL=postgresql://u:p@localhost:5432/db npx prisma generate`. Run the existing tests once and save the result. In the sample, run `DATABASE_URL=postgresql://u:p@localhost:5432/db JWT_SECRET=x npx jest src/tests`. | A baseline lets you tell new failures from old ones. If a test file needs a database that you do not have, record it as a baseline failure. | You have a saved baseline. In the sample, the baseline has 7 failing tests in `auth.service.test.ts`. |
| 3 | Run `/bug-intake <incident-report-file>`. In the sample, the file is `incident-report.md`. | The step sets the severity, records the intake fields, and seeds the investigation file. It does no root-cause work. | The file `bug-investigation-<slug>.md` has a severity, the symptoms, `status: gathering`, and a `TBD` for each missing field. |
| 4 | Run `/reproduce bug-investigation-<slug>.md`. The skill asks if you or QA reproduced the bug before. Answer it. If you answer no, the agent reproduces it. Without a database or a running service, ask for a test with a stub and write down what the stub did not observe. In the sample, run `DATABASE_URL=postgresql://u:p@localhost:5432/db JWT_SECRET=x npx jest src/tests/incident`. | A fix needs a reproduction that fails the way the report says. | `Reproduction status` is `confirmed-manual` or `automated-red`. The failure text matches the report, not another failure. |
| 5 | Run `/rca bug-investigation-<slug>.md`. Add `--diagnose` when the team wants the analysis before anyone edits code. | The step lists 3 to 5 ranked hypotheses and tests one variable at a time. It then tries to disprove the cause. | The five fields of the reasoning checkpoint have concrete answers. Each hypothesis that failed is in the `Eliminated` table. |
| 6 | Run `/fix-plan bug-investigation-<slug>.md`. Then ask for the fix: `Implement the fix brief. Run the failing test before you change code, then again after.` | The brief fences the change. The red-then-green test shows that the fix works. | The test failed before the change and passes after it. The investigation file has `status: resolved`. |
| 7 | Run `/reliability-review <service-name> and the failure mode of <incident-id> --standard`. In the sample, run `/reliability-review Conduit API and the failure mode of INC-0412 --standard`. Name the revision that failed as the source (practice, not a skill rule). Save the report: the skill names no default path, so say `Save the report to reliability-review.md`. | The skill adds the incident to a register of failure modes. It turns the gaps in detection and recovery into requirements. | Each register row has an ID, a detection signal, a control, and an owner or `Unassigned`. Each target that nobody gave is `Decision needed`. |
| 8 | Run `/failure-scenario-design <review-report-file> --standard`. The skill names no default path, so say where to save the cards. | Each card states the fault, the steady state, and the lowest test level that proves the behavior. | Each card has a hypothesis with a named signal, a level, and a test-first case. A card without a signal says `Conditional`. |
| 9 | Commit the fix on a branch. Run `/test-case-design <first..last>`. In the sample, the range is `88b258c` to the commit that holds the fix. If the set has more than ten cases and a person can answer, the skill shows the top five to ten cases and stops. Answer its questions about domain terms, level, priority, and case size, then let it write the rest. This run had no person and wrote all 11 cases. The skill saves to `.atb-work/test-case-design/<scope-slug>.md` unless you name a folder. | The skill finds the code that the change reaches and checks the tests that already exist. | The "Change scope" section lists each search with its count. Each case has an expected result or `Confirm with the owner`. The report is saved where you said. |
| 10 | Give each `Decision needed` row to its owner. Send unit-level cases to `/agent-toolbelt:cover <case-report-path> <case-ids>`. This run stopped before `cover`. Review the fix pull request with `/pr-review`. | The agent cannot choose an SLO target or a policy for the team. | Each decision has an owner. Dates are your practice, not a skill rule. Each case has a test or a reason. |

## Decision points

- If the incident is still live, mitigate first. The `bug-to-fix` skill requires it for SEV1 and SEV2 (the two highest severity levels), and the investigation file can still start.
- If nobody can reproduce the failure, stop and gather more data. The skill does not allow a guess. If only a manual reproduction works, the skill records "add an automated regression test" as a follow-up.
- If three fixes in different places fail, stop. The skill treats this as a design signal, not as a fourth bug.
- If the report holds secrets, tokens, or personal data, remove them before the agent reads the file. The skill masks evidence, but the input is yours.
- If the project has no SLO (service level objective, the reliability target), the review records `Decision needed` with an owner. It never chooses a target. Do not fill one in to close the row.
- If your team writes BDD tests, give the Given/When/Then cards to `/bdd-scenarios`. It asks for a test runner first. You can skip it. This run did not use it.
- If the set has more than ten cases, `test-case-design` stops after the top cases when a person can answer. Answer, then let it write the rest.
- For `reliability-review`, the depth rules permit Light for a change inside existing boundaries. The run chose Standard because the next stage writes cards.
- If you run `failure-scenario-design` without a level, the agent can choose Light and write no cards. Pass `--standard`. At the Standard level, a card that needs a real platform fault gets the level `Staging experiment`, and the run does not plan it. Add `--deep` for the plan. The run never runs the experiment. Staging only, and a production experiment needs a written approval.
- If a decision changes how the service treats credentials, run [`threat-model`](../../skills/threat-model/SKILL.md) on it before you approve it.
  - Skill rule: `reliability-review` asks for a threat-model review of a design proposal.
  - Practice: applying it to an incident decision is what this page recommends.
  - Not run in this run.
- If the code of the incident is outside the declared risk areas, run [`risk-area-mapping`](../../skills/risk-area-mapping/SKILL.md) (`/risk-areas`) again. The team approves the new entry in a normal pull request. This run did not.
- Stop when the investigation file is `resolved`, each decision has an owner, and each case has a test, a hand-off, or a reason.
- Choose [Fix a reported bug with a failing test first](dev-fix-a-reported-bug.md) when the bug has no operational gap to review. Choose [The incident-to-prevention journey](journey-incident-to-prevention.md) when you want the full path through release and review.

## What you get

This run had no database, so it never observed the HTTP 500. It reproduced the bug one layer above it. The test builds the real Express routes and replaces Prisma with a stub that returns only the fields that the query selects, as Prisma does. The test sends `GET /api/user`, then a write with the token from the response.

Excerpt from a run on the Conduit sample API at commit 88b258c. The test file is `src/tests/incident/profile-load-writes.test.ts`, which the run wrote. Lines are wrapped, and `...` marks skipped text. The same mark appears in the second excerpt.

```text
FAIL api src/tests/incident/profile-load-writes.test.ts
  write after profile load (INC-0412)
    ✕ the token that GET /api/user returns carries the user id (24 ms)
    ✓ control: a write with the login token names the author (52 ms)
    ✕ a write with the token from GET /api/user names the author (28 ms)
...
    Expected: 7
    Received: undefined
...
    Expected: ObjectContaining {"data": ObjectContaining {"author": {"connect": {"id": 7}}}}
    Received: {"data": {"author": {"connect": {"id": undefined}}, "body": "b",
      "description": "d", "slug": "A-title-undefined", ...
...
Tests:       2 failed, 1 passed, 3 total
```

The token from `GET /api/user` has no user id (Expected 7, Received undefined). The write then reaches the data call with `author.connect.id` undefined. The control test, which writes with the login token, passes. The 500 itself was not observed. The code passes an undefined id to Prisma. This run did not execute that call against a database.

Excerpt from the same run after the one-line fix. It is the same change as commit 30b68e1. The run also reverted the line and got the same two failures again.

```text
PASS api src/tests/incident/profile-load-writes.test.ts
  write after profile load (INC-0412)
    ✓ the token that GET /api/user returns carries the user id (33 ms)
    ✓ control: a write with the login token names the author (17 ms)
    ✓ a write with the token from GET /api/user names the author (12 ms)

...
Tests:       3 passed, 3 total
```

In the excerpts below, the 500 in TC-009 and in the first REL-003 sentence is read from code, not observed. The run's evidence limits say so.

The IDs in the next excerpts follow one scheme. `REL-<n>` is a failure mode in the register. `REL-REQ-<n>` is a reliability requirement. `FS-<n>` is a failure scenario card. `TC-<n>` is a test case. `D<n>` is an open decision.

Excerpt from a run on the Conduit sample API at commit 88b258c. Condensed from the run report: the columns Component, Category, Current control, Proposed control, Verification level, Owner, and Disposition are left out. The text of the columns that remain is verbatim.

| ID | Trigger | Journey impact | Detection signal | Testable |
| --- | --- | --- | --- | --- |
| REL-003 | A client holds an id-less token for up to 60 days. | The next write returns 500. The next `GET /api/user` calls `findUnique` with an undefined id (read from code, not run). The user cannot recover without a new login. | None. | Yes |
| REL-004 | Any write failure. | A failure lasts until a user reports it. | None. No metric, log line per request, alert, or health endpoint exists. | Conditional |

Excerpt from the same report: the open decisions. The run did not choose any of them.

| Decision | Owner | Blocks |
| --- | --- | --- |
| D1: the SLI, SLO, window, and error budget policy of the write journey | Service owner (Unassigned) | REL-REQ-3 |
| D2: the API response to a signed token with no user id (401, or accept it and re-issue) | API owner (Unassigned) | REL-REQ-2 |
| D3: the alert route and the runbook owner | On-call owner (Unassigned) | REL-REQ-3 |
| D4: whether `generateToken` throws when it gets no integer id | API owner (Unassigned) | REL-001 control |

The skill never chose an SLO or a policy. It recorded each as a decision with an unassigned owner. In this repository, a search for metrics, alerts, health checks, and logging found only a startup log line. This is why REL-004 has no detection signal.

Excerpt from the failure scenario file. This is card FS-002, the Given/When/Then form. The card ties the rejection to decision D2. The status is 401 only if D2 chooses 401.

```gherkin
@FS-002 @integration @negative @REL-002
Scenario: A signed token with no user identity cannot write
  Given a reader holds a signed token that does not identify a user
  When the reader publishes an article
  Then the API rejects the request as unauthorized
  And no article is stored
```

Last, two cases from the test plan. TC-005 carries decision D2 after the label `Confirm with the owner`. That wording is the run's choice, to link a decision from the reliability review to a case. TC-009 uses the label as the skill defines it, for a behavior that no source states, and links no decision.

Excerpt from a run on the Conduit sample API. Condensed from the run report: the columns Preconditions, Steps, and Automation candidate are left out, and a file path is cut from the TC-009 result. The text that remains is verbatim.

| ID | Requirement / risk | Expected result | Level | Priority |
| --- | --- | --- | --- | --- |
| TC-005 | FS-002, REL-REQ-2. A signed token with no user id must not write. | `Confirm with the owner: D2`. Candidate: status 401 on each request, no data call, and no 500. | Integration (stub) | High |
| TC-009 | State and lifecycle, next to the fix. A valid token for a user that no longer exists. | `Confirm with the owner`. Observed today: the call rejects with `TypeError: Cannot read properties of null (reading 'id')`, which the route returns as 500. Candidate: 401 or 404. | Unit | Medium |

TC-009 came from the check of the code next to the fix. The run probed it and got this result with a stub that returns no row for the user.

```text
REJECTED TypeError Cannot read properties of null (reading 'id')
```

This run did not execute these items: a database, the HTTP 500, and every write route except article create. It also did not run the cases that wait for D2, the cases that need a real database, or any staging experiment. It did not start `cover`, `pr-review`, `threat-model`, or `risk-area-mapping`. The run used a stub where a person with a database uses the real service.

What you must check in the output:

- The investigation file names the origin of the fault (the select), not the place where it shows (the write route).
- The regression test failed before the fix for the reported reason, and a control test passes.
- Each statement about the 500 says if it was observed or read from code. In this run, it was read from code.
- Each register row has a detection signal, or says that none exists.
- Each open decision has an owner. A blank owner means that nobody will answer it.
- The adversarial check says if a person or a subagent did it. In this run, the author did it, and the report says so.

## Common mistakes

- You start the workflow while the incident is live. The workflow starts after mitigation, and `bug-to-fix` requires mitigation first for SEV1 and SEV2. Start it then.
- You count the existing `getCurrentUser` test as coverage. It mocks a full user row, returns `id: 123` for any query, and asserts only that a `token` exists. It cannot fail on this bug. The file also fails 7 of 12 tests without a database. The cause is the import order: it imports the service before the Prisma mock. With the two lines swapped in a scratch copy, 12 of 12 pass.
- You fix the symptom in the write routes, for example with a guard for a missing id. The skill requires a fix at the origin. With a guard, the API keeps issuing bad tokens.
- You believe that the fix ends the incident. Clients that stored the old token can keep it for up to 60 days, unless the client change in the report clears it first, because the tokens expire after `60d`. The fix does not change them. Decision D2 asks what the API does with them.
- You pick an SLO target to close a `Decision needed` row. The skill gives no default target. Ask the owner.
- You write that the failure was reproduced when only the proxy was. Write what the test shows: the write reaches the data call with no author id.
- You treat a card result of "completed" as a pass. The skill says that a finished run is not a passed run. Read the signals.

## Next

- [The incident-to-prevention journey](journey-incident-to-prevention.md): the full path from an incident to a release and a review.
- [Fix a reported bug with a failing test first](dev-fix-a-reported-bug.md): the bug-to-fix path on its own.
- [Run a production readiness review before a launch](sre-run-a-production-readiness-review.md): when the question is launch readiness.
- [Plan failure tests for a service in staging](qa-plan-staging-failure-tests.md): when a card needs a real platform fault.
- [Turn approved test cases into automated unit tests](qa-turn-test-cases-into-tests.md): when you want the unit-level cases written with `/cover`.
- [Plan tests for a small pull request](qa-plan-tests-for-a-small-pr.md): the same `test-case-design` change procedure on a one-line diff.
- [Map risk areas in an inherited repository](qa-map-risk-areas-in-an-inherited-repo.md): when the repository declares no risk areas.
- [Make a runbook plain](write-make-a-runbook-plain.md): when a paging alert needs a runbook that an on-call engineer can follow.
- [Review the threats of a design before it is built](sec-threat-model-a-design.md): when a decision changes how the service treats credentials.
- [Use-case index](README.md): the full list of use-case pages.
