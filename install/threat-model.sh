#!/usr/bin/env bash
# DESC: design-time threat modeling for assets, trust boundaries, mitigations, and verification
pack_threat_model() {
  shared_contract references/human-readable-output.md
  shared_contract references/evidence-quality.md
  cmd threat-model
  skill threat-model SKILL.md
  template threat-model.md
}
