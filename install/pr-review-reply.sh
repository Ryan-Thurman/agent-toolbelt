# DESC: PR review round-trip: read reviewer threads, triage, re-review only since-SHA changes, reply per-thread (opt-in posting)
pack_pr_review_reply() {
  cmd pr-review-reply

  skill pr-review-reply SKILL.md
  skill pr-review-reply references/thread-roundtrip.md
}
