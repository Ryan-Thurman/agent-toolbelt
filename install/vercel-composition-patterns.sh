#!/usr/bin/env bash
# DESC: conditional React composition guidance for maintainable component APIs
# DEPENDS: simple-english
pack_vercel_composition_patterns() {
  shared_contract references/human-readable-output.md
  shared_contract references/docs-writing.md
  skill_tree vercel-composition-patterns
  shared_contract references/typescript-react-baseline.md
  shared_contract scripts/react-rule-scan.py
  shared_contract references/react-acceptance.md
}
