# Anti-Slop and Naming Contract

Use these as cross-language fallback rules after repository policy and local
conventions. They are reasoning cues, not regex bans.

## Names

- Name behavior truthfully. A read-like name must not persist, mutate, or trigger
  hidden work without making that responsibility clear.
- Reuse the repository's canonical domain vocabulary. Different terms should mean
  different things; do not introduce synonym drift for the same concept.
- Prefer predicate names for booleans (`is`, `has`, `can`, `should`) and plural
  names for collections. Distinguish identifiers from loaded objects.
- State units where a number is ambiguous (`timeoutMs`, `sizeBytes`).
- Increase specificity with scope and lifetime. Tiny, obvious scopes may use
  conventional short names; exported, asynchronous, or cross-module values need
  names that preserve their domain meaning.
- Treat `data`, `item`, `result`, `value`, `info`, `helper`, `manager`, and similar
  terms as cues to inspect context, not prohibited words. They are acceptable when
  the nearby type and scope make the meaning unambiguous.
- Avoid history or novelty names such as `newHandler`, `updatedFlow`, or `v2` when
  the name can describe the enduring responsibility instead.

## Shape of a change

- Comments explain constraints, tradeoffs, or reasons not evident from code; remove
  narration that merely restates the next statement.
- Do not add a helper, wrapper, option, fallback, flag, or abstraction without a
  current consumer, boundary, policy, or repeated behavior it protects.
- Keep diffs narrow. Do not restyle, rename, or reorganize unrelated code while
  implementing a focused behavior.
- Tests should pin observable behavior, including errors and side effects, rather
  than private implementation arrangement.

## Review calibration

Flag a name or anti-slop issue only when it breaks explicit policy or has a
concrete consequence. Misleading behavior, identity, unit, or domain vocabulary
can be a blocker or should-fix according to impact. A bounded readability concern
is a nit. Do not emit a subjective finding merely because a name is generic.
