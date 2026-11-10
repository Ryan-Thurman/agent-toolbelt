#!/usr/bin/env bash
# DESC: audit React useEffect calls against 13 anti-patterns and propose fixes
pack_use_effect_killer() {
  shared_contract references/human-readable-output.md
  skill_tree use-effect-killer
  shared_contract references/typescript-react-baseline.md
  shared_contract scripts/react-rule-scan.py
  shared_contract references/react-acceptance.md
}
