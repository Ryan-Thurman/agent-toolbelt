#!/usr/bin/env bash
# DESC: draft risk areas (high-impact paths) for one repo or a folder of repos; apply approved entries
# DEPENDS: simple-english
pack_risk_area_mapping() {
  shared_contract references/human-readable-output.md
  shared_contract references/docs-writing.md
  shared_contract references/risk-areas.md
  cmd risk-areas
  skill risk-area-mapping SKILL.md
  skill risk-area-mapping references/signals.md
  skill risk-area-mapping references/sweep-fan-out.md
  template risk-areas-review.md
  workflow risk-based-testing-workflow.md
}
