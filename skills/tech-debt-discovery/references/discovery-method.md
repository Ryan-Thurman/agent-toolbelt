# Debt discovery method

Inspect each relevant area and mark it inspected, excluded, or unavailable.
Use history and operational data where available to identify repeated failures, costly changes, and modules that change together.
Treat complexity and coverage metrics as investigation signals.
They cannot establish a defect without a concrete consequence.

For organization candidates, inspect dependency direction, cycles, ownership, public interfaces, and changes that repeatedly cross boundaries.
Compare the current structure with the smallest boundary change that would address the observed cost.
Do not assume that services, extra layers, or additional abstractions improve a working design.

For dependency candidates, inspect installed versions, actual usage, support constraints, and migration work.
Verify current support, advisories, compatibility, and alternatives from primary sources when they affect the decision.
An update within the current library and replacement with another library are separate options.
Keep the current implementation as an explicit option.

Prioritize exposed security or data-integrity problems, recurring failures, and demonstrated delivery or resource costs.
Explain tradeoffs qualitatively when estimates lack evidence.
Do not multiply invented numerical scores.
Account for test gaps, integration work, rollout, recovery, licensing, and dependencies.

Use stable IDs to merge repeated findings.
Preserve accepted, deferred, rejected, and resolved decisions with their supporting revision or period.
For each proposed repair, define a baseline and a result that would demonstrate improvement.
Record when a changed architecture, incident, support deadline, or measurement should reopen the item.
