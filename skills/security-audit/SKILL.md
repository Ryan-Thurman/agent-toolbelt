---
name: security-audit
description: Perform a read-only security audit of implemented code, configuration, dependencies, and secret exposure. Use threat-model for a design before it is built. Active testing requires explicit written authorization. Use pr-review for the security facet of one diff.
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
   - Record a dependency check that has no advisory data as `Not verified`, never as clean.
     Record the tool and its version with the result.
5. Check secret exposure:
   - Search the working tree, CI definitions, and example configuration for credential patterns.
   - Search Git history for removed secrets with `git log --all -G<pattern> --format='%h %s'` and
     `git log --all --diff-filter=A --name-only`. For a revision, use `git grep -l <pattern> <revision>`.
     These forms print commit IDs and file names only. Do not use `git log -p` or `git grep`
     without `-l`, because they print the matched line or the removed line.
   - Record each location and secret type. Do not print the secret value.
6. For each finding, record the affected asset, entry point, precondition, reachability,
   exploitability, impact, evidence, remediation, verification, and confidence.
   Map a finding to CWE or OWASP only when the evidence supports the mapping.
7. When a design or threat report exists, reconcile its requirements and threat IDs against
   implementation evidence. Record each required control as `Verified`, `Failed`, or
   `Not verified`, with the inspected revision and evidence. When no design or threat report
   exists, write `Not applicable` and the reason in that table.
8. Stop before active testing. See Active scope.

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
read-only or authorized-active status. Use the template's severity scale for each finding.
Do not claim complete coverage or compliance.
Save the report to `.atb-work/security-audit/<scope-slug>.md` when the user names no path.
Print the path. The durable-output rule is in `shared/contracts/references/execution.md`.
Keep repository files unchanged, and do not commit.
