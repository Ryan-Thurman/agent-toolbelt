# From an idea to an accepted release

This page is for a team lead or product owner who plans one feature from idea to an accepted release with agents and people. It maps the seven stages of the idea-to-release workflow to nine earlier runs and shows why no gate reaches `Ready`. No run released the feature. You get the use-case page for each stage, the gate verdict that the evidence supports, and the approvals that stay with people.

| Roles | Skills and commands | Depth | You need |
| --- | --- | --- | --- |
| Product owner, team lead, QA lead, developers. Each stage names its own owner. | The [idea-to-release workflow](../../workflows/idea-to-release-workflow.md). Stage skills: [`product-discovery`](../../skills/product-discovery/SKILL.md), [`shape-up`](../../skills/shape-up/SKILL.md), [`system-design`](../../skills/system-design/SKILL.md), [`test-case-design`](../../skills/test-case-design/SKILL.md), [`story-refinement`](../../skills/story-refinement/SKILL.md), [`bdd-scenarios`](../../skills/bdd-scenarios/SKILL.md), [`phased-delivery`](../../skills/phased-delivery/SKILL.md), [`pr-review`](../../skills/pr-review/SKILL.md), [`ship-it`](../../skills/ship-it/SKILL.md), [`product-outcome-review`](../../skills/product-outcome-review/SKILL.md), [`papercuts`](../../skills/papercuts/SKILL.md) | Each skill sets its own. `system-design` and `story-refinement` have Light, Standard, and Deep. `pr-review` picks a tier (light, standard, or deep). The other skills have no levels. | A feature idea in one sentence. The repository. A named person for each approval. A tracker is optional. |

## Quick path

The quick path covers stages 1 to 4. Stages 5 to 7 follow the Steps table. Stop at each gate and wait for its owner.

1. Start Claude Code in the repository with the Toolbelt loaded: `claude --plugin-dir <toolbelt-folder>`. The `/agent-toolbelt:` prefix works in plugin mode only. In an installed copy, type `/<skill>` with no prefix. No installer pack copies this workflow file, so use the plugin or a Toolbelt checkout.
2. Define (stage 1). Run this line. The workflow writes each gate report from `<toolbelt-folder>/templates/idea-to-release-gate-report.md`. Without a folder that the project names, the workflow saves it to `.atb-work/idea-to-release/<feature-slug>-gate-<n>.md`. The line below names `<work-folder>` instead.
   `Follow <toolbelt-folder>/workflows/idea-to-release-workflow.md for <feature>. Write each gate report with the gate report template to <work-folder>/gate-<n>.md. Stop at each gate and wait for the named approver.`
   Then run `/agent-toolbelt:product-discovery <request>. Evidence: <evidence-file>. Write the report to <work-folder>/discovery.md with the product-discovery template.` Read the result line of `discovery.md`. Stop on `Needs evidence` or `Deferred`.
3. Shape and design (stages 1 and 2). Run these commands in order. Gate 2 stays `Blocked` until the QA lead's cases exist in `<work-folder>/qa-cases.md`.
   `/agent-toolbelt:shape-up Shape this idea into an approved brief: <idea>. Save the approved brief to <work-folder>/brief.md.`
   `/agent-toolbelt:system-design "<design question>"`
   `/agent-toolbelt:test-case-design <work-folder>/brief.md. Save the cases to <work-folder>/qa-cases.md.`
4. Tickets and stories (stages 3 and 4). A person approves the brief first.
   `/agent-toolbelt:to-issues <work-folder>/brief.md. Write one file for each ticket to <work-folder>/tickets/.`
   `/agent-toolbelt:story-refinement <work-folder>/tickets/<ticket-file> --scan`
   Hold the owner meeting. Then run `/agent-toolbelt:story-refinement <work-folder>/tickets/<ticket-file> --check` for the readiness verdict. Stop if the verdict is `Not ready`.
5. Continue with rows 5 to 7 of the Steps table: plan, deliver one ticket with `/agent-toolbelt:pr-review` as the separate review, then close. Stop for a human technical reviewer, a human QA, and the product owner.

You get the records of each stage and one gate report for each stage. The agent never marks a gate `Ready` by itself. Each gate waits for its owner.
The sections below show what each stage produced in earlier runs, why every gate is still `Blocked`, and how the two delivery modes differ.

## Situation

The stakeholders of a publishing site ask for article bookmarks. The site runs on the RealWorld "Conduit" API in TypeScript (Express, Prisma, Jest). You lead the team. You must see how one feature moves from the first request to a release that the product owner accepts.

