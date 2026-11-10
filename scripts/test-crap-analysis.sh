#!/usr/bin/env bash
# Exercise skills/crap-analysis/bin/crap-analysis.sh end to end against small
# local fixture repositories. No network. Set CRAP_TEST_KEEP=1 to keep fixtures.

set -e
set -u
set -o pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CRAP="$ROOT/skills/crap-analysis/bin/crap-analysis.sh"
TMP_ROOT="$(mktemp -d "${TMPDIR:-/tmp}/agent-toolbelt-crap-analysis.XXXXXX")"
TMP_ROOT="$(cd "$TMP_ROOT" && pwd -P)"

cleanup() {
  if [ "${CRAP_TEST_KEEP:-0}" = "1" ]; then
    echo "kept fixtures: $TMP_ROOT" >&2
  else
    rm -rf "$TMP_ROOT"
  fi
}
trap cleanup EXIT

export GIT_AUTHOR_NAME=Test GIT_AUTHOR_EMAIL=test@example.invalid
export GIT_COMMITTER_NAME=Test GIT_COMMITTER_EMAIL=test@example.invalid
export GIT_CONFIG_NOSYSTEM=1 GIT_CONFIG_GLOBAL=/dev/null

fail() { echo "FAIL: $*" >&2; exit 1; }

# run <expected-exit> <out-file> <err-file> <args...> — run the orchestrator in $PWD.
run() {
  local want="$1" out="$2" err="$3" got=0
  shift 3
  bash "$CRAP" "$@" >"$out" 2>"$err" || got=$?
  if [ "$got" -ne "$want" ]; then
    echo "--- stdout" >&2; cat "$out" >&2
    echo "--- stderr" >&2; cat "$err" >&2
    fail "crap-analysis $* exited $got, expected $want"
  fi
}

# jget <json-file> <python-expression over d>
jget() {
  python3 -c 'import json,sys; d=json.load(open(sys.argv[1])); print(eval(sys.argv[2]))' "$1" "$2"
}

expect_eq() { [ "$1" = "$2" ] || fail "$3: got '$1', expected '$2'"; }
expect_grep() { grep -q -- "$1" "$2" || { cat "$2" >&2; fail "$3: '$1' not found"; }; }

write_config() { # <file> <threshold> <coverage-cmd> <analysis-cmd>
  cat > "$1" <<EOF
{
  "\$schema": "agent-toolbelt/crap-analysis/v1",
  "version": 1,
  "defaults": {
    "threshold": $2,
    "outputDir": "reports/crap"
  },
  "targets": {
    "app": {
      "src": "src",
      "commands": {
        "coverage": "$3",
        "analysis": "$4",
        "verify": "python3 tools/fake_crap.py --target app"
      },
      "outputs": {
        "report": "reports/crap/app.json",
        "refactorBrief": "reports/crap/app.refactor.md"
      }
    }
  }
}
EOF
}

# --- fixture: seed repo on main, bare origin, clone ---------------------------

seed="$TMP_ROOT/seed"
mkdir -p "$seed/src" "$seed/tools"
git -C "$seed" init -q -b main
printf 'reports/\ncoverage/\nignored.txt\n' > "$seed/.gitignore"
printf 'def process_order():\n    return 1\n' > "$seed/src/orders.py"
printf 'def legacy():\n    return 2\n' > "$seed/src/legacy.py"
printf 'def gone():\n    return 3\n' > "$seed/src/gone.py"

