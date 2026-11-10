# Rule routing

<!-- Generated from rule-index.json by scripts/build-react-rule-routing.py. Do not edit. -->

Read the individual rule only when the changed code matches its condition. A rule's priority is a triage hint, not permission to ignore repository policy or invent performance requirements.

The React rule scan in `shared/contracts/references/typescript-react-baseline.md`
lists the `scan` rules that changed lines trigger. Check each `judgment` rule
against the change yourself. Severity comes from
`shared/contracts/references/react-acceptance.md`, not from the impact column.

## Async and data fetching

| When | Rule | Fix | Impact | Found by |
| --- | --- | --- | --- | --- |
| A Next.js route handler or Server Action awaits independent operations one after another. | [`async-api-routes.md`](rules/async-api-routes.md) | Start promises early, await late in API routes | CRITICAL | scan |
| Code awaits a Promise.all and then awaits a call that needs only one of its results. | [`async-dependencies.md`](rules/async-dependencies.md) | Use better-all for partial dependencies | CRITICAL | scan |
| Two or more independent awaits run in sequence in one function. | [`async-parallel.md`](rules/async-parallel.md) | Use Promise.all() for independent operations | CRITICAL | judgment |
| Code awaits a flag or remote value before it checks a cheap synchronous condition in the same branch. | [`async-cheap-condition-before-await.md`](rules/async-cheap-condition-before-await.md) | Check cheap sync conditions before awaiting flags or remote values | HIGH | scan |
| A function awaits a value at the top but an early-return branch does not use that value. | [`async-defer-await.md`](rules/async-defer-await.md) | Move await into branches where actually used | HIGH | judgment |
| An async server component awaits data before it returns layout JSX that does not need the data (React Server Components). | [`async-suspense-boundaries.md`](rules/async-suspense-boundaries.md) | Use Suspense to stream content | HIGH | scan |

## Bundle size

| When | Rule | Fix | Impact | Found by |
| --- | --- | --- | --- | --- |
| Code imports from a barrel file, such as an index file or an icon or component library root. | [`bundle-barrel-imports.md`](rules/bundle-barrel-imports.md) | Import directly, avoid barrel files | CRITICAL | scan |
| A component statically imports a heavy editor, chart, or map library that the first render does not need. | [`bundle-dynamic-imports.md`](rules/bundle-dynamic-imports.md) | Use next/dynamic for heavy components | CRITICAL | scan |
| An import() or file-system path comes from a variable or string concatenation instead of a literal path. | [`bundle-analyzable-paths.md`](rules/bundle-analyzable-paths.md) | Prefer statically analyzable import and file-system paths to avoid broad bundles and traces | HIGH | scan |
| A large module or data file loads at startup but only an optional feature or flag uses it. | [`bundle-conditional.md`](rules/bundle-conditional.md) | Load modules only when feature is activated | HIGH | scan |
| Code statically imports an analytics, logging, or error-tracking library into the initial client bundle. | [`bundle-defer-third-party.md`](rules/bundle-defer-third-party.md) | Load analytics/logging after hydration | MEDIUM | scan |
| A lazy-loaded module loads only on click, with no preload on hover, focus, or feature flag. | [`bundle-preload.md`](rules/bundle-preload.md) | Preload on hover/focus for perceived speed | MEDIUM | scan |

## Server rendering and actions

