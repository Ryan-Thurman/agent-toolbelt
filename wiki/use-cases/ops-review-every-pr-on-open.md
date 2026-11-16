# Review every pull request when it opens

This page is for a platform engineer who wants a fresh reviewer on every pull request (PR) when it opens or gets a new push. You set up a trigger and check it before it posts anything. On GitHub the trigger is a CI workflow. On Azure Repos it is a poller. For PRs that your own local agents open, or for one review now, use the pages in Next.

| Roles | Skills and commands | Depth | You need |
| --- | --- | --- | --- |
| Platform engineer, DevOps engineer | [`review-on-open`](../../skills/review-on-open/SKILL.md) (`/review-on-open`), which starts [`pr-review`](../../skills/pr-review/SKILL.md) (`/pr-review`) | The trigger has no levels. The reviewer has three review depths, called tiers (light, standard, deep). Omit `--tier` and the reviewer picks one for each diff. | A repository on GitHub or Azure Repos. For CI, an `ANTHROPIC_API_KEY` secret. For the poller, an authenticated `gh` or `az` command. |

## Quick path

Steps 1 and 5 are for both paths. On GitHub, do step 2. On Azure Repos, or for the poller on GitHub, do steps 3 and 4. Start with one path. Both paths on one repository post once for each head, because the marker stops a second review.

1. Both paths. Install the two packs into the repository: `<toolbelt-folder>/install.sh --harness claude pr-review review-on-open <repo-folder>`.
2. GitHub event path. From `<repo-folder>`, run `mkdir -p .github/workflows && cp .agents/templates/review-on-open-github.yml .github/workflows/agent-pr-review.yml`. Add the Actions secret `ANTHROPIC_API_KEY` (Settings, Secrets and variables, Actions, or `gh secret set ANTHROPIC_API_KEY`). Commit `.github/`, `.claude/`, `.agents/`, and `CLAUDE.md` on a branch, and open one test PR from it. Merge only after that PR gets its review, so the trigger does not cover the whole repository untested.
3. Azure or poller path. Start Claude Code in `<repo-folder>` and run `/review-on-open --dry-run`. Read the list of due PRs. If it holds old or unwanted PRs, narrow the live run with `--label=<label>` or `--author=<login>` and keep `--max` small, or stop here.
4. Azure or poller path. Go live: `/loop 10m /review-on-open --max=3`. Keep the session open, because `/loop` polls only while it runs. For a hands-off poll, use `/schedule` with the same command.
5. Both paths. Wait for the CI job or the next poll tick, then check that the review carries the head marker. On GitHub: `gh api repos/<owner>/<repo>/pulls/<pr-number>/reviews --jq '.[].body' | grep -o 'pr-review:head=[0-9a-f]*'`. On Azure Repos, use the `az devops invoke` command in `skills/pr-review/references/posting.md` (Idempotency). One line with `pr-review:head=<sha>` means success.

You get a fresh review on each new commit of each PR. A second run on the same commit posts nothing.
The sections below explain each step, when to stop, and what the output looks like.

## Situation

The sample is the RealWorld "Conduit" API in TypeScript (Express, Prisma, Jest). The repository is on GitHub. Your team wants each PR reviewed within minutes, with no action from the author.

On the day of the run, the sample's remote listed 44 open PRs. The oldest was last updated in 2017. A team that wires a trigger on a repository like this must decide what happens to that backlog. The run also made a local branch, `demo/tag-search` (commit 4ca8f1c). It adds a tag search route with an unsafe SQL query on purpose, so the review has something to find.

## Why this path

The obvious alternative is to ask each author to run `/pr-review` before they open the PR (see [Self-review before you open a PR](dev-self-review-before-a-pr.md)). That depends on each author. It also breaks a rule that every review trigger follows: the reviewer must not share context with the agent that wrote the PR (`skills/pr-review/references/triggers.md`). `review-on-open` starts each review in a new process (event path) or in a new sub-agent (poller).

The sibling alternative is [`review-queue`](../../skills/review-queue/SKILL.md) (`/enqueue-review` and `/review-queue-worker`). The `review-on-open` skill points to it for PRs that another local agent opens. It keeps jobs in a SQLite file on one machine, so a person must keep a worker session running. A `/schedule` cloud routine cannot read that file. In this scenario people and forks open the PRs, so no local producer exists to fill the queue. The page [Run an agent-to-agent review queue](ops-agent-to-agent-review-queue.md) covers that case.

