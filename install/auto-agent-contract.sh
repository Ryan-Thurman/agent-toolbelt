# DESC: optional private package for unattended agent-runner work and /auto-agent-plan
# PRIVATE: true
_auto_agent_skill() {
  local name="$1" rel="$2" src="plugins/agent-toolbelt-auto-agent/skills/$1/$2"
  _install "$src" ".agents/skills/$name/$rel"
  if [ "$rel" = "SKILL.md" ]; then
    _install "plugins/agent-toolbelt-auto-agent/skills/$name/agents/openai.yaml" ".agents/skills/$name/agents/openai.yaml"
  fi
}

_auto_agent_command() {
  local src="plugins/agent-toolbelt-auto-agent/commands/auto-agent-plan.md"
  if harness_enabled cursor; then _install "$src" ".cursor/commands/auto-agent-plan.md"; else gated=$((gated + 1)); fi
  if harness_enabled claude; then _install "$src" ".claude/commands/auto-agent-plan.md"; else gated=$((gated + 1)); fi
  return 0
}

pack_auto_agent_contract() {
  shared_contract references/test-driven-development.md
  shared_contract references/execution.md
  shared_contract references/execution-schema.md
  shared_contract references/failure-recovery.md
  shared_contract references/execution-lessons.md
  shared_contract references/operation-retries.md
  shared_contract references/posting.md
  shared_contract references/providers.md
  shared_contract scripts/validate-execution.py
  _auto_agent_command

  _auto_agent_skill auto-agent-contract SKILL.md
  _auto_agent_skill auto-agent-contract references/invocation.md
  _auto_agent_skill auto-agent-contract references/convergence.md
  _auto_agent_skill auto-agent-contract references/merge.md
  _auto_agent_skill auto-agent-contract references/unattended.md
  _auto_agent_skill auto-agent-contract references/plan-format.md
  _auto_agent_skill auto-agent-contract references/execution-boundary.md

  _auto_agent_skill auto-agent-dev-lite SKILL.md
}
