# Failure scenarios: <system or change>

Source: <reliability review, story, or plan>
Environment: Staging. Production approval reference: <none, or the reference>

## FS-001: <short name>

| Field | Content |
| --- | --- |
| Links | REL ID, journey, story or criterion |
| Hypothesis | When <fault> affects <target>, <journey SLI> stays within <tolerance>, and <expected behavior>. |
| Steady state | Signal, source, baseline window, tolerance. `Conditional` if the signal does not exist. |
| Fault | Type, size, duration, target, scope. |
| Current behavior | What the system does now for this fault, with its source: a code path, a test, or a run. `Not known` when no source exists. |
| Verification level | Unit, Integration, Contract, End-to-end, Staging experiment, or Game day |
| Target and scope | Staging experiment and game day only. |
| Blast radius | Staging experiment and game day only. |
| Duration | Staging experiment and game day only. |
| Abort conditions | Staging experiment and game day only. |
| Rollback | Staging experiment and game day only. |
| Owner and observers | Staging experiment and game day only. |
| No-go check | Staging experiment and game day only. Each no-go condition in `staging-experiment-plan.md` is clear. |
| Test-first case | Test name, seam, and assertion. |
| Result | `Not run`, `Supported`, `Contradicted`, `Inconclusive`, or `Blocked`, with evidence. `Blocked` names the missing steady-state signal or the no-go condition that stopped the run. |

```gherkin
@FS-001 @integration @negative @REL-003
Scenario: <name>
  Given <steady state and preconditions>
  When <fault>
  Then <expected behavior>
  And <detection and recovery>
```

Copy the card for each scenario.
