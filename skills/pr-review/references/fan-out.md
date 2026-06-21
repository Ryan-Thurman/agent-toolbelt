# Standard-tier orchestration (the fan-out)

How the orchestrator runs a multi-agent review. You (the orchestrator) **never review code
yourself** — you set up context, spawn facet sub-agents, then aggregate, verify, and render.

## 0. Setup (same as light)

1. Resolve target + acquire the formatted, line-numbered diff (`targets-and-diff.md`).
   If empty → "No changes to review." and stop.
2. Load project standards: read `CLAUDE.md` / `AGENTS.md` at the repo root if present.
3. Load the **per-repo review config** `.pr-review.md` if present (`repo-config.md`) — **from the
   base/target branch**, not the PR head, so a PR can't relax its own review. Parse its sections
   (Context, Always-run, Emphasis, Budgets, Severity overrides, Do-not-flag, Minimum tier). If the PR
   *modifies* the config, don't honor the new version — flag it as a `standards` finding.

> **Freeze the diff once.** Capture the formatted diff (and the full text of any new files) into a
> single snapshot *now*, and embed that **same** snapshot in every facet sub-agent's prompt. Do NOT
> let sub-agents each run their own `git diff` / re-read changed files to discover the change set —
> on a live-editing working tree, different agents would review different states and produce
> conflicting findings. (This bit us in the first benchmark: agents reviewed a file mid-edit and
> several findings were against a stale version.) Sub-agents may still read full files for
> *surrounding context*, but the **changed-lines set is the frozen snapshot**, identical for all.

## 1. Select facets

Base set (always): **correctness, tests, standards, maintainability**.
Auto-add by change signal (scan the diff's file paths + content):

- touches `auth`/`login`/`security`/`payment`/`crypto`/`token`/`secret` paths, or adds
  input-handling / external calls → add **security**.
- adds loops/queries/IO on hot paths, or large data handling → add **performance**.

The final facet set is the **union** of: auto-selected (above) ∪ the repo config's **Always run**
(`repo-config.md`) ∪ any **`--focus`** facets the user passed. A `--focus`/Emphasis facet runs even
when the change signal wouldn't have triggered it, and is told to go deeper + lower its reporting
threshold. The user may also override with an explicit facet list. (Deep tier additionally runs
security+performance always, plus spec-alignment when a spec/issue is linked.)

## 2. Spawn facet sub-agents — in parallel

Launch **one sub-agent per selected facet in a single batch** (parallel) using the Task tool. Each
sub-agent gets a prompt composed of:

- the contents of `facets/_shared.md` (the contract),
- the contents of its `facets/<facet>.md`,
- the **formatted diff**,
- the **project standards** text,
- the repo config's **Context + Budgets** (`repo-config.md`) — the domain/scale framing and the
  concrete bars to hold the diff to. If this facet is in **Emphasis** or **`--focus`**, also tell it
  to review more thoroughly and lower its reporting threshold one notch, and
- this facet's slice of any in-scope **per-language checklist** (`lang-checklists.md`) — the
  language-specific traps for the languages the diff touches.

Instruct each to return **only** its JSON findings array (schema in `finding-schema.md`), `[]` if
clean. Give them read-only tools (read/grep/glob). Collect all arrays.

> Each sub-agent has a fresh context and reviews only its facet — this is the whole point: focused
> attention per dimension, run concurrently, instead of one prompt juggling everything.

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
  cited code no longer matches the file is **dropped as stale**. (First benchmark: the working tree
  was edited mid-review, so agents reviewed an older version; an inline critic that only *reasoned*
  missed it. Re-reading against the frozen snapshot catches this. Several agents "agreeing" is **not**
  validation when they shared the same — possibly stale — input.)
- **Drop** a finding only if it is demonstrably false, outside the diff, stale, or has no real consequence.
- **Downgrade** (bucket/severity) or convert to a **question** if it's real but weaker/uncertain
  than claimed (confidence < ~0.5 → question).
- Default to **keep** — bias toward not deleting real findings (fail open).
- **Record adjudicated drops.** When the critic drops a finding because it is *demonstrably false* or
  has *no real consequence*, append it to the rejection memory (`rejection-memory.md`). Do **not**
  record **stale** drops — stale code may legitimately recur. This feeds the cross-run anti-noise loop.

(Deep tier replaces this single pass with a blind dual-judge re-judge loop.)

## 5. Re-entry notes

From the full diff + surviving findings, synthesize **re-entry notes** (not graded): invariants the
change relies on that aren't enforced by types/tests, non-obvious coupling introduced, gotchas, and
follow-up TODOs. These go in their own report section and never affect the verdict.

## 6. Apply repo-config overrides (host-side)

Before the memory + threshold, apply the `.pr-review.md` rules that act on findings (`repo-config.md`)
— **host-side, after aggregation**, so they're visible and reversible (never let a facet agent
self-suppress):

- **Severity overrides** — re-rate findings matching a rule (e.g. perf finding on a hot-path glob →
  blocker). Record what was re-rated.
- **Do not flag** — drop findings matching an accepted-pattern rule. Record what was suppressed (count
  + reason) for the audit footer; don't silently vanish them.

## 7. Apply rejection memory (anti-noise)

Before thresholding, run the surviving findings through the rejection memory (`rejection-memory.md`):
fingerprint each, and for any that the critic has refuted on a previous run, **downrank one bucket**
and **tag** `⟲ previously rejected`. Never hide — the tag is the signal. (Skip if not in a git repo or
the store is empty.) Because the verdict is `APPROVE ⇔ 0 blockers`, demoting a lone known-non-issue
blocker correctly flips the verdict to APPROVE while still showing the item.

## 8. Threshold, verdict, render

- Apply the posting threshold: hide `nit`s unless there are no higher findings or the user asked.
- Derive the verdict mechanically (`output-format.md`): `APPROVE` iff zero blockers, else
  `REQUEST CHANGES` / `NEEDS DISCUSSION`.
- Render the markdown report (`output-format.md`), including the Re-entry notes section, the
  `memory:` footer if anything was downranked, and the `repo-config:` footer if `.pr-review.md`
  forced facets / re-rated / suppressed anything.
- If the user passed `--comment` and the target is a PR, post the findings inline per `posting.md`.

## Failure handling

If a facet sub-agent fails or returns unparseable output, note it in the report ("⚠️ <facet> review
incomplete") and proceed with the others — never block the whole review on one facet.
