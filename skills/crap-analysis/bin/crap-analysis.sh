#!/usr/bin/env bash
# crap-analysis — orchestrate CRAP analysis commands from .crap-analysis.json.
# Bash + git + python3 (JSON only). No analyzer is embedded: the repository's
# configured commands compute CRAP scores and write the report.
# Invoke as: bash skills/crap-analysis/bin/crap-analysis.sh <op> [args]
# Full contract: skills/crap-analysis/references/cli.md
set -euo pipefail

PROG="crap-analysis"
CONFIG_OVERRIDE="${CRAP_CONFIG:-}"
BASE_OVERRIDE="${CRAP_BASE:-}"
WORK_REL=".atb-work/crap-analysis"

ROOT=""
BASE_REF=""
MERGE_BASE=""
CFG_PATH=""
CFG_SOURCE=""
CFG_REPO_PATH=""
CFG_CHANGED="null"
RUN_TMP=""
RUN_EC=0

die()  { printf '%s: %s\n' "$PROG" "$*" >&2; exit 2; }
note() { printf '%s\n' "$*" >&2; }

cleanup() { if [ -n "$RUN_TMP" ]; then rm -rf "$RUN_TMP"; fi; }
trap cleanup EXIT

command -v git >/dev/null 2>&1     || die "git not found on PATH"
command -v python3 >/dev/null 2>&1 || die "python3 not found on PATH (required for JSON)"

# --- python helpers ----------------------------------------------------------

