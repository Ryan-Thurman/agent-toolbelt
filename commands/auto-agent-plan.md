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

2. **Mine the work.** From `source`, extract candidate phases. Order them by dependency. Then apply
   the two tests that matter, and drop or merge anything that fails either:
   - **Independently mergeable?** Each phase becomes one PR onto `baseBranch`. Work that only compiles
     once a later phase lands is not a phase — it is half of one. Merge them.
   - **Decidable by a command?** If acceptance is "the UI feels better", either find the assertion
     hiding inside it or cut the phase. Do not write a phase you cannot check.

3. **Write the context preamble** — everything before the first `## Phase` heading. It is injected
   into every agent prompt as untrusted data and **bounded at 4000 characters**, so front-load it:
   what the system is, where the code lives, which docs to read first, the standing scope rule (*do
   not start future phases*), and the review contract (findings bucketed `blocking` / `shouldFix` /
   `nitpick`; `PASS` means all buckets empty). Count the characters — past the bound the copy is cut
   and marked `[plan context truncated]`, so the agents know context is missing but not what.

4. **Write each phase.** Heading `## Phase <N>: <title>`, then `Status: PENDING`, then a stable body:
   a one-paragraph statement of intent, implementation bullets specific enough to act on, and an
   `Acceptance Criteria:` block naming the command and what it must prove. **Never write an
   `Evidence:` line** — it is runner-owned, written by the closer.

5. **Check the mechanics before you hand it over**, since there is no `agent-runner plan validate`:

   ```bash
   grep -cE '^## Phase [0-9]+: .+$' docs/plan.md   # phases the runner will see
   grep -cE '^Status: '             docs/plan.md   # must equal the phase count, all PENDING
   grep -nE '^Evidence: '           docs/plan.md   # nothing — the closer writes these
   awk '/^## Phase /{exit} {n+=length($0)+1} END{print n " chars (bound: 4000)"}' docs/plan.md
   ```

   The first two counts must match. A heading that missed the regex is a phase the runner never
   executes, and the plan "completes" early with the work undone. Phase numbers must also be unique —
   a duplicate raises `PlanError` at registration.

6. **Write `docs/plan.md`, then stop.** Tell the user to read the phases, prune the ones they don't
   want, and commit. **Never run `agent-runner run` yourself** — starting an unattended loop that
   opens PRs and merges them is the user's decision, not the planner's.

## Anti-patterns

- **A phase per file.** Phases are units of *mergeable value*, not units of editing.
- **Acceptance criteria that restate the implementation bullets.** "The function is added" is not a
  criterion. "`pytest tests/test_x.py` passes, covering the empty-input case" is.
- **A context preamble that instructs the runner.** It reaches the *agents*, as data, and it cannot
  override the runner's safety or scope rules.
- **Phases that reference each other's internals.** The implementing agent sees one phase body and the
  bounded context — not the plan.
