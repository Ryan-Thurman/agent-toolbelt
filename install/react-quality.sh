#!/usr/bin/env bash
# DESC: React quality bundle: Vercel composition and performance specialists
# DEPENDS: vercel-composition-patterns vercel-react-best-practices
pack_react_quality() {
  # The specialist dependencies own the skill trees; this shared reference call
  # keeps the bundle self-describing and avoids a dependency-only install warning.
  shared_contract references/typescript-react-baseline.md
}