# Static complexity table. Coverage comes from the lcov file that the
# coverage command copies into coverage/lcov.info. A function with no lcov
# lines has 0% coverage, the highest-CRAP case.
cat > "$seed/tools/metrics.json" <<'EOF'
[
  {"qualifiedName": "process_order", "filePath": "src/orders.py", "startLine": 1, "endLine": 10, "complexity": 4},
  {"qualifiedName": "legacy", "filePath": "src/legacy.py", "startLine": 1, "endLine": 20, "complexity": 6},
  {"qualifiedName": "committed_fn", "filePath": "src/committed.py", "startLine": 1, "endLine": 5, "complexity": 2},
  {"qualifiedName": "new_thing", "filePath": "src/new_feature.py", "startLine": 1, "endLine": 10, "complexity": 5}
]
EOF
cat > "$seed/tools/cov.lcov" <<'EOF'
SF:src/orders.py
DA:1,1
DA:2,1
end_of_record
SF:src/committed.py
DA:1,1
end_of_record
EOF
cat > "$seed/tools/fake_cov.py" <<'EOF'
import os, shutil
os.makedirs("coverage", exist_ok=True)
shutil.copy("tools/cov.lcov", "coverage/lcov.info")
EOF
cat > "$seed/tools/fake_crap.py" <<'EOF'
import argparse, json, os
p = argparse.ArgumentParser()
p.add_argument("--target", required=True)
p.add_argument("--threshold", type=float, required=True)
a = p.parse_args()
hits = {}
if os.path.exists("coverage/lcov.info"):
    current = None
    for line in open("coverage/lcov.info"):
        line = line.strip()
        if line.startswith("SF:"):
            current = line[3:]
        elif line.startswith("DA:") and current:
            n, h = line[3:].split(",")[:2]
            hits.setdefault(current, {})[int(n)] = int(h)
fns = []
for m in json.load(open("tools/metrics.json")):
    lines = {n: h for n, h in hits.get(m["filePath"], {}).items() if m["startLine"] <= n <= m["endLine"]}
    cov = 100.0 * sum(1 for h in lines.values() if h > 0) / len(lines) if lines else 0.0
    c = m["complexity"]
    crap = round(c * c * (1 - cov / 100) ** 3 + c, 1)
    fns.append({"qualifiedName": m["qualifiedName"], "filePath": m["filePath"], "startLine": m["startLine"],
                "cyclomaticComplexity": c, "coveragePercent": cov, "crap": crap, "exceeds": crap > a.threshold})
fns.sort(key=lambda f: (-f["crap"], f["qualifiedName"], f["filePath"], f["startLine"]))
failed = any(f["exceeds"] for f in fns)
os.makedirs("reports/crap", exist_ok=True)
json.dump({"target": a.target, "threshold": a.threshold, "passed": not failed,
           "summary": {"totalFunctions": len(fns), "maxCrap": {"value": fns[0]["crap"]}},
           "functions": fns}, open(f"reports/crap/{a.target}.json", "w"), indent=2)
w = fns[0]
open(f"reports/crap/{a.target}.refactor.md", "w").write(
    f"# Refactor target\n\n- Function: `{w['qualifiedName']}`\n- Location: `{w['filePath']}:{w['startLine']}`\n"
    f"- CRAP: {w['crap']}\n\n## Recommended actions\n\n1. Add tests.\n")
raise SystemExit(1 if failed else 0)
EOF
write_config "$seed/.crap-analysis.json" 16 "python3 tools/fake_cov.py" "python3 tools/fake_crap.py --target app"
git -C "$seed" add -A
git -C "$seed" commit -qm base

git clone -q --bare "$seed" "$TMP_ROOT/origin.git"
work="$TMP_ROOT/work"
git clone -q "$TMP_ROOT/origin.git" "$work"
cd "$work"
[ "$(git symbolic-ref --short refs/remotes/origin/HEAD)" = "origin/main" ] || fail "fixture origin/HEAD is not origin/main"

# Feature branch with its own upstream. A merge-base against @{upstream} would
# see no committed change here.
git checkout -q -b feature
printf 'def committed_fn():\n    return 4\n' > src/committed.py
git add src/committed.py
git commit -qm "add committed"
git push -q -u origin feature 2>/dev/null

