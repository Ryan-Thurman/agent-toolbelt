---
name: vercel-react-best-practices
description: Review or improve React and Next.js performance when components, data fetching, bundles, rendering, or server/client boundaries change; verify framework and React versions first.
---

# React and Next.js performance

If you have not read `shared/contracts/references/human-readable-output.md` in this session,
read it before you write for the user.

Toolbelt paths: a path that starts with `shared/`, `skills/`, `templates/`, or `workflows/` is relative to the Toolbelt root, `${CLAUDE_PLUGIN_ROOT}`. If that variable is not replaced, use the nearest folder above this file that contains `shared/contracts/`.

Use this as a conditional performance reference for React or Next.js changes.
Repository policy, measured budgets, enforced configuration, runtime
constraints, and local patterns win over upstream guidance.

Before applying a rule:

1. Inspect the installed React/Next versions, server/client boundary, and
   relevant build/runtime configuration.
2. Follow the "React rule scan" section in
   `shared/contracts/references/typescript-react-baseline.md`. Do not load the full rule set.
   To find a rule without a scan, use [`references/rule-routing.md`](references/rule-routing.md).
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
