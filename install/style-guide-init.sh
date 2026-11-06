#!/usr/bin/env bash
# DESC: derive and maintain evidence-backed repository contribution and style guidance
pack_style_guide_init() {
  shared_contract references/human-readable-output.md
  cmd style-guide-init
  skill_tree style-guide-init
  shared_contract references/style-precedence.md
  shared_contract references/anti-slop-naming.md
  shared_contract references/typescript-react-baseline.md
  template repository-style-guide.md
  template repository-contribution-guide.md
}
