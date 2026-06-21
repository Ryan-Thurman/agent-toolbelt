# sql / migrations checklist

Language-specific lenses, injected per-facet (`../references/lang-checklists.md`). Weighs heavily for
a system targeting scale (pairs with a `.pr-review.md` perf budget, `repo-config.md`). An item is a
place to *look*, not a finding to emit verbatim.

## correctness
- migration with no rollback / `down` path; a destructive change (`DROP`/`ALTER ... DROP`) with no backfill.
- `NOT NULL` column added without a default or backfill — fails on existing rows.
- nullable join/filter columns silently dropping rows; `NULL` semantics in `NOT IN (...)`.

## security
- string-concatenated SQL (injection) instead of bound parameters.
- broad `GRANT` / a migration widening permissions; secrets or PII in seed data.

## performance
- a new query path with **no supporting index** on its filter/join/sort columns; full-table scan.
- `SELECT *` over wide tables; unbounded result set with no `LIMIT`/pagination.
- index added on a hot table **without `CONCURRENTLY`** (Postgres) — locks writes during the migration.
- a transaction held open across application I/O; lock scope widened on a hot table.
- N+1-inducing schema (no covering index for the access pattern); function on an indexed column in `WHERE` (kills the index).

## maintainability
- business logic pushed into a trigger/stored-proc where the app layer is the canonical home (or vice-versa).
- a migration that mixes schema change + large data backfill in one step (should be split/batched).
