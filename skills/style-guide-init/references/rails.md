# Quality rails

Use this procedure for `--rails`. Rails are the checks and the one command that runs them.
This mode sets up the rails. It does not fix the findings that the rails report.
Later feature, bug, and cleanup work fixes them.

## Boundary

Rails mode can change these files:

- Formatter, linter, type checker, and other check configuration.
- Package scripts or task-runner entries that run checks.
- CI and release steps that call the quality command.
- The contribution guide and the agent instruction file that name the quality command.

Do not change application source, tests, fixtures, or snapshots.
Do not format application files, fix findings, refactor, or add tests.
Do not add suppressions, allowlists, baseline files, or exceptions to make a check pass.
Keep unrelated changes in the working tree.
If a step changes an application file, stop and revert only the changes that this mode made.

## Inspect

1. Find the languages, package boundaries, and the existing check configuration.
2. Find the current check entry points: package scripts, a `Makefile`, a task runner, or `scripts/`.
3. Read the CI workflows and the release path, and find which checks they run.
4. Read `AGENTS.md`, `CLAUDE.md`, and the contribution guide for a documented quality command.

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
If it reports findings in existing code, keep the check and its entry in the canonical command.
Do not make it a required CI step yet. A required workflow that passes now must still pass.
Add it to CI as a step that reports and does not block, or leave it out of CI.
List it as pending adoption, with its finding count.
The team makes it required after it fixes the findings.

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
