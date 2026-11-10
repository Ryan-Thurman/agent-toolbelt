# Output format — verdict derivation & report layout

## Verdict (host-derived, not model-asserted)

Compute the verdict mechanically from the findings — never let the model "decide" a fuzzy verdict:

- `APPROVE` — zero blockers, no approval-blocking open questions, and no required
  review scope gaps (should-fix / nits may remain).
- `REQUEST CHANGES` — one or more blockers.
- `NEEDS DISCUSSION` — no blockers, but an open question / low-confidence finding that needs the
  author's input before approving, or an incomplete required review scope.

Invariant: **blockers > 0 ⇒ REQUEST CHANGES**; **blockers = 0 + an approval-blocking question or
scope gap ⇒ NEEDS DISCUSSION**; **blockers = 0 + neither ⇒ APPROVE**.
Do not emit composite verdicts such as "approve with blockers".
Do not use `NEEDS DISCUSSION` as a softer name for `REQUEST CHANGES`.
Put nuance in finding buckets and questions.

## Posting threshold

Apply this after severity calibration (`review-rubric.md` → severity floors) on every tier.
Hide `nit`s when a higher finding exists, unless the user asked for nits.
Keep `should-fix` and `nit` findings in their own sections in an approved report.

## Review coverage and limits

Account for the requested scope separately from the finding counts. Record
files actually inspected, deliberate exclusions, budget-withheld files still
unread, unavailable content, and selected facets or critic/judge stages that
failed or returned unusable results. A valid empty findings array means that
stage completed; missing output does not. A slice made available on demand is
covered only if it was actually inspected.

Continue useful review of the available scope after a failure. A missing selected
facet, failed required verification, or unreviewed in-scope file is an
approval-blocking gap: retain `REQUEST CHANGES` when blockers exist, otherwise
use `NEEDS DISCUSSION` until the gap is resolved or the user explicitly narrows
the requested scope. Deliberate exclusions and optional tooling failures do not
block approval when equivalent review evidence covers the agreed scope.

When the React rule scan ran, add `React rules: N listed · N applied · N not applicable`
to the coverage line. Name any missing specialist that the scan reported.

Include a compact coverage/limits line in every report and posting summary.
Name unresolved gaps and the next check that would close them. When coverage
is incomplete and no findings remain, say "No issues found in the inspected
scope" and list the gaps. Checks not run are unverified; do not invent passing
test results or treat every unavailable optional test as a review blocker.

## Acceptance coverage

Render this table when intent supplies checkable acceptance criteria, at every tier.
The orchestrator owns it. Keep it separate from the facet findings arrays.

```markdown
### 📋 Acceptance coverage (N criteria · source: <intent path, URL, or "PR body">)
| # | Criterion | Status | Evidence |
|---|---|---|---|
| 1 | <clause, quoted or closely paraphrased> | Verified | <file:line, test name, or observation at the frozen revision> |
| 2 | <clause> | Failed | <file:line and the observed difference> |
| 3 | <clause> | Not verified | <the missing evidence and the check that would close it> |
```

- Give each clause one row. Use only `Verified`, `Failed`, or `Not verified`.
- Use evidence from the frozen review revision.
- Source or symbol presence alone does not prove runtime behavior. Use `Not verified` in that case.
- A `Failed` clause also needs a spec-alignment finding with its own bucket.
- When no intent is available, omit the table and state "No acceptance criteria supplied" in the coverage line.

## Markdown report layout

```markdown
## PR Review — <target>  ·  tier: <light|standard|deep>  ·  **<VERDICT>**

<one-paragraph summary: what the change does, main files, overall read>

_coverage: <inspected scope · gaps and the next check, or "complete">_

### 📋 Acceptance coverage (N)          # only when intent supplies criteria; table above

### 🚫 Blockers (N)
- **<file>:<line>** — <title>
  <rootIssue> → <consequence>. <benefit>.
  ```suggestion
  <improvedCode>          # only if present
  ```

### 🔧 Should-fix (N)
- **<file>:<line>** — <title>: <rootIssue> → <consequence>.

### 💡 Suggestions / nits (N)        # omit section if suppressed
- **<file>:<line>** — <title>.

### ❓ Questions (N)                  # low-confidence items needing author input
- **<file>:<line>** — <question>

### 🧭 Re-entry notes (N)             # context for the next person; not graded, never affects verdict
- **<file>:<line>** — <invariant / non-obvious coupling / gotcha / follow-up TODO>

### ✅ What's working well
- <brief, genuine positives — keep short>

_review-focus: <none | facet list and/or focus-note summary; focus is priority context only, not a filter>_
```

Rules:
- Order sections by severity; within a section, sort by severity then file.
- If clean and the requested review scope is complete: render `**APPROVE**` with
  "No issues found in the changed lines." and skip empty sections.
- Lead the summary with *what the change does*, then the overall read — context before criticism.
- Keep "What's working well" short and real; don't pad.
- With `--benchmark`, append the token-usage footer from `benchmarking.md`. Never post that footer.

## Audit footers

Add each footer line only when its source changed the run.

Previously-rejected tag. Render a finding that the rejection memory matched (`rejection-memory.md`)
with its tag inline. It is already downranked one bucket:

```markdown
- **<file>:<line>** — <title>  ⟲ previously rejected (2×, last 2026-05-30)
_memory: 2 findings downranked (previously rejected) · store: .git/pr-review-rejections.jsonl_
```

Repo config. Add this line when `.pr-review.md` (`repo-config.md`) forced facets, re-rated, or suppressed findings:

```markdown
_repo-config: .pr-review.md · forced: performance, security · 1 re-rated (hot-path → blocker) · 2 suppressed (do-not-flag)_
```

## No-config nudge

When the target repo has **no** `.pr-review.md` *and* this run hit a situation the config exists to
solve, add exactly one footer line pointing at the generator. Qualifying situations (any one):

- the rejection memory downranked a finding — recurring noise a `## Do not flag` entry would settle;
- a finding needed severity debate or matched a class visible in the repo's revert/hotfix history —
  a `## Severity overrides` pin;
- auto-tier picked light on production logic — a `## Minimum tier` floor;
- a facet had to guess domain or scale assumptions to grade a finding — a `## Context` paragraph.

```markdown
_no .pr-review.md in this repo — these priorities could be pinned; draft one with /pr-review-init (config-init.md; starter: templates/pr-review.md)_
```

One line, at most once per run, never on a clean quiet review — an unconditional nudge is exactly
the recurring noise this tool teaches repos to suppress.

## Inline-comment mode (`--comment`)

Print this report locally as the source of truth. Then post through `posting.md`.
