# Anti-noise memory: the recorded-rejections learning loop

A cross-run precision memory. When verification (the standard critic or the deep
dual-judge) **refutes** a finding, remember it. On later runs of the same repo, a finding that the
judge already threw out gets **downranked and tagged**, not silently re-raised at full severity. This
is how the reviewer stops crying wolf about the same non-issue every run.

The memory demotes and tags a finding. It never hides one (see Guardrails).

## Where it lives

Per-repo, outside the working tree, never committed:

```bash
store="$(git rev-parse --git-path pr-review-rejections.jsonl)"   # -> <repo>/.git/pr-review-rejections.jsonl
```

Using `git rev-parse --git-path` keeps it inside `.git/` (so it is naturally per-repo, ignored by git,
and shared across worktrees) without you hard-coding a path. If not in a git repo, skip the memory
entirely. It is a pure optimization, never a hard dependency.

## The fingerprint (must survive line drift)

Line numbers move every commit, so the fingerprint is **content-based, not location-based**:

```
fingerprint = first 12 hex characters of SHA-256( facet + "|" + path + "|" + normalize(rootIssue) )
```

Compute the hash over the UTF-8 text of `$key`, with no trailing newline. `$key` holds
`facet|path|` followed by the normalized root issue:

```bash
printf '%s' "$key" | shasum -a 256 | cut -c1-12   # use sha256sum where shasum is missing
```

- `normalize()` runs these steps in order:
  1. Lowercase the text.
  2. Replace each backtick, single-quoted, or double-quoted span with the token `q`.
  3. Replace each hex literal (`0x` and hex digits) with `h`.
  4. Replace each run of digits with `n`. This removes line numbers.
  5. Collapse each run of whitespace to one space, and trim both ends.
- Both "token === stored at L142" and "token === stored at L150" normalize to "token === stored at ln",
  so they hash the same.
- Include `path` and `facet` so the same root issue in two files stays distinct.
- **Exclude** `lineStart`/`lineEnd`, severity, and confidence, because those legitimately change between runs.

This same fingerprint is the `--comment` idempotency marker (`posting.md`).

## Record shape (one JSON object per line)

```jsonc
{
  "fingerprint": "ab12cd",
  "facet": "security",
  "path": "src/auth/session.ts",
  "title": "Session token compared with non-constant-time equality",
  "rootIssue": "`token === stored` short-circuits on first mismatch.",
  "reason": "refuted",            // why it was dropped — see "What to record"
  "evidence": "<code location and observation that refuted this claim>",
  "rejectedAtCommit": "<HEAD sha at rejection time>",
  "rejectedOn": "<ISO date>",     // actual rejection date from the host clock, not the commit date
  "count": 1                       // bumped when the same fingerprint is rejected again
}
```

Append with a real JSON tool (`jq -c`), one object per line. On a repeat rejection of an existing
fingerprint, bump `count` and refresh `rejectedOn` instead of adding a duplicate line.
Preserve the falsifying observation and its code reference when writing a new
record so the next run can inspect why it was rejected. Older records without
`evidence` remain readable. Do not fabricate missing historical evidence.

## What to record, and what NOT to

Record a drop **only** when verification refuted the finding on its merits:

- ✅ `reason: "refuted"`: judge re-read the code and showed the claim is **false** or unreachable.
- ✅ `reason: "no-consequence"`: real code, but no actual consequence (a nit dressed as a problem).

Do **NOT** record:

- ❌ **stale** drops: the finding was against code that has since changed. Stale ≠ wrong, and the issue
  can legitimately recur in a different form. Learning from staleness will train the reviewer to
  ignore a real future bug. (See the stale-drop rule in `fan-out.md` §4.)
- ❌ findings the **user** dismissed in conversation (can be "not now", not "not real"). A future
  phase can add an explicit user-dismiss path with its own reason. Until then, judge-only.
- ❌ anything from a run where verification itself failed/was skipped: no judgment, no memory.

This keeps the memory a record of *adjudicated false positives*, not of everything that ever got cut.

## Applying the memory (read path)

After aggregation + verification, **before** thresholding/rendering:

1. Load the store (skip if absent/empty). Index by `fingerprint`.
2. For each **surviving** finding, compute its fingerprint and look it up.
3. On a hit:
   - **Downrank one bucket**: `blocker -> should-fix -> nit` (a nit stays a nit). Lower `severity` one
     step too. This is the anti-noise effect: a previously-refuted "blocker" no longer blocks merge
     on reputation alone.
   - **Tag** it `⟲ previously rejected (<count>×, last <rejectedOn>)` in `title`/render.
   - Keep it in the report. It survived this run's independent verification.
4. Findings with no fingerprint match render normally.

Because the verdict is host-derived, downranking a lone previously-rejected "blocker" to should-fix
can move the verdict away from `REQUEST CHANGES`, which is exactly the intended "stop blocking merge over a
known non-issue" behavior, while still showing the item.

## Writing the memory (write path)

In the **critic** step (standard, `fan-out.md` §4) and the **dual-judge** step (deep, `dual-judge.md`):
when a finding is dropped with a recordable reason (above), append/update its record in the store
before rendering. Do this for the *adjudicated* drops only, after verification has run.

## Guardrails

- The memory **downranks and never auto-hides**. A `⟲` item is always rendered (subject to the normal
  nit threshold, same as any nit).
- It is **advisory and per-repo**. Deleting `.git/pr-review-rejections.jsonl` is a clean reset.
- If the store is unreadable/corrupt, log a one-line note and proceed as if empty. Never block a review.
- Add the `memory:` audit footer (`output-format.md`) when the memory changed anything.
