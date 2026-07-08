# DESC: tiered multi-agent PR/code review (light/standard/deep): commands (incl. /pr-review-init config generator), skill tree, config sample, examples
pack_pr_review() {
  cmd pr-review
  cmd pr-review-init

  local f
  for f in \
    SKILL.md \
    benchmarks/results.md \
    checklists/README.md checklists/python.md checklists/sql.md checklists/typescript.md \
    facets/_shared.md facets/correctness.md facets/maintainability-deep.md \
    facets/maintainability.md facets/performance.md facets/security.md \
    facets/spec-alignment.md facets/standards.md facets/tests.md \
    references/auto-tier.md references/benchmarking.md references/config-init.md \
    references/deep-tier.md \
    references/dual-judge.md references/fan-out.md references/finding-schema.md \
    references/lang-checklists.md references/output-format.md references/posting.md \
    references/providers.md references/rejection-memory.md references/repo-config.md \
    references/review-rubric.md references/targets-and-diff.md references/rct-acceleration.md
  do
    skill pr-review "$f"
  done

  shared_contract references/maintainability-taxonomy.md

  template pr-review.md

  local e
  for e in \
    README.md ai-code-security.md code-review-best-practices.md \
    code-review-comments-and-tone.md code-review-principles-and-standards.md \
    defect-density.md pr-review-reference.md secure-code-review.md thermo-nuclear-review.md
  do
    example "$e"
  done
}
