#!/usr/bin/env bash
# crap-analysis — orchestrate CRAP analysis commands from .crap-analysis.json.
# Pure bash + git + python3 for JSON. No analyzer embedded.
# Invoke as: bash skills/crap-analysis/bin/crap-analysis.sh <op> [args]
# Full contract: skills/crap-analysis/references/cli.md
set -euo pipefail

PROG="crap-analysis"
CONFIG="${CRAP_CONFIG:-.crap-analysis.json}"

die()  { printf '%s: %s\n' "$PROG" "$*" >&2; exit 2; }
note() { printf '%s\n' "$*" >&2; }

command -v git >/dev/null 2>&1    || die "git not found on PATH"
command -v python3 >/dev/null 2>&1 || die "python3 not found on PATH (required for config JSON)"

# --- repo root ---------------------------------------------------------------

repo_root() {
  git rev-parse --show-toplevel 2>/dev/null || die "not inside a git repository"
}

resolve_config() {
  local root="$1" cfg="$2"
  if [ -f "$root/$cfg" ]; then
    printf '%s\n' "$root/$cfg"
    return
  fi
  if [ -f "$root/.atb/crap-analysis.json" ]; then
    printf '%s\n' "$root/.atb/crap-analysis.json"
    return
  fi
  die "config not found: $cfg (run /crap-config first)"
}

# --- python helpers ----------------------------------------------------------

