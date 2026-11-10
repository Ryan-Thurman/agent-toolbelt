#!/usr/bin/env bash
# DESC: conditional React and Next.js performance guidance with 70 upstream rules
pack_vercel_react_best_practices() {
  shared_contract references/human-readable-output.md
  skill_tree vercel-react-best-practices
  shared_contract references/typescript-react-baseline.md
  shared_contract scripts/react-rule-scan.py
  shared_contract references/react-acceptance.md
}
