---
name: threat-model
description: Model assets, trust boundaries, attacker paths, mitigations, and verification before building a security-sensitive change. Use for design-time security analysis, not active testing. Use security-audit for implemented code.
---

# threat-model

If you have not read `shared/contracts/references/human-readable-output.md` in this session,
read it before you write for the user.

Toolbelt paths: a path that starts with `shared/`, `skills/`, `templates/`, or `workflows/` is relative to the Toolbelt root, `${CLAUDE_PLUGIN_ROOT}`. If that variable is not replaced, use the nearest folder above this file that contains `shared/contracts/`.
Read `shared/contracts/references/evidence-quality.md` when establishing threat and control evidence.

Create a design-time security model before implementation. It is analytical and
does not perform active testing.

## Steps

1. Model only the stated system and the adjacent trust boundaries needed to understand it.
   Record the design source and reviewed revision.
   When the source is a refined story, has open questions, or has a `Not ready` verdict, record each
   open question as an assumption. Mark each threat that depends on one as `Open question`, name its
   owner, and state that the model is not final until the owner answers.
2. Establish assets, actors, data and control flows, entry points, and trust boundaries.
   Assets include data, privileges, availability, and business actions.
   Actors include legitimate users, services, operators, and credible attackers with stated capabilities.
   Test each asset and flow against the threat classes in `shared/contracts/references/security-checklist.md`.
3. Describe each credible attack path as entry point, precondition, action, impact, and mitigation.
   Map a path to CWE or OWASP only when the path supports the mapping.
   Rank paths by impact and exploitability, and record uncertainty.
4. Record existing control evidence and proposed controls separately.
   Distinguish proposed controls from observed implementation and verified behavior.
5. Convert each accepted mitigation into a testable security requirement.
   Verify each requirement by a test, review, configuration check, or operational control.
   Link stable threat IDs to requirement IDs and their verification methods.
6. Give each important threat a disposition, an owner or unassigned status, and remaining risk.
   Record assumptions and decisions that need an owner.
7. Identify the threat assumptions that need review after changes to architecture, identity,
   data sensitivity, tenant boundaries, or deployment.
8. For AI systems, inspect untrusted retrieved content, tool authority, stored context, and sensitive output.
9. Hand the requirements to `phased-delivery`, `test-case-design`, or `shape-up` as appropriate.
   A defect that you find in existing code goes to `security-audit`, not into this model.
10. Label a check that uses a mock or stand-in for an external system `Mock-verified`, not `Verified`.
    A mock proves what the code asks for, not what the real system returns.

## Completion

Deliver `templates/threat-model.md` with bounded scope and residual risk. Use its ID scheme
and vocabularies. Do not
claim compliance or run active probes. Save the model to `.atb-work/threat-model/<scope-slug>.md`
when the user names no path, and print the path. The durable-output rule is in
`shared/contracts/references/execution.md`.
