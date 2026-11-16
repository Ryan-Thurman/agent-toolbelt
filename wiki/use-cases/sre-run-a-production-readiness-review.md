# Run a production readiness review before a launch

This page is for an SRE or a tech lead who must decide if a service is ready for its first launch. You get a status for each reliability requirement (`Verified`, `Failed`, or `Not verified`). You also get a list of the missing evidence and a GO or NO-GO verdict with its blocking gaps.

| Roles | Skills and commands | Depth | You need |
| --- | --- | --- | --- |
| SRE, tech lead | [`reliability-review`](../../skills/reliability-review/SKILL.md) (`/reliability-review --readiness`), then [`ship-it`](../../skills/ship-it/SKILL.md) (`/ship-it`). Workflow: [production readiness](../../workflows/production-readiness-workflow.md). | `reliability-review` has Light, Standard, and Deep. Readiness mode runs at any level. `ship-it` has no levels. | The service repository. Any SLO, alert, runbook, capacity, and backup evidence that you have. The name of the person who owns each open decision. |

## Quick path

1. Start Claude Code in the service repository with the Toolbelt loaded: `claude --plugin-dir <toolbelt-folder>`.
2. If the service has no reliability review yet, write one first: `/agent-toolbelt:reliability-review <service-name> --deep. Save the review to <path-to-review>.` Use `--standard` if the service holds no personal data or money and has no cross-team change.
3. Check the built service against it: `/agent-toolbelt:reliability-review <service-name> --readiness. Review: <path-to-review>. Evidence: <paths to SLO, alert, runbook, and backup files>.` Optional: add "You may start a local copy of the service and send requests. Mark each probe as an addition." Without this sentence, most statuses are `Not verified`.
4. Run the release check: `/agent-toolbelt:ship-it <service-name> first launch. Deploy owner: <name>.` For a first launch the checklist has no pull request to review and no earlier release to return to. Expect `Not verified` on review and a revert that the agent chooses itself (remove the service from traffic).
5. Give each `Decision needed` row to its owner. Run steps 3 and 4 again when new evidence exists.

You get the requirement statuses, the evidence that is missing, and a verdict that lists each blocking gap. The `Failed` rows in the example below come from a local probe. Without a probe, expect mostly `Not verified`.
The sections below explain each step, when to stop, and what the output looks like.

## Situation

The sample is the RealWorld "Conduit" API in TypeScript (Express, Prisma, Jest). It stores users, articles, tags, and comments in PostgreSQL. The numbers on this page come from commit 30b68e1. Replace the service name with your own.

Conduit is about to launch. You must tell the launch owner what is ready and what is not. You have the repository and the Dockerfile. You have no database, no deploy platform, and no monitoring account in this run.

The repository holds no SLO, alert definition, runbook, backup setting, or CI file. This is a common state for a first launch. The review finds out what that costs.

Nobody answered the skills' questions in this run (a headless run). Where a skill asks an owner for a target, the run recorded `Decision needed` and went on. Where it asks for a deploy owner, the run used the skill's inference from the repository and wrote that down. With a person present, the agent asks.

## Why this path

The obvious alternative is to run `/ship-it` alone and work through its checklist. Its reliability rows say that each requirement from `reliability-review` must be `Verified`, or its gap accepted by its owner. Without a review, no requirement list exists. In practice, the check then reduces to "does an SLO exist", and nothing says what to prove. The review first turns each failure mode into a requirement. Then `ship-it` has a list to check.

The other alternative is the sibling skill that `reliability-review` points to: [`failure-scenario-design`](../../skills/failure-scenario-design/SKILL.md) (`/failure-scenario-design`). Its command file says it writes plans only and never runs fault injection. Use it after the review marks risks as testable. It does not tell you which requirements pass today. This page does not run it. The team that owns the chaos tooling runs the staging experiments that it plans.

The procedure has this order because each step limits the next one. The design review sets the requirements and the open decisions. Readiness mode compares each requirement with evidence. `ship-it` then reads the statuses and needs a rollback trigger. The trigger comes from the project's release policy. When the project has an SLO and an error budget policy, a burn-rate alert can be the trigger. With neither, `ship-it` returns NO-GO.