| When | Rule | Fix | Impact | Found by |
| --- | --- | --- | --- | --- |
| A Next.js 'use server' function runs a mutation or data read without its own authentication and authorization check. | [`server-auth-actions.md`](rules/server-auth-actions.md) | Authenticate server actions like API routes | CRITICAL | scan |
| An async server component awaits data and then renders a child component that also fetches data (React Server Components). | [`server-parallel-fetching.md`](rules/server-parallel-fetching.md) | Restructure components to parallelize fetches | CRITICAL | scan |
| Code awaits a Promise.all over items, then starts a second Promise.all that fetches nested data for each. | [`server-parallel-nested-fetching.md`](rules/server-parallel-nested-fetching.md) | Chain nested fetches per item in Promise.all | CRITICAL | scan |
| Server code fetches the same data again in sequential requests and has no cross-request cache. | [`server-cache-lru.md`](rules/server-cache-lru.md) | Use LRU cache for cross-request caching | HIGH | scan |
| A route handler or server function reads a static file, font, or template on each request. | [`server-hoist-static-io.md`](rules/server-hoist-static-io.md) | Hoist static I/O (fonts, logos) to module level | HIGH | scan |
| Server-rendered code writes request or user data to a mutable module-level variable (React Server Components or SSR). | [`server-no-shared-module-state.md`](rules/server-no-shared-module-state.md) | Avoid module-level mutable request state in RSC/SSR | HIGH | scan |
| A server component passes a whole object as a prop to a client component that uses only a few fields. | [`server-serialization.md`](rules/server-serialization.md) | Minimize data passed to client components | HIGH | scan |
| A Next.js route handler or Server Action awaits logging, analytics, or notification work before it returns. | [`server-after-nonblocking.md`](rules/server-after-nonblocking.md) | Use after() for non-blocking operations | MEDIUM | scan |
| Server code calls the same database, auth, or non-fetch async function more than once per request (React Server Components). | [`server-cache-react.md`](rules/server-cache-react.md) | Use React.cache() for per-request deduplication | MEDIUM | scan |
| A server component passes an array and a transformed copy, such as filter or toSorted, as client props. | [`server-dedup-props.md`](rules/server-dedup-props.md) | Avoid duplicate serialization in RSC props | LOW | scan |

## Client data and listeners

| When | Rule | Fix | Impact | Found by |
| --- | --- | --- | --- | --- |
| A client component fetches data in an effect and stores it in state instead of a deduplicating fetch hook. | [`client-swr-dedup.md`](rules/client-swr-dedup.md) | Use SWR for automatic request deduplication | MEDIUM-HIGH | scan |
| Code reads or writes localStorage or sessionStorage without a versioned key, minimal fields, or try/catch. | [`client-localstorage-schema.md`](rules/client-localstorage-schema.md) | Version and minimize localStorage data | MEDIUM | scan |
| Code adds a touch, wheel, or scroll listener without { passive: true } and does not call preventDefault. | [`client-passive-event-listeners.md`](rules/client-passive-event-listeners.md) | Use passive listeners for scroll | MEDIUM | scan |
| A hook adds a window or document listener, and many component instances each add their own copy. | [`client-event-listeners.md`](rules/client-event-listeners.md) | Deduplicate global event listeners | LOW | scan |

## Re-render control

| When | Rule | Fix | Impact | Found by |
| --- | --- | --- | --- | --- |
| A component function defines another component, a capitalized function or arrow function, inside its body. | [`rerender-no-inline-components.md`](rules/rerender-no-inline-components.md) | Don't define components inside components | HIGH | scan |
| A component subscribes to search params or storage but reads the value only inside a callback. | [`rerender-defer-reads.md`](rules/rerender-defer-reads.md) | Don't subscribe to state only used in callbacks | MEDIUM | scan |
| A component subscribes to a continuous value, such as window width or scroll position, but uses only a boolean. | [`rerender-derived-state.md`](rules/rerender-derived-state.md) | Subscribe to derived booleans, not raw values | MEDIUM | scan |
| An effect sets state to a value that the component can calculate from current props or state. | [`rerender-derived-state-no-effect.md`](rules/rerender-derived-state-no-effect.md) | Derive state during render, not effects | MEDIUM | scan |
| A state setter calculates the next value from the current state variable instead of an updater function. | [`rerender-functional-setstate.md`](rules/rerender-functional-setstate.md) | Use functional setState for stable callbacks | MEDIUM | scan |
| useState receives an expensive expression, such as a function call, JSON.parse, or storage read, instead of an initializer function. | [`rerender-lazy-state-init.md`](rules/rerender-lazy-state-init.md) | Pass function to useState for expensive values | MEDIUM | scan |
| A component calculates an expensive value or JSX in useMemo before an early return that does not use it. | [`rerender-memo.md`](rules/rerender-memo.md) | Extract expensive work into memoized components | MEDIUM | scan |
| A memo() component gives an optional object, array, or function prop an inline default value. | [`rerender-memo-with-default-value.md`](rules/rerender-memo-with-default-value.md) | Hoist default non-primitive props | MEDIUM | scan |
| A user action sets a state flag, and an effect watches that flag to do the side effect. | [`rerender-move-effect-to-event.md`](rules/rerender-move-effect-to-event.md) | Put interaction logic in event handlers | MEDIUM | scan |
| One useMemo or useEffect does independent tasks that use different dependencies. | [`rerender-split-combined-hooks.md`](rules/rerender-split-combined-hooks.md) | Split hooks with independent dependencies | MEDIUM | scan |
| A frequent event, such as scroll or resize, sets state for a non-urgent update without startTransition. | [`rerender-transitions.md`](rules/rerender-transitions.md) | Use startTransition for non-urgent updates | MEDIUM | scan |
| Text input sets state that drives an expensive filter, search, or chart render in the same component. | [`rerender-use-deferred-value.md`](rules/rerender-use-deferred-value.md) | Defer expensive renders to keep input responsive | MEDIUM | scan |
| A frequent event or timer, such as mousemove or an interval, sets state that render does not use. | [`rerender-use-ref-transient-values.md`](rules/rerender-use-ref-transient-values.md) | Use refs for transient frequent values | MEDIUM | scan |
| useMemo wraps a simple expression that returns a boolean, number, or string. | [`rerender-simple-expression-in-memo.md`](rules/rerender-simple-expression-in-memo.md) | Avoid memo for simple primitives | LOW-MEDIUM | scan |
| A hook dependency array lists a whole object, or a raw number the effect only compares to a threshold. | [`rerender-dependencies.md`](rules/rerender-dependencies.md) | Use primitive dependencies in effects | LOW | judgment |

