# Production readiness

Check that a built service is ready for production with evidence, not with a checklist that someone ticked.
Use this workflow before the first launch of a service, before a launch that adds a hard dependency or a data store,
and after a change to a reliability target.

<!-- BEGIN catalog stages: production-readiness -->
<!-- Generated from catalog/agent-toolbelt.json by scripts/build-workflow-stages.js. Do not edit. -->

| Stage | Skill | Purpose | Next |
| --- | --- | --- | --- |
| 1 | `reliability-review` | Run readiness mode. Mark each reliability requirement Verified, Failed, or Not verified from the SLO, alerts, runbooks, capacity, and restore evidence. | `failure-scenario-design`, `ship-it` |
| 2 | `failure-scenario-design` | Plan staging experiments and game days for the requirements that need platform evidence. Each plan has abort conditions, rollback, and no-go checks. The team that owns the chaos tooling runs it. | `reliability-review`, `ship-it` |
| 3 | `ship-it` | Check release readiness, including the reliability section, and set SLO burn-rate rollback triggers for the rollout. | `product-outcome-review`, `handoff` |
<!-- END catalog stages -->

## Check the evidence

Run `/reliability-review --readiness` on the service and its reliability review.
Each reliability requirement gets `Verified`, `Failed`, or `Not verified`, with evidence.
A tool run that finished is not a pass. The review reads the actual result.
When the service has no reliability review, run `/reliability-review` on its design first, then `--readiness`.

## Plan the missing evidence

Run `/failure-scenario-design --deep` for the requirements that need platform evidence,
for example a dependency outage or a zone failure.
The plans have blast radius, abort conditions, rollback, and no-go checks.
The team that owns the chaos tooling runs them in staging. A production experiment needs written approval.
Run `/reliability-review --readiness` again with the results.

## Release

Run `/ship-it`. Its reliability section uses the requirement statuses.
Each affected journey gets an SLO burn-rate rollback trigger, or the gap is recorded with an owner.
A requirement that is `Failed` or `Not verified` blocks the release only when its owner does not accept the gap.
