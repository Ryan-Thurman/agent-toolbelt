#!/usr/bin/env bash
# DESC: design-time threat modeling for assets, trust boundaries, mitigations, and verification
pack_threat_model() {
  cmd threat-model
  skill threat-model SKILL.md
  skill threat-model references/model-method.md
  template threat-model.md
}
