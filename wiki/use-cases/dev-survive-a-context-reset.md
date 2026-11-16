# Survive a context reset in the middle of a task

This page is for a developer whose task is too long for one agent session. You get phase files, a handoff, and a context packet (a short file that gives a fresh session the goal, git state, and next action). They sit in the repository, and a fresh session continues from them, not from chat history. For a task that fits one session, use `/handoff` alone.

| Roles | Skills and commands | Depth | You need |
| --- | --- | --- | --- |
| Developer | [`phase-context-workflow`](../../skills/phase-context-workflow/SKILL.md) (`/phase-create`, `/phase-start`, `/phase-close`, `/phase-status`), [`handoff`](../../skills/handoff/SKILL.md) (`/handoff`) | No levels. Neither skill has them. | A git repository, a task with more than one part, and a folder where the agent can write `.acc/`. |

## Quick path

1. Start Claude Code in the repository: `claude --plugin-dir <toolbelt-folder>`.
2. Add `.acc/` to `.gitignore`. The agent keeps session state there.
3. Create one file for each part of the task. A room is the folder name for one task. Name the goal and the source plan: `/agent-toolbelt:phase-context-workflow create phase <n> for room <room-slug>: <title>. Goal: <goal>. Source: <plan path or ticket URL>`.
4. Before work: `/agent-toolbelt:phase-context-workflow start phase <n> of room <room-slug>`.
5. Do part of the work. Commit what is finished.
6. Before `/clear`: `/agent-toolbelt:phase-context-workflow close phase <n> of room <room-slug>`. Make sure that the handoff says `Safe to clear` is `Yes`.
7. After `/clear`, repeat step 4. Start reads `phase-<nn>-handoff.md` when it exists. The agent reads the files and names the next action.

These prompts are natural-language forms. The run itself used the skill operations by name, for example `/agent-toolbelt:phase-start pagination-validation --phase 1`, and the author session followed the skill text for the other operations. If you installed the commands with `./install.sh`, the argument forms are `/phase-create <room-slug> --phase <n> --title <title>`, `/phase-start <room-slug> --phase <n>`, `/phase-close <room-slug> --phase <n>`, and `/phase-status`.

You get a phase file for each part and a handoff that leads with the next action. You also get a packet that you can paste into a fresh session.
The sections below explain each step, when to stop, and what the output looks like.

## Situation

The sample is the RealWorld "Conduit" API in TypeScript (Express, Prisma, Jest). It is the public repository `gothinkster/node-express-realworld-example-app` on GitHub. The run starts at commit 30b68e1.

The task is the run's own choice, because the sample has no ticket. `GET /api/articles` and `GET /api/articles/feed` read `limit` and `offset` with a bare `Number(...)` conversion. The change must reject a bad value with a 422 (validation error status) on both routes. It has two parts, so the run made two phases in a room (the folder name of one task) named `pagination-validation`:

- Phase 01 adds a parser and calls it from the article list.
- Phase 02 does the same for the feed and updates the route comments.

The run paused in the middle of phase 01. The parser and its tests were committed. The call in `getArticles` was edited but not committed. No test covered that call yet.

You must end the session and keep the work resumable. A new session must not repeat the committed work, and it must not trust a test result that is older than the last edit.

### What the run simulated

- The run did not type `/clear`. It started new `claude -p` processes (Claude Code in non-interactive mode). Each process has no chat history, so each is a real fresh session. A person who types `/clear` gets the same empty context.
- "Create a phase", the first "Start a phase", "Close a phase", and "Show status" ran in the author session, by the skill procedure. Only the second "Start a phase" ran in a fresh session (session B). The run did not call the slash commands.
- No person answered a question, and the skills asked none.
- No database exists. Jest ran with the Prisma mock (a fake database client). No query and no HTTP request ran. `auth.service.test.ts` fails 7 tests before and after the change for this reason.

## Why this path

The obvious alternative is to keep the context in the chat and use `/compact`. The skill keeps `/compact` for a phase that continues while a summary of the session is still useful. In practice, a chat summary cannot be compared with git, and after `/clear` it is gone. The files in `.acc/phases/` stay on disk, and the agent compares them with the branch and the diff before it relies on them.

The `handoff` skill alone is the smaller alternative. It writes one resumable note. When `phase-context-workflow` does not own the handoff, the skill saves it in a unique file in the OS temporary directory. That path is outside the repository, and no phase file or acceptance list goes with it. In practice, use `handoff` alone for a pause in a task that has no phases. This path adds a phase file for each part and a packet, so each part has acceptance criteria to check against.

The sibling for a ticket that becomes several pull requests is [`phased-delivery`](../../skills/phased-delivery/SKILL.md). It owns the plan and one PR for each phase. Its command `/dev-start-phase` prepares a phase branch. This skill writes a packet instead, and `/phase-start` is the command for that. When both are in use, the delivery plan stays the source of truth and the packet holds only session state. The page [Deliver a ticket as phased pull requests](dev-deliver-a-ticket-as-phased-prs.md) covers that path.

