---
description: Draft an agent-runner execution plan (docs/plan.md) by mining the repo for phases, each with runnable acceptance criteria
argument-hint: "[source] [--print] [--config]"
---

# /auto-agent-plan

Draft the **markdown execution plan** that `agent-runner` consumes — `## Phase N:` headings, a
`Status: PENDING` line, a protected body, and a bounded context preamble — by mining this repo for
real, ordered, independently-mergeable work.

**Arguments:** `$ARGUMENTS`

- **`source`** *(optional)* — where the work comes from: a roadmap doc, an issue label, a milestone,
  a design doc. Default: mine `docs/roadmap.md`, then open issues, then TODO/FIXME density.
- **`--print`** — print the draft instead of writing `docs/plan.md`.
- **`--config`** — also emit a starting `.agent-runner.json`. Prefer running `agent-runner init` and
  editing the result; the `agents` flag block is unforgiving and the generated one is correct.

The full serialization contract is `skills/auto-agent-contract/references/plan-format.md`. Read it
before writing a line — the plan is parsed by regex and a malformed heading silently omits a phase.

## Recipe

1. **Establish the check.** Find the command that proves this repo works — the test invocation in CI,
   the `Makefile` target, the `package.json` script. **If you cannot find one, stop and ask.** A plan
   whose phases cannot be verified by a command will block the loop, and every later step depends on
   knowing what "done" runs.
2. **Mine the work.** Extract candidate phases from `source` and order them by dependency.
   Apply "What makes a phase executable" in `plan-format.md`.
   Merge or remove each phase that fails it.
3. **Write the context preamble.** Follow the 4000-character bound rules in `plan-format.md`.
4. **Write each phase.** Follow "The contract" and "A worked phase" in `plan-format.md`.
5. **Validate with the runner.** Follow "Validating a plan" in `plan-format.md`.
   Compare the phase count that the runner prints with the number of phases you wrote.
6. **Write `docs/plan.md`, then stop.** Tell the user to read the phases, prune the ones they don't
   want, and commit. `plan-validate` is safe to run and does not register anything, but **never run
   `agent-runner run` yourself** — starting an unattended loop that opens PRs and merges them is the
   user's decision, not the planner's.
