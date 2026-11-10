#!/usr/bin/env bash
# DESC: stop AI writing tropes and behaviors at generation, with the tropes.fyi catalog
# DEPENDS: simple-english
pack_writing_whip() {
  shared_contract references/human-readable-output.md
  skill_tree writing-whip
}
