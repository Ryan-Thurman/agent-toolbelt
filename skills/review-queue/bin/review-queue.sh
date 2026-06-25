#!/usr/bin/env bash
# review-queue — a local, SQLite-backed work queue for decoupled PR review.
#
# A *producer* agent (one that just opened/updated a PR) enqueues a review job;
# a *consumer* worker claims jobs one at a time and runs /pr-review on each.
# Pure bash + sqlite3 (ships with macOS / most Linux) — no daemon, no runtime.
#
# Store: $REVIEW_QUEUE_DB, else ~/.review-queue/queue.db (user-global so a
# producer in repo X and a worker session elsewhere share one queue). Override
# per-invocation with --db PATH.
#
# Concurrency: WAL + busy_timeout + BEGIN IMMEDIATE make claim atomic across
# processes (exactly-once). A lease (default 30m) returns a job to the queue if
# a worker dies mid-review; a job that has been attempted MAX_ATTEMPTS times is
# dead-lettered instead of retried forever.
#
# Full contract: skills/review-queue/references/cli.md
set -euo pipefail

DB="${REVIEW_QUEUE_DB:-$HOME/.review-queue/queue.db}"
LEASE_SECS="${REVIEW_QUEUE_LEASE:-1800}"     # 30 min
MAX_ATTEMPTS="${REVIEW_QUEUE_MAX_ATTEMPTS:-3}"

die() { echo "review-queue: $*" >&2; exit 1; }
command -v sqlite3 >/dev/null 2>&1 || die "sqlite3 not found on PATH"

# Double single-quotes for safe interpolation into SQL string literals.
esc() { printf '%s' "${1-}" | sed "s/'/''/g"; }

# Pull --flag value pairs out of "$@" into FLAG_<name> vars; leaves positionals.
# Portable to bash 3.2 (stock macOS): no associative arrays — indirect vars via
# printf -v + ${!ref}. Flag names are sanitized to a valid identifier.
parse_flags() {
  POSITIONAL=()
  local k
  while [ $# -gt 0 ]; do
    case "$1" in
      --db)            DB="$2"; shift 2 ;;
      --db=*)          DB="${1#*=}"; shift ;;
      --*=*)           k="${1%%=*}"; k="${1#--}"; k="${k%%=*}"
                       printf -v "FLAG_$(printf '%s' "$k" | tr -c 'a-zA-Z0-9' '_')" '%s' "${1#*=}"; shift ;;
      --*)             k="$(printf '%s' "${1#--}" | tr -c 'a-zA-Z0-9' '_')"
                       printf -v "FLAG_$k" '%s' "$2"; shift 2 ;;
      *)               POSITIONAL+=("$1"); shift ;;
    esac
  done
}
flag() {
  local ref="FLAG_$(printf '%s' "$1" | tr -c 'a-zA-Z0-9' '_')"
  printf '%s' "${!ref-${2-}}"
}

# JSON query with a busy timeout set via the .timeout dot-command (which, unlike
# `PRAGMA busy_timeout`, emits no result row to pollute the JSON). Reads SQL from
# a positional arg or, if none, from stdin (heredoc) — stdin is slurped once so
# the call is replayable across retries.
#
# busy_timeout handles most WAL contention, but a writer can still get
# SQLITE_BUSY immediately in some cases, so we wrap in a bounded retry with
# randomized backoff (desyncs racing workers). Exactly-once is preserved because
# each attempt is its own BEGIN IMMEDIATE transaction.
sqljson() {
  if [ $# -eq 0 ]; then set -- "$(cat)"; fi   # slurp heredoc → replayable arg
  local attempt=0 out rc
  while :; do
    out="$(sqlite3 -json -cmd ".timeout 10000" "$DB" "$@" 2>&1)"; rc=$?
    if [ "$rc" -eq 0 ] && ! printf '%s' "$out" | grep -qiE 'database is (locked|busy)'; then
      printf '%s' "$out"; return 0
    fi
    attempt=$((attempt + 1))
    if [ "$attempt" -ge 10 ]; then printf '%s' "$out" >&2; return "${rc:-1}"; fi
    sleep "0.$(( (RANDOM % 4) + 1 ))"          # 0.1–0.4s, randomized
  done
}

db_init() {
  mkdir -p "$(dirname "$DB")"
  # Runs on every invocation — needs the same busy timeout as the writes, since
  # PRAGMA journal_mode=WAL is itself a write and would otherwise be the lock
  # point under concurrent first-touch (it raced ahead of the claim's retry).
  sqlite3 -cmd ".timeout 10000" "$DB" >/dev/null 2>&1 <<'SQL'
PRAGMA journal_mode=WAL;
CREATE TABLE IF NOT EXISTS jobs (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  repo          TEXT NOT NULL,
  target        TEXT NOT NULL,          -- PR number/id or branch name
  head_sha      TEXT NOT NULL,          -- idempotency key with (repo,target)
  tier          TEXT,                   -- light|standard|deep, NULL = auto
  reason        TEXT,
  requested_by  TEXT,
  status        TEXT NOT NULL DEFAULT 'pending',  -- pending|claimed|done|dead
  worker        TEXT,
  attempts      INTEGER NOT NULL DEFAULT 0,
  verdict       TEXT,
  findings      INTEGER,
  notes         TEXT,
  created_at    TEXT NOT NULL DEFAULT (datetime('now')),
  claimed_at    TEXT,
  updated_at    TEXT,
  UNIQUE(repo, target, head_sha)
);
SQL
}

cmd_enqueue() {
  local repo target sha tier reason by
  repo="$(esc "$(flag repo)")";   target="$(esc "$(flag target)")"
  sha="$(esc "$(flag sha)")";     tier="$(esc "$(flag tier)")"
  reason="$(esc "$(flag reason)")"; by="$(esc "$(flag by)")"
  [ -n "$repo" ]   || die "enqueue: --repo required"
  [ -n "$target" ] || die "enqueue: --target required"
  [ -n "$sha" ]    || die "enqueue: --sha required (the head SHA is the idempotency key)"
  local tier_sql="NULL"; [ -n "$tier" ] && tier_sql="'$tier'"
  sqljson <<SQL
INSERT INTO jobs(repo,target,head_sha,tier,reason,requested_by,status,updated_at)
  VALUES('$repo','$target','$sha',$tier_sql,'$reason','$by','pending',datetime('now'))
  ON CONFLICT(repo,target,head_sha) DO NOTHING;
SELECT id, status,
  CASE WHEN changes()=0 THEN 'duplicate' ELSE 'enqueued' END AS result
  FROM jobs WHERE repo='$repo' AND target='$target' AND head_sha='$sha';
SQL
}

cmd_claim() {
  local worker; worker="$(esc "$(flag worker "worker")")"
  local lease; lease="$(flag lease "$LEASE_SECS")"
  # One transaction: reap stale leases (dead-letter the maxed-out), then claim
  # the oldest pending and return it. RETURNING gives the claimed row as JSON.
  local out
  out="$(sqljson <<SQL
BEGIN IMMEDIATE;
UPDATE jobs
   SET status = CASE WHEN attempts >= $MAX_ATTEMPTS THEN 'dead' ELSE 'pending' END,
       worker = NULL, updated_at = datetime('now')
 WHERE status='claimed' AND claimed_at < datetime('now', '-$lease seconds');
UPDATE jobs
   SET status='claimed', worker='$worker', claimed_at=datetime('now'),
       attempts=attempts+1, updated_at=datetime('now')
 WHERE id = (SELECT id FROM jobs WHERE status='pending' ORDER BY created_at, id LIMIT 1)
 RETURNING id, repo, target, head_sha, COALESCE(tier,'') AS tier, attempts;
COMMIT;
SQL
)"
  # Normalize "no pending job" to an empty JSON array so callers can always parse.
  printf '%s\n' "${out:-[]}"
}

