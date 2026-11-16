# Idea to release

Use this workflow to take one feature from a raw idea to a released, accepted change.
It covers seven stages, a gate at the end of each stage, and the rules for agents and people in each stage.
Agents draft, check, and assemble evidence. People own each decision and each approval.
The project owns its forms, its tracker fields, and the names of its approvals.

<!-- BEGIN catalog stages: idea-to-release -->
<!-- Generated from catalog/agent-toolbelt.json by scripts/build-workflow-stages.js. Do not edit. -->

| Stage | Skill | Purpose | Next |
| --- | --- | --- | --- |
| 1 | `product-discovery` | Stage 1, Define: frame the problem, the outcome, and the evidence. Stay cheap: no repository scan. | `shape-up` |
| 2 | `shape-up` | Stages 1 to 3: shape the brief, compare it with current behavior, and slice it into draft tickets. | `system-design`, `story-refinement` |
| 3 | `system-design` | Stage 2, Feature refine: design the change at the depth that its risk needs, with threat and reliability reviews. | `test-case-design` |
| 4 | `test-case-design` | Stage 2: the QA lead owns test cases before development. Gate 2 waits for them. | `story-refinement` |
| 5 | `story-refinement` | Stage 4: write Given/When/Then criteria with failure paths and get the product, developer, and QA review. | `bdd-scenarios`, `phased-delivery` |
| 6 | `bdd-scenarios` | Stage 4: turn the criteria into feature files that delivery turns from red to green. | `phased-delivery` |
| 7 | `phased-delivery` | Stages 5 and 6: propose an order, then write the just-in-time plan and deliver one ticket test-first after a person approves the plan. | `pr-review` |
| 8 | `pr-review` | Stage 6: a separate review agent pre-reviews each pull request. People still verify before close. | `ship-it` |
| 9 | `ship-it` | Stage 7: check release readiness and rollback triggers. | `product-outcome-review` |
| 10 | `product-outcome-review` | Stage 7: check the outcome after release, then run papercuts and the delivery retrospective. |  |
<!-- END catalog stages -->

## Records that carry the work

The people who define a feature are often not the people who build it, and the work can pause for weeks.
The records keep the continuity, so no stage depends on the memory of a person or an agent session.

| Record | Use |
| --- | --- |
| Feature record | One durable document for each feature: the problem, the scope, the decisions, the open questions, and links to every later record. The other records link to it. |
| Brief | A short view of the feature record for stakeholders. Generate it from the record. Never generate code from it. |
| Tickets | The delivery contract for each slice of the feature. |
| QA test cases | The test strategy and cases that the QA lead writes before development. Later criteria and tests trace to them. |
| Implementation plan | A plan for one ticket, written just in time from the current code, the ticket, and the design. A person approves it before code starts. |

A change to the feature record or the brief never starts code.
Code starts only from a named ticket and an approved implementation plan.

## Stages and gates

Each gate gives one verdict: `Ready`, `Ready with risks`, or `Blocked`.
A gate report lists the evidence found, the missing evidence, the blockers, each risk with an owner, and the next actions.
`Ready with risks` needs a named owner for each risk. An agent never marks a gate `Ready` without the approval of its owner.

| Stage | Owner | Skills | Gate evidence |
| --- | --- | --- | --- |
| 1. Define | Product manager | `product-discovery`, `user-research-synthesis`, `shape-up` | The problem, the outcome, the scope and exclusions, the owners or `TBD` with a question, and the systems that the feature touches, as named by people. |
| 2. Feature refine | Product owner, with the QA lead and the solution lead | `shape-up` (gap review), `system-design`, `threat-model`, `reliability-review`, `test-case-design` | Requirements, the design or its decision to defer, and the QA lead's test cases. Gate 2 is `Blocked` until the QA lead's cases exist. |
| 3. Development refine | Product owner, with engineering and QA | `shape-up` (`/to-issues`), `ticket-discovery`, `risk-area-mapping` | Draft slices that a team can build and test without guessing. Each slice cites its requirements and its QA cases. |
| 4. Story refinement | Product owner, with one developer and one QA reviewer | `story-refinement`, `bdd-scenarios`, `ticket-sync` (dry run first) | For each story: Given/When/Then criteria with failure paths, the trace to QA cases, dependencies, and the recorded review of the product owner, a developer, and QA. |
| 5. Planning | Product owner and the team | `phased-delivery` (`/dev-plan`) for a proposed order | The stories that the team selected, their order, and the capacity and dependency commitments that people recorded. An agent proposal alone is `Blocked`. |
| 6. Assignment and delivery | Assigned developer and QA | `phased-delivery`, `worktree`, `cover`, `pr-review`, `pr-improve`, `phase-gate`, `code-quality-gate` | The delivery mode, the approved implementation plan, and, for an agent pod, the explicit authorization to start. Gate 6 authorizes delivery, not close. |
| 7. Close and learn | Product owner | `ship-it`, `product-outcome-review`, `papercuts`, `workflows/delivery-retrospective-workflow.md` | Human technical review, human QA verification against the QA cases and criteria, and the product owner's acceptance. |

