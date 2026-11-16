# The event (CI) path: fire a review on the PR event

On GitHub, the host already emits a `pull_request` event when a PR is opened or pushed to. That event
*is* the trigger, so instead of polling, a CI job runs a **headless** Claude Code that reviews the
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
    types: [opened, synchronize, reopened, ready_for_review]   # opened + every new push (synchronize) + reopen + draft marked ready
permissions:
  contents: read            # read the code…
  pull-requests: write      # …and post the inline review. Nothing else.
concurrency:
  group: pr-review-${{ github.event.pull_request.number }}
  cancel-in-progress: true  # a newer push supersedes an in-flight review of an older SHA
jobs:
  review:
    runs-on: ubuntu-latest
    if: github.event.pull_request.draft == false   # skip draft PRs
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0     # full history — pr-review diffs base..head, needs both
      - uses: actions/setup-node@v4
        with: { node-version: 22 }
      - run: npm install -g @anthropic-ai/claude-code
      - name: Load instruction files from the base ref
        env:
          BASE_SHA: ${{ github.event.pull_request.base.sha }}
        run: |
          for f in CLAUDE.md AGENTS.md .pr-review.md .claude/pr-review.md STYLE_GUIDE.md
          do
            if git cat-file -e "$BASE_SHA:$f" 2>/dev/null
            then
              mkdir -p "$(dirname "$f")"
              git show "$BASE_SHA:$f" > "$f"
            else
              rm -f "$f"
            fi
          done
          for d in .agents .claude
          do
            rm -rf "$d"
            if git cat-file -e "$BASE_SHA:$d" 2>/dev/null
            then
              git archive "$BASE_SHA" "$d" | tar -x
            fi
          done
      - name: Review the PR
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}     # scoped by `permissions:` above
          PR: ${{ github.event.pull_request.number }}
        run: |
          claude -p "/pr-review $PR --comment" \
            --allowedTools="Bash(gh auth status:*),Bash(gh pr view:*),Bash(gh pr diff:*),Bash(gh issue view:*),Bash(gh api:*),Bash(git diff:*),Bash(git log:*),Bash(git show:*),Bash(git status:*),Bash(git rev-parse:*),Bash(git merge-base:*),Bash(git symbolic-ref:*),Bash(git remote:*),Bash(git fetch:*),Bash(jq:*),Bash(python3 .agents/shared/contracts/scripts/react-rule-scan.py:*),Read,Grep,Glob,Task" \
            --disallowedTools="Edit,Write,NotebookEdit,WebFetch,WebSearch"
