# DESC: local SQLite-backed review queue: producers enqueue PRs, a worker claims and runs /pr-review (decoupled, no CI/webhook)
# DEPENDS: pr-review simple-english
pack_review_queue() {
  shared_contract references/human-readable-output.md
  shared_contract references/docs-writing.md
  cmd review-queue-worker
  cmd enqueue-review

  skill review-queue SKILL.md
  skill review-queue bin/review-queue.sh
  skill review-queue references/cli.md
  skill review-queue references/worker.md
}
