#!/usr/bin/env bash
# Compute stable code-quality-gate evidence fingerprints without writing Git objects.

set -e
set -u
set -o pipefail
export LC_ALL=C

usage() {
  echo "usage: fingerprint.sh --base <commit> --allowed-paths-file <nul-delimited-file>" >&2
  exit 2
}

base=""
allowed_file=""
while [ "$#" -gt 0 ]; do
  case "$1" in
    --base) [ "$#" -ge 2 ] || usage; base="$2"; shift 2 ;;
    --allowed-paths-file) [ "$#" -ge 2 ] || usage; allowed_file="$2"; shift 2 ;;
    *) usage ;;
  esac
done

[ -n "$base" ] && [ -n "$allowed_file" ] || usage
git rev-parse --is-inside-work-tree >/dev/null 2>&1 || { echo "not inside a Git work tree" >&2; exit 1; }
base="$(git rev-parse --verify "${base}^{commit}")"
[ -f "$allowed_file" ] || { echo "missing allowed paths file: $allowed_file" >&2; exit 1; }

temp_dir="$(mktemp -d "${TMPDIR:-/tmp}/agent-toolbelt-gate-fingerprint.XXXXXX")"
cleanup() { rm -rf "$temp_dir"; }
trap cleanup EXIT

# Git paths are NUL-delimited. Bash's insertion sort keeps that representation
# portable on macOS, where sort lacks -z, while retaining pathnames with spaces.
sort_unique_nul() {
  local input="$1" output="$2" value key i j seen count
  local -a values
  values=()
  count=0
  while IFS= read -r -d '' value; do
    seen=0
    for ((i = 0; i < count; i++)); do
      [ "$value" = "${values[$i]}" ] && { seen=1; break; }
      if [[ "$value" < "${values[$i]}" ]]; then break; fi
    done
    [ "$seen" = 1 ] && continue
    key="$value"
    j=$((count - 1))
    while [ "$j" -ge "$i" ] && [ "$j" -ge 0 ] && [[ "${values[$j]}" > "$key" ]]; do
      values[$((j + 1))]="${values[$j]}"
      j=$((j - 1))
    done
    values[$((j + 1))]="$key"
    count=$((count + 1))
  done < "$input"
  : > "$output"
  for ((i = 0; i < count; i++)); do
    printf '%s\0' "${values[$i]}" >> "$output"
  done
}

tracked_raw="$temp_dir/tracked.raw"
untracked_raw="$temp_dir/untracked.raw"
scope_raw="$temp_dir/scope.raw"
tracked_sorted="$temp_dir/tracked.sorted"
untracked_sorted="$temp_dir/untracked.sorted"
scope_sorted="$temp_dir/scope.sorted"
allowed_sorted="$temp_dir/allowed.sorted"

git diff --name-only -z "$base" -- > "$tracked_raw"
git ls-files --others --exclude-standard -z > "$untracked_raw"
sort_unique_nul "$tracked_raw" "$tracked_sorted"
sort_unique_nul "$untracked_raw" "$untracked_sorted"
cat "$tracked_sorted" "$untracked_sorted" > "$scope_raw"
sort_unique_nul "$scope_raw" "$scope_sorted"
sort_unique_nul "$allowed_file" "$allowed_sorted"

while IFS= read -r -d '' path; do
  case "$path" in
    ""|/*|..|../*|*/../*|*/..)
      echo "invalid allowed scope path: $path" >&2
      exit 1
      ;;
  esac
done < "$allowed_sorted"

head_fingerprint="$({
  printf 'code-quality-gate-head-v1\0base\0%s\0tracked-diff\0' "$base"
  git diff --binary --full-index --no-ext-diff "$base" --
  printf '\0untracked\0'
  while IFS= read -r -d '' path; do
    oid="$(git hash-object -- "$path")"
    printf '%s\0%s\0' "$path" "$oid"
  done < "$untracked_sorted"
} | git hash-object --stdin)"

scope_fingerprint="$({
  printf 'code-quality-gate-scope-v1\0base\0%s\0paths\0' "$base"
  cat "$scope_sorted"
  printf 'allowed\0'
  cat "$allowed_sorted"
} | git hash-object --stdin)"

coverage="partial"
cmp -s "$scope_sorted" "$allowed_sorted" && coverage="final"

printf 'head_fingerprint=%s\n' "$head_fingerprint"
printf 'scope_fingerprint=%s\n' "$scope_fingerprint"
printf 'coverage=%s\n' "$coverage"
