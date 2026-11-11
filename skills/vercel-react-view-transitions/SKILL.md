---
name: vercel-react-view-transitions
description: Add or review React View Transition animations (`<ViewTransition>`, `addTransitionType`, view transition CSS) for route changes, shared elements, list reorder, enter and exit, and Suspense reveals, including Next.js. Verify React 19.3 or Next.js App Router first.
---

# React View Transitions

If you have not read `shared/contracts/references/human-readable-output.md` in this session,
read it before you write for the user.

Toolbelt paths: a path that starts with `shared/`, `skills/`, `templates/`, or `workflows/` is relative to the Toolbelt root, `${CLAUDE_PLUGIN_ROOT}`. If that variable is not replaced, use the nearest folder above this file that contains `shared/contracts/`.

Below the line is the Vercel Labs guide. Long sections moved to
[references/types-and-composition.md](references/types-and-composition.md).
Source and license: [references/upstream-attribution.md](references/upstream-attribution.md).
Repository policy, its design system, and its motion rules win over this guide.

- To review a change, or when the React rule scan lists this skill, use
  [references/review-checklist.md](references/review-checklist.md).
  Set finding severity with `shared/contracts/references/react-acceptance.md`.
- "Implement all applicable patterns" applies only when the user asks you to add
  view transitions to an app. For a scoped task, add only the requested transition.

---

Animate between UI states using the browser's native `document.startViewTransition`. Declare *what* with `<ViewTransition>`, trigger *when* with `startTransition` / `useDeferredValue` / `Suspense`, control *how* with CSS classes. Unsupported browsers skip animations gracefully.

## When to Animate

Every `<ViewTransition>` should communicate a spatial relationship or continuity. If you can't articulate what it communicates, don't add it.

Implement **all** applicable patterns from this list, in this order:

| Priority | Pattern | What it communicates |
|----------|---------|---------------------|
| 1 | **Shared element** (`name`) | "Same thing — going deeper" |
| 2 | **Suspense reveal** | "Data loaded" |
| 3 | **List identity** (per-item `key`) | "Same items, new arrangement" |
| 4 | **State change** (`enter`/`exit`) | "Something appeared/disappeared" |
| 5 | **Route change** (page-level) | "Going to a new place" |

This is an implementation order, not a "pick one" list. Implement every pattern that fits the app. Only skip a pattern if the app has no use case for it.

### Choosing Animation Style

| Context | Animation | Why |
|---------|-----------|-----|
| Hierarchical navigation (list → detail) | Type-keyed `nav-forward` / `nav-back` | Communicates spatial depth |
| Lateral navigation (tab-to-tab) | Bare `<ViewTransition>` (fade) or `default="none"` | No depth to communicate |
| Suspense reveal | `enter`/`exit` string props | Content arriving |
| Revalidation / background refresh | `default="none"` | Silent — no animation needed |

Reserve directional slides for hierarchical navigation (list → detail) and ordered sequences (prev/next photo, carousel, paginated results). For ordered sequences, the direction communicates position: "next" slides from right, "previous" from left. Lateral/unordered navigation (tab-to-tab) should not use directional slides — it falsely implies spatial depth.

---

## Availability

- **Next.js:** Do **not** install `react@canary` — the App Router already bundles React canary internally. `ViewTransition` works out of the box. `npm ls react` may show a stable-looking version; this is expected.
- **Without Next.js:** Use stable `react` and `react-dom` 19.3 or newer (`ViewTransition` and `addTransitionType` became stable in React 19.3). Earlier stable React versions do not include these APIs.
- Browser support: Chromium 125+ (React needs the v2 object form of `startViewTransition`), Firefox 144+, Safari 18.2+. Graceful degradation on unsupported browsers.

---

## Implementation Workflow

When adding view transitions to an existing app, **follow [references/implementation.md](references/implementation.md) step by step.** Start with the audit — do not skip it. Use [references/css-recipes.md](references/css-recipes.md) for the applicable CSS and adapt it to the app.

---

## Core Concepts

### The `<ViewTransition>` Component

```jsx
import { ViewTransition } from 'react';

<ViewTransition>
  <Component />
</ViewTransition>
```

React auto-assigns a unique `view-transition-name` and calls `document.startViewTransition` behind the scenes. Never call `startViewTransition` yourself.

### Animation Triggers

| Trigger | When it fires |
|---------|--------------|
| **enter** | `<ViewTransition>` first inserted during a Transition |
| **exit** | `<ViewTransition>` first removed during a Transition |
| **update** | DOM mutations inside a `<ViewTransition>`, or the boundary itself changing size/position due to an immediate sibling. With nested VTs, mutation applies to the innermost one |
| **share** | Named VT unmounts and another with same `name` mounts in the same Transition |

Only `startTransition`, `useDeferredValue`, or `Suspense` activate VTs. Regular `setState` does not animate.

### Critical Placement Rule

`<ViewTransition>` only activates enter/exit if it appears **before any DOM nodes**:

```jsx
// Works
<ViewTransition enter="auto" exit="auto">
  <div>Content</div>
</ViewTransition>

// Broken — div wraps the VT, suppressing enter/exit
<div>
  <ViewTransition enter="auto" exit="auto">
    <div>Content</div>
  </ViewTransition>
</div>
```

---

## Styling with View Transition Classes

### Props

Values: `"auto"` (browser cross-fade), `"none"` (disabled), `"class-name"` (custom CSS), or `{ [type]: value }` for type-specific animations.

```jsx
<ViewTransition default="none" enter="slide-in" exit="slide-out" share="morph" />
```

If `default` is `"none"`, all triggers are off unless explicitly listed.

### CSS Pseudo-Elements

- `::view-transition-old(.class)` — outgoing snapshot
- `::view-transition-new(.class)` — incoming snapshot
- `::view-transition-group(.class)` — container
- `::view-transition-image-pair(.class)` — old + new pair

See [references/css-recipes.md](references/css-recipes.md) for ready-to-use animation recipes.

---

## Transition types, shared elements, and composition

Read [references/types-and-composition.md](references/types-and-composition.md) when you use `addTransitionType`, a shared element (`name` or `share`), more than one `<ViewTransition>` in the same update, list reorder, `key` re-enter, or a Suspense reveal. It covers type maps, `router.back()`, shared element readiness and pairing, the common patterns, and how `default="none"` changes `update` and `share`.

---

## Next.js Integration

For Next.js integration (`transitionTypes` on `next/link` and `useRouter`, App Router patterns, Server Components), see [references/nextjs.md](references/nextjs.md).

---

## Accessibility

Always add the reduced motion CSS from [references/css-recipes.md](references/css-recipes.md#reduced-motion) to your global stylesheet.

---

## Reference Files

- **[references/implementation.md](references/implementation.md)** — Step-by-step implementation workflow.
- **[references/patterns.md](references/patterns.md)** — Patterns, animation timing, and events API.
- **[references/troubleshooting.md](references/troubleshooting.md)** — Symptom-driven debugging and runtime limitations.
- **[references/css-recipes.md](references/css-recipes.md)** — Ready-to-use CSS animation recipes.
- **[references/nextjs.md](references/nextjs.md)** — Next.js App Router patterns and Server Component details.
- **[references/types-and-composition.md](references/types-and-composition.md)** — Transition types, shared elements, common patterns, and how multiple VTs interact (moved from this file).
- **[references/review-checklist.md](references/review-checklist.md)** — Review checklist for a change that adds or edits view transitions.
