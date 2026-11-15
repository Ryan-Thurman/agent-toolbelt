# Design coverage and readiness

Scale the investigation to the scoped question or proposal.
Reuse existing records and link to authoritative requirements.
For a focused question, inspect the rows that can change the answer.
For a full proposal, assess every row and explain material exclusions.
Record evidence, assumptions, open decisions, and an owner or `Unassigned` for material gaps.
Do not require every system to use every pattern mentioned below.

## Design coverage

| Area | Establish | Evidence or decision to retain |
| --- | --- | --- |
| Outcome and scope | Who needs the behavior, what success means, and what is excluded. | Link requirements, acceptance scenarios, existing decisions, and source revisions. |
| Context and ownership | Actors, external systems, domain responsibilities, and team ownership. | Identify system boundaries and who owns each important interface or operation. |
| Quality constraints | Required performance, load, availability, recoverability, and cost limits. | Record agreed targets, units, measurement conditions, and their source. Mark unknown values explicitly. |
| Structure | Component responsibilities, dependency direction, and deployable units. | Explain boundaries and why the selected structure fits the actual problem. |
| Interfaces | Inputs, outputs, validation, errors, compatibility, and version changes. | Show how callers observe success, failure, and contract changes. See `interface-contracts.md`. |
| Data | Sources of truth, models, access patterns, retention, and lifecycle. | Define write ownership, consistency, transactions, deletion, and migration where applicable. See `data-design.md`. |
| Identity and trust | Authentication, authorization, tenant boundaries, sensitive data, and external entry points. | Link relevant threat findings, proposed controls, and verification requirements. |
| Connected behavior | Important requests, events, jobs, and state transitions across components. | Trace the path from input to observable result, including required side effects. |
| Failure and recovery | Timeouts, retries, partial success, duplicates, concurrency, and dependency loss. | Define failure ownership, durable state, reconciliation, recovery, and user-visible outcomes where relevant. Use `reliability-review` for the failure-mode register. |
| Operation and evolution | Deployment, monitoring, support, rollback, upgrades, and migration. | Identify owners, failure signals, rollout conditions, compatibility windows, and recovery criteria. |
| Capacity and cost | Expected demand, bottlenecks, resource use, and operational effort. | State estimate inputs and uncertainty; connect added infrastructure to a demonstrated need. See `estimation.md`. |
| Alternatives | Viable approaches, including the existing system when suitable. | For each decision, record what it solves, what it makes worse, and when to change it. "Change it when" names a measurable trigger, such as a load, a latency, or a team size. |
| Verification | How requirements and important failure cases will be checked. | Link each important scenario to a test, experiment, review, or explicit evidence gap. |

## Decisions that the design must fix

A decision belongs in the design when two teams that build separately could otherwise choose things that do not work together.
For each such decision, record what it binds, the conflict that it prevents, and the rule.
Leave other choices to the implementer.

## Coverage sweep

Before you share a design, check that each requirement and each concern in the coverage table is addressed,
or deferred with a reason. Each critical dependency has a fallback that is more than a retry.

Use quality scenarios to make broad claims checkable.
For example, specify the triggering event, operating conditions, expected response, and measurement for a recovery requirement.
Leave unavailable target values unknown instead of copying example numbers into requirements.
Distinguish intended controls from controls observed in code and behavior verified by execution.
Use the linked threat review for security analysis; retain the broader architecture review separately.

## Review the connected design

Trace a representative success case and the highest-impact failure cases through the diagrams and written contracts.
Check that names, responsibilities, data ownership, interfaces, and failure outcomes agree across records.
Challenge the recommendation with a credible counterexample or changed assumption.
Inspect whether the team can operate and migrate the design with its actual resources.
Check the structure for problems that coding agents often make worse:

- Each piece of state has one owner and one place that changes it.
- Each task has one way to do it. Two helpers for the same task are a defect.
- A module cannot import the internals of another module.
- Lists that must stay equal, such as an enum and its handlers, come from one source, or a check fails the build.
Keep routine implementation choices delegated when they do not change an agreed constraint.
Use an independent reviewer only when delegation is authorized and the decision warrants it.
Otherwise, perform a focused self-review.

| Result | Use when |
| --- | --- |
| `Ready for planning` | Scoped requirements and consequential decisions are resolved; required review evidence is current. |
| `Needs decision` | A named product, architecture, ownership, or constraint decision prevents a reliable handoff. |
| `Needs revision` | A contradiction, missing flow, or design defect requires changes within the existing scope. |
| `Not verified` | Required evidence is unavailable, stale, or has not been checked. |

Assess readiness against the agreed scope rather than document length or a numerical score.
Do not claim readiness while a required decision or review remains unresolved.
A useful draft may retain open questions and an explicit readiness limit.

Method informed by [Jeffallan's architecture designer](https://github.com/Jeffallan/claude-skills/tree/main/skills/architecture-designer).
