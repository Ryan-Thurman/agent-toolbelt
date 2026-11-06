# Product, design, and technical health evaluations

The [case record](product-design-health.json) contains requests, raw fixtures, and observable expectations.
These cases test skill behavior; they do not measure automatic host routing.

For an independent pass, give the evaluator the named skill, request, and fixture only.
Keep expectations and prior conclusions outside its context.
Allow outputs only in an isolated scratch directory.
Apply each fixture's access and mutation limits.

Record the skill and fixture hashes, actual artifact paths, execution observations, failures, and unavailable evidence.
Grade the outputs against expectations after execution.
Keep partial or failed executions visible instead of scoring them as successful.

The first [evaluation record](results-2026-11-06.md) describes the observed results and limits.
Raw artifacts remain local under `.atb-work/skill-evals-2026-11-06/`.
Repeat relevant cases after behavior changes.
Use actual host invocation tests before claiming automatic routing accuracy across Cursor, Claude Code, or Codex.
