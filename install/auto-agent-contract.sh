# DESC: rules for a headless orchestrator that shells into agent CLIs to code and review: invocation, convergence, merge, unattended mode, + /auto-agent-plan
pack_auto_agent_contract() {
  cmd auto-agent-plan

  skill auto-agent-contract SKILL.md
  skill auto-agent-contract references/invocation.md
  skill auto-agent-contract references/convergence.md
  skill auto-agent-contract references/merge.md
  skill auto-agent-contract references/unattended.md
  skill auto-agent-contract references/plan-format.md
}
