# Ticket discovery brief: <title>

## Ticket summary

<what the ticket asks for in plain language>

## Parsed request

Target: <system/module/service>

Precedent: <system/module/service that already has the pattern>

Requested change: <change to make>

Success signal: <how we will know it is done>

## Existing precedent

| Item | Finding |
|---|---|
| Source area |  |
| Relevant files |  |
| Test runner / command |  |
| Fixtures / test data |  |
| Auth / environment setup |  |
| CI hook |  |
| Patterns to reuse |  |

## Target current state

| Item | Finding |
|---|---|
| Target area |  |
| Existing tests |  |
| Existing commands |  |
| Missing setup |  |
| Constraints |  |

## Gap analysis

| Area | Precedent Has | Target Has | Action and why |
|---|---|---|---|
| Feature or behavior: <name> |  |  | Reuse / adapt / create |

Add these rows only when the ticket adds tests or changes that setup:

| Area | Precedent Has | Target Has | Action and why |
|---|---|---|---|
| Test setup |  |  | Reuse / adapt / create |
| Fixtures |  |  | Reuse / adapt / create |
| Auth / permissions |  |  | Reuse / adapt / create |
| Scenarios |  |  | Reuse / adapt / create |
| CI / command wiring |  |  | Reuse / adapt / create |

## Recommended approach

Describe the smallest useful adaptation, preserving the source ticket's scope.

| Step | Do | Why | Done when |
|---|---|---|---|
| 1 | <bounded adaptation> | <gap it closes> | <observable evidence> |

## Coverage To Add

- Happy path:
- Auth / permission case:
- Error case:
- Regression-prone edge case:

## Verification

| Check | Command / Evidence |
|---|---|
| Local targeted test |  |
| Full relevant suite |  |
| CI expectation |  |

## Risks / unknowns

- <risk or question>

## Implementation handoff

| Slice | Ready for implementation planning | Blocking question |
|---|---|---|
| <slice name> | Yes / No |  |

Recommended next command: `/implementation-plan` / `/cover` /
`/cover-gaps` / `/retrofit` / `/tech-assess`

First implementation step: <what to do first>
