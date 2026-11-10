---
description: Run a focused pre-PR quality gate when policy, user request, or risk calls for it
argument-hint: "[--mode=report|apply] [--rounds N] [--scope path[,path]] [--disposition-json '<object>']"
---

# /code-quality-gate

Use this command for a pre-PR quality verdict on the checked-out branch. For other targets, use `/pr-review`.
Follow the `code-quality-gate` skill in `skills/code-quality-gate/SKILL.md` for `$ARGUMENTS`.
