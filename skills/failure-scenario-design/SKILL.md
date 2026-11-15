---
name: failure-scenario-design
description: Turn reliability risks into failure-scenario cards with a hypothesis, steady state, fault, blast radius, abort conditions, Given/When/Then form, and test-first case. Plans chaos experiments and game days for staging. Plan output only.
---

# failure-scenario-design

If you have not read `shared/contracts/references/human-readable-output.md` in this session,
read it before you write for the user.

Toolbelt paths: a path that starts with `shared/`, `skills/`, `templates/`, or `workflows/` is relative to the Toolbelt root, `${CLAUDE_PLUGIN_ROOT}`. If that variable is not replaced, use the nearest folder above this file that contains `shared/contracts/`.

A failure scenario states how the system must behave when one thing goes wrong.
This skill writes scenario cards that become BDD scenarios, test-first cases, and staging chaos experiment plans.
It never runs fault injection, load, or restore tools. It targets staging. It plans a production
experiment only with a recorded written approval (see Rules).

Choose the depth with `shared/contracts/references/depth-levels.md` and state it first.

| Level | Work |
| --- | --- |
| Light | No cards. Write the failure criteria of the story as Given/When/Then scenarios only. |
| Standard | Cards at the unit, integration, and BDD levels. Mark a card that needs a real platform fault as `Staging` and do not plan the experiment. |
| Deep | All cards, plus staging experiment and game day plans. |

## Procedure

1. Take the risks marked testable and the journeys from a `reliability-review` report.
   Without a report, ask for the journey and the dependency, or read the story tier answers
   of `shared/contracts/references/reliability-checklist.md`.
2. Read `references/scenario-design.md`. Write one card for each scenario in `templates/failure-scenario-design.md`.
   Change one variable in each card.
3. Define the steady state from an existing signal. If no signal exists, mark the card `Conditional`
   and add the telemetry as a requirement.
4. Choose the lowest verification level that exposes the risk.
5. Read `references/bdd-mapping.md`. Write the Given/When/Then form and the test-first case of each card.
6. At the Deep level, or when a person asks, read `references/staging-experiment-plan.md` for each card at the staging experiment or game day level,
   and complete the blast radius, abort conditions, rollback, and no-go conditions.

## Rules

- Staging only. A production experiment needs written approval that names the target, the faults,
  the time window, the blast radius, the abort conditions, and the owner. Record the approval reference.
  Do not write a production experiment without it.
- Take every threshold from the project SLO or a named owner. Otherwise record `Decision needed`.
- A finished run is not a passed run. A result is `Supported`, `Contradicted`, or `Inconclusive`, with evidence.

## Completion

Deliver the cards. Hand the Given/When/Then scenarios to `bdd-scenarios`,
the lower-level cases to `test-case-design` or `cover`,
and the staging experiment plans to the team that owns the chaos tooling.
