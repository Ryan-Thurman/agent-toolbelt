---
name: tech-backlog-assessment
description: Assess technical backlog items before implementation: decide do/defer/reject/spike, compare options such as packages or library switches, define risks, test strategy, and the next workflow.
---

# tech-backlog-assessment

Use this skill when the user has a technical backlog item and needs a decision
memo before implementation. The work is discovery and recommendation, not code
changes.

## Mutation Policy

Default: report-only.
Edit files only when the user explicitly asks to implement after accepting the
recommendation.
Do not change code while producing the assessment memo.

## Scope

Good fits:

- Should we import a package, keep custom code, or switch libraries?
- Is this technical debt item worth doing now?
- What is the safest approach to a migration, upgrade, or test investment?
- How should we test and roll out this technical change?

Use `ticket-discovery` instead when the ticket is narrow and already names a
precedent to copy or adapt.

## Workflow

```text
Backlog item
↓
Classify decision type
↓
Repo investigation
↓
Options analysis
↓
Recommendation: Do / Defer / Reject / Spike
↓
Implementation shape + test strategy
↓
Next workflow handoff
```

## Rules

- Repo-first: inspect code, tests, package files, CI, docs, and nearby patterns
  before recommending.
- Decision-first: the primary output is a recommendation and rationale, not a
  task list.
- Compare plausible options. Include status quo when it might be the right
  answer.
- Make risks concrete: migration risk, dependency risk, runtime impact,
  compatibility, observability, rollback, security, licensing, and test gaps.
- If current package metadata, CVEs, license, support status, or ecosystem health
  affects the recommendation, verify it from primary/current sources.

## Investigation Checklist

- Current implementation and ownership boundaries.
- Existing dependencies and repo policy signals.
- Existing tests and missing test seams.
- Callers, consumers, and integration points.
- CI/build/deploy constraints.
- Rollout and rollback constraints.
- Comparable precedent elsewhere in the repo.

## Verdicts

- `Do`: value and confidence are high enough to plan implementation now.
- `Defer`: valid work, but timing, risk, dependency, or opportunity cost argues
  against doing it now.
- `Reject`: the item is not worth doing, is already solved, or conflicts with
  current architecture/product direction.
- `Spike`: uncertainty is material and a bounded investigation is cheaper than
  guessing.

## Output

Use `templates/tech-backlog-assessment.md` when creating a durable artifact.
Always include:

- Recommendation and confidence.
- Repo evidence.
- Options considered.
- Dependency/library decision when relevant.
- Proposed implementation shape if accepted.
- Test strategy and verification commands.
- Risks, open questions, and next workflow.

Completion criterion: the assessment is done only when it states confidence,
rejected options, concrete repo evidence, test strategy, risks, and the next
workflow. If any required evidence is missing, say what was searched and why the
recommendation still holds or remains a `Spike`.
