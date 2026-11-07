---
name: threat-model
description: Model assets, trust boundaries, attacker paths, mitigations, and verification before building a security-sensitive change. Use for design-time security analysis, not active testing.
---

# threat-model

Before you write a response for the user, read
`shared/contracts/references/human-readable-output.md`.
Read `shared/contracts/references/evidence-quality.md` when establishing threat and control evidence.

Create a design-time security model before implementation. It is analytical and
does not perform active testing.

## Steps

1. Read `references/model-method.md`. Establish system scope, assets, actors and
   capabilities, data flows, entry points, and trust boundaries from available evidence.
2. Identify credible abuse cases and attack paths; rank mitigations by likely impact
   and exploitability, explaining uncertainty rather than asserting completeness.
3. Convert accepted mitigations into testable security requirements and a verification
   plan. Record residual risk, assumptions, and decisions needing an owner.
4. Hand the resulting requirements to planning, `/test-case-design`, or `/shape-up`
   as appropriate.
   Record the reviewed design revision and stable threat-to-requirement-to-verification links.
   Distinguish proposed controls from observed implementation and verified behavior.
   Give important threats a disposition and owner or unassigned status.

## Completion

Deliver `templates/threat-model.md` with bounded scope and residual risk. Do not
claim compliance or run active probes.
