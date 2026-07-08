---
description: Draft a per-repo .pr-review.md review-priorities config by mining the repo — docs, git burn history, review threads, rejection memory
argument-hint: "[--print] [--refresh]"
---

# /pr-review-init

Draft this repo's **`.pr-review.md`** — the per-repo review-priorities config that `/pr-review`
loads on every run (`skills/pr-review/references/repo-config.md`) — by mining the repo for
evidence instead of starting from the blank template.

**Arguments:** `$ARGUMENTS`

- **`--print`** — print the draft instead of writing `.pr-review.md` to the repo root.
- **`--refresh`** — a `.pr-review.md` already exists: re-mine and propose additions/removals as a
  diff against it; never overwrite.

Follow the recipe in `skills/pr-review/references/config-init.md`:

1. Mine the repo, in order: what the system is (README/docs/`CLAUDE.md`) → **Context**; which defect
   class hurts here → **Always run / Emphasis**; bars already written down (SLOs, contract-sync
   rules, invariants) → **Budgets**; revert/hotfix history and recurring review push-back →
   **Severity overrides**; rejection memory + established bespoke patterns → **Do not flag**;
   production-logic weight → **Minimum tier**.
2. Emit only sections with real evidence behind them — sparse and true beats padded and generic.
   Annotate non-obvious lines with an HTML comment naming the evidence.
3. Write the draft to `.pr-review.md` at the repo root (skeleton: `templates/pr-review.md`), then
   tell the user to prune and commit it. **Never commit it yourself** — the config only takes effect
   once it's on the base branch, and that promotion is the team's policy decision.
