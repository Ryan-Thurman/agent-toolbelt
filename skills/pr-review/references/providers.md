# Hosting providers — GitHub, Azure Repos, generic git

The reviewer is not GitHub-only. `gh` is the GitHub path; **Azure Repos (Azure DevOps)** uses the
`az` CLI with a different PR model; and when neither CLI is present the review still runs from plain
**git** (report-only). Detect the provider once, up front, and route every host-touching step
(PR metadata, PR diff, inline posting, vote) through it.

## Detect the provider

From the origin remote (first match wins):

```bash
url="$(git remote get-url origin 2>/dev/null)"
case "$url" in
  *github.com*)                       provider=github ;;
  *dev.azure.com*|*visualstudio.com*) provider=azure  ;;
  *)                                  provider=git     ;;   # unknown host → git-only fallback
esac
```

A **PR URL passed as the target** also tells you the provider directly:
- `https://github.com/{owner}/{repo}/pull/{n}` → github, PR `n`.
- `https://dev.azure.com/{org}/{project}/_git/{repo}/pullrequest/{id}` (or
  `https://{org}.visualstudio.com/...`) → azure, PR `id`.

If the detected provider's CLI isn't installed/authenticated, **degrade one step**: azure/github →
`git` (review the branch/local diff, report-only, no posting), and say so. Never hard-fail because a
CLI is missing — the git path always works for diff acquisition.

## Capability matrix

| Capability | GitHub (`gh`) | Azure Repos (`az`) | generic `git` |
|---|---|---|---|
| PR metadata | `gh pr view <n> --json …` | `az repos pr show --id <id>` | — (branch/local only) |
| PR diff | `gh pr diff <n>` | git diff of PR refs (no `pr diff` verb) | `git diff <base>..HEAD` |
| Inline comments | one batched **review** (`/pulls/{n}/reviews`) | **per-location threads** (`pullRequestThreads`) | — (report-only) |
| Committable suggestion | ✅ ```suggestion``` block | ❌ renders as a plain code fence | — |
| Verdict → state | `event: COMMENT` (no self approve/reject) | optional `az repos pr set-vote` | — |
| Auth check | `gh auth status` | `az account show` / `az devops configure -l` | — |

Tier selection, diff formatting, the finding schema, the critic/dual-judge, and the rejection memory
are all **provider-independent** — they operate on the frozen diff, not the host. Only target
resolution, PR-diff acquisition, and `--comment` posting branch on `provider`.

## Azure essentials

- **PR metadata + refs:**
  ```bash
  az repos pr show --id <id> \
    --query '{src:sourceRefName, tgt:targetRefName, repo:repository.name, repoId:repository.id, proj:repository.project.name}'
  ```
  `sourceRefName`/`targetRefName` come as `refs/heads/<branch>` — strip the prefix for git.
- **org** comes from the remote URL (`dev.azure.com/{org}` or `{org}.visualstudio.com`) or
  `az devops configure --list`.
- **Arbitrary REST** (for anything without a first-class verb, e.g. PR threads) goes through
  `az devops invoke --area git --resource <resource> --route-parameters … --http-method … --in-file …`.
- **Auth:** `az login` (or `AZURE_DEVOPS_EXT_PAT` for a PAT). Check before posting; degrade to
  report-only if absent.

See `posting.md` for the per-provider inline-comment mechanics and `targets-and-diff.md` for
per-provider diff acquisition.
