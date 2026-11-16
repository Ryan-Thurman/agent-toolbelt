#!/usr/bin/env bash
# DESC: architecture discussions, design documents, diagrams, and decision records
# DEPENDS: threat-model reliability-review simple-english
pack_system_design() {
  shared_contract references/human-readable-output.md
  shared_contract references/docs-writing.md
  shared_contract references/evidence-quality.md
  shared_contract references/depth-levels.md
  shared_contract references/right-sizing.md
  shared_contract references/execution.md
  cmd system-design
  skill system-design SKILL.md
  skill system-design references/design-method.md
  skill system-design references/design-conversation.md
  skill system-design references/architecture-diagrams.md
  skill system-design references/decision-records.md
  skill system-design references/repository-map.md
  skill system-design references/interface-contracts.md
  skill system-design references/data-design.md
  skill system-design references/domain-language.md
  skill system-design references/distributed-workflows.md
  skill system-design references/estimation.md
  skill system-design references/design-review.md
  skill system-design references/upstream-attribution.md
  template system-design.md
  template architecture-decision-record.md
  workflow system-design-workflow.md
}