The skill gives two triggers and one rule to choose between them. If the host can run CI on the PR event, use the event path. It needs no polling and no machine that stays on. Use the poller for hosts without event CI (Azure Repos). Use it also for mixed hosts, for several repositories at once, or for a laptop-side watcher. A repository can run both. Both end in `/pr-review <pr> --comment`, so the trigger adds no review logic.

The procedure has this order because the trigger is only safe after you know what it can do. You first check what the workflow can reach (permissions and the command allowlist). You then rehearse one review without posting. You list due PRs in a dry run. Only then does a trigger post to a real PR.

## Steps

A head SHA is the commit ID at the tip of a PR branch. The skill reviews each head SHA at most once. It records that in a marker, `<!-- pr-review:head=<head-sha> tier=<tier> -->`, at the end of the posted summary.

| Step | Do | Why | Done when |
| --- | --- | --- | --- |
| 1 | Install the packs: `<toolbelt-folder>/install.sh --harness claude pr-review review-on-open <repo-folder>`. Add `--dry-run` first to preview. | The installer copies the commands and skills into the repository. `review-on-open` depends on `pr-review`, so it installs both. | `.claude/commands/review-on-open.md` and `.agents/templates/review-on-open-github.yml` exist. In the run, the installer wrote 82 files. |
| 2 | Choose the trigger. On GitHub with Actions, use the event path (steps 3 to 6). On Azure Repos, use the poller (steps 7 to 9), unless you wire the Azure Pipelines sketch in `skills/review-on-open/references/ci-event.md`. | The skill prefers the event path where the host can run CI. | You can name the trigger and the reason. |
| 3 | Copy the template: `mkdir -p .github/workflows && cp .agents/templates/review-on-open-github.yml .github/workflows/agent-pr-review.yml`. | The skill counts the event path as wired when a copy of the template is in `.github/workflows/`. The installer puts it in `.agents/templates/`, so you must copy it. The file name does not matter. | The file is in `.github/workflows/`. |
| 4 | Read three parts of the file. The trigger must be `pull_request`, not `pull_request_target`. `permissions` must be `contents: read` and `pull-requests: write` only. The `--allowedTools=` list must name command verbs and never a bare `Bash`. | The `permissions` block limits what an injected diff can do. The allowlist is a second layer. | The file has `pull_request`, the two permissions, and no bare `Bash`. The run parsed the file with Ruby YAML and found 4 steps and 19 allowlist entries. |
| 5 | Add the secret `ANTHROPIC_API_KEY` under the repository's Actions secrets. | Each CI run starts a new Claude Code process and needs the key. Fork PRs do not get the secret. That is the safe default. | The secret name appears in the Actions secrets list. |
| 6 | Commit `.github/workflows/agent-pr-review.yml`, `.claude/`, `.agents/`, and `CLAUDE.md`. | Practice, not stated in the skill: the workflow installs Claude Code but not the Toolbelt. The checkout must hold the commands that `claude -p "/pr-review <pr> --comment"` calls. This run did not execute Actions, so it did not test this step. | A PR run finds `/pr-review`. If the CI log says that the command is unknown, the files are missing from the checkout. |
| 7 | Rehearse one review locally, with the CI flags and no `--comment`. From `<repo-folder>`, run: `claude -p "/pr-review <branch-name>" --allowedTools="<list from the workflow>" --disallowedTools="Edit,Write,NotebookEdit,WebFetch,WebSearch" --permission-mode dontAsk --setting-sources project`. Copy the whole value of `--allowedTools=` from the workflow file (19 entries in the template). In the sample, the branch is `demo/tag-search`. | Practice, not stated in the skill: it shows what the allowlist blocks before a real PR does. `dontAsk` makes the run deny unmatched commands, as CI does. Without it, a nested run can inherit a permissive mode. | A report prints and nothing is posted. Read the coverage line for blocked commands. |
| 8 | Run the poller as a dry run: `/review-on-open --dry-run --max=5`. The host CLI must be authenticated (`gh auth status` or `az account show`). | The dry run lists each due PR and its reason (`new` or `head-changed`). It reviews and posts nothing, and it writes no ledger entry. | The output lists up to 5 PRs to review, the deferred PR numbers, and the skipped PRs. |
| 9 | Go live: `/loop 10m /review-on-open --max=3`. For a hands-off routine, use `/schedule` with the same command. | `--max` caps the spend of one poll. A routine starts from a fresh clone, so it uses the host marker, not the local ledger. | A poll ends with a posted review or a logged failure for each due PR, and a summary line for each. Not run here. |
| 10 | Check idempotency (safe to run twice). Run the poller again, or re-run the CI job, on the same commit. Then push a new commit. | The marker stops a second review of one commit. A new push makes a new head SHA, which is a new review target. | The poller skips the PR, or `/pr-review` reports that the head is already reviewed. The push gets one new review. |

