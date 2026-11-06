# Implementing a phase

Read this when starting or carrying out a phase.

1. Reconcile the phase with the source requirement or ticket, current repository
   state, and preceding PRs. Confirm the work branch and PR target. Before edits
   or commits, create or switch to a focused phase branch if currently on the
   default branch; stop if that cannot be done safely. For a stack, branch from
   the parent ticket branch and compare only against that branch.
2. Fill missing *technical* context: affected files, interfaces, migrations,
   test locations and commands, operational risks, and implementation steps.
   Mark inferred details as such. Do not change acceptance criteria or release,
   document, or QA decisions without the source owner's approval.
   Keep this context lean: name the owner, interface, source constraints, and
   verification result needed for each step. Include implementation code only
   when a non-obvious algorithm or exact source requirement needs it; link to
   existing definitions instead of duplicating them across tasks.
3. Verify declared external preconditions using read-only checks. Stop if a
   prerequisite fails or cannot be checked safely; do not partially implement
   behind an unverified dependency.
4. Implement within this phase's scope. Add or update tests with behavior
   changes when practical. Discover project checks from repo scripts and CI;
   run focused checks during the edit loop and proportionate broader checks
   before PR review. If automation is impractical, explain the gap and name the
   manual or integration evidence needed.
5. Inspect the diff for unrelated changes, premature next-ticket work, and
   generated noise. Record changed files, checks, acceptance evidence, risks,
   and next action in the existing plan or execution record.

Commit at coherent reviewable boundaries; one commit per task is not required.
Do not push to the default branch unless the user explicitly requests it. For
optional commit guidance, read `commit-rules.md`.

When delegating or crossing a context reset, hand off the selected phase's
source scope, branch/base, owned files, exact checks, and report location. Keep
the full feature history out of a narrow task prompt; the source ticket and plan
remain the durable record.