py() {
  python3 - "$@" <<'PY'
import json, sys
from pathlib import Path

def load_config(path):
    with open(path, encoding="utf-8") as f:
        return json.load(f)

def main():
    op = sys.argv[1]
    cfg_path = sys.argv[2]

    if op == "validate":
        try:
            cfg = load_config(cfg_path)
        except (OSError, json.JSONDecodeError) as e:
            print(f"invalid config: {e}", file=sys.stderr)
            sys.exit(2)
        if cfg.get("version") != 1:
            print("version must be 1", file=sys.stderr)
            sys.exit(2)
        if cfg.get("$schema") != "agent-toolbelt/crap-analysis/v1":
            print("$schema must be agent-toolbelt/crap-analysis/v1", file=sys.stderr)
            sys.exit(2)
        targets = cfg.get("targets") or {}
        if not targets:
            print("targets must be non-empty", file=sys.stderr)
            sys.exit(2)
        for name, t in targets.items():
            for field in ("src", "commands", "outputs"):
                if field not in t:
                    print(f"target {name}: missing {field}", file=sys.stderr)
                    sys.exit(2)
            cmds = t["commands"]
            for cmd in ("analysis", "verify"):
                if not cmds.get(cmd):
                    print(f"target {name}: missing commands.{cmd}", file=sys.stderr)
                    sys.exit(2)
            outs = t["outputs"]
            for out in ("report", "refactorBrief"):
                if not outs.get(out):
                    print(f"target {name}: missing outputs.{out}", file=sys.stderr)
                    sys.exit(2)
        sys.exit(0)

    if op == "list-targets":
        cfg = load_config(cfg_path)
        for name in sorted((cfg.get("targets") or {}).keys()):
            print(name)
        return

    if op == "target-src":
        cfg = load_config(cfg_path)
        name = sys.argv[3]
        t = (cfg.get("targets") or {}).get(name)
        if not t:
            print(f"unknown target: {name}", file=sys.stderr)
            sys.exit(2)
        print(t["src"])
        return

    if op == "get-threshold":
        cfg = load_config(cfg_path)
        defaults = cfg.get("defaults") or {}
        threshold = defaults.get("threshold", 30)
        if not isinstance(threshold, (int, float)) or threshold <= 0:
            threshold = 30
        print(int(threshold) if threshold == int(threshold) else threshold)
        return

    if op == "resolve-command":
        cfg = load_config(cfg_path)
        name, kind = sys.argv[3], sys.argv[4]
        t = (cfg.get("targets") or {}).get(name)
        if not t:
            print(f"unknown target: {name}", file=sys.stderr)
            sys.exit(2)
        cmd = (t.get("commands") or {}).get(kind)
        if not cmd:
            sys.exit(3)
        print(cmd)
        return

    if op == "resolve-output":
        cfg = load_config(cfg_path)
        name, kind = sys.argv[3], sys.argv[4]
        t = (cfg.get("targets") or {}).get(name)
        if not t:
            print(f"unknown target: {name}", file=sys.stderr)
            sys.exit(2)
        out = (t.get("outputs") or {}).get(kind)
        if not out:
            print(f"missing output {kind} for target {name}", file=sys.stderr)
            sys.exit(2)
        print(out)
        return

    if op == "targets-for-changes":
        cfg = load_config(cfg_path)
        changed = sys.argv[3:]
        targets = cfg.get("targets") or {}
        matched = []
        for name in sorted(targets.keys()):
            src = targets[name]["src"].rstrip("/") + "/"
            for path in changed:
                norm = path.replace("\\", "/")
                if norm == targets[name]["src"].rstrip("/") or norm.startswith(src):
                    matched.append(name)
                    break
        for name in matched:
            print(name)
        return

    if op == "build-result":
        run_id = sys.argv[2]
        targets = [json.loads(x) for x in sys.argv[3:]]
        print(json.dumps({"runId": run_id, "targets": targets}, indent=2))
        return

    if op == "build-target-result":
        name = sys.argv[2]
        cov_ran = sys.argv[3] == "true"
        cov_ec = None if sys.argv[4] == "null" else int(sys.argv[4])
        anal_ec = int(sys.argv[5])
        report = sys.argv[6]
        brief = sys.argv[7]
        stderr_file = sys.argv[8] if len(sys.argv) > 8 and sys.argv[8] else ""
        failed = sys.argv[9] if len(sys.argv) > 9 else ""
        blob = {
            "name": name,
            "coverage": {"ran": cov_ran, "exitCode": cov_ec},
            "analysis": {"ran": failed != "coverage", "exitCode": anal_ec if failed != "coverage" else None},
            "outputs": {"report": report, "refactorBrief": brief},
        }
        if failed:
            blob["failed"] = failed
            if stderr_file:
                try:
                    with open(stderr_file, encoding="utf-8") as f:
                        tail = f.read()[-2000:]
                except OSError:
                    tail = ""
                if failed == "coverage":
                    blob["coverage"]["stderr"] = tail
                else:
                    blob["analysis"]["stderr"] = tail
        elif anal_ec not in (0, 1) and stderr_file:
            try:
                with open(stderr_file, encoding="utf-8") as f:
                    blob["analysis"]["stderr"] = f.read()[-2000:]
            except OSError:
                pass
            blob["failed"] = "analysis"
        print(json.dumps(blob))
        return

    if op == "build-verify-result":
        target = sys.argv[2]
        ec = int(sys.argv[3])
        report = sys.argv[4]
        brief = sys.argv[5]
        print(json.dumps({
            "target": target,
            "verify": {"ran": True, "exitCode": ec},
            "outputs": {"report": report, "refactorBrief": brief},
        }, indent=2))
        return

    if op == "worst-exit":
        codes = [int(x) for x in sys.argv[2:]]
        print(1 if any(c == 1 for c in codes) else 0)
        return

    print(f"unknown py op: {op}", file=sys.stderr)
    sys.exit(2)

if __name__ == "__main__":
    main()
PY
}

# --- ops ---------------------------------------------------------------------

cmd_changed() {
  local root
  root="$(repo_root)"
  cd "$root"
  {
    git diff --name-only 2>/dev/null || true
    git diff --cached --name-only 2>/dev/null || true
  } | sort -u
}

cmd_targets_for_changes() {
  local root cfg_path
  root="$(repo_root)"
  cfg_path="$(resolve_config "$root" "$CONFIG")"
  local -a changed=()
  while IFS= read -r line; do
    [ -n "$line" ] && changed+=("$line")
  done < <(cmd_changed)
  if [ "${#changed[@]}" -eq 0 ]; then
    return 0
  fi
  py targets-for-changes "$cfg_path" "${changed[@]}"
}

cmd_validate_config() {
  local root cfg_path
  root="$(repo_root)"
  cfg_path="$(resolve_config "$root" "$CONFIG")"
  py validate "$cfg_path"
  note "config valid: $cfg_path"
}

