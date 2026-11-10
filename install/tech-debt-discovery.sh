#!/usr/bin/env bash
# DESC: repository-wide debt discovery, evidence, and prioritization
# DEPENDS: simple-english
pack_tech_debt_discovery() {
  shared_contract references/human-readable-output.md
  shared_contract references/docs-writing.md
  shared_contract references/evidence-quality.md
  cmd tech-debt-discovery
  skill tech-debt-discovery SKILL.md
  skill tech-debt-discovery references/discovery-method.md
  template tech-debt-register.md
  workflow tech-debt-workflow.md
}
