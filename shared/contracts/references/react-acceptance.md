# React Acceptance

Use this contract to set the severity of React and Next.js findings.
The React rule scan in `typescript-react-baseline.md` finds the rules.
This contract decides if a change can merge.

## Precedence

1. Base-branch `.pr-review.md` overrides this contract. Use its existing sections:
   `Severity overrides` and `Do not flag` take rule file names, such as
   `rerender-no-inline-components: blocker`. `Budgets` holds performance budgets.
2. Repository lint and build checks decide pass or fail for what they enforce.
3. This contract sets the default for all other findings.

## Tooling

Tools enforce some rules on every change. Agents enforce the remainder.
Record each missing tool once as a `Tooling gap` suggestion. A gap does not block a merge.

| Need | ESLint | Biome | Oxlint |
| --- | --- | --- | --- |
| Rules of Hooks | `react-hooks/rules-of-hooks` | `useHookAtTopLevel` | `react/rules-of-hooks` |
| Effect dependencies | `react-hooks/exhaustive-deps` | `useExhaustiveDependencies` | `react/exhaustive-deps` |
| React Compiler validation | `eslint-plugin-react-hooks` 7+ compiler rules | No full equivalent | React Compiler rules (experimental, off by default) |
| Bundle budget | `size-limit`, `bundlewatch`, or a build-output check | Same | Same |

- Use the linter that the repository has. Do not add a second linter to get one rule.
- When the repository uses the React Compiler, it needs React Compiler validation.
  A Biome-only repository can run Oxlint for these rules only. Suggest this; do not require it.
- When a budget check exists, its result is the bundle verdict. Do not estimate bundle size by hand.

## Blocker

Use `blocker` only for these defaults. Each needs evidence in the changed code.

| Finding | Rules |
| --- | --- |
| A Server Action does not check authentication and authorization inside the action. | `server-auth-actions` |
| Server code keeps request or user data in module state, so one request can see another request's data. | `server-no-shared-module-state` |
| A server request path awaits independent operations in sequence. | `async-api-routes`, `async-parallel`, `server-parallel-fetching`, `server-parallel-nested-fetching` |
| An effect sends a mutation or POST because state changed. Strict Mode or a re-render can send it again. | `use-effect-killer` #6 |
| An effect fetches data and sets state without cleanup, so an old response can replace a new one. | `use-effect-killer` #13 |
| A hook call breaks the Rules of Hooks. | Linter rule, or the hook-order rule in the diff |
| React Native renders a string outside `<Text>`, or a falsy `&&` value can render `0` or `""`. The app crashes. | `rendering-text-in-text-component`, `rendering-no-falsy-and` (React Native) |
| A configured bundle budget fails. | Budget check |

## Should-fix

- Other `CRITICAL` and `HIGH` impact rules, when the changed code shows a concrete consequence.
- `rerender-no-inline-components`: a component defined in render remounts and loses state.
- `use-effect-killer` #1, #3, #4, #5, #7, #8, #9, #10, #11, and #12.
- React Native `list-performance-*` rules on a list that can grow without a limit.
- A view transition without the reduced-motion CSS, or one that breaks navigation or focus.
- Composition rules, when the change adds the pattern to a shared or public component API.
  In a local component, report at most a `nit`.

## Needs evidence

- `MEDIUM-HIGH` and lower impact rules: `client-*`, `rerender-*`, web `rendering-*`, `js-*`, and `advanced-*`.
- React Native rules that recommend a different library, such as `ui-expo-image`, `ui-image-gallery`,
  or `navigation-native-navigators`. Report a `nit` unless the change adds new code on the old library.
- `use-effect-killer` #2 and manual memoization changes.
- Report these as `should-fix` only with a measurement, a profiler trace, or a hot path that you can show.
  A hot path is a render loop, a long list, an animation frame, or a high-frequency event.
- Without evidence, report a `nit`. Do not report `js-*` rules without evidence.

## Web interface guidelines

- **Should-fix:** Accessibility, Focus States, and Forms rules, and the listed anti-patterns that block
  keyboard, screen reader, zoom, or paste use. Examples: a clickable `<div>`, a control without a label,
  `outline-none` without a replacement, or disabled zoom.
- **Nit:** Typography, Content & Copy, Hover, Dark Mode, and Touch rules.
- **Needs evidence:** the Performance section, as for other performance rules.
- The repository's design system and copy style win. For example, its heading case wins
  over the Title Case rule.

## Record

Record each listed rule as `Applied` with its severity, or `Not applicable` with a reason.
State the evidence for each `blocker` and each evidence-based `should-fix`.
