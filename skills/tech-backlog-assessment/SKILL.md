---
name: tech-backlog-assessment
description: "Assess technical backlog items before implementation: decide do/defer/reject/spike, compare options such as packages, library switches, or upgrades, define risks, test strategy, and the next workflow."
---

# tech-backlog-assessment

Before you write a response for the user, read
`shared/contracts/references/human-readable-output.md`.
Read `shared/contracts/references/evidence-quality.md` when evaluating the item.

Use this skill when the user has a technical backlog item and needs a decision
memo before implementation.
Report only. Edit files only after the user accepts the recommendation and asks to implement.

Paths beginning `templates/` or `shared/` refer to the Toolbelt root.

Use `ticket-discovery` instead when the ticket is narrow and already names a
precedent to copy or adapt.
Use an available `tech-debt-discovery` to discover repository candidates before selecting an item.
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
7. Name the next workflow: `/ticket-discover`, `/dev-plan`, `/implementation-plan`,
   `/retrofit`, `/cover-gaps`, `/cover`, or no action.

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