This page connects nine use-case pages. It runs no skill again, and no run released the feature. Each earlier page ran one skill on the Conduit sample, and its run notes list what the run did not execute. **The runs are separate runs, not one chain.** Four facts matter when you read the stages:

- Stage 1, the design in stage 2, and stages 4 to 6 use the bookmark idea. The stage 1 run used invented evidence. The delivery run builds ticket CON-12, "Bookmark articles", from the story run.
- Stage 3 calls the idea a "reading list". It is the same idea: a private list of saved articles. Its tickets are not CON-12.
- The QA test-case run, the pre-PR review, and the release check ran on a different change: the token fix, commit 30b68e1. The pre-PR review ran on its cherry-pick copy, commit 667bbe6. They show the skill and not the bookmark.
- Every run was headless. No person answered a question or approved a plan. Each run used the recommended default of each question and marked it as a default. A default is not an approval.

The story and test-case runs ran before the skill fixes in Toolbelt commit 695056c and in PR #60. For example, `story-refinement` now saves its files to `.atb-work/story-refinement/<item-key>/`, and the run used its own folder names. Check the skill files if a detail of those runs matters to you.

## Why this path

The obvious alternative is to run each skill from its own page when you need it. Here that fails in one way: nothing carries a decision from one page to the next. In the architecture, shaping, story, and delivery runs, the first owner question is Q-1, and it asks if the saved list is private. In the story and delivery runs, Q-1 also asks if the list is separate from favorites. Each run used the default `Yes`. The stage 1 run recommended the opposite option first: make favorites work as a saved list. One person must settle this once and record it. The workflow keeps the records that carry the answer.

Two sibling workflows cover part of the path. [`workflows/feature-refinement-workflow.md`](../../workflows/feature-refinement-workflow.md) covers shaping to planning, and it says to start at `story-refinement` when the ticket already has a clear goal. That shortcut skips stages here (see Decision points). [`workflows/phased-delivery-workflow.md`](../../workflows/phased-delivery-workflow.md) covers delivery only. Neither one has a release stage, a gate verdict, or a delivery mode. Use the idea-to-release workflow when the question is who approves what.

The order of the stages comes from the workflow. Early stages stay cheap, so Define reads notes and tracker items and plans no code. QA test cases exist before development. Code starts only from a named ticket and an approved implementation plan. After a ticket exists, code follows the ticket, and a change in scope goes back to the ticket first.

## Steps

The Do column gives the command for each stage. The page in each row shows a full run of that command.

