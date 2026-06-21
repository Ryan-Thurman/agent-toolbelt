---
description: Review a PR or branch with a code-review mindset (bugs, regressions, security, concurrency, missing tests)
argument-hint: "[PR url | PR number | branch | empty for current branch]"
source: found sample, no repo of origin
---

# Review

Review a PR or branch with a code review mindset. Prioritize bugs, behavior regressions, security risks, concurrency, and missing tests. Do not change code unless the user explicitly asks you to.

## Parameters

- `$ARGUMENTS` - Can be:
  - GitHub PR URL
  - PR number (e.g. `6193` or `#6193`)
  - branch name
  - empty, to review the current branch

## Instructions

### 1. Read project conventions

Before reviewing, read `CLAUDE.md` if it exists at the repo root to understand conventions, gotchas, and expected patterns.

### 2. Resolve what to review

If `$ARGUMENTS` is a PR URL, extract the number.

If `$ARGUMENTS` is a PR number, use it directly.

If `$ARGUMENTS` is a branch name:

- first try to resolve whether an open PR exists for that branch with:

```bash
gh pr list --head <branch_name> --json number --jq '.[0].number'
```

- if a PR exists, review the PR
- if there is no PR, review the branch against its base (`main` or `master`)

If `$ARGUMENTS` is empty:

- use the current branch
- try to resolve whether that branch has an open PR
- if it has no PR, review the current branch against its base (`main` or `master`)

### 3. If you are reviewing a PR

Fetch metadata:

```bash
gh pr view <number> --json title,body,baseRefName,headRefName,files,additions,deletions,url
```

Fetch the exact PR diff:

```bash
gh pr diff <number>
```

Use `gh pr diff` as the source of truth. Do not use local `git diff` to review a PR when an open PR already exists.

### 4. If you are reviewing a branch with no PR

Prepare context:

```bash
git branch --show-current
git fetch origin
git rev-parse --verify main 2>/dev/null && echo "main" || echo "master"
git log <base>..HEAD --oneline
git diff <base>..HEAD --stat
git diff <base>..HEAD
```

### 5. Analyze and present

Present the review in English with this structure:

## Summary

- What the PR or branch does
- Main files touched
- What the change seems intended to do

## Risks / potential issues

- Blocking findings or items that should be addressed before merge
- Prioritize:
  - functional bugs
  - regressions
  - security
  - concurrency
  - performance
  - missing validation or authorization
  - missing tests that leave real gaps

Be specific and reference files and lines when applicable.

If you find no blocking risks, say so explicitly.

## Possible improvements

- Non-blocking improvements
- simplifications
- consistency with project patterns
- additional useful coverage

## Suggested changes to decide on

At the end of the review, list suggested changes briefly and in an actionable way. This section should help decide what to implement and what to skip, so:

- group related changes
- distinguish blocking vs non-blocking
- avoid repeating the whole review
- phrase each point as a concrete action

Example:

- Blocking: reuse the failed export instead of creating a new one
- Blocking: prevent regeneration from `pending` and `processing`
- Non-blocking: add tests for the button’s visible states

## Notes

- Only review changes in the PR or branch compared to its base
- Do not comment on code outside the diff
- Focus on what matters, not formatting nitpicks
- If the diff is very large, prioritize models, controllers, migrations, routes, and key specs
- Keep the response concise
