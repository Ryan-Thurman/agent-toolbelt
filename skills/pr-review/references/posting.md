# Inline PR-comment posting (`--comment`)

By default a review prints a markdown report. With `--comment` (PR targets only) the same findings
are posted as **inline review comments** on the PR, anchored to `file:line`. The markdown report is
still printed locally so you have the full record.

This is opt-in and **never** runs unless the user passed `--comment`. Posting writes to a shared,
outward-facing artifact (the PR) — confirm before posting if the user only said "review".

**Provider-aware.** Posting works on **GitHub** (`gh`) and **Azure Repos** (`az`); the model differs
(GitHub = one batched review, Azure = per-location threads) — detect the provider first
(`providers.md`) and use the matching mechanics below. The concepts above the provider split (what to
post, threshold, anchoring, idempotency, dry-run) are identical for both.

## Preconditions

- The target must resolve to a **real PR** on a supported host (a PR number/URL, or a branch with an
  open PR — GitHub or Azure Repos). For branch-with-no-PR or local-working-changes there is nothing to
  attach comments to → fall back to the markdown report and say so.
- The host CLI must be authenticated: GitHub `gh auth status`; Azure `az account show` (+ a PAT or
  `az login` with Repos scope). If not, print the report and note posting was skipped.

## What gets posted (provider-neutral)

Post a **summary** plus **one inline comment per finding** at/above the posting threshold. Group them
so the author gets minimal noise: GitHub batches all of it into one review; Azure posts one thread per
location (no batch object) plus a PR-level summary thread.

- **Summary** = the report header: what the change does, the **host-derived verdict**, and the
  bucket counts (`N blockers · M should-fix · …`). Include the token-usage footer line.
- **One inline comment per surviving finding** at/above the posting threshold (below).
- Each inline comment body =
  ```
  **<bucket·severity> — <title>**
  <rootIssue> → <consequence>. <benefit>.

  <!-- pr-review:<facet>:<fingerprint> -->
  ```
  If the finding has `improvedCode`, append a fenced suggestion block:
  ````
  ```suggestion
  <improvedCode>
  ```
  ````
  On **GitHub** this is a one-click committable suggestion. On **Azure Repos** there is no committable
  suggestion — it renders as a plain code fence, so prefix it with `Suggested change:` so the author
  knows to apply it by hand.
- The trailing HTML comment is an **idempotency marker** (`fingerprint` per `rejection-memory.md`).
  It's invisible in the rendered PR but lets a re-run detect "already posted this" — see Idempotency.

## Posting threshold (anti-spam)

