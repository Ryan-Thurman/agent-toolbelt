# Prepare a plan and task records for unattended agent runs

This page is for a platform engineer who wants a runner program to implement and review work with agent CLIs while nobody watches. The Toolbelt prepares the plan and the rules. Your runner executes them. You get a validated plan that the runner parses. You also get a configuration to check before the first run and an optional task record that a checker validates.

| Roles | Skills and commands | Depth | You need |
| --- | --- | --- | --- |
| Platform engineer | [`auto-agent-contract`](../../plugins/agent-toolbelt-auto-agent/skills/auto-agent-contract/SKILL.md) (`/auto-agent-plan`), [`auto-agent-dev-lite`](../../plugins/agent-toolbelt-auto-agent/skills/auto-agent-dev-lite/SKILL.md), the [task execution contract](../../shared/contracts/references/execution.md) with its checker `validate-execution.py` | No levels. Neither skill has a depth setting. | A repository with a test command, a roadmap or ticket list, and a runner program such as `agent-runner`. The Toolbelt does not ship `agent-runner`. The plugin README says to install it from its own checkout and names no source, so you need your own copy. Run `agent-runner --version` to check it. Without it you can still draft the plan, but you cannot validate it. |

## Quick path

1. Start Claude Code in the target repository with both plugins: `claude --plugin-dir <toolbelt-folder> --plugin-dir <toolbelt-folder>/plugins/agent-toolbelt-auto-agent`.
2. Create the runner configuration once: `agent-runner init`. If the command is not found, stop here: you can still draft the plan in step 3, but you cannot validate it until you have the runner. Open `.agent-runner.json`, check that `checks` holds your test command, and set `"mergeOnClose": false` for the first run. If the repository has no test command, stop and write one first.
3. Draft the plan: `/agent-toolbelt-auto-agent:auto-agent-plan <roadmap-file>`.
4. Validate the plan: `agent-runner plan-validate`. Compare the phase count that it prints with the phases that you wrote. If the count is lower, look for a heading that is not `## Phase <n>:` and fix it before step 5.
5. Read each phase, delete the ones that you do not want, and commit the plan. Start the runner yourself, never from the agent session: `agent-runner run`. Version 0.1.0 prints `autorun run` as its next step after init. Use `agent-runner run`, as the skill does.

You get a committed plan with one phase for each pull request. Each phase has a command that decides if it is done.
The sections below explain each step, when to stop, and what the output looks like.

## Situation

The sample is the RealWorld "Conduit" API in TypeScript (Express, Prisma, Jest). Your platform runs agent command line tools as subprocesses and wants them to work through a list of changes. The runner program is `agent-runner`. It is not part of the Toolbelt repository. The run used a local build, version 0.1.0.

The Toolbelt does not run the loop. It gives you the rules for the loop and a command that drafts the plan. The skill `auto-agent-contract` names `agent-runner` as its reference implementation, and the plan format comes from that runner's parser. In this page, the caller is the runner. A worker is one agent job that the runner starts. The closer is the agent job that writes the status after a phase.

At commit 30b68e1 the repository has two open problems. With no database, 7 of the 27 tests fail, all in the auth service test file. No test fails when `getCurrentUser` stops selecting the user `id`. These two items became two phases.

The run had no person and no database. It drafted and validated the plan, and it ran one worker job by hand under the `auto-agent-dev-lite` rules. It did not start `agent-runner run`. The run did not load the plugin, so it followed the procedure of the slash command by hand. It also wrote `docs/roadmap.md` itself, because the sample had none.

## Why this path

The obvious alternative is `phased-delivery` in an interactive session. The `auto-agent-dev-lite` skill says to use `phased-delivery` for human-supervised work. It costs you a person in the session. That skill waits for approval of the phase map before it implements, and it stops for human scope decisions.

The sibling for in-session review is `phase-gate`. A subagent reviews at each phase boundary, and a person is in the session. See [Gate each phase with a review](ops-gate-each-phase.md). Use it when the loop runs inside your agent session. The loop lives in the session. This is practice, not a statement of the skill: no program outside the session tracks the phase state.