## Steps

| Step | Do | Why | Done when |
| --- | --- | --- | --- |
| 1 | Load the Toolbelt in Claude Code: `claude --plugin-dir /path/to/agent-toolbelt`. Or install the skills into the project: `./install.sh --harness all reliability-review failure-scenario-design ship-it /path/to/project`. Start the agent in the service repository. | The skills must be in your session, and the agent reads the service source. | You type `/` and see `/agent-toolbelt:reliability-review` (plugin) or `/reliability-review` (installed copy). |
| 2 | Gather the evidence that exists: SLO documents, alert definitions, runbooks, dashboards, backup settings, load-test results, and past experiment results. Put the paths in your prompt. | Readiness mode reads the actual result. It marks missing evidence as `Not verified`, so an item that you do not give counts against the service. | You have a list of what exists and a list of what does not. |
| 3 | If no reliability review exists, run `/agent-toolbelt:reliability-review <service-name> --deep. Save the review to <path-to-review>.` In the sample: `/agent-toolbelt:reliability-review conduit-api --deep. Save the review to reliability/conduit-review.md.` Use `--standard` if the service holds no personal data or money and has no cross-team change. | The workflow says to review the design first. The review sets the SLI, SLO, dependency, failure-mode, and capacity questions and the requirement IDs (`REL-REQ-1`). | The report has a requirement table and an "Open decisions" table with an owner for each row. |
| 4 | Answer the owner questions. Give targets, owners, and recovery objectives only from the project. Leave the rest as `Decision needed`. | The skill must not choose a target. A guessed SLO gives a rollback trigger that nobody agreed on. | Each `Decision needed` row has a name, or stays open on purpose. |
| 5 | Run `/agent-toolbelt:reliability-review <service-name> --readiness. Review: <path-to-review>. Evidence: <paths>.` Optional: authorize a local probe ("You may start a local copy of the service and send requests. Mark each probe as an addition."). Without it, most statuses are `Not verified`. | Each requirement gets `Verified`, `Failed`, or `Not verified` with evidence. A tool run that finished is not a pass. | Every requirement has a status and an evidence cell. |
| 6 | Read each `Failed` row first, then each `Not verified` row. Open the evidence that the row cites. | A `Failed` row names a defect to fix. A `Not verified` row names evidence to get. | You know the next action for each row. |
| 7 | Plan the experiments for the requirements that need platform evidence: `/agent-toolbelt:failure-scenario-design <risk-ids> --deep`. Give the plans to the team that owns the chaos tooling. After the experiments run, repeat step 5 with the results. | Some behavior, such as a dependency outage or a zone loss, shows only in staging. A production experiment needs written approval. | Each such requirement has a plan with abort conditions, rollback, and no-go checks. |
| 8 | Run `/agent-toolbelt:ship-it <service-name> first launch. Deploy owner: <name>.` | The skill asks who owns the deploy, checks release readiness, sets the rollback trigger, and gives GO or NO-GO. For a first launch there is no pull request and no earlier release, so expect `Not verified` on review and a revert that the agent chooses. | The package has a verdict, blocking gaps, a rollback plan, a release-notes draft, and a rollout plan. |
| 9 | Give each blocking gap to its owner. After the fixes, run steps 5 and 8 again. | A status that the new evidence changes is stale until the review reads that evidence. | The verdict is GO, or the owner of each remaining gap accepts the gap and you record the owner and the reason. |

## Decision points

