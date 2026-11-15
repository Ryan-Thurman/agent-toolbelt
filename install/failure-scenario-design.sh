#!/usr/bin/env bash
# DESC: failure-scenario cards and staging chaos experiment plans that become BDD and test-first cases
# DEPENDS: bdd-scenarios simple-english
pack_failure_scenario_design() {
  shared_contract references/human-readable-output.md
  shared_contract references/docs-writing.md
  shared_contract references/reliability-checklist.md
  shared_contract references/depth-levels.md
  cmd failure-scenario-design
  skill failure-scenario-design SKILL.md
  skill failure-scenario-design references/scenario-design.md
  skill failure-scenario-design references/bdd-mapping.md
  skill failure-scenario-design references/staging-experiment-plan.md
  template failure-scenario-design.md
}
