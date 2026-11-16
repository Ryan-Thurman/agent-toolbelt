# Design a new capability before you build it

This page is for an architect or senior developer who must design a new capability in an existing codebase. You get a design document with diagrams and recorded decisions, a threat review, and a reliability review. A verdict, such as `Needs decision`, says whether the design can go to planning.

| Roles | Skills and commands | Depth | You need |
| --- | --- | --- | --- |
| Architect or senior developer | [`system-design`](../../skills/system-design/SKILL.md) (`/system-design`). It runs [`threat-model`](../../skills/threat-model/SKILL.md) (`/threat-model`) and [`reliability-review`](../../skills/reliability-review/SKILL.md) (`/reliability-review`). | Light, Standard, or Deep. The sample used Standard. See "Decision points". | The capability in one sentence, read access to the repository, and the names of the people who own product, platform, and privacy decisions. |

## Quick path

1. Start Claude Code in the repository with the Toolbelt loaded: `claude --plugin-dir <toolbelt-folder>`.
2. Run the design: `/agent-toolbelt:system-design <capability in one sentence> [--light | --standard | --deep]`. Omit the flag and the agent chooses a level and states it. The skill runs the threat review, and the reliability review when its trigger applies.
3. Answer the numbered questions. Write "yes" to accept a recommended answer. Give each `Decision needed` an owner. Never type a target that nobody set.
4. Read the result line, the weakest point, and the open decisions, then act on the result:
   - `Needs decision`: take each decision to its owner.
   - `Needs revision`: fix the design, then recheck both reports.
   - `Not verified`: install or provide the missing input (for example the `threat-model` skill), then rerun that review.
5. When the owners accept the design, plan from it: `/agent-toolbelt:dev-plan <path-to-design-file>`. Name the threat report and the reliability report too. The run did not run this hand-off, so check that the plan keeps the requirements.

You get a design document, a threat report, and a reliability report for one design revision, plus the requirements that planning and test design need.
The sections below explain each step, when to stop, and what the output looks like.

## Situation

The sample is the RealWorld "Conduit" API in TypeScript (Express, Prisma, Jest), at commit 30b68e1. The requirement is one sentence: "Email notifications when a followed author publishes an article." No ticket exists. The mail goes through an email provider, an outside service that sends it.

You must produce a design that a team can plan from. The design must say how the mail leaves the system, who receives it, and what happens when something fails.

The run read these facts in the code before it designed anything. Each row comes from reading a file or from a saved search. None of them is a test result.

| Fact | Where it comes from |
| --- | --- |
| The article has no draft state. `createArticle` is the only way to publish. | `article.service.ts` and `schema.prisma` |
| A follow is a row in the implicit join table `_UserFollows`. It has no time and no flag. | `schema.prisma` |
| The code has no queue, worker, mail code, logging library, metric, rate limit, or health endpoint. | A search of `src` and `package.json` |
| Email addresses are unique but never verified. `PUT /user` changes the address with no password. | `auth.service.ts` |
| The repository has no front end. The API cannot show a page. | Directory listing |

The run executed one check on the existing code: `DATABASE_URL=postgresql://u:p@localhost:5432/db JWT_SECRET=x npx jest src/tests/services/profile.service.test.ts src/tests/services/article.service.test.ts`. The tests use the Prisma mock, so no database is needed. 11 tests passed. The run executed no other test.

## Why this path

The obvious alternative is to ask the design question in conversation and then build. The page [Answer an architecture question](arch-answer-an-architecture-question.md) shows that path. It gives a reasoned answer with evidence and unresolved decisions, but no design document and no linked reviews. The skill gives a design document and linked reviews only through its design procedure. The cost of the design path is extra review time and eight more output files. The run did not measure the time.

The cost in this case is visible in the run. Each review found defects that the other review did not find. The threat review found that a stranger can register with your address and receive mail (T-02). The reliability review found that a crash between the send and the save mails a recipient twice (REL-003). Both reviews also found the same defect in the first draft. The confirm mail left inside a web request. That put the provider in the request path and its key in the API process.

The second alternative is to go straight to a plan with `/dev-plan` (the `phased-delivery` skill). The `system-design` description says to use `phased-delivery` for implementation planning. This is practice, not something the run observed, because the run did not run `phased-delivery`. A plan made from the first draft probably carries the provider call inside `PUT /user` into its phases, and the open decisions (provider, delivery target, front end pages) turn into phase assumptions. The cost of the alternative is that you skip one design pass. The reviews found the request-path defect (F-1) only after the draft existed.

