# Debt discovery method

Inspect each relevant area and mark it inspected, excluded, or unavailable.
Use history and operational data where available to identify repeated failures, costly changes, and modules that change together.
Treat complexity, coverage, file size, change frequency, and library age as investigation signals.
They cannot establish debt without a concrete consequence.

For organization candidates, inspect dependency direction, cycles, ownership, public interfaces, and changes that repeatedly cross boundaries.
Compare the current structure with the smallest boundary change that can address the observed cost.
Do not assume that services, extra layers, or additional abstractions improve a working design.

For dependency candidates, inspect installed versions, actual usage, support constraints, and migration work.
Verify current support, advisories, compatibility, and alternatives from primary sources when they affect the decision.
For each advisory, record whether the vulnerable package is in the build artifact or the installed dependency tree.
Record whether the code path that calls it is reachable from an input. Record an advisory with no reachable path as
`Exists, not reachable`, and name the search that found no path. Read the advisory text before you call it relevant.
An update within the current library and replacement with another library are separate options.
Keep the current implementation as an explicit option.

Prioritize exposed security or data-integrity problems, recurring failures, and demonstrated delivery or resource costs.
Explain tradeoffs qualitatively when estimates lack evidence.
Do not multiply invented numerical scores.
Account for test gaps, integration work, rollout, recovery, licensing, and dependencies.

Use stable IDs to merge repeated findings.
Preserve accepted, deferred, rejected, and resolved decisions with their supporting revision or period.
For each proposed repair, define a baseline and a result that will demonstrate improvement.
Record what reopens the item: a changed architecture, incident, support deadline, or measurement.
