# Target resolution & diff acquisition

How to figure out *what* to review and get the diff in a reliable, line-anchored form.

> **Detect the provider first** (`providers.md`): GitHub (`gh`), Azure Repos (`az`), or generic
> `git`. The PR paths below are shown per provider; the branch/local paths are pure git and work
> everywhere. If the host CLI is missing, degrade to the git path (branch/local, report-only).

## Resolve the target

Given the `target` argument:

- **PR URL** → extract the PR number/id and the provider from the host (`providers.md`).
- **PR number/id** (`6193` or `#6193`) → use directly with the detected provider.
- **Branch name** → check for an open PR first:
  ```bash
  # github:
  gh pr list --head <branch> --json number --jq '.[0].number'
  # azure:
  az repos pr list --source-branch <branch> --status active --query '[0].pullRequestId'
  ```
  If a PR exists, review the PR; else review the branch against its base.
- **Empty** → review **local working changes** (committed + staged + unstaged + untracked) against
  the merge-base with the base branch. This is the pre-PR / pre-push case. (Provider-independent.)

### Base-branch detection (for branch/local targets)

Resolve the base in this order, first hit wins:
```bash
git symbolic-ref --quiet --short refs/remotes/origin/HEAD 2>/dev/null   # e.g. origin/main
git rev-parse --verify --quiet main   && echo main
git rev-parse --verify --quiet master && echo master
```

## Acquire the diff

**PR (source of truth — do NOT substitute local `git diff` when an open PR exists):**

GitHub (`gh` has a first-class diff verb):
```bash
gh pr view <n> --json title,body,baseRefName,headRefName,files,additions,deletions,url
gh pr diff <n>
```

Azure Repos (`az` has **no** `pr diff` verb — get the PR's refs, then diff them with git):
```bash
az repos pr show --id <id> \
  --query '{src:sourceRefName, tgt:targetRefName, title:title, url:url}'   # refs are refs/heads/<branch>
git fetch origin
src=feature/x; tgt=main                          # strip the refs/heads/ prefix from the query output
git diff "origin/$tgt...origin/$src"             # three-dot: changes on the source since it diverged
git diff "origin/$tgt...origin/$src" --stat
```
The three-dot diff matches what the PR shows (source changes vs the merge-base with target). Pull the
PR description/title from `az repos pr show` so spec-alignment and the summary still have context.

**Branch (no PR):**
```bash
git fetch origin
git log <base>..HEAD --oneline
git diff <base>..HEAD
```

**Local working changes (empty target):**
```bash
base="$(git merge-base <base> HEAD)"
git diff "$base"            # committed + unstaged vs merge-base
git diff "$base" --stat
git status --porcelain      # surface staged/untracked too
```
Covers committed, staged, unstaged, and (via status) untracked work — review before you push.

## Format for line-anchored review

Raw unified diff is hard to anchor comments to. Restructure each hunk so every line you might
comment on has an explicit **new-file line number**:

```
## File: path/to/file.ts
@@ -<old> +<new> @@
__new hunk__
<new_line_no>  <added/context line>      ← anchor findings to these numbers
...
__old hunk__
<removed line>                            ← context only; never anchor here
```

- Anchor every finding to a **new-side line number** (`lineStart`/`lineEnd`).
- For large PRs, don't dump the whole diff — pull file slices on demand and prioritise:
  models → controllers → migrations → routes → key tests.
