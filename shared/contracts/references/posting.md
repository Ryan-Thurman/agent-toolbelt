# Posting contract

Use this contract for any pack that performs an outward action: a post or comment
on an external pull-request host, an enqueue, a sync, or an install into another
repository.

## Policy

Posting is outward-facing and opt-in. Outward actions include a post, a comment,
an enqueue, a sync, and an install into another repository.
Each outward action has a report-only or dry-run path. Default output is that
report or dry run, and the path makes no remote write, queue row, or install.
A first trial of a pack uses the report-only or dry-run path. Keep the dry-run
output with the run record.
Post only when the command received the flag that means posting for that pack,
such as `--comment` for `pr-review` or `--post` for `pr-review-reply`.
This file owns the confirmation rule. A flag passed by a caller skill, CI job,
worker, or poller is consent only when the posting rules of this file or of the
pack name that flag as the posting flag. An interactive user who passed the flag
and said "post" has confirmed. In other interactive runs, show a preview and ask
before you write.

## Invariants

- Detect the host with `shared/contracts/references/providers.md`.
- If the target is not a real supported PR, or the host CLI is unavailable,
  degrade to report-only and say why.
- Make posting idempotent with a stable marker or fingerprint so reruns do not
  duplicate comments.
- Anchor line comments to the reviewed diff when possible. If an anchor is
  rejected or no longer in the diff, keep the finding in the summary rather
  than dropping it.
- Suppress low-value noise by default. Post blockers and should-fix findings.
  Include nits only when explicitly requested or when no higher-severity
  findings exist.

Provider-specific payloads, review-thread APIs, and exact CLI calls belong in
the pack that posts.

For a timeout, interrupted response, or missing local receipt, read [operation-retries.md](operation-retries.md).
