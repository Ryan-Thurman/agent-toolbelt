# TypeScript and React baseline

Use this contract only for TypeScript or React code when stronger repository
instructions, configuration, or repeated local conventions do not decide the issue.

- Follow the repository's adopted TypeScript guide and enforced formatter, linter,
  compiler, and import rules.
- Make boundary types explicit. Narrow `unknown` before use and avoid `any` or casts
  unless the boundary justifies them.
- Use PascalCase for components and `use`-prefixed names for custom hooks. Keep
  hooks and components responsible for a coherent user or domain concern.
- Derive values during render when practical. Do not add effects solely to mirror
  derivable state. Effects synchronize with external systems and need cleanup when
  they create subscriptions, timers, or other resources.
- Preserve local conventions for exports, folder layout, state management, CSS,
  framework server/client boundaries, data fetching, errors, and test placement.

## React rule scan

This section owns the React rule check. Skills, facets, and gates point here.

Run the scan when a change adds or edits JavaScript or TypeScript code and
`shared/contracts/scripts/react-rule-scan.py` is installed:

```bash
python3 shared/contracts/scripts/react-rule-scan.py [--base REF] [PATH ...]
```

- Omit `--base` to compare with the default branch. Pass `--base REF` only when the
  caller gives a frozen base. Pass `PATH` arguments instead to scan whole files.
- When `react_files` is empty, record the React rules check as `Skipped`.
- Read each file in `rules`. These are the specialist rules that the changed lines trigger.
- Compare the change with the `when` line of each `judgment_rules` entry. No pattern
  detects these rules. Read the `path` only when the condition matches.
- Record each rule that you read as `Applied` with the finding or change, or
  `Not applicable` with a one-line reason. A listed rule without a record is unfinished work.
  For a whole-codebase scan, see "Whole-codebase scan" below.
- A repository instruction or an adopted local convention overrides a rule that flags that
  convention. For example, an instruction says that components read the store directly.
  Then a composition rule that flags a direct store hook is `Not applicable`. Cite the instruction.
- The scan lists candidates from text signals. A record closes a rule, not a re-scan.
  After a fix, a re-scan can list the same rule on the fixed code, because the signal can still match.
  Record the rule as `Applied` with the change and the test or check that shows the result.
- Set the severity of each finding with `shared/contracts/references/react-acceptance.md`.
- When the scan names `missing` specialists, report them once. Do not block on them.
- Check framework and React versions, runtime boundaries, local evidence, and measured
  impact before you apply a rule. Repository policy wins over specialist rules.
- A scan-and-report run writes a report. Follow "Durable report location" in
  `shared/contracts/references/execution.md` for the path. Use `vercel-react-best-practices`
  as the skill name. Put one table in the report with the columns Rule, Result, Evidence or reason,
  and Severity, one row for each rule and judgment rule. List the checks that you did not run, as
  `shared/contracts/references/evidence-quality.md` requires.
- To find a rule without a scan, use the `references/rule-routing.md` table of an installed specialist.

### Whole-codebase scan

A scan of a whole tree has no diff, so hit counts are large. Treat the result as a triage list.

1. Scan the production folders and the test folders as two runs. Report findings from
   production code. Record test and mock files as a separate group and do not rank them.
2. Rank the listed rules by the impact word of each rule, highest first. Count the hits for each rule.
3. Read the rule file and a sample of the hits (up to five) for each rule, from the highest rank
   down, until you reach the limit that the user sets or the rules that have a concrete consequence run out.
   Record the sample size.
4. Record `Applied` or `Not applicable` only for a rule that you read. Record each other
   triggered rule as `Not read` with its hit count. Say in the report that the list is a sample.
5. Do not count hits as findings. Check each hit in the code first.

This baseline deliberately does not choose an architecture or framework policy.
