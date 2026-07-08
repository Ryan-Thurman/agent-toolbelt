# DESC: CRAP analysis — wizard config, single-run orchestration, deterministic review, opt-in refactor
pack_crap_analysis() {
  cmd crap-config
  cmd do-crap-analysis
  cmd crap-refactor

  skill crap-analysis SKILL.md
  skill crap-analysis agents/openai.yaml
  skill crap-analysis bin/crap-analysis.sh
  skill crap-analysis references/config-schema.md
  skill crap-analysis references/report-schema.md
  skill crap-analysis references/cli.md
  skill crap-analysis references/review.md
  skill crap-analysis references/refactor.md
  skill crap-analysis references/scoring.md
  skill crap-analysis fixtures/sample.crap-analysis.json
  skill crap-analysis fixtures/api.report.json
  skill crap-analysis fixtures/api.refactor.md
  shared_contract references/maintainability-taxonomy.md

  template crap-analysis.json
}