The phase file gives the goal and the criteria. The packet copies them with the git state. The handoff records what the session did to them. Start reads the handoff of the same phase when it exists (a resume in the middle), and the handoff of the previous phase (see Common mistakes).

## Steps

| Step | Do | Why | Done when |
| --- | --- | --- | --- |
| 1 | Load the Toolbelt: `claude --plugin-dir /path/to/agent-toolbelt`. Or install the commands: `./install.sh --harness claude phase-context-workflow /path/to/project`. | The skills must be available. The plugin build has no slash commands, so you ask the skill for each operation. | You see `/agent-toolbelt:phase-context-workflow` in the `/` list. |
| 2 | Add `.acc/` to `.gitignore`. | The skill keeps `.acc/` as local session state and recommends this. | `git status` does not list `.acc/`. |
| 3 | Create each phase: `create phase <n> for room <room-slug>: <title>`, with a goal and a source plan or ticket. In the sample, room `pagination-validation`, phase `1`, title "Pagination parser and the article list". | A phase file fixes the goal, scope, acceptance criteria, and source before the work starts. | `.acc/phases/<room-slug>/phase-NN.md` exists and names its source. |
| 4 | Read each phase file. Fix a criterion that you cannot check. | A reset later cannot repair a vague criterion. | Each criterion names a command or an observable result. |
| 5 | Start the first phase: `start phase <n> of room <room-slug>`. | The packet holds the goal, git state, commands, and next action for a fresh session. | `context-packet.md` exists. |
| 6 | Do part of the work. Run the checks that you can run. Commit what is finished. | The handoff records which results are current. A commit marks the work that a fresh session must not redo. | Each finished item is a commit. The rest is in the working tree. |
| 7 | Before you clear, close the phase: `close phase <n> of room <room-slug>`. | The handoff records the completed work, decisions, ruled-out paths, checks, and a concrete next action. | `phase-NN-handoff.md` exists. `Safe to clear` is `Yes`, or `No` with the missing items listed. |
| 8 | Read the "Next action" line and the "Validation" results. Mark a check stale when a later edit changed its code. | A fresh session trusts these lines. | The next action names a file and a test, and each stale result says that it is stale. |
| 9 | Run `/clear` and start the fresh session in the same folder. Ask for `start phase <n> of room <room-slug>`. Start reads `phase-<nn>-handoff.md` when it exists. | The agent compares the files with the branch, the diff, and the check results, as `execution.md` requires, before it reuses them. | The new packet states which handoff claims match the tree and which do not, and names a next action. In this run the packet had a reconciliation table. That is the run's format, and the skill sets none. |
| 10 | Tell the agent to do the next action. Read its report and run the checks yourself. | The agent can claim a check that it did not run. | You see the same result in your own terminal. |
| 11 | At the end of the phase, close it again. Close sets `Status` (`done` or `paused`), `Completed`, and `Handoff` in the phase file. Check them. | In this run `Status` stayed `in progress` after the first close, and the author set `done` by hand. The run predates the rule that Close sets `done` or `paused`. `phase-status` reports a phase as complete only when a handoff or a status field says so. | `phase-status` shows the phase as `handoff written`, and the status field says `done` (or `paused` for a phase that closed early). |

## Decision points

- If the task fits in one session and no reset is likely, skip the phase files. Use `/handoff` when you stop.
- If `Safe to clear` is `No`, do not run `/clear`. Fix the listed items first.
- If you close a phase before it is complete, set `Safe to clear` to `Yes` only when the files hold all important context. Otherwise write `No` and list the missing items.
- If a check ran before your last edit, write the result as stale in the handoff. A fresh session reruns it before it relies on it.
- If the session continues and a summary of it is still useful, use `/compact`. Use `/clear` only after the handoff or the packet holds what the next session needs.
- If the same fix fails again after a reset, stop and read `shared/contracts/references/failure-recovery.md` in the Toolbelt folder. A reset does not renew the attempt limit.
- Stop when each phase has a handoff with `Safe to clear` set to `Yes`. Each criterion must also have a result that a fresh session can check.
- Choose [`phased-delivery`](../../skills/phased-delivery/SKILL.md) when each part must become its own pull request with its own review.
- Choose [`phase-gate`](../../skills/phase-gate/SKILL.md) when each phase pull request needs a fresh review subagent. See [Gate each phase](ops-gate-each-phase.md).

## What you get

The first excerpt is the middle of the handoff that the author session wrote at the pause. The unit tests of the new parser had passed. The edit to `getArticles` came after that run.

Excerpt from a run on the Conduit sample API at commit 30b68e1 plus commit b9d0eb8 and an uncommitted edit. Lines are wrapped, and `...` marks skipped text.

