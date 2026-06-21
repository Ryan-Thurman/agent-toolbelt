# typescript / javascript checklist

Language-specific lenses, injected per-facet (`../references/lang-checklists.md`). Apply with the
schema + anti-noise rules; an item is a place to *look*, not a finding to emit verbatim.

## correctness
- `==`/`!=` where `===`/`!==` is meant; truthiness bugs on `0`/`""`/`NaN`.
- `async` function whose returned promise is never awaited (floating promise) — silent failure.
- `Array.prototype` callbacks ignoring the index/array args; `forEach` where the result is needed.
- optional chaining masking a real `undefined` that should be handled (`a?.b?.c ?? fallback` hiding a bug).
- `JSON.parse` without try/catch on untrusted input; `Number()`/`parseInt` without radix/NaN handling.

## security
- `any`/`as` casts crossing a trust boundary (parsed request body, env) without validation.
- string-built SQL/HTML/shell instead of parameterized APIs; `dangerouslySetInnerHTML`, `eval`, `new Function`.
- secrets read into client-bundled code (`NEXT_PUBLIC_`/`VITE_`-style exposure).

## performance
- `await` inside a `for`/`map` over independent work — should be `Promise.all`.
- new array/object allocation or regex compile inside a hot loop; spread-in-reducer (`{...acc}`) → O(n²).
- missing pagination/streaming on large fetches; loading a whole collection to count/filter.

## maintainability
- `any`/`unknown`/cast-heavy code where a discriminated union or explicit type would clarify the invariant.
- overloads / generics that hide a simple data shape; barrel-file re-export sprawl.
- enums or boolean flags multiplying where a typed union/state model fits.
