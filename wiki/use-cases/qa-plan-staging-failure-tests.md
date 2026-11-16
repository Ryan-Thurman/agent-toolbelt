# Plan failure tests for a service in staging

This page is for a QA or SRE engineer who must plan failure tests for a service before launch. You get a reliability review of the service and a set of failure-scenario cards. You get plans, not results: no test runs. Each card has a testable hypothesis and a Given/When/Then form (a scenario in three plain steps: a starting state, an event, and an expected outcome). Each card also has a test-first case, which is a test that you write before the fix and that fails until the fix exists. The cards that need a real platform fault also get a staging experiment plan with abort conditions and no-go checks.

| Roles | Skills and commands | Depth | You need |
| --- | --- | --- | --- |
| QA engineer, SRE | [`reliability-review`](../../skills/reliability-review/SKILL.md) (`/reliability-review`), then [`failure-scenario-design`](../../skills/failure-scenario-design/SKILL.md) (`/failure-scenario-design`) | Light, Standard, or Deep. The agent states the level first. This page uses Standard for the review and Deep for the cards. | The service repository, or its design document. The names of the journeys and dependencies. A staging environment, if you plan to run the experiments later. |

## Quick path

1. Start Claude Code in the service repository with the Toolbelt loaded: `claude --plugin-dir <toolbelt-folder>`.
2. Review the service first: `/agent-toolbelt:reliability-review <design-document-or-service-folder>`. The skill saves the report to `.atb-work/reliability-review/<scope-slug>.md` and prints the path.
3. Plan the failures: `/agent-toolbelt:failure-scenario-design <report-path> --deep`. The skill saves the cards to `.atb-work/failure-scenario-design/<scope-slug>.md`.
4. Give each `Decision needed` row to its owner. Give each staging plan to the team that owns the chaos tooling. Do not start a plan while a no-go condition fails. If a card has no steady-state signal, add the telemetry requirement first, then ask the agent to update the plan.

You get a register of failure modes, one card for each testable risk, and a staging plan for each risk that needs the real platform.
Nothing runs. The skills write plans only.
The sections below explain each step, when to stop, and what the output looks like.

## Situation

The sample is the RealWorld "Conduit" API in TypeScript (Express, Prisma, Jest). It is the public repository `gothinkster/node-express-realworld-example-app` on GitHub. The run on this page used commit 30b68e1.

Conduit stores users, articles, and comments in Postgres (a relational database). It signs session tokens with a JSON Web Token (JWT) secret. The team wants failure scenarios before launch, and a QA or SRE engineer must plan the tests.

The repository has no design document, no alert, and no deployment manifest. It has no service level objective (SLO), which is a target for how often the service must work. The only description of the service is its code. Nobody was available to answer the skills' questions, so each missing fact became `Decision needed` with an owner. The run used the skills' own defaults, and the sections below say where. These are the nine open decisions. Ask them of your own owners before you plan.

| Decision to ask | Ask |
| --- | --- |
| Service owner and on-call owner | Engineering lead |
| Source of the service level indicator (SLI) and the SLO for each journey | Service owner |
| Error budget policy | Service owner |
| Database owner, recovery point and recovery time targets, and restore test date | Data owner |
| Request and query deadlines | Service owner |
| Behavior when the signing secret is missing | Security owner |
| Behavior of a token whose user was deleted | API owner |
| Staging platform and the owner of the chaos tooling | Platform owner |
| Whether the service needs a readiness check | Service owner |

## Why this path

The obvious alternative is `test-case-design` (`/test-case-design`). It has a list of system failure cases, such as "dependency down" and "bad configuration". It writes prioritized cases for a requirement or a code change. It does not write a hypothesis. It does not write a steady state (the normal value of the signal that you watch), abort conditions, or a rollback. With `test-case-design` you get a case such as "dependency down" but no abort condition, so nobody can stop a staging run safely. Its own reference sends a case that needs a real platform fault to `failure-scenario-design`. Use it when you need cases for a change that exists. Use `failure-scenario-design` when the question is "what must happen when this fails, and how do we test it in staging".

