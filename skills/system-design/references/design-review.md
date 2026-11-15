# Design review

Read this only at the Deep level: when a person asks for a design review, or when the project instructions require one.
For a high-risk design at the Standard level, suggest this review in the handoff. Do not run it without a request.
The review reports findings. It does not change the design.

## Lenses

Run each lens as a separate subagent when the host supports subagents.
Give each subagent the design and its requirements, but not your own conclusions.
A lens must not see the findings of another lens. If the host has no subagents,
run the lenses yourself one after another, and label the result `Self-review`.

| Lens | Checks |
| --- | --- |
| Architecture | Each boundary follows a domain seam. The design is the simplest one that meets the requirements, and it reuses what exists. Each piece of state has one owner. Each decision states what it solves, what it makes worse, and when to change it. |
| Data and contracts | The breaking-change rules in `interface-contracts.md` are checked. Every state-changing call is safe to retry. Schema changes use the add, migrate, and remove steps. The source of truth is named. |
| Security | Use the linked `threat-model` report. Check that authorization applies at each entry point, sensitive data is classified, and tenant boundaries are clear. |
| SRE | Trace one dependency outage from start to end. Only one layer retries, and deadlines pass downstream. The design survives the loss of its largest failure domain. Rollback is possible. |
| QA | Each important scenario links to a test. A failure that is silent, not handled, and not tested is a critical gap. Each saga step has a test that makes it fail. |
| Product | The real problem and the cost of doing nothing are stated. Exclusions are listed. Terms match the glossary. |

Add a challenger lens for a pre-mortem: assume that the design failed a year after release, and list the most likely causes.
Add a developer-experience lens for a public API: a new caller can use it from the documentation alone.

## Conflict check

Give a fresh subagent the design only. It tries to describe two parts, built by two teams,
that follow every recorded decision and still do not work together.
Each conflict that it finds is a decision that the design is missing.

## Merge

Merge the findings. Two lenses with the same finding is a stronger signal.
Give each finding the design section, the condition, and the consequence.
Sort the findings by consequence. Do not score the design with a number, and do not set a minimum number of findings.
