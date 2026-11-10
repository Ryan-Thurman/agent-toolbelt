# Hosting providers — GitHub, Azure Repos, generic git

Detect the provider and apply the degrade rule with `shared/contracts/references/providers.md`.
Detect once, up front. Route every host-touching step (PR metadata, PR diff, inline posting, vote)
through that provider. A missing host CLI degrades the review to the git path: branch or local diff,
report-only. This file adds the review-specific capability matrix and Azure details.

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