`failure-scenario-design` reads the risks that a `reliability-review` report marks as testable (SKILL.md, step 1). Without a report, the skill asks you for the journey and the dependency, or reads the story-level questions. This run used the review because the repository has no report. The [production readiness workflow](../../workflows/production-readiness-workflow.md) also says to run `/reliability-review` on the design first when a service has no review. The review walks each dependency through a fixed list of failure categories. In this run the Misconfiguration category produced the missing-secret risk (REL-006). The Other category produced the missing-telemetry risk (REL-009). The cost is one more skill run and a list of decisions that you must settle.

The order has a reason. The skill takes the testable risks and the journeys from the review (step 1). The review supplies the journeys and the testable risks. In this run it supplied no signal and no target: each signal source, SLO, and threshold stays `Decision needed` until an owner answers. In practice, a staging plan needs the card's hypothesis, because the abort conditions use the signal that the hypothesis names. The skill writes the plan last (step 4), and only at the Deep level or when a person asks.

## Steps

| Step | Do | Why | Done when |
| --- | --- | --- | --- |
| 1 | Load the Toolbelt in Claude Code: `claude --plugin-dir /path/to/agent-toolbelt`. Or install the skills into the project: `./install.sh --harness all reliability-review failure-scenario-design /path/to/project`. | The skills must be available in your session. | You type `/` and see `/agent-toolbelt:reliability-review` and `/agent-toolbelt:failure-scenario-design` (plugin), or the same names without the prefix (installed copy). |
| 2 | Optional on the quick path. Run your service's existing tests with its documented command, and record the failing ones. In the sample: `npm ci --ignore-scripts`, `DATABASE_URL=postgresql://u:p@localhost:5432/db npx prisma generate`, then `DATABASE_URL=postgresql://u:p@localhost:5432/db JWT_SECRET=x npx jest src/tests/services/auth.service.test.ts`. | A test-first case must fail for the right reason. You must know which tests already fail and why. | Each failing test has a cause. If a test fails with `PrismaClientInitializationError` although it uses a mock, the test file imports the service before the mock. The service then loads the real database client. See the defect at the end of "What you get". |
| 3 | Run `/agent-toolbelt:reliability-review <design-document-or-service-folder>`. In the sample, the input is the repository folder. | The cards need a register of failure modes with the risks marked testable. | The report has a register with `REL-` IDs, a `Testable` value for each row, and one result: `Ready for planning`, `Needs decision`, `Needs revision`, or `Not verified`. |
| 4 | Read the "Open decisions and handoff" table. Give each row to its owner. | The skill does not choose a target. A missing SLO, owner, or deadline stays `Decision needed`. | Each decision has an owner's name or role. You do not need an answer yet. |
| 5 | Run `/agent-toolbelt:failure-scenario-design <report-path> --deep`. | Deep is the level that plans staging experiments. At Standard, a card that needs a platform fault gets the level `Staging experiment` and no plan. The result at Standard is `Blocked`, with the reason `Deep level needed for the staging plan`. This run predates the rule that a request for staging plans selects Deep. `--deep` is still the clear way to ask. | Each risk marked testable has a card, or the report says why it has none. |
| 6 | Check each card. The hypothesis must name a fault, a target, a signal, and a tolerance. The steady state must name its source. | A hypothesis that no signal can contradict proves nothing. A card with no signal is `Conditional`, and its result is `Blocked` until the signal exists. | Each hypothesis can fail. Each `Conditional` card has a telemetry requirement. |
| 7 | Check each staging plan against the six no-go conditions of `staging-experiment-plan.md`: spent error budget (the amount of failure that the SLO allows), active incident or freeze, an abort path or rollback that was not tested, no steady-state signal, absent owner, no timebox. | A run that starts with one of these true cannot give a trusted result. | The plan has a value for each condition. A plan that fails a condition is blocked. Write who must fix it. |
| 8 | Send each output to its next owner. Given/When/Then scenarios go to `bdd-scenarios`. If the repository has no BDD runner, `bdd-scenarios` stops for a runner choice first ([Set up a BDD runner](qa-set-up-a-bdd-runner.md)). Lower-level cases go to `test-case-design`. Test-first cases go to the test-first loop of `phased-delivery`, when it is installed. `cover` takes cases for behavior that exists today, so it does not fit these cards. Staging plans go to the owner of the chaos tooling. | The skill stops at the plans. It never runs a fault. | Each handoff has a named receiver. |

## Decision points

