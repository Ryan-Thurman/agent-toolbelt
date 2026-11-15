# Risk-area signals and evidence

Search for each signal in the repository. Record the paths that it finds and the evidence for
each path. Search code and configuration folders first. Skip a folder that holds only documentation.

A signal is not available when its input does not exist: no git history, no `CODEOWNERS`, or no
output from the other skill. Check for tool output with one search. Do not run the other skill.
Record each signal that is not available in "Signals not available".
Record each signal that you searched and that found nothing in "Signals with no candidates".

| Signal | What to search |
| --- | --- |
| Personal or health data | Schema columns, migrations, models, and DTOs with names for identity, contact, birth date, diagnosis, readings, or treatment. Data classification tags or comments. |
| Access control | Auth middleware, role and permission checks, tenant or organization scoping, admin routes, and infrastructure role assignments. |
| Data rights | Code that deletes, anonymizes, retains, or exports personal data, for example privacy requests. |
| Data export and documents | Bulk download endpoints, report and PDF generation, and file shares to other systems. |
| Data pipelines | Ingestion, transformation, and schema changes whose output other systems read. |
| Values that users act on | Calculations, units, conversions, and thresholds that a person uses to make a decision. |
| Ownership | `CODEOWNERS` entries for a security, privacy, data, or platform team. |
| Defect history | Paths that revert, hotfix, and incident commits touch often (`git log --name-only`). |
| Hotspots | High churn with high complexity, from `crap-analysis` or `tech-debt-discovery` output when it exists. |
| Prior reviews | Assets and trust boundaries in `threat-model` output. Critical dependencies in `reliability-review` output. A hazard or risk-control document when the project has one. |

## From candidate to entry

A signal finds a candidate path. A candidate becomes an entry only when you can write its impact
line from evidence. Drop a candidate when the only evidence is its folder name.

- Make the globs as narrow as the evidence. Use `src/patients/export/**`, not `src/**`.
- Use as many globs as the evidence needs. A file that the evidence names must match a glob, because
  a change to an unmatched file gets no extra test or review effort. Use a folder glob when the
  folder holds only files of the area. Do not use a wildcard that also matches unrelated files.
  Do not use brace lists such as `{a,b}`. Split an entry only when its parts have different impacts.
- Count the files that the globs match with one command, for example `find` or `git ls-files`.
  Do not count tests, test data, mocks, snapshots, generated files, or caches. Write the number.
- When one file holds many concerns, for example a notebook, use the file as the glob. Name the cells
  or functions in the evidence line. When a cell or function belongs to a different entry than
  the rest of its file, list the file in both entries.
- Merge candidates that have the same impact into one entry.
- Write an entry for each candidate that has evidence. Do not drop a candidate to make the list
  shorter. The person who reviews the file removes or merges entries.
- Drop a candidate only when it has no evidence for an impact. Record each dropped candidate in the
  dropped table, with the reason.

## Coverage

Report two facts for each repository, so that the review file does not look more complete than it is:

- **Coverage:** count the source files of the repository: the tracked code and configuration files
  (`git ls-files`) in every folder. Exclude tests and test fixtures, Markdown and other documentation,
  images and other binary assets, lockfiles, editor configuration, and vendored or built output.
  Write the exclusions that you used in the review file. Count a file that two entries match once.
  Report how many source files the entries match, and the percentage.
  The skill sets no threshold. If the reviewer cannot name normal code that the list leaves out,
  the list does not separate risk from normal code. The reviewer then merges or removes entries.
- **Not inspected in depth:** list each code folder that you skipped or only scanned by name.
  Write `None` only when you searched every code folder.

## Workspace map

A workspace map describes several repos together: what each repo owns, its blast radius, and
which repo consumes which contract. When `--atlas` names a folder, start at its README or index.
Then read the system map, the repo card of each repository in scope, and the integration edge list.
Common parts:

- **System map and repo cards:** use the blast-radius text of a repo as evidence for its impact lines.
- **Integration edges** (a producer, a consumer, and a contract path): a path that holds a contract
  with consumers in other repos is a candidate. Name the consuming repos in its impact line.
- **Requirement or design routing:** use it to find the repo that implements a regulated or
  safety-related requirement.

The map can be out of date. When the map and the code disagree, use the code and record the
difference in the review file.

## Entry format

Write each entry in the format of `shared/contracts/references/risk-areas.md`, with its `Paths:`
line. Write the impact line in one or two sentences. Under the paths, write one visible evidence
line. Put the mechanism, such as function names and keys, in the evidence line.

```markdown
- **Patient data export**: A defect can send one patient's data to another clinic.
  - Paths: `src/export/**`
  - Evidence: sourced. Files matched: 14. Repo card blast radius: "an export error exposes patient records to the wrong clinic". From: models/patient.ts columns, atlas edge reports_to_export_api.
```

Use `Evidence: sourced` when a document states the consequence of a defect, for these paths or for
the whole repository. Examples are a repo card blast radius, an `AGENTS.md` rule, a hazard document,
or an incident. Quote the words in the evidence line. A map edge alone shows a consumer, not a
consequence, so it is not enough. Use `Evidence: inferred` when you inferred the consequence from the code.
When one part of the impact line is quoted and another part is inferred, use `inferred` and quote
the sourced part in the evidence line.
Keep the evidence line to one or two lines. Apply writes the entry line and its `Paths:` line,
not the evidence line.
