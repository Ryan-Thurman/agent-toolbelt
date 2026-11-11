---
name: phase-gate
description: Run a synchronous PR-review gate at a phased-build boundary. Use when each phase PR needs an isolated subagent review, posted findings, and either team handoff or solo fix-and-merge routing.
---

# phase-gate

If you have not read `shared/contracts/references/human-readable-output.md` in this session,
read it before you write for the user.

Toolbelt paths: a path that starts with `shared/`, `skills/`, `templates/`, or `workflows/` is relative to the Toolbelt root, `${CLAUDE_PLUGIN_ROOT}`. If that variable is not replaced, use the nearest folder above this file that contains `shared/contracts/`.

A **synchronous, in-loop review gate** for a phased build loop (plan → build phase → open PR →
**gate** → next phase). At the phase boundary, the main agent delegates the review to a **fresh
subagent** and acts on the result. The subagent runs `pr-review`; this pack adds only phase-boundary
routing. For asynchronous review, use `review-on-open` or `review-queue`.

## Modes

Team mode (default) posts the review and stops for human review. Solo mode (`--merge`) fixes
blockers, re-reviews, and merges an approved phase PR. `--no-post` makes either mode report-only.
Read `references/modes.md` before you run either flow. It owns the steps and the tier advice.

## Principles (always)

- **Trigger invariants.** The gate is a review trigger. Apply
  `skills/pr-review/references/triggers.md`. The review never runs inline in the build session.
- **The reviewer never edits.** The review subagent only produces and posts findings. The main
  agent (solo) or a human (team) applies fixes.
- **Give the reviewer an independent packet.** Pass the source acceptance criteria as
  `--intent=<path|url>`. Add the scoped plan section, base/head, and test evidence to the prompt.
  Do not pass the coding agent's private reasoning or self-summary. For a Phased Delivery PR, use the
  reviewer packet in `skills/phased-delivery/references/review-rules.md` → "Independent reviewer".
- **Every fix gets a re-review.** A fix commit changes the head SHA. Run a fresh review on the new
  head before any merge.
- **Solo mode merges only an approved phase PR.** Apply the precondition in `references/merge.md`,
  including its Phased Delivery rule. Never force-push or rewrite shared history.

## Inputs

- **target** — the phase PR (number/URL) or branch; empty = the current branch's open PR.
- **`--merge`** — solo mode. Without it, team mode posts and stops.
- **`--no-post`** — report-only. Posting is otherwise on, and degrades to report-only without a host CLI.
- **`--tier=light|standard|deep`** — review depth passed to `pr-review`. See `references/modes.md`.
- **`--intent=<path|url>`** — the phase's acceptance criteria, passed to `pr-review`.
- **`--rereview`** — run one confirming review before merge even when no fix commit was made.
  It passes `--repost` to `pr-review` (`references/modes.md` → "Solo Flow").

## Completion

- Team mode is complete when the review is posted (or printed with `--no-post`) and the verdict is reported.
- Solo mode is complete when the PR is merged and the merge record is printed, or when a stop is
  reported with its reason (capped-not-converged, escalated, open questions, or a failed merge check).

## References

- `references/modes.md` — team and solo steps, the fix-round count, `--no-post`, and tier guidance.
- `references/merge.md` — the merge precondition, the merge-only-what-was-reviewed checks, and the
  provider-aware merge.
- `skills/pr-improve/SKILL.md` — the bounded fix loop that solo mode uses for blocker fixes.
- `skills/pr-review/SKILL.md` — the reviewer the subagent runs.
- `skills/pr-review/references/triggers.md` — the invariants that apply to every review trigger.
- `workflows/phase-gate-team-workflow.md` · `workflows/phase-gate-solo-workflow.md` — the two
  phased-build loops this gate plugs into.
