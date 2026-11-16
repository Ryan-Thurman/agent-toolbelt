# Right-size a plan that looks over-built

This page is for a tech lead who suspects that a delivery plan builds more than the requirements need. You get a list of the parts that have no ground and a revised plan with fewer parts. Each deferred part has a trigger that tells you when to add it back.

| Roles | Skills and commands | Depth | You need |
| --- | --- | --- | --- |
| Tech lead | [`phased-delivery`](../../skills/phased-delivery/SKILL.md) (`/plan-review`, `/dev-plan`) with the shared check [`right-sizing.md`](../../shared/contracts/references/right-sizing.md) | No levels. Neither the skill nor the check has depth levels. | A plan in a file, with its source requirements. A repository to read. |

## Quick path

1. Start Claude Code in the repository with the Toolbelt loaded: `claude --plugin-dir <toolbelt-folder>`.
2. Check the plan: `/agent-toolbelt:plan-review <plan-file>`. The plan file lists its requirements with IDs. Read the Coverage, Decisions, and Right size rows.
3. Revise the plan: `/agent-toolbelt:dev-plan <plan-file> and apply the right-sizing check. Give the revised plan first, then each removed, merged, and deferred part with a trigger.` Approve the phase map when the agent asks. Ask it to save the revised plan to `<revised-plan-file>`.
4. Replace each proposed trigger number with a number that the owner confirms.
5. Check the result: `/agent-toolbelt:plan-review <revised-plan-file>`. You are done when the verdict is `Ready` or `Ready with warnings` and each open decision and warning has an owner.

You get a verdict on the original plan and a revised plan. You also get a table of parts, each with a ground and a result, and a trigger for each deferred part.
The sections below explain each step, when to stop, and what the output looks like.

## Situation

The sample is the RealWorld "Conduit" API in TypeScript (Express, Prisma, Jest). The run used commit 30b68e1 and the Toolbelt at commit 695056c. Conduit has articles and comments but no notifications.

The plan in this run is invented sample input. It is not a real project plan. The six requirements and the load figure (about 300 new comments a day, one API instance, one Postgres database) are invented. The plan has nine phases for one feature. When a user comments on an article, the author sees an unread notification and can list and read it. The plan adds a message broker and a separate worker service. It also adds a dead-letter queue (a queue for events that failed every retry), a delivery ledger, and a nightly reconciliation job. It ends with four monitors and a staged rollout. No one has reported a lost or late notification.

A moving part is a service, a process, or a state store. It can also be a queue, a scheduled job, a secret, an abstraction, a rollout phase, or an operating procedure. The sample has no queue, scheduler, or mail library today. Its `package.json` lists none, and its only deployment file, in the files that the run searched, is one Dockerfile.

IDs on this page: `N-n` is a source requirement and `P-nn` is a moving part of the original plan. `T-n` is a trigger and `D-n` is an open decision.

The six requirements:

- N-1: A comment on an article gives the article author an unread notification.
- N-2: A user who comments on their own article gets no notification.
- N-3: `GET /api/notifications` lists the signed-in user's notifications, newest first, with an unread flag.
- N-4: `POST /api/notifications/:id/read` marks one notification as read.
- N-5: A user reads and changes only their own notifications.
- N-6: Deleting a comment or an article deletes its notification.

The plan has three open decisions. No person answered them, so the run used the default in each case:

| ID | Question | Default that the run used |
| --- | --- | --- |
| D-1 | Does a foreign or unknown notification ID return 404 or 403? | 404, as `deleteComment` does. |
| D-2 | Which signal and owner cover the new endpoints? | None. The sample has no monitoring. |
| D-3 | Are the trigger numbers in the deferred table right? | The run's proposals. |

## Why this path

The obvious alternative is to read the plan and cut what looks large. That checks size only. It does not link each part to a requirement. It gives no list of what you removed and no condition to bring a part back. Size alone also hides a second problem in this plan: three of its six requirements have no work and no test. The readiness check finds both problems in one pass.

