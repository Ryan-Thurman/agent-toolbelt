#!/usr/bin/env bash
# DESC: bounded read-only security audit with explicit authorization for active testing
# DEPENDS: simple-english
pack_security_audit() {
  shared_contract references/human-readable-output.md
  shared_contract references/docs-writing.md
  shared_contract references/evidence-quality.md
  shared_contract references/security-checklist.md
  cmd security-audit
  skill security-audit SKILL.md
  skill security-audit references/audit-boundaries.md
  template security-audit.md
}