The third alternative is to run only `/threat-model`. The page [Threat model a design](sec-threat-model-a-design.md) shows it. It misses failure behavior, targets, and capacity. The `system-design` skill runs `reliability-review` too when the design adds a service, a dependency, a data store, a queue, a job, or a reliability target. Here it adds a queue, a job, and a provider.

The procedure has this order because the reviews need something to review. The skill drafts the design first. `threat-model` step 1 records the design source and the reviewed revision. The skill resolves findings after the reviews and hands off last.

## Steps

| Step | Do | Why | Done when |
| --- | --- | --- | --- |
| 1 | Load the Toolbelt: `claude --plugin-dir <toolbelt-folder>`. Or install the skills into the project: `./install.sh --harness all system-design <project-folder>`. The pack depends on other packs, so the installer adds `threat-model`, `reliability-review`, and `simple-english`. | The three skills must be available in the session. | You type `/` and see `/agent-toolbelt:system-design` (plugin) or `/system-design` (installed copy). |
| 2 | Run `/agent-toolbelt:system-design <capability in one sentence> <depth-flag>`. The flag is `--light`, `--standard`, or `--deep`, or you can omit it. Start the agent in the repository folder. Sample: `/agent-toolbelt:system-design Email notifications when a followed author publishes an article --standard`. | The flag fixes the depth. Without it, the agent chooses the lowest level that fits the risk and states the reason. | The first sentence of the output states the depth and the reason. |
| 3 | Answer the questions. When a decision is unclear, the skill asks numbered rounds of questions. Each question has a recommended answer. | A decision that the code cannot settle must come from its owner. The skill does not choose a product decision or a target for you. | Each question has an answer, or sits in the open decisions with an owner. |
| 4 | Read the design draft. Check the requirements table, the views, the alternatives, and each "Change it when" trigger. Check the right-sizing check: each moving part has a ground. `design-method.md` asks for this check (`shared/contracts/references/right-sizing.md`), but `templates/system-design.md` had no section for it when the run ran. The run added a table. The template now has a `Right size` section. If your draft has none, ask the agent to add it. | A part with no ground adds cost and failure modes. A deferred part needs a trigger that you can measure. | Each part has a ground or a trigger. Each view names its scope and revision. |
| 5 | If the design changes a Prisma schema, check it without a database. Start in the repository folder after `npm ci --ignore-scripts`. Save the proposed schema as a separate file. Run `DATABASE_URL=postgresql://u:p@localhost:5432/db npx prisma validate --schema <proposed-schema-file>`, then `DATABASE_URL=postgresql://u:p@localhost:5432/db npx prisma migrate diff --from-schema-datamodel <current-schema-file> --to-schema-datamodel <proposed-schema-file> --script`. The dummy value is only there because the schema reads `DATABASE_URL`. Skip this step when the repository has no Prisma schema. If a command fails, note the error and go on. This step is practice, not a skill step. | The check catches a schema error and shows whether the migration only adds. It does not test a migration. | The schema is valid. The diff has no `DROP` and no `ALTER COLUMN`, or you know why. |
| 6 | Read the threat report. Each important threat needs a disposition, an owner or `Unassigned`, and a verification method. | A threat with no verification method is a hope. | Each threat ID links to a security requirement ID and a method. |
| 7 | Read the reliability report. Check the targets, the dependency table, and the failure-mode register. | A target that nobody set stays `Decision needed`. The skill never fills it. | Each risk says `Yes`, `No` with a reason, or `Conditional` for testable (values from `templates/reliability-review.md`). Each requirement has a verification level. |
| 8 | Resolve the findings in the design. Check that both reports name the revision that the design now has. | The completion rule asks for the design and the reviews of the same revision. | Each finding has a disposition. The reports and the design match, or you reassessed each changed row. |
| 9 | Read the result and the weakest point. Send the decisions to their owners. Hand the requirements to planning. | The weakest point is the part that fails or limits the design first (`system-design` SKILL.md). The four result values come from `design-method.md`. | The result is `Ready for planning`, `Needs decision`, `Needs revision`, or `Not verified`. |

## Decision points

