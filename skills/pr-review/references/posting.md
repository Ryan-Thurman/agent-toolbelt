# Inline PR-comment posting (`--comment`)

With `--comment` (PR targets only), post the findings as inline review comments anchored to
`file:line`. Always print the markdown report locally as well.
The shared policy is `shared/contracts/references/posting.md`. This file adds the review mechanics.
Detect the provider first (`providers.md`). GitHub posts one batched review. Azure Repos posts one
thread per location.

## Confirmation

The confirmation rule for `--comment` is in `shared/contracts/references/posting.md`. The preview
is the one in "Dry-run / preview".

## Preconditions

- The target must resolve to a real PR on GitHub or Azure Repos.
- The host CLI must be authenticated: GitHub `gh auth status`, Azure `az account show`.

If a precondition fails, print the report and say why posting was skipped.

## What gets posted (provider-neutral)

Post a **summary** plus **one inline comment per finding** at/above the posting threshold. Group them
so the author gets minimal noise: GitHub batches all of it into one review. Azure posts one thread per
location (no batch object) plus a PR-level summary thread.

- **Summary** = the report header: what the change does, the **host-derived verdict**, and the
  bucket counts (`N blockers · M should-fix · …`). Do not include the token-usage footer.
- Include the coverage/limits line and any acceptance coverage table from `output-format.md`.
  A partial review then keeps its scope gaps when posted.
- End the summary with the **head-SHA review marker** (see Idempotency):
  `<!-- pr-review:head=<headSha> tier=<tier> -->`.
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
  suggestion. It renders as a plain code fence, so prefix it with `Suggested change:` so the author
  knows to apply it by hand.
- The trailing HTML comment is an **idempotency marker** (`fingerprint` per `rejection-memory.md`).
  It is invisible in the rendered PR but lets a re-run detect "already posted this" (see Idempotency).

## Posting threshold (anti-spam)

Post the findings that survive the posting threshold in `output-format.md`. Questions and re-entry notes go in the
**summary body**, not as inline comments (they are not line-anchored assertions). A `⟲ previously
rejected` finding (`rejection-memory.md`) still posts but keeps its tag in the comment body.

## Line anchoring

Both hosts anchor to the **new side** of the change, but spell it differently:

- **GitHub:** `side: "RIGHT"`, `line: <lineEnd>`, and multi-line adds `start_line: <lineStart>` +
  `start_side: "RIGHT"`. It accepts only a `line` that is part of the PR diff.
- **Azure:** `threadContext.rightFileStart`/`rightFileEnd` = `{line, offset}` (1-based line **and**
  column, so use `offset: 1`), with `filePath` as a repo-root-absolute path (leading `/`). Anything on
  the old side uses `leftFile*` instead. This skill always uses the right side.
- If a finding's line is **not in the diff** (e.g. an unchanged line flagged for context), the host
  can reject the anchor. Do **not** drop the finding. Move it into the **summary** as
  `**<file>:<line>** — <title>` so it is still reported. Track which findings failed to anchor.

## Mechanics: GitHub (`gh`)

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
  "body": "<summary: what-changed + VERDICT + bucket counts + coverage + head-SHA marker>",
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

Build `payload.json` with a real JSON tool (e.g. `jq -n` or write the file), never string-concatenation,
because finding bodies contain backticks, quotes, and newlines.

## Mechanics: Azure Repos (`az`)

Azure has **no batched-review object**. Each location is its own **thread**, posted via the
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
to reduce noise. Per-location threads are what Azure reviewers expect, so default to that.)

## Verdict -> review state

The verdict is **informational by default** on both hosts. Put `**Verdict: REQUEST CHANGES**` in the
summary text and do not gate the merge from the tool.

- **GitHub:** always post `event: "COMMENT"`. GitHub forbids `APPROVE`/`REQUEST_CHANGES` on your own
  PR, and a CLI review is usually "self". (Reviewing the PR of someone else and explicitly want a blocking
  review? They can pass that intent. The default stays `COMMENT`.)
- **Azure:** `az repos pr set-vote` *can* cast a vote (`approve`/`wait-for-author`/`reject`/`reset`),
  and Azure permits self-votes. Still **do not auto-vote** by default. Map verdict -> vote only when
  the user explicitly asks (e.g. "and set my vote"). Posting comments must never silently change a vote.

## Idempotency (re-running `--comment`)

Re-running otherwise double-posts. Use two markers:

| Marker | Where | Meaning |
|---|---|---|
| `<!-- pr-review:head=<headSha> tier=<tier> -->` | end of the summary body | This head commit has a posted review. |
| `<!-- pr-review:<facet>:<fingerprint> -->` | end of each inline comment | This finding is already posted (`rejection-memory.md`). |

This file owns both markers. `triggers.md` says how each trigger uses the head-SHA marker.

1. Before posting, fetch the PR's existing comment bodies (commands below).
2. If a summary carries `pr-review:head=<current headSha>`, do not post. Report "already reviewed at
   `<headSha>`". Post again only with `--repost` or when the user explicitly asks for a repost.
   With `--repost`, post a new summary and skip the inline findings that are already present.
3. Otherwise, post the summary with the new head-SHA marker.
4. Skip each inline finding whose fingerprint marker is already present.

```bash
# github: inline comments, then review summaries (the head-SHA marker is in a review body)
gh api repos/{owner}/{repo}/pulls/<N>/comments --paginate --jq '.[].body' \
  | grep -o 'pr-review:[a-z-]*:[0-9a-f]*'
gh api repos/{owner}/{repo}/pulls/<N>/reviews --paginate --jq '.[].body' \
  | grep -o 'pr-review:head=[0-9a-f]*'
# azure: pull existing thread comments and grep the same marker
az devops invoke --area git --resource pullRequestThreads \
  --route-parameters project=<proj> repositoryId=<repoId> pullRequestId=<id> \
  --http-method GET --api-version 7.1 \
  --query 'value[].comments[].content' -o tsv | grep -oE 'pr-review:(head=[0-9a-f]+|[a-z-]+:[0-9a-f]+)'
```

Report "posted X new, skipped Y already present". A push creates a new head SHA.
A re-run after a push therefore posts a new summary and only the new findings.

## Dry-run / preview

Before the POST, print a one-line-per-comment preview (`path:line — bucket·title`) and the count.
Ask before the POST only when "Confirmation" requires it.

## Failure handling

- A single comment rejected for a bad anchor -> drop it to the summary body (above) and post the rest.
  Never let one un-anchorable finding sink the whole review.
- Partial POST failure -> report what posted and what did not. The markdown report remains the source of truth.
