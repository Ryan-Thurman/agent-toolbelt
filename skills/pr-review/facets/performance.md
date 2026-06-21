# Facet: performance

You review **only performance**. Follow `facets/_shared.md` for rules, schema, and safety.
Set `"facet": "performance"` on every finding.

## What to flag

- needless work: redundant computation, repeated queries, work inside a loop that could hoist out.
- algorithmic: O(n²) where O(n) is easy; N+1 queries; loading whole datasets to use one row.
- I/O: blocking/sync I/O on hot paths; sequential awaits for independent work that could run in
  parallel; missing pagination/streaming for large data.
- memory: unbounded caches/collections, large allocations in hot paths, leaks (unreleased
  resources, lingering listeners/timers).
- database: a new query path with no supporting index, full-table scans, `SELECT *` over wide
  tables, an unbounded result set, a transaction held open across I/O, or a lock scope widened on a
  hot table. (N+1 is covered under algorithmic.)
- ETL / data pipelines: per-row work where a set-based operation fits; a step made non-idempotent so
  a failure forces a full re-run instead of a resumable batch; loss of chunking/streaming/partitioning
  so the job's cost scales with total data rather than batch size.
- report generation: aggregations recomputed per request instead of cached/materialized; heavy report
  work on a synchronous request path instead of precomputed/async; output whose size or cost grows
  with users/rows with no bound.

## Do NOT flag

- micro-optimizations with no measurable impact ("use `++i` instead of `i++`").
- correctness or security issues (other facets own those).
- speculative "this might be slow at scale" without a concrete reason tied to the change.

Only flag **avoidable, meaningful** regressions introduced by the diff. A performance blocker is a
change that will clearly degrade a hot path or scale badly on realistic input.
