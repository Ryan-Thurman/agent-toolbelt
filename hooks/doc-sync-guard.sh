#!/usr/bin/env bash
# Cursor beforeShellExecution hook (matcher: "git commit").
#
# Enforces the "keep docs in sync with the work" rule at commit time: if a commit
# changes code but touches no documentation, return permission "ask" so Cursor
# surfaces a confirmation before committing. This is advisory, not a hard block.
#
# Reads the hook JSON on stdin, emits a decision JSON on stdout. Never blocks hard
# (worst case it asks); on any error it falls back to "allow" (fail-open).
#
# Bypass:
#   - add [skip-docs] anywhere in the commit message
#   - set TOOLBELT_DOC_CHECK=0 in the environment
set -u

allow() { printf '{"permission":"allow"}\n'; exit 0; }

input="$(cat)"   # full hook JSON (includes the git command being run)

# Disabled, or not actually a commit (defensive — the matcher should guarantee this).
[ "${TOOLBELT_DOC_CHECK:-1}" = "0" ] && allow
case "$input" in *"git commit"*) ;; *) allow ;; esac
# Explicit bypass token in the commit message.
case "$input" in *"[skip-docs]"*) allow ;; esac

repo="${CURSOR_PROJECT_DIR:-$PWD}"
cd "$repo" 2>/dev/null || allow
git rev-parse --is-inside-work-tree >/dev/null 2>&1 || allow

# What this commit will include: staged files, or (for `git commit -a/--all`) tracked
# modifications that the commit will auto-stage.
files="$(git diff --cached --name-only 2>/dev/null)"
if [ -z "$files" ]; then
  case "$input" in
    *"commit -a"*|*"commit --all"*|*"-am"*|*"--all "*)
      files="$(git diff --name-only HEAD 2>/dev/null)" ;;
  esac
fi
[ -n "$files" ] || allow   # nothing to evaluate (e.g. empty/--amend with no changes)

# Documentation paths satisfy the check; lockfiles/binaries don't count as "code".
doc_re='(^|/)(README|AGENTS|CLAUDE|CHANGELOG)|\.(md|mdx|rst|adoc)$|(^|/)docs/'
ignore_re='\.(lock|sum|png|jpg|jpeg|gif|svg|ico|snap|map)$|(^|/)(\.gitignore|\.DS_Store|package-lock\.json|yarn\.lock|pnpm-lock\.yaml|go\.sum|Cargo\.lock|poetry\.lock)$'

has_code=0; has_doc=0
while IFS= read -r f; do
  [ -n "$f" ] || continue
  if printf '%s\n' "$f" | grep -Eiq "$doc_re"; then has_doc=1; continue; fi
  printf '%s\n' "$f" | grep -Eiq "$ignore_re" && continue
  has_code=1
done <<EOF
$files
EOF

if [ "$has_code" = 1 ] && [ "$has_doc" = 0 ]; then
  msg="Code changed but no docs were updated in this commit (README, docs/**, *.md, AGENTS.md, CLAUDE.md). Update the relevant docs, or approve to commit anyway. Bypass: add [skip-docs] to the commit message."
  printf '{"permission":"ask","user_message":"%s","agent_message":"%s"}\n' "$msg" "$msg"
  exit 0
fi
allow