The sibling path is [`system-design`](../../skills/system-design/SKILL.md) (`/system-design`). It runs the same right-sizing check before the coverage sweep of a full design proposal. At the Deep level, when a person or the project asks for it, its design review checks the result in the Architecture row. Use it when you have no plan or design yet, or when you want the design reconsidered. The page [Design a new capability](arch-design-a-new-capability.md) shows that path. It has Light, Standard, and Deep levels. For each design proposal it also runs the threat review. It runs the reliability review when the design adds a queue, a job, or a store. A new design run redoes the requirements and the threat review, and a plan that already exists does not need that work.

The order is fixed by what each step needs. The readiness check comes first, because it finds missing requirements that the size check cannot see. The size check comes second, because it needs the requirement list as its source of grounds. The revision comes last, and a second readiness check confirms it. The plan-readiness reference allows at most two revision passes. Then it reports the open findings and stops.

## Steps

| Step | Do | Why | Done when |
| --- | --- | --- | --- |
| 1 | Load the Toolbelt in Claude Code: `claude --plugin-dir /path/to/agent-toolbelt`. Or install the skill into the project: `./install.sh --harness all phased-delivery /path/to/project`. | The commands must exist in your session. | You type `/` and see `/agent-toolbelt:plan-review` (plugin) or `/plan-review` (installed copy). |
| 2 | Save the plan in a file in the repository, for example `plans/notifications.md`. List the source requirements in the same file, each with an ID. | The check links each part to a requirement. A plan with no requirements cannot be checked for coverage. | Each requirement has an ID, and the file names the exclusions. |
| 3 | Run `/agent-toolbelt:plan-review <plan-file>`. In the sample, the plan file is `inputs/overbuilt-notifications-plan.md`. | The command reviews the plan and changes nothing. It checks 12 rows, from Coverage to Right size. | You have a verdict (`Ready`, `Ready with warnings`, `Needs revision`, or `Not verified`) and a result for each row. `Not verified` means that required scope or evidence remains unresolved. |
| 4 | Read Coverage, Decisions, Dependencies, Integration, Unit tests, Execution, and Scope first. List each requirement that has no work and no test. | Every row except the five warning rows can change the verdict. The warning rows are Acceptance scenarios, Test levels, Negative cases, Reliability, and Right size (see "Decision points"). | You can name each requirement without work, and each exclusion that the plan breaks. |
| 5 | Run `/agent-toolbelt:dev-plan <plan-file> and apply the right-sizing check. Give the revised plan first, then each removed, merged, and deferred part with a trigger.` | The command runs steps 1 and 2 of the delivery loop for the file. Step 2 waits for your approval of the phase map, and the headless run had no such stop. The skill now marks a headless map `Draft for approval`. This run predates that rule. Its readiness check is part of the loop. The right-sizing reference asks for the revised plan first, then the lists. The wording of the request is this page's choice. | You approved the phase map. The output has a revised plan, a table of parts with a ground and a result for each, a list of kept safeguards, and a trigger for each deferred part. |
| 6 | Check each kept part against its ground, and each deferred part against its trigger. Ask the owner to confirm or replace each trigger number. | The source gives no target, so the run proposed the numbers. A proposal is not a decision. The skill now writes `Decision needed` for a trigger that has no source number, and the run predates that rule. | Each trigger names something that you can measure, and an owner confirmed the number. |
| 7 | Run `/agent-toolbelt:plan-review <revised-plan-file>`. | The revised plan must pass the same rows, with the new phases. | The Right size row passes, and each remaining gap has an owner. |
| 8 | Optional, and the run's own check for a Prisma project. When the revised plan adds a model, copy `prisma/schema.prisma` to a scratch folder, add the new model, and run `DATABASE_URL=postgresql://u:p@localhost:5432/db npx prisma validate --schema <schema-copy>`. | Catches an invalid model before you plan on it. It does not prove that two writes share one transaction. The run proved that with a type check of the nested write. | The command prints that the schema is valid. |

## Decision points

