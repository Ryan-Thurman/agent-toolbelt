#!/usr/bin/env bash
# DESC: evidence-led product opportunity discovery before shape-up
pack_product_discovery() {
  shared_contract references/human-readable-output.md
  cmd product-discovery
  skill product-discovery SKILL.md
  template product-discovery.md
}
