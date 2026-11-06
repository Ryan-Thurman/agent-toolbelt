# Agent Toolbelt Auto Agent

This is the optional package for unattended agent-runner work. It contains
`auto-agent-contract`, the legacy headless `auto-agent-dev-lite` adapter, and
the `/auto-agent-plan` command. Interactive delivery uses the standard
`phased-delivery` skill instead.
The standard Agent Toolbelt plugin and `install.sh all` do not include them.

Install the standard `agent-toolbelt` plugin alongside this package when the
runner needs shared `pr-review`, `handoff`, or delivery skills. In Codex, install
`agent-toolbelt-auto-agent@agent-toolbelt` from the repository marketplace. In
Claude Code, use the optional marketplace entry or load this plugin directory;
in Cursor, load this plugin directory explicitly.
For project-scoped command installation, explicitly select the compatibility
pack: `./install.sh --harness all auto-agent-contract <target-folder>`.

The package does not run an unattended job by itself. Its skills define the
runner's invocation, plan, review, and merge contracts; the caller controls
execution and approval policy.
