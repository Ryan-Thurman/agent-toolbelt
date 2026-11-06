#!/usr/bin/env bash
# DESC: bounded read-only security audit with explicit authorization for active testing
pack_security_audit() {
  shared_contract references/human-readable-output.md
  cmd security-audit
  skill security-audit SKILL.md
  skill security-audit references/audit-boundaries.md
  template security-audit.md
}