- If the service already has a reliability review for the same revision, skip step 3 and go to step 5. In practice, skip the rerun of a step when the revision and the evidence are the same. The workflow runs readiness mode on the service and its review.
- If the project has a release policy, an SLO, or an error budget policy, give them to the agent. The trigger comes from the release policy first. A burn-rate alert is one option when an SLO exists. With neither, `ship-it` returns NO-GO. The skill does not allow an invented threshold.
- The skill runs no tools. If you let the agent probe a local copy, the probe is an addition. If your rules forbid running the service, the tests, or a dependency audit, skip those probes. The statuses that depended on them become `Not verified`. The command file of `reliability-review` says that the review runs no tools against any environment. The probes in this run started a local copy of the code on the run's machine. The page marks them as the run's addition.
- If the service stores personal data, handles money, or has a change across many teams, use `--deep`. The depth rules list these signals. Use `--standard` or a lower level for a change inside existing boundaries.
- If a requirement is `Failed` or `Not verified` and its owner accepts the gap, record the owner and the reason. The workflow blocks the release only when the owner does not accept the gap.
- If a requirement needs a staging experiment, plan it with `failure-scenario-design`. A production experiment needs a written approval. The approval names the target, the faults, the window, the blast radius, the abort conditions, and the owner.
- Stop the review when every requirement has a status and an evidence cell, and each `Decision needed` row has an owner.
- Stop the release check when the verdict is GO, or NO-GO with each blocking gap owned and either accepted or scheduled. Then go to [Prepare a release](lead-prepare-a-release.md).
- Choose [Plan staging failure tests](qa-plan-staging-failure-tests.md) when the review is done and you must plan the experiments.
- Choose [Design a new capability](arch-design-a-new-capability.md) when the service is not built yet. Readiness mode checks a built service.
- Choose [Threat model a design](sec-threat-model-a-design.md) when the open question is security, for example the fallback secret in this run.

## What you get

`REL-REQ-n` is a requirement ID from the design review. `Decision needed` means that the owner has not set the target. An SLI is the measured signal, an SLO is the target for it, and a burn rate is how fast the error budget is used.

The run used Deep depth, because the service stores email addresses and password hashes (personal data is a Deep signal). The service had no reliability review, so the run did the design review first and then readiness mode. The design review gave `Needs decision` with 8 open decisions, 13 failure modes, and 14 requirements. Readiness mode gave no `Verified` row.

Excerpt from a run on the Conduit sample API at commit 30b68e1. Condensed from the run report: the totals line and three of the 14 rows are shown, with the columns Requirement, Status, and Evidence. The text of each line that remains is verbatim.

```markdown
Totals: 14 requirements. 6 `Failed`. 8 `Not verified`. 0 `Verified`.

| Requirement | Status | Evidence |
| --- | --- | --- |
| REL-REQ-1 Each journey emits the signals for its SLI. | `Failed` | Executed: after 9 requests, 5 of them 500 responses, the server log held one line, `server up on port 3055`. Read: `src/` has no metric, trace, or request-log code. The only logging call is `console.info` at start-up. |
| REL-REQ-5 Database calls have a pool size, a pool timeout, and a request deadline. | `Not verified` | No setting in `src/` or in the README example. Observed only a fast refusal (5 to 10 ms) from an unreachable host. A slow or stuck database was not tried. |
| REL-REQ-13 Multi-step writes are atomic. | `Not verified` | Read: `updateArticle` calls `disconnectArticlesTags` and then `article.update` as two separate calls. No transaction, and no test for a failure between them. By reading, the requirement would fail. The status needs a run with a database and a fault proxy. |
```

The run chose its own status rule: it set `Failed` only when it executed something and saw the requirement unmet. The skill states no rule for this. The code-read finding on REL-REQ-13 stays `Not verified` for that reason. Your team can use a stricter or looser rule. State it in the prompt.

The `Failed` rows come from a local probe. The run started the service from source on its own machine with no database, then sent requests. The skill itself runs no tool against an environment, so this probe is the run's addition. The next excerpt is one response.

Excerpt from a run on the Conduit sample API at commit 30b68e1. Condensed from the probe output. The `X-Powered-By` and `Content-Type` header lines are cut. The run's folder path is replaced with `<repo>`. The middle of the body is cut with `...`. The remaining text is verbatim.

```text
### http://localhost:3055/api/tags
status=500 time=0.009475s
HTTP/1.1 500 Internal Server Error
"\nInvalid `prisma.tag.findMany()` invocation in\n<repo>/src/app/routes/tag/tag.service.ts:16:33\n\n  13   });\n ... \nCan't reach database server at `localhost`:`5432`\n\n..."
```

