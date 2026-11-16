---
name: tech-backlog-assessment
description: "Decide whether and how to do one technical backlog item: do/defer/reject/spike, options such as packages or upgrades, risks, test strategy, and next workflow. Use ticket-discovery when the item names a precedent; use tech-debt-discovery to find candidates."
---

# tech-backlog-assessment

If you have not read `shared/contracts/references/human-readable-output.md` in this session,
read it before you write for the user.

Toolbelt paths: a path that starts with `shared/`, `skills/`, `templates/`, or `workflows/` is relative to the Toolbelt root, `${CLAUDE_PLUGIN_ROOT}`. If that variable is not replaced, use the nearest folder above this file that contains `shared/contracts/`.
Read `shared/contracts/references/evidence-quality.md` when evaluating the item.

Report only. Edit files only after the user accepts the recommendation and asks to implement.

For source-to-target upgrades, read `references/version-delta.md`.

## Steps

1. Classify the item: dependency decision, library or framework switch, technical
   debt cleanup, test investment, migration, performance or reliability risk, or unclear.
2. Inspect the repo before you recommend. Read the current implementation, ownership boundaries,
   callers, tests and missing test seams, dependencies, policy signals, and CI/build/deploy constraints.
   Look for comparable precedent elsewhere in the repo.
   If the area is unclear, search for likely symbols, package names, docs, and test files.
3. Compare at least two options when the item contains a real decision.
   Include the status quo when it is plausible.
   If package metadata, CVEs, license, support status, or ecosystem health affects the
   recommendation, verify it from primary and current sources.
4. Make risks concrete: migration, dependency, runtime impact, compatibility,
   observability, rollout and rollback, security, licensing, and test gaps.
5. Recommend one verdict.
6. For `Do` or `Spike`, define the smallest implementation shape and the verification strategy.
   Create a phased implementation plan only when the user asks to continue.
7. Name the next skill: `ticket-discovery`, `phased-delivery`, `simplify`, `retrofit`, `cover`, `bug-to-fix`
   when the item is a defect, or no action.
   On hosts with commands, also name the command: `/ticket-discover`, `/dev-plan`,
   `/implementation-plan`, `/simplify`, `/retrofit`, `/cover-gaps`, `/cover`, or `/bug-intake` for a defect.
   For `Spike`, state the question that the spike answers and its time limit. The repository has no
   spike command, so run the spike as a bounded investigation, then assess the item again.

## Verdicts

- `Do`: value and confidence are high enough to plan implementation now.
- `Defer`: valid work, but timing, risk, dependency, or opportunity cost argues
  against doing it now.
- `Reject`: the item is not worth doing, is already solved, or conflicts with
  current architecture/product direction.
- `Spike`: uncertainty is material and a bounded investigation is cheaper than
  guessing.

## Output and completion

Use `templates/tech-backlog-assessment.md` when creating a durable artifact.
When the user names no path, write it to `.atb-work/tech-backlog-assessment/<scope-slug>.md` and print the path.
Read `shared/contracts/references/execution.md#Durable report location`.
Replace all placeholders before you present it.
The assessment is complete when it states:

- The recommendation and confidence.
- Concrete repo evidence.
- The options considered and the rejected options, including the dependency or library decision when relevant.
- The proposed implementation shape if accepted.
- The test strategy and verification commands.
- Risks, open questions, and the exact next command or workflow.

If required evidence is missing, say what you searched.
Then explain why the recommendation still holds or remains a `Spike`.
