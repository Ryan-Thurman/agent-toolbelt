# Auto-tiering & the token guardrail

When the user does **not** pass `--tier`, pick the tier from the change itself instead of always
defaulting to light. The benchmark (`benchmarks/results.md`) says **standard is the sweet spot** for
normal PRs, **light** for trivial diffs, **deep** only when a wrong/missed blocker is expensive — so
auto-selection routes by *risk and size*, and a **guardrail** stops deep from burning ~8× tokens on a
change that can't justify it.

Explicit `--tier=<x>` always wins. Auto-selection only fills the default, and the guardrail only
*warns* on an explicit choice (it never overrides one without consent).

## Signals (compute once, from the frozen diff)

```bash
files=$(git diff "$base" --name-only | wc -l)
added=$(git diff "$base" --numstat | awk '{a+=$1} END{print a+0}')   # added lines (all paths)
paths=$(git diff "$base" --name-only)
# production-source subset: the same two counts restricted to paths NOT matching the
# low-risk globs below (docs/tests/config/lockfiles/snapshots) → prod_files, prod_added
```

- **size** — `prod_files` changed and `prod_added` lines, i.e. **production source only**. Tests,
  docs, and lockfiles count toward risk *classification* (low-risk-only) but not toward size: a
  phase-sized PR that bundles implementation + tests + docs should be sized by its logic mass, not
  its total churn — 250 production lines with 300 lines of tests/docs is not a "large" diff.
- **hot-path hit** — any changed path matching the risk globs:
  `auth login session security payment billing crypto token secret password permission acl`
  `*/migrations/* *.sql */api/* */routes/* */middleware/*`, or a change to an **existing
  public/exported surface** — modifying or removing an exported function's signature, contract, or
  observable behavior. Merely *adding* a new exported helper is not a hot-path hit (that's routine
  feature work — the production-logic floor already holds it at standard); the trigger is breaking
  or bending a surface someone may already depend on.
- **low-risk-only** — every changed path is docs/config/test/lockfile:
  `*.md *.mdx docs/* *.txt LICENSE* *.lock package-lock.json *.snap` and `*test* *spec* __tests__/*`
  with no production source touched.
- **logic-bearing production** — any production source hunk that changes a branch/condition, loop,
  arithmetic, parsing/validation, error handling, data write, public/exported function, route/API
  handler, or call into an external system. Size does not make these safe; tiny logic diffs are where
  light has the least context for severity calibration.

## Default tier selection (no `--tier`)

First matching rule wins, top to bottom:

| # | Condition | Tier |
|---|---|---|
| 1 | low-risk-only (docs/test/config) **and** no hot-path hit | **light** |
| 2 | tiny mechanical/non-production: `added ≤ 15`, `files ≤ 2`, no hot-path hit, **and no logic-bearing production hunk** | **light** |
| 3 | hot-path hit (security/auth/payment/migration/public API) | **deep** |
| 4 | large: `prod_added > 400` **or** `prod_files > 20` (production source only) | **deep** |
| 5 | everything else (the common case) | **standard** |

State the choice and the trigger in the report header, and when the raw and production counts
diverge, show both so the sizing is auditable, e.g. `tier: standard (auto — 610 added lines, 190
production; no hot paths)` — auto-selection is never silent, so the user can correct it.

**Production-logic floor.** A production logic change floors auto-tier at **standard**, even when it
is tiny. Light remains for docs/tests/config and mechanical edits where a single pass is enough.

**Minimum-tier floor.** If the repo config (`repo-config.md`) sets a **Minimum tier**, the
auto-selected tier is **raised to the floor** (never dropped below it): e.g. a repo with floor
`standard` won't auto-pick light for a tiny diff. Note it: `tier: standard (auto — tiny diff, raised
to repo floor)`. An explicit `--tier` below the floor is honored but warned (see Precedence in
`repo-config.md`).

## The token guardrail (refuse waste)

Deep costs ~8× light. Refuse to spend that on a change that can't pay it back:

- **Guardrail trip** = tier resolves to / is forced to **deep** while the diff is **trivial** (rule 1
  or 2 above: low-risk-only, or tiny mechanical/non-production with no hot-path hit).
- On a trip:
  - **Auto-selected deep** can't happen (rules 1–2 select light first) — so a trip only comes from an
    **explicit `--tier=deep`** on a trivial diff.
  - On explicit deep + trivial: **warn and ask** —
    > ⚠️ Guardrail: `--tier=deep` (~8× tokens) on a trivial diff (N added lines, no hot paths). Deep
    > buys *severity calibration*, which needs findings to calibrate; this diff is unlikely to have
    > any. Recommend **light**. Run deep anyway?
    Proceed with deep only on a clear yes; otherwise drop to light. Don't silently override an explicit
    flag — surface the cost and let the user decide.
- Symmetric nudge (advisory, no prompt): if auto picks **light** but the diff **hot-path-hits**, you
  shouldn't be here (rule 3 catches it first) — but if the user *forced* `--tier=light` on a hot-path
  change, add a one-line note: `note: hot-path change reviewed at light — consider standard/deep`.

## Frequency / churn awareness (optional)

"Refuses deep fan-out on frequent changes": if the rejection memory or recent run log
shows this same diff/branch was already deep-reviewed at the current HEAD with no new commits since,
don't re-run deep — say "already deep-reviewed at <sha>; re-run with `--tier=standard` to refresh, or
push changes first." Cheap guard against re-deep-reviewing an unchanged branch. Skip if no run history
exists.

## Interaction with the other features

- Auto-tier runs **before** fan-out, on the same frozen diff snapshot (`fan-out.md` §0).
- The chosen tier still flows normally into light / standard / deep orchestration.
- `--comment` and the rejection memory are tier-independent — they apply at whatever tier was selected.