Four of four database routes that the probe called returned this kind of body. A client gets an absolute source path, a line number, and the failing call. The run also saw `GET /` return 200 with no database, and `/health` return 404. Both support the `Failed` status of the health-check requirement (REL-REQ-4).

The release check then used these statuses. Excerpt from a run on the Conduit sample API at commit 30b68e1. Condensed from the release package: the header and the first three of seven blocking gaps are shown. The text of each row that remains is verbatim.

```markdown
**NO-GO.** Seven blocking gaps. Clear each one, then run the checklist again.

| # | Blocking gap | Source | What clears it |
| --- | --- | --- | --- |
| 1 | No rollback trigger. The project has no SLO and no release policy. The skill says the verdict is NO-GO when no trigger exists and does not allow an invented threshold. | `rollout-and-rollback.md` | An SLO for the main journeys and a burn-rate trigger, or a trigger from the project's release policy, with a named owner. |
| 2 | Tests do not pass. 7 of 27 unit tests fail (`auth.service.test.ts`, `PrismaClientInitializationError`). | Readiness checklist, code quality | Fix or isolate the tests so that they run without a database, or run them against a database. A recorded passing run. |
| 3 | No health check that reflects the service. `GET /` returns 200 with no database. `/health` returns 404. | Checklist, infrastructure. REL-REQ-4. | A liveness route and a readiness route that checks the database. |
```

What you must check in the output:

- Each requirement has one of the three statuses. The evidence cell says if the run executed the check or only read the code.
- No `Not verified` row reads as a pass. A blank evidence cell means that nothing was checked.
- The failing unit-test run counts as a blocker only because no passing run exists. It does not show a code defect: in this run 7 of 27 tests failed because no database was reachable, and the cause was not investigated. Do not write that the tests pass.
- Each `Decision needed` row has an owner or an open flag. The agent did not choose an SLO, a recovery objective, or a traffic figure.
- The rollback plan names a trigger from the project, or says that none exists.
- The verdict lists every blocking gap. `ship-it` skips the accessibility and Web Vitals rows for an API, or marks them not applicable.

The run did not execute any database query, migration, load test, restore, fault injection, container start, or deploy. It also did not run the `failure-scenario-design` step. The run did run the unit tests, a type check, and a lint run. It also ran a production build (`nx build api`, which passed) and `npm audit --omit=dev`. The audit sends the package list to the public npm registry, and its result depends on the date. Conduit gave 14 findings: 2 critical, 5 high, 4 moderate, and 3 low. The run did not check whether each finding is reachable.

## Common mistakes

- You read "build passes" as "ready". The Conduit build passed, and the verdict was still NO-GO for seven reasons. Read the statuses, not the build.
- You enter a guessed SLO to unblock the rollback trigger. The skill records `Decision needed` for this reason. A trigger that nobody agreed on does not hold in an incident.
- You treat a finished tool run as a pass. The unit-test run finished and still had 7 failures. Read the result.
- You mark a gap `Failed` from code reading alone and a teammate marks it `Not verified`. Agree the rule first and write it in the prompt.
- You skip the telemetry gap. A burn-rate rollback trigger needs request counts and status codes by route. Conduit emits none, so the trigger cannot fire until the service is changed.
- You expect the skills to fix the defects. `reliability-review` is analysis only and `ship-it` prepares the package. Fix the code with [`phased-delivery`](../../skills/phased-delivery/SKILL.md) or your normal process.
- You run a staging experiment from the plan without the owner of the chaos tooling. The plan goes to that team.

## Next

- [Plan staging failure tests](qa-plan-staging-failure-tests.md): plan the experiments for the `Not verified` requirements that need platform evidence.
- [Prepare a release](lead-prepare-a-release.md): the release steps after the verdict is GO.
- [Follow up an incident](sre-follow-up-an-incident.md): when a launched service has a failure and you must prevent a repeat.
- [Threat model a design](sec-threat-model-a-design.md): when the open gaps are about security.
- [Deliver a ticket as phased pull requests](dev-deliver-a-ticket-as-phased-prs.md): to build the fixes for the `Failed` rows.
- [Idea to release](journey-idea-to-release.md): the full path from an idea to a released service.
- [Use-case index](README.md): the full list of use-case pages.
