# Portal hosting

GitHub Pages publishes the checked files in `portal/generated/`.
The [workflow](../.github/workflows/portal.yml) keeps checks separate from publication.

## Publication gate

| Event | Checks | Publication |
| --- | --- | --- |
| Pull request to `main` | Run the version gate tests and package checks. | Do not publish. |
| Push to `main` with the same version | Run the version gate tests and package checks. | Do not publish. |
| Push to `main` with a higher stable version | Check release notes, matching package versions, generated files, and browser behavior. | Publish after all checks pass. |
| Push with a lower or invalid version | Fail the version check. | Do not publish. |
| Push to another branch or a release tag | This workflow does not run. | Do not publish. |

The gate reads `.cursor-plugin/plugin.json` from the commits before and after the push.
It compares the complete push, including pushes that contain several commits.
Stable versions have the form `major.minor.patch`, such as `1.0.1`.
The gate does not accept prerelease versions or build metadata.

For older commits without native plugin manifests, the gate reads the latest release heading in `CHANGELOG.md`.
This permits the first portal release from the older repository layout.
Missing history and unrelated commit histories fail the check.

All six plugin manifests and the Claude marketplace versions must match the Cursor manifest version.
The package checker reads that version instead of requiring changes to test code for each release.
A higher version also needs a matching release heading in `CHANGELOG.md`.

## First publication

| Step | Do | Why | Done when |
| --- | --- | --- | --- |
| 1 | Select **Settings → Pages → Build and deployment → Source → GitHub Actions** in the repository. | Allow the workflow to publish the site. | Pages uses the GitHub Actions source. |
| 2 | Increase the plugin and marketplace versions together. | Mark the content as a new release. | Every package version has the same higher value. |
| 3 | Add the release heading and notes to `CHANGELOG.md`. | Describe what the version contains. | The heading matches the new version. |
| 4 | Merge the checked release changes into `main`. | Trigger the publication gate. | The `Publish the versioned portal` job succeeds. |
| 5 | Open the URL shown in the `github-pages` environment. | Check the published result. | The portal, icons, search, and skill details load. |

The expected default address is `https://ryan-thurman.github.io/agent-toolbelt/`.
The workflow reports the actual address after deployment.
If the repository predates native plugin manifests, its first manifest version can satisfy step 2 through the changelog comparison.

The workflow uses the standard GitHub Actions token for publication.
It does not require a stored deployment token.
The repository setting must be enabled separately; automatic Pages enablement requires additional credentials.

## Release checks

The check job installs Node.js 24, development dependencies, and Chromium.
It runs `scripts/check-plugin-package.sh`, including version gate fixtures, package validation, installer checks, catalog checks, and portal browser checks.
The optional Claude CLI schema check runs only when that CLI is installed.

Only `portal/generated/` enters the Pages artifact.
The artifact is uploaded only for a version increase pushed to `main`.
The deploy job has Pages publication permissions; the check job has read-only repository access.
Pull requests cannot invoke the deploy job.

To inspect the gate locally, use full commit IDs:

```sh
RELEASE_BEFORE_SHA=<previous-commit-id> RELEASE_AFTER_SHA=<release-commit-id> node scripts/check-release-version.js
```

To test the gate without changing the repository:

```sh
node scripts/test-release-version.js
```

The fixture tests use a temporary Git repository.
They cover unchanged versions, increases, decreases, missing notes, legacy releases, invalid inputs, and workflow outputs.

If a deployment fails, fix its cause and rerun the original workflow run.
That run retains the original commit comparison.
A new push with the same version does not request another publication.

## References

- [GitHub Pages custom workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
- [Configure Pages action inputs](https://github.com/actions/configure-pages/blob/v5/action.yml)
- [GitHub Actions push events](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#push)
