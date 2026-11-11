#!/usr/bin/env bash
# DESC: evidence-linked research themes, counterexamples, and sample limits
# DEPENDS: simple-english
pack_user_research_synthesis() {
  shared_contract references/human-readable-output.md
  shared_contract references/docs-writing.md
  shared_contract references/evidence-quality.md
  cmd user-research-synthesis
  skill user-research-synthesis SKILL.md
  template user-research-synthesis.md
  workflow product-learning-workflow.md
}
