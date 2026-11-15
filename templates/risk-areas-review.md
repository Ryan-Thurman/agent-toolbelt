# Risk areas review

<!--
  Draft from risk-area-mapping. Do not commit this file.
  For each repository: confirm, edit, or delete each entry, then set Status to Approved or Skip.
  Check the entries with "Evidence: inferred" first. Apply writes only the entry lines, not the
  evidence lines. Then run /risk-areas --apply <this file>.
-->

- Generated: <date>
- Scope: <one repository, or the sweep folder>
- Workspace map: <path, or None>
- Summary: <repositories>, <entries> entries, <inferred> with inferred evidence

## <repository>

Status: Draft

Target file: <`.pr-review.md` or `AGENTS.md`>

Existing list: <file and entry count, or None>. Checked: <each file of the discovery order that exists without the section, or None>

Signals not available: <each signal whose input does not exist, with the reason, or None>

### Draft entries

- **<Name>** (`<glob>`): <impact of a defect>
  - Evidence: <sourced or inferred>. Files matched: <count>. From: <evidence>.

### Dropped candidates

| Path | Signal | Reason |
| --- | --- | --- |
|  |  |  |

### Other findings

<Risks that apply to all code, and hygiene problems such as dumps or connection details in the repository, or None.>

### Map and code differences

<Each place where the workspace map and the code disagree. None when they agree or when there is no map.>