### Gate reports and the result-to-verdict table

Write each gate report from `templates/idea-to-release-gate-report.md`.
Save it in the feature record folder that the project names. Without a named folder, save it to `.atb-work/idea-to-release/<feature-slug>-gate-<n>.md`, as `shared/contracts/references/execution.md` says.
Each gate report maps every skill result that it uses to one verdict:

| Skill result | Gate verdict | What the gate owner does |
| --- | --- | --- |
| `Ready`, or `Ready for planning` (`reliability-review`) | `Ready` | Approves the gate. An agent does not mark the gate `Ready` alone. |
| `Ready with defaults` (`story-refinement`) | `Ready with risks` | Accepts each default as a risk, and names the owner of each risk. |
| `Needs decision` (`reliability-review`) | `Blocked` | Answers each open decision. The answer goes into the gate report. |
| `Needs revision` (`system-design`, `phased-delivery` plan readiness) | `Blocked` | Revises the artifact, then reruns the skill on the new revision. |
| `Not verified`, from any skill | `Blocked` | Supplies the missing evidence. Or accepts a named risk, which makes the verdict `Ready with risks`. |
| `GO` (`ship-it`) | `Blocked` | Adds the human technical review, human QA, and product owner acceptance. `GO` supplies evidence only. |
| `NO-GO` (`ship-it`) | `Blocked` | Clears each blocking gap that the release package lists. |
| `Proposed order` (`phased-delivery`, stage 5) | `Blocked` | Records the selected stories, their order, and the person who selected them. An agent proposal alone does not pass stage 5. |
| No `test-case-design` result with the QA lead's approval (gate 2) | `Blocked` | The QA lead approves the test cases. |

A skill result with no row in this table keeps its meaning. State the verdict that you map it to in the gate report.

## Spend tokens where the stage needs them

Early stages stay cheap. Define reads notes, transcripts, and tracker items. It does not scan the repository,
write a design, slice tickets, or plan code unless the user asks.
Feature refine adds requirements, design, and QA cases. Development refine adds a targeted code analysis.
Planning, delivery, and close work on named tickets only.

## Delivery modes

Record one mode for each ticket at stage 6.

| Mode | Before the work starts | Before close |
| --- | --- | --- |
| Human team | The assigned developer and QA accept the ticket and the implementation plan. | The same people verify the result. The product owner accepts it. |
| Agent pod | The QA lead owns the cases, a person approves the implementation plan, and the product owner explicitly authorizes the agents to start. | A named human technical reviewer and a named human QA verify the result. The product owner accepts it. |

In an agent pod, a missing human QA name does not stop the work. It stops the close.
Record each missing name as `TBD` with an owner. Do not invent a name.

## Delivery loop for one ticket

1. The implementation agent writes the implementation plan from the current code, the ticket, the design, and the QA cases (`phased-delivery`).
2. A person approves the plan. In an agent pod, the product owner also authorizes the start.
3. The implementation agent writes the code and the tests test-first, and opens a pull request on a feature branch.
4. A separate review agent, not the implementation agent, reviews the pull request and assembles the evidence (`pr-review`, `/pr-ready-check`).
   This review is a pre-review. It is not a human approval.
5. The implementation agent fixes the accepted findings (`pr-improve`).
6. A human technical reviewer and a human QA verify the result against the criteria and the QA cases.
7. The product owner accepts the ticket, and the team closes it.

Agent-written tests do not replace the QA lead's cases or human QA verification.
Do not push to the default branch unless a person asks for it.

## Authority runs from the ticket to the code

After a ticket exists, write code against the ticket and its approved plan.
Do not change the ticket, the feature record, or the design to match the code.
Put implementation detail in the pull request.

If a criterion cannot be built as written, stop and raise a question.
A person, usually the product owner, changes the ticket and the plan. Then the work continues.
If the behavior was wrong, change the criteria and the plan first, then the code.

## What the project owns

The project names its records, its tracker fields, its approval roles, and the gate verdicts that it requires.
A project can make a gate stricter or turn a warning into a gate in its own instructions.
The Toolbelt skills give the methods, the checks, and the evidence for each stage.
