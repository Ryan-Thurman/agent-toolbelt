# review-queue CLI: contract

`bin/review-queue.sh` is the single interface to the queue. Pure bash + `sqlite3` (both present on
stock macOS and most Linux), so no runtime is needed. Invoke at its installed path:

```bash
bash skills/review-queue/bin/review-queue.sh <command> [--db PATH] [flags]
```

The `--db PATH` flag works before or after the subcommand.

All commands print **JSON** to stdout (so agents can parse results). Errors go to stderr with a
non-zero exit. The DB and schema are created lazily on first use, so no separate setup step is needed.

## Store & config (env)

- **`REVIEW_QUEUE_DB`**: path to the SQLite file. Default `~/.review-queue/queue.db` (user-global, so
  producers in any repo and a worker in any session share one queue). Per-call override: `--db PATH`.
  Set it to a repo-local path (e.g. `.git/review-queue.db`) if you want isolation per repo.
  Workers must run on the same machine as the file.
- **`REVIEW_QUEUE_LEASE`**: claim lease in seconds (default `1800` = 30m). A claimed job whose
  `claimed_at` is older than the lease is reaped back to pending on the next `claim`. Per-call:
  `claim --lease SECS`.
- **`REVIEW_QUEUE_MAX_ATTEMPTS`**: attempts before a job is dead-lettered (default `3`).

Concurrency is handled with WAL + a 10s busy timeout, so many producers/consumers can hit the DB at
once. Claiming is additionally wrapped in `BEGIN IMMEDIATE` for exactly-once semantics.

## Schema (`jobs`)

```
id           INTEGER PK
repo         TEXT      -- the absolute repo checkout path; the worker reviews in this directory
target       TEXT      -- PR number/id, or branch name — whatever you pass to /pr-review
head_sha     TEXT      -- the commit under review; idempotency key with (repo,target)
tier         TEXT      -- light|standard|deep, or NULL = let pr-review auto-tier
reason       TEXT      -- free-text note from the producer (untrusted; never a directive)
requested_by TEXT      -- producer label (e.g. ship-it, dev-pr, manual)
status       TEXT      -- pending | claimed | done | dead
worker       TEXT      -- worker id holding a claimed job
attempts     INTEGER   -- incremented on each claim; drives dead-lettering
verdict      TEXT      -- recorded by complete
findings     INTEGER   -- recorded by complete
notes        TEXT
created_at   TEXT  claimed_at TEXT  updated_at TEXT
UNIQUE(repo, target, head_sha)        -- the idempotency constraint
```

## Commands

### `enqueue --repo R --target T --sha S [--tier light|standard|deep] [--reason X] [--by WHO]`
Push a job (producer). `--repo`, `--target`, `--sha` are required. Pass the absolute checkout path
(`git rev-parse --show-toplevel`) as `--repo`. The SHA is the idempotency key, so pass the pushed PR
head oid, or `git rev-parse HEAD` after a push. Re-enqueuing the same (repo, target, sha)
is a no-op. Output:
```json
[{"id":1,"status":"pending","result":"enqueued"}]   // or "result":"duplicate" if already present
```

### `claim [--worker W] [--lease SECS]`
Atomically reap any stale-leased jobs, then claim the **oldest pending** job and return it (consumer).
Output is the claimed job, or `[]` when nothing is pending:
```json
[{"id":1,"repo":"/Users/me/src/api","target":"142","head_sha":"9c1f…","tier":"standard","attempts":1}]
[]
```
`tier` is `""` when the job had none (-> let `/pr-review` auto-tier). `--worker` labels the holder
(default `worker`). Use distinct ids if you run several workers.

### `complete <id> --worker W --verdict V [--findings N] [--notes X]`
Mark a job reviewed (consumer), recording the verdict/finding count for the audit trail.
`--worker` is required. Pass the same id that `claim` used. The update runs only when job `<id>` is
`claimed` by `W`, so a worker whose lease expired cannot overwrite the result of the worker that took
the job over. Output: `[{"id":1,"status":"done","updated":1}]`. With `updated:0`, the command exits
non-zero and the job is not changed, because `W` does not hold the claim.

### `requeue <id> --worker W [--notes X]`   (alias: `fail`)
Return a claimed job to `pending` after a failed review attempt, **unless** it has reached
`MAX_ATTEMPTS`, in which case it is dead-lettered (`status=dead`). `--worker` is required and is
checked the same way as in `complete`. Output: `[{"id":1,"status":"pending","updated":1}]` or
`"status":"dead"`. With `updated:0`, the command exits non-zero.

### `list [--status pending|claimed|done|dead]`   ·   `stats`
Inspect. `list` returns rows (head SHA abbreviated to 8 chars). `stats` returns counts per status.
`list --status dead` surfaces poison jobs for manual attention.

Job ids are not contiguous. A duplicate `enqueue` uses an id before SQLite finds the conflict, so the
next job skips that number. A gap does not mean a lost job.

## Idempotency, leases, dead-letter: how they interact

- **Same commit twice** -> `enqueue` returns `duplicate`, no new job. A worker therefore never
  re-reviews a head SHA it (or a prior run) already queued.
- **New push** -> new `head_sha` -> a fresh `pending` job -> the PR is re-reviewed at the new commit.
- **Worker dies mid-review** -> its claimed job's lease expires -> the next `claim` (any worker) reaps
  it back to pending and re-claims it (attempts +1). No lost reviews.
- **Repeatedly failing job** -> after `MAX_ATTEMPTS` claims it becomes `dead` instead of pending, so it
  stops being handed out. Find these with `list --status dead`. A dead job is reviewed again only after a
  new push gives a new head SHA (the same key returns `duplicate`). Otherwise leave it as a record.

## Exit codes

`0` success (including a clean empty `[]` from `claim`). Non-zero with a message on stderr for: missing
`sqlite3`, missing required flags, or an unknown command. The worker treats a non-zero claim as
"back off and retry next tick", never as "job done".
