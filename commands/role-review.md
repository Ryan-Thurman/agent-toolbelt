---
description: Run a role-specific review gate for product, engineering, design, QA, security, or release readiness
argument-hint: "<role> <feature-ticket-pr-or-diff>"
---

# /role-review

Run a focused review from one role's point of view.

**Arguments:** `$ARGUMENTS`

Preconditions:
- If the role is missing or is not one of the supported roles below, list the
  supported roles and ask which one to run. Do not guess the role.
- If the target artifact is missing or its path does not resolve, ask for it
  before reviewing.

Supported roles:
- `product`: scope, acceptance criteria, user value, stakeholder decisions.
- `engineering`: architecture, maintainability, ownership, migrations,
  operational risk.
- `design`: user flow, accessibility, states, copy, edge cases.
- `qa`: test plan, regression risk, browser/device coverage, evidence gaps.
- `security`: authz/authn, data exposure, injection, dependency, audit risk.
- `release`: rollback, observability, docs, canary, release metadata.

Steps:
1. Identify the requested role and target artifact.
2. Read the relevant feature record, ticket, diff, PR, docs, and test evidence.
3. Review only from that role's perspective unless a severe cross-role blocker
   appears.
4. Return `Approve`, `Approve With Risks`, or `Block`.
5. Include findings with evidence, owner, required action, and whether the issue
   blocks the next gate.
