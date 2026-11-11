# Phase-Gate Solo Workflow (personal flow)

A phased build loop where **an agent reviews each phase and the main agent merges** — no human stop
to review PRs. Use it for personal or solo work where you trust the agent to review, fix, and merge
a phase. This is the `--merge` mode of `/phase-gate`. A Phased Delivery PR needs your explicit
authorization for solo merge.

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
│       → posts review to the PR AND returns findings        │
│   • blockers? main agent fixes (pr-improve), pushes,       │
│     and a fresh subagent re-reviews the new head           │
│   • verdict APPROVE → main agent MERGES the phase PR       │
│ ↓                                                          │
│ Next phase (branch off the updated base)                   │
└────────────────────────────────────────────────────────────┘
↓
Feature complete
```

## Steps

1. **Plan.** Agree the phases up front (for example with `/dev-plan`). One phase = one PR.
2. **Build the phase** on a focused branch, and commit as you go.
3. **Open the phase PR** against the base (a feature/integration branch or `main`, per your repo).
4. **Run the gate:** `/phase-gate --merge`. The steps, tier advice, and stop rules are in
   `skills/phase-gate/references/modes.md` → "Solo Flow".
5. **Merge.** The main agent merges only under the precondition in
   `skills/phase-gate/references/merge.md`. If the merge is refused, it stops and reports.
6. **Next phase.** Branch the next phase off the updated base and repeat.
