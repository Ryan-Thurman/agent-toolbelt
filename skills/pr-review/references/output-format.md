# Output format — verdict derivation & report layout

## Verdict (host-derived, not model-asserted)

Compute the verdict mechanically from the findings — never let the model "decide" a fuzzy verdict:

- `APPROVE` — zero blockers and no approval-blocking open questions (should-fix / nits may remain).
- `REQUEST CHANGES` — one or more blockers.
- `NEEDS DISCUSSION` — no blockers, but an open question / low-confidence finding that needs the
  author's input before approving.

Invariant: **blockers > 0 ⇒ REQUEST CHANGES**; **blockers = 0 + approval-blocking question ⇒ NEEDS
DISCUSSION**; **blockers = 0 + no approval-blocking question ⇒ APPROVE**. No composite verdicts.

## Markdown report layout

```markdown
## PR Review — <target>  ·  tier: <light|standard|deep>  ·  **<VERDICT>**

<one-paragraph summary: what the change does, main files, overall read>

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
- If clean: render `**APPROVE**` with "No issues found in the changed lines." and skip empty sections.
- Lead the summary with *what the change does*, then the overall read — context before criticism.
- Keep "What's working well" short and real; don't pad.

## Token usage (benchmark footer — every run prints this)

End each review with a token report so cost-vs-impact is visible and loggable (`benchmarking.md`).

- **Multi-agent tiers (standard/deep):** sum the per-agent token counts the Task tool returns for
  each facet + critic sub-agent. Print the breakdown + total.
- **Light tier:** if the review work ran in a single sub-agent, use its Task token count; otherwise
  note "see session `/cost`" (an in-context pass can't self-measure).
- Always state the **review tokens** (sub-agent sum) separately from **total session tokens**
  (harness `/cost`), since the orchestrator's own setup/aggregation isn't in the sub-agent sum.

```markdown
### 📊 Token usage  ·  tier: <tier>
| stage | tokens |
|---|---|
| facet: correctness | 47,074 |
| facet: security    | 34,128 |
| ...                | ...    |
| critic             | ...    |
| **review total (sub-agents)** | **224,033** |

Yield: 0 blockers · 8 should-fix · 6 nits · 2 questions  →  ~28k tokens/finding
(orchestrator overhead not included — see session /cost for the authoritative total)
```

The `Yield:` line is what makes runs comparable across tiers — pair tokens with findings-by-bucket.

## Previously-rejected tag

A finding the rejection memory matched (`rejection-memory.md`) renders with its tag inline and stays
demoted (already downranked one bucket before this point):

```markdown
- **<file>:<line>** — <title>  ⟲ previously rejected (2×, last 2026-05-30)
```

Never omit a tagged finding for being tagged — the tag is information, not suppression. When the
memory changed anything, add a footer line so the effect is auditable:

```markdown
_memory: 2 findings downranked (previously rejected) · store: .git/pr-review-rejections.jsonl_
```

## Repo-config footer

When `.pr-review.md` (`repo-config.md`) affected the run — forced facets, re-rated, or suppressed —
add an audit line so the effect is never silent:

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

When the user passes `--comment` and the target is a real PR, post the findings as inline review
comments instead of (well, in addition to) printing the report. Full mechanics — single batched
review, suggestion blocks, line anchoring, idempotency markers, self-review `COMMENT` event,
dry-run/confirm — are in `posting.md`. The markdown report above is still printed locally as the
source of truth.
