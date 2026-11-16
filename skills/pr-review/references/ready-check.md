# Readiness check

Assess the current change against the target project's PR requirements.
This is a readiness check. Use the review process in `SKILL.md` for code findings.

1. Collect evidence for each area:

   | Area | Evidence needed | Blocking gap |
   | --- | --- | --- |
   | Scope | The change matches supplied requirements and acceptance criteria. | A requirement or acceptance criterion is not met. |
   | Checks | Required tests and repository checks have current results. | A required check failed or was not run. An unavailable check makes the verdict `Blocked`. |
   | Documentation | Affected documentation is updated, or the report explains why no update is needed. | Affected documentation is not updated, and the report gives no reason. |
   | Branch and PR | The branch, base, dependencies, and review scope follow project policy. | The branch, base, or dependencies break project policy. |
   | Handoff | The summary, risks, remaining issues, and reviewer notes are current. | Not blocking. Report a gap as a note. |

2. Run the required checks yourself. Do not collect results from another agent.
   Record each check with its command, exit code, and run date. Keep the
   results `Pass`, `Fail`, and `Not run` distinct.

   The project names its required checks in its CI config or package scripts. When
   the project names none, this file names a default set: the test command, the lint
   command, and the build or type-check command. Record that the default set was used.
   A check with no command in the repository is `Not run`, and the verdict is `Blocked`.

3. Give one verdict with its reasons:

   | Verdict | Use when |
   | --- | --- |
   | `Ready` | No blocking gap remains, and required checks have current passing results. |
   | `Needs Work` | A blocking gap remains, and this phase can fix it. |
   | `Blocked` | Progress needs an outside decision, a dependency, or a check that is not available. |

4. Render the result with this layout:

   ```markdown
   ## Readiness: <target>  ·  **<Ready | Needs Work | Blocked>**

   | Area | Result | Evidence |
   | --- | --- | --- |
   | Scope | Met, Not met, or Not verified | <requirement and file:line> |
   | Checks | Pass, Fail, or Not run | <command, exit code, run date> |
   | Documentation | Updated, Missing, or Not applicable | <file or reason> |
   | Branch and PR | Follows policy, or Breaks policy | <base and dependency facts> |
   | Handoff | Current, or Gap (note only) | <gap> |

   Default checks used: yes or no
   Blocking gaps: <one line each, or None>
   ```

Keep failed, unavailable, and unrun checks distinct.
Apply project-owned review requirements without creating new approval gates.
A readiness result does not grant merge or release approval.