- If the plan adds no service, store, queue, job, abstraction, or rollout phase, skip the size check. The Right size row covers only the parts that the plan adds.
- If every part already has a ground, record the grounds and stop.
- If a part answers an observed failure with a record, keep it and cite the record. An observed failure is a ground. A possible future need is not.
- If the team already agreed on a part, ask the owner for its ground. The Decisions row keeps agreed choices. The Right size row asks for a ground. The Decisions row wins. Right size never removes a part that the plan keeps as an agreed decision. When the two rows conflict, the verdict is `Needs revision` and the skill names the owner who decides.
- If a deferred part protects a named failure domain or a recovery requirement, keep it. Send the recovery question to [`reliability-review`](../../skills/reliability-review/SKILL.md) and `system-design`.
- If the verdict is `Ready with warnings`, read each warning. The Right size row is a warning that does not block the plan, unless the project instructions make it a gate. Make it a gate in the project instructions if you want a block.
- If the verdict is `Not verified`, supply the missing scope or evidence and run the check again. If the plan comes from tickets, the Scope row applies, so list the tickets with the plan.
- Stop when the revised plan passes the readiness rows and each open decision has an owner. Each deferred part must also have a trigger with a confirmed number. Stop after two revision passes and report what is open.
- Choose [Design a new capability](arch-design-a-new-capability.md) when you have no plan or design yet, or want the design reconsidered.
- Choose [Decide whether to build](product-decide-whether-to-build.md) when the question is whether to build the feature at all.

## What you get

The run was headless, so no person answered. It ran each check as a Self-review (the agent reviews its own text, with no independent reviewer). A real run can use a fresh reviewer when the scope and the risk justify one.

The first result is the verdict on the original plan. The verdict is `Needs revision`, and the size check did not cause it. Four rows failed, and four warning rows had gaps.

Excerpt from a run on the Conduit sample API at commit 30b68e1. Condensed from the run report: four of the twelve rows are shown, and the text of each row is verbatim. The skill prescribes the verdicts and says to report some rows as warnings. The row labels `Gap`, `Warning`, `Pass`, and `Not applicable` are the run's choice.

```markdown
| Check | Result | Evidence |
| --- | --- | --- |
| Coverage | Gap | N-1, N-3, and N-4 map to phases 2 to 7. N-2 (no notice for a self-comment), N-5 (own notifications only), and N-6 (delete with the comment) have no phase and no test. |
| Decisions | Gap | The exclusions say that email and push are out of scope. Phase 6 builds `Email` and `Push` adapters and a preference table. |
| Negative cases | Warning | No case for another user's notification (authorization), a non-numeric ID (input), a second mark-as-read (state), or a duplicate event (idempotency). |
| Right size | Warning | The plan adds about 22 moving parts. Three have a ground in a requirement. See `right-sizing-table.md`. |
```

After the revision, the second readiness check gave this verdict (condensed from `readiness-after.md`). The run predates the `Ready with warnings` verdict. The skill now gives that verdict for a plan with open warnings.

```markdown
Result: `Ready`, with two open decisions (D-2, D-3) and two warnings.
```

The warnings are the Test levels row and the Reliability row.

The second result is the table of parts. Each row has one ground or none, and one result.

Excerpt from a run on the Conduit sample API at commit 30b68e1. Condensed from the run report: six of the 22 rows are shown, and the text of each row is verbatim.

```markdown
| ID | Moving part | Ground | Result |
| --- | --- | --- | --- |
| P-01 | `Notification` table | N-1, N-3 | Keep. |
| P-04 | `InApp` adapter that the worker calls | N-1 needs one write. No part needs an adapter. | Merge into the comment write (one nested write in `addComment`). |
| P-05 | `DomainEventBus` interface | None. One caller. | Remove. |
| P-08 | RabbitMQ broker in the deployment | None. The API and the table share one database. | Defer with T-1. |
| P-14 | Delivery ledger table | None. No audit requirement. | Defer with T-2. |
| P-22 | Flag `notifications_v1`, four rollout steps of one week, kill switch | None. The change adds a table and two endpoints, and the migration can be reversed. | Defer with T-5. |
```

The count line of the run was "22 parts. Keep 3, merge 1, remove 2, defer 16." The check also listed five safeguards to keep. Two examples are "The notification row is written in the same transaction as the comment" (durability) and "Only the recipient reads or changes a notification" (permission boundary). The run report says that each safeguard applies even though the original plan did not state it.

