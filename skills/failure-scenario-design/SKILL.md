---
name: failure-scenario-design
description: Turn reliability risks into failure-scenario cards with a hypothesis, steady state, fault, blast radius, abort conditions, Given/When/Then form, and test-first case. Plans chaos experiments and game days for staging. Plan output only. Use after reliability-review marks risks as testable.
---

# failure-scenario-design

If you have not read `shared/contracts/references/human-readable-output.md` in this session,
read it before you write for the user.

Toolbelt paths: a path that starts with `shared/`, `skills/`, `templates/`, or `workflows/` is relative to the Toolbelt root, `${CLAUDE_PLUGIN_ROOT}`. If that variable is not replaced, use the nearest folder above this file that contains `shared/contracts/`.

A failure scenario states how the system must behave when one thing goes wrong.
This skill writes scenario cards that become BDD scenarios, test-first cases, and staging chaos experiment plans.
It never runs fault injection, load, or restore tools. It targets staging (see Rules).

Choose the depth with `shared/contracts/references/depth-levels.md` and state it first.

| Level | Work |
| --- | --- |
| Light | No cards. Write the failure criteria of the story as Given/When/Then scenarios only. |
| Standard | Cards at the unit, integration, contract, and end-to-end levels. Give a card that needs a real platform fault the level `Staging experiment` or `Game day`, and do not plan the experiment. |
| Deep | All cards, plus staging experiment and game day plans. |

At the Light level, do step 1, then write the failure criteria with `references/bdd-mapping.md`. Skip steps 2 to 4.

A request for staging tests, a staging plan, or a game day selects the Deep level. State that choice and its reason
in the first sentence. A request for cards selects at least Standard. Staging experiment plans exist only at Deep.
A card that needs a staging experiment at Standard gets the result `Blocked`, with the reason `Deep level needed for the staging plan`.

## Procedure

1. Take the risks marked testable and the journeys from a `reliability-review` report.
   Without a report, ask for the journey and the dependency, or read the story tier answers
   of `shared/contracts/references/reliability-checklist.md`.
2. Read `references/scenario-design.md`. Write one card for each scenario in `templates/failure-scenario-design.md`.
3. Read `references/bdd-mapping.md`. Write the Given/When/Then form and the test-first case of each card.
4. At the Deep level, or when a person asks, read `references/staging-experiment-plan.md` for each card at the staging experiment or game day level,
   and complete the blast radius, abort conditions, rollback, and no-go conditions.

## Rules

- Staging only. A production experiment needs written approval that names the target, the faults,
  the time window, the blast radius, the abort conditions, and the owner. Record the approval reference.
  Do not write a production experiment without it.
- Take every threshold from the project SLO or a named owner. Otherwise record `Decision needed`.
- A finished run is not a passed run.

## Completion

Deliver the cards, or the failure criteria at the Light level. Write the cards to
`.atb-work/failure-scenario-design/<scope-slug>.md`, as `shared/contracts/references/execution.md`
("Durable report location") requires, unless the user names a path. Print the path.
Hand the Given/When/Then scenarios to `bdd-scenarios`,
the lower-level cases to `test-case-design`.
Hand test-first cases to the test-first loop of `phased-delivery` (when installed).
Hand cases for behavior that already exists to `cover`.
Hand the staging experiment plans to the team that owns the chaos tooling.
