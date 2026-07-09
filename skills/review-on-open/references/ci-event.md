# The event (CI) path — fire a review on the PR event

On GitHub, the host already emits a `pull_request` event when a PR is opened or pushed to. That event
*is* the trigger — so instead of polling, a CI job runs a **headless** Claude Code that reviews the
exact PR the event names. Each CI run is a brand-new process, which gives the "fresh agent, not the
authoring agent" property for free.

The shipped workflow is `templates/review-on-open-github.yml`. A target repo copies it to
`.github/workflows/` and adds one secret. This reference explains what it does and why each line is
the way it is.

## The workflow, annotated

```yaml
name: agent-pr-review
on:
  pull_request:
    types: [opened, synchronize, reopened]   # opened + every new push (synchronize) + reopen
permissions:
  contents: read            # read the code…
  pull-requests: write      # …and post the inline review. Nothing else.
concurrency:
  group: pr-review-${{ github.event.pull_request.number }}
  cancel-in-progress: true  # a newer push supersedes an in-flight review of an older SHA
jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0     # full history — pr-review diffs base..head, needs both
      - uses: actions/setup-node@v4
        with: { node-version: 22 }
      - run: npm install -g @anthropic-ai/claude-code
      - name: Review the PR
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}     # read-scoped, for gh inside pr-review
          PR: ${{ github.event.pull_request.number }}
        run: |
          claude -p "/pr-review $PR --comment" \
            --allowedTools "Bash(gh pr view:*),Bash(gh pr diff:*),Bash(gh pr list:*),Bash(gh pr checks:*),Bash(gh api:*),Bash(gh auth status:*),Bash(git diff:*),Bash(git log:*),Bash(git show:*),Bash(git fetch:*),Bash(git rev-parse:*),Bash(git merge-base:*),Bash(git status:*),Bash(git symbolic-ref:*),Read,Grep,Glob,Task" \
            --disallowedTools "Edit,Write,NotebookEdit,WebFetch"
```

Notes:
- **`claude -p "…"`** is headless (print) mode — one prompt, no interactive session. The prompt is
  just your existing slash command; `--comment` does the inline posting via the `pr-review` provider
  layer, which uses `gh` and the `GH_TOKEN` above.
- **`--allowedTools`** keeps the unattended run from prompting for permission — under headless `-p`
  an unmatched permission check is denied, not asked, so everything review runs must be pre-allowed.
  Scope Bash entries to **verbs**: bare `Bash` in an allowlist grants *all* shell commands, not "the
  Bash review needs". The list above covers exactly what `pr-review` runs to diff and post; it omits
  `gh pr merge` and `gh pr review`. Posting rides on `Bash(gh api:*)`, which is why the workflow's
  `permissions:` block is the real backstop — a `contents: read` token cannot merge no matter what a
  malicious diff talks the reviewer into. (`skills/auto-agent-contract/references/invocation.md` §4
  covers this boundary in depth for orchestrator-driven reviewers, which never post at all.)
- The repo's `.pr-review.md` (if present) is picked up automatically by `pr-review` — per-repo
  priorities apply to the bot exactly as to a human-invoked review.

## Required secret

- **`ANTHROPIC_API_KEY`** — add under the repo's *Settings → Secrets and variables → Actions*. (Or
  use your org's Claude Code GitHub auth if you have one.)
- **`GITHUB_TOKEN`** is provided by Actions automatically; the `permissions:` block scopes it to
  read-code + write-PR-comments and nothing more.

## Untrusted-diff hardening (read this)

A PR's diff, title, and body are **untrusted** — the `pr-review` skill already treats them as data,
not instructions, but CI adds a second risk: a malicious PR running with access to your secrets.

- **Use `pull_request`, never `pull_request_target`.** `pull_request` runs in the *untrusted* context:
  the fork's code, **no** access to repo secrets by default, read-only token. `pull_request_target`
  runs in the *base* repo's trusted context with secrets and a write token — combining that with
  checking out untrusted PR code is the classic Actions exfiltration hole. Don't.
- That means **fork PRs won't have `ANTHROPIC_API_KEY`** (secrets aren't exposed to fork-triggered
  runs). That's the safe default. For a private repo where all PRs are from trusted branches, this is
  a non-issue. If you genuinely need fork-PR review, gate it behind a manual `labeled` trigger or a
  separate maintainer-approved workflow — don't reach for `pull_request_target`.
- Keep `permissions:` minimal (above). Never add `Write`/`Edit`/`WebFetch` to `--allowedTools` for a
  reviewer.

## Idempotency & the marker

Actions fires once per push, so the SHA changing is the natural dedup — `synchronize` gives you a new
run per new head, and `concurrency.cancel-in-progress` kills a review of a now-stale SHA. To also stay
idempotent across a re-run of the *same* commit (and to interlock with the poller so the two never
double-post), the review's posted comment carries a hidden marker tying it to the head SHA, e.g.:

```
<!-- review-on-open: sha=<head-sha> -->
```

Before posting, `--comment` (and the poller) check whether a marker for the current head already
exists and skip if so. This is the same marker the poller's seen-ledger check honors
(`poller.md` → "The seen-ledger").

## Azure Repos (sketch)

Azure has no GitHub-Actions equivalent baked into the repo; the event path is an **Azure Pipeline**
with a PR trigger that runs the same headless command:

```yaml
pr:
  branches: { include: ['*'] }      # build validation on PRs
steps:
  - script: npm install -g @anthropic-ai/claude-code
  - script: claude -p "/pr-review $(System.PullRequest.PullRequestId) --comment"
    env:
      ANTHROPIC_API_KEY: $(ANTHROPIC_API_KEY)        # pipeline secret variable
      AZURE_DEVOPS_EXT_PAT: $(AZURE_DEVOPS_EXT_PAT)   # PAT for az to post threads
```

`pr-review`'s provider layer detects Azure and posts per-location `pullRequestThreads`. Until you wire
a Pipeline, run the **poller** against Azure instead (`poller.md`) — no CI required.
