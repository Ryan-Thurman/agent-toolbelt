# Posting Contract

Use this contract for any pack that writes comments or replies to an external
pull-request host.

## Policy

Posting is outward-facing and opt-in. Default output is a local report or dry
run. Post only when the command received the flag that means posting for that
pack, such as `--comment` for `pr-review` or `--post` for `pr-review-reply`.
This file owns the confirmation rule. A flag passed by a caller skill, CI job,
worker, or poller counts as confirmed. An interactive user who passed the flag and
said "post" has confirmed. In other interactive runs, show a preview and ask before
you write.

## Invariants

- Detect the host with `shared/contracts/references/providers.md`.
- If the target is not a real supported PR, or the host CLI is unavailable,
  degrade to report-only and say why.
- Make posting idempotent with a stable marker or fingerprint so reruns do not
  duplicate comments.
- Anchor line comments to the reviewed diff when possible; if an anchor is
  rejected or no longer in the diff, keep the finding in the summary rather
  than dropping it.
- Suppress low-value noise by default. Post blockers and should-fix findings;
  include nits only when explicitly requested or when no higher-severity
  findings exist.

Provider-specific payloads, review-thread APIs, and exact CLI calls belong in
the pack that posts.

For a timeout, interrupted response, or missing local receipt, read [operation-retries.md](operation-retries.md).
