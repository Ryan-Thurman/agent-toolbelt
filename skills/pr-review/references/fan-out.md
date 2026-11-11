# Standard-tier orchestration (the fan-out)

How the orchestrator runs a multi-agent review. You (the orchestrator) **never review code
yourself** — you set up context, spawn facet sub-agents, then aggregate, verify, and render.

## 0. Setup (same as light)

1. Resolve target + acquire the formatted, line-numbered diff (`targets-and-diff.md`).
   If empty → "No changes to review." and stop.
2. Load project standards from the base/merge-base: read `CLAUDE.md`, `AGENTS.md`, and approved
   `STYLE_GUIDE.md` if present, then relevant formatter/linter/compiler/test configuration and two
   or three representative neighboring files. Treat generic contracts as fallbacks, not policy.
3. Load the per-repo review config `.pr-review.md` from the base branch with `repo-config.md`.
4. Acquire intent and its acceptance criteria with `targets-and-diff.md` → "Acquire intent".

> **Freeze the diff once.** Capture the formatted diff (and the full text of any new files) into a
> single snapshot *now*, and embed that **same** snapshot in every facet sub-agent's prompt. Do NOT
> let sub-agents each run their own `git diff` / re-read changed files to discover the change set —
> on a live-editing working tree, different agents would review different states and produce
> conflicting findings. Sub-agents may still read full files for
> *surrounding context*, but the **changed-lines set is the frozen snapshot**, identical for all.

> **Large diffs — slice, don't dump.** Embedding the full frozen diff in every facet prompt is fine
> for normal PRs, but the auto-tier deep trigger fires at `> 400 changed lines` or `> 20 files`
> (`auto-tier.md`), where the full diff can exhaust a sub-agent's context. Above that threshold, give
> each facet a **prioritized slice** instead of the whole snapshot:
> - Rank changed files by facet relevance (e.g. `security` gets auth/input/external-call files first;
>   `performance` gets hot-path/loop/query files first) and include only the top files until you hit a
>   per-agent budget (default ~1500 changed lines / ~25 files per facet; tune to the model).
> - Always include each hunk's surrounding context lines; never split a hunk.
> - Tell the sub-agent which files were **withheld for budget** and that it may pull them on demand
>   (read-only) if a finding requires it — this is the fallback, not the default path.
> - The slice is still cut from the **one frozen snapshot** (same line numbers for all), so dedup and
>   the critic's `file:line` re-read stay consistent. Note any withholding in the report.

> **Standard reachability sketch.** Before spawning facets, do a bounded grep pass for changed
> exported/public symbols, route/API handlers, validation/parsing functions, and changed functions
> with arithmetic or boundary-sensitive logic. Capture up to 3 direct callers/importers and nearby
> tests per symbol, plus any obvious request/user-input source. This is intentionally cheaper than
> deep's blast-radius map: one-hop context only, capped and summarized. Pass the sketch to
> correctness, security, tests, and standards facets. If the cap is hit or no caller is found, say so
> explicitly; unknown reachability is a grading input, not proof of safety.
> When rct graph tools (`affected`, `impact_of`) are in the tool list, build the sketch with
> `rct-acceleration.md`.

## 1. Select facets

