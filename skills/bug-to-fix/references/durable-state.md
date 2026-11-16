# Durable investigation state

The keystone of this skill: one file per investigation that **survives a context reset**. The
template is `templates/bug-investigation.md`. The discipline is what makes every command in the
pack independently resumable and hand-off-able.

## The one rule

**Update the file BEFORE taking an action, not after.** If the session resets mid-action, the file
must already show what was about to happen. After-the-fact note-taking loses exactly the state you
need to resume.

## Where it lives

`bug-investigation-<slug>.md` next to the work (or under a `bug/` folder if the repo has one).
Resolved investigations can move to a `resolved/` subfolder. Pick a `<slug>` from the bug:
`login-500-on-empty-email`, not `bug1`.

## Section update rules

| Section | Rule | Why |
|---|---|---|
| **Symptoms** | IMMUTABLE after intake | the bug does not change. Only our understanding does. Freezing it stops scope drift and "fixing a different bug." |
| **Reproduction** | OVERWRITE until confirmed | `/reproduce` records the steps and status. Keep it fixed after the gate passes. |
| **Current focus** | OVERWRITE before every action | always reflects the single thing in flight, and `next_action` is the resume point. |
| **Eliminated** | APPEND only | a disproven hypothesis must never be re-investigated. |
| **Evidence** | APPEND only | the audit trail of what was observed. |
| **Reasoning checkpoint** | GATE | fill all 5 fields with concrete answers before any fix. If you cannot, you do not have a root cause. |
| **Resolution** | OVERWRITE | firms up as the cause/fix/verification become clear. |

`next_action` must be concrete and executable: *"Add logging at line 47 of auth.js before
`jwt.verify()` to observe whether the token is present and its non-sensitive shape"*. Never
*"continue investigating."*

## Status field

`gathering → investigating → fixing → verifying → awaiting_human_verify → resolved`. Any later
state loops back to `investigating` when verification fails. `awaiting_human_verify` is the normal
state while QA re-tests a fix manually (see `reproduction.md` and `fix-contract.md`).

Use `resolved-unverified` when the regression test was observed red before the fix and green after it, but
an end-to-end check cannot run in this environment. Record that check as `Not verified`, with the command
that runs it and the reason it cannot run here. Do not use `resolved` for this case.

## Resume protocol (after a reset or handoff)

1. Read the frontmatter -> know the `status`.
2. Read **Current focus** -> know exactly what was happening and the `next_action`.
3. Read **Eliminated** -> know what NOT to retry.
4. Read **Evidence** -> know what has already been learned.
5. Continue from `next_action`.

## Cross-session knowledge base (optional, high-value)

An append-only `bug-knowledge-base.md` records resolved investigations so future sessions can jump
to high-probability hypotheses when symptoms match. Its location is the path that the user names.
Otherwise it is `.atb-work/bug-to-fix/bug-knowledge-base.md`, which stays on this machine and out of git.
Name a tracked path when the team must share it. One entry per resolved bug:

```
## <slug> — <short description>
- Date:
- Error patterns (keywords):
- Root cause:
- Fix:
- Files changed:
```

Read it at intake (`/bug-intake`) and at the start of `/rca`. A match (keyword overlap ≥ 2 tokens)
is a **hypothesis candidate, not a confirmed diagnosis**. Still run the loop, but start warmer.
Write an entry in the close-out step, when the investigation resolves.

## Long investigations / context budget

For a long run, keep the orchestrating context lean: hold only this file + project metadata, and
pass file *paths* (never inlined file contents) to any sub-agent you spawn. The investigation
state lives in the file, not in the agent, so a fresh agent can always pick it up.
