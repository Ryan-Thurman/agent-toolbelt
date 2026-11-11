# TypeScript and React Baseline

Use this contract only for TypeScript or React code when stronger repository
instructions, configuration, or repeated local conventions do not decide the issue.

- Follow the repository's adopted TypeScript guide and enforced formatter, linter,
  compiler, and import rules.
- Make boundary types explicit; narrow `unknown` before use and avoid `any` or casts
  unless the boundary justifies them.
- Use PascalCase for components and `use`-prefixed names for custom hooks. Keep
  hooks and components responsible for a coherent user or domain concern.
- Derive values during render when practical; do not add effects solely to mirror
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
- Set the severity of each finding with `shared/contracts/references/react-acceptance.md`.
- When the scan names `missing` specialists, report them once. Do not block on them.
- Check framework and React versions, runtime boundaries, local evidence, and measured
  impact before you apply a rule. Repository policy wins over specialist rules.
- To find a rule without a scan, use the `references/rule-routing.md` table of a specialist.

This baseline deliberately does not choose an architecture or framework policy.
