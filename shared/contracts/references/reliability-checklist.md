# Reliability checklist

Use these questions to find reliability gaps in a story or a feature plan before work starts.
Apply them only when the change adds or changes one of these triggers: a remote call, a queue,
a scheduled job, a data store, a migration, or deployment configuration.

## Story tier

| ID | Question |
| --- | --- |
| R1 | Which user journey can this change degrade, and which signal shows the degradation? |
| R2 | For each new remote call, what are the timeout and the retry rule? What does the feature do when the dependency is down or slow? |
| R3 | Can each new write or message handler run twice without harm? |
| R4 | What does the user see on a partial failure? |
| R5 | Which failure scenarios are acceptance criteria? A new hard dependency needs at least a "dependency down" and a "dependency slow" criterion. |
| R6 | Which telemetry ships with the change: spans, metrics, or log fields? |
| R7 | Can the migration or configuration change be reversed? How is it rolled back? |
| R8 | Does the change alter expected load or a capacity limit? If it does, who confirms the capacity? |

Record each answer as `Answered`, `Decision needed` with an owner, or `Not applicable` with a reason.
Do not invent a target, such as a timeout value, an availability percentage, or a latency limit.
If the source gives no target, record `Decision needed`.

An unanswered question for a hard dependency or a data change is a readiness warning.
It does not block the work unless the project instructions make it a gate.
Send a question about architecture, topology, or recovery targets to `system-design` and `reliability-review`.
Send a failure scenario that needs more than a unit or integration test to `failure-scenario-design`.