| Step | Do | Why | Done when |
| --- | --- | --- | --- |
| 1. Define | `/agent-toolbelt:product-discovery <request>. Evidence: <evidence-file>. Write the report to <work-folder>/discovery.md with the product-discovery template.` After `Ready to shape`, run `/agent-toolbelt:shape-up Shape this idea into an approved brief: <idea>. Save the approved brief to <work-folder>/brief.md.` Pages: [Decide whether to build](product-decide-whether-to-build.md), [Shape an idea into tickets](product-shape-an-idea-into-tickets.md). | Find out if the evidence supports the build, before anyone designs it. Then shape the brief. | The result line of `discovery.md` is `Ready to shape`, `Needs evidence`, or `Deferred`. The product manager has set the outcome and each threshold, and the gate report for stage 1 records the approval. |
| 2. Feature refine | `/agent-toolbelt:system-design "<design question>"`, then `/agent-toolbelt:test-case-design <requirements-file>`. Pages: [Answer an architecture question](arch-answer-an-architecture-question.md), [Plan tests for a small PR](qa-plan-tests-for-a-small-pr.md). | The design settles where the logic lives. The QA lead's cases must exist before development, and Gate 2 waits for them. | The design result is `Ready for planning`, or a person recorded the deferral. The QA lead's cases exist. |
| 3. Development refine | `/agent-toolbelt:to-issues <work-folder>/brief.md. Write one file for each ticket to <work-folder>/tickets/.` The brief comes from `shape-up` in stage 1. Page: [Shape an idea into tickets](product-shape-an-idea-into-tickets.md). | Slices that a team can build and test without guessing. | A person approved the brief. Each ticket names its blocker and cites its requirements and its QA cases. |
| 4. Story refinement | `/agent-toolbelt:story-refinement <ticket-file> --scan` before the owner meeting, then `/agent-toolbelt:story-refinement <ticket-file> --check` after it, then `/agent-toolbelt:bdd-scenarios <refined-file>`, then the preview of `/agent-toolbelt:ticket-sync <tickets-folder>`. `--scan` asks no questions, and it matches the headless runs. `--check` gives the readiness verdict from the owners' answers. Page: [Refine a vague story](qa-refine-a-vague-story.md). | Each story gets Given/When/Then criteria (steps in plain words) with failure paths, before anyone plans code. | The owners answered each blocking question. The product owner, one developer, and one QA reviewer recorded their review. |
| 5. Planning | `/agent-toolbelt:dev-plan <ticket-set>`, then `/agent-toolbelt:plan-review <plan-file>`. Page: [Deliver a ticket as phased PRs](dev-deliver-a-ticket-as-phased-prs.md). | `/dev-plan` maps one ticket set to phases and PRs, and this page treats that map as the agent proposal. The skill sets no order across stories, no selection record, and no capacity. A person records those. | The product owner and the team recorded the selected stories, their order, and their capacity. |
| 6. Assignment and delivery | Record the delivery mode. Then run `/agent-toolbelt:dev-start-phase <phase>`, `/agent-toolbelt:dev-implement-task <plan-step>`, `/agent-toolbelt:dev-phase-review <phase>`, `/agent-toolbelt:review-diff`, and `/agent-toolbelt:pr-ready-check <branch>`. Pages: [Deliver a ticket as phased PRs](dev-deliver-a-ticket-as-phased-prs.md), [Check a branch before a PR](dev-self-review-before-a-pr.md). | Code starts from an approved plan. A review finds problems before a human does. | The mode and the approved plan are recorded. For an agent pod, the start authorization is recorded too. The phase has red and green test evidence: a test that fails first, then the same test passing. |
| 7. Close and learn | `/agent-toolbelt:ship-it <commit-or-tag-range>`, then `/agent-toolbelt:product-outcome-review <hypothesis-and-results>`, then `/agent-toolbelt:papercuts --feature <branch-or-pr-or-ticket>`. Pages: [Prepare a release](lead-prepare-a-release.md), [Review outcomes after a release](product-review-outcomes-after-release.md), [Run a retrospective with papercuts](lead-run-a-retrospective-with-papercuts.md). | A person verifies the result before close. The outcome review shows whether the problem improved. | A human technical reviewer and a human QA verified the result. The product owner accepted it. The gate report for stage 7 names each approver, and the release check and outcome review lines are attached. |

The table lists the commands that the earlier runs used. The workflow names more skills for some stages, such as `ticket-discovery`, `risk-area-mapping`, `worktree`, `cover`, `phase-gate`, and `code-quality-gate`. The table leaves them out on purpose.

After a PR opens, a separate review agent runs `/agent-toolbelt:pr-review <pr-number>`. It prints the findings and posts nothing unless you add `--comment`. This review is a pre-review: a check before the human review. It is not a human approval. `pr-review` picks a tier, which is the review depth (light, standard, or deep).

## What you get from each stage

Each row reads as an excerpt from a run on the Conduit sample API at the commit in the third column. The run is the linked page, and the quote comes from that run's files. Quotes are verbatim. The page ran nothing itself. Where a quote stops before the end of its paragraph, the text says that the source continues. Ticket and question IDs (Q-1, I-3) belong to each run's own register. The story run uses Q-1 for "is a bookmark separate from a favorite", Q-2 for the list order, Q-3 for the maximum, and Q-4 for the visibility rule.

