# DESC: technical backlog decision workflow: do/defer/reject/spike, options, dependency choices, risks, tests
pack_tech_backlog_assessment() {
  cmd tech-assess

  skill tech-backlog-assessment SKILL.md
  skill tech-backlog-assessment references/version-delta.md
  shared_contract references/human-readable-output.md
  shared_contract references/evidence-quality.md

  template tech-backlog-assessment.md

  workflow tech-backlog-assessment-workflow.md
}
