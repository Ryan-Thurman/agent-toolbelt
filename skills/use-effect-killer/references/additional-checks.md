# Additional checks

These checks are Toolbelt rules. They are not part of the upstream catalog in
[anti-patterns.md](anti-patterns.md). Each check has a letter, so the numbers 1 to 13 stay unchanged.
No scan pattern finds these checks. Read each component for them after you classify its effects.

## Side effect in the render body (check A)

A render body runs on every render and can run more than once. It must not navigate, redirect,
write to storage, send a request, or change a global. A call such as a location replace behind an `if` is still a render-time side effect.

**Fix:** Move the call into an event handler. When no event starts it, move it into an effect with the right dependencies. For a redirect that depends on state, use the router's redirect component or API.

## Interval that fetches with no in-flight guard (check B)

An effect starts a timer that dispatches a fetch on a fixed interval. When a response takes longer than the interval, requests overlap and an older response can replace a newer one.

**Fix:** Skip a tick while a request is in flight, or start the next timer after the previous request ends. Clear the timer in cleanup. Use the repository's data library with a refetch interval when it has one. Severity: use `react-acceptance.md`. Overlap that can show stale data is a `should-fix`.

## One-way latch copied into state (check C)

An effect sets a boolean state to true when a derived value first passes a check, and nothing resets it.

- When the derived value can go back to false and the UI must keep the true value, the latch is `Legitimate`. Record the reason.
- When the derived value never goes back, this is anti-pattern 1. Compute the value during render.

## Inline component wrapped in `memo` inside render (check D)

A component body defines a child component and wraps it in `memo` on each render. Each render creates a new component type. React remounts the child and loses its state, and `memo` never keeps the identity.

**Fix:** Move the component and its `memo` call to module scope. Pass the values as props.

## Async load in an effect with no cancel flag (check E)

An effect starts an async load, awaits it, and then sets state or dispatches. It has no `ignore` flag and no abort. This is anti-pattern 13 in the `await` form. A response after unmount or after a dependency change writes stale data. A loading flag in the dependency array can also restart the effect.

**Fix:** Add an `ignore` flag or an `AbortController` in cleanup, and check it after each `await`. Remove the loading flag from the dependency array. Follow the data-library note in the version notes of `anti-patterns.md`.
