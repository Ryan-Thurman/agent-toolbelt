# Auto-tiering & the token guardrail

When the user does **not** pass `--tier`, pick the tier from the change itself instead of always
defaulting to light. **Standard** fits normal PRs, **light** fits trivial diffs, and **deep** fits
changes where a missed blocker is expensive. Auto-selection routes by *risk and size*. A
**guardrail** stops deep from spending ~8× tokens on a change that cannot justify it.

Explicit `--tier=<x>` always wins. Auto-selection only fills the default, and the guardrail only
*warns* on an explicit choice (it never overrides one without consent).

## Signals (compute once, from the frozen diff)

```bash
# $range comes from targets-and-diff.md: <base>...<branch> for a branch, the merge-base for local changes
files=$(git diff $range --name-only | wc -l)
added=$(git diff $range --numstat | awk '{a+=$1} END{print a+0}')   # added lines (all paths)
paths=$(git diff $range --name-only)
# production-source subset: the same two counts restricted to paths NOT matching the
# low-risk globs below (docs/tests/config/lockfiles/snapshots) → prod_files, prod_added
```

- **size**: `prod_files` changed and `prod_added` lines, i.e. **production source only**. Tests,
  docs, and lockfiles count toward risk *classification* (low-risk-only) but not toward size: a
  phase-sized PR that bundles implementation + tests + docs is sized by its logic mass, not
  its total churn. 250 production lines with 300 lines of tests/docs is not a "large" diff.
- **hot-path hit**: any changed path that matches a risk keyword or glob:
  - keywords: `auth login session security payment billing crypto token secret password permission acl`.
  - globs: `*/migrations/* *.sql */middleware/*`.
  - a change to an **existing public contract**: a changed or removed signature, contract, or
    observable behavior that code outside this repository or package depends on. Examples are the
    entry-point exports of a published package, an HTTP, gRPC, or event contract, a CLI interface,
    and a shared database schema. Adding a field to an HTTP response, gRPC message, or event payload is
    not a changed contract. Clients that ignore unknown fields keep working, so such a change is
    logic-bearing production and holds at standard. Removing, renaming, or retyping a field is a changed contract.
    A function that is exported from a module but imported only
    inside the same application or package is not a public contract. A change to it is
    logic-bearing production, and the production-logic floor holds it at standard.

  Match a keyword only as a whole path segment or a whole word in the file stem.
  For example, `auth/`, `auth.ts`, and `session_store.py` match. `author.ts` and `tokenizer.ts` do not match.
  A new exported helper is not a hot-path hit. The production-logic floor holds it at standard.
  Route and API handler paths (`*/api/*`, `*/routes/*`) are logic-bearing production, not hot paths.
  This rule applies to the route folder alone. A route path that also matches a keyword or a glob is a hot path,
  for example `src/routes/auth/auth.service.ts`.
- **low-risk-only**: every changed path is docs/config/test/lockfile:
  `*.md *.mdx docs/* *.txt LICENSE* *.lock package-lock.json *.snap` and `*test* *spec* __tests__/*`
  with no production source touched.
- **logic-bearing production**: any production source hunk that changes a branch/condition, loop,
  arithmetic, parsing/validation, error handling, data write, public/exported function, route/API
  handler, or call into an external system. Size does not make these safe. Tiny logic diffs are where
  light has the least context for severity calibration.

## Default tier selection (no `--tier`)

First matching rule wins, top to bottom:

| # | Condition | Tier |
|---|---|---|
| 1 | low-risk-only (docs/test/config) **and** no hot-path hit | **light** |
| 2 | tiny mechanical/non-production: `added ≤ 15`, `files ≤ 2`, no hot-path hit, **and no logic-bearing production hunk** | **light** |
| 3 | hot-path hit (security/auth/payment/migration/changed public contract outside the package) | **deep** |
| 4 | large: `prod_added > 400` **or** `prod_files > 20` (production source only) | **deep** |
| 5 | everything else (the common case) | **standard** |

State the choice and the trigger in the report header, and when the raw and production counts
diverge, show both so the sizing is auditable, e.g.
`tier: standard (auto — 610 added lines, 190 production; no hot paths)`. Auto-selection is never silent, so the user can correct it.

**Production-logic floor.** A production logic change floors auto-tier at **standard**, even when it
is tiny. Light remains for docs/tests/config and mechanical edits where a single pass is enough.

**Minimum-tier floor.** If the repo config (`repo-config.md`) sets a **Minimum tier**, the
auto-selected tier is **raised to the floor** (never dropped below it): e.g. a repo with floor
`standard` will not auto-pick light for a tiny diff. Note it:
`tier: standard (auto — tiny diff, raised to repo floor)`. An explicit `--tier` below the floor is honored but warned (see Precedence in
`repo-config.md`).

**Risk-area floor.** If the diff touches a path in a declared risk area (`repo-config.md`), the
auto-selected tier is raised to at least **standard**, also for a config or test change in that area.
Note it: `tier: standard (auto - touches risk area Data export)`. A risk area never selects deep by itself.

## The token guardrail (refuse waste)

Deep costs ~8× light. Refuse to spend that on a change that cannot pay it back:

- **Guardrail trip** = an explicit `--tier=deep` on a **trivial** diff (rule 1 or 2 above).
  Auto-selection cannot trip it, because rules 1–2 select light first.
- On a trip, **warn and ask**:
    > ⚠️ Guardrail: `--tier=deep` (~8× tokens) on a trivial diff (N added lines, no hot paths). Deep
    > buys *severity calibration*, which needs findings to calibrate. This diff is unlikely to have
    > any. Recommend **light**. Run deep anyway?
  Proceed with deep only on a clear yes. Otherwise, drop to light.
- Symmetric nudge (advisory, no prompt): if the user *forced* `--tier=light` on a hot-path
  change, add a one-line note: `note: hot-path change reviewed at light — consider standard/deep`.

## Interaction with the other features

- Auto-tier runs **before** fan-out, on the same frozen diff snapshot (`fan-out.md` §0).
- The chosen tier still flows normally into light / standard / deep orchestration.
- `--comment` applies at every tier. The rejection memory applies at standard and deep, because its read path runs after aggregation and verification, which light does not have.