- If the repository has a reliability report already, skip step 3 and pass its path to `failure-scenario-design`.
- If the change is a small story with no new dependency, use the Light level. The skill then writes the failure criteria as Given/When/Then scenarios and no cards.
- If the report has no SLO, keep `Decision needed`. Do not choose a number. Abort conditions are a required field of a staging plan, and the threshold comes from the SLO or a named owner. In practice, a plan without a threshold does not start.
- If a card has no steady-state signal, the card is `Conditional`. Add the telemetry first. A plan that needs the signal is blocked by no-go condition 4.
- If you want an experiment on production, get a written approval first. It must name the target, the faults, the time window, and the blast radius (how much of the service a fault can reach). It must also name the abort conditions and the owner. Without it, the skill writes no production plan.
- If a story-level reliability question about a hard dependency or a data change stays unanswered, the checklist treats it as a readiness warning. It blocks the work only when the project instructions make it a gate.
- Skip the game day (a planned team exercise that combines several faults) until each single-fault card has a result. The skill combines faults only after that. This run planned no game day.
- Stop when each testable risk has a card or a reason. Each `Decision needed` must have an owner. Each staging plan must have all fields and a no-go check. A result with blocked plans and a named owner for each missing item is finished: this run ended there. A finished experiment is not a passed one, so the people who run it read the actual signals.
- Choose [`test-case-design`](../../skills/test-case-design/SKILL.md) when you need prioritized cases for a pull request. [Plan tests for a small authentication pull request](qa-plan-tests-for-a-small-pr.md) shows that path.
- Choose [Run a production readiness review](sre-run-a-production-readiness-review.md) when requirements exist and you must mark each one `Verified`, `Failed`, or `Not verified`.

## What you get

The run was headless. No person answered, and no subagent ran. The run chose Standard depth for the review and Deep depth for the cards. The review result was `Needs decision`, for two reasons: nine decisions are open, and two risks need a code change before a test can pass. The run produced 13 register rows, nine cards, and three staging plans.

Each ID names a different thing. `REL-<n>` is a row of the failure-mode register. `FS-<n>` is a failure-scenario card. `FP-<n>` is a unit probe that the run wrote to observe current behavior. A card links to its `REL-` row in its first table row.

First, three rows of the register. J1 to J4 are the four journeys of the report: sign in, read, publish, and register. Prisma is the database library of the sample.

Excerpt from a run on the Conduit sample API at commit 30b68e1. Condensed from the run report: the Component, Detection signal, Current control, Proposed control, Verification level, Owner, and Disposition columns are left out. The text of the columns that remain is verbatim.

| ID | Category | Trigger | Journey impact | Testable |
| --- | --- | --- | --- | --- |
| REL-001 | Single point of failure | The database is down or unreachable. | J1 to J4 fail. Observed: 500 with the Prisma message, which holds the host and port. | Yes |
| REL-006 | Misconfiguration | The variable is missing in the environment. | The service signs and accepts tokens with the public string `superSecret`. Anyone can forge a token (probe: status 500, which means the forged token passed authentication). | Yes |
| REL-009 | Other | Any failure. | The steady-state signal that every staging card needs does not exist in the app. The 500 responses wrote no log line and no metric. | Yes |

The register rests on code that was read and on local probes. A probe is a short run of the sample app on the local machine with no Postgres. REL-001 comes from this probe. The app ran with the database address set to a closed port.

Excerpt from a run on the Conduit sample API at commit 30b68e1. Lines are wrapped, and `...` marks skipped text.

```text
...
--- POST /api/users/login
status=500 time=0.012308s
"\nInvalid `prisma.user.findUnique()` invocation:\n\n\nCan't reach
database server at `127.0.0.1`:`1`\n\nPlease make sure your database
server is running at `127.0.0.1`:`1`."
...
--- server log
server up on port 3411
(end of log)
```

The app started and printed `server up` with no database. The login route answered 500 with the host and port in the body, and the run saw the same on the other data routes. The server wrote no log line for the failures. This is what the app does today. It is not a result for a hypothesis.

Next, a card. FS-001 states the behavior that the team must build. The probe above shows that the app answers 500 with the host name today, so the test-first case is expected to fail. The run did not execute it as a test.

Excerpt from a run on the Conduit sample API at commit 30b68e1.

