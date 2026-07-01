#!/usr/bin/env bash
# worktree — create/list/remove isolated git worktrees so multiple agents can work a shared
# polyrepo directory without clobbering each other's branch. Pure bash + git, no runtime to install.
# Invoke as: bash skills/worktree/bin/worktree.sh <op> [args]
set -euo pipefail

PROG="worktree"

die()  { printf '%s: %s\n' "$PROG" "$*" >&2; exit 1; }
note() { printf '%s\n' "$*" >&2; }

# --- helpers ----------------------------------------------------------------

abspath() { (cd "$1" 2>/dev/null && pwd) || die "no such directory: $1"; }

# Absolute path of the MAIN working tree for the repo containing $1.
# Works from the main tree OR any linked worktree (the first porcelain entry is always the main).
main_worktree() {
  local dir="$1"
  git -C "$dir" rev-parse --is-inside-work-tree >/dev/null 2>&1 \
    || die "not inside a git repository: $dir"
  git -C "$dir" worktree list --porcelain | awk '/^worktree /{print substr($0,10); exit}'
}

# Resolve a repo argument to a directory:
#   empty        -> the repo containing CWD
#   a path (dir) -> that path
#   a bare name  -> a sibling <parent-of-cwd-repo>/<name>
resolve_repo_dir() {
  local arg="${1:-}"
  if [ -z "$arg" ]; then echo "."; return; fi
  if [ -d "$arg" ]; then echo "$arg"; return; fi
  case "$arg" in
    */*|.|..) die "no such directory: $arg" ;;
  esac
  local here_main parent cand
  here_main="$(main_worktree ".")"
  parent="$(dirname "$here_main")"
  cand="$parent/$arg"
  [ -d "$cand" ] || die "no sibling repo '$arg' under $parent"
  echo "$cand"
}

branch_to_slug() { printf '%s' "$1" | tr '/' '-'; }
branch_exists()  { git -C "$1" show-ref --verify --quiet "refs/heads/$2"; }

# --- ops --------------------------------------------------------------------

cmd_new() {
  local from="" task="" positional=()
  while [ $# -gt 0 ]; do
    case "$1" in
      --from)   from="${2:-}"; shift 2 ;;
      --from=*) from="${1#--from=}"; shift ;;
      --task)   task="${2:-}"; shift 2 ;;
      --task=*) task="${1#--task=}"; shift ;;
      -*)       die "unknown flag for 'new': $1" ;;
      *)        positional+=("$1"); shift ;;
    esac
  done
  local repo="${positional[0]:-}" branch="${positional[1]:-}"

  local dir main repo_name parent wt_root
  dir="$(resolve_repo_dir "$repo")"
  main="$(main_worktree "$dir")"
  repo_name="$(basename "$main")"
  parent="$(dirname "$main")"
  wt_root="$parent/.worktrees/$repo_name"

  if [ -z "$from" ]; then
    from="$(git -C "$main" symbolic-ref --quiet --short HEAD 2>/dev/null || git -C "$main" rev-parse HEAD)"
  fi
  git -C "$main" rev-parse --verify --quiet "${from}^{commit}" >/dev/null \
    || die "base ref not found: $from"

  if [ -n "$branch" ]; then
    branch_exists "$main" "$branch" \
      && die "branch already exists: $branch (pick another name, or omit it to auto-name)"
  else
    local base_slug n
    base_slug="$(branch_to_slug "${task:-$repo_name}")"
    n=1
    while branch_exists "$main" "agent/${base_slug}-${n}" \
       || [ -e "$wt_root/$(branch_to_slug "agent/${base_slug}-${n}")" ]; do
      n=$((n + 1))
    done
    branch="agent/${base_slug}-${n}"
  fi

  local slug wt_path
  slug="$(branch_to_slug "$branch")"
  wt_path="$wt_root/$slug"
  [ -e "$wt_path" ] && die "worktree path already exists: $wt_path"

  if [ "$(git -C "$dir" rev-parse --git-dir)" != "$(git -C "$dir" rev-parse --git-common-dir)" ]; then
    note "note: you are inside a linked worktree — creating off the MAIN tree ($main), not nesting."
  fi

  mkdir -p "$wt_root"
  git -C "$main" worktree add -b "$branch" "$wt_path" "$from" >&2

  wt_path="$(abspath "$wt_path")"
  printf 'worktree: %s\n' "$wt_path"
  printf 'branch:   %s\n' "$branch"
  printf 'base:     %s\n' "$from"
  printf 'cd:       cd "%s"\n' "$wt_path"
}

list_one() {
  local dir="$1"
  git -C "$dir" worktree list --porcelain | awk '
    /^worktree /{p=substr($0,10)}
    /^branch /  {b=substr($0,8); sub(/^refs\/heads\//,"",b); print p"\t"b}
    /^detached/ {print p"\t(detached)"}
  ' | while IFS="$(printf '\t')" read -r wt br; do
    local dirty=""
    [ -n "$(git -C "$wt" status --porcelain 2>/dev/null)" ] && dirty=" *"
    printf '  %-52s %s%s\n' "$wt" "$br" "$dirty"
  done
}

cmd_list() {
  local all=0 repo=""
  while [ $# -gt 0 ]; do
    case "$1" in
      --all) all=1; shift ;;
      -*)    die "unknown flag for 'list': $1" ;;
      *)     repo="$1"; shift ;;
    esac
  done
  if [ "$all" -eq 1 ]; then
    local here_main parent child
    here_main="$(main_worktree ".")"
    parent="$(dirname "$here_main")"
    for child in "$parent"/*/; do
      [ -e "${child}.git" ] || continue
      printf '== %s ==\n' "$(basename "$child")"
      list_one "$child"
    done
    return
  fi
  list_one "$(resolve_repo_dir "$repo")"
}

