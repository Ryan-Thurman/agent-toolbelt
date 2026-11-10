#!/usr/bin/env bash
# DESC: evidence-led product opportunity discovery before shape-up
# DEPENDS: simple-english
pack_product_discovery() {
  shared_contract references/human-readable-output.md
  shared_contract references/docs-writing.md
  shared_contract references/evidence-quality.md
  shared_contract references/product-measurement.md
  cmd product-discovery
  skill product-discovery SKILL.md
  skill product-discovery references/discovery-decisions.md
  template product-discovery.md
  template product-measurement-plan.md
  workflow product-learning-workflow.md
}