```gherkin
@FS-001 @integration @negative @REL-001
Scenario: Reading articles when the database is down
  Given the service is running normally
  When the database cannot be reached
  Then the reader is told that the service is unavailable
  And the message does not name any internal host
  And the failure is recorded in the service log
```

The tags name the card (`@FS-001`), the level (`@integration`), a failure path (`@negative`), and the register row (`@REL-001`).

Last, a staging card. FS-008 stops one instance during requests.

Excerpt from a run on the Conduit sample API at commit 30b68e1. Condensed from the run report: three rows of the card are shown. The text of the cells is verbatim.

| Field | Content |
| --- | --- |
| Hypothesis | When one staging API instance gets SIGTERM while it serves requests, requests already in flight finish with their normal answer, and the success ratio of J2 stays within `tolerance` during the replacement. |
| No-go check | Not clear. Condition 4 fails (no signal). Conditions 3 and 5 are `Decision needed`. |
| Result | Not run in staging. The current behavior was observed locally. |

`Not clear` is the run's own wording. The template defines no value for a failed no-go check. This run predates the result `Blocked`. The template now allows it, and it names the missing signal or the no-go condition that stopped the run.

The card's test-first case says that the client got no reply after 1.0 s when the run sent SIGTERM (the signal that asks a process to stop) during a request. The probe holds one request open for about 5 s, because the database host never answers.

What you must check in the output:

- Every threshold is `Decision needed` with an owner. The run chose no number.
- Every card has the result `Not run`. A probe of the current behavior is not a result, because the hypothesis describes the behavior after the control exists.
- Each staging plan has an owner field, abort conditions, a rollback, and a no-go check. In this run all three plans were blocked, because the app has no telemetry (REL-009).
- The 13 rows do not all become cards. The run sent two rows to a load test plan: pool size and password hashing under a burst. It left clock skew without a card. It left a readiness check as a design decision. The skill points load above capacity to `reliability-review`.

The run did not execute any test against Postgres or any run in staging. It did not execute these cases. They are a slow query, a pool limit, a database restart, a secret rotation across two instances, and a stop of an instance in a platform. The local probes used a closed port and a listener that never answers as stand-ins.

One run defect affects step 2. The existing test file `auth.service.test.ts` has a Prisma mock, but the test imports the service before the mock. The service then loads the real database client. In this run 7 of 12 tests failed with `PrismaClientInitializationError`. The run's own unit probes imported the mock first, and the mock worked. A test-first case that uses the mock must import it first.

## Common mistakes

- You treat a card as a passing test. The cards describe the behavior after the control exists. The probe shows that FS-001 describes behavior that the app does not have: it answers 500 with the host name today. Write the test-first case, and expect a red result before you build the control.
- You write a number into a threshold. The skill takes every threshold from the project SLO or a named owner. Without one, the cell says `Decision needed`.
- You expect the skill to run the experiment. It writes plans only. The team that owns the chaos tooling runs them in staging.
- You start a staging run while the steady-state signal does not report. The no-go check stops it. In this sample, add logging and a request count first.
- You trust the status "completed" from a chaos tool. Read the actual signals, and record the result as `Supported`, `Contradicted`, or `Inconclusive`.
- You read `GET /` returning 200 as proof that the service works. In Conduit it returns a fixed text and never calls the database. The probe returned 200 while every data route returned 500.
- You count the existing mock-based tests as coverage of a database failure. See the import-order defect above.

## Next

- [Run a production readiness review](sre-run-a-production-readiness-review.md): after the cards have results, to mark each requirement `Verified`, `Failed`, or `Not verified`.
- [Threat model a design](sec-threat-model-a-design.md): for REL-006 and REL-007, the signing secret, when you need a security review of the token design.
- [Turn test cases into tests](qa-turn-test-cases-into-tests.md): for the unit-level cards, such as FS-004 and FS-005.
- [Review feature files](qa-review-feature-files.md): after `bdd-scenarios` writes the Given/When/Then scenarios from the cards.
- [Follow up an incident](sre-follow-up-an-incident.md): when a real outage supplies a new failure mode for the register.
- [Prepare a release](lead-prepare-a-release.md): `ship-it` sets the rollback triggers from the SLO after the plans have results.
- [Use-case index](README.md): the full list of use-case pages.