| Stage | Run | Run on | Quote from the run |
| --- | --- | --- | --- |
| 1 | [Decide whether to build](product-decide-whether-to-build.md) | Conduit at commit 30b68e1, with invented evidence about bookmarks | "Do not hand this to `shape-up` yet." |
| 2 | [Answer an architecture question](arch-answer-an-architecture-question.md) | Conduit at commit 30b68e1, question about bookmark placement | "Result: Needs decision. The location and table answers are firm. Q-1, Q-2, and Q-4 need the owner before planning." |
| 2 | [Plan tests for a small PR](qa-plan-tests-for-a-small-pr.md) | Conduit at commit 30b68e1, on the token fix and not the bookmark | "The test passes with and without the added line, so it does not cover this change." |
| 3 | [Shape an idea into tickets](product-shape-an-idea-into-tickets.md) | Conduit at commit 30b68e1, on the "reading list" idea | "Status: Draft for approval. In this run no person approved it." (text follows in the source) |
| 4 | [Refine a vague story](qa-refine-a-vague-story.md) | Conduit at commit 30b68e1, story CON-12 | "Not ready. Checks 3, 5, 8, and 11 fail. The product owner answers Q-1 and Q-3, and the backend lead answers Q-4. With the recommended answers, the verdict becomes `Ready with defaults`." |
| 5 | [Deliver a ticket as phased PRs](dev-deliver-a-ticket-as-phased-prs.md) | Conduit at commit 30b68e1, ticket CON-12 | "This plan uses the story's two slices as the default. A person must confirm the split." |
| 6 | [Deliver a ticket as phased PRs](dev-deliver-a-ticket-as-phased-prs.md) | Conduit, branch `feat/con-12-bookmarks-1` at commit 6a33a58 | "Ready for a human review, with 5 items `Not verified` (database)." |
| 6 | [Check a branch before a PR](dev-self-review-before-a-pr.md) | Conduit at commit 667bbe6 (the copy of 30b68e1), on the token fix | "Facets and judges ran as Self-review in one agent, not as independent subagents, so the review is not independent of its author." |
| 7 | [Prepare a release](lead-prepare-a-release.md) | Conduit at commit 30b68e1, on the token fix | "NO-GO. Release range: `88b258c..30b68e1` (one commit, one line changed)." |
| 7 | [Review outcomes after a release](product-review-outcomes-after-release.md) | Conduit at commit 30b68e1, with invented export data about a favorites redesign | "Decision: `Gather evidence`." |
| 7 | [Run a retrospective with papercuts](lead-run-a-retrospective-with-papercuts.md) | Conduit, branch `feat/con-12-bookmarks-1` at commit 6a33a58 | "Before phase 2 starts, build the article response in one helper. Then add `bookmarked` in that helper only." |

The last quote is improvement I-3 of the retrospective. The report lists it under "Process improvements (proposed, none accepted)". It shows how stage 7 feeds the next phase of the same feature.

## Gate verdicts

A gate gives `Ready`, `Ready with risks`, or `Blocked`. `Ready with risks` needs a named owner for each risk. This page assigned the verdicts below by the gate rules and the result-to-verdict table of the workflow. The runs predate the gate report template, so no earlier run produced a gate report. Each row gives the verdict that a person gets when they ask for this gate after the run.

| Stage | Gate verdict | Reason, from the evidence | Approval that stays with people |
| --- | --- | --- | --- |
| 1. Define | `Blocked` | The report says `Needs evidence`. The desired outcome and each threshold are open. | The product manager sets the outcome and the thresholds, and decides on `Ready to shape`. |
| 2. Feature refine | `Blocked` | Gate 2 is `Blocked` until the QA lead's cases exist, and no run wrote cases for the bookmark. The design says `Needs decision`. | The product owner answers Q-1, Q-2, and Q-4. The QA lead owns the cases. The solution lead accepts the design. |
| 3. Development refine | `Blocked` | The brief is a draft. No person approved it. No ticket cites QA cases, because none exist. | The product owner approves the brief. Engineering and QA agree that each slice can be built and tested. |
| 4. Story refinement | `Blocked` | The story says `Not ready`, and Q-1 blocks the start. The checks ran as a Self-review (one author, no separate reviewer), so no recorded review exists. | The product owner answers Q-1 and Q-3. The backend lead answers Q-4. One developer and one QA reviewer record their review. |
| 5. Planning | `Blocked` | The phase and PR map is an agent proposal, and an agent proposal alone is `Blocked`. | The product owner and the team select the stories and record the order and the capacity. A person confirms the split into two PRs. |
| 6. Assignment and delivery | `Blocked` | Phase 1 has red and green evidence, but no person approved the plan, and no mode or start authorization is recorded. | In a human team, the assigned developer and QA accept the ticket and the plan. In an agent pod, a person approves the plan and the product owner authorizes the start. |
| 7. Close and learn | `Blocked` | No human technical review, QA verification, or acceptance exists. The release check says `NO-GO` and the outcome review says `Gather evidence`. | A named human technical reviewer and a named human QA verify the result. The product owner accepts it. The project names who approves the release. |

The result of a skill is not a gate verdict. A skill says `Ready with defaults`, `Needs decision`, or `NO-GO` for its own check. The gate also needs the approvals in the last column. The result-to-verdict table of the workflow maps `Ready with defaults` to `Ready with risks` when a named person owns each default. It maps `Needs decision`, `Not verified`, `NO-GO`, and a `Proposed order` to `Blocked`. A result with no row, such as `Needs evidence`, keeps its meaning, and the gate report states the verdict that you map it to.

None of the gates reaches `Ready`. This is the correct result for runs with no person to approve. It also lists the work for a real team: answer the owner questions, name the reviewers, and record each approval.

## Human team and agent pod

Record one mode for each ticket at stage 6. The mode changes stages 6 and 7 only. Stages 1 to 5 are the same in both modes.

