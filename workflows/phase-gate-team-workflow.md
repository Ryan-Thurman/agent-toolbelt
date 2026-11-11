# Phase-Gate Team Workflow (work flow — manual review, no auto-merge)

A phased build loop for **team/work repos**. Humans still do the manual review and own the merge.
An agent **auto-reviews each phase PR and posts its findings to the PR** (GitHub or Azure) before or
alongside the human reviewers. This is the **default** mode of `/phase-gate` (no `--merge`).

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
│ /phase-gate            (default — no --merge)              │
│   • subagent runs /pr-review --comment                     │
│   • findings posted inline to the GitHub/Azure PR          │
│   • gate STOPS — handed to human review                    │
│ ↓                                                          │
│ Humans review (with the agent's comments already on the PR)│
│ Humans merge                                               │
│ ↓                                                          │
│ Human says continue → next phase                           │
└────────────────────────────────────────────────────────────┘
↓
Feature complete
```

## Steps

1. **Plan.** Agree the phases up front. One phase = one PR.
2. **Build the phase** on a focused branch, and commit as you go.
3. **Open the phase PR** against the base branch.
4. **Run the gate:** `/phase-gate`. The steps and tier advice are in
   `skills/phase-gate/references/modes.md` → "Team Flow". The gate does not fix code or merge.
5. **Human review + merge.** Reviewers react to the agent's comments and merge when satisfied.
   Use `/pr-review-reply` to help answer the human threads.
6. **Continue.** After a human merges and says to proceed, the main agent starts the next phase.
