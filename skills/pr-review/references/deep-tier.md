# Deep-tier orchestration

Extends the standard fan-out (`fan-out.md`) — read that first; this only adds the deep upgrades. The
deep tier is the "reach for the thermo-nuclear bar" tier: maximum coverage + adversarial
verification. It costs about 8× a light review.

## 0. Setup (as standard) + deep presteps

- Resolve target, **freeze the diff snapshot once** (identical input to all sub-agents — see
  `fan-out.md`), load project standards, and load the **per-repo config** `.pr-review.md` from the
  base branch (`repo-config.md`) — its Context/Budgets feed every facet; Always-run/Emphasis/Min-tier
  and the host-side overrides apply as in standard.
- **0a. Blast-radius map.** For each exported/public symbol the diff changes, grep importers and
  matching test files; produce a short impact map (changed symbol → who depends on it → which tests
  cover it). Pass this to every facet so they reason about ripple effects, not just the hunk.
  When rct graph tools are in the tool list, build the map with `rct-acceleration.md`.

## 1. Select facets (deep = everything)

Run **all** facets: correctness, security, performance, tests, standards, and **maintainability via
`facets/maintainability-deep.md`** (thermo-nuclear bar). Add **spec-alignment**
(`facets/spec-alignment.md`) when supplied intent (spec, issue, ticket, or design doc) includes
checkable acceptance criteria. (Deep already runs
everything, so repo **Always run** is a no-op here; **Emphasis**/`--focus` still tell a facet to go
deeper and lower its threshold.)

## 2. Spawn facet sub-agents in parallel

Same as standard, but each prompt also carries the **blast-radius map** so facets reason about ripple
effects, not just the hunk. Each returns its JSON findings array.

## 3. Aggregate + dedup

As standard.

## 4. Dual-judge verification (replaces the single critic)

Run the two-judge + tiebreaker procedure in `dual-judge.md`: each judge re-reads cited code, falsify
-don't-verify, reconcile, **re-location repair** for line drift. This is the deep tier's precision
mechanism. When the judges **refute** a finding (false / no real consequence — not stale), record it
to the rejection memory (`rejection-memory.md`), same as the standard critic does.

## 5. Requirements / spec coverage

When intent supplies acceptance criteria, render the "Acceptance coverage" table from
`output-format.md`. Otherwise skip.

## 6. Re-entry notes, repo-config overrides, rejection memory, threshold, verdict, render

As standard (`fan-out.md` §5–8): synthesize re-entry notes, **apply the repo-config overrides**
(severity overrides + do-not-flag, host-side, `repo-config.md`), **apply the rejection memory**
(downrank + tag previously-rejected findings, `rejection-memory.md`), threshold, derive the verdict,
render — including the audit footers. With `--benchmark`, the token footer (`benchmarking.md`)
includes facet, dual-judge, and tiebreaker tokens. If `--comment` was passed, post inline per `posting.md`.

## Failure handling

Same as standard — retain completed results, identify a failed facet/judge,
and apply the coverage/limits verdict rules in `output-format.md`.
