---
description: Assess whether a change has the evidence needed to open a pull request
argument-hint: "<task-branch-or-diff>"
---

# /pr-ready-check

Assess the current change against the target project's PR requirements.
This is a readiness check. Use `pr-review` for code findings.

**Arguments:** `$ARGUMENTS`

| Area | Evidence needed |
| --- | --- |
| Scope | The change matches supplied requirements and acceptance criteria. |
| Checks | Required tests and repository checks have current results. |
| Documentation | Affected documentation is updated, or the report explains why no update is needed. |
| Branch and PR | The branch, base, dependencies, and review scope follow project policy. |
| Handoff | The summary, risks, remaining issues, and reviewer notes are current. |

Give one verdict with its reasons:

| Verdict | Use when |
| --- | --- |
| `Ready` | No Blocking finding remains, and required checks have current passing results. |
| `Needs Work` | A Blocking finding or failed required check remains, and this phase can fix it. |
| `Blocked` | Progress needs an outside decision, a dependency, or a check that is not available. |

Keep failed, unavailable, and unrun checks distinct.
Apply project-owned review requirements without creating new approval gates.
A readiness result does not grant merge or release approval.
