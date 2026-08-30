---
description: Conduct a bounded, read-only security audit of code, configuration, dependencies, and secret exposure.
argument-hint: "<path-or-system> [--active-scope <written-authorization>]"
---

# /security-audit

Use the `security-audit` skill for evidence-backed security review.

**Arguments:** `$ARGUMENTS`

Default to read-only code, configuration, dependency, and secret-exposure analysis.
Use `templates/security-audit.md`, redact sensitive values, and assess reachability
and exploitability. Active testing is allowed only after written scope and
authorization immediately before the action; otherwise stop at the audit report.
