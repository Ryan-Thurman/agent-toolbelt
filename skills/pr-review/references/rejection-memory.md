# Anti-noise memory — the recorded-rejections learning loop

A cross-run precision memory (the dreki pattern). When verification (the standard critic or the deep
dual-judge) **refutes** a finding, remember it. On later runs of the same repo, a finding that the
judge already threw out gets **downranked and tagged**, not silently re-raised at full severity. This
is how the reviewer stops crying wolf about the same non-issue every run.

**Never hides anything.** A previously-rejected finding is still surfaced — just demoted and labelled
`⟲ previously rejected`, so a real regression isn't buried by a stale verdict. The memory lowers
*noise*, it does not suppress *signal*.

## Where it lives

Per-repo, outside the working tree, never committed:

```bash
store="$(git rev-parse --git-path pr-review-rejections.jsonl)"   # -> <repo>/.git/pr-review-rejections.jsonl
```

Using `git rev-parse --git-path` keeps it inside `.git/` (so it's naturally per-repo, ignored by git,
and shared across worktrees) without you hard-coding a path. If not in a git repo, skip the memory
entirely — it's a pure optimization, never a hard dependency.

## The fingerprint (must survive line drift)

Line numbers move every commit, so the fingerprint is **content-based, not location-based**:

```
fingerprint = short_hash( facet + "|" + path + "|" + normalize(rootIssue) )
```

- `normalize()` = lowercase, collapse whitespace, strip line numbers / hex literals / quoted
  identifiers — so "token === stored at L142" and "token === stored at L150" hash the same.
- Include `path` and `facet` so the same root issue in two files stays distinct.
- **Exclude** `lineStart`/`lineEnd`, severity, and confidence — those legitimately change between runs.

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
  "rejectedAtCommit": "<HEAD sha at rejection time>",
  "rejectedOn": "<ISO date>",     // get from `git log -1 --format=%cI` or pass in; do not invent
  "count": 1                       // bumped when the same fingerprint is rejected again
}
```

Append with a real JSON tool (`jq -c`), one object per line. On a repeat rejection of an existing
fingerprint, bump `count` and refresh `rejectedOn` instead of adding a duplicate line.

## What to record — and what NOT to

Record a drop **only** when verification refuted the finding on its merits:

- ✅ `reason: "refuted"` — judge re-read the code and showed the claim is **false** or unreachable.
- ✅ `reason: "no-consequence"` — real code, but no actual consequence (a nit dressed as a problem).

Do **NOT** record:

- ❌ **stale** drops — the finding was against code that has since changed. Stale ≠ wrong; the issue
  may legitimately recur in a different form. Learning from staleness would train the reviewer to
  ignore a real future bug. (See the stale-drop rule in `fan-out.md` §4.)
- ❌ findings the **user** dismissed in conversation (could be "not now", not "not real"). A future
  phase may add an explicit user-dismiss path with its own reason; until then, judge-only.
- ❌ anything from a run where verification itself failed/was skipped — no judgment, no memory.

This keeps the memory a record of *adjudicated false positives*, not of everything that ever got cut.

## Applying the memory (read path)

After aggregation + verification, **before** thresholding/rendering:

1. Load the store (skip if absent/empty). Index by `fingerprint`.
2. For each **surviving** finding, compute its fingerprint and look it up.
3. On a hit:
   - **Downrank one bucket**: `blocker → should-fix → nit` (a nit stays a nit). Lower `severity` one
     step too. This is the anti-noise effect — a previously-refuted "blocker" no longer blocks merge
     on reputation alone.
   - **Tag** it `⟲ previously rejected (<count>×, last <rejectedOn>)` in `title`/render.
   - **Do not drop it.** If the finding survived *this* run's independent verification, a human should
     still see it — the tag tells them "we've argued about this before", the downrank keeps it from
     dominating the verdict.
4. Findings with no fingerprint match render normally.

Because the verdict is host-derived, downranking a lone previously-rejected "blocker" to should-fix
can move the verdict away from `REQUEST CHANGES` — exactly the intended "stop blocking merge over a
known non-issue" behavior, while still showing the item.

## Writing the memory (write path)

In the **critic** step (standard, `fan-out.md` §4) and the **dual-judge** step (deep, `dual-judge.md`):
when a finding is dropped with a recordable reason (above), append/update its record in the store
before rendering. Do this for the *adjudicated* drops only, after verification has run.

## Guardrails

- The memory **downranks; it never auto-hides** — a `⟲` item is always rendered (subject to the normal
  nit threshold, same as any nit).
- It's **advisory and per-repo**. Deleting `.git/pr-review-rejections.jsonl` is a clean reset.
- If the store is unreadable/corrupt, log a one-line note and proceed as if empty — never block a review.
- Mention in the report footer when the memory affected anything: `memory: 2 findings downranked
  (previously rejected)`, so the effect is visible and auditable, never silent.
