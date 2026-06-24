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
| **Symptoms** | IMMUTABLE after intake | the bug doesn't change; only our understanding does. Freezing it stops scope drift and "fixing a different bug." |
| **Current Focus** | OVERWRITE before every action | always reflects the single thing in flight; `next_action` is the resume point. |
| **Eliminated** | APPEND only | a disproven hypothesis must never be re-investigated. |
| **Evidence** | APPEND only | the audit trail of what was observed. |
| **Reasoning checkpoint** | GATE | fill all 5 fields with concrete answers before any fix; if you can't, you don't have a root cause. |
| **Resolution** | OVERWRITE | firms up as the cause/fix/verification become clear. |

`next_action` must be concrete and executable: *"Add logging at line 47 of auth.js before
`jwt.verify()` to observe the token value"* — never *"continue investigating."*

## Status field

`gathering → investigating → fixing → verifying → awaiting_human_verify → resolved`. Any later
state loops back to `investigating` when verification fails. `awaiting_human_verify` is the normal
state while QA re-tests a fix manually (see the QA path in `/reproduce` and `/fix-plan`).

## Resume protocol (after a reset or handoff)

1. Read the frontmatter → know the `status`.
2. Read **Current Focus** → know exactly what was happening and the `next_action`.
3. Read **Eliminated** → know what NOT to retry.
4. Read **Evidence** → know what's already been learned.
5. Continue from `next_action`.

## Cross-session knowledge base (optional, high-value)

An append-only `bug-knowledge-base.md` records resolved investigations so future sessions can jump
to high-probability hypotheses when symptoms match. One entry per resolved bug:

```
## <slug> — <short description>
- Date:
- Error patterns (keywords):
- Root cause:
- Fix:
- Files changed:
```

Read it at intake (`/bug-intake`) and at the start of `/rca`. A match (keyword overlap ≥ 2 tokens)
is a **hypothesis candidate, not a confirmed diagnosis** — still run the loop, just start warmer.
Write an entry when an investigation resolves.

## Long investigations / context budget

For a long run, keep the orchestrating context lean: hold only this file + project metadata, and
pass file *paths* (never inlined file contents) to any sub-agent you spawn. The investigation
state lives in the file, not in the agent — so a fresh agent can always pick it up.