printf 'def process_order():\n    return 10\n' > src/orders.py   # unstaged change
printf 'def staged():\n    return 5\n' > src/staged.py
git add src/staged.py                                            # staged new file
printf 'def new_thing():\n    return 6\n' > src/new_feature.py  # untracked new file
printf 'ignored\n' > ignored.txt                                 # ignored file
rm src/gone.py                                                   # deleted file
write_config .crap-analysis.json 99 "python3 tools/fake_cov.py" "python3 tools/fake_crap.py --target app"

out="$TMP_ROOT/out.json"
err="$TMP_ROOT/err.txt"

# 1. changed: commits since merge base + staged + unstaged + untracked.
run 0 "$out" "$err" changed
expected_changed="$(printf '%s\n' .crap-analysis.json src/committed.py src/new_feature.py src/orders.py src/staged.py)"
expect_eq "$(cat "$out")" "$expected_changed" "changed paths"

# 2. validate-config loads the base config and reports the config change.
run 0 "$out" "$err" validate-config
expect_grep "from base origin/main" "$err" "validate-config base source"
expect_grep "CONFIG_CHANGE" "$err" "validate-config config change"
run 0 "$out" "$err" targets-for-changes
expect_eq "$(cat "$out")" "app" "targets-for-changes"
run 0 "$out" "$err" report-path app
expect_eq "$(cat "$out")" "reports/crap/app.json" "report-path"

# 3. execute --changed uses base threshold 16, not the working-tree 99.
run 1 "$out" "$err" execute --changed --coverage
expect_eq "$(jget "$out" 'd["config"]["source"]')" "base" "execute config source"
expect_eq "$(jget "$out" 'd["config"]["changedInDiff"]')" "True" "execute config change"
expect_eq "$(jget "$out" 'd["base"]["ref"]')" "origin/main" "execute base ref"
expect_eq "$(jget "$out" 'd["targets"][0]["coverage"]["ran"]')" "True" "coverage ran"
expect_eq "$(jget "$out" 'd["targets"][0]["analysis"]["exitCode"]')" "1" "analysis exit"
expect_eq "$(jget reports/crap/app.json 'd["threshold"]')" "16.0" "report threshold"
cmp -s "$out" .atb-work/crap-analysis/last-result.json || fail "last-result.json differs from stdout"

# 4. review: the untracked new file is the worst function in scope.
run 1 "$out" "$err" review
expect_eq "$(jget "$out" 'd["outcome"]')" "REFACTOR" "review outcome"
expect_eq "$(jget "$out" 'd["targets"][0]["worstInScope"]["filePath"]')" "src/new_feature.py" "worst in scope"
expect_eq "$(jget "$out" 'd["targets"][0]["exceedingInScope"]')" "1" "exceeding in scope"
expect_eq "$(jget "$out" 'd["targets"][0]["worstInTarget"]["qualifiedName"]')" "legacy" "worst in target"
expect_eq "$(jget "$out" 'd["targets"][0]["changedFilesWithoutFunctions"]')" "['src/staged.py']" "files without functions"

# The run writes only ignored files.
run 0 "$out" "$err" changed
expect_eq "$(cat "$out")" "$expected_changed" "changed paths after execute"

# 5. --config override uses the working-tree file (threshold 99).
run 0 "$out" "$err" execute --changed --config .crap-analysis.json
expect_eq "$(jget "$out" 'd["config"]["source"]')" "override" "override source"
run 0 "$out" "$err" review
expect_eq "$(jget "$out" 'd["outcome"]')" "PASS" "override review outcome"

# 6. WARN: a failure exists only outside the changed files.
mv src/new_feature.py "$TMP_ROOT/new_feature.py"
run 1 "$out" "$err" execute --changed
run 0 "$out" "$err" review
expect_eq "$(jget "$out" 'd["outcome"]')" "WARN" "outside-diff outcome"
run 0 "$out" "$err" review --report-only --changed
expect_eq "$(jget "$out" 'd["reportOnly"]')" "True" "report-only flag"
expect_eq "$(jget "$out" 'd["outcome"]')" "WARN" "report-only outcome"
mv "$TMP_ROOT/new_feature.py" src/new_feature.py

