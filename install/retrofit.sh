# DESC: apply one defined change across every site (library swap, API rename, upgrade): discover/transform/verify
# DEPENDS: simple-english
pack_retrofit() {
  shared_contract references/human-readable-output.md
  shared_contract references/docs-writing.md
  cmd retrofit

  skill retrofit SKILL.md
  skill retrofit references/discover-and-slice.md
  skill retrofit references/transform-and-verify.md

  template retrofit-plan.md

  workflow retrofit-workflow.md
}
