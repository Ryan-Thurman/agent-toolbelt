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

## Optional eval ledger

For repeatable review-quality evaluation, keep the ledger repo-local and append-only. Do not add a
service, dashboard, database, or hosted eval runner.

Use one of these storage modes:

- **Committed benchmark summary:** append human-readable results to `benchmarks/results.md` when the
  run informs tier guidance or prompt/rubric changes.
- **Tracked JSONL ledger:** append one JSON object per run to
  `skills/pr-review/benchmarks/eval-ledger.jsonl` only when the team wants machine-readable history in
  the repo.
- **Local scratch ledger:** append to `.git/pr-review-eval-ledger.jsonl` for private experiments that
  should not be committed.

Recommended JSONL fields:

```json
{"date":"YYYY-MM-DD","target":"<repo/ref or fixture>","frozenDiff":"<path or sha>","tier":"standard","focus":"<none|facets/note>","reviewTokens":0,"findings":{"blocker":0,"shouldFix":0,"nit":0,"questions":0},"verdict":"APPROVE|REQUEST CHANGES|NEEDS DISCUSSION","critic":{"kept":0,"dropped":0,"downgraded":0,"questions":0},"notes":"<short outcome or calibration lesson>"}
```

Rules:

- Freeze the diff or record why the run is exploratory.
- Record critic/dual-judge effects separately from raw findings.
- Never include secrets, private code snippets, or full proprietary diffs in the ledger.
- Keep `benchmarks/results.md` as the readable source of conclusions; JSONL is supporting evidence.

## Apples-to-apples protocol

1. Pick one target (a real diff). Freeze it.
2. Run each tier on it (light → standard → deep), each ideally in a fresh session.
3. Run the review work in sub-agents so the Task tool meters it uniformly.
4. Append one row per tier to `benchmarks/results.md`, and optionally one JSONL event per run to the
   eval ledger.
5. Compare: does standard find *materially more high-severity* issues than light for ~Nx the
   tokens? Does deep find anything standard missed, or just re-confirm? That ratio is the decision.

## The report footer (every run prints this)

See the "Token usage" section in `output-format.md` — each review ends with a per-facet token table
(multi-agent) or a single figure (light), so numbers land in the report without extra work.
