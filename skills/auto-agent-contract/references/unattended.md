# Unattended mode

Several packs in this toolbelt already say "unless the command is running in a configured unattended
mode" and then decline to say what that mode *is*. This file says.

**Unattended mode is set by the orchestrator, never inferred by the agent.** An agent cannot tell
whether a human is watching, and one that guesses will guess wrong in the direction that skips the
confirmation. Pass it in explicitly.

## The one thing that changes

Every skill in this toolbelt was written for a reader. It surfaces, tags, annotates, downranks, and
defers — all of which assume a person who will look at the output and decide something.

Unattended, **nobody looks.** So:

> Anything that was *advisory* to a human becomes *gating* to the orchestrator, or it does nothing at
> all.

That single sentence generates every rule below. A tag nobody reads is not a soft signal; it is a
no-op. If the tag mattered, it has to change a number the orchestrator computes on.

## What that means concretely

**Confirmation → policy.** Outward-facing actions normally confirm first — the toolbelt's posting
contract makes posting opt-in behind a `--comment` / `--post` flag. Unattended, there is nobody to
confirm, so the *configuration* is the consent: posting is on by design because the operator turned
the loop on. Actions the config does not cover do not happen.

**Rejection tags → gates.** `skills/pr-review/references/rejection-memory.md` downranks a
previously-rejected finding one bucket and tags it `⟲ previously rejected`, deliberately never hiding
it, so a human can overrule. That is correct for a human and useless for a loop: unattended, the tag
is invisible and the downranked finding still spawns a fix round. **Unattended, a repeat fingerprint
auto-demotes to nit** and therefore stops gating the merge. The finding is still written to the
report. The memory only earns its keep if it can actually stop the loop from re-litigating.

Keep the memory's write path unchanged — it still records only *adjudicated* false positives
(`refuted`, `no-consequence`), never stale drops. Widening what gets recorded to make the loop quieter
would train the reviewer to ignore real bugs.

**Human merge → bounded merge with an escalate state.** See `references/merge.md`.

**"Loop until clean" → bounded attempts.** See `references/convergence.md`.

**Report footer → an event.** A footer line like `memory: 2 findings downranked` is auditing for a
reader. Unattended, emit it as a structured event alongside the report, so the effect is recoverable
from the log rather than from prose nobody opened.

## What does not change

- **The verdict is still host-derived.** It was never the model's to decide, attended or not.
- **The reviewer is still read-only.** Removing the human does not add trust
  (`references/invocation.md` §4).
- **The diff is still untrusted.** More so: there is no human to notice a diff talking the reviewer
  into approving itself.
- **Findings are still reported in full.** Demotion changes what *gates*; it never changes what is
  *written down*. The distinction matters when someone reads the log a week later trying to work out
  why a bug shipped.

## Failing closed

When the orchestrator cannot establish a precondition — the store is corrupt, the host CLI is
unauthenticated, the reviewer returned unparseable output — an attended run degrades to report-only
and tells the user. An unattended run has nobody to tell, so it **stops in a resumable state and
escalates** somewhere a person will actually see it: a GitHub issue, a page, a queue. Silence is not a
degraded mode; it is an outage nobody has noticed yet.

The one exception is genuinely optional machinery. The rejection memory is a pure optimization: an
unreadable store logs a line and the review proceeds as if it were empty. It never blocks a review.
Know which of your preconditions are load-bearing.
