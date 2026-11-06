# Maintain the guide against repository changes

## Snapshot covered inputs

The bundled Python 3 helper fingerprints files; it does not interpret code,
approve policies, validate commands, or make documentation edits. Use it after
the guide's evidence has been reviewed, including a no-change review. The state
file is an input-change checkpoint, not a semantic evidence ledger. Retain claim
sources and unresolved decisions in the guide's evidence appendix or existing
project evidence record.

Resolve `scripts/conventions_state.py` relative to this skill's directory. In an
installed pack it is inside the installed skill tree. Commands below assume the
current working directory is that skill directory; pass the actual target repo.

```sh
python3 scripts/conventions_state.py capture --repo /path/to/repo \
  --state docs/conventions-state.json --guide CONTRIBUTING.md \
  --scope src --scope tests --scope package.json --scope pnpm-lock.yaml \
  --scope .github --scope STYLE_GUIDE.md --scope AGENTS.md

python3 scripts/conventions_state.py check --repo /path/to/repo \
  --state docs/conventions-state.json
```

Choose actual paths; these examples do not imply that every repo uses Node or
those filenames. A scope may be an existing or future file/directory. Include
the controlling config, instruction and documentation owners, not just the code
sample. Use `--scope .` only when repository-wide fingerprinting is appropriate;
use repeated `--exclude path` for generated/vendor areas and local artifacts.
Scope/exclusion paths are literal repository-relative prefixes, not globs.
Secret-like environment/key files are excluded by default; example/sample/template
environment files are retained. Neither contents nor credentials are emitted.

Files are discovered with Git, including tracked and nonignored untracked files.
The state file and guide outputs are excluded from the source inventory; guide
hashes are checked separately so manual edits are visible. Include an existing
style owner as a source when it is not an output being rewritten. A newly
captured state replaces the previous checkpoint; record review results in the
normal doc change/PR, not by claiming the helper validated the text.

Exit codes for `check`: **0** covered inputs and guides unchanged; **1** changed
inputs/outputs or incomplete coverage from symbolic links/submodules; **2**
invalid/missing checkpoint or operational failure. Output is JSON. Non-regular
paths have link/directory metadata only; their contents are unassessed and cannot
produce a clean coverage result. Gitignored files, excluded areas and files
outside scopes are not covered. A changed HEAD alone does not make unchanged
covered inputs stale, and no ancestry assumption is needed across branches.

## Refresh by affected claim

1. Run `check` and inspect added, changed, deleted and edited-guide paths. If the
   state is missing, invalid, or unreadable, report the problem and inspect the
   current repo to establish a baseline. Do not call that a historical drift check.
2. Map changed inputs to affected claims using the evidence appendix. A changed
   test runner affects command guidance; a new package may require new scope;
   a modified representative file calls for reading neighboring counterexamples.
   Re-read governing policy even if only code changed. A Git diff is a useful
   navigation aid, not a substitute for the current source.
3. Reclassify affected claims: still supported, obsolete, new candidate, conflicted,
   or not assessed. Preserve documented exceptions and unrelated human edits.
   Do not turn a new implementation into policy without evidence of adoption.
4. Apply requested doc updates, or return a proposed scoped patch for audit-only
   requests. Preserve the existing owner and avoid full-file regeneration. Check
   affected links and definitions; record what commands actually ran.
5. Expand scopes/exclusions when the repository structure demands it. Capture a
   new checkpoint only after reviewing the changed scope and final outputs. A
   no-text-change review can advance the checkpoint with an explanation; never
   advance it merely to silence a warning or erase an unresolved conflict.

Check source changes again before capturing. If another writer changed inputs
during the review, re-evaluate those changes before recording the final snapshot.
No helper can prevent concurrent changes after its last read; report that limit
when the checkout is actively changing.

## Optional team integration

Start with on-demand refreshes and a docs-impact question in code review. If the
team requests CI automation, use the helper as a cheap signal on relevant paths
and hand changed claims to this skill for review. Do not fail every code-only PR
for lacking a docs edit: many changes leave contribution instructions correct.
Likewise, the mere presence of a changed `.md` file does not prove consistency.
Decide advisory versus blocking behavior from the repo's policy and observed
signal quality. Scheduling, CI installation and external PR posting are separate
requested work; this skill does not install them during guide generation.