```markdown
## Next action

In `src/tests/services/article.service.test.ts`, add a
`describe('getArticles')` block with two tests that call `getArticles` with
`prismaMock`. Test 1: `getArticles({ limit: '-1' })` rejects with
`errorCode` 422, and `prismaMock.article.count` is not called. Test 2:
`getArticles({ limit: '20', offset: '40' })` calls
`prismaMock.article.findMany` with `skip: 40` and `take: 20`. Then run the
validation commands below.
...
- Jest: 2 suites, 17 tests passed. This ran BEFORE the `article.service.ts`
  edit, so it is stale for the article service. Run it again.
- tsc: exit 0, after the edit. Current.
- Known failure before any change: `auth.service.test.ts` fails 7 tests
  because no database exists. Ignore it.
- Not run: the query itself, because no database exists.
```

The next action names a file, two tests, and the expected values. The stale result and the baseline failure keep the next session from a wrong conclusion in either direction.

The second excerpt is from the fresh session that ran "Start a phase". It had no chat history. It compared each claim in the handoff with the branch.

Excerpt from a run on the Conduit sample API at commit 30b68e1 plus commit b9d0eb8 and an uncommitted edit. Condensed from the run report: the first four rows of the reconciliation table are left out. The text of the rows that remain is verbatim.

| Handoff claim | Observed in this session | Result |
| --- | --- | --- |
| Jest passed 17 tests | That run was before the edit | Stale. A rerun in this session was not approved, so it is `Not run` |
| `tsc` exit 0 after the edit | Not rerun in this session | Carried from the handoff |

The four omitted rows were all `Matches`. They covered the commit `b9d0eb8` content, the single uncommitted file, the call in `getArticles`, and the missing tests. The run's tool allowlist blocked Jest in that fresh session, so the session did not run it. That is a limit of the run, and the skill does not impose it.

The third excerpt is from a third fresh session. Its whole prompt was the packet, plus the instruction to do the first two steps of the next action and not to commit.

Excerpt from a run on the Conduit sample API, from the working tree before commit 696471b. Condensed from the session report: the code block of the first Jest run and the final summary are left out. The text of the paragraph is verbatim.

> The first Jest run failed on a type error, not a test failure. When ts-jest compiled the new `prismaMock.article.count` lines, it raised TS2615 ("Type of property 'AND' / 'NOT' / 'OR' circularly references itself in mapped type…") at line 17. I fixed it by adding `// @ts-ignore` above the two `count` lines. The file already does this for its other mock calls (lines 16, 61, 63). No test logic changed.

The session found the existing `@ts-ignore` pattern without chat history. The author session reran Jest after this work. 2 suites and 19 tests passed, and `tsc` exited 0. The full suite then showed 5 suites passed, and only `auth.service.test.ts` failed, with the same 7 tests as the baseline. The author session committed the work as 696471b.

What you must check in the output:

- The handoff has one concrete next action, not "continue".
- Each check result says whether it is current or stale.
- The git state names the branch and says which changes are committed.
- The packet from the fresh session compares the handoff with the working tree and marks any mismatch.
- `Safe to clear` is `Yes`, or `No` with a list.

## Common mistakes

- You trust a check that ran before the last edit. The handoff in this run kept the 17-test Jest result and marked it stale. Rerun it after the reset.
- You use `tsc` to cover test files. The command `npx tsc --noEmit -p tsconfig.app.json` does not compile tests. Only Jest caught the type error in the new test. Write what each command covers in the handoff.
- You expect `/phase-start` in the plugin install. The plugin build has no slash commands. A fresh session in this run said that `/agent-toolbelt:phase-start` is not installed, and then used the skill. Ask the skill for the operation, or install the commands with `./install.sh`.
- You start phase 1 again after a mid-phase pause. The run predates the fix that makes Start read the handoff of the same phase (`phase-NN-handoff.md`) when it exists, as well as the previous one. In this run the fresh session read `phase-01-handoff.md` anyway, although the skill text at that time did not require it. Tell the agent to read it on an older checkout.
- You read `handoff written` in the status list as "done". A phase that closed in the middle also shows `handoff written`. Check the `Status` field in the phase file. The run predates the four status values in the skill (`planned`, `in progress`, `paused`, and `done`). This run used `in progress` and `done`.
- You commit `.acc/`. The skill treats it as local session state. Track phase files only when the project chooses `docs/agent-command-center/phases/`.
- You expect the agent to commit for you. The packet in this run said that the commit decision belongs to the user.

## Next

- [Deliver a ticket as phased pull requests](dev-deliver-a-ticket-as-phased-prs.md): when each part of the task needs its own pull request.
- [Gate each phase](ops-gate-each-phase.md): when each phase pull request needs a fresh review.
- [Run agents in parallel](dev-run-agents-in-parallel.md): when two agents work on the same repository at once.
- [Run agents without a person](ops-unattended-agent-runs.md): when a runner, not a person, clears and resumes sessions.
- [Idea to release](journey-idea-to-release.md): when this task is one step of a feature that goes from idea to release.
- [Phase context workflow](../../workflows/phase-context-workflow.md): the flow as a diagram.
- [Use-case index](README.md): the full list of use-case pages.