append_threshold_flag() {
  local cmd="$1" threshold="$2"
  if [[ "$cmd" == *"--threshold"* ]]; then
    printf '%s\n' "$cmd"
  else
    printf '%s --threshold %s\n' "$cmd" "$threshold"
  fi
}

run_command() {
  local label="$1" cmd="$2" stderr_file="$3"
  note "running $label: $cmd"
  set +e
  eval "$cmd" >/dev/null 2>"$stderr_file"
  local ec=$?
  set -e
  printf '%s' "$ec"
}

build_target_blob() {
  local name="$1" cov_ran="$2" cov_ec="$3" anal_ec="$4" report="$5" brief="$6"
  local stderr_file="${7:-}" failed="${8:-}"
  py build-target-result "$name" "$cov_ran" "$cov_ec" "$anal_ec" "$report" "$brief" "$stderr_file" "$failed"
}

cmd_execute() {
  local with_coverage=0 target_filter="" use_changed=0
  while [ $# -gt 0 ]; do
    case "$1" in
      --config)      CONFIG="${2:-}"; shift 2 ;;
      --config=*)    CONFIG="${1#--config=}"; shift ;;
      --coverage)    with_coverage=1; shift ;;
      --target)      target_filter="${2:-}"; shift 2 ;;
      --target=*)    target_filter="${1#--target=}"; shift ;;
      --changed)     use_changed=1; shift ;;
      -*)            die "unknown flag for execute: $1" ;;
      *)             die "unexpected argument: $1" ;;
    esac
  done

  local root cfg_path run_id tmpdir
  root="$(repo_root)"
  cfg_path="$(resolve_config "$root" "$CONFIG")"
  py validate "$cfg_path" || die "invalid config"
  run_id="$(git -C "$root" rev-parse --short HEAD 2>/dev/null || echo "local")"
  tmpdir="$(mktemp -d)"
  trap 'rm -rf "$tmpdir"' EXIT

  local -a targets=()
  if [ -n "$target_filter" ]; then
    targets=("$target_filter")
  elif [ "$use_changed" -eq 1 ]; then
    while IFS= read -r t; do
      [ -n "$t" ] && targets+=("$t")
    done < <(cmd_targets_for_changes)
    if [ "${#targets[@]}" -eq 0 ]; then
      note "no targets affected by uncommitted changes"
      py build-result "$run_id"
      exit 0
    fi
  else
    while IFS= read -r t; do
      [ -n "$t" ] && targets+=("$t")
    done < <(py list-targets "$cfg_path")
  fi

  cd "$root"
  local threshold
  threshold="$(py get-threshold "$cfg_path")"
  local -a result_blobs=()

  for name in "${targets[@]}"; do
    local cov_ran="false" cov_ec="null" anal_ec stderr_cov stderr_anal report brief
    stderr_cov="$tmpdir/${name}.coverage.stderr"
    stderr_anal="$tmpdir/${name}.analysis.stderr"

    if [ "$with_coverage" -eq 1 ]; then
      local cov_cmd
      cov_cmd="$(py resolve-command "$cfg_path" "$name" coverage 2>/dev/null || true)"
      if [ -n "$cov_cmd" ]; then
        cov_ran="true"
        cov_ec="$(run_command "coverage ($name)" "$cov_cmd" "$stderr_cov")"
        if [ "$cov_ec" -ne 0 ]; then
          note "coverage failed for $name (exit $cov_ec)"
          report="$(py resolve-output "$cfg_path" "$name" report)"
          brief="$(py resolve-output "$cfg_path" "$name" refactorBrief)"
          result_blobs+=("$(build_target_blob "$name" "$cov_ran" "$cov_ec" "0" "$report" "$brief" "$stderr_cov" "coverage")")
          py build-result "$run_id" "${result_blobs[@]}"
          exit 2
        fi
      fi
    fi

    local anal_cmd
    anal_cmd="$(append_threshold_flag "$(py resolve-command "$cfg_path" "$name" analysis)" "$threshold")"
    anal_ec="$(run_command "analysis ($name)" "$anal_cmd" "$stderr_anal")"
    report="$(py resolve-output "$cfg_path" "$name" report)"
    brief="$(py resolve-output "$cfg_path" "$name" refactorBrief)"

    local failed=""
    if [ "$anal_ec" -ne 0 ] && [ "$anal_ec" -ne 1 ]; then
      failed="analysis"
    fi
    result_blobs+=("$(build_target_blob "$name" "$cov_ran" "$cov_ec" "$anal_ec" "$report" "$brief" "$stderr_anal" "$failed")")

    if [ -n "$failed" ]; then
      note "analysis tooling error for $name (exit $anal_ec)"
      py build-result "$run_id" "${result_blobs[@]}"
      exit 2
    fi
  done

  py build-result "$run_id" "${result_blobs[@]}"
  local -a exit_codes=()
  for blob in "${result_blobs[@]}"; do
    exit_codes+=("$(python3 -c "import json,sys; print(json.loads(sys.argv[1])['analysis']['exitCode'])" "$blob")")
  done
  exit "$(py worst-exit "${exit_codes[@]}")"
}

