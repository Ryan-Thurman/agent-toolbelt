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

Run the scan when a change adds or edits JavaScript or TypeScript code:

```bash
python3 shared/contracts/scripts/react-rule-scan.py --base <base>
```

- Use the frozen base when the caller has one. Pass paths instead of `--base` to scan whole files.
- The scan lists each installed specialist rule that the changed lines trigger:
  `vercel-react-best-practices` for performance, `vercel-composition-patterns`
  for component APIs, `use-effect-killer` for effects, `vercel-react-native-skills`
  for React Native, `vercel-react-view-transitions` for view transitions, and
  `vercel-web-interface-guidelines` for UI accessibility and interaction.
- Read every listed rule file. Record each one as `Applied` with the finding or change,
  or `Not applicable` with a one-line reason. A listed rule without a record is unfinished work.
- Set the severity of each finding with `shared/contracts/references/react-acceptance.md`.
- Then read each installed specialist's `references/rule-routing.md`.
  Check the rules that the scan cannot detect against the change.
- When `react_files` is empty, record the React rules check as `Skipped`.
- When the scan names `missing` specialists, report them once. Do not block on them.
- Check framework and React versions, runtime boundaries, local evidence, and measured
  impact before you apply a rule. Repository policy wins over specialist rules.

This baseline deliberately does not choose an architecture or framework policy.
