# Merging the phase PR (solo `--merge` mode)

Only the **solo** flow (`--merge`) merges, and only the **phase PR**, and only when the review + the
main agent's fix pass leave **zero blockers**. Team mode (the default, no `--merge`) never reaches this
step — it posts the review and stops; humans merge there.

## Precondition

Do not merge unless **all** hold:
- the gate ran in `--merge` mode (solo), and
- the latest review found no remaining **blockers** (non-blocker findings do not block a merge), and
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
**re-review; do not merge.** A fix pass that landed after the review is exactly the code most likely
to be wrong, and it is the code nothing has looked at.

If the fix pass changed the tree, the honest sequence is fix → push → **re-review** (`--rereview`) →
merge, not fix → push → merge on the strength of a verdict about the pre-fix commit.

Then confirm the host agrees, since a merge is decided on the host's view of the PR, not yours:

```bash
gh pr view <pr> --json headRefOid --jq .headRefOid    # must equal the reviewed SHA
```

Expect this to lag: GitHub reports the pre-push head for a few seconds after a push. Re-read it a
couple of times before concluding the PR really is at a different commit — and **never** loosen the
SHA comparison to get past the lag. The comparison is the correctness rule; a retry is the
accommodation.

## Provider-aware merge

Detect the host with the shared provider contract (`shared/contracts/references/providers.md`):

```bash
url="$(git remote get-url origin 2>/dev/null)"
case "$url" in
  *github.com*)                       provider=github ;;
  *dev.azure.com*|*visualstudio.com*) provider=azure  ;;
  *)                                  provider=git     ;;
esac
```

**GitHub (`gh`):**
```bash
gh pr merge <pr> --squash --delete-branch    # --squash is the default phase-PR strategy; adjust to repo norm
```
- Honors branch protections / required checks; if it can't merge, it errors — surface that, don't work around it.
- Drop `--delete-branch` if the next phase branches off this one.

**Azure Repos (`az`):**
```bash
az repos pr update --id <id> --status completed \
  --merge-commit-message "Merge phase PR #<id>" --delete-source-branch true
# add --squash true to squash-merge, per repo norm
```
- Completing the PR is Azure's merge. If policies block completion, report it.

**Generic git / no host CLI:** don't auto-merge. Report the PR as review-clean and ask the human to
merge (degrade like the rest of the review family).

## After merge

Confirm the merge succeeded (the PR shows merged/completed), then hand control back to the phase loop:
the main agent proceeds to the next phase (e.g. branch the next phase off the updated base). Print a
one-line record: `merged PR #<n> (squash) → next phase`.