Post **blockers + should-fix** by default. **Suppress nits** unless the user passed an explicit
"include nits" intent or the review found nothing higher. Questions and re-entry notes go in the
**summary body**, not as inline comments (they're not line-anchored assertions). A `⟲ previously
rejected` finding (`rejection-memory.md`) still posts but keeps its tag in the comment body.

## Line anchoring

Both hosts anchor to the **new side** of the change, but spell it differently:

- **GitHub:** `side: "RIGHT"`, `line: <lineEnd>`; multi-line adds `start_line: <lineStart>` +
  `start_side: "RIGHT"`. Only accepts a `line` that's part of the PR diff.
- **Azure:** `threadContext.rightFileStart`/`rightFileEnd` = `{line, offset}` (1-based line **and**
  column; use `offset: 1`), with `filePath` as a repo-root-absolute path (leading `/`). Anything on
  the old side would use `leftFile*` instead — we always use right.
- If a finding's line is **not in the diff** (e.g. an unchanged line flagged for context), the host
  may reject the anchor. Do **not** drop the finding — move it into the **summary** as
  `**<file>:<line>** — <title>` so it's still reported. Track which findings couldn't anchor.

## Mechanics — GitHub (`gh`)

Resolve the PR number `N` and owner/repo, then build the review payload and POST it in one call.

```bash
gh pr view <N> --json number,headRefOid --jq '{n:.number, sha:.headRefOid}'   # commit to anchor to
```

Assemble a JSON payload and post via the REST reviews endpoint (handles the comments array atomically):

```bash
gh api repos/{owner}/{repo}/pulls/<N>/reviews \
  --method POST \
  --input payload.json
```

`payload.json` shape:

```jsonc
{
  "commit_id": "<headRefOid>",          // pin to the SHA you reviewed, so anchors stay valid
  "event": "COMMENT",                    // see "Verdict vs review event" below
  "body": "<summary body: what-changed + VERDICT + bucket counts + token footer>",
  "comments": [
    {
      "path": "src/auth/session.ts",
      "line": 148,                        // new-side line (lineEnd)
      "side": "RIGHT",
      "start_line": 142,                  // omit when single-line
      "start_side": "RIGHT",
      "body": "**blocker·high — …**\n…\n\n```suggestion\n…\n```\n\n<!-- pr-review:security:ab12cd -->"
    }
  ]
}
```

Build `payload.json` with a real JSON tool (e.g. `jq -n` or write the file), never string-concatenation
— finding bodies contain backticks, quotes, and newlines.

## Mechanics — Azure Repos (`az`)

Azure has **no batched-review object** — each location is its own **thread**, posted via the
`pullRequestThreads` REST resource (no first-class `az repos pr` verb for it, so use `az devops
invoke`). Get the routing IDs once (`providers.md`):

```bash
az repos pr show --id <id> \
  --query '{repoId:repository.id, proj:repository.project.name}'   # + org from the remote URL
```

Post **one thread per finding** (and one context-less thread for the summary). Each `thread.json`:

```jsonc
{
  "comments": [
    { "parentCommentId": 0, "commentType": 1,
      "content": "**blocker·high — …**\n…\n\nSuggested change:\n```\n…\n```\n\n<!-- pr-review:security:ab12cd -->" }
  ],
  "status": "active",
  "threadContext": {
    "filePath": "/src/auth/session.ts",                 // repo-root-absolute, leading slash
    "rightFileStart": { "line": 142, "offset": 1 },     // new side; offset = 1-based column
    "rightFileEnd":   { "line": 148, "offset": 1 }
  }
}
```

```bash
az devops invoke --area git --resource pullRequestThreads \
  --route-parameters project=<proj> repositoryId=<repoId> pullRequestId=<id> \
  --http-method POST --in-file thread.json --api-version 7.1
```

The **summary thread** is the same call with no `threadContext` (a PR-level discussion thread). Build
each `thread.json` with a real JSON tool, same as GitHub. (Optional: roll all comments into one thread
to reduce noise — but per-location threads are what Azure reviewers expect, so default to that.)

## Verdict → review state

The verdict is **informational by default** on both hosts — put `**Verdict: REQUEST CHANGES**` in the
summary text and don't gate the merge from the tool.

- **GitHub:** always post `event: "COMMENT"` — GitHub forbids `APPROVE`/`REQUEST_CHANGES` on your own
  PR, and a CLI review is usually "self". (Reviewing someone else's PR and explicitly want a blocking
  review? They can pass that intent; default stays `COMMENT`.)
- **Azure:** `az repos pr set-vote` *can* cast a vote (`approve`/`wait-for-author`/`reject`/`reset`),
  and Azure permits self-votes. Still **don't auto-vote** by default — only map verdict → vote when
  the user explicitly asks (e.g. "and set my vote"). Posting comments must never silently change a vote.

## Idempotency (re-running `--comment`)

Re-running would otherwise double-post. Before posting, fetch the markers already on the PR and skip
any finding whose `pr-review:<facet>:<fingerprint>` marker (`rejection-memory.md`) is present:

```bash
# github:
gh api repos/{owner}/{repo}/pulls/<N>/comments --paginate --jq '.[].body' \
  | grep -o 'pr-review:[a-z-]*:[0-9a-f]*'
# azure: pull existing thread comments and grep the same marker
az devops invoke --area git --resource pullRequestThreads \
  --route-parameters project=<proj> repositoryId=<repoId> pullRequestId=<id> \
  --http-method GET --api-version 7.1 \
  --query 'value[].comments[].content' -o tsv | grep -o 'pr-review:[a-z-]*:[0-9a-f]*'
```

**Skip** any finding whose marker is already present. Report "posted X new, skipped Y already present".
This makes `--comment` safe to re-run after pushing fixes — only genuinely new findings post.

## Dry-run / preview

Before the POST, print a one-line-per-comment preview (`path:line — bucket·title`) and the count.
If the user invoked with a confirm-first posture (the default when they didn't clearly say "post"),
show the preview and ask before the POST. With explicit `--comment` + "post it", skip the prompt.

## Failure handling

- Auth/permission error or the host CLI (`gh`/`az`) missing → print the full markdown report, note
  posting was skipped and why (degrade to report-only per `providers.md`).
- A single comment rejected for a bad anchor → drop it to the summary body (above) and post the rest;
  never let one un-anchorable finding sink the whole review.
- Partial POST failure → report what posted and what didn't; the markdown report remains the source of truth.
