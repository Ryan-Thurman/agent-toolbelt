---
name: auto-agent-dev-lite
description: Use only for headless or orchestrated Dev Lite jobs where agent-runner or another caller invokes an agent CLI for IMPLEMENT, FIX, PHASE_REVIEW, or PR_REVIEW with a caller-owned immutable plan document. Do not use for interactive Dev Lite sessions.
---

# auto-agent-dev-lite

Use this skill when an outside orchestrator is running Dev Lite-style work
through agent CLIs and the caller owns durable progress state. The plan document
is requirements input, not a living agent handoff.

For interactive, human-supervised feature work, use `dev-lite-workflow` instead.

## Plan Contract

Treat the plan path supplied by the caller as read-only unless the caller
explicitly says this job is the close-phase writer.

- Do not create, edit, reformat, or save the plan document.
- Do not mark tasks or phases complete.
- Do not add, remove, or rewrite `Status:` or `Evidence:` lines.
- Do not rewrite phase prose into past tense after work is done.
- Do not "keep the plan current" even if a Dev Lite command or template says to
  update the Implementation Plan.
- Use the supplied phase body, task text, checks, and acceptance criteria as the
  frozen spec for implementation and review.

If an output format asks for `Plan Document Updates`, write exactly:

```text
skipped: caller owns the plan document
```

## Job Rules

For `IMPLEMENT` jobs:

- Implement only the selected task or phase scope supplied by the caller.
- Do not start future phases or adjacent tasks.
- Add or update tests with behavior changes when practical.
- Run the requested checks when available; otherwise report the exact checks
  that still need to run.
- Report changed files, checks, risks, and blockers. Do not report plan edits.

For `FIX` jobs:

- Fix only the supplied review findings.
- Do not introduce unrelated cleanup or future-phase work.
- Add or update tests when the finding exposes missing coverage.
- Report which findings were fixed, changed files, checks, remaining risks, and
  blockers. Do not report plan edits.

For `PHASE_REVIEW` or `PR_REVIEW` jobs:

- Review against the frozen plan text, acceptance criteria, diff, and supplied
  evidence.
- Do not raise a finding because the plan document was not updated.
- Do raise findings for implementation drift from the frozen plan body, missing
  required checks, insufficient tests, future-phase leakage, contract drift, or
  ordinary correctness/security/performance/UX risks.

For `CLOSE_PHASE` jobs:

- Only write runner-owned metadata if the caller explicitly grants that role and
  states the allowed write region.
- Never edit the protected phase body.
- If the body no longer matches the caller-registered text, stop and report the
  drift instead of repairing it.

## Conflict Rule

If another loaded command says to update the Implementation Plan and this skill
is active for a headless job, this skill wins. The caller owns progress state.
