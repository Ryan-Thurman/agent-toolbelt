# DESC: PR review round-trip: read reviewer threads, triage, re-review only since-SHA changes, reply per-thread (opt-in posting)
# DEPENDS: simple-english
pack_pr_review_reply() {
  shared_contract references/human-readable-output.md
  shared_contract references/docs-writing.md
  cmd pr-review-reply

  skill pr-review-reply SKILL.md
  skill pr-review-reply references/thread-roundtrip.md
  shared_contract references/providers.md
  shared_contract references/posting.md
  shared_contract references/operation-retries.md
}
