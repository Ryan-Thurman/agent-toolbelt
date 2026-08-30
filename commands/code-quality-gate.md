---
description: Run the mandatory pre-PR quality gate: repository checks plus anti-slop, simplification, standards, and maintainability evidence
argument-hint: "[--mode=report|apply] [--rounds N] [--scope path[,path]] [--disposition-json '<object>']"
---

# /code-quality-gate

Run the `code-quality-gate` orchestration for the current checked-out branch
and local working tree. It is the pre-PR quality verdict, not a replacement for
`/simplify` or `/pr-review`.

**Arguments:** `$ARGUMENTS`

Modes:

- `--mode=report` (default) assesses and writes generated evidence only; it
  does not edit tracked files.
- `--mode=apply` permits bounded rereviews and only unambiguous,
  evidence-backed, behavior-preserving in-scope fixes. Use it only when this
  request already authorizes implementation edits or you explicitly want fixes
  applied; a behavior change or structural tradeoff needs a recorded human
  choice.

`--rounds N` defaults to `3`. `--scope` narrows the frozen scope and produces
`coverage: partial`; it cannot satisfy Dev Lite readiness. Scope entries must
resolve to repository-relative paths within this worktree: reject absolute paths
and any `..` escape. Omit it for final coverage of every changed and untracked path.

Record a decision with repeatable, parseable JSON:

```text
--disposition-json '{"id":"QG-12","state":"deferred","reason":"Follow after release","owner":"frontend","follow_up":"PROJ-123"}'
```

Allowed states are `accepted`, `rejected`, and `deferred`. An accepted finding
remains open until its fix is verified. Rejection needs `reason` and `evidence`.
Deferral is only for a low-impact nit and needs `reason`, `owner`, and
`follow_up`.

Follow `skills/code-quality-gate/SKILL.md` and its
`references/gate-contract.md`. Freeze the diff before assessment; derive the
repository's required checks; inspect every changed hunk; run `/simplify` in
report mode; and run `/pr-review` with standards and maintainability focused.
In apply mode, reuse `/pr-improve` for the frozen-scope ledger and bounded
fix/rereview loop.

Write current evidence to `.atb-work/code-quality-gate/<target-slug>/report.md`.
Use `bash skills/code-quality-gate/scripts/fingerprint.sh` to record and later verify the reviewed head and
scope fingerprints. End with exactly one status: `PASS`, `FAIL`, `CAPPED`, or
`BLOCKED`. PASS needs green required checks, an intact frozen scope, no
unresolved blocker or should-fix finding, verified fixes for accepted findings,
no unresolved evidence-backed naming/anti-slop/standards/maintainability issue,
and an explicit disposition for every nit. Never commit, push, or infer AI
authorship.

The gated change is the current branch's committed changes since merge-base,
plus staged, unstaged, and untracked changes. Derive `<target-slug>` from that
current branch/local context. For a named PR, remote branch, or another local
branch, use `/pr-review`; check out the intended branch before running this gate.
