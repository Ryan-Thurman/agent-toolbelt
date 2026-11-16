---
name: ticket-discovery
description: Investigate a narrow implementation ticket that references an existing precedent. Compare source and target areas, and produce a gap analysis, test plan, and handoff without editing code. Use tech-backlog-assessment when the work itself is in question.
---

# ticket-discovery

If you have not read `shared/contracts/references/human-readable-output.md` in this session,
read it before you write for the user.

Toolbelt paths: a path that starts with `shared/`, `skills/`, `templates/`, or `workflows/` is relative to the Toolbelt root, `${CLAUDE_PLUGIN_ROOT}`. If that variable is not replaced, use the nearest folder above this file that contains `shared/contracts/`.

Use this skill when a ticket is probably valid but under-specified, especially
when it says another area already has the pattern to follow.
Report only. Edit files only after the user reviews the brief and asks to continue.

## Steps

1. Parse the ticket into target, precedent, requested change, and success signal.
2. Find the precedent first. Read its setup, fixtures, commands, CI hooks, and scenarios.
   If you cannot find it, report that result and recommend `tech-backlog-assessment` or a spike.
   Do not invent the pattern.
   Search the precedent for known defects, such as failing tests, open issues, and TODO markers that name a defect.
   Record each defect in the risks, and do not copy it into the target.
3. Inspect the target area and record what already exists.
   If a throwaway probe is needed, run it outside the tracked files. Record its command, its result,
   and the status `Probe run, not kept` in the brief.
4. Compare source and target directly in a gap table.
   Use one row for each feature or behavior that the ticket changes.
   Add rows for setup, fixtures, auth, environment, commands, CI hooks, test data, naming, and failure modes
   only when the ticket adds tests or changes that setup.
5. Recommend the smallest adaptation strategy.
6. List the specific test coverage or implementation slices to add.
   Use exact file paths, commands, and test seams from the repo.
7. Give verification commands and unresolved questions.
8. Name the next skill: `phased-delivery`, `cover` (author mode or gap-scan mode), or `retrofit`.
   On hosts with commands, also name the command: `/implementation-plan`, `/cover`, `/cover-gaps`, or `/retrofit`.
   If the ticket becomes a "should we do this?" decision, hand off to `tech-backlog-assessment`.

## Output

Use `templates/ticket-discovery-brief.md` when creating a durable artifact.
When the user names no path, write the brief to `.atb-work/ticket-discovery/<scope-slug>.md` and print the path.
Read `shared/contracts/references/execution.md#Durable report location`.
Replace all placeholders before you present it.

Completion criterion: every referenced precedent is backed by an exact path,
command, or explicit "not found" result. Do not hand off implementation until
the source pattern and target gap can be traced to repo evidence.
