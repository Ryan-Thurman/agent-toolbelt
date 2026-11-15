---
name: reliability-review
description: Review a design or feature plan for failure modes, SLOs, dependencies, recovery, capacity, and observability before it is built, or run a production readiness review. Produces testable reliability requirements. Analysis only. Use failure-scenario-design to turn its requirements into test scenarios.
---

# reliability-review

If you have not read `shared/contracts/references/human-readable-output.md` in this session,
read it before you write for the user.

Toolbelt paths: a path that starts with `shared/`, `skills/`, `templates/`, or `workflows/` is relative to the Toolbelt root, `${CLAUDE_PLUGIN_ROOT}`. If that variable is not replaced, use the nearest folder above this file that contains `shared/contracts/`.
Read `shared/contracts/references/evidence-quality.md` when you establish reliability evidence.

Find how a design can fail, and turn each important failure mode into a requirement that a test,
an experiment, or a check can verify. This skill is analysis only. It runs no fault injection,
load test, or restore, and it changes no code or infrastructure.

Choose the depth with `shared/contracts/references/depth-levels.md` and state it first.

The request in the mode table selects the mode. The depth sets how deep that mode goes.

| Level | Work |
| --- | --- |
| Light | For a story, the story tier of `shared/contracts/references/reliability-checklist.md`. For a design, the design mode with only the questions that can change the answer. |
| Standard | For a story, the story tier, and the design mode for a question that the story tier cannot settle. For a design, the design mode. Load each reference only when its step needs it. |
| Deep | The design mode with every reference, a capacity estimate, and a list of the evidence that readiness mode will need before launch. |

Readiness mode runs at any level when a person asks for it.

| Request | Procedure | Result |
| --- | --- | --- |
| Review a design before it is built. | Design mode, steps 1 to 7. | `templates/reliability-review.md` with the failure-mode register and requirements. |
| Review a story or a feature plan. | Story tier of the checklist, to the depth in the level table. | Answers, warnings, and the failure scenarios that become acceptance criteria. |
| Check that a built service is ready for production. | Readiness mode below. | Each requirement as `Verified`, `Failed`, or `Not verified`, with evidence. |

## Design mode

1. Record the design source and revision, the user journeys that the change affects, and the stated targets.
   Read `references/slos-and-budgets.md`. Record a missing target as `Decision needed` with an owner. Do not choose a target.
2. Build the dependency inventory. Ask the owners about asynchronous links, because diagrams often miss them.
3. Read `references/question-bank.md`. Ask the questions for each area that the change touches.
   Record each answer as `Answered` with evidence, `Decision needed` with an owner, or `Not applicable` with a reason.
4. Read `references/failure-modes.md`. Walk each component and dependency through the failure categories,
   and fill the failure-mode register. Use `references/resilience-patterns.md` for proposed controls.
   Use `references/capacity-and-data.md` when the change alters load, a data store, or recovery targets.
   Use `references/platform-notes.md` for platform features.
5. Mark each risk as testable or not, and choose the lowest verification level that exposes it.
6. Convert each accepted control into a reliability requirement with an ID, such as `REL-REQ-1`.
   Give each important risk a disposition, an owner or `Unassigned`, and the remaining risk.
7. Hand off: requirements to `phased-delivery`, testable risks to `failure-scenario-design`,
   and rollback triggers and the watch list to `ship-it`.

## Readiness mode

Reconcile each reliability requirement with the implementation and operating evidence.
Check the SLO, the alerts, the runbooks, the dashboards, the capacity evidence, the restore evidence,
and the results of the failure scenarios. A tool run that finished is not a pass. Read the actual result.
Mark each requirement `Verified`, `Failed`, or `Not verified`. Do not claim readiness that the evidence does not show.

## Completion

Give one result: `Ready for planning`, `Needs decision`, `Needs revision`, or `Not verified`.
In readiness mode, the result is the list of requirement statuses. Do not give a `Ready for planning` result.
List the open decisions with their owners. For a design proposal, review the same revision as `threat-model`.
Reassess the affected rows when the topology, a dependency, a data store, or a target changes.
