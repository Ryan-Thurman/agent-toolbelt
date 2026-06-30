#!/usr/bin/env bash
# Cursor beforeShellExecution hook (matcher: "git push").
#
# Nudges you to run /pr-review on the branch before it leaves your machine by
# returning permission "ask" — Cursor surfaces a confirmation you can approve to
# push, or cancel to go review first. Advisory; never hard-blocks.
#
# Bypass:
#   - add [skip-review] anywhere in the command
#   - set TOOLBELT_REVIEW_NUDGE=0 in the environment
set -u

allow() { printf '{"permission":"allow"}\n'; exit 0; }

input="$(cat)"

[ "${TOOLBELT_REVIEW_NUDGE:-1}" = "0" ] && allow
case "$input" in *"git push"*) ;; *) allow ;; esac
case "$input" in *"[skip-review]"*) allow ;; esac

msg="About to push: have you run /pr-review on this branch? Approve to push, or cancel and review first. Bypass: set TOOLBELT_REVIEW_NUDGE=0."
printf '{"permission":"ask","user_message":"%s","agent_message":"%s"}\n' "$msg" "$msg"
exit 0
