# python checklist

Language-specific lenses, injected per-facet (`../references/lang-checklists.md`). Apply with the
schema + anti-noise rules; an item is a place to *look*, not a finding to emit verbatim.

## correctness
- **mutable default argument** (`def f(x=[])` / `={}`) — shared across calls, classic bug.
- bare `except:` or `except Exception` swallowing errors; catching then `pass`.
- late-binding closure in a loop (`lambda: i` capturing the variable, not its value).
- `is` used for value equality (only `None`/singletons); float `==` without tolerance.
- iterating and mutating the same dict/list; relying on dict order pre-3.7 assumptions.

## security
- `subprocess(..., shell=True)` / `os.system` with interpolated input; `eval`/`exec`/`pickle.loads` on untrusted data.
- string-built SQL instead of parameterized queries (`cursor.execute(q, params)`).
- `yaml.load` without `SafeLoader`; `requests(..., verify=False)`.

## performance
- sync I/O / CPU-bound work on an async event loop (blocks all coroutines) — needs a thread/executor.
- N+1 ORM access (querying inside a loop) instead of `select_related`/`prefetch`/bulk.
- building a full list where a generator/iterator streams; `+=` string concat in a loop.

## maintainability
- logic that belongs in a method leaking into module-level code; deep nesting where early-return fits.
- `*args/**kwargs` pass-throughs that hide the real contract; `Any` typing where a concrete type exists.
- duplicated logic instead of a shared helper; a class that's really just a function.
