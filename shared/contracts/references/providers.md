# Host Provider Contract

Use this contract when a pack needs to touch a pull-request host without owning
the full `pr-review` implementation.

## Provider Detection

Detect the provider once from the PR URL or `origin` remote:

```bash
url="$(git remote get-url origin 2>/dev/null)"
case "$url" in
  *github.com*)                       provider=github ;;
  *dev.azure.com*|*visualstudio.com*) provider=azure  ;;
  *)                                  provider=git     ;;
esac
```

PR URLs may override remote detection:

- `https://github.com/{owner}/{repo}/pull/{n}` means GitHub.
- `https://dev.azure.com/{org}/{project}/_git/{repo}/pullrequest/{id}` or
  `https://{org}.visualstudio.com/...` means Azure Repos.

## Degrade Rule

If the detected provider CLI is missing or unauthenticated, degrade one step:
GitHub/Azure becomes generic git, and generic git is report-only. Do not
hard-fail a review, reply, queue, or gate solely because host posting is
unavailable.

## Capability Split

- GitHub uses `gh` for PR metadata, PR diffs, reviews, comments, and merge.
- Azure Repos uses `az` and `az devops invoke` for PR metadata, threads,
  comments, votes, and completion.
- Generic git can acquire local or branch diffs but cannot post, fetch review
  threads, vote, or merge host PRs.

Provider-specific mechanics belong in the pack that performs the operation. The
shared invariant is: detect once, route all host-touching calls through that
provider, and report the degrade path explicitly.
