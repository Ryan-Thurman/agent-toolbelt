# Finding schema

Every facet emits a list of findings in this shape. The aggregator merges/dedups them; the host
(not the model) derives the verdict from them. **Emit an empty list if the change is clean.**

```jsonc
{
  "file": "src/auth/session.ts",
  "lineStart": 142,            // anchor on the diff's NEW side
  "lineEnd": 148,              // == lineStart for a single line
  "facet": "security",         // correctness|security|performance|tests|maintainability|standards|spec-alignment|re-entry
  "bucket": "blocker",         // blocker | should-fix | nit
  "severity": "high",          // critical | high | medium | low
  "title": "Session token compared with non-constant-time equality",
  "rootIssue": "`token === stored` short-circuits on first mismatch.",
  "consequence": "Timing side-channel lets an attacker recover the token byte-by-byte.",
  "benefit": "Constant-time compare removes the side-channel.",
  "existingCode": "if (token === stored) {",          // optional
  "improvedCode": "if (timingSafeEqual(token, stored)) {",  // optional committable suggestion
  "confidence": 0.9,           // 0..1, tracks how thoroughly you verified
  "evidence": "src/auth/session.ts:142 — direct === on secret; no constant-time path in file"
}
```

## Rules

- **Anchor on the new side.** `lineStart`/`lineEnd` reference post-change line numbers (see
  `targets-and-diff.md`). If you can't anchor confidently, lower `confidence` and say so in
  `evidence` — don't invent a line number.
- **One facet per finding.** If two facets apply, emit the stronger one (or two findings).
- **`improvedCode` is optional** and only for concrete, safe, in-place fixes — not large rewrites.
- **`rootIssue`/`consequence`/`benefit` are required** — they are the "make the case" gate. A
  finding without a real consequence should not be emitted.
- **`confidence`** below ~0.5 means "worth a question, not an assertion" — render it as a question
  in the report, not a blocker.