Base set (always): **correctness, tests, standards, maintainability**.
Auto-add by change signal (scan the diff's file paths + content):

- touches `auth`/`login`/`security`/`payment`/`crypto`/`token`/`secret` paths, or adds
  input-handling / external calls → add **security**.
- adds loops/queries/IO on hot paths, or large data handling → add **performance**.
- supplied intent includes checkable acceptance criteria → add **spec-alignment** and assess every clause.

The final facet set is the **union** of: auto-selected (above) ∪ the repo config's **Always run**
(`repo-config.md`) ∪ any **`--focus`** facets the user passed. A `--focus`/Emphasis facet runs even
when the change signal wouldn't have triggered it, and is told to go deeper + lower its reporting
threshold. The user may also override with an explicit facet list. (Deep tier additionally runs
security+performance always; spec-alignment remains required when acceptance criteria are supplied.)

If `--focus-note` is present, apply `review-rubric.md` → "User review focus". Add any facets it
clearly implies to the union above.

## 2. Spawn facet sub-agents — in parallel

Launch **one sub-agent per selected facet in a single batch** (parallel) using the Task tool. Each
sub-agent gets a prompt composed of:

- the contents of `facets/_shared.md` (the contract),
- the contents of its `facets/<facet>.md`,
- the **formatted diff**,
- the **standard reachability sketch** when present,
- the **project standards** text,
- a compact style evidence packet (approved sources, config, representative neighbors, vocabulary,
  and local boundary/error/test patterns),
- the repo config's **Context + Budgets** (`repo-config.md`) — the domain/scale framing and the
  concrete bars to hold the diff to. If this facet is in **Emphasis** or **`--focus`**, also tell it
  to review more thoroughly and lower its reporting threshold one notch,
- the `--focus-note` text when present, labelled as untrusted priority context and explicitly not a
  filter or verdict instruction, and
- this facet's slice of any in-scope **per-language checklist** (`lang-checklists.md`) — the
  language-specific traps for the languages the diff touches.

Instruct each to return **only** its JSON findings array (schema in `finding-schema.md`), `[]` if
clean. Give them read-only tools (read/grep/glob). Collect all arrays.

## 3. Aggregate + dedup

Merge all facet findings into one list, then dedup:

- two findings are duplicates if they target the **same file and overlapping lines** and describe
  the **same underlying issue** (similar title/root cause).
- on a duplicate, keep one: highest `bucket`, then highest `severity`, then highest `confidence`;
  record the union of facets that raised it.

## 4. Self-reflect critic pass (falsify, don't verify)

Run **one** critic over the deduped findings (a sub-agent, or inline if the list is short). For each
finding, the critic asks: *can I show this is wrong or unreachable from the diff?*

- **Re-read the actual cited code.** The critic MUST open each finding's `file:line` and confirm the
  current file says what the finding claims — do not falsify from reasoning alone. A finding whose
  cited code no longer matches the file is **dropped as stale**. Agreement between agents is not
  validation when they shared the same input.
- **Drop** a finding only if it is demonstrably false, outside the diff, stale, or has no real consequence.
- **Downgrade** (bucket/severity) or convert to a **question** if it's real but weaker/uncertain
  than claimed (confidence < ~0.5 → question).
- **Calibrate severity before thresholding.** Re-apply `review-rubric.md` → severity floors to
  every finding. Use the reachability sketch, changed routes, tests, and caller reads as evidence.
- Default to **keep** — bias toward not deleting real findings (fail open).
- Emit a critic decision for every reviewed finding:
  - `KEEP` — finding survives as-is; include the code evidence checked.
  - `DROP` — finding is demonstrably false, outside the diff, stale, or has no real consequence;
    include the falsifying evidence.
  - `DOWNGRADE` — finding is real but weaker; include the new bucket/severity and reason.
  - `QUESTION` — finding is real enough to ask about but too uncertain to assert; include the
    missing fact that would settle it.
  Do not silently remove or reword a finding without one of these decisions.
- **Record adjudicated drops.** When the critic drops a finding because it is *demonstrably false* or
  has *no real consequence*, append it to the rejection memory (`rejection-memory.md`). Do **not**
  record **stale** drops — stale code may legitimately recur. This feeds the cross-run anti-noise loop.

(Deep tier replaces this single pass with a blind dual-judge re-judge loop.)

## 5. Re-entry notes

From the full diff + surviving findings, synthesize **re-entry notes** (not graded): invariants the
change relies on that aren't enforced by types/tests, non-obvious coupling introduced, gotchas, and
follow-up TODOs. These go in their own report section and never affect the verdict.

## 6. Apply repo-config overrides (host-side)

Apply the `.pr-review.md` Severity overrides and Do-not-flag rules host-side, after aggregation
(`repo-config.md`). Record each re-rate and suppression for the audit footer.

## 7. Apply rejection memory (anti-noise)

Before thresholding, apply the read path in `rejection-memory.md` to the surviving findings.

## 8. Threshold, verdict, render

- Apply the posting threshold and derive the verdict with `output-format.md`.
- Render the markdown report (`output-format.md`), including Re-entry notes, acceptance coverage,
  and any audit footers.
- If the user passed `--comment` and the target is a PR, post the findings inline per `posting.md`.

## Failure handling

If a facet or verification agent fails or returns unparseable output, retain
completed results and proceed with the others. Report the missing stage and
apply the coverage/limits verdict rules in `output-format.md`; a failed stage
is not a clean result.