py() {
  python3 - "$@" <<'PY'
import json, os, shlex, sys

SCHEMA = "agent-toolbelt/crap-analysis/v1"
RANK = {"PASS": 0, "WARN": 1, "REFACTOR": 2, "ERROR": 3}


def fail(msg):
    print(msg, file=sys.stderr)
    sys.exit(2)


def no_dupes(pairs):
    seen = {}
    for key, value in pairs:
        if key in seen:
            raise ValueError(f"duplicate key: {key}")
        seen[key] = value
    return seen


def load_json(path):
    with open(path, encoding="utf-8") as f:
        return json.load(f, object_pairs_hook=no_dupes)


def is_num(v):
    return isinstance(v, (int, float)) and not isinstance(v, bool)


def is_int(v):
    return isinstance(v, int) and not isinstance(v, bool)


def bad_rel_path(p):
    if not isinstance(p, str) or not p.strip():
        return True
    norm = p.replace("\\", "/")
    return norm.startswith("/") or ".." in norm.split("/")


def norm_src(src):
    s = src.replace("\\", "/").strip()
    while s.startswith("./"):
        s = s[2:]
    s = s.rstrip("/")
    return "" if s == "." else s


def under(path, src):
    return src == "" or path == src or path.startswith(src + "/")


def norm_path(p, root):
    s = str(p).replace("\\", "/")
    if root and s.startswith(root.rstrip("/") + "/"):
        s = s[len(root.rstrip("/")) + 1:]
    while s.startswith("./"):
        s = s[2:]
    return s


def read_lines(path):
    if not path or not os.path.isfile(path):
        return []
    with open(path, encoding="utf-8") as f:
        return [line.rstrip("\n") for line in f if line.rstrip("\n")]


def tail(path):
    try:
        with open(path, encoding="utf-8", errors="replace") as f:
            return f.read()[-2000:]
    except OSError:
        return ""


def ctx():
    env = os.environ
    base = None
    if env.get("CRAP_CTX_BASE_REF"):
        base = {"ref": env["CRAP_CTX_BASE_REF"], "mergeBase": env.get("CRAP_CTX_MERGE_BASE") or None}
    changed = env.get("CRAP_CTX_CFG_CHANGED", "null")
    config = {
        "source": env.get("CRAP_CTX_CFG_SOURCE"),
        "path": env.get("CRAP_CTX_CFG_PATH"),
        "ref": env.get("CRAP_CTX_BASE_REF") if env.get("CRAP_CTX_CFG_SOURCE") == "base" else None,
        "changedInDiff": None if changed == "null" else changed == "true",
    }
    return base, config


def validate(cfg_path):
    try:
        cfg = load_json(cfg_path)
    except (OSError, ValueError) as e:
        fail(f"invalid config JSON: {e}")
    if not isinstance(cfg, dict):
        fail("config must be a JSON object")
    errors = []
    if cfg.get("$schema") != SCHEMA:
        errors.append(f"$schema must be {SCHEMA}")
    if not is_int(cfg.get("version")) or cfg.get("version") != 1:
        errors.append("version must be 1")
    defaults = cfg.get("defaults")
    if not isinstance(defaults, dict):
        errors.append("defaults must be an object")
    else:
        t = defaults.get("threshold")
        if not is_num(t) or t <= 0:
            errors.append("defaults.threshold must be a positive number")
        if bad_rel_path(defaults.get("outputDir")):
            errors.append("defaults.outputDir must be a repo-relative path")
    targets = cfg.get("targets")
    if not isinstance(targets, dict) or not targets:
        errors.append("targets must be a non-empty object")
        targets = {}
    for name in sorted(targets):
        t = targets[name]
        if not isinstance(t, dict):
            errors.append(f"target {name}: must be an object")
            continue
        if bad_rel_path(t.get("src")):
            errors.append(f"target {name}: src must be a repo-relative path")
        cmds = t.get("commands")
        if not isinstance(cmds, dict):
            errors.append(f"target {name}: missing commands")
        else:
            for k in ("analysis", "verify"):
                if not isinstance(cmds.get(k), str) or not cmds[k].strip():
                    errors.append(f"target {name}: missing commands.{k}")
            if "coverage" in cmds and (not isinstance(cmds["coverage"], str) or not cmds["coverage"].strip()):
                errors.append(f"target {name}: commands.coverage must be a non-empty string when present")
        outs = t.get("outputs")
        if not isinstance(outs, dict):
            errors.append(f"target {name}: missing outputs")
        else:
            for k in ("report", "refactorBrief"):
                if bad_rel_path(outs.get(k)):
                    errors.append(f"target {name}: outputs.{k} must be a repo-relative path")
    if errors:
        for e in errors:
            print(e, file=sys.stderr)
        sys.exit(2)


def check_report(rep):
    if not isinstance(rep, dict):
        return "report must be a JSON object"
    bad = []
    if not isinstance(rep.get("target"), str):
        bad.append("target")
    if not is_num(rep.get("threshold")):
        bad.append("threshold")
    if not isinstance(rep.get("passed"), bool):
        bad.append("passed")
    summary = rep.get("summary")
    max_crap = summary.get("maxCrap") if isinstance(summary, dict) else None
    if not (isinstance(max_crap, dict) and is_num(max_crap.get("value"))):
        bad.append("summary.maxCrap.value")
    fns = rep.get("functions")
    if not isinstance(fns, list):
        bad.append("functions")
    else:
        checks = (("qualifiedName", lambda v: isinstance(v, str)),
                  ("filePath", lambda v: isinstance(v, str)),
                  ("startLine", is_int),
                  ("crap", is_num),
                  ("exceeds", lambda v: isinstance(v, bool)))
        for i, fn in enumerate(fns):
            if not isinstance(fn, dict):
                bad.append(f"functions[{i}]")
                continue
            for key, ok in checks:
                if not ok(fn.get(key)):
                    bad.append(f"functions[{i}].{key}")
    if bad:
        return "report has missing or invalid fields: " + ", ".join(bad)
    return None


def sort_key(fn):
    return (-fn["crap"], fn["qualifiedName"], fn["filePath"], fn["startLine"])


def brief(fn):
    if fn is None:
        return None
    out = {k: fn[k] for k in ("qualifiedName", "filePath", "startLine", "crap")}
    for k in ("riskLevel", "cyclomaticComplexity", "coveragePercent"):
        if k in fn:
            out[k] = fn[k]
    return out


def review_target(entry, tcfg, scope, changed, root):
    outputs = entry.get("outputs") or {}
    res = {
        "name": entry.get("name"),
        "outcome": None,
        "threshold": None,
        "report": outputs.get("report"),
        "refactorBrief": outputs.get("refactorBrief"),
        "worstInScope": None,
        "worstInTarget": None,
        "exceedingInScope": 0,
        "changedFilesWithoutFunctions": [],
        "error": None,
    }

    def err(command, code, reason, output=""):
        res["outcome"] = "ERROR"
        res["error"] = {"command": command, "exitCode": code, "reason": reason, "outputTail": output}
        return res

    for kind in ("coverage", "analysis", "verify"):
        c = entry.get(kind)
        if not isinstance(c, dict) or not c.get("ran") or c.get("exitCode") is None:
            continue
        code = c["exitCode"]
        if (kind == "coverage" and code != 0) or (kind != "coverage" and code not in (0, 1)):
            return err(kind, code, f"{kind} command exited {code}", c.get("outputTail", ""))
    if tcfg is None:
        return err("config", None, f"target {res['name']} is not in the config")
    if not res["report"]:
        return err("report", None, "no report path in the result")
    path = os.path.join(root, res["report"])
    if not os.path.isfile(path):
        return err("report", None, f"report not found: {res['report']}")
    try:
        rep = load_json(path)
    except (OSError, ValueError) as e:
        return err("report", None, f"report is not valid JSON: {e}")
    problem = check_report(rep)
    if problem:
        return err("report", None, problem)

    fns = rep["functions"]
    exceeding = [f for f in fns if f["exceeds"]]
    if rep["passed"] == bool(exceeding):
        return err("report", None,
                   f"report is inconsistent: passed is {str(rep['passed']).lower()} "
                   f"but {len(exceeding)} function(s) have exceeds=true")

    res["threshold"] = rep["threshold"]
    src = norm_src(tcfg["src"])

    def paths_for(fn):
        p = norm_path(fn["filePath"], root)
        return {p, f"{src}/{p}"} if src else {p}

    if scope == "changed":
        scoped = [f for f in fns if paths_for(f) & changed]
        seen = set()
        for f in fns:
            seen |= paths_for(f)
        res["changedFilesWithoutFunctions"] = sorted(p for p in changed if under(p, src) and p not in seen)
    else:
        scoped = list(fns)

    res["worstInTarget"] = brief(min(fns, key=sort_key) if fns else None)
    res["worstInScope"] = brief(min(scoped, key=sort_key) if scoped else None)
    res["exceedingInScope"] = sum(1 for f in scoped if f["exceeds"])
    if res["exceedingInScope"]:
        res["outcome"] = "REFACTOR"
    elif exceeding:
        res["outcome"] = "WARN"
    else:
        res["outcome"] = "PASS"
    return res


def review(result_path, cfg_path):
    root = os.environ.get("CRAP_CTX_ROOT", "")
    try:
        result = load_json(result_path)
    except (OSError, ValueError) as e:
        fail(f"cannot read result {result_path}: {e}")
    cfg = load_json(cfg_path)
    scope = result.get("scope", "all")
    changed = set(result.get("changed") or [])
    targets = [review_target(e, cfg["targets"].get(e.get("name")), scope, changed, root)
               for e in sorted(result.get("targets") or [], key=lambda e: str(e.get("name")))]
    overall = max((t["outcome"] for t in targets), key=lambda o: RANK[o]) if targets else "NO_TARGETS"
    print(json.dumps({
        "op": "review",
        "outcome": overall,
        "scope": scope,
        "reportOnly": bool(result.get("reportOnly")),
        "base": result.get("base"),
        "config": result.get("config"),
        "targets": targets,
    }, indent=2))
    sys.exit({"ERROR": 2, "REFACTOR": 1}.get(overall, 0))


def main():
    op = sys.argv[1]
    args = sys.argv[2:]

    if op == "validate":
        validate(args[0])
        return

    if op == "list-targets":
        for name in sorted(load_json(args[0])["targets"]):
            print(name)
        return

    if op == "target-exists":
        if args[1] not in load_json(args[0])["targets"]:
            fail(f"unknown target: {args[1]}")
        return

    if op == "target-info":
        # Shell assignments for one target; the caller evals them.
        cfg = load_json(args[0])
        t = cfg["defaults"]["threshold"]
        target = cfg["targets"][args[1]]
        cmds = target["commands"]
        values = {
            "T_THRESHOLD": str(int(t) if t == int(t) else t),
            "T_REPORT": target["outputs"]["report"],
            "T_BRIEF": target["outputs"]["refactorBrief"],
            "T_COVERAGE": cmds.get("coverage") or "",
            "T_ANALYSIS": cmds["analysis"],
            "T_VERIFY": cmds["verify"],
        }
        for key, value in values.items():
            print(f"{key}={shlex.quote(value)}")
        return

    if op == "resolve-output":
        print(load_json(args[0])["targets"][args[1]]["outputs"][args[2]])
        return

    if op == "targets-for-changes":
        targets = load_json(args[0])["targets"]
        srcs = {name: norm_src(t["src"]) for name, t in targets.items()}
        matched = set()
        for path in read_lines(args[1]):
            hits = [n for n, s in srcs.items() if under(path, s)]
            if hits:
                longest = max(len(srcs[n]) for n in hits)
                matched.update(n for n in hits if len(srcs[n]) == longest)
        for name in sorted(matched):
            print(name)
        return

    if op == "target-blob":
        # name kind cov_ran cov_ec cmd_ec report brief cov_log cmd_log
        name, kind, cov_ran, cov_ec, cmd_ec, report, brief_path, cov_log, cmd_log = args
        blob = {"name": name}
        if kind == "analysis":
            blob["coverage"] = {"ran": cov_ran == "true", "exitCode": None if cov_ec == "null" else int(cov_ec)}
            if blob["coverage"]["ran"] and blob["coverage"]["exitCode"] != 0:
                blob["coverage"]["outputTail"] = tail(cov_log)
                blob["failed"] = "coverage"
        ran = cmd_ec != "null"
        blob[kind] = {"ran": ran, "exitCode": int(cmd_ec) if ran else None}
        if ran and int(cmd_ec) not in (0, 1):
            blob[kind]["outputTail"] = tail(cmd_log)
            blob["failed"] = kind
        blob["outputs"] = {"report": report, "refactorBrief": brief_path}
        print(json.dumps(blob))
        return

    if op == "build-result":
        # op_name run_id scope report_only changed_file blobs...
        op_name, run_id, scope, report_only, changed_file = args[:5]
        base, config = ctx()
        out = {"op": op_name, "runId": run_id, "scope": scope, "reportOnly": report_only == "true",
               "base": base, "config": config}
        if scope == "changed":
            out["changed"] = read_lines(changed_file)
        out["targets"] = [json.loads(x) for x in args[5:]]
        print(json.dumps(out, indent=2))
        return

    if op == "result-exit":
        result = load_json(args[0])
        codes = []
        for t in result["targets"]:
            if t.get("failed"):
                print(2)
                return
            for kind in ("analysis", "verify"):
                c = t.get(kind)
                if isinstance(c, dict) and c.get("exitCode") is not None:
                    codes.append(c["exitCode"])
        print(1 if 1 in codes else 0)
        return

    if op == "result-context":
        # Shell assignments that let review reuse the config and base of a result.
        try:
            result = load_json(args[0])
        except (OSError, ValueError) as e:
            fail(f"cannot read result {args[0]}: {e}")
        config = result.get("config") or {}
        base = result.get("base") or {}
        override = config.get("path") if config.get("source") == "override" else ""
        print(f"R_CONFIG={shlex.quote(override or '')}")
        print(f"R_BASE={shlex.quote(base.get('ref') or '')}")
        return

    if op == "review":
        review(args[0], args[1])
        return

    fail(f"unknown py op: {op}")


if __name__ == "__main__":
    main()
PY
}