# 7. verify writes the same result shape and keeps the changed scope.
run 1 "$out" "$err" verify --target app --changed
expect_eq "$(jget "$out" 'd["op"]')" "verify" "verify op"
expect_eq "$(jget "$out" 'd["scope"]')" "changed" "verify scope"
run 1 "$out" "$err" review
expect_eq "$(jget "$out" 'd["outcome"]')" "REFACTOR" "verify review outcome"
run 1 "$out" "$err" verify --target app
expect_eq "$(jget "$out" 'd["scope"]')" "target" "verify target scope"

# 8. Tooling errors exit 2 and review reports ERROR.
write_config tool-error.json 16 "python3 tools/fake_cov.py" "sh -c 'exit 3'"
run 2 "$out" "$err" execute --changed --config tool-error.json
expect_eq "$(jget "$out" 'd["targets"][0]["failed"]')" "analysis" "analysis failure"
run 2 "$out" "$err" review
expect_eq "$(jget "$out" 'd["targets"][0]["error"]["exitCode"]')" "3" "error exit code"

write_config cov-error.json 16 "false" "python3 tools/fake_crap.py --target app"
run 2 "$out" "$err" execute --changed --coverage --config cov-error.json
run 2 "$out" "$err" review
expect_eq "$(jget "$out" 'd["targets"][0]["error"]["command"]')" "coverage" "coverage error"

rm -rf reports
write_config no-report.json 16 "true" "true"
run 0 "$out" "$err" execute --changed --config no-report.json
run 2 "$out" "$err" review
expect_grep "report not found" "$out" "missing report"

# 9. Config and usage errors exit 2.
printf '{' > broken.json
run 2 "$out" "$err" validate-config --config broken.json
expect_grep "invalid config JSON" "$err" "broken config message"
run 2 "$out" "$err" execute --target nope
expect_grep "unknown target: nope" "$err" "unknown target message"
run 2 "$out" "$err" execute --bogus
run 2 "$out" "$err" execute --target

# --- fixture: no default branch, base override, missing base config ----------

trunk="$TMP_ROOT/trunk"
mkdir -p "$trunk/src"
git -C "$trunk" init -q -b trunk
printf 'x\n' > "$trunk/README.txt"
git -C "$trunk" add -A
git -C "$trunk" commit -qm first
git -C "$trunk" tag pre-config
cp "$seed/.crap-analysis.json" "$trunk/.crap-analysis.json"
git -C "$trunk" add -A
git -C "$trunk" commit -qm config
cd "$trunk"

run 2 "$out" "$err" changed
expect_grep "cannot find the default branch" "$err" "no default branch message"
run 2 "$out" "$err" validate-config --base pre-config
expect_grep "config not found on base pre-config" "$err" "missing base config message"
printf 'y\n' >> README.txt
run 0 "$out" "$err" execute --changed --base trunk
expect_eq "$(jget "$out" 'len(d["targets"])')" "0" "no targets"
run 0 "$out" "$err" review
expect_eq "$(jget "$out" 'd["outcome"]')" "NO_TARGETS" "no-targets outcome"

# Bundled fixtures stay valid for the review op.
fixtures="$ROOT/skills/crap-analysis/fixtures"
mkdir -p reports/crap
cp "$fixtures/api.report.json" reports/crap/api.json
cp "$fixtures/api.refactor.md" reports/crap/api.refactor.md
run 1 "$out" "$err" review --report-only --target api --config "$fixtures/sample.crap-analysis.json"
expect_eq "$(jget "$out" 'd["targets"][0]["worstInScope"]["qualifiedName"]')" "processOrder" "fixture worst function"

echo "ok: crap-analysis base config, changed scope, review outcomes, and exit codes verified"