## Rendering and DOM output

| When | Rule | Fix | Impact | Found by |
| --- | --- | --- | --- | --- |
| A component renders a long list of items with map and no virtualization or content-visibility. | [`rendering-content-visibility.md`](rules/rendering-content-visibility.md) | Use content-visibility for long lists | HIGH | scan |
| A page needs an early font, stylesheet, script, or third-party origin but has no preload or preconnect hint. | [`rendering-resource-hints.md`](rules/rendering-resource-hints.md) | Use React DOM resource hints for preloading | HIGH | scan |
| JSX adds a script tag with src and without defer or async, or a next/script without a strategy. | [`rendering-script-defer-async.md`](rules/rendering-script-defer-async.md) | Use defer or async on script tags | HIGH | scan |
| A component often hides and shows an expensive subtree and loses its state on each toggle (React 19.2+). | [`rendering-activity.md`](rules/rendering-activity.md) | Use Activity component for show/hide | MEDIUM | scan |
| Server-rendered UI reads localStorage or cookies during render, or in an effect that then changes visible state. | [`rendering-hydration-no-flicker.md`](rules/rendering-hydration-no-flicker.md) | Use inline script for client-only data | MEDIUM | scan |
| Server-rendered JSX shows a value that differs on server and client, such as a date, locale string, or random ID. | [`rendering-hydration-suppress-warning.md`](rules/rendering-hydration-suppress-warning.md) | Suppress expected mismatches | LOW-MEDIUM | scan |
| Code applies a CSS animation or transform class directly to an svg element instead of a wrapper div. | [`rendering-animate-svg-wrapper.md`](rules/rendering-animate-svg-wrapper.md) | Animate div wrapper, not SVG element | LOW | scan |
| JSX uses value && <Element /> where the value can be 0 or NaN, such as a count or length. | [`rendering-conditional-render.md`](rules/rendering-conditional-render.md) | Use ternary, not && for conditionals | LOW | scan |
| A component creates static JSX, such as a large SVG or skeleton, that uses no props or state. | [`rendering-hoist-jsx.md`](rules/rendering-hoist-jsx.md) | Extract static JSX outside components | LOW | judgment |
| An inline SVG path or points attribute has coordinates with more than three decimal places. | [`rendering-svg-precision.md`](rules/rendering-svg-precision.md) | Reduce SVG coordinate precision | LOW | scan |
| A handler sets a manual isLoading state to true before async work and to false after it. | [`rendering-usetransition-loading.md`](rules/rendering-usetransition-loading.md) | Prefer useTransition for loading state | LOW | scan |

## JavaScript hot paths