# --- context -----------------------------------------------------------------

init_repo() {
  ROOT="$(git rev-parse --show-toplevel 2>/dev/null)" || die "not inside a git repository"
  cd "$ROOT"
  RUN_TMP="$(mktemp -d "${TMPDIR:-/tmp}/crap-analysis.XXXXXX")"
  export CRAP_CTX_ROOT="$ROOT"
}

ensure_work_dir() {
  mkdir -p "$ROOT/$WORK_REL"
  [ -f "$ROOT/$WORK_REL/.gitignore" ] || printf '*\n' > "$ROOT/$WORK_REL/.gitignore"
}

ref_exists() { git rev-parse --verify -q "$1^{commit}" >/dev/null 2>&1; }

# Base = --base / CRAP_BASE, else the default branch: origin/HEAD, origin/main,
# origin/master, main, master. Never the branch's own @{upstream}.
init_base() {
  [ -z "$MERGE_BASE" ] || return 0
  if [ -n "$BASE_OVERRIDE" ]; then
    ref_exists "$BASE_OVERRIDE" || die "base ref not found: $BASE_OVERRIDE"
    BASE_REF="$BASE_OVERRIDE"
  else
    local ref
    ref="$(git symbolic-ref -q --short refs/remotes/origin/HEAD 2>/dev/null || true)"
    if [ -n "$ref" ] && ref_exists "$ref"; then
      BASE_REF="$ref"
    else
      for ref in origin/main origin/master main master; do
        if ref_exists "$ref"; then BASE_REF="$ref"; break; fi
      done
    fi
    [ -n "$BASE_REF" ] || die "cannot find the default branch (origin/HEAD, origin/main, origin/master, main, master); pass --base REF"
  fi
  MERGE_BASE="$(git merge-base HEAD "$BASE_REF" 2>/dev/null)" || die "no merge base between HEAD and $BASE_REF; pass --base REF"
  export CRAP_CTX_BASE_REF="$BASE_REF" CRAP_CTX_MERGE_BASE="$MERGE_BASE"
}

