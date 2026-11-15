# Risk-area signals and evidence

Search for each signal in the repository. Record the paths that it finds and the evidence for
each path. Search code and configuration folders first. Skip a folder that holds only documentation.

A signal is not available when its input does not exist: no git history, no `CODEOWNERS`, or no
output from the other skill. Check for tool output with one search. Do not run the other skill.
Record each signal that is not available in "Signals not available".

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
- Keep each entry to five globs or fewer. Each item in a brace list such as `{a,b}` counts as one
  glob, so do not use brace lists. When an area needs more, use a wildcard or the folder that holds
  the files. When that is too wide, keep the five strongest globs and list the other paths as
  dropped with the reason "glob limit". Split an entry only when its parts have different impacts.
- Count the files that the globs match with a command, for example `find` or `git ls-files`. Do not
  count tests, snapshots, generated files, or caches. Write the exact number.
- When one file holds many concerns, for example a notebook, use the file as the glob. Name the cells
  or functions in the evidence line.
- Merge candidates that have the same impact into one entry.
- Keep the list short. When most of a repository matches, the list does not separate risk from
  normal code. Keep the entries with the strongest impact and record the others as dropped.
- Record every candidate that you drop in the dropped table, with the reason.

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

Write each entry in the format of `shared/contracts/references/risk-areas.md`. Under it, write one
visible evidence line:

Write the impact line in one or two sentences. Put the mechanism, such as function names and keys,
in the evidence line.

```markdown
- **Patient data export** (`src/export/**`): A defect can send one patient's data to another clinic.
  - Evidence: sourced. Files matched: 14. From: models/patient.ts columns, atlas edge reports_to_export_api.
```

Use `Evidence: sourced` when a document states the consequence of a defect, for these paths or for
the whole repository. Examples are a repo card blast radius, an `AGENTS.md` rule, a hazard document,
or an incident. Quote the words in the evidence line. A map edge alone shows a consumer, not a
consequence, so it is not enough. Use `Evidence: inferred` when you inferred the consequence from the code.
Keep the evidence line to one or two lines. Apply writes only the entry line.