- If the change adds no service, data store, public API, queue, or trust boundary (a line where data crosses to a less trusted party), use Light. The skill then gives a short design note. It still runs the threat review, and it runs the reliability review when the trigger applies.
- If the design handles money, personal data, a new platform, several teams, or an irreversible migration, name `--deep`. Deep adds the estimate and "design it twice" (two designs from the same requirements and different constraints). It adds the files for the estimate and the second design, and a design review when a person or the project instructions ask for one. The run did not measure the extra time. In this run the email addresses were personal data, a Deep signal. The depth rules conflict here: rule 1 says to use the level that the person names, and rule 5 says to move up when the work finds a higher signal. The run chose rule 1 and logged the conflict as a skill defect. The shared depth rule now settles it: the named level stays, and the first sentence states the signal and the higher level that it implies. The required checks still run. If your design holds personal data, name `--deep`.
- If a product or privacy decision decides the design, ask its owner. Do not accept an invented number. Reliability targets stay `Decision needed` with an owner.
- If `threat-model` or `reliability-review` is not installed, the skill reports that review as `Not verified` and names the missing input. Do not treat the design as reviewed. Install the skill and rerun the review.
- If the tests of the existing code fail, note it and go on. The design does not depend on them.
- If a review changes the design, record a new revision and run both reviews again on it. This run predates the rerun rule. Do not leave a report that reads the old draft.
- Stop when the result is `Ready for planning`. Stop at `Needs decision` when each open decision has an owner. `Needs decision` is a valid end state for this page. For `Needs revision`, fix the design and recheck. For `Not verified`, supply the missing input and rerun the review.
- Choose [Answer an architecture question](arch-answer-an-architecture-question.md) when you need only an answer or a comparison.
- Choose [Right-size a plan](arch-right-size-a-plan.md) when a plan exists and you must remove parts that no need supports.
- Choose [Threat model a design](sec-threat-model-a-design.md) when only the security review is missing.
- Choose [Run a production readiness review](sre-run-a-production-readiness-review.md) when the service is built.
- Choose [Decide whether to build](product-decide-whether-to-build.md) when the question is whether to build at all.

## What you get

The run was headless. Mermaid is a text format for diagrams that a renderer draws. No person answered, no subagent started, and the reviewers ran as a Self-review by the same agent. A real run asks the questions in step 3 and waits. The run used a default for Q-1, Q-2, and Q-4 and left the others as `Decision needed`. It recorded each default as a default, not as an answer. It never ran a database, a mail provider, or the Mermaid renderer.

IDs in the excerpts: Q is a question to a person. RQ is a requirement. T is a threat and SEC-REQ its security requirement. REL is a failure mode and REL-REQ its reliability requirement. F is a review finding. D1 is the first design revision and D2 the revised one.

First, two of the questions. Targets stay open because `reliability-review` forbids a default target.

Excerpt from a run on the Conduit sample API at commit 30b68e1. Condensed from the run output: the "Why it matters" column is left out. The text of the other columns is verbatim. Q-3 is the target case. Q-4 (one email per article and follower, digest deferred with a trigger) is a used default with a deferral trigger.

| ID | Question | Default used | Owner |
| --- | --- | --- | --- |
| Q-2 | Who receives the email? | Only a user who turned the setting on and confirmed the address by a link. The setting is off for every existing account. | Product, privacy owner |
| Q-3 | How fast must the email arrive? | None. `Decision needed`. The skill forbids a default target. The estimate shows the effect of three values. | Product |

Terms in the next excerpt: an outbox is a table that holds the event and is written in the same step as the data. The worker is a second process that reads the table and sends the mail. Fan-out is the step that turns one event into one send for each recipient.

Next, three rows of the right-sizing table. Each part has a ground, or it is deferred with a trigger.

Excerpt from a run on the Conduit sample API at commit 30b68e1. Three rows of the table. The text is verbatim.

| Part | Ground | Result |
| --- | --- | --- |
| Outbox row written with the article | Durability: a crash between the article write and the mail must not lose the notice. | Kept. |
| External queue service | No measured limit that the Postgres table cannot hold. | Deferred. Change it when the worker poll load shows in database metrics, or a second consumer needs the event. |
| Confirm link and `emailVerifiedAt` | Threat T-02: a stranger can register with your address and follow an author. | Kept. |


The estimate shows why the provider rate limit is the first limit. Every input is an assumption, because the repository has no usage data.

Excerpt from a run on the Conduit sample API at commit 30b68e1. This is the full output of `estimate.py`.

```text
emails/day = 1000 * 50 = 50000
average sends/s = 50000/86400 = 0.58
peak sends/s = 0.58 * 10 = 5.8
one large-author burst = 50000 / 10 per s = 5000 s = 83 min
one author at the cap = 150000 emails = 4.2 h at 10/s
delivery rows kept 30 days at 200 bytes = 300 MB (rows only)
largest burst must finish in 15 min: 50000/900 = 55.6 sends/s
largest burst must finish in 1 h: 50000/3600 = 13.9 sends/s
largest burst must finish in 4 h: 50000/14400 = 3.5 sends/s
```