cmd_complete() {
  local id verdict findings notes
  id="$(esc "${POSITIONAL[0]-$(flag id)}")"
  verdict="$(esc "$(flag verdict)")"; findings="$(flag findings)"; notes="$(esc "$(flag notes)")"
  [ -n "$id" ] || die "complete: job id required"
  local f_sql="NULL"; [[ "$findings" =~ ^[0-9]+$ ]] && f_sql="$findings"
  sqljson <<SQL
UPDATE jobs SET status='done', verdict='$verdict', findings=$f_sql,
  notes='$notes', updated_at=datetime('now')
  WHERE id=$id;
SELECT id, status, changes() AS updated FROM jobs WHERE id=$id;
SQL
}

cmd_requeue() {
  local id notes; id="$(esc "${POSITIONAL[0]-$(flag id)}")"; notes="$(esc "$(flag notes)")"
  [ -n "$id" ] || die "requeue: job id required"
  # Back to pending, unless it has exhausted its attempts → dead-letter.
  sqljson <<SQL
UPDATE jobs
   SET status = CASE WHEN attempts >= $MAX_ATTEMPTS THEN 'dead' ELSE 'pending' END,
       worker = NULL, notes='$notes', updated_at=datetime('now')
 WHERE id=$id;
SELECT id, status FROM jobs WHERE id=$id;
SQL
}

cmd_list() {
  local status; status="$(esc "$(flag status)")"
  local where=""; [ -n "$status" ] && where="WHERE status='$status'"
  sqljson "SELECT id,repo,target,substr(head_sha,1,8) AS sha,COALESCE(tier,'auto') AS tier,status,worker,attempts,verdict,created_at FROM jobs $where ORDER BY created_at, id;"
}

cmd_stats() {
  sqljson "SELECT status, COUNT(*) AS n FROM jobs GROUP BY status ORDER BY status;"
}

main() {
  local sub="${1-}"; shift || true
  parse_flags "$@"
  db_init
  case "$sub" in
    init)     echo '{"ok":true,"db":"'"$DB"'"}' ;;
    enqueue)  cmd_enqueue ;;
    claim)    cmd_claim ;;
    complete) cmd_complete ;;
    requeue|fail) cmd_requeue ;;
    list)     cmd_list ;;
    stats)    cmd_stats ;;
    ""|-h|--help|help)
      cat >&2 <<'USAGE'
review-queue <command> [--db PATH]
  enqueue  --repo R --target T --sha S [--tier light|standard|deep] [--reason X] [--by WHO]
  claim    [--worker W] [--lease SECS]          # atomic; prints the claimed job as JSON ([] if none)
  complete <id> --verdict V [--findings N] [--notes X]
  requeue  <id> [--notes X]                     # back to pending (or dead-letter if attempts exhausted)
  list     [--status pending|claimed|done|dead]
  stats
Store: $REVIEW_QUEUE_DB or ~/.review-queue/queue.db. Full contract: references/cli.md
USAGE
      [ -z "$sub" ] && exit 1 || exit 0 ;;
    *) die "unknown command: $sub (try --help)" ;;
  esac
}
main "$@"
