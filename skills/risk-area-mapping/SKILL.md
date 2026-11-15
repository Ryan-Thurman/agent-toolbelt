---
name: risk-area-mapping
description: Draft a repository's risk areas, the paths where a defect has high impact, from code, history, ownership, and an optional workspace map. Sweeps a folder of repos into one review file and applies only approved entries. Use before risk-based test planning or review.
---

# risk-area-mapping

If you have not read `shared/contracts/references/human-readable-output.md` in this session,
read it before you write for the user.

Toolbelt paths: a path that starts with `shared/`, `skills/`, `templates/`, or `workflows/` is relative to the Toolbelt root, `${CLAUDE_PLUGIN_ROOT}`. If that variable is not replaced, use the nearest folder above this file that contains `shared/contracts/`.

A risk area is a part of the code where a defect has high impact. The format and the discovery
order are in `shared/contracts/references/risk-areas.md`. `test-case-design` and `pr-review`
read the list. This skill drafts the list. An agent finds the paths. A person confirms each impact
line, because the impact of a defect is a business judgment.

## Modes

| Input | Mode |
| --- | --- |
| No folder | One repo. Draft the list for the current repository. |
| `--sweep <dir>` | Draft the list for each child folder of `<dir>` that is a repository. |
| `--apply <file>` | Write the approved entries from a review file into each repo. |

Options: `--atlas <path>` reads a workspace map as more evidence. `--target agents` writes the list
into `AGENTS.md`. The default target is `.pr-review.md`.

## Draft

1. Find the repositories. For a sweep, a child folder is a repository when it is a git repository,
   or when it has a README, an `AGENTS.md`, or a build file. Follow symbolic links. Skip files,
   including an earlier `risk-areas-review.md`. Skip a folder that you cannot read and record the
   reason. Record each signal that you cannot search, for example defect history without git, in
   "Signals not available".
   Do not read `.env` files, key files, or other credential files. This includes configuration files
   that hold passwords or connection strings. Report the file name and whether `.gitignore`
   excludes it under "Other findings".
2. Read the existing list of each repository with the discovery order of the contract.
3. Read `references/signals.md`. With `--atlas`, read the workspace map once, before the
   repositories. In each repository, read the `AGENTS.md`, the README, and the repo card first.
   They often name the important paths. Then search each signal.
   For a sweep of two or more repositories, read `references/sweep-fan-out.md`. It runs steps 2 to 4
   in one subagent for each repository, in parallel.
4. Turn candidates into entries with evidence. Drop the others and record the reason.
   Record a risk that applies to all code, for example "never log personal data", and a hygiene
   problem, for example a database dump in the repository, in "Other findings". They are not risk areas.
   Do not list process rules, such as a version bump or a coverage target, as findings.
5. Write the review file from `templates/risk-areas-review.md`. For one repository, write it to
   `risk-areas-review.md` at the repository root. For a sweep, write `<dir>/risk-areas-review.md`.
   Do not edit any target file in this step.
6. Stop. Give the user the path of the review file. Tell the user to confirm, edit, or delete each
   entry, and to change the status of each repository to `Approved` or `Skip`. Tell the user which
   entries have `Evidence: inferred`, because those impact lines need the most attention. Name the
   repositories with a high coverage share and the folders that were not inspected in depth.

## Apply

1. Read the review file. Use only the repositories with the status `Approved`. A repository heading
   names a child folder of the folder that holds the review file. For a review file at a repository
   root, the heading names that repository.
2. Write the entry lines and their `Paths:` lines, with the continuation lines. Do not write the
   evidence lines or any other part of the review file into the target file.
3. Before you write, read the discovery order of the contract. When a file earlier in the order than
   the target already has a `## Risk areas` section, readers use that list and ignore the new one.
   Warn the user and ask which file to write.
   Write a `## Risk areas` heading and the entries into the target file of each repository:
   - When the target file does not exist, create it with only that section.
   - When the file exists without the section, add the section at the end of the file.
   - When the section exists, show the diff that replaces it and write only after the user confirms.
4. Do not commit. Report each changed file. The team commits the list through a normal pull request.
5. Tell the user to delete the review file, or to keep it outside the repositories.

## Completion

The draft is complete when each repository in scope has entries, an existing list, or a reason
for no entries. A draft is not a complete inventory of risk. The coverage and "Not inspected in
depth" lines state what the draft did not check. Apply is complete when each approved repository has the list in its target file.