The reviews then changed the design. This is the finding that moved the confirm mail out of the request.

Excerpt from a run on the Conduit sample API at commit 30b68e1. One row of the findings table. The text is verbatim.

| ID | Source | Finding | Disposition |
| --- | --- | --- | --- |
| F-1 | T-10, REL-011 | D1 sent the confirm mail inside `PUT /user`. The provider was in a request path, and the API held the provider key. | Fixed in D2: a `confirm` delivery row, sent by the worker (D-6). Schema changed: `kind`, empty `eventId` and `articleId` allowed. `prisma validate` passed on the new schema. |

The schema check of step 5 ran offline. The path in the first line is shortened.

Excerpt from a run on the Conduit sample API at commit 30b68e1. Two lines of `schema-validate.txt`. The full path of the second line is replaced with `...`, and the trailing emoji is removed.

```text
Prisma schema loaded from proposed-schema.prisma
The schema at .../proposed-schema.prisma is valid
```

The `migrate diff` output for the same schema holds no `DROP` and no `ALTER COLUMN`. Its change adds four columns to `User`, creates three enums and two tables, and removes nothing. This shows that old code can keep running against the new schema. It is not a test of the migration, because no database ran.

Last, the verdict.

Excerpt from a run on the Conduit sample API at commit 30b68e1. The section "Weakest point" and the first line of "Result" of the review file. The three lines that follow in "Result" are cut. They list the required decisions with owners (delivery targets, provider, front end pages, author cap, processor approval and retention), the items that are `Not verified`, and the limits (Self-review, Standard depth). Lines of the weakest point are wrapped here.

```text
Weakest point
The first mail path depends on two things that nobody owns yet: the
provider choice and the front end pages for the links. The design fails
there first.

Result
`Needs decision`.
```

What you must check in the output:

- The depth line names the level and the reason. The run named Standard because the person did.
- Every target is either a value with a source or `Decision needed` with an owner.
- Estimates say which inputs are assumptions.
- Each threat and each failure mode has an ID that a requirement links to.
- Each requirement says how it is verified. No requirement is `Verified` before the code exists. All requirements in this run are `Proposed`.
- Both reports name the same design revision as the document, or the changed rows say they were reassessed.
- The result line matches the open decisions. A `Needs decision` result with no open decision is wrong.

## Common mistakes

- You take the result as an approval. The skill says that readiness does not grant project approval or implementation authority. No mode starts implementation. The result values come from `design-method.md`.
- You let the agent fill a target. The consequence is an alert threshold that nobody owns. `reliability-review` records `Decision needed` with an owner instead.
- You read an estimate as a measurement. In this run all inputs were assumptions. Replace them with your traffic data before you size anything.
- You change the design after the reviews and keep the old reports. In this run one finding changed the schema and an API contract. Reassess each affected row.
- You skip the owner of a front end that the repository does not hold. The mail links in this design need two pages that no one has built.
- You treat a Self-review as an independent review. The run had no subagent. Treat its findings as input for a person who reviews the design.
- You assume the diagrams rendered. This run kept the Mermaid source and did not render it. The skill asks you to report that limit.
- You fix a weakness outside the scope inside the design. The run found that `auth.ts` falls back to the literal `superSecret` when `JWT_SECRET` is missing. It reported this to the owner. It did not widen the scope.

## Next

- [Answer an architecture question](arch-answer-an-architecture-question.md): when a single decision needs an answer and no design document.
- [Right-size a plan](arch-right-size-a-plan.md): when the plan has parts that no requirement needs.
- [Threat model a design](sec-threat-model-a-design.md) and [Run a production readiness review](sre-run-a-production-readiness-review.md): when you need one review in more depth, or the service is built.
- [Deliver a ticket as phased pull requests](dev-deliver-a-ticket-as-phased-prs.md): after the owners accept the design. The skill [`phased-delivery`](../../skills/phased-delivery/SKILL.md) takes the requirements.
- [Plan staging failure tests](qa-plan-staging-failure-tests.md): for the risks that the reliability report marks testable. The skill is [`failure-scenario-design`](../../skills/failure-scenario-design/SKILL.md).
- [Refine a vague story](qa-refine-a-vague-story.md): when the capability is still a vague story, before you design it.
- The workflow for the full path is [`system-design-workflow.md`](../../workflows/system-design-workflow.md).
- [Audit existing code](sec-audit-existing-code.md): after the feature exists, to inspect the code against the threat requirements.
