---
name: security-audit
description: Perform a read-only security audit of code, configuration, dependencies, and secret exposure. Use for evidence-backed security review; active testing requires explicit written authorization.
---

# security-audit

Audit a bounded target for security risks. Default behavior is read-only review.

## Steps

1. Read `references/audit-boundaries.md`. Confirm target scope, data sensitivity,
   and allowed evidence sources before inspecting code, configuration, dependencies,
   and potential secret exposure.
2. Analyze attacker reachability and exploitability for each candidate. Map to CWE
   or OWASP only when supportable by the evidence; do not claim complete coverage
   or compliance.
3. Report remediation, verification, confidence, and residual risk without printing
   secret values. Treat suspected secrets as sensitive evidence.
4. Stop before active testing. Proceed only when the user gives written scope and
   authorization immediately before the requested active action.

## Completion

Deliver `templates/security-audit.md` with evidence-backed findings and a clear
read-only or authorized-active status. Do not edit, commit, or expose secrets.
