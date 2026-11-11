---
name: security-audit
description: Perform a read-only security audit of implemented code, configuration, dependencies, and secret exposure. Use threat-model for a design before it is built. Active testing requires explicit written authorization.
---

# security-audit

If you have not read `shared/contracts/references/human-readable-output.md` in this session,
read it before you write for the user.

Toolbelt paths: a path that starts with `shared/`, `skills/`, `templates/`, or `workflows/` is relative to the Toolbelt root, `${CLAUDE_PLUGIN_ROOT}`. If that variable is not replaced, use the nearest folder above this file that contains `shared/contracts/`.
Read `shared/contracts/references/evidence-quality.md` when assessing findings and control status.

Audit a bounded target for security risks. Default behavior is read-only review.

## Steps

1. Confirm the target scope, data sensitivity, and allowed evidence sources.
   Default sources are repository code, configuration, dependency manifests and lockfiles,
   CI definitions, and supplied logs or architecture artifacts.
2. Before you run any local tool, send data to a network service, or start active testing,
   read `references/audit-boundaries.md`.
3. Inspect the target against `shared/contracts/references/security-checklist.md`.
4. Check dependencies offline first:
   - Read the manifests and lockfiles. Record the resolved versions of direct and security-relevant packages.
   - Run a lockfile audit command only when it can run without network access.
   - Query an external advisory source only with network authority.
5. Check secret exposure:
   - Search the working tree, CI definitions, and example configuration for credential patterns.
   - Search Git history with `git log -p` or `git grep` across revisions for removed secrets.
   - Record each location and secret type. Do not print the secret value.
6. For each finding, record the affected asset, entry point, precondition, reachability,
   exploitability, impact, evidence, remediation, verification, and confidence.
   Map a finding to CWE or OWASP only when the evidence supports the mapping.
7. When a design or threat report exists, reconcile its requirements and threat IDs against
   implementation evidence. Record each required control as `Verified`, `Failed`, or
   `Not verified`, with the inspected revision and evidence.
8. Stop before active testing. Continue only after the user gives written scope and
   authorization immediately before the requested active action.

## Active scope

The `--active-scope <written-authorization>` argument, or the same text in the request,
gives the written authorization for active testing. It must name:

- The target systems.
- The techniques that are permitted.
- The time window.
- The stop conditions.

If one item is missing, the audit stays read-only. Report the missing item.
An active scope does not replace step 8. Confirm with the user immediately before each active action.

## Completion

Deliver `templates/security-audit.md` with evidence-backed findings, residual risk, and a clear
read-only or authorized-active status. Do not claim complete coverage or compliance.
Keep repository files unchanged, and do not commit.
