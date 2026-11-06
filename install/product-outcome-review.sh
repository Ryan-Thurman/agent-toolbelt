#!/usr/bin/env bash
# DESC: customer outcome review after an experiment or release
pack_product_outcome_review() {
  shared_contract references/human-readable-output.md
  shared_contract references/evidence-quality.md
  shared_contract references/product-measurement.md
  cmd product-outcome-review
  skill product-outcome-review SKILL.md
  template product-outcome-review.md
}
