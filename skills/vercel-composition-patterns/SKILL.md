---
name: vercel-composition-patterns
description: Apply React composition patterns when designing or reviewing component APIs, compound components, context, or boolean-prop-heavy components; verify React-version-specific rules before use.
---

# React composition patterns

Use these rules for component API and architecture decisions. Repository policy,
enforced configuration, existing public contracts, and repeated local patterns
win over this upstream reference.

Before choosing a rule:

1. Read `shared/contracts/references/typescript-react-baseline.md` and inspect
   the repository's React version and neighboring components.
2. Read only the matching rule files in
   [`references/rule-routing.md`](references/rule-routing.md); do not load the
   full rule set by default.
3. Preserve behavior and public API compatibility unless the task explicitly
   changes the contract. Treat boolean-prop proliferation and render props as
   review cues, not automatic violations: local API stability or a small,
   unambiguous component can justify them.
4. Apply `react19-*` rules only when the repository's installed React version
   and the changed runtime support React 19.

Use composition to make variants explicit, keep state ownership clear, and
avoid prop combinations that create invalid or hard-to-reason-about states.
Record the local evidence and consequence for architecture findings.

The copied rules and license/source record are in
[`references/rules/`](references/rules/) and
[`references/upstream-attribution.md`](references/upstream-attribution.md).
