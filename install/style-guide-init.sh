#!/usr/bin/env bash
# DESC: mine repository evidence into a proposed canonical coding-style guide
pack_style_guide_init() {
  cmd style-guide-init
  skill style-guide-init SKILL.md
  shared_contract references/style-precedence.md
  shared_contract references/anti-slop-naming.md
  shared_contract references/typescript-react-baseline.md
  template repository-style-guide.md
}