| When | Rule | Fix | Impact | Found by |
| --- | --- | --- | --- | --- |
| Code compares two arrays with sort, join, or JSON.stringify and does not first compare their lengths. | [`js-length-check-first.md`](rules/js-length-check-first.md) | Check array length before expensive comparison | MEDIUM-HIGH | scan |
| Code calls .sort() directly on a prop, state, or shared array instead of .toSorted() or a copy. | [`js-tosorted-immutable.md`](rules/js-tosorted-immutable.md) | Use toSorted() for immutability | MEDIUM-HIGH | scan |
| Code reads a layout property, such as offsetWidth or getBoundingClientRect, between style writes on DOM elements. | [`js-batch-dom-css.md`](rules/js-batch-dom-css.md) | Group CSS changes via classes or cssText | MEDIUM | scan |
| A render or hot loop calls the same pure function, such as slugify or a formatter, with repeated inputs. | [`js-cache-function-results.md`](rules/js-cache-function-results.md) | Cache function results in module-level Map | MEDIUM | judgment |
| A user event handler runs analytics, storage writes, or prefetch work that the user does not wait for. | [`js-request-idle-callback.md`](rules/js-request-idle-callback.md) | Defer non-critical work to browser idle time | MEDIUM | scan |
| A hot loop reads the same deep property chain, such as obj.config.settings.value, on each iteration. | [`js-cache-property-access.md`](rules/js-cache-property-access.md) | Cache object properties in loops | LOW-MEDIUM | judgment |
| Code reads localStorage, sessionStorage, or document.cookie again and again in a hot path without a memory cache. | [`js-cache-storage.md`](rules/js-cache-storage.md) | Cache localStorage/sessionStorage reads | LOW-MEDIUM | judgment |
| Code iterates the same array with several filter or map calls that one loop can replace. | [`js-combine-iterations.md`](rules/js-combine-iterations.md) | Combine multiple filter/map into one loop | LOW-MEDIUM | judgment |
| A loop or function continues to process items after the result is known. | [`js-early-exit.md`](rules/js-early-exit.md) | Return early from functions | LOW-MEDIUM | judgment |
| Code chains .map() and then .filter() to remove empty values that the map returns. | [`js-flatmap-filter.md`](rules/js-flatmap-filter.md) | Use flatMap to map and filter in one pass | LOW-MEDIUM | scan |
| A component or hot function creates a RegExp in its body on each call or render. | [`js-hoist-regexp.md`](rules/js-hoist-regexp.md) | Hoist RegExp creation outside loops | LOW-MEDIUM | scan |
| Code calls .find() on the same array by key inside a loop or another map. | [`js-index-maps.md`](rules/js-index-maps.md) | Build Map for repeated lookups | LOW-MEDIUM | scan |
| Code calls array.includes() inside a loop or filter for repeated membership checks. | [`js-set-map-lookups.md`](rules/js-set-map-lookups.md) | Use Set/Map for O(1) lookups | LOW-MEDIUM | judgment |
| Code sorts an array only to take its first or last item as the minimum or maximum. | [`js-min-max-loop.md`](rules/js-min-max-loop.md) | Use loop for min/max instead of sort | LOW | scan |

## Advanced React patterns

| When | Rule | Fix | Impact | Found by |
| --- | --- | --- | --- | --- |
| A component effect with an empty dependency array runs app-wide setup, such as an auth check or storage load. | [`advanced-init-once.md`](rules/advanced-init-once.md) | Initialize app once per app load | LOW-MEDIUM | judgment |
| A useEffect dependency array lists a function that useEffectEvent returns (React 19.2+). | [`advanced-effect-event-deps.md`](rules/advanced-effect-event-deps.md) | Don't put `useEffectEvent` results in effect deps | LOW | scan |
| An effect subscribes a handler prop to an event and lists that handler in its dependency array. | [`advanced-event-handler-refs.md`](rules/advanced-event-handler-refs.md) | Store event handlers in refs | LOW | scan |
| An effect lists a callback prop as a dependency only to call its latest version (React 19.2+ useEffectEvent). | [`advanced-use-latest.md`](rules/advanced-use-latest.md) | useLatest for stable callback refs | LOW | scan |
