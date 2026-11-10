#!/usr/bin/env bash
# DESC: plain English with ASD-STE100 discipline for replies and documents
# DEPENDS: writing-whip
pack_simple_english() {
  skill_tree simple-english
  shared_contract references/human-readable-output.md
  shared_contract references/docs-writing.md
}
