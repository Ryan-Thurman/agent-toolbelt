#!/usr/bin/env bash
# DESC: bounded PR finding-fix-rereview loop with frozen scope and a persistent ledger
pack_pr_improve() {
  shared_contract references/human-readable-output.md
  cmd pr-improve
  skill pr-improve SKILL.md
  skill pr-improve references/loop-contract.md
  template pr-improve-ledger.md
}