This path moves the loop into a program that spawns agent CLIs, keeps state in SQLite, and decides each next step. The skill states a principle: never let a model decide a verdict or a merge. Choosing an outside loop is practice that follows from it. The pack adds no review logic. You also install the standard plugin, so that `pr-review` supplies the findings and the verdict.

This path has a cost. You must own and run an outside program that the Toolbelt does not ship and whose source the plugin README does not name. This run verified only the plan and one hand-run worker job. The loop never started, and `agent-runner` 0.1.0 does not read execution records.

The steps have this order for one reason. Each step needs a command that decides "done". The skill finds that command first, then writes phases that use it, then validates the plan with the runner's own parser.

## Steps

| Step | Do | Why | Done when |
| --- | --- | --- | --- |
| 1 | Load both plugins: `claude --plugin-dir <toolbelt-folder> --plugin-dir <toolbelt-folder>/plugins/agent-toolbelt-auto-agent`. | The auto-agent package has the skills and the command. The standard plugin has `pr-review` and the shared contracts. | You type `/` and see `/agent-toolbelt-auto-agent:auto-agent-plan`. The name comes from `plugin.json`. The headless run did not list commands. |
| 2 | In the repository root, run your test command. In the sample, run `npm test`. | The skill first finds the command that proves the repository works. Every phase needs it. If you find none, the skill stops and asks. | You know the command and its result before any change. The sample gives 7 failed, 19 passed, 1 todo. |
| 3 | Run `agent-runner init`. Open `.agent-runner.json`. | The skill says to generate the `agents` block and not to write it by hand. | The file exists, and `checks` lists your command. Init also set up the runner home folder `~/.agent-runner`. In the sample it chose `npm test`. |
| 4 | Set `"mergeOnClose": false`. Check `autoCommit` and `roles`. | With `mergeOnClose` true, the runner merges each reviewed phase pull request. The run's skill did not advise a first-run setting. The current `plan-format.md` gives this setting, so the step follows the skill. | A phase ends at an open pull request that waits for a person. |
| 5 | Write the work list. In the sample, it is `docs/roadmap.md` with two lines, written for this run. | The command reads `docs/roadmap.md`, then open issues, then TODO and FIXME density. | Each item names an outcome that a command can check. |
| 6 | Run `/agent-toolbelt-auto-agent:auto-agent-plan <roadmap-file>`. Add `--print` to read the draft first. | The command writes `docs/plan.md` and stops. It does not start the loop. | The plan has `## Phase <n>: <title>` headings, `Status: PENDING`, and acceptance criteria that a command decides. |
| 7 | Run `agent-runner plan-validate`. Then run `grep -nE '^Evidence: ' docs/plan.md`. | The runner uses the parser that will execute the plan. A heading that does not match is not a phase. | The printed phase count equals the number that you wrote. The grep prints nothing on a new plan. |
| 8 | Read the plan, delete the phases that you do not want, and commit it. | The skill tells you to read, prune, and commit. The runner opens and merges pull requests from this plan. | The plan is on your base branch, and `git status` is clean. |
| 9 | Optional, for a runner that reads task records. Write `context.json` for one job, with scope, acceptance, checks, and authority. The fields are in [the execution schema](../../shared/contracts/references/execution-schema.md). Set `context_digest` to the SHA-256 of the exact bytes of the assignment file. Make `worktree_fingerprint` cover staged, unstaged, and untracked content. The run used its own `fingerprint.sh` for this. It is not part of the Toolbelt. | The record names the paths that the worker can change and the actions that it can use. | The record has all 13 fields of the schema. |
| 10 | The worker runs the job under `auto-agent-dev-lite`, edits only the allowed paths, and writes a result file. The run named it `result.json`. The skill sets no name. For a behavior change, the skill also expects red and green evidence. | The caller owns the commit, the push, the pull request, and the merge. The worker reports. | Each required check has an outcome and an evidence path. |
| 11 | Run `python3 <toolbelt-folder>/shared/contracts/scripts/validate-execution.py context.json result.json`. Then compare `git diff --name-only` with `changed_paths`. | The checker reads files only. It cannot tell if the evidence is true. | The checker prints `"valid": true`, and the real diff matches the record. |
| 12 | Start the runner yourself: `agent-runner run`. | Starting a loop that opens and merges pull requests is your decision. The skill tells the planning agent never to run it. Version 0.1.0 of `agent-runner init` prints `autorun run` as its next step. The skill and this page use `agent-runner run`. | Phase 1 ends at an open pull request. The run did not reach this step. |

