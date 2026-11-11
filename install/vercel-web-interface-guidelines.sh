#!/usr/bin/env bash
# DESC: review web UI against the Vercel Web Interface Guidelines, pinned offline copy
# DEPENDS: simple-english
pack_vercel_web_interface_guidelines() {
  shared_contract references/human-readable-output.md
  shared_contract references/docs-writing.md
  skill_tree vercel-web-interface-guidelines
  shared_contract references/typescript-react-baseline.md
  shared_contract scripts/react-rule-scan.py
  shared_contract references/react-acceptance.md
}
