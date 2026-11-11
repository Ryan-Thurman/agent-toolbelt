---
description: Draft an agent-runner execution plan (docs/plan.md) by mining the repo for phases, each with runnable acceptance criteria
argument-hint: "[source] [--print] [--config]"
---

# /auto-agent-plan

Use this command to draft the markdown execution plan that `agent-runner` consumes.

**Arguments:** `$ARGUMENTS`

- **`source`** *(optional)* — where the work comes from: a roadmap doc, an issue label, a milestone,
  a design doc. Default: mine `docs/roadmap.md`, then open issues, then TODO/FIXME density.
- **`--print`** — print the draft instead of writing `docs/plan.md`.
- **`--config`** — also emit a starting `.agent-runner.json`. Prefer running `agent-runner init` and
  editing the result; the `agents` flag block is unforgiving and the generated one is correct.

Follow "Drafting a plan" in `skills/auto-agent-contract/references/plan-format.md` for `$ARGUMENTS`.
