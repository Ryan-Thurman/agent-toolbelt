#!/usr/bin/env bash
# DESC: full AI writing trope catalog behind the shared writing rules, from tropes.fyi
pack_writing_whip() {
  shared_contract references/human-readable-output.md
  shared_contract references/docs-writing.md
  skill_tree writing-whip
}