## Decision points

- If the host can run CI on the PR event, use the event path. If you use Azure Repos, use the poller. The skill sketches an Azure Pipeline, but the run did not execute it (see "What you get").
- If you need fork PRs reviewed, gate them behind a manual `labeled` trigger or a maintainer-approved workflow. Do not use `pull_request_target`. It combines secrets with untrusted code.
- If `gh` or `az` is missing or not authenticated, stop. The poller cannot list PRs without the host CLI. It has no git-only fallback.
- If the repository has old open PRs, run `--dry-run` first. The poller serves the oldest update first. Narrow the poll with `--label=<label>` or `--author=<login>`, or start with a small `--max`. The skill has no "since" filter.
- If the review bot account also opens PRs, skip them before the due check, unless you want self-review. State the rule that you applied.
- If a PR is a draft, both triggers skip it. A draft that is marked ready gets its review, because `ready_for_review` is in the workflow's `types` list.
- If you want a specific depth, pass `--tier=light|standard|deep`. For a bot, the skill recommends that you omit it.
- If a person runs `/review-on-open` interactively, the skill asks before its first post and then continues. Unattended runs (CI, `/schedule`) post without a prompt.
- Stop when each due PR has a posted review or a logged failure. The event path is wired when a copy of the template is in `.github/workflows/` (any file name) and the `ANTHROPIC_API_KEY` secret exists.
- Choose [`review-queue`](../../skills/review-queue/SKILL.md) when another local agent opens the PRs. The page [Run an agent-to-agent review queue](ops-agent-to-agent-review-queue.md) shows that path.
- Choose [`phase-gate`](../../skills/phase-gate/SKILL.md) when the review must happen inside a phased build, before the PR merges. The page [Gate each phase with a review](ops-gate-each-phase.md) shows that path.
- Choose `/pr-review` alone when you need one review of one PR now. The page [Self-review before you open a PR](dev-self-review-before-a-pr.md) shows that path.

## What you get

The run was headless, so no person answered a question. The skill asked none. The interactive confirm before the first post did not apply, because each run used `--dry-run` or no `--comment`.

First, the poller dry run. The run started Claude Code headless in the repository and ran `/review-on-open --dry-run --max=5`. The skill listed the open PRs with `gh pr list` (a read) on the sample's remote. The numbers below are PR numbers on that remote. The ledger was empty.

Excerpt from a run on the Conduit sample API at commit 30b68e1. Condensed from the run output: the Title column, the rows for #46 and #60, the end of the deferred list, and the three bullets after the deferred list are left out. The text that remains is verbatim. Long lines are wrapped.

```markdown
The dry run found **44 open PRs that are due for review**. With `--max=5`, a
real run would review the 5 longest-waiting PRs below and defer the other 39.
Nothing was reviewed or posted, and nothing was written to the ledger (the
local record of reviewed commits).

| PR | Reason | Head | Last updated |
|---|---|---|---|
| #36 | new | `304d38c` | 2017-07-24 |
| #49 | new | `82d4301` | 2018-01-07 |
...
| #63 | new | `cbb07b0` | 2018-07-27 |

Deferred by `--max=5` (39 PRs, oldest first): #66, #68, #70, #82, ...
```

All 44 PRs were due, and the first five were from 2017 and 2018. The skill logs each deferred PR by number and never drops one silently. Check that the list does not hold PRs that nobody wants reviewed. The same output said that the skill has no filter by date. The output also named the Dependabot PRs, #152 and #153. They stay in the list, because the review account is not Dependabot. This is the rule to skip the review account's own PRs, which the skill asks you to state.

A second check ran a bash script that follows steps 1 to 4 of `poller.md`. It is not part of the skill. The run seeded two ledger lines by hand. PR 36 has an old head, `1111111`, which the run invented. PR 49 has its current head. The two lines below come from the script output.

Excerpt from a run on the Conduit sample API at commit 30b68e1. Condensed from the script output: the provider lines, the `due total: 43` line, and the `WOULD REVIEW` rows after #36 are left out. Lines are wrapped.

```text
WOULD REVIEW #36 @304d38c  due: head-changed 1111111->304d38c
  (updated 2017-07-24T06:34:50Z)
...
skipped: #49 (skip: ledger has this head)
```

The marker check is the second due condition. No PR on the sample's remote has a review marker. The run tested that branch on a fixture body that carries the marker.

Fixture output from the run, not a host read. The heads are invented, and `aaaaaaa` and `bbbbbbb` stand for their 40-character forms.

