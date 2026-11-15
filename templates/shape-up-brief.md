# Brief: <short title>

The agreed shape of the work, produced by `/shape-up` and approved before planning. Keep it lean and
durable.

## Problem statement

The problem the user is facing, from the user's perspective.

## Solution

The solution to the problem, from the user's perspective.

## User stories

Only if scope warrants. Keep them tight.

- As a <actor>, I want <capability>, so that <benefit>.

## Implementation decisions

Distinguish agreed decisions, delegated technical choices, and analyst assumptions.
Link source documents and retain agreed exclusions.

The modules to build or modify, architectural decisions, schema changes, and API contracts.

Do **not** include specific file paths or code snippets, because they go stale quickly. Describe behavior
and contracts, not line-level detail.

## Test seams

Where this will be tested. Prefer existing seams over new ones. Use the highest seam possible (the
ideal number of new seams is one). Confirm these match the user's expectations.

## Non-functional requirements

Performance, availability, security, privacy, accessibility, and cost needs that apply.
Give each one a measure, a unit, a condition, and a source. If no source gives a target, write `Unknown` and name the owner.

## Out of scope

What this work explicitly does not include.

## Open questions

Before approval, resolve questions whose wrong answer materially changes the scope or plan.

| ID | Question | Owner | Blocks start | Recommended default | Status |
| --- | --- | --- | --- | --- | --- |
| Q-1 |  |  | Yes or No |  | Open |

## Further notes

Anything else worth recording (decisions considered and rejected, ADR links if pinned).
