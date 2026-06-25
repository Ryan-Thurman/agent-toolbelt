# Phase-Gate Team Workflow (work flow — manual review, no auto-merge)

A phased build loop for **team/work repos** where humans still do the manual review and own the merge,
but an agent **auto-reviews each phase PR and posts its findings to the PR** (GitHub or Azure). The
auto-review *supplements* the human review — it puts an agent's pass on the PR before (or alongside)
the human reviewers, so nothing waits on you to review by hand first. This is the `--post` mode of
`/phase-gate`.

> POC — standalone. Same in-loop gate as the solo flow, but findings go to the **PR on the host** and
> the gate **stops** for human review + merge (it never auto-merges).

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
│ /phase-gate --post                                         │
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
2. **Build the phase** on a focused branch, committing as you go.
3. **Open the phase PR** against the base branch.
4. **Run the gate:**
   ```text
   /phase-gate --post
   ```
   - A fresh **review subagent** runs `/pr-review <pr> --comment`: it reviews the phase diff and
     **posts the findings as inline comments** on the PR — GitHub (`gh`) or Azure Repos (`az`), via the
     `pr-review` provider layer (`skills/pr-review/references/providers.md`); it degrades to a printed
     report if no host CLI is present.
   - The gate then prints the verdict + counts and **stops**. It does **not** fix code and does **not**
     merge.
5. **Human review + merge.** Reviewers do their normal manual review — now with the agent's pass
   already on the PR to react to — and **merge** when satisfied. (Use `/pr-review-reply` if you want an
   agent to help answer the human threads.)
6. **Continue.** Once a human merges and says to proceed, the main agent starts the next phase.

## Notes

- **No auto-merge — by design.** In work repos the merge stays a human decision; this flow only adds
  the agent's review to the PR. Contrast the solo flow (`phase-gate-solo-workflow.md`), where the main
  agent merges.
- **Posting is outward-facing.** `--comment` writes to the live PR; the gate posts because that's the
  configured intent of this flow. The review treats the diff/PR text as untrusted input.
- **Tier:** omit `--tier` to auto-tier; pass `--tier=deep` on sensitive phases.
