# The agent-runner plan format

`agent-runner` executes a markdown plan: one phase per PR, driven through `IMPLEMENT → REVIEW → FIX →
CLOSE_PHASE → MERGE`. The plan is **parsed by regex**, so this is a serialization contract, not a
style guide. Get a heading wrong and the phase does not exist.

The format of record is `agent_runner/plan.py`. When it and this file disagree, it wins.

Draft a plan with **`/auto-agent-plan`**, which mines the repo rather than starting from a blank page.

---

## The contract

### Phase headings

```markdown
## Phase 1: Reconcile manually merged phase PRs
```

Matched by `PHASE_HEADING_RE = ^## Phase\s+(\d+):\s*(.+?)\s*$`. The number is digits, the title is
non-empty. `### Phase 1` does not match. `## Phase One` does not match.

### The status line

```markdown
Status: PENDING
```

**The plan author writes `PENDING` and nothing else.** The runner owns this line thereafter, moving it
through `IMPLEMENTING → REVIEWING → CLOSING → MERGING → COMPLETE`, or `BLOCKED`.

### Never write an `Evidence:` line

`Evidence:` is **runner-owned metadata**, written by the closer agent when a phase completes. A plan
author who writes one is writing in a field that will be overwritten.

This matters more than it looks. The runner hashes each phase body to detect a closer that tampered
with the plan's intent, and it **excludes** the `Status:` line and the contiguous block after
`Evidence:` from that hash — precisely so closeout can rewrite them without tripping the check. Write
prose there and you have written into a region with unusual rules.

### The phase body is protected

Everything between the heading and the next heading (minus the runner-owned lines above) is hashed.
The closer must not change it. So **write the body to be stable**: no status-ish prose, no "we'll
decide this later", nothing a closer would feel obliged to update on its way past.

### Plan-level context is bounded at 4000 characters

Markdown **before the first phase heading** is shared plan-level context. The runner injects a
deterministic 4000-character bounded copy into the IMPLEMENT, REVIEW, FIX, and CLOSE_PHASE prompts —
as **data that cannot override runner safety or scope rules**.

Two consequences:

- **Front-load it.** Past the bound the copy is cut and a `[plan context truncated]` marker appended
  (`PLAN_CONTEXT_CHAR_LIMIT = 4000`). The truncation is loud — the agents can see it happened — but
  they still can't see what was cut. Put the repo orientation and the standing rules first; put
  nice-to-know last.
- **It is not a channel for instructions to the runner.** It is context for the agents, and it is
  treated as untrusted.

### Phase numbers must be unique

A duplicate `## Phase 2:` raises `PlanError` at registration. Numbering is the ordering.

---

## What makes a phase executable

The format is the easy part. These are the rules that decide whether the loop actually lands.

**Every phase must have runnable acceptance criteria.** `checks` in `.agent-runner.json` is the
acceptance gate — a list of commands that must exit zero. A phase whose acceptance is "the UI feels
better" cannot pass a check, so it will reach the reviewer, fail, spawn fixes, exhaust the budget, and
block at 2am. **Do not emit a phase without a check that proves it.** This is the single highest-value
thing a planning agent does, because it is the one thing the runner cannot discover for itself.

**Each phase becomes one PR onto `baseBranch`.** So phases are ordered, and each must be
independently mergeable — a phase that only compiles once phase N+2 lands will block on its own
checks. If two pieces of work cannot be merged separately, they are one phase.

**Scope each phase tightly, and say so.** The implementing agent sees the phase body and the bounded
context, not the whole plan. Add the standing instruction — *do not start future phases* — to the
plan-level context, where every prompt gets it.

**State the review contract in the context block, once.** Reviews in this loop are not advisory. The
reviewer reports every update it wants, bucketed (`blocking` / `shouldFix` / `nitpick`); `PASS` means
every bucket is empty. See `references/convergence.md` for what the orchestrator does with those
buckets on round two.

---

## The config

