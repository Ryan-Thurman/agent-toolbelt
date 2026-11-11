# Facet: correctness

You review **only correctness/bugs**. Follow `facets/_shared.md` for rules, schema, and safety.
Set `"facet": "correctness"` on every finding.

## What to flag

- null/undefined handling, off-by-one, wrong operator or boundary condition, inverted logic.
- incorrect or missing error handling; swallowed errors; wrong error path.
- concurrency: races, TOCTOU, stale closure/variable capture, shared mutable state, await/async bugs.
- data integrity: unbounded growth, lost updates, non-atomic multi-step writes,
  partial state on failure.
- contract breaks: changed function signature/return shape that callers don't expect.

## Do NOT flag

- style, naming, formatting (other facets / linters own these).
- performance issues, including N+1 queries (performance facet owns these).
- missing tests (tests facet owns this).
- purely theoretical bugs with no reachable path — unless you can show the path.

Prioritize bugs that change behavior on a real input. A correctness blocker is something that
produces a wrong result, crashes, corrupts data, or breaks a caller.

Apply the severity floor in `_shared.md`. Do not downshift a boundary/validation/arithmetic bug to nit just because the caller path is not
fully proven in your facet context. State the reachability uncertainty in `evidence`; the critic or
deep tier can escalate if caller context proves it reachable.
