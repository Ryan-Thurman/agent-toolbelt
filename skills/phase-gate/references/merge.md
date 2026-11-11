# Merging the phase PR (solo `--merge` mode)

Only the **solo** flow (`--merge`) merges, and only the **phase PR**, and only when the latest review
approves it. Team mode (the default, no `--merge`) never reaches this step.

## Precondition

Do not merge unless **all** hold:
- the gate ran in `--merge` mode (solo), and
- the latest review verdict at the current head is `APPROVE`. A `NEEDS DISCUSSION` verdict with zero
  blockers and no scope gap can merge only after the user answers each open question. A scope gap
  (failed facet, failed verification, or unreviewed file) always stops the merge. Should-fix and nit
  findings do not block a merge, and
- for a Phased Delivery PR, the user explicitly authorized solo merge in this session
  (`skills/phased-delivery/references/review-rules.md` gives that decision to a human; without the
  authorization, stop and hand off as team mode), and
- the PR targets an ordinary base branch (a feature/integration branch or `main` per the repo's
  normal flow) — merging the PR into its base is the intended action here.

Never force-push or rewrite shared history to "merge"; use the host's merge so the PR is recorded as
merged. If the host CLI is missing or the merge is refused (protections, conflicts, required checks),
**stop and report** — don't improvise a push to the base branch.

## Merge only what was reviewed

"No blockers" is a fact about the commit the reviewer read. Solo mode fixes blockers *between* the
review and the merge, so by the time you merge, the tree has moved at least once. **Before merging,
confirm the thing you are about to merge is the thing that was reviewed.** That is three separate
checks, and each catches a different mistake:

```bash
# 1. Clean worktree — uncommitted changes are unreviewed changes; the PR doesn't contain them.
git status --porcelain            # must be empty

# 2. Right branch — a session that switched branches would merge a different PR.
git rev-parse --abbrev-ref HEAD   # must equal the reviewed PR's head branch

# 3. Right commit — a fix pushed after the review means the review adjudicated other code.
git rev-parse HEAD                # must equal the SHA the review ran against
```

Record the head branch and SHA when the review subagent returns, and compare here. If any check fails,
**re-review; do not merge.** A fix that landed after the review is the code most likely to be wrong,
and no review has read it. The solo flow therefore re-reviews after every fix commit (`modes.md`).

Then confirm the host agrees, since a merge is decided on the host's view of the PR, not yours:

```bash
gh pr view <pr> --json headRefOid --jq .headRefOid    # must equal the reviewed SHA
```

Expect this to lag: GitHub reports the pre-push head for a few seconds after a push. Re-read it a
couple of times before concluding the PR really is at a different commit — and **never** loosen the
SHA comparison to get past the lag. The comparison is the correctness rule; a retry is the
accommodation.

## Provider-aware merge

Detect the host with the shared provider contract (`shared/contracts/references/providers.md`).

**GitHub (`gh`):**
```bash
gh pr merge <pr> --squash    # --squash is the default phase-PR strategy; adjust to repo norm
```
- Honors branch protections / required checks; if it can't merge, it errors — surface that, don't work around it.
- Add `--delete-branch` only when no open PR uses this branch as its base.
- For stacked phase PRs, use a merge commit or update each child PR after the merge.
  A squash merge rewrites the parent's commits under the child branch.

**Azure Repos (`az`):**
```bash
az repos pr update --id <id> --status completed \
  --merge-commit-message "Merge phase PR #<id>"
# add --squash true to squash-merge, per repo norm
# add --delete-source-branch true only when no open PR uses this branch as its base
```
- Completing the PR is Azure's merge. If policies block completion, report it.

**Generic git / no host CLI:** don't auto-merge. Report the PR as review-clean and ask the human to
merge (degrade like the rest of the review family).

## After merge

Confirm the merge succeeded (the PR shows merged/completed), then hand control back to the phase loop:
the main agent proceeds to the next phase (e.g. branch the next phase off the updated base). Retarget
and re-check each child PR of a stacked phase. Print a
one-line record: `merged PR #<n> (squash) → next phase`.
