# Technical backlog assessment: <title>

## Recommendation

Verdict: Do / Defer / Reject / Spike

Confidence: High / Medium / Low

Summary: <one-paragraph recommendation>

## Backlog item

<original ticket/request and the technical decision being evaluated>

## Current state

<repo evidence: current implementation, relevant files/modules, tests, commands,
dependencies, CI/deploy constraints>

## Options considered

| Option | Benefit | Cost, risk, and effort | Decision and reason |
|---|---|---|---|
| Status quo |  |  |  |
| Option A |  |  |  |
| Option B |  |  |  |

## Package / library decision

Use when the assessment involves a dependency, package import, library switch, or
framework upgrade. Otherwise write `Not applicable`.

| Factor | Finding |
|---|---|
| API fit |  |
| Maintenance/support signal |  |
| Security/licensing |  |
| Runtime/bundle/performance impact |  |
| Migration cost |  |
| Reversibility/lock-in |  |

## Proposed implementation shape

Describe the smallest useful implementation or spike. Each step explains its
purpose and the evidence needed to finish. Use a dependency diagram if helpful.
Keep implementation code in the development step.

| Step | Do | Why | Done when |
|---|---|---|---|
| 1 | <bounded action> | <task-specific reason> | <observable result> |

## Test strategy

| Test Type | What It Proves | Command / Evidence |
|---|---|---|
| Unit |  |  |
| Integration / E2E |  |  |
| Regression |  |  |
| Manual / Operational |  |  |

## Risks and mitigations

- <risk>: <mitigation>

## Open questions

- <question> Recommended default: <default>

## Next workflow

Recommended next command: `/ticket-discover` / `/dev-plan` /
`/implementation-plan` / `/simplify` / `/retrofit` / `/cover-gaps` / `/cover` / No action

Handoff notes: <the first action for the next agent/person>
