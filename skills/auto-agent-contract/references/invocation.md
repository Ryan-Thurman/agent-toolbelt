# Invoking an agent CLI from an orchestrator

Four rules for the subprocess boundary. Each one is a bug that shipped.

---

## 1. Never put a diff in argv

The prompt you pass to `claude -p "<prompt>"` or `codex exec "<prompt>"` is **one argv entry**, and
`execve` caps argv **plus environ** together at 1 MiB on macOS. Exceed it and the process never
starts:

```
[Errno 7] Argument list too long: 'codex'
```

The reviewer dies before reading a line. A real phase-7 prompt was 1,325,823 bytes, of which 1.26 MB
was three rebuilt minified bundles the phase legitimately committed.

**Pass the PR reference, not the patch.** The agent has `gh` and fetches its own diff. This is the
whole reason `pr-review` takes a target rather than a blob (`skills/pr-review/references/targets-and-diff.md`).

### Two things that look like fixes and are not

**`.gitattributes` with `-diff` does not help.** Marking the bundles binary shrinks `git diff`
*locally* and nothing else. An orchestrator that sources its patch from `gh pr diff` is reading
GitHub's diff endpoint, and that endpoint ignores the repository's gitattributes entirely.

**A whole-prompt character cap is not enough either.** Truncating the tail of a prompt cuts the
instructions off the end and leaves the reviewer with a bundle. If you must embed a patch, **elide
per-file bodies over a budget while keeping every file header** — a reviewer needs the complete set of
touched paths and every hand-written hunk, and needs none of the bundle. On that phase-7 PR:
1,314,284 → 58,256 bytes, all 17 files still listed, only the three bundles elided.

Keep the whole-prompt cap as a last-resort backstop for anything else that grows. Size it at **half**
of `ARG_MAX`, not all of it — environ shares the budget (`agent-runner` uses `MAX_PROMPT_BYTES =
512 * 1024`).

### Truncate loudly

Every bound announces itself **in-band**, inside the prompt the agent reads, and points at the
untruncated prompt on disk:

```
[agent-runner] prompt truncated at 524288 bytes to stay under ARG_MAX.
Full prompt: <path>
```

A silently truncated review is worse than a loud one: it returns a confident verdict on code the
reviewer never saw, and nothing downstream can tell.

> Evidence: `5be094d` — "Bound the review prompt so a big diff can't blow ARG_MAX".

---

## 2. Structured-output extraction is adversarial

The agent is not a JSON endpoint. It narrates, it wraps, and it will happily hand you back something
that parses but means nothing. Extraction has to **fail closed**.

**Find the last parseable JSON, not the first.** A reviewer that reasons in prose before emitting its
verdict was breaking phases and spawning phantom fix jobs, because the parser only stripped a fence
that opened the output. Take the **last** parseable ` ```json ` fenced block anywhere in the output;
if there is none, take the **last bare top-level JSON object** found in prose.

**Unwrap the envelope.** `claude -p --output-format json` wraps the agent's answer in a `result`
field. Unwrap it before parsing, or every field you want is one level too deep.

**Reject a payload byte-identical to the previous run's.** This is the rule that is easy to skip and
expensive to omit. Agents echo. If the previous `review.json` is embedded anywhere in the prompt (as
context for a fix round, say) and the agent parrots it back, "last JSON wins" cheerfully resurrects a
**stale verdict** — a fix round can be adjudicated against the review it was supposed to fix. Compare
against the previous payload and reject an exact match: echo-only output must fail closed, not pass.

The same guard blunts injection. A verdict recovered from text the model was shown is not a verdict
the model reached.

> Evidence: `d78fd47` — "accept fenced reviewer json"; `406b24b` — "Fix review JSON extraction…".

---

## 3. Flag semantics, per CLI

These are not preferences. Each one is a job that died.

**`claude`**

- **`--allowedTools` / `--disallowedTools` are variadic.** The space-separated form
  `--disallowedTools Edit,Write` swallows the positional prompt the orchestrator appends last, and the
  job dies with `Input must be provided`. **Always use the `=`-joined form:**
  `--disallowedTools=Edit,Write,NotebookEdit`.
- **Headless `-p` denies what it cannot ask.** An unmatched permission check does not prompt — it is
  denied, and the job aborts. A write role must **pre-allow** the Bash commands it needs, or it dies
  the first time it runs `git commit`. Scope the allowlist to `git`, `gh`, and the leading command of
  each configured check:

  ```
  --permission-mode=acceptEdits
  --allowedTools=Bash(git:*),Bash(gh:*),Bash(pytest:*)
  ```

  `--dangerously-skip-permissions` works as a last resort and **removes all gating from an autonomous
  write job**. Widen the allowlist first.
- **A read-only allowlist that pre-allows no `Bash(...)` denies the reviewer before it starts.** See
  rule 4 for the allowlist that actually works.

**`codex`**

- `--sandbox workspace-write` **disables network access by default**, which breaks dependency fetches
  and `git push`. Re-enable it while keeping the filesystem sandbox:
  `-c sandbox_workspace_write.network_access=true`.

**`agy` (antigravity)**

- `-p` must come **last** in the flag list, immediately before the positional prompt.

> Evidence: `406b24b` — "…repair agent flag defaults". Note this commit's own review pass replaced an
> earlier `--dangerously-skip-permissions` default for write roles with the `acceptEdits` +
> checks-derived allowlist above. Prefer the allowlist.

---

## 4. The reviewer privilege boundary

**Never grant a reviewer `Bash(gh:*)`.** With it, the reviewer can comment on, approve, and merge the
pull request it is reviewing. That is not a hypothetical: it is one `gh pr merge` in a prompt the
model wrote itself, in a process nobody is watching.

Two failure modes people reach for and shouldn't:

- **Bare `Bash` in an allowlist grants *all* Bash.** `--allowedTools "Bash,Read,Grep,Glob"` looks
  restrictive and restricts nothing. If the prose next to it says "list only what review needs", the
  prose is wrong.
- **Omitting `Bash(...)` entirely denies the reviewer.** Under headless `-p` it cannot ask, so it
  cannot run `gh pr diff`, so it reviews nothing.

The allowlist that works is **verb-scoped**, not command-scoped:

```
--allowedTools=Bash(gh pr diff:*),Bash(gh pr view:*),Bash(gh pr checks:*),Bash(gh api:*),\
Bash(git diff:*),Bash(git log:*),Bash(git show:*)
--disallowedTools=Edit,Write,NotebookEdit
```

Read verbs only. No `gh pr comment`, no `gh pr review`, no `gh pr merge`, no `git push`. The
orchestrator posts and merges — those are host actions, derived from findings, and they never route
through the model that produced the findings.

This is defense in depth against prompt injection: a malicious diff that convinces the reviewer to
approve itself still cannot reach an API that would record the approval.

> Evidence: `agent_runner/config.py:256` (`claude_read_only_allowed_tools`).

---

## Related

- `references/unattended.md` — why the orchestrator, not the model, owns every gate.
- `skills/pr-review/references/finding-schema.md` — what the reviewer's JSON must contain.
- `skills/pr-review/references/output-format.md` — deriving the verdict from it mechanically.
