# Benchmarking — tokens vs impact per tier

Goal: measure what each tier *costs* (tokens) against what it *yields* (findings by severity), so
you can decide when paying for `standard`/`deep` is worth it over `light`.

## What's measurable, and how

- **Multi-agent tiers (standard/deep):** every facet/critic sub-agent is spawned via the Task tool,
  whose result includes a per-agent token count. The orchestrator **sums these** for an accurate
  per-facet + total breakdown of the review work. This is free and exact.
- **Light tier & orchestrator overhead:** a single in-context pass can't reliably self-measure its
  own tokens. Two options:
  1. **Run the review work inside one sub-agent** (a single generalist Task) so it's metered the
     same way — best for apples-to-apples benchmarking.
  2. Read the authoritative per-turn total from the harness (`/cost` in Claude Code) and record it.

Always note which method produced a number. Sub-agent sums exclude the orchestrator's own
setup/aggregation/critic tokens — for a true total, add the harness figure.

## Metrics to log per run

- **tier**, **target**, **diff size** (changed LOC / files reviewed).
- **tokens**: per-facet (if multi-agent) + total review tokens; method used.
- **yield**: findings by bucket — `blockers / should-fix / nits` — plus `questions` and the `verdict`.
- **derived**: `tokens / finding` and, across tiers on the same target, the **marginal yield** of
  going up a tier (what extra real findings did the extra tokens buy?).

## Apples-to-apples protocol

1. Pick one target (a real diff). Freeze it.
2. Run each tier on it (light → standard → deep), each ideally in a fresh session.
3. Run the review work in sub-agents so the Task tool meters it uniformly.
4. Append one row per tier to `benchmarks/results.md`.
5. Compare: does standard find *materially more high-severity* issues than light for ~Nx the
   tokens? Does deep find anything standard missed, or just re-confirm? That ratio is the decision.

## The report footer (every run prints this)

See the "Token usage" section in `output-format.md` — each review ends with a per-facet token table
(multi-agent) or a single figure (light), so numbers land in the report without extra work.
