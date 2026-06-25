# Phase-Gate Solo Workflow (personal flow)

A phased build loop where **an agent reviews each phase and the main agent merges** — no human stop
to review PRs. Use it for personal/solo work where you trust the agent to review, fix, and merge a
phase before moving on.

The idea: you give the main agent an idea, you agree a plan, it builds in phases. At each phase
boundary the main agent **delegates the review to a fresh subagent** (so the review doesn't pollute
the build context), gets the findings back, fixes any blockers, **merges the phase PR**, and starts
the next phase. This is the `--merge` mode of `/phase-gate`.

> POC — standalone. This is the in-loop, synchronous flow (the reviewer is a subagent in the same
> session). For async/decoupled review hand-off use `review-queue`; for host-triggered auto-review use
> `review-on-open`.

## Loop

```text
Idea
↓
Agree a plan (phases)
↓
┌─ per phase ───────────────────────────────────────────────┐
│ Build the phase (tasks + commits on a phase branch)        │
│ ↓                                                          │
│ Open the phase PR                                          │
│ ↓                                                          │
│ /phase-gate --merge                                        │
│   • subagent runs /pr-review --comment                     │
│       → posts review to the PR AND returns findings         │
│   • main agent fixes blockers (in-context), pushes         │
│   • [--rereview] one confirming pass (optional)            │
│   • no blockers? → main agent MERGES the phase PR          │
│ ↓                                                          │
│ Next phase (branch off the updated base)                   │
└────────────────────────────────────────────────────────────┘
↓
Feature complete
```

## Steps

1. **Plan.** Agree the phases up front (any planner is fine — e.g. `/dev-plan`). One phase = one PR.
2. **Build the phase.** The main agent implements the phase on a focused branch, committing as it goes.
3. **Open the phase PR** against the base (a feature/integration branch or `main`, per your repo).
4. **Run the gate:**
   ```text
   /phase-gate --merge
   ```
   - A fresh **review subagent** runs `/pr-review --comment` on the phase PR: it **posts the review to
     the PR** (GitHub/Azure, for the record) and **returns the findings** to the main agent. It never
     edits code. (Add `--no-post` for a dry run that posts nothing.)
   - The **main agent** reads the findings, fixes the **blockers** in its own context, and pushes.
     Non-blocker findings are surfaced but don't gate.
   - Default is a **single review pass**; add `--rereview` if you want one confirming pass after fixes.
5. **Merge.** With no blockers remaining, the main agent **merges the phase PR** (provider-aware:
   `gh pr merge --squash` / `az repos pr update --status completed`,
   `skills/phase-gate/references/merge.md`). If the host CLI is missing or the merge is refused, it
   stops and reports rather than faking a merge.
6. **Next phase.** Branch the next phase off the updated base and repeat. When the last phase merges,
   the feature is done.

## Notes

- **Why a subagent, not inline review?** The main agent stays focused on building; the reviewer gets a
  clean context window and isn't biased by the build reasoning — yet the findings still come straight
  back to the main agent to act on. That's the whole point of the in-loop gate.
- **Tier:** omit `--tier` to let `pr-review` auto-tier per phase diff; pass `--tier=deep` for a
  high-stakes phase.
- **Merging into `main`:** merging the phase PR into its base is intended here. The gate never
  force-pushes or rewrites shared history — only the host merge.
