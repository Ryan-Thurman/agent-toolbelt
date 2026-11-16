#!/usr/bin/env bash
# DESC: policy- or risk-driven pre-PR maintainability gate that hands repairs to pr-improve
# DEPENDS: pr-review pr-improve crap-analysis simple-english
pack_code_quality_gate() {
  shared_contract references/human-readable-output.md
  shared_contract references/docs-writing.md
  shared_contract references/execution.md
  cmd code-quality-gate
  skill code-quality-gate SKILL.md
  skill code-quality-gate references/gate-contract.md
  skill code-quality-gate scripts/fingerprint.sh

  shared_contract references/typescript-react-baseline.md
  shared_contract scripts/react-rule-scan.py
  shared_contract references/react-acceptance.md

  template code-quality-gate-report.md
}
