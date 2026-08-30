---
name: vercel-react-best-practices
description: Review or improve React and Next.js performance when components, data fetching, bundles, rendering, or server/client boundaries change; verify framework and React versions first.
---

# React and Next.js performance

Use this as a conditional performance reference for React or Next.js changes.
Repository policy, measured budgets, enforced configuration, runtime
constraints, and local patterns win over upstream guidance.

Before applying a rule:

1. Read `shared/contracts/references/typescript-react-baseline.md` and inspect
   the installed React/Next versions, server/client boundary, and relevant
   build/runtime configuration.
2. Read only the matching rule files in
   [`references/rule-routing.md`](references/rule-routing.md). Do not load all
   70 rules for an unrelated change.
3. Require a concrete consequence tied to the changed code for performance
   findings. Low-impact JavaScript micro-optimizations are valid only with
   hot-path, scale, or measurement evidence.
4. Apply Next.js/server rules only to a Next.js/server path, client rules only
   to client-capable code, and any React-version-specific rule only when the
   installed version supports it. Never assume React 19 or Next.js from syntax
   alone.

Prefer behavior-preserving changes with a measurable or clearly bounded
benefit. Preserve loading, error, cache, ordering, accessibility, and data
consistency semantics. When a rule conflicts with repository conventions,
record the conflict and follow the repository authority.

The copied rules and license/source record are in
[`references/rules/`](references/rules/) and
[`references/upstream-attribution.md`](references/upstream-attribution.md).
