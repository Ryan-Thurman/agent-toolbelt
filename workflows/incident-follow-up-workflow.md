# Incident follow-up

Turn an incident into a fix and into tests that keep the failure from coming back.
Start this workflow after the incident is mitigated. Mitigation comes first and is outside this workflow.

<!-- BEGIN catalog stages: incident-follow-up -->
<!-- Generated from catalog/agent-toolbelt.json by scripts/build-workflow-stages.js. Do not edit. -->

| Stage | Skill | Purpose | Next |
| --- | --- | --- | --- |
| 1 | `bug-to-fix` | Reproduce the defect behind the incident, find the root cause, and fix it after a failing regression test. Mitigate a live incident before this stage. | `reliability-review`, `pr-review` |
| 2 | `reliability-review` | Add the failure mode to the register. Record the missing detection, recovery, or SLO coverage as testable requirements. | `failure-scenario-design` |
| 3 | `failure-scenario-design` | Turn the failure mode into scenario cards at the lowest level that proves the fix and the recovery. | `test-case-design`, `bdd-scenarios` |
| 4 | `test-case-design` | Plan regression and failure cases for the fix and the code next to it. | `cover` |
| 5 | `cover` | Pin the fixed behavior and the neighboring paths. | `pr-review` |
<!-- END catalog stages -->

## Fix the root cause

Run `/bug-intake`, then `/reproduce`, then `/rca`, then the fix in `bug-to-fix`.
The first test captures the confirmed symptom and fails before the fix.
Use `/rca --diagnose` when the team wants the analysis before anyone edits code.

## Record the failure mode

Run `/reliability-review` on the affected service. Add the incident's failure mode to the register.
Record what the system did not detect, did not contain, or did not recover from as testable requirements.
Record missing SLOs or alerts with an owner. Do not choose a target.

## Prove detection and recovery

Run `/failure-scenario-design` for the new requirements. Each card states the fault, the steady state,
and the lowest level that proves the behavior: a unit fake, a fault proxy, a BDD scenario, or a staging experiment.
Give the Given/When/Then cards to `/bdd-scenarios`.
Run `/test-case-design` on the fix, then `/cover` to write the tests.

## Update the risk areas

When the incident was in code that the risk-area list does not cover, run `/risk-areas` again.
The team approves the new entry through a normal pull request.