| Mode | Before the work starts | Before close |
| --- | --- | --- |
| Human team | The assigned developer and QA accept the ticket and the implementation plan. | The same people verify the result. The product owner accepts it. |
| Agent pod (agents do the delivery work) | The QA lead owns the cases, a person approves the implementation plan, and the product owner explicitly authorizes the agents to start. | A named human technical reviewer and a named human QA verify the result. The product owner accepts it. |

In an agent pod, the delivery loop has seven steps:

1. The implementation agent writes the plan from the code, the ticket, the design, and the QA cases.
2. A person approves the plan, and the product owner authorizes the start.
3. The implementation agent writes tests first, then the code, and opens a PR on a feature branch.
4. A separate review agent reviews the PR with `pr-review` and `/pr-ready-check`. This is a pre-review.
5. The implementation agent fixes the accepted findings with `pr-improve`.
6. A human technical reviewer and a human QA verify the result against the criteria and the QA cases.
7. The product owner accepts the ticket, and the team closes it.

Agent-written tests do not replace the QA lead's cases or human QA verification. A missing human QA name does not stop an agent pod from working. It stops the close. Record each missing name as `TBD` with an owner, and do not invent a name.

The earlier runs match neither mode. The delivery run played the implementation agent for steps 1 to 3, and nobody approved the plan or authorized the start. Its phase review and the pre-PR review were a Self-review by the same agent. Step 4 needs a separate agent. The page [Gate each phase with a review](ops-gate-each-phase.md) shows one.

## Decision points

- If stage 1 ends in `Needs evidence`, stop. Run the cheapest experiment, or defer. The bookmark journey stops here. This page shows stages 2 to 7 only to map the later runs.
- If the idea can duplicate a feature that exists, run one narrow search of that code at stage 1. The stage 1 run did, and it found that favorites already serve as a saved list. The workflow row says "no repository scan", and step 1 of `product-discovery` now says the same. The narrow search went beyond both. Decide whether your project allows a narrow search at stage 1, and write it in your project instructions.
- Every design proposal gets a threat review, because `system-design` runs `threat-model` for each one. A data store, as bookmarks add, a queue, a job, or another listed change also runs `reliability-review`. The page [Design a new capability](arch-design-a-new-capability.md) shows that path.
- If the ticket already has a clear goal, you can start at `story-refinement`, but that shortcut belongs to the feature-refinement workflow. This workflow still needs the QA lead's cases and the design decision (or its deferral) before gate 4, and slices that cite the cases before gate 3. For a single story, use [Refine a vague story](qa-refine-a-vague-story.md) instead.
- If a criterion cannot be built as written, stop and raise a question. A person changes the ticket and the plan. Then the work continues.
- If the work spans several sessions, keep the plan and the handoff files in the repository. The page [Survive a context reset](dev-survive-a-context-reset.md) shows how.
- Stop when each gate has a named approver and a verdict, and the product owner has accepted the ticket.
- Choose [Fix a reported bug](dev-fix-a-reported-bug.md) when the work is a defect and not a new feature.

## What was not executed

- No skill ran for this page. Each quote comes from an earlier run.
- No database ran in the delivery run. The migration, the list order, the privacy rules, and the parallel requests are `Not verified`. Tests with a mocked database prove what the service asks for, not what the database returns.
- The release check and the pre-PR review ran on the token fix. No run released the bookmark feature, and no run measured its outcome. The outcome data is invented, and it describes a favorites redesign.
- Nothing was posted, pushed, or sent to a tracker. The ticket preview created no issue.

## Common mistakes

- You read the gate table as a failure. A `Blocked` gate here means that no person has approved. The agents drafted every record.
- You treat a default as an answer. A default stays an open question until a person answers it.
- You let the agent mark a gate `Ready`. The workflow says that an agent never marks a gate `Ready` without the approval of its owner.
- You count the pre-review as the review. The agent that wrote the code cannot review it. The human technical reviewer and the human QA still verify before close.
- You change the ticket to match the code. Change the criteria and the plan first, then the code.
- You expect a skill to name the project's approvals. The project names its records, tracker fields, approval roles, and the gate verdicts that it requires.

## Next

- [Decide whether to build](product-decide-whether-to-build.md): start here when you have a request and no evidence.
- [Refine a vague story](qa-refine-a-vague-story.md): start here when the idea is already a one-line ticket.
- [Gate each phase with a review](ops-gate-each-phase.md): add an independent review at each phase boundary.
- [Review every pull request when it opens](ops-review-every-pr-on-open.md): run the separate review agent on every PR.
- [Use-case index](README.md): the full list of use-case pages.