```

Notes:
- **`if: ... draft == false`** skips draft PRs. A draft that is marked ready gets its review when it is marked ready, because `ready_for_review` is in `types`.
- **`Load instruction files from the base ref`** restores the base versions of the root instruction files
  and of the `.agents/` and `.claude/` folders before the reviewer starts. See "Untrusted-diff hardening" below.
- **`claude -p "…"`** is headless (print) mode, one prompt, no interactive session. The prompt is
  just your existing slash command. `--comment` does the inline posting via the `pr-review` provider
  layer, which uses `gh` and the `GH_TOKEN` above.
- **`--allowedTools` is variadic**, so the space-separated form (`--allowedTools "a,b,c"` followed by
  the prompt) can swallow a positional argument. Use the `=`-joined form above.
- **Scope `Bash` to verbs, not to `Bash`.** A bare `Bash` in the allowlist grants *every* Bash
  command, including `gh pr merge` and `git push`. It looks restrictive and restricts nothing.
- **The list above is exhaustive, and has to be.** Under headless `-p` an unmatched permission check
  is **denied, not prompted**, so a command review needs but the allowlist omits fails mid-run. Each
  entry earns its place: `gh pr diff`/`gh pr view` fetch the target
  (`skills/pr-review/references/targets-and-diff.md`), `gh issue view` reads the linked issue for intent
  (same file), `git remote`/`git symbolic-ref` detect the host
  and base branch, `git fetch`/`git merge-base` resolve `base...head`, `git rev-parse --git-path`
  locates the rejection-memory store, `gh api` posts the inline review, `jq` builds the payload
  (`skills/pr-review/references/posting.md`), and `python3 .agents/shared/contracts/scripts/react-rule-scan.py`
  runs the React rule scan for JavaScript or TypeScript diffs (`skills/pr-review/SKILL.md`). `install.sh`
  places the scan under `.agents/shared/contracts/`. If you narrow the list, re-derive it from what
  `pr-review` actually invokes, and if a run dies on a denied command, widen the allowlist rather than falling
  back to bare `Bash`.
- **The allowlist is not the security boundary: `permissions:` is.** `Bash(gh api:*)` cannot be
  scoped to an HTTP verb, so the reviewer can in principle call any endpoint the token permits. With
  `contents: read` the token cannot merge (merging needs `contents: write`). With
  `pull-requests: write` it can post, and it can also close or retitle the PR. Keep `permissions:`
  minimal and treat the allowlist as defense in depth, not as the thing standing between an injected
  diff and your repo.
- The repo's `.pr-review.md` (if present) is picked up automatically by `pr-review`, per-repo
  priorities apply to the bot exactly as to a human-invoked review. The restore step above makes the
  base version the one in effect.
- **The workflow does not install the Toolbelt.** The headless `/pr-review` command reads the installed
  skills from the checkout. Run `install.sh` in the target repo and commit the files it writes, including
  `.agents/shared/contracts/`. Without them, the `/pr-review` command is not found.

## Required secret

- **`ANTHROPIC_API_KEY`**: add under the repo's *Settings -> Secrets and variables -> Actions*. (Or
  use your org's Claude Code GitHub auth if you have one.)
- **`GITHUB_TOKEN`** is provided by Actions automatically. The `permissions:` block scopes it to
  read-code + write-PR-comments and nothing more.

## Untrusted-diff hardening (read this)

A PR's diff, title, and body are **untrusted**. The `pr-review` skill already treats them as data,
not instructions, but CI adds a second risk: a malicious PR running with access to your secrets.

- **Use `pull_request`, never `pull_request_target`.** `pull_request` runs in the *untrusted* context:
  the fork's code, **no** access to repo secrets by default, read-only token. `pull_request_target`
  runs in the *base* repo's trusted context with secrets and a write token, combining that with
  checking out untrusted PR code is the classic Actions exfiltration hole. Do not.
- That means **fork PRs will not have `ANTHROPIC_API_KEY`** (secrets are not exposed to fork-triggered
  runs). That is the safe default. For a private repo where all PRs are from trusted branches, this is
  a non-issue. If you genuinely need fork-PR review, gate it behind a manual `labeled` trigger or a
  separate maintainer-approved workflow. Do not reach for `pull_request_target`.
- **Load the reviewer's instructions from the base ref.** The checkout is the PR merge ref, so a PR
  can edit `CLAUDE.md`, `AGENTS.md`, `.pr-review.md`, `.claude/pr-review.md`, or `STYLE_GUIDE.md`. Those
  files set the rules that judge the PR. The workflow therefore restores the base versions of these root
  files before `claude` runs, and removes any file the base does not have. It also replaces the
  `.agents/` and `.claude/` folders with their base versions. These folders hold the installed reviewer
  skills, the commands, and the React scan script that the allowlist runs. Without this step, a PR can
  change the reviewer itself or run its own code with the job token. Claude Code reads `CLAUDE.md`
  from the working tree by itself, so this restore step is the control. `pr-review` also loads
  `.pr-review.md` from the base (`skills/pr-review/references/repo-config.md`). The step does not cover
  instruction files in subfolders. The PR diff still shows any change to them, and a reviewer must judge
  that change on its own.
- Keep `permissions:` minimal (above). It, not `--allowedTools`, is what bounds the blast radius.
  Never add `Write`/`Edit`/`WebFetch` to a reviewer's allowlist, and never grant bare `Bash` or
  `Bash(gh:*)`: either one lets a reviewer that an injected diff has talked into approving itself
  reach an API that records the approval.

## Idempotency

Actions fires once per push, so a new head SHA starts a new run. `concurrency.cancel-in-progress`
stops a review of a stale SHA. A re-run of the same commit, or a poller run, must not post again.
`--comment` writes and checks the head-SHA marker in `skills/pr-review/references/posting.md` ->
"Idempotency". The poller checks the same marker (`poller.md` -> "The due check").

## Azure Repos (sketch)

Azure has no GitHub-Actions equivalent baked into the repo. The event path is an **Azure Pipeline**
with a PR trigger that runs the same headless command. Copy the tool lists, the full-depth checkout, and
the base-ref restore from the GitHub workflow. `az` calls replace the `gh` calls:

```yaml
pr:
  branches: { include: ['*'] }      # build validation on PRs
steps:
  - checkout: self
    fetchDepth: 0                    # full history, as in the GitHub workflow
  - script: npm install -g @anthropic-ai/claude-code
  # The target repo must commit the Toolbelt files that install.sh writes. The headless run reads them.
  - script: |
      git fetch origin "$(System.PullRequest.TargetBranchName)"
      BASE_SHA="$(git rev-parse FETCH_HEAD)"
      for f in CLAUDE.md AGENTS.md .pr-review.md .claude/pr-review.md STYLE_GUIDE.md
      do
        if git cat-file -e "$BASE_SHA:$f" 2>/dev/null
        then
          mkdir -p "$(dirname "$f")"
          git show "$BASE_SHA:$f" > "$f"
        else
          rm -f "$f"
        fi
      done
      for d in .agents .claude
      do
        rm -rf "$d"
        if git cat-file -e "$BASE_SHA:$d" 2>/dev/null
        then
          git archive "$BASE_SHA" "$d" | tar -x
        fi
      done
  - script: |
      claude -p "/pr-review $(System.PullRequest.PullRequestId) --comment" \
        --allowedTools="Bash(az repos pr show:*),Bash(az repos pr list:*),Bash(az repos pr work-item list:*),Bash(az devops invoke:*),Bash(az account show:*),Bash(git diff:*),Bash(git log:*),Bash(git show:*),Bash(git status:*),Bash(git rev-parse:*),Bash(git merge-base:*),Bash(git symbolic-ref:*),Bash(git remote:*),Bash(git fetch:*),Bash(jq:*),Bash(python3 .agents/shared/contracts/scripts/react-rule-scan.py:*),Read,Grep,Glob,Task" \
        --disallowedTools="Edit,Write,NotebookEdit,WebFetch,WebSearch"
    env:
      ANTHROPIC_API_KEY: $(ANTHROPIC_API_KEY)        # pipeline secret variable
      AZURE_DEVOPS_EXT_PAT: $(AZURE_DEVOPS_EXT_PAT)   # PAT for az to post threads
```

The allowlist covers the `az` verbs that `pr-review` calls (`skills/pr-review/references/posting.md`).
`az devops invoke` can call any endpoint the PAT allows, the same as `gh api`, so limit the PAT scope.
The verdict vote (`az repos pr set-vote`) is not in the list. Add it only if the bot must vote.

`pr-review`'s provider layer detects Azure and posts per-location `pullRequestThreads`. Until you wire
a Pipeline, run the **poller** against Azure instead (`poller.md`). It needs no CI.
