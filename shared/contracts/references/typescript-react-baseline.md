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

Specialist routing:

- When `vercel-react-best-practices` is installed and the change is a React or
  Next.js performance concern, read that skill's exact conditional rule through
  `skills/vercel-react-best-practices/references/rule-routing.md`.
- When `vercel-composition-patterns` is installed and the change concerns a
  component API, composition, compound components, context, or boolean-prop
  proliferation, read its exact conditional rule through
  `skills/vercel-composition-patterns/references/rule-routing.md`.
- These specialists are references, not universal policy. Check framework and
  React versions, runtime boundaries, local evidence, and measured impact first.

This baseline deliberately does not choose an architecture or framework policy.
