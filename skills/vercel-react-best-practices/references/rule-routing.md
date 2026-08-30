# Rule routing

Read the individual rule only when the changed code matches its condition. A
rule's priority is a triage hint, not permission to ignore repository policy or
invent performance requirements.

## Async and data fetching

- Independent async work or avoidable waterfalls:
  [`async-parallel.md`](rules/async-parallel.md),
  [`async-defer-await.md`](rules/async-defer-await.md),
  [`async-dependencies.md`](rules/async-dependencies.md),
  [`async-cheap-condition-before-await.md`](rules/async-cheap-condition-before-await.md)
- API routes or server components start work before awaiting it:
  [`async-api-routes.md`](rules/async-api-routes.md),
  [`async-suspense-boundaries.md`](rules/async-suspense-boundaries.md)

## Bundles and client data

- Imports or bundles changed:
  [`bundle-barrel-imports.md`](rules/bundle-barrel-imports.md),
  [`bundle-analyzable-paths.md`](rules/bundle-analyzable-paths.md),
  [`bundle-dynamic-imports.md`](rules/bundle-dynamic-imports.md),
  [`bundle-conditional.md`](rules/bundle-conditional.md),
  [`bundle-defer-third-party.md`](rules/bundle-defer-third-party.md),
  [`bundle-preload.md`](rules/bundle-preload.md)
- Browser storage or global listeners changed:
  [`client-localstorage-schema.md`](rules/client-localstorage-schema.md),
  [`client-event-listeners.md`](rules/client-event-listeners.md),
  [`client-passive-event-listeners.md`](rules/client-passive-event-listeners.md)
- Client request caching/deduplication changed:
  [`client-swr-dedup.md`](rules/client-swr-dedup.md)

## Server and rendering

- Next.js server action authentication: [`server-auth-actions.md`](rules/server-auth-actions.md)
- React request caching or cross-request caching: [`server-cache-react.md`](rules/server-cache-react.md), [`server-cache-lru.md`](rules/server-cache-lru.md)
- RSC prop serialization or module-level request state: [`server-dedup-props.md`](rules/server-dedup-props.md), [`server-serialization.md`](rules/server-serialization.md), [`server-no-shared-module-state.md`](rules/server-no-shared-module-state.md)
- Static I/O, non-blocking work, or parallel fetches: [`server-hoist-static-io.md`](rules/server-hoist-static-io.md), [`server-after-nonblocking.md`](rules/server-after-nonblocking.md), [`server-parallel-fetching.md`](rules/server-parallel-fetching.md), [`server-parallel-nested-fetching.md`](rules/server-parallel-nested-fetching.md)
- Render frequency, effects, memoization, transitions, or state derivation: read the exact matching rule among [`rerender-defer-reads.md`](rules/rerender-defer-reads.md), [`rerender-dependencies.md`](rules/rerender-dependencies.md), [`rerender-derived-state.md`](rules/rerender-derived-state.md), [`rerender-derived-state-no-effect.md`](rules/rerender-derived-state-no-effect.md), [`rerender-functional-setstate.md`](rules/rerender-functional-setstate.md), [`rerender-lazy-state-init.md`](rules/rerender-lazy-state-init.md), [`rerender-memo.md`](rules/rerender-memo.md), [`rerender-memo-with-default-value.md`](rules/rerender-memo-with-default-value.md), [`rerender-move-effect-to-event.md`](rules/rerender-move-effect-to-event.md), [`rerender-no-inline-components.md`](rules/rerender-no-inline-components.md), [`rerender-simple-expression-in-memo.md`](rules/rerender-simple-expression-in-memo.md), [`rerender-split-combined-hooks.md`](rules/rerender-split-combined-hooks.md), [`rerender-transitions.md`](rules/rerender-transitions.md), [`rerender-use-deferred-value.md`](rules/rerender-use-deferred-value.md), or [`rerender-use-ref-transient-values.md`](rules/rerender-use-ref-transient-values.md).
- DOM/SVG, hydration, visibility, scripts, resource hints, or loading UI: read the exact matching rule among [`rendering-activity.md`](rules/rendering-activity.md), [`rendering-animate-svg-wrapper.md`](rules/rendering-animate-svg-wrapper.md), [`rendering-conditional-render.md`](rules/rendering-conditional-render.md), [`rendering-content-visibility.md`](rules/rendering-content-visibility.md), [`rendering-hoist-jsx.md`](rules/rendering-hoist-jsx.md), [`rendering-hydration-no-flicker.md`](rules/rendering-hydration-no-flicker.md), [`rendering-hydration-suppress-warning.md`](rules/rendering-hydration-suppress-warning.md), [`rendering-resource-hints.md`](rules/rendering-resource-hints.md), [`rendering-script-defer-async.md`](rules/rendering-script-defer-async.md), [`rendering-svg-precision.md`](rules/rendering-svg-precision.md), or [`rendering-usetransition-loading.md`](rules/rendering-usetransition-loading.md).

## JavaScript and advanced rules

- A measured or clearly hot loop/storage/lookup path changed: read the exact matching rule among [`js-batch-dom-css.md`](rules/js-batch-dom-css.md), [`js-cache-function-results.md`](rules/js-cache-function-results.md), [`js-cache-property-access.md`](rules/js-cache-property-access.md), [`js-cache-storage.md`](rules/js-cache-storage.md), [`js-combine-iterations.md`](rules/js-combine-iterations.md), [`js-early-exit.md`](rules/js-early-exit.md), [`js-flatmap-filter.md`](rules/js-flatmap-filter.md), [`js-hoist-regexp.md`](rules/js-hoist-regexp.md), [`js-index-maps.md`](rules/js-index-maps.md), [`js-length-check-first.md`](rules/js-length-check-first.md), [`js-min-max-loop.md`](rules/js-min-max-loop.md), [`js-request-idle-callback.md`](rules/js-request-idle-callback.md), [`js-set-map-lookups.md`](rules/js-set-map-lookups.md), or [`js-tosorted-immutable.md`](rules/js-tosorted-immutable.md). Do not report stylistic micro-optimizations.
- An existing advanced React pattern is being changed and the installed React version supports it: read the exact matching rule among [`advanced-effect-event-deps.md`](rules/advanced-effect-event-deps.md), [`advanced-event-handler-refs.md`](rules/advanced-event-handler-refs.md), [`advanced-init-once.md`](rules/advanced-init-once.md), or [`advanced-use-latest.md`](rules/advanced-use-latest.md).
