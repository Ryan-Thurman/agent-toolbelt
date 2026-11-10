# Deep-tier orchestration

Extends the standard fan-out (`fan-out.md`) — read that first; this only adds the deep upgrades. The
deep tier is the "reach for the thermo-nuclear bar" tier: maximum coverage + adversarial
verification. It costs about 8× a light review.

## 0. Setup and blast-radius map

- Run the standard setup in `fan-out.md` §0, including the frozen diff and the repo config.
- **Blast-radius map.** For each exported/public symbol the diff changes, grep importers and
  matching test files; produce a short impact map (changed symbol → who depends on it → which tests
  cover it). Pass this to every facet so they reason about ripple effects, not just the hunk.
  When rct graph tools are in the tool list, build the map with `rct-acceleration.md`.

## 1. Select facets (deep = everything)

Run **all** facets: correctness, security, performance, tests, standards, and **maintainability via
`facets/maintainability-deep.md`** (thermo-nuclear bar). Add **spec-alignment**
(`facets/spec-alignment.md`) when supplied intent includes checkable acceptance criteria. Repo
**Always run** is a no-op here; **Emphasis**/`--focus` still tell a facet to go deeper and lower its
threshold.

## 2. Spawn facet sub-agents in parallel

As standard, and add the blast-radius map to each prompt.

## 3. Dual-judge verification (replaces the single critic)

After aggregate and dedup (`fan-out.md` §3), run the procedure in `dual-judge.md`. When the judges
**refute** a finding (false or no real consequence, not stale), record it in the rejection memory
(`rejection-memory.md`), as the standard critic does.

## 4. Remaining steps

Run `fan-out.md` §5–8 and its failure handling unchanged. With `--benchmark`, the token footer
includes facet, dual-judge, and tiebreaker tokens.
