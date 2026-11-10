# DESC: auto-review trigger for pr-review: host-agnostic poller (/loop or /schedule) + GitHub Actions event template
# DEPENDS: pr-review simple-english
pack_review_on_open() {
  shared_contract references/human-readable-output.md
  shared_contract references/docs-writing.md
  cmd review-on-open

  skill review-on-open SKILL.md
  skill review-on-open references/poller.md
  skill review-on-open references/ci-event.md
  shared_contract references/providers.md
  shared_contract references/posting.md
  shared_contract references/operation-retries.md

  template review-on-open-github.yml
}