`.agent-runner.json` at the repo root. Minimum shape:

```json
{
  "planPath": "docs/plan.md",
  "baseBranch": "main",
  "mergeOnClose": true,
  "mergeStrategy": "squash",
  "checks": ["python3 -m unittest discover -s tests"],
  "planVerify": [],
  "agents": { "…": "see references/invocation.md for flag semantics" },
  "roles": { "coder": "codex", "reviewer": "claude-opus", "closer": "codex" }
}
```

`checks` is load-bearing twice over: it gates every phase, **and** the leading command of each check
is what gets added to the write role's `Bash(...)` allowlist. A check the allowlist doesn't cover
kills the coder (`references/invocation.md` §3).

`planVerify` is separate and optional: commands `plan-validate` runs against the plan itself, from the
repo root, before any phase executes. Use it for whatever proves the plan is coherent in *this* repo —
a linter over the phase bodies, a check that each named file exists. It does not gate phases.

Generate a starting config with `agent-runner init`, then edit. Don't hand-write the `agents` block —
the flag semantics are unforgiving and the generated one is correct.

---

## Validating a plan

Validate with the runner. It uses the same parser that will execute the plan, so it cannot drift from
the format:

```bash
agent-runner plan-validate                    # alias: plan-verify
agent-runner plan-validate --plan docs/other-plan.md
agent-runner plan-validate --verify 'python3 -m unittest discover -s tests'
```

It parses the plan, runs structural validation, and **does not register phases or run anything**. Then
it runs the `planVerify` commands from `.agent-runner.json` (plus any repeated `--verify` one-shot),
from the repo root. No `planVerify` configured → structural validation only, and it says so.

Never reimplement `plan.py`'s regexes to check a plan yourself. Call this.

### What it catches, and the one thing it doesn't

Structural validation rejects a plan with **no phases at all** and any phase **missing its `Status:`
marker**. `parse_plan_file` separately rejects **duplicate phase numbers**.

It cannot catch a *partially* malformed plan. `### Phase 2:` or `## Phase Two:` doesn't match
`PHASE_HEADING_RE`, so it is not a phase — it is prose inside the phase above it. With three good
headings and one bad, the plan parses to three phases and validates clean. The runner then
"completes" with the work undone.

So read the count it prints back:

```
[agent-runner] plan parsed: docs/plan.md with 6 phase(s)
```

**Six is the number you have to recognise.** If you wrote seven phases, one of them is not a phase.

Two things the runner has no opinion on, worth a glance before the first run:

```bash
grep -nE '^Evidence: ' docs/plan.md   # nothing, on a plan that has not run yet
awk '/^## Phase /{exit} {n+=length($0)+1} END{print n " chars of plan context (bound: 4000)"}' docs/plan.md
```

`Evidence:` lines are expected on a plan that has already run — the closer writes them. They appear in
a plan you are *authoring* only if you wrote one by mistake.

---

## A worked phase

```markdown
## Phase 1: Reconcile manually merged phase PRs
Status: PENDING

Teach `agent-runner run` to repair stale SQLite state when a phase PR was merged
outside the runner but the tracked plan and GitHub PR prove the phase is complete.

- After plan registration and orphan reap, before `run_phase_loop`, inspect phases
  in the active plan that are not `COMPLETE` and have PR metadata.
- Query `gh pr view <url>` for merge state, head SHA, and merge commit.
- If the PR is merged, verify the local base branch contains the merge commit, or
  fetch the base branch, before deciding.
- If the PR is merged but the plan marker or hash does not prove completion, block
  with a clear message instead of guessing.

Acceptance Criteria:
- `python3 -m unittest discover -s tests` passes, including a new test that a
  hand-merged PR with a matching plan hash reconciles to `COMPLETE`.
- A hand-merged PR whose plan hash does not match blocks with a named reason.
```

Note what the body does *not* contain: no `Evidence:` line, no status prose, no reference to phases 2
or 3, and an acceptance criterion that a command can decide.
