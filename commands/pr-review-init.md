---
description: Draft a per-repo .pr-review.md review-priorities config by mining the repo — docs, git burn history, review threads, rejection memory
argument-hint: "[--print] [--refresh]"
---

# /pr-review-init

Use `/pr-review-init` to draft the target repo's `.pr-review.md` from repo evidence.

**Arguments:** `$ARGUMENTS`

- **`--print`** — print the draft. Do not write `.pr-review.md`.
- **`--refresh`** — a `.pr-review.md` exists. Propose changes as a diff. Do not overwrite it.

Follow the `pr-review` skill's config generator (`skills/pr-review/references/config-init.md`).
