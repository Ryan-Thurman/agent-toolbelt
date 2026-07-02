# Command Surfaces

Load this reference only when a Dev Lite run needs host-specific command
details, Codex invocation wording, or the template list.

The portable command prompts live in `../../commands/`:

- `/dev-intake`
- `/dev-plan`
- `/dev-start-phase`
- `/dev-implement-task`
- `/dev-phase-review`
- `/dev-fix-review-issues`
- `/dev-pr-review`

These command files install as real slash commands in Cursor
(`.cursor/commands/`) and Claude Code (`.claude/commands/`). In Codex they are
reusable prompt references rather than registered slash commands, so invoke this
skill directly instead:

```text
$dev-lite-workflow
Run a dev-lite PR readiness review for the current diff. Context: [bug or feature summary].
```

You can also invoke the skill through `/skills` and then ask for the specific
action by name, such as "run the PR readiness review" or "run a phase review."

Use the matching templates in `../../templates/` for persistent artifacts:

- `dev-feature-brief.md`
- `dev-implementation-plan.md`
- `dev-phase-review.md`
- `dev-pr-review.md`
