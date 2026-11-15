# Readiness review

Read this in step 6 of `story-refinement`, or for a request to check whether a story is ready.
The review reports findings and a verdict. It does not change the item.

## Reviewer lenses

Run each lens as a separate subagent when the host supports subagents.
A lens must not see the findings of another lens. If the host has no subagents,
run the lenses yourself one after another, and label the result `Self-review`.

| Lens | Checks |
| --- | --- |
| Product | The outcome is observable. Scope and exclusions are clear. The item solves the stated problem. Each term has one meaning. |
| Developer | The code supports the item. Integration points, data changes, and migrations are named. Source conflicts are settled. The item fits one PR or is sliced. |
| QA | Each criterion is testable and has its failure path. Each family in `shared/contracts/references/negative-testing.md` is covered or marked `Not applicable` with a reason. Criteria do not conflict. |
| SRE | The story tier of `shared/contracts/references/reliability-checklist.md` is answered when it applies. Non-functional requirements have units and sources, or `Unknown` with an owner. Rollout and rollback are stated. |

Run the lenses that the depth level allows:

| Level | Lenses |
| --- | --- |
| Light | The builder check, and a QA self-review with no subagent. |
| Standard | The builder check and the QA lens. Add the SRE lens when the reliability story tier applies. |
| Deep | All four lenses and the builder check. |

The builder check is a required check. At any level, add a security lens when the item touches
authentication, personal data, or money. The security lens is also a required check.
Use `threat-model` for its checks. At the Deep level, add a design lens for a user-facing flow.

## Lens brief

Give each subagent only these inputs:

1. The path or text of the refined draft.
2. The purpose of the item and who uses the result.
3. The settled decisions. The lens must not reopen them.
4. The lens checks from the table above.
5. The return shape: at most five findings. Each finding gives the location, the condition, and the consequence.
   The lens can return "nothing important".

## Builder check

Give a fresh subagent the draft only. It acts as a builder who cannot talk to the author.
It lists the questions where a wrong guess changes what gets built, most important first.
Run it once for each review.

## Merge and sort

Merge the findings from all lenses and the builder check. Two lenses with the same finding is a stronger signal.
Sort each finding into one group:

| Group | Action |
| --- | --- |
| Already answered | Write the answer into the spec. |
| Fix | Correct a mechanical problem in the draft during refinement. In review-only mode, report it. |
| Default | Choose an answer, and mark it as your call. |
| Ask | Add it to the register with its owner. A finding that rejects the premise is a challenge. |

## Definition of Ready checks

If the project has its own Definition of Ready, use it in place of this list.

1. The outcome is observable.
2. Scope and exclusions are stated.
3. Each term is canonical.
4. Each criterion is testable and has its failure path.
5. Each applicable edge and negative family is resolved, or dismissed with a reason.
6. Non-functional requirements are stated, or `Unknown` with an owner.
7. The reliability story tier is answered when it applies.
8. No open question blocks the start of work.
9. Dependencies are known and have no cycle.
10. The item fits one PR, or it is sliced.
11. The builder check returned nothing important.

## Verdict

Give one verdict and list each failed check with its evidence.

| Verdict | Meaning |
| --- | --- |
| `Ready` | Every check passes. |
| `Ready with defaults` | Every check passes, but the spec contains defaults that an owner has not confirmed. |
| `Not ready` | One or more checks fail. |
| `Not verified` | A required source or review could not run. Name the missing input. |

The verdict is a warning. It does not stop a handoff unless the project instructions make it a gate.
