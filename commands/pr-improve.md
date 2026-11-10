---
description: Fix accepted PR findings in bounded rounds with a frozen baseline, ledger, and rereview.
argument-hint: "<pr-or-diff> [--scope path[,path]] [--rounds N]"
---

# /pr-improve

Use `/pr-improve` to fix accepted review findings on a PR. Use `/pr-review` to find them.

**Arguments:** `$ARGUMENTS`

- **target** — a PR, branch, or diff with existing findings.
- **`--scope path[,path]`** — the directories that fixes can change. The default is the baseline's changed paths.
- **`--rounds N`** — the round bound. The default is 3.

Follow the `pr-improve` skill (`skills/pr-improve/SKILL.md`).
