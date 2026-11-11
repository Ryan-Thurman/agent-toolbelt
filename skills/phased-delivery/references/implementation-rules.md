# Implementing a phase

Read this before the first edit in a phase.

1. Reconcile the phase with the source requirement or ticket, current repository
   state, and preceding PRs. Confirm the work branch and PR target.
   Reconcile recorded completion as `shared/contracts/references/execution.md` says.
   Report stale evidence or missing work.
   For a `bug-to-fix` handoff, the fix brief is the phase source. Skip the stack rules.
2. Before edits or commits, create or switch to a focused phase branch. If you
   are on the default branch and cannot branch safely, stop. For a stack, follow
   the skill's Stacked PRs rules.
3. Fill missing *technical* context: affected files, interfaces, migrations,
   test locations and commands, operational risks, and implementation steps.
   Mark inferred details as such. Do not change acceptance criteria or release,
   document, or QA decisions without the source owner's approval.
   Keep this context lean: name the owner, interface, source constraints, and
   verification result needed for each step. Include implementation code only
   when a non-obvious algorithm or exact source requirement needs it; link to
   existing definitions instead of duplicating them across tasks.
4. Verify declared external preconditions using read-only checks. Stop if a
   prerequisite fails or cannot be checked safely; do not partially implement
   behind an unverified dependency.
5. Implement within this phase's scope. For behavior changes, follow
   `shared/contracts/references/test-driven-development.md`.
   Run focused checks during the edit loop and proportionate broader checks before PR review.
6. Inspect the diff for unrelated changes, premature next-ticket work, and
   generated noise. Run the React rule scan in
   `shared/contracts/references/typescript-react-baseline.md`. Fix each applied rule
   before PR review. Record changed files, checks, acceptance evidence, risks,
   and next action in the existing plan or execution record.

## Commits

Commit at coherent, reviewable boundaries.
A phase can have one or more commits.
A task does not need its own commit.
Write concise messages, such as `feat: add saved filter` or `test: cover duplicate names`.
Inspect the staged diff before each commit.
Push and merge authority follows `shared/contracts/references/execution.md`.

## Delegation

When delegating or crossing a context reset, hand off the selected phase's
source scope, branch/base, owned files, exact checks, and report location. Keep
the full feature history out of a narrow task prompt; the source ticket and plan
remain the durable record.
