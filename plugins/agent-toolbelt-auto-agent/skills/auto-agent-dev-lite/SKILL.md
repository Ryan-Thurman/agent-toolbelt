---
name: auto-agent-dev-lite
description: Use only for headless or orchestrated phased-delivery jobs where agent-runner or another caller invokes an agent CLI for IMPLEMENT, FIX, PHASE_REVIEW, or PR_REVIEW with a caller-owned immutable plan document. Do not use for interactive phased-delivery sessions.
---

# auto-agent-dev-lite

Use this skill when an outside orchestrator runs phased-delivery-style work
through agent CLIs and the caller owns durable progress state. The plan document
is requirements input, not a living agent handoff.

For interactive, human-supervised feature work, use `phased-delivery` instead.

When the caller supplies a managed context or structured result format, read the sibling
`../auto-agent-contract/references/execution-boundary.md` before executing the job.
Preserve its caller and worker ownership; existing job payloads remain valid until the caller changes them.

## Plan Contract

Treat the plan path supplied by the caller as read-only unless the caller
explicitly says this job is the close-phase writer.

- Leave the plan document unchanged. The caller owns task status, phase status, and the `Status:` and `Evidence:` lines.
- Keep the phase prose as written, including after the work is done.
- Use the supplied phase body, task text, checks, and acceptance criteria as the
  frozen spec for implementation and review.

## Job Rules

For `IMPLEMENT` jobs:

- Implement only the selected task or phase scope supplied by the caller.
- Do not start future phases or adjacent tasks.
- Verify any supplied task preconditions with read-only checks before mutation.
  If one is unmet or cannot be verified without writes, network mutation, or
  secret disclosure, stop and report it as a blocker; do not partially execute
  the task.
- Before changing executable behavior, read `shared/contracts/references/test-driven-development.md` and use its test-first procedure.
- Keep test cases within the supplied acceptance criteria and permitted paths.
- Run the requested checks when available; otherwise report the exact checks
  that still need to run.
- Report changed files, red/green evidence, coverage limits, risks, and blockers through the caller's existing result format.

For `FIX` jobs:

- Fix only the supplied review findings.
- Do not introduce unrelated cleanup or future-phase work.
- Use `shared/contracts/references/test-driven-development.md` for behavior fixes and missing regression coverage.
- Report which findings were fixed, changed files, checks, remaining risks, and
  blockers.

For `PHASE_REVIEW` or `PR_REVIEW` jobs:

- Review against the frozen plan text, acceptance criteria, diff, and supplied
  evidence.
- Do not raise a finding because the plan document was not updated.
- Do raise findings for implementation drift from the frozen plan body, missing
  required checks, insufficient tests, future-phase leakage, contract drift, or
  ordinary correctness/security/performance/UX risks.
- Assess supplied red/green evidence and coverage gaps without rerunning implementation or editing the caller's plan.

For `CLOSE_PHASE` jobs:

- Only write runner-owned metadata if the caller explicitly grants that role and
  states the allowed write region.
- Never edit the protected phase body.
- If the body no longer matches the caller-registered text, stop and report the
  drift instead of repairing it.

## Conflict Rule

This skill takes precedence for a headless job.
When another loaded command, template, or output format asks for plan edits, skip them.
Report that item as `skipped: caller owns the plan document`.