cmd_verify() {
  local target_filter=""
  while [ $# -gt 0 ]; do
    case "$1" in
      --config)      CONFIG="${2:-}"; shift 2 ;;
      --config=*)    CONFIG="${1#--config=}"; shift ;;
      --target)      target_filter="${2:-}"; shift 2 ;;
      --target=*)    target_filter="${1#--target=}"; shift ;;
      -*)            die "unknown flag for verify: $1" ;;
      *)             die "unexpected argument: $1" ;;
    esac
  done
  [ -n "$target_filter" ] || die "usage: $PROG verify --target <name>"

  local root cfg_path tmpdir stderr_file
  root="$(repo_root)"
  cfg_path="$(resolve_config "$root" "$CONFIG")"
  py validate "$cfg_path" || die "invalid config"
  tmpdir="$(mktemp -d)"
  trap 'rm -rf "$tmpdir"' EXIT
  stderr_file="$tmpdir/verify.stderr"

  local threshold verify_cmd
  threshold="$(py get-threshold "$cfg_path")"
  verify_cmd="$(append_threshold_flag "$(py resolve-command "$cfg_path" "$target_filter" verify)" "$threshold")"
  local ec
  cd "$root"
  ec="$(run_command "verify ($target_filter)" "$verify_cmd" "$stderr_file")"
  report="$(py resolve-output "$cfg_path" "$target_filter" report)"
  brief="$(py resolve-output "$cfg_path" "$target_filter" refactorBrief)"

  py build-verify-result "$target_filter" "$ec" "$report" "$brief"
  if [ "$ec" -ne 0 ] && [ "$ec" -ne 1 ]; then exit 2; fi
  exit "$ec"
}

cmd_report_path() {
  local target="$1"
  local root cfg_path
  root="$(repo_root)"
  cfg_path="$(resolve_config "$root" "$CONFIG")"
  py resolve-output "$cfg_path" "$target" report
}

usage() {
  cat >&2 <<EOF
$PROG — orchestrate CRAP analysis from .crap-analysis.json

usage:
  $PROG validate-config [--config PATH]
  $PROG changed
  $PROG targets-for-changes [--config PATH]
  $PROG report-path <target> [--config PATH]
  $PROG execute [--config PATH] [--coverage] [--target NAME] [--changed]
  $PROG verify --target NAME [--config PATH]

Human status on stderr; machine JSON on stdout for execute/verify.
Exit: 0 pass, 1 threshold exceeded (analysis/verify), 2 config/tooling error.
EOF
}

op="${1:-}"; [ $# -gt 0 ] && shift || true
case "$op" in
  validate-config|validate) cmd_validate_config "$@" ;;
  changed)                  cmd_changed "$@" ;;
  targets-for-changes)      cmd_targets_for_changes "$@" ;;
  report-path)              [ $# -ge 1 ] || die "usage: $PROG report-path <target>"
                            cmd_report_path "$1" ;;
  execute)                  cmd_execute "$@" ;;
  verify)                   cmd_verify "$@" ;;
  -h|--help|help|"")        usage ;;
  *)                        die "unknown op: $op (try: execute, verify, validate-config, changed)" ;;
esac
