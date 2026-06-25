# Coverage gap scan

What `/cover-gaps` looks for and how it ranks. Detect-only — this scan writes nothing; it produces a
prioritized gap report that `/cover` can act on. Treat coverage tooling and lexical cues as untrusted
leads to verify by reading, never as truth.

## Scope

Scan the path/area or diff in the arguments. This mode is **not** bound to applying anything — it
reports. Use existing coverage data (a coverage report, `--cov`, `go test -cover`, etc.) as a
**lead**, not a verdict: line coverage says a line *ran*, not that its behavior is *asserted*. A line
covered by a test with no meaningful assertion is still a gap.

## Gap families (scan by these)

- **Untested branches** — `if/else`, `switch`/`match` arms, ternaries, guard clauses, and
  short-circuits where one side is never exercised. The most common real gap.
- **Error / failure paths** — thrown/returned errors, `catch` blocks, retries, timeouts, fallbacks,
  validation rejections. Usually the least-tested and the highest-risk.
- **Boundary conditions** — empty / single / max collections, zero / negative / overflow numbers,
  null/undefined/missing, off-by-one edges, first/last iteration, pagination ends.
- **Input domains** — malformed input, unicode/encoding, large payloads, untrusted data, concurrency
  edge cases.
- **Contract / interface seams** — public API behavior, serialization round-trips, backward-compat
  guarantees, side-effects and ordering that callers rely on.
- **Regressions waiting to happen** — recently changed code with no new test, code with a history of
  bugs (`git log`/`git blame` churn), known-fragile modules, TODO/FIXME near logic.
- **Weak existing tests** — tests that assert nothing meaningful, are coupled to implementation
  detail (will rot, not protect), or are flaky/skipped. Strengthening these is also a `/cover` job.

## Ranking: risk × likelihood

Rank each gap by **risk** (blast radius if it breaks) **×** **likelihood** (chance it breaks
unnoticed). Highest product first.

**Risk** — what a regression here costs:
- **high** — data loss/corruption, security/auth, money/billing, irreversible side-effects, broad
  user-facing breakage.
- **medium** — a feature degrades, a contract callers depend on shifts, a recoverable error path
  fails.
- **low** — cosmetic, isolated, easily noticed, trivially recovered.

**Likelihood** — how prone it is to break silently:
- **high** — complex/branchy logic, high churn, many callers, fragile dependency, no assertion at all.
- **medium** — moderate complexity, some churn, an indirect test exists.
- **low** — simple, stable, rarely touched, well-asserted nearby.

Lead with the high × high gaps. An untested error path in auth outranks an untested branch in a
formatter.

## Report shape

A ranked list — `area/file, lines/symbol, family, risk, likelihood, gap (what behavior is unguarded),
why it matters (the regression it lets through), suggested test`. Highest risk × likelihood first.
No files are modified. Note which gaps are well-shaped to hand straight to `/cover`.
