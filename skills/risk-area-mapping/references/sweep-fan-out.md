# Sweep fan-out

Use this procedure for a sweep of two or more repositories when the host supports subagents.
Without subagents, do the steps for each repository in sequence. The output is the same.

## Roles

The main agent finds the repositories, reads the workspace map once, starts one subagent for
each repository, checks the returned sections, and writes the review file.
Each subagent drafts the section of one repository. A subagent writes no files.

## 1. Prepare

1. Find the repositories with step 1 of the skill.
2. With `--atlas`, read the workspace map once. For each repository, write a map digest:
   - the blast-radius text from its repo card,
   - each integration edge where it is the producer or the consumer, with the contract path,
   - each requirement or design routing entry that names it.
   Write `None` for a part that the map does not have.

## 2. Start the subagents

Start one subagent for each repository, in parallel. Start at most eight at a time. When one
finishes, start the next. Give each subagent read-only tools and this brief:

```text
Draft the risk-area section of one repository for a review file.
Repository: <absolute path>
Target file: <.pr-review.md or AGENTS.md>
Map digest: <digest, or None>. The digest is your only map evidence. Do not search for map files.
Read these files and follow them:
- <Toolbelt root>/shared/contracts/references/risk-areas.md (format and discovery order)
- <Toolbelt root>/skills/risk-area-mapping/references/signals.md (signals and entry format)
- <Toolbelt root>/templates/risk-areas-review.md (copy the "## <repository>" section only)
Steps: read the existing list, then AGENTS.md, the README, and the map digest. Then search each signal.
Rules: write no files. Do not read .env, key, or credential files, or configuration files that hold
passwords or connection strings. Follow symbolic links.
Return only the filled "## <repository>" section as Markdown.
```

Do not add your own view of the risks to the brief. The subagent must form its view from the evidence.

## 3. Check each section

When a section returns, check it. The section must have:

- a status, a target file, an existing list, the signals that were not available, the coverage, and
  the folders not inspected in depth,
- for each entry, globs, an impact line, and an evidence line with `sourced` or `inferred` and a file count,
- a reason for each dropped candidate.

When a part is missing, send the subagent one follow-up message that names the missing part.
When the second answer still has the gap, keep the section and write the gap under "Other findings".

## 4. Join the sections

1. Write the header of the review file, then the sections in the order of the repository names.
2. Compare the sections with the integration edges. When a producer repository has an entry for a
   contract, the consumer repositories must be named in its impact line. Add the missing names.
3. Add a line under the header with the count of repositories, entries, and inferred entries.
   Name each repository that has folders not inspected in depth.
