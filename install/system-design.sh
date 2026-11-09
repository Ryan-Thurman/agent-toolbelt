#!/usr/bin/env bash
# DESC: architecture discussions, design documents, diagrams, and decision records
# DEPENDS: threat-model
pack_system_design() {
  shared_contract references/human-readable-output.md
  shared_contract references/evidence-quality.md
  cmd system-design
  skill system-design SKILL.md
  skill system-design references/design-method.md
  skill system-design references/design-conversation.md
  skill system-design references/architecture-diagrams.md
  skill system-design references/decision-records.md
  skill system-design references/repository-map.md
  template system-design.md
  template architecture-decision-record.md
  workflow system-design-workflow.md
}
