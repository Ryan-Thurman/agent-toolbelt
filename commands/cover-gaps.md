---
description: Scan a diff or area for missing or weak test coverage — untested branches, error paths, boundary conditions, and regressions waiting to happen — ranked by risk × likelihood. Detect-only: writes no tests. Use to survey coverage before authoring tests with /cover.
argument-hint: "<path-or-area> [focus] (or a diff)"
---

# /cover-gaps

Survey an area for missing and weak test coverage using the `cover` skill. This is the
**detect-only** mode: it produces a prioritized gap report, it never writes a test.

> **When to use vs related:** `/cover-gaps` scans an area and ranks coverage gaps but writes nothing.
> Use `/cover` to actually author the tests, or `/pr-review` for a changed-lines review with a
> verdict. Hand the top gaps from this report straight to `/cover`.

**Arguments:** `$ARGUMENTS`

## Rules

- Read the skill's `references/gap-scan.md`. **Detect-only — do not write or edit any test or file.**
- Treat coverage tooling and lexical cues as leads to verify by reading, not as truth. Line coverage
  means a line *ran*, not that its behavior is *asserted* — a covered-but-unasserted line is a gap.
- One cause-effect chain per gap: `gap → why it matters (the regression it lets through) → suggested
  test`. No subjective nits; don't recommend a giant test-suite rewrite when a small first slice is
  clear.

## Steps

1. **Scope** to the path, area, or diff in the arguments (not bound to applying anything).
2. **Scan** by family: untested branches, error/failure paths, boundary conditions, input domains,
   contract/interface seams, regressions waiting to happen, and weak existing tests.
3. **Rank** each gap by `risk` (blast radius if it breaks) × `likelihood` (chance it breaks
   unnoticed), highest product first.
4. **Report** the ranked gaps with evidence (file/symbol/branch) and a suggested test for each. Note
   which gaps are well-shaped to hand to `/cover`.

## Output

A ranked gap list — `area/file, lines/symbol, family, risk, likelihood, gap, why it matters,
suggested test` — highest risk × likelihood first. No files are modified. Flag the gaps ready to
route to `/cover`.