# Changed = commits since the merge base + staged + unstaged + untracked
# (not ignored). Deleted paths are excluded. Call init_base first.
list_changed() {
  {
    git -c core.quotepath=off diff --name-only --diff-filter=d "$MERGE_BASE" --
    git -c core.quotepath=off diff --cached --name-only --diff-filter=d "$MERGE_BASE" --
    git -c core.quotepath=off ls-files --others --exclude-standard
  } | LC_ALL=C sort -u
}

# Config = --config / CRAP_CONFIG (working-tree file), else the base branch's
# .crap-analysis.json or .atb/crap-analysis.json, copied into .atb-work/.
init_config() {
  if [ -n "$CONFIG_OVERRIDE" ]; then
    case "$CONFIG_OVERRIDE" in
      /*) CFG_PATH="$CONFIG_OVERRIDE" ;;
      *)  CFG_PATH="$ROOT/$CONFIG_OVERRIDE" ;;
    esac
    [ -f "$CFG_PATH" ] || die "config not found: $CONFIG_OVERRIDE"
    CFG_SOURCE="override"
    CFG_REPO_PATH="$CONFIG_OVERRIDE"
  else
    init_base
    local candidate
    for candidate in .crap-analysis.json .atb/crap-analysis.json; do
      if git cat-file -e "$BASE_REF:$candidate" 2>/dev/null; then
        ensure_work_dir
        CFG_PATH="$ROOT/$WORK_REL/base-config.json"
        git show "$BASE_REF:$candidate" > "$CFG_PATH"
        CFG_SOURCE="base"
        CFG_REPO_PATH="$candidate"
        break
      fi
    done
    [ -n "$CFG_PATH" ] || die "config not found on base $BASE_REF (.crap-analysis.json or .atb/crap-analysis.json); commit it to $BASE_REF, or pass --config PATH to use a working-tree file"
    CFG_CHANGED="false"
    if ! git diff --quiet "$MERGE_BASE" -- "$CFG_REPO_PATH" \
      || [ -n "$(git ls-files --others --exclude-standard -- "$CFG_REPO_PATH")" ]; then
      CFG_CHANGED="true"
    fi
  fi
  export CRAP_CTX_CFG_SOURCE="$CFG_SOURCE" CRAP_CTX_CFG_PATH="$CFG_REPO_PATH" CRAP_CTX_CFG_CHANGED="$CFG_CHANGED"
  py validate "$CFG_PATH" || die "invalid config: $CFG_REPO_PATH (source: $CFG_SOURCE)"
}

config_notes() {
  if [ "$CFG_SOURCE" = "base" ]; then
    note "config: $CFG_REPO_PATH from base $BASE_REF"
    if [ "$CFG_CHANGED" = "true" ]; then
      note "CONFIG_CHANGE: $CFG_REPO_PATH changed in this diff; this run uses the $BASE_REF version"
    fi
  else
    note "config: $CFG_REPO_PATH from the working tree (--config override)"
  fi
}

need_value() { [ -n "${2:-}" ] || die "$1 needs a value"; }

# --- ops ---------------------------------------------------------------------

cmd_changed() {
  [ $# -eq 0 ] || die "unexpected argument for changed: $1"
  init_repo
  init_base
  list_changed
}

cmd_targets_for_changes() {
  [ $# -eq 0 ] || die "unexpected argument for targets-for-changes: $1"
  init_repo
  init_config
  init_base
  list_changed > "$RUN_TMP/changed.txt"
  py targets-for-changes "$CFG_PATH" "$RUN_TMP/changed.txt"
}

cmd_validate_config() {
  [ $# -eq 0 ] || die "unexpected argument for validate-config: $1"
  init_repo
  init_config
  config_notes
  note "config valid"
}

cmd_report_path() {
  [ $# -eq 1 ] || die "usage: $PROG report-path <target> [--config PATH] [--base REF]"
  init_repo
  init_config
  py target-exists "$CFG_PATH" "$1" || exit 2
  py resolve-output "$CFG_PATH" "$1" report
}

append_threshold_flag() {
  local cmd="$1" threshold="$2"
  if [[ "$cmd" == *"--threshold"* ]]; then
    printf '%s\n' "$cmd"
  else
    printf '%s --threshold %s\n' "$cmd" "$threshold"
  fi
}

# Run one configured command in a subshell at the repo root. Its stdout and
# stderr go to a log file so this script's stdout stays machine JSON.
run_command() {
  local label="$1" cmd="$2" log="$3"
  note "running $label: $cmd"
  RUN_EC=0
  ( eval "$cmd" ) </dev/null >"$log" 2>&1 || RUN_EC=$?
}

# Write the result JSON to stdout and to .atb-work/crap-analysis/last-result.json.
emit_result() {
  ensure_work_dir
  py build-result "$@" > "$RUN_TMP/result.json"
  cp "$RUN_TMP/result.json" "$ROOT/$WORK_REL/last-result.json"
  cat "$RUN_TMP/result.json"
}

cmd_execute() {
  local with_coverage=0 target_filter="" use_changed=0
  while [ $# -gt 0 ]; do
    case "$1" in
      --coverage)  with_coverage=1; shift ;;
      --target)    need_value "$1" "${2:-}"; target_filter="$2"; shift 2 ;;
      --target=*)  target_filter="${1#--target=}"; need_value --target "$target_filter"; shift ;;
      --changed)   use_changed=1; shift ;;
      -*)          die "unknown flag for execute: $1" ;;
      *)           die "unexpected argument for execute: $1" ;;
    esac
  done

  init_repo
  init_config
  config_notes
  if [ -n "$target_filter" ]; then
    py target-exists "$CFG_PATH" "$target_filter" || exit 2
  fi

  local run_id scope="all" changed_file="$RUN_TMP/changed.txt"
  run_id="$(git rev-parse --short HEAD 2>/dev/null || echo "local")"
  : > "$changed_file"
  [ -z "$target_filter" ] || scope="target"
  if [ "$use_changed" -eq 1 ]; then
    scope="changed"
    init_base
    list_changed > "$changed_file"
  fi

  local -a targets=()
  local t
  if [ -n "$target_filter" ]; then
    targets=("$target_filter")
  elif [ "$use_changed" -eq 1 ]; then
    while IFS= read -r t; do
      [ -n "$t" ] && targets+=("$t")
    done < <(py targets-for-changes "$CFG_PATH" "$changed_file")
  else
    while IFS= read -r t; do
      [ -n "$t" ] && targets+=("$t")
    done < <(py list-targets "$CFG_PATH")
  fi

  local -a blobs=()
  if [ "${#targets[@]}" -eq 0 ]; then
    note "no configured target contains a changed file (base $BASE_REF)"
    emit_result execute "$run_id" "$scope" false "$changed_file"
    exit 0
  fi

  local name cov_ran cov_ec info
  local T_THRESHOLD T_REPORT T_BRIEF T_COVERAGE T_ANALYSIS T_VERIFY
  for name in "${targets[@]}"; do
    info="$(py target-info "$CFG_PATH" "$name")"
    eval "$info"
    cov_ran="false"; cov_ec="null"
    if [ "$with_coverage" -eq 1 ]; then
      if [ -n "$T_COVERAGE" ]; then
        run_command "coverage ($name)" "$T_COVERAGE" "$RUN_TMP/$name.coverage.log"
        cov_ran="true"; cov_ec="$RUN_EC"
        if [ "$RUN_EC" -ne 0 ]; then
          note "coverage failed for $name (exit $RUN_EC)"
          blobs+=("$(py target-blob "$name" analysis "$cov_ran" "$cov_ec" null "$T_REPORT" "$T_BRIEF" "$RUN_TMP/$name.coverage.log" "")")
          emit_result execute "$run_id" "$scope" false "$changed_file" "${blobs[@]}"
          exit 2
        fi
      else
        note "no commands.coverage for $name; coverage skipped"
      fi
    fi

    run_command "analysis ($name)" "$(append_threshold_flag "$T_ANALYSIS" "$T_THRESHOLD")" "$RUN_TMP/$name.analysis.log"
    blobs+=("$(py target-blob "$name" analysis "$cov_ran" "$cov_ec" "$RUN_EC" "$T_REPORT" "$T_BRIEF" "" "$RUN_TMP/$name.analysis.log")")
    if [ "$RUN_EC" -ne 0 ] && [ "$RUN_EC" -ne 1 ]; then
      note "analysis tooling error for $name (exit $RUN_EC)"
      emit_result execute "$run_id" "$scope" false "$changed_file" "${blobs[@]}"
      exit 2
    fi
  done

  emit_result execute "$run_id" "$scope" false "$changed_file" "${blobs[@]}"
  exit "$(py result-exit "$RUN_TMP/result.json")"
}

cmd_verify() {
  local target_filter="" use_changed=0
  while [ $# -gt 0 ]; do
    case "$1" in
      --changed)   use_changed=1; shift ;;
      --target)    need_value "$1" "${2:-}"; target_filter="$2"; shift 2 ;;
      --target=*)  target_filter="${1#--target=}"; shift ;;
      -*)          die "unknown flag for verify: $1" ;;
      *)           die "unexpected argument for verify: $1" ;;
    esac
  done
  [ -n "$target_filter" ] || die "usage: $PROG verify --target NAME [--changed] [--config PATH] [--base REF]"

  init_repo
  init_config
  config_notes
  py target-exists "$CFG_PATH" "$target_filter" || exit 2

  local run_id info scope="target" changed_file="$RUN_TMP/changed.txt"
  local T_THRESHOLD T_REPORT T_BRIEF T_COVERAGE T_ANALYSIS T_VERIFY
  run_id="$(git rev-parse --short HEAD 2>/dev/null || echo "local")"
  : > "$changed_file"
  if [ "$use_changed" -eq 1 ]; then
    scope="changed"
    init_base
    list_changed > "$changed_file"
  fi
  info="$(py target-info "$CFG_PATH" "$target_filter")"
  eval "$info"
  run_command "verify ($target_filter)" "$(append_threshold_flag "$T_VERIFY" "$T_THRESHOLD")" "$RUN_TMP/verify.log"
  emit_result verify "$run_id" "$scope" false "$changed_file" \
    "$(py target-blob "$target_filter" verify false null "$RUN_EC" "$T_REPORT" "$T_BRIEF" "" "$RUN_TMP/verify.log")"
  if [ "$RUN_EC" -ne 0 ] && [ "$RUN_EC" -ne 1 ]; then exit 2; fi
  exit "$RUN_EC"
}

cmd_review() {
  local report_only=0 use_changed=0 target_filter="" result_file=""
  while [ $# -gt 0 ]; do
    case "$1" in
      --report-only) report_only=1; shift ;;
      --changed)     use_changed=1; shift ;;
      --target)      need_value "$1" "${2:-}"; target_filter="$2"; shift 2 ;;
      --target=*)    target_filter="${1#--target=}"; shift ;;
      --result)      need_value "$1" "${2:-}"; result_file="$2"; shift 2 ;;
      --result=*)    result_file="${1#--result=}"; shift ;;
      -*)            die "unknown flag for review: $1" ;;
      *)             die "unexpected argument for review: $1" ;;
    esac
  done

  init_repo
  if [ "$report_only" -eq 0 ]; then
    if [ "$use_changed" -eq 1 ] || [ -n "$target_filter" ]; then
      die "--changed and --target select scope only with --report-only; review uses the scope of the last execute or verify"
    fi
    [ -n "$result_file" ] || result_file="$ROOT/$WORK_REL/last-result.json"
    [ -f "$result_file" ] || die "result not found: $result_file (run execute or verify first, or pass --report-only)"
    # Reuse the config and base of the result unless the caller overrides them.
    local info R_CONFIG R_BASE
    info="$(py result-context "$result_file")"
    eval "$info"
    [ -n "$CONFIG_OVERRIDE" ] || CONFIG_OVERRIDE="$R_CONFIG"
    [ -n "$BASE_OVERRIDE" ] || BASE_OVERRIDE="$R_BASE"
    init_config
    py review "$result_file" "$CFG_PATH"
    return
  fi

  init_config

  [ -z "$result_file" ] || die "--result cannot be used with --report-only"
  note "report-only: these reports can be stale; this review did not run any command"
  local scope="all" changed_file="$RUN_TMP/changed.txt" t
  : > "$changed_file"
  if [ -n "$target_filter" ]; then
    py target-exists "$CFG_PATH" "$target_filter" || exit 2
    scope="target"
  fi
  if [ "$use_changed" -eq 1 ]; then
    scope="changed"
    init_base
    list_changed > "$changed_file"
  fi
  local -a targets=() blobs=()
  if [ -n "$target_filter" ]; then
    targets=("$target_filter")
  elif [ "$use_changed" -eq 1 ]; then
    while IFS= read -r t; do [ -n "$t" ] && targets+=("$t"); done < <(py targets-for-changes "$CFG_PATH" "$changed_file")
  else
    while IFS= read -r t; do [ -n "$t" ] && targets+=("$t"); done < <(py list-targets "$CFG_PATH")
  fi
  local info T_THRESHOLD T_REPORT T_BRIEF T_COVERAGE T_ANALYSIS T_VERIFY
  for t in ${targets[@]+"${targets[@]}"}; do
    info="$(py target-info "$CFG_PATH" "$t")"
    eval "$info"
    blobs+=("$(py target-blob "$t" analysis false null null "$T_REPORT" "$T_BRIEF" "" "")")
  done
  py build-result review "$(git rev-parse --short HEAD 2>/dev/null || echo local)" "$scope" true "$changed_file" \
    ${blobs[@]+"${blobs[@]}"} > "$RUN_TMP/report-only.json"
  py review "$RUN_TMP/report-only.json" "$CFG_PATH"
}

usage() {
  cat <<EOF
$PROG — orchestrate CRAP analysis from .crap-analysis.json

usage:
  $PROG validate-config      [--config PATH] [--base REF]
  $PROG changed              [--base REF]
  $PROG targets-for-changes  [--config PATH] [--base REF]
  $PROG report-path <target> [--config PATH] [--base REF]
  $PROG execute [--changed] [--target NAME] [--coverage] [--config PATH] [--base REF]
  $PROG verify --target NAME [--changed] [--config PATH] [--base REF]
  $PROG review [--result FILE] [--config PATH] [--base REF]
  $PROG review --report-only [--changed] [--target NAME] [--config PATH] [--base REF]

Config loads from the base branch unless --config is given.
Base is --base, else origin/HEAD, origin/main, origin/master, main, or master.
Human status on stderr; machine JSON on stdout for execute, verify, and review.
Exit: 0 pass, 1 threshold exceeded, 2 config, usage, or tooling error.
EOF
}

# --- dispatch ----------------------------------------------------------------

op="${1:-}"
[ $# -eq 0 ] || shift

# --config and --base apply to every op; extract them before op parsing.
rest=()
while [ $# -gt 0 ]; do
  case "$1" in
    --config)   need_value "$1" "${2:-}"; CONFIG_OVERRIDE="$2"; shift 2 ;;
    --config=*) CONFIG_OVERRIDE="${1#--config=}"; need_value --config "$CONFIG_OVERRIDE"; shift ;;
    --base)     need_value "$1" "${2:-}"; BASE_OVERRIDE="$2"; shift 2 ;;
    --base=*)   BASE_OVERRIDE="${1#--base=}"; need_value --base "$BASE_OVERRIDE"; shift ;;
    *)          rest+=("$1"); shift ;;
  esac
done
set -- ${rest[@]+"${rest[@]}"}

case "$op" in
  validate-config|validate) cmd_validate_config "$@" ;;
  changed)                  cmd_changed "$@" ;;
  targets-for-changes)      cmd_targets_for_changes "$@" ;;
  report-path)              cmd_report_path "$@" ;;
  execute)                  cmd_execute "$@" ;;
  verify)                   cmd_verify "$@" ;;
  review)                   cmd_review "$@" ;;
  -h|--help|help)           usage ;;
  "")                       usage >&2; exit 2 ;;
  *)                        die "unknown op: $op (try: validate-config, execute, review, verify, changed)" ;;
esac
