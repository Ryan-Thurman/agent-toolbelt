#!/usr/bin/env bash
# DESC: plain English with ASD-STE100 discipline and the writing-whip trope check, for replies and documents
# The shared output rules point to both skills, so this pack installs both skill trees.
# writing-whip depends on this pack, so a writing-whip install also gets simple-english.
pack_simple_english() {
  skill_tree simple-english
  skill_tree writing-whip
  shared_contract references/human-readable-output.md
  shared_contract references/docs-writing.md
}