```text
head aaaaaaa: skip, host marker found
head bbbbbbb: due (no marker for this head)
```

Next, the local rehearsal of the CI job. The run used the allowlist from the template and no `--comment`. The tier was `standard`, chosen by the reviewer, and the wall-clock time was 2 minutes 22 seconds. The reviewer started five facet sub-agents. A facet is one review lens, such as security or tests. Read the coverage line first. It shows what the allowlist blocked.

Excerpt from a run on the Conduit sample API at commit 4ca8f1c. Lines are wrapped, and `...` marks skipped text.

```markdown
## PR review: demo/tag-search · tier: standard · **REQUEST CHANGES**
...
_coverage: complete for the 2 changed files (23 added lines) · tier:
standard (auto: logic-bearing route and service change, no hot-path path
match) · facets: correctness, security, tests, standards, maintainability,
performance, reliability · the PR lookup with `gh` was blocked, so I
reviewed the branch against `master` · React rules: Skipped (no React
files, and the scan could not run because Bash was blocked) · No
acceptance criteria supplied_
...
- **src/app/routes/tag/tag.service.ts:41** — SQL injection through
  `$queryRawUnsafe`
  Line 42 puts `prefix` into `LIKE '${prefix}%'`, and `$queryRawUnsafe`
  runs that string without escaping it. ...
```

The report names the seeded flaw as one blocker and adds three `should-fix` findings. In CI, the PR number is passed, so the blocked `gh pr list` branch lookup does not apply. The scan is a different case. In the rehearsal, the scan was skipped because Bash was blocked, and a probe showed that `python3` is denied under the CI allowlist. The CI allowlist has no `python3` entry, so expect the same `Skipped` result for React diffs in CI. This is an inference. No run used a React repository or a CI job. For this API the scan has nothing to check, so the effect is none.

What you must check in the output:

- The poll lists the PRs that you expect, with a reason for each, and a deferred list.
- The coverage line of a rehearsal names each blocked command. Widen the allowlist for one named command. Never use a bare `Bash`.
- The verdict is informational. On GitHub the review is posted as a `COMMENT` event and does not block the merge.
- A posted summary ends with the `pr-review:head=<head-sha>` marker.

What the run did not execute:

- A GitHub Actions run. The run read and parsed the workflow file only.
- Any posting with `--comment`, on GitHub or Azure Repos.
- `az repos pr list`, the Azure Pipelines sketch, `/loop`, and `/schedule`. The `az` command is not installed in the run.
- The interactive confirm before the first post.
- The marker lookup on a PR that has a real review.

## Common mistakes

- You switch the trigger to `pull_request_target` so that fork PRs get the secret. That runs untrusted code with secrets and a write token. Keep `pull_request`, and gate fork review separately.
- You write `Bash` in the allowlist, or you put a space after `--allowedTools`. A bare `Bash` allows `gh pr merge` and `git push`. The space form can swallow the prompt. Use the `=`-joined form of the template.
- You skip the commit in step 6. This is practice, not stated in the skill, and not run: CI then has no `/pr-review` command, because the workflow does not install the Toolbelt. Check the first CI log for an unknown `/pr-review`.
- You start the poller live on a repository with old PRs. It reviews the oldest first and posts to PRs that nobody has touched for years. Run `--dry-run` and set `--max` first.
- You treat `REQUEST CHANGES` as a merge block. The verdict is informational by default. To block merges, use the host's branch protection.
- You trust the local ledger more than the host marker. The ledger is a cache. A routine that starts from a fresh clone has no ledger. The marker on the host is the record.
- You expect a dry run to show review content. It lists due PRs only. Use the local rehearsal in step 7 to see a review.
- You expect the poller to post as a separate bot account. Practice, not stated in the skill: it posts as the account that is signed in to `gh` or `az`. Sign in with a bot account if you want a separate identity, and skip that account's own PRs.

## Next

- [Run an agent-to-agent review queue](ops-agent-to-agent-review-queue.md): when other local agents open the PRs.
- [Gate each phase with a review](ops-gate-each-phase.md): when you want the review inside a phased build.
- [Self-review before you open a PR](dev-self-review-before-a-pr.md): when you want one review of one PR now.
- [Enforce a pre-PR gate](ops-enforce-a-pre-pr-gate.md): when you also want checks before the PR opens.
- [Answer review comments](dev-answer-review-comments.md): when authors must reply to the posted review.
- [Install the Toolbelt for a team](ops-install-for-a-team.md): when many repositories need the same install.
- [Run agents without a person](ops-unattended-agent-runs.md): when the trigger belongs to a wider unattended setup.
- [Use-case index](README.md): the full list of use-case pages.
