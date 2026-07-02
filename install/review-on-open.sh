# DESC: auto-review trigger for pr-review: host-agnostic poller (/loop or /schedule) + GitHub Actions event template
pack_review_on_open() {
  cmd review-on-open

  skill review-on-open SKILL.md
  skill review-on-open references/poller.md
  skill review-on-open references/ci-event.md
  shared_contract references/providers.md
  shared_contract references/posting.md

  template review-on-open-github.yml
}
