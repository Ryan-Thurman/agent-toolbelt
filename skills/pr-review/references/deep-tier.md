# Deep-tier orchestration

Extends the standard fan-out (`fan-out.md`) — read that first; this only adds the deep upgrades. The
deep tier is the "reach for the thermo-nuclear bar" tier: maximum coverage + adversarial
verification. It is expensive — see `benchmarks/results.md` for whether the extra cost pays off.

## 0. Setup (as standard) + deep presteps

- Resolve target, **freeze the diff snapshot once** (identical input to all sub-agents — see
  `fan-out.md`), load project standards, and load the **per-repo config** `.pr-review.md` from the
  base branch (`repo-config.md`) — its Context/Budgets feed every facet; Always-run/Emphasis/Min-tier
  and the host-side overrides apply as in standard.
- **0a. Blast-radius map.** For each exported/public symbol the diff changes, grep importers and
  matching test files; produce a short impact map (changed symbol → who depends on it → which tests
  cover it). Pass this to every facet so they reason about ripple effects, not just the hunk.

## 1. Select facets (deep = everything)

Run **all** facets: correctness, security, performance, tests, standards, and **maintainability via
`facets/maintainability-deep.md`** (thermo-nuclear bar). Add **spec-alignment**
(`facets/spec-alignment.md`) when a spec / issue / design doc is linked. (Deep already runs
everything, so repo **Always run** is a no-op here; **Emphasis**/`--focus` still tell a facet to go
deeper and lower its threshold.)

## 2. Spawn facet sub-agents in parallel

Same as standard, but each prompt also carries the **blast-radius map** so facets reason about ripple
effects, not just the hunk. Each returns its JSON findings array.

## 3. Aggregate + dedup

As standard. (Optional, budget-permitting: run the facet pass **twice** and keep findings a majority
of passes agree on, deduping by line + token-similarity — the dreki multi-pass-vote pattern. Skip
unless you specifically want variance-hardening; it multiplies cost.)

## 4. Dual-judge verification (replaces the single critic)

Run the two-judge + tiebreaker procedure in `dual-judge.md`: each judge re-reads cited code, falsify
-don't-verify, reconcile, **re-location repair** for line drift. This is the deep tier's precision
mechanism. When the judges **refute** a finding (false / no real consequence — not stale), record it
to the rejection memory (`rejection-memory.md`), same as the standard critic does.

## 5. Requirements / spec coverage

If spec-alignment ran, render its coverage assessment as a table (requirement → met/partial/missing/
extra → file:line). Otherwise skip.

## 6. Re-entry notes, repo-config overrides, rejection memory, threshold, verdict, render

As standard (`fan-out.md` §5–8): synthesize re-entry notes, **apply the repo-config overrides**
(severity overrides + do-not-flag, host-side, `repo-config.md`), **apply the rejection memory**
(downrank + tag previously-rejected findings, `rejection-memory.md`), threshold, derive the verdict,
render — including the `repo-config:` and `memory:` audit footers. Add the **token-usage footer**
(`output-format.md`), which for deep includes facet tokens + scan + dual-judge + tiebreaker, so the
deep cost is explicit in every run. If `--comment` was passed, post inline per `posting.md`.

## Failure handling

Same as standard — isolate a failed facet/judge, note it, proceed.
