#!/usr/bin/env bash
# Validate the tracked Cursor, Claude Code, and Codex plugin package.

set -e
set -u
set -o pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
command -v node >/dev/null 2>&1 || {
  echo "node is required for cross-host plugin checks" >&2
  exit 1
}
# Each step uses its own temporary folder, so the steps run in parallel.
# Set ATB_CHECK_SERIAL=1 to run them one at a time, for example to debug a failure.
LOG_DIR="$(mktemp -d "${TMPDIR:-/tmp}/agent-toolbelt-checks.XXXXXX")"
trap 'rm -rf "$LOG_DIR"' EXIT

names=()
commands=()
step() {
  names+=("$1")
  shift
  commands+=("$(printf '%q ' "$@")")
}

step release-version     node "$ROOT/scripts/test-release-version.js"
step public-content      node "$ROOT/scripts/check-public-content.js" "$ROOT"
step public-content-test node "$ROOT/scripts/test-public-content.js"
step plugin-package      node "$ROOT/scripts/check-plugin-package.js" "$ROOT"
step execution-contract  python3 "$ROOT/scripts/test-execution-contract.py"
step install-layout      python3 "$ROOT/scripts/test-install-layout.py"
step skill-shape         "$ROOT/scripts/check-skill-shape.sh"
step skill-sync          "$ROOT/scripts/check-skill-sync.sh"
step crap-analysis       "$ROOT/scripts/test-crap-analysis.sh"
step react-rule-scan     python3 "$ROOT/scripts/test-react-rule-scan.py"
step react-rule-routing  python3 "$ROOT/scripts/build-react-rule-routing.py" --check
step writing-rules       python3 "$ROOT/scripts/check-writing-rules.py"
step catalog             "$ROOT/scripts/check-catalog.sh"
step portal              "$ROOT/scripts/check-portal.sh"
# Claude's installed validator checks plugin and marketplace schemas.
if command -v claude >/dev/null 2>&1; then
  step claude-validator  sh -c "claude plugin validate '$ROOT/.claude-plugin/plugin.json' --strict >/dev/null && claude plugin validate '$ROOT/.claude-plugin/marketplace.json' --strict >/dev/null"
else
  echo "warning: claude CLI not found; skipped Claude validator" >&2
fi

run_step() {
  local index="$1"
  local started
  started="$(date +%s)"
  if eval "${commands[$index]}" >"$LOG_DIR/$index.log" 2>&1; then
    echo "ok $(( $(date +%s) - started ))" >"$LOG_DIR/$index.status"
  else
    echo "failed $(( $(date +%s) - started ))" >"$LOG_DIR/$index.status"
  fi
}

started_all="$(date +%s)"
pids=()
for index in "${!names[@]}"; do
  if [ "${ATB_CHECK_SERIAL:-0}" = "1" ]; then
    run_step "$index"
  else
    run_step "$index" &
    pids+=("$!")
  fi
done
for pid in ${pids[@]+"${pids[@]}"}; do
  wait "$pid" || true
done

failed=0
for index in "${!names[@]}"; do
  read -r state seconds <"$LOG_DIR/$index.status"
  if [ "$state" = "ok" ]; then
    printf 'ok: %-20s %ss\n' "${names[$index]}" "$seconds"
  else
    failed=1
    printf 'FAILED: %-16s %ss\n' "${names[$index]}" "$seconds" >&2
    sed 's/^/    /' "$LOG_DIR/$index.log" >&2
  fi
done
echo "Checks finished in $(( $(date +%s) - started_all ))s."
exit "$failed"
