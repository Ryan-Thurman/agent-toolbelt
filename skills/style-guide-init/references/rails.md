# Quality rails

Use this procedure for `--rails`. Rails are the checks and the one command that runs them.
This mode sets up the rails. It does not fix the findings that the rails report.
Later feature, bug, and cleanup work fixes them.

Run the sections in this order: Inspect, Set up the command, Checks that find existing problems,
Failing checks on day one, Document, Verify, and Report. The Derive steps in `SKILL.md` do not run in this mode.

## Boundary

Rails mode can change these files:

- Formatter, linter, type checker, and other check configuration.
- Package scripts or task-runner entries that run checks.
- CI and release steps that call the quality command.
- The contribution guide and the agent instruction file that name the quality command.

Do not change application source, tests, fixtures, or snapshots.
Do not format application files, fix findings, refactor, or add tests.
Do not add suppressions, allowlists, baseline files, or exceptions to make a check pass.
An ignore entry for build output, caches, or generated files is not a suppression. Add it when the tool scans those paths.
An ignore entry for a source file is a suppression, and this mode does not add it.
Keep unrelated changes in the working tree.
If a step changes an application file, stop and revert only the changes that this mode made.

## Inspect

1. Find the languages, package boundaries, and the existing check configuration.
2. Find the current check entry points: package scripts, a `Makefile`, a task runner, or `scripts/`.
3. Read the CI workflows and the release path, and find which checks they run.
4. Read `AGENTS.md`, `CLAUDE.md`, and the contribution guide for a documented quality command.

When the repository has no CI workflow, no release path, no contribution guide, or no agent file,
skip the step that connects that file to the command. Name the missing file in the report.
Do not create it in this mode.

Use this inspection to choose the smallest setup with the tools that the repository already has.
Do not audit code quality and do not list existing debt.

## Set up the command

1. Choose one canonical quality command. Reuse an existing entry point when one runs most checks.
   Otherwise add one in the runner that the stack already uses, such as an npm script, a `make` target, or `scripts/check.sh`.
2. Put the fast checks first: format check, lint, and type check. Put tests and builds after them.
3. Make the command non-interactive, and make it exit with a failure code when a check fails.
4. Keep one implementation of each check. Local use, CI, and release call the same command.
5. Add a check only when its signal is stable and has little noise.
   Formatters, linters, type checkers, generated-file checks, and dependency-boundary checks usually qualify.
   Keep design judgment, such as file cohesion, in the guide and in code review.
6. Keep existing correctness, security, release, and operating checks in place.
7. Do not add a new task runner, a new package, or a quality framework when the existing tools can run the check.
8. For a React repository, take candidate checks from the Tooling table in
   `shared/contracts/references/react-acceptance.md`.

## Checks that find existing problems

Run each new check once on the current code.
If it reports findings in existing code, list it as pending adoption, with its finding count.
The canonical command runs it only in a report-only mode, when the tool has one.
Otherwise leave it out of the command until the team fixes the findings.
The one-command rule in step 4 of "Set up the command" still holds, because the report-only run uses the same command.
A required CI step never runs a check that has findings. A required workflow that passes now must still pass.
The team makes the check required after it fixes the findings.

## Failing checks on day one

Run the canonical command once on the current code. Sort each failure into one of two kinds:

- A finding is a defect that a check reports in existing code. Handle it under "Checks that find existing problems".
- An environment failure is a missing tool, database, service, secret, or network. It is not a finding, and it is not a pass.

For an environment failure, document the prerequisite in the contribution guide and name it in the report.
If you cannot set up the prerequisite in this mode, report the check as not run.

## Document

Name the canonical quality command once in the contribution guide, in its verification section.
In `AGENTS.md`, or in `CLAUDE.md` when it is the only instruction file, add one line.
The line tells agents to run the command before they deliver a change, and links to the guide.
Do not copy the check list into both files.

## Verify

1. Make sure that the new configuration, scripts, and workflow references are valid.
2. Run the canonical command and report the result of each check. Do not change a finding.
3. Read the final diff. It must contain only configuration, scripts, CI wiring, and documentation.
4. Run rails mode again. It must make no more changes.

## Report

List the checks added, the canonical command, the CI and release steps that call it,
and each check that is pending adoption with its finding count.