cmd_rm() {
  local force=0 del=0 target=""
  while [ $# -gt 0 ]; do
    case "$1" in
      --force|-f)      force=1; shift ;;
      --delete-branch) del=1;   shift ;;
      -*)              die "unknown flag for 'rm': $1" ;;
      *)               target="$1"; shift ;;
    esac
  done
  [ -n "$target" ] || die "usage: $PROG rm <path-or-branch> [--force] [--delete-branch]"

  local main; main="$(main_worktree ".")"

  local wt=""
  if [ -d "$target" ]; then
    wt="$(abspath "$target")"
  else
    wt="$(git -C "$main" worktree list --porcelain | awk -v b="branch refs/heads/$target" '
      /^worktree /{p=substr($0,10)} $0==b{print p}')"
    [ -n "$wt" ] || die "no worktree found for path or branch: $target"
  fi

  [ "$wt" = "$main" ] && die "refusing to remove the main working tree: $wt"

  if [ "$force" -eq 0 ] && [ -n "$(git -C "$wt" status --porcelain 2>/dev/null)" ]; then
    die "worktree has uncommitted changes: $wt (commit/stash, or pass --force to discard)"
  fi

  local branch; branch="$(git -C "$wt" symbolic-ref --quiet --short HEAD 2>/dev/null || true)"

  if [ "$force" -eq 1 ]; then git -C "$main" worktree remove --force "$wt"
  else                        git -C "$main" worktree remove "$wt"; fi
  git -C "$main" worktree prune

  local branch_note=" (kept)"
  if [ "$del" -eq 1 ] && [ -n "$branch" ]; then
    if [ "$force" -eq 1 ]; then
      git -C "$main" branch -D "$branch" >/dev/null && branch_note=" (deleted)" \
        || note "could not delete branch $branch"
    elif git -C "$main" branch -d "$branch" >/dev/null 2>&1; then
      branch_note=" (deleted)"
    else
      note "kept branch $branch (not fully merged; rerun with --force to delete it)"
    fi
  fi

  local repo_name parent wt_root
  repo_name="$(basename "$main")"; parent="$(dirname "$main")"
  wt_root="$parent/.worktrees/$repo_name"
  rmdir "$wt_root" 2>/dev/null || true
  rmdir "$parent/.worktrees" 2>/dev/null || true

  printf 'removed worktree: %s\n' "$wt"
  [ -n "$branch" ] && printf 'branch:           %s%s\n' "$branch" "$branch_note"
}

cmd_prune() {
  local main; main="$(main_worktree ".")"
  git -C "$main" worktree prune
  local repo_name parent
  repo_name="$(basename "$main")"; parent="$(dirname "$main")"
  rmdir "$parent/.worktrees/$repo_name" 2>/dev/null || true
  rmdir "$parent/.worktrees" 2>/dev/null || true
  printf 'pruned stale worktree metadata for %s\n' "$repo_name"
}

usage() {
  cat >&2 <<EOF
$PROG — isolated git worktrees for safe multi-agent work in a shared polyrepo directory.

usage:
  $PROG new  [repo] [branch] [--task <slug>] [--from <ref>]
  $PROG list [repo] | --all
  $PROG rm   <path-or-branch> [--force] [--delete-branch]
  $PROG prune

repo: omitted = the repo containing CWD; a path; or a bare sibling name under the parent dir.
Worktrees live at <parent>/.worktrees/<repo>/<branch-slug>. Omit branch to auto-name
agent/<repo|task>-<n> (unique). An explicit branch errors if it already exists.
EOF
}

op="${1:-}"; [ $# -gt 0 ] && shift || true
case "$op" in
  new)            cmd_new "$@" ;;
  list|ls)        cmd_list "$@" ;;
  rm|remove|done) cmd_rm "$@" ;;
  prune)          cmd_prune "$@" ;;
  -h|--help|help|"") usage ;;
  *)              die "unknown op: $op (try: new, list, rm, prune)" ;;
esac
