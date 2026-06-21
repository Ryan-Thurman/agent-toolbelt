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
added=$(git diff "$base" --numstat | awk '{a+=$1} END{print a+0}')   # added lines
paths=$(git diff "$base" --name-only)
```

- **size** — `files` changed and `added` lines.
- **hot-path hit** — any changed path matching the risk globs:
  `auth login session security payment billing crypto token secret password permission acl`
  `*/migrations/* *.sql */api/* */routes/* */middleware/*` and **public API / exported surface**.
- **low-risk-only** — every changed path is docs/config/test/lockfile:
  `*.md *.mdx docs/* *.txt LICENSE* *.lock package-lock.json *.snap` and `*test* *spec* __tests__/*`
  with no production source touched.

## Default tier selection (no `--tier`)

First matching rule wins, top to bottom:

| # | Condition | Tier |
|---|---|---|
| 1 | low-risk-only (docs/test/config) **and** no hot-path hit | **light** |
| 2 | tiny: `added ≤ 15` **and** `files ≤ 2` **and** no hot-path hit | **light** |
| 3 | hot-path hit (security/auth/payment/migration/public API) | **deep** |
| 4 | large: `added > 400` **or** `files > 20` | **deep** |
| 5 | everything else (the common case) | **standard** |

State the choice and the trigger in the report header, e.g. `tier: standard (auto — 7 files, 180
added lines, no hot paths)` — auto-selection is never silent, so the user can correct it.

**Minimum-tier floor.** If the repo config (`repo-config.md`) sets a **Minimum tier**, the
auto-selected tier is **raised to the floor** (never dropped below it): e.g. a repo with floor
`standard` won't auto-pick light for a tiny diff. Note it: `tier: standard (auto — tiny diff, raised
to repo floor)`. An explicit `--tier` below the floor is honored but warned (see Precedence in
`repo-config.md`).

## The token guardrail (refuse waste)

Deep costs ~8× light. Refuse to spend that on a change that can't pay it back:

- **Guardrail trip** = tier resolves to / is forced to **deep** while the diff is **trivial** (rule 1
  or 2 above: low-risk-only, or `added ≤ 15` and no hot-path hit).
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
