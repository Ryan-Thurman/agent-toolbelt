#!/usr/bin/env bash
# DESC: policy- or risk-driven pre-PR maintainability gate with bounded convergence
# DEPENDS: simplify pr-review pr-improve crap-analysis
pack_code_quality_gate() {
  shared_contract references/human-readable-output.md
  cmd code-quality-gate
  skill code-quality-gate SKILL.md
  skill code-quality-gate references/gate-contract.md
  skill code-quality-gate scripts/fingerprint.sh

  shared_contract references/style-precedence.md
  shared_contract references/anti-slop-naming.md
  shared_contract references/typescript-react-baseline.md
  shared_contract references/maintainability-taxonomy.md

  template code-quality-gate-report.md
}