The third result is the revised plan. It has two phases in place of nine.

Excerpt from a run on the Conduit sample API at commit 30b68e1. The text is verbatim.

```markdown
| Phase | Outcome | Acceptance link | Depends on | Branch -> target |
| --- | --- | --- | --- | --- |
| 1 | The `Notification` table exists. `addComment` writes the notification in the comment's transaction. | N-1, N-2, N-6 | none | `feat/notifications-write` -> default branch |
| 2 | The list endpoint and the mark-as-read endpoint exist. | N-3, N-4, N-5 | 1 | `feat/notifications-api` -> `feat/notifications-write` |
```

Excerpt from a run on the Conduit sample API at commit 30b68e1. Two of the five deferred rows are shown, and the text is verbatim. The trigger numbers are proposals. The plan template now has a Deferred parts table with the columns Deferred part, Ground for deferring, Trigger to add it, and Owner. This run predates that table and used its own columns.

```markdown
| Deferred parts | Add when |
| --- | --- |
| T-1: broker, outbox table and relay, worker service, retry queues, dead-letter queue and replay tool, their monitors and runbook | A channel that calls an external provider is approved, or comment `POST` p95 latency rises by more than 50 ms after release and the notification insert causes it. |
| T-2: delivery ledger and nightly reconciliation job | One verified report of a missing notification arrives, or an audit rule asks for delivery history. |
```

What was and was not executed:

- The existing article service tests ran with the Prisma mock before the plan work. 5 of 5 passed. The file has no test for `addComment`.
- `prisma validate` passed on a copy of the schema with the new `Notification` model. A strict type check of the nested write passed. Neither run needs a database.
- No Postgres ran. No migration ran. No integration test, endpoint call, or implementation ran. The nested write is type-checked, not run.
- The rule that a foreign notification ID returns 404 comes from reading `deleteComment`. It looks up the comment with the owner in the filter, so the 403 branch after it cannot run. The run did not execute it.
- The load figure and the trigger numbers are invented or proposed. No metrics exist in the sample.

What you must check in the output:

- Each requirement has a phase and a test. The first verdict showed three that did not.
- Each kept part names a requirement, an observed failure, or a constraint as its ground. "Might need it later" is not a ground.
- Each deferred part has a trigger that someone can measure, and an owner confirmed the number.
- Each safeguard is still in the revised plan: permission boundary, durability, correctness, and the recovery path.
- Ask the check for the weakest point of the revised plan. The skill does not prescribe this line. The run's second readiness report named one: a failed notification insert now fails the comment, because both writes share one transaction.

## Common mistakes

- You read `Ready` as proof that the plan has the right size. The Right size row is a warning, so a plan can pass with many parts that have no ground. Read the warning rows.
- You use the proposed trigger numbers as decisions. In this run, 50 ms and 20% are the run's own proposals. An owner must confirm each one.
- You remove a part and its safeguard together. The outbox table existed to make a publish atomic with the comment write. The revised plan kept that durability with one nested write. Check each removed part for the safeguard that it carried.
- You delete the deferred parts from the plan with no record. The team then debates them again. Keep them with their triggers in the plan.
- You measure size by file count or line count. The check measures behavior and the work to operate the system: ownership boundaries, state transitions, failure modes, and coordination paths.
- You treat the invented sample figures as your own. The 300 comments a day are an input of this page. Use your own load.

## Next

- [Design a new capability](arch-design-a-new-capability.md): when you have no plan yet.
- [Deliver a ticket as phased PRs](dev-deliver-a-ticket-as-phased-prs.md): to build phase 1 of the revised plan test-first.
- [Run a production readiness review](sre-run-a-production-readiness-review.md): before release, for a plan that keeps a queue or a job.
- [Decide whether to build](product-decide-whether-to-build.md): when the open question is the feature, not the plan.
- [Phased delivery workflow](../../workflows/phased-delivery-workflow.md): the full loop that the commands belong to.
- [Use-case index](README.md): the full list of use-case pages.
