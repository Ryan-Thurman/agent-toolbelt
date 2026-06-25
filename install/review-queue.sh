# DESC: local SQLite-backed review queue: producers enqueue PRs, a worker claims and runs /pr-review (decoupled, no CI/webhook)
pack_review_queue() {
  cmd review-queue-worker
  cmd enqueue-review

  skill review-queue SKILL.md
  skill review-queue bin/review-queue.sh
  skill review-queue references/cli.md
  skill review-queue references/worker.md
}
