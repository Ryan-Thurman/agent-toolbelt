#!/usr/bin/env bash
# DESC: system design documents with linked threat reviews and verification requirements
# DEPENDS: threat-model
pack_system_design() {
  shared_contract references/human-readable-output.md
  shared_contract references/evidence-quality.md
  cmd system-design
  skill system-design SKILL.md
  skill system-design references/design-method.md
  template system-design.md
  workflow system-design-workflow.md
}
