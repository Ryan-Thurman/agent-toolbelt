# Technical Backlog Assessment: <title>

## Recommendation

Verdict: Do / Defer / Reject / Spike

Confidence: High / Medium / Low

Summary: <one-paragraph recommendation>

## Backlog Item

<original ticket/request and the technical decision being evaluated>

## Current State

<repo evidence: current implementation, relevant files/modules, tests, commands,
dependencies, CI/deploy constraints>

## Options Considered

| Option | Benefit | Cost, risk, and effort | Decision and reason |
|---|---|---|---|
| Status quo |  |  |  |
| Option A |  |  |  |
| Option B |  |  |  |

## Package / Library Decision

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

## Proposed Implementation Shape

Describe the smallest useful implementation or spike. Each step explains its
purpose and the evidence needed to finish; use a dependency diagram if helpful.
Keep implementation code in the development step.

| Step | Do | Why | Done when |
|---|---|---|---|
| 1 | <bounded action> | <task-specific reason> | <observable result> |

## Test Strategy

| Test Type | What It Proves | Command / Evidence |
|---|---|---|
| Unit |  |  |
| Integration / E2E |  |  |
| Regression |  |  |
| Manual / Operational |  |  |

## Risks and Mitigations

- <risk>: <mitigation>

## Open Questions

- <question> Recommended default: <default>

## Next Workflow

Recommended next command: `/ticket-discover` / `/dev-plan` /
`/implementation-plan` / `/retrofit` / `/cover-gaps` / `/cover` / No action

Handoff notes: <what the next agent/person should do first>
