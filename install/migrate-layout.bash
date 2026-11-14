# Migrate project installs before installing any selected pack. Sourced by lib.sh.

# Rewrite legacy paths in text. Preserve binary files byte for byte.
layout_copy() {
  if LC_ALL=C grep -Iq '\.atb/' "$1"; then
    LC_ALL=C sed 's#\.atb/#.agents/#g' "$1" > "$2"
  else
    cat "$1" > "$2"
  fi
}

layout_rewrite() {
  local file="$1" tmp
  LC_ALL=C grep -Iq '\.atb/' "$file" || return 0
  if [ "$DRY_RUN" = 1 ]; then
    echo "~ would migrate paths: $file"
    return 0
  fi
  tmp="$(mktemp "$(dirname "$file")/.agents-migrate.XXXXXX")" || return 1
  cp -p "$file" "$tmp" && layout_copy "$file" "$tmp" && mv "$tmp" "$file" || {
    rm -f "$tmp"
    return 1
  }
}

migrate_layout() {
  local legacy="$TARGET/.atb" canonical="$TARGET/.agents" file rel dest dir tmp name
  [ -e "$legacy" ] || [ -L "$legacy" ] || return 0
  if [ ! -d "$legacy" ] || [ -L "$legacy" ] || [ -L "$canonical" ] || { [ -e "$canonical" ] && [ ! -d "$canonical" ]; }; then
    echo "! layout migration needs regular .atb and .agents directories: $TARGET" >&2
    return 1
  fi

  # Check every destination before changing either tree. Local changes that differ
  # between copies need manual resolution, including with --force.
  while IFS= read -r -d '' file; do
    rel="${file#"$legacy"/}"
    dest="$canonical/$rel"
    if [ -L "$file" ] || { [ ! -f "$file" ] && [ ! -d "$file" ]; } || [ -L "$dest" ]; then
      echo "! layout migration cannot merge a link or special file: $file -> $dest" >&2
      return 1
    fi
    if [ -d "$file" ]; then
      if [ -e "$dest" ] && [ ! -d "$dest" ]; then
        echo "! layout migration directory conflicts with file: $dest" >&2
        return 1
      fi
    elif [ -e "$dest" ]; then
      if [ ! -f "$dest" ] || ! cmp -s <(layout_copy "$file" /dev/stdout) <(layout_copy "$dest" /dev/stdout); then
        echo "! layout migration conflict: $file and $dest differ. Merge these files, then rerun the installer." >&2
        return 1
      fi
    fi
  done < <(find "$legacy" -mindepth 1 -print0)

  if [ "$DRY_RUN" = 1 ]; then
    echo "~ would migrate $legacy into $canonical and remove duplicate files"
  else
    mkdir -p "$canonical" || return 1
    while IFS= read -r -d '' dir; do
      mkdir -p "$canonical/${dir#"$legacy"/}" || return 1
    done < <(find "$legacy" -mindepth 1 -type d -print0)
    while IFS= read -r -d '' file; do
      dest="$canonical/${file#"$legacy"/}"
      if [ ! -e "$dest" ]; then
        cp -p "$file" "$dest" || return 1
      fi
      layout_rewrite "$dest" || return 1
      rm "$file" || return 1
    done < <(find "$legacy" -type f -print0)
  fi

  # Both old skill copies contained legacy paths. Update the surviving tree,
  # including packs that were not selected for this run.
  if [ -d "$canonical" ]; then
    while IFS= read -r -d '' file; do
      layout_rewrite "$file" || return 1
    done < <(find "$canonical" -type f -print0)
  fi

  # Include retired commands and rules that still refer to the moved payload.
  # Keep host files that have no Toolbelt path unchanged.
  for file in "$TARGET"/.cursor/commands/*.md "$TARGET"/.claude/commands/*.md "$TARGET"/.cursor/rules/*.mdc; do
    [ ! -L "$file" ] && [ -f "$file" ] || continue
    LC_ALL=C grep -Eq '\.atb/(skills|templates|workflows|examples|shared)/' "$file" || continue
    layout_rewrite "$file" || return 1
  done

  # Root instructions can contain user text outside the installer marker block.
  for name in AGENTS.md CLAUDE.md; do
    file="$TARGET/$name"
    [ ! -L "$file" ] && [ -f "$file" ] || continue
    if [ "$DRY_RUN" = 1 ]; then
      echo "~ would migrate Toolbelt paths in $file"
      continue
    fi
    tmp="$(mktemp "$(dirname "$file")/.agents-migrate.XXXXXX")" || return 1
    cp -p "$file" "$tmp" && sed '/^<!-- BEGIN agent-toolbelt -->$/,/^<!-- END agent-toolbelt -->$/s#\.atb/#.agents/#g' "$file" > "$tmp" && mv "$tmp" "$file" || {
      rm -f "$tmp"
      return 1
    }
  done

  if [ "$DRY_RUN" != 1 ]; then
    while IFS= read -r -d '' dir; do
      rmdir "$dir" || return 1
    done < <(find "$legacy" -depth -type d -print0)
    echo "~ migrated: $legacy -> $canonical"
  fi
}
