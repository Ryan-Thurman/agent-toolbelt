# RCA procedure, strategies, patterns, and the symptom index

Read this file for root-cause analysis (the `/rca` step), after reproduction.
The strategies, taxonomy, and symptom index make the loop start warmer. They do not replace it.

## Preconditions

- The bug is reproduced, manually or automatically. If not, follow `reproduction.md` first.
- A durable investigation file exists. If not, create one from `templates/bug-investigation.md`.
- Read `bug-knowledge-base.md` when it exists. A match is a hypothesis candidate (`durable-state.md`).

## Rules

- Output a confirmed cause and a fix *direction* only. Do not fix the bug in this step.
- With `--diagnose`, make no file edits. Add instrumentation only when the user approves it.

## The loop (the spine)

1. **Re-read** **Symptoms** and **Reproduction**. Confirm that the repro fails the way the
   reporter described, not with a different failure.
2. **Root-cause investigation** — read the errors *thoroughly*; examine recent
   changes (`git diff`, recent commits); **trace the data flow backward** from the symptom.
   Append findings to **Evidence**.
3. **Pattern analysis** — find a working example of the same thing; compare line by line; list
   *every* difference, however small ("that can't matter" is how bugs hide). Check the
   taxonomy and symptom index below, and pick a strategy from the decision tree.
4. **Hypothesis testing** — generate **3–5 ranked, falsifiable** hypotheses before testing any.
   Show the ranked list to the user when domain knowledge would help.
   Test one variable at a time. Disproven → append to **Eliminated**, form the next.
5. **Confirm** — confirm adversarially (`adversarial-confirmation.md`), then fill the 5-field
   reasoning checkpoint. If you cannot fill all five concretely, return to step 2.
6. **Emit** the output contract below. With `--diagnose`, stop and hand off.
   Otherwise, recommend `/fix-plan`.

## Backward trace (find the origin, not the surface)

Observe the symptom → find the immediate cause (what code directly does this?) → ask what called
that → keep tracing up (what value was passed?) → find the **original trigger**. **Never fix where
the error appears** if it originates upstream. When manual tracing stalls, instrument: add
uniquely-tagged logs (`[DEBUG-a4f2] …`) so cleanup is a single grep; log *before* the dangerous
operation; print only the fields needed to test the hypothesis, with credentials and sensitive
values masked. Use `console.error` (or the equivalent that actually surfaces) in tests.

## Redact diagnostic evidence

Before recording evidence in the investigation file or quoting it in a report, mask tokens,
passwords, cookies, connection strings, auth headers, and sensitive user data. Logs, HAR files,
stack traces, and environment dumps can carry these values even when the command itself does not.
Show commands using variable names in place of credential values; quote only the output that
establishes the symptom or tests the hypothesis. If masking removes the signal needed to diagnose
the bug, explain the missing signal and ask how the user wants to provide it securely.

## Strategy decision tree

| Situation | Strategy | How |
|---|---|---|
| Unknown bug location | **Binary search** | bisect the code path / comment out halves until the failure flips |
| Regression — used to work | **git bisect** | `git bisect start; git bisect bad; git bisect good <sha>; git bisect run <test>` |
| Recent breakage | **Delta debugging** | `git diff HEAD~5..HEAD`; inspect the smallest recent change set |
| Know the desired output | **Working backwards** | start from the correct result and walk back to where reality diverges |
| Complex system, many parts | **Minimal reproduction** | shrink to the smallest input/flow that still fails |
| Logic error, you're confused | **Rubber duck** | explain the code line by line; the wrong assumption usually surfaces |
| Many possible causes | **Comment-out / isolate** | disable everything, re-enable one piece at a time |
| Paths/keys come from variables | **Follow the indirection** | trace where the value was actually constructed |
| Default | **Observability first** | add logging/inspection *before* changing anything |

## Common-bug-pattern taxonomy (cause lookup)

| Pattern | Typical symptom | Usual cause |
|---|---|---|
| Race condition | intermittent / load-dependent failures | missing `await`, unsynchronized shared state, callback after teardown |
| Off-by-one | first/last element wrong, boundary fails | `<` vs `<=`, index math |
| Null / undefined ref | "undefined is not a function/object" | missing null check, unhandled optional |
| Memory leak | gets slower / OOM over time | uncleaned listeners, intervals, growing caches |
| N+1 queries | slow and worsens with data size | fetching inside a loop instead of batching |
| Type coercion | comparison "lies" | `==` vs `===`, implicit casts |
| Closure capture | loop variable is wrong/last | capturing a mutable loop var |
| Stale state | UI/value lags reality | reading a captured/old snapshot of state |

## Symptom → first check

- "undefined is not …" → null/optional handling on that path.
- Works sometimes / flaky → race condition; check ordering and `await`.
- Gets slower over time → leak or N+1.
- Wrong after an edge input → boundary / off-by-one / coercion.
- Broke after a deploy → `git bisect` / delta-debug the release.
- Wrong only in one environment → config/env guard, not the core logic.

## Output contract for `/rca`

`root cause` · `evidence` (the specific observations/logs/test that prove it) · `fix direction`
(not the full diff — that's `/fix-plan`) · `prevention`. Write these into the durable file's
**Resolution** and into `templates/rca-report.md` if a shareable report is wanted.
