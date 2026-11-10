# Transition types, shared elements, and composition

This file holds the sections that the Toolbelt moved out of `SKILL.md` to keep it short.
The text is the upstream guide text without changes, except that links now point to files in this folder.

## Transition Types

Tag transitions with `addTransitionType` so VTs can pick different animations based on context. Call it multiple times to stack types — different VTs in the tree react to different types:

```jsx
startTransition(() => {
  addTransitionType('nav-forward');
  addTransitionType('select-item');
  router.push('/detail/1');
});
```

Pass an object to map types to CSS classes. Works on `enter`, `exit`, **and** `share`:

```jsx
<ViewTransition
  enter={{ 'nav-forward': 'slide-from-right', 'nav-back': 'slide-from-left', default: 'none' }}
  exit={{ 'nav-forward': 'slide-to-left', 'nav-back': 'slide-to-right', default: 'none' }}
  share={{ 'nav-forward': 'morph-forward', 'nav-back': 'morph-back', default: 'morph' }}
  default="none"
>
  <Page />
</ViewTransition>
```

`enter` and `exit` don't have to be symmetric. For example, fade in but slide out directionally:

```jsx
<ViewTransition
  enter={{ 'nav-forward': 'fade-in', 'nav-back': 'fade-in', default: 'none' }}
  exit={{ 'nav-forward': 'nav-forward', 'nav-back': 'nav-back', default: 'none' }}
  default="none"
>
```

**TypeScript:** `ViewTransitionClassPerType` requires a `default` key in the object.

For apps with multiple pages, extract the type-keyed VT into a reusable wrapper:

```jsx
export function DirectionalTransition({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition
      enter={{ 'nav-forward': 'nav-forward', 'nav-back': 'nav-back', default: 'none' }}
      exit={{ 'nav-forward': 'nav-forward', 'nav-back': 'nav-back', default: 'none' }}
      default="none"
    >
      {children}
    </ViewTransition>
  );
}
```

### `router.back()` and Browser Back Button

`router.back()` and the browser's back/forward buttons carry **no transition types**, so type-keyed animations (directional slides) resolve to their `default` and don't play — untyped shared-element morphs still apply. For typed animations, use `router.push()` with an explicit URL.

### Types and Suspense

Types are available during navigation but **not** during subsequent Suspense reveals (separate transitions, no type). Use type maps for page-level enter/exit; use simple string props for Suspense reveals.

### Shared Element Readiness

A shared element transition can pair elements only when both the old and new views are rendered in the same Transition. If incoming content suspends, only its fallback exists for that update; the resolved content appears in a later Suspense transition and can be animated separately.

---

## Shared Element Transitions

Same `name` on two VTs — one unmounting, one mounting — creates a shared element morph:

```jsx
<ViewTransition name="hero-image">
  <img src="/thumb.jpg" onClick={() => startTransition(() => onSelect())} />
</ViewTransition>

// On the other view — same name
<ViewTransition name="hero-image">
  <img src="/full.jpg" />
</ViewTransition>
```

- Only one VT with a given `name` can be mounted at a time — use unique names (`photo-${id}`). Watch for reusable components: if a component with a named VT is rendered in both a modal/popover *and* a page, both mount simultaneously and break the morph. Either make the name conditional (via a prop) or move the named VT out of the shared component into the specific consumer.
- `share` takes precedence over `enter`/`exit`. Think through each navigation path: when no matching pair forms (e.g., the target page doesn't have the same name), `enter`/`exit` fires instead. Consider whether the element needs a fallback animation for those paths.
- Two ways a wired-up morph silently never fires: (1) `default="none"` with no explicit `share` prop — share resolves to none; (2) type-keyed `share` where the navigation never adds the type — a plain link click resolves the map's `default`. Every link that should morph must add the type (`transitionTypes` on `next/link`, or `addTransitionType`).
- Never use a fade-out exit on pages with shared morphs — use a directional slide instead.

---

## Common Patterns

### Enter/Exit

```jsx
{show && (
  <ViewTransition enter="fade-in" exit="fade-out"><Panel /></ViewTransition>
)}
```

### List Reorder

```jsx
{items.map(item => (
  <ViewTransition key={item.id}><ItemCard item={item} /></ViewTransition>
))}
```

Trigger inside `startTransition`. Avoid wrapper `<div>`s between list and VT.

### Layout Displacement Morph

Only content inside an activated boundary animates position — everything else teleports to its new layout spot. Wrap the sibling content below a growing/shrinking list in a bare `<ViewTransition>` so it glides instead of jumping. See [Layout Displacement Morph](patterns.md#layout-displacement-morph).

### Composing Shared Elements with List Identity

Shared elements and list identity are independent concerns — don't confuse one for the other. When a list item contains a shared element (e.g., an image that morphs into a detail view), use two nested `<ViewTransition>` boundaries:

```jsx
{items.map(item => (
  <ViewTransition key={item.id}>                                      {/* list identity */}
    <Link href={`/items/${item.id}`}>
      <ViewTransition name={`item-image-${item.id}`} share="morph">   {/* shared element */}
        <Image src={item.image} />
      </ViewTransition>
      <p>{item.name}</p>
    </Link>
  </ViewTransition>
))}
```

The outer VT handles list reorder/enter animations. The inner VT handles the cross-route shared element morph. Missing either layer means that animation silently doesn't happen.

### Force Re-Enter with `key`

```jsx
<ViewTransition key={searchParams.toString()} enter="slide-up" default="none">
  <ResultsGrid />
</ViewTransition>
```

**Caution:** If wrapping `<Suspense>`, changing `key` remounts the boundary and refetches.

### Suspense Fallback to Content

Simple cross-fade:
```jsx
<ViewTransition>
  <Suspense fallback={<Skeleton />}><Content /></Suspense>
</ViewTransition>
```

Directional reveal:
```jsx
<Suspense fallback={<ViewTransition exit="slide-down"><Skeleton /></ViewTransition>}>
  <ViewTransition enter="slide-up" default="none"><Content /></ViewTransition>
</Suspense>
```

For more patterns, see [references/patterns.md](patterns.md).

---

## How Multiple VTs Interact

Every VT matching the trigger fires simultaneously in a single `document.startViewTransition`. VTs in **different** transitions (navigation vs later Suspense resolve) don't compete.

### Use `default="none"` Deliberately

Without it, every VT fires the browser cross-fade on **every** transition — Suspense resolves, `useDeferredValue` updates, background revalidations. Use `default="none"` on named/shared elements and type-keyed page VTs.

But it also turns off `update` (layout/reflow morphs) and `share` (a named pair with no explicit `share` prop never morphs). Keyed list items and displaced siblings *want* update — leave them bare or set `update="auto"`.

### Two Patterns Coexist

**Pattern A — Directional slides:** Type-keyed VT on each page, fires during navigation.
**Pattern B — Suspense reveals:** Simple string props, fires when data loads (no type).

They coexist because they fire at different moments. `default="none"` on both prevents cross-interference. Always pair `enter` with `exit`. Place directional VTs in page components, not layouts.

### Nested VT Limitation

When a parent VT mounts/unmounts **as one unit** with nested VTs inside it, the nested ones do not fire their own enter/exit — only the outermost VT animates. (A child VT mounted inside a *persistent* parent VT fires enter/exit normally.) Per-item staggered animations during page navigation are not currently available in Next.js; see [troubleshooting](troubleshooting.md) for the upstream experimental status.
