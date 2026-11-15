---
name: story-refinement
description: Refine a ticket, story, or approved brief into a ready-to-build spec. Find ambiguity, resolve facts from the repository, batch owner questions with defaults, write Given/When/Then criteria with negative paths, and give a readiness verdict.
---

# story-refinement

If you have not read `shared/contracts/references/human-readable-output.md` in this session,
read it before you write for the user.

Toolbelt paths: a path that starts with `shared/`, `skills/`, `templates/`, or `workflows/` is relative to the Toolbelt root, `${CLAUDE_PLUGIN_ROOT}`. If that variable is not replaced, use the nearest folder above this file that contains `shared/contracts/`.

Turn a work item that is almost ready into a spec that a builder can implement without a consequential guess.
Use as little human time as possible. This skill edits no code and publishes nothing.

Route other requests first:

- A vague idea, or a request that spans several subsystems, goes to `shape-up`.
- A decision about whether to build goes to `product-discovery`.
- A defect goes to `bug-to-fix`. An architecture question goes to `system-design`.

Choose the mode from the flag. With no flag, choose from the request.
If the request does not decide, use `--scan`.

| Flag | Request | Procedure | Result |
| --- | --- | --- | --- |
| `--scan` | Prepare an item before a refinement meeting, or run with no person present. | Steps 1 to 6. Ask no questions. | Refined draft, question register, and owner packets. |
| `--live` | Resolve the open questions with the user now. | Steps 1 to 6, then the live rounds in `references/question-strategy.md`. | Updated spec and decision log. |
| `--check` | Check whether a story is ready. | Read `references/readiness-review.md`. | Readiness verdict with findings. The item does not change. |

Choose the depth with `shared/contracts/references/depth-levels.md` and state it first.
The depth sets how many reviewer lenses run in step 6. The scan and the criteria run at every level.

## Principles

- **Resolve facts before you ask.** Read the code, the docs, and the tracker first.
  Use subagents for fact searches when the host supports them.
- **State every default.** Mark each default as your call. A person cannot reject a default that they did not see.
- **Ask only what changes the result.** A question must change scope, risk, acceptance, or the plan.
- **Invent no targets.** Record a missing target, regulation, or SLO as `Unknown` with an owner.
- **Keep scope.** Put ideas outside the item in the deferred list, not in the story.

## Procedure

1. Read the item and its linked sources. Write the tracker key in the `Tracker:` line of the template,
   and the source revision in the `Source:` line.
   If you cannot read the tracker, ask the user for the item text.
2. Read `references/ambiguity-scan.md`. Scan every requirement on both axes.
   Give each raised item a resolution state.
3. Classify each open item as fact, mechanical, default, decision, or challenge.
   Resolve facts and mechanical items yourself, and cite the evidence.
4. Draft the spec in `templates/refined-story.md`. Read `references/acceptance-criteria.md`.
   Read `shared/contracts/references/negative-testing.md` and `shared/contracts/references/test-levels.md`.
   When the item adds one of the triggers in `shared/contracts/references/reliability-checklist.md`,
   also answer the story tier in `shared/contracts/references/reliability-checklist.md`.
5. Read `references/question-strategy.md`. Put the assumptions table first.
   Group the remaining decisions by owner in `templates/refinement-questions.md`.
6. Run the readiness review in `references/readiness-review.md` on the draft.

## Completion

Deliver the refined spec, the decision log, the open-questions register, the readiness verdict,
and one question packet for each owner. Mark sources that you could not read as `Not verified`.

The readiness verdict is a warning. It does not stop a handoff unless the project instructions make it a gate.

Hand a ready spec to `bdd-scenarios` for feature files, to `test-case-design` for test cases,
and to `phased-delivery` for the plan.
Use `ticket-sync` to publish approved story changes to the tracker. The `Tracker:` line makes it update
the source ticket instead of creating an issue.

Concepts adapted from mattpocock/skills, obra/superpowers, open-gsd/gsd-core, and garrytan/gstack
(all MIT). No source text is copied.