## Decision points

- If you find no command that proves the repository works, stop. Write one first. A phase without a check reaches the reviewer, fails, and blocks.
- If a phase cannot merge alone, join it with the next phase. The runner opens one pull request for each phase.
- If the printed phase count is lower than yours, look for a heading that is not `## Phase <n>:`. The runner reads `### Phase 3:` as plain text and the validation still passes.
- If the plan has an `Evidence:` line before the first run, delete it. The closer agent writes that line.
- If your runner does not read task records, skip steps 9 to 11. The run found no `contract_version` in `agent-runner` 0.1.0 source. The skill says that runner support needs a separate change.
- If a fix job leaves the commit unchanged, treat it as a disagreement. The skill says to escalate to a person and not to loop.
- If a review returns `NEEDS DISCUSSION`, do not merge unattended. `pr-review` gives this verdict when the review has an approval-blocking question or a scope gap and no blockers. The skill sends it to `BLOCKED`, a resumable state where a person fixes the problem or overrules it.
- Stop when `plan-validate` prints your phase count, and you have read and committed each phase.
- Choose [Deliver a ticket as phased pull requests](dev-deliver-a-ticket-as-phased-prs.md) when a person works in the session and approves each phase.
- Choose [Review every pull request on open](ops-review-every-pr-on-open.md) when you need reviews and no implementation loop.
- Choose [Agent-to-agent review queue](ops-agent-to-agent-review-queue.md) when agents that open pull requests need a local review worker.

## What you get

The run drafted a plan with two phases. The preamble came first and held the standing rules. These are the first lines of Phase 1.

Excerpt from a run on the Conduit sample API at commit 30b68e1. The plan was drafted by following the command procedure by hand. Long lines are wrapped, and `...` marks skipped text.

```markdown
## Phase 1: Load the Prisma mock before the auth service in its test file
Status: PENDING
...
Scope: `src/tests/services/auth.service.test.ts` only.

Acceptance Criteria:
- `npm test -- --testPathPattern=auth.service` passes with 12 tests
  passed and none failed.
- `npm test` passes with no database running.
```

The criteria use `npm test`. The skill says that the leading command of each check goes into the write role's `Bash(...)` allowlist. An allowlist names the commands that an agent can run without asking. The generated Claude profiles list `Bash(npm:*)`, so an `npx jest` criterion falls outside it. Also, a path argument to `npm test --` failed with `Cannot find project` (run notes). The flag `--testPathPattern` works.

Next, the validation of the plan. The run also added a `###` heading for a third phase in a scratch copy of the plan. The count did not change, and no error appeared.

Excerpt from a run on the Conduit sample API at commit 30b68e1. Condensed from two runs of `agent-runner plan-validate`: the second line of the scratch run is left out. The other lines are verbatim.

```text
[agent-runner] plan parsed: docs/plan.md with 2 phase(s)
[agent-runner] no planVerify commands configured; only structural validation ran
[agent-runner] plan parsed: docs/plan-bad-heading.md with 2 phase(s)
```

The first two lines come from the real plan. The third line comes from the scratch plan with three headings. It shows why you compare the count.

The worker record fixes the scope and the authority. The run wrote it for Phase 1. The worker had three actions: inspect, edit, and check. The runner kept the commit and the merge. In the record, C1 and C2 are check IDs. The IDs A1 and A2 are acceptance IDs.

