#!/usr/bin/env bash
# DESC: React quality bundle: composition, performance, useEffect, view transition, and UI guideline specialists
# DEPENDS: vercel-composition-patterns vercel-react-best-practices use-effect-killer vercel-react-view-transitions vercel-web-interface-guidelines
pack_react_quality() {
  # The specialist dependencies own the skill trees; this shared reference call
  # keeps the bundle self-describing and avoids a dependency-only install warning.
  shared_contract references/typescript-react-baseline.md
  shared_contract scripts/react-rule-scan.py
  shared_contract references/react-acceptance.md
}
