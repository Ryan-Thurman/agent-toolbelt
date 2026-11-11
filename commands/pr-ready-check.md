---
description: Assess whether a change has the evidence needed to open a pull request
argument-hint: "<task-branch-or-diff>"
---

# /pr-ready-check

Assess the current change against the target project's PR requirements.
This is a readiness check. Use `pr-review` for code findings.
This command owns the readiness procedure. No skill restates it.

**Arguments:** `$ARGUMENTS`

1. Collect evidence for each area:

   | Area | Evidence needed | Blocking gap |
   | --- | --- | --- |
   | Scope | The change matches supplied requirements and acceptance criteria. | A requirement or acceptance criterion is not met. |
   | Checks | Required tests and repository checks have current results. | A required check failed or was not run. An unavailable check makes the verdict `Blocked`. |
   | Documentation | Affected documentation is updated, or the report explains why no update is needed. | Affected documentation is not updated, and the report gives no reason. |
   | Branch and PR | The branch, base, dependencies, and review scope follow project policy. | The branch, base, or dependencies break project policy. |
   | Handoff | The summary, risks, remaining issues, and reviewer notes are current. | Not blocking. Report a gap as a note. |

2. Give one verdict with its reasons:

   | Verdict | Use when |
   | --- | --- |
   | `Ready` | No blocking gap remains, and required checks have current passing results. |
   | `Needs Work` | A blocking gap remains, and this phase can fix it. |
   | `Blocked` | Progress needs an outside decision, a dependency, or a check that is not available. |

Keep failed, unavailable, and unrun checks distinct.
Apply project-owned review requirements without creating new approval gates.
A readiness result does not grant merge or release approval.