Excerpt from a run on the Conduit sample API at commit 30b68e1. Condensed from the run record: the fields `goal`, `source_refs`, `workspace`, `acceptance`, and `next_action` are left out. The lines that remain are verbatim.

```json
{
  "contract_version": 1,
  "task_id": "conduit-phase-1",
  "run_id": "conduit-phase-1-attempt-1",
  "operation": "implement",
  ...
  "scope": {
    "allowed_paths": ["src/tests/services/auth.service.test.ts"],
    "excluded_paths": ["src/app/", "docs/plan.md"]
  },
  ...
  "required_checks": ["C1", "C2"],
  "authority": {
    "worker_actions": ["inspect", "edit", "check"],
    "external_action_owner": "agent-runner"
  },
  "attempt": {"number": 1, "limit": 2},
  ...
}
```

The worker moved one import line, so that the Prisma mock loads first. Check C1 (`npm test -- --testPathPattern=auth.service`) gave 12 passed. Check C2 (`npm test`) gave 26 passed and 1 todo. The checker accepted the result. It rejected four changed copies of it. The run wrote the result by hand from these outputs, not through a runner.

Excerpt from a run on the Conduit sample API at commit 30b68e1. Each line is the checker output for one result file. The four rejection lines are in a different order than in the run output. The exit code of each rejection was 1. The `...` marks skipped text.

```text
{"valid": true, "contract_version": 1, "task_id": "conduit-phase-1", "verification": "record-only", ...}
{"valid": false, "error": "changed path is outside allowed scope"}
{"valid": false, "error": "result declares an action outside worker authority"}
{"valid": false, "error": "result context digest does not match input bytes"}
{"valid": false, "error": "completed result contains a failed or unrun check"}
```

A fifth changed copy passed. It listed no changed path and cited an evidence file that does not exist. The checker validates structure, not truth. It does not read Git or open the evidence. The caller must compare the real diff and open each evidence file. The skill says the same: a check success does not replace a review verdict and gives no merge permission.

What you must check in the output:

- The phase count equals the number that you wrote.
- Each phase has a check command that starts with a command in the write allowlist.
- No `Evidence:` or status prose sits in a phase body.
- A `completed` result means that the assignment met its criteria. It does not mean approval or merge.

The run did not execute `agent-runner run`, any agent call, any review, or any merge. It did not run Phase 2. It ran no review step, so the page shows no review output.

## Common mistakes

- You write `### Phase 3:` or `## Phase Three:`. The runner skips it and the plan validates. Compare the printed count.
- You write an acceptance criterion that a person judges, such as "the code reads better". The runner cannot pass it, so the phase reaches the reviewer and exhausts its attempts.
- You give the reviewer `Bash(gh:*)`. That grants comment, approve, and merge on the pull request that it reviews. Give it read verbs such as `gh pr diff` only.
- You trust a valid result record. The checker never opens evidence. Compare `git diff --name-only` with `changed_paths` before you advance.
- You treat the bound on the plan preamble as 4000 characters. The run's skill said 4000. The current skill gives the default of `agent-runner` 0.1.0, which is 12000 for `planContextCharLimit`. Read your own `.agent-runner.json`.
- You start `agent-runner run` with `mergeOnClose` true and an unreviewed plan. The runner then merges each phase that passes review.
- You merge when HEAD moved after the review. The skill requires a clean worktree, the reviewed branch, and HEAD equal to the reviewed SHA. Otherwise re-review.

## Next

- [Gate each phase with a review](ops-gate-each-phase.md): when the loop runs inside your session and a subagent reviews each phase.
- [Review every pull request on open](ops-review-every-pr-on-open.md): when you want a review on each pull request that the runner opens.
- [Agent-to-agent review queue](ops-agent-to-agent-review-queue.md): when the agents that open pull requests need a review worker.
- [Run agents in parallel](dev-run-agents-in-parallel.md): when independent jobs share one folder.
- [Survive a context reset](dev-survive-a-context-reset.md): when a job outlives one session.
- [Use-case index](README.md): the full list of use-case pages.
