#!/usr/bin/env bash
# DESC: ASD-STE100 Strict mode, rule checks, and rewrite patterns behind the shared writing rules
# DEPENDS: writing-whip
pack_simple_english() {
  skill_tree simple-english
  shared_contract references/human-readable-output.md
  shared_contract references/docs-writing.md
}
