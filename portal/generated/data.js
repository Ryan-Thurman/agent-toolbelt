window.AGENT_TOOLBELT_DATA = {
  "generated_from": "catalog/agent-toolbelt.json + skills/*/SKILL.md + skills/*/agents/openai.yaml",
  "repository_url": "https://github.com/Ryan-Thurman/agent-toolbelt",
  "title": "Agent Toolbelt",
  "description": "General-purpose software delivery skills for planning, building, testing, reviewing, and shipping.",
  "categories": [
    "Discovery & Planning",
    "Feature Delivery",
    "Debugging & Repair",
    "Review & Quality",
    "Security & Risk",
    "Codebase Improvement",
    "Testing & Verification",
    "Agent Operations"
  ],
  "category_guidance": {
    "Discovery & Planning": "Clarify the problem, shape scope, and choose a grounded starting point.",
    "Feature Delivery": "Carry a bounded feature from plan through implementation and release readiness.",
    "Debugging & Repair": "Reproduce failures, find causes, and land a verified fix.",
    "Review & Quality": "Evaluate changes, address findings, and prove maintainability before review.",
    "Security & Risk": "Model threats and inspect sensitive changes for exploitable gaps.",
    "Codebase Improvement": "Reduce complexity, modernize structure, and protect behavior during refactors.",
    "Testing & Verification": "Design and execute checks that make expected behavior observable.",
    "Agent Operations": "Bound, coordinate, checkpoint, and hand off agent work safely."
  },
  "discovery_tags": [
    "planning",
    "bug-debugging",
    "review",
    "testing",
    "security",
    "refactor",
    "documentation",
    "release",
    "automation",
    "react-frontend"
  ],
  "hosts": [
    {
      "id": "cursor",
      "name": "Cursor",
      "implicit_matching": true,
      "invocation_template": "/{skill_id}",
      "browser_hint": "Skills can be selected implicitly or invoked manually with /skill-name.",
      "local_install_commands": [
        "cursor-agent --plugin-dir /path/to/agent-toolbelt"
      ],
      "installation": "Install or submit the repository as a Cursor plugin."
    },
    {
      "id": "claude-code",
      "name": "Claude Code",
      "implicit_matching": true,
      "invocation_template": "/agent-toolbelt:{skill_id}",
      "browser_hint": "Plugin skills can match implicitly or be invoked manually with /agent-toolbelt:skill-name.",
      "local_install_commands": [
        "claude --plugin-dir /path/to/agent-toolbelt"
      ],
      "installation": "Install from a local clone or add the repository to a Claude marketplace."
    },
    {
      "id": "codex",
      "name": "Codex",
      "implicit_matching": true,
      "invocation_template": "${skill_id}",
      "browser_hint": "Skills can match implicitly; invoke directly with $skill-name or browse with /skills.",
      "local_install_commands": [
        "codex plugin marketplace add /path/to/agent-toolbelt",
        "codex plugin add agent-toolbelt@agent-toolbelt"
      ],
      "installation": "Add the repository to a Codex marketplace, then install agent-toolbelt."
    }
  ],
  "native_skill_surface": "skills/*/SKILL.md",
  "workflow_membership_note": "A skill may support a workflow without appearing as one of its primary stages; membership is discoverability metadata, not an exact stage partition.",
  "surface_note": "Commands, hooks, installers, build helpers, and internal repository copies are compatibility or tooling surfaces, not native plugin skills.",
  "skills": [
    {
      "id": "bdd-scenarios",
      "display_name": "BDD Scenarios",
      "short_description": "Write or review Gherkin feature files from acceptance criteria.",
      "default_prompt": "Use $bdd-scenarios to turn these acceptance criteria into feature files with a step map and a traceability table.",
      "description": "Write or review Gherkin feature files from refined acceptance criteria, map steps to existing step definitions, and plan a BDD runner (playwright-bdd, pytest-bdd, or Cucumber-JVM). Use before test-first implementation or to review feature files.",
      "category": "Testing & Verification",
      "tags": [
        "bdd",
        "gherkin",
        "acceptance-tests",
        "playwright-bdd"
      ],
      "primary_purpose": "Turn acceptance criteria into Gherkin feature files that run as the outer test loop of test-first delivery.",
      "use_when": [
        "A refined story or plan phase has Given/When/Then criteria that need executable scenarios, or a failure-scenario card (FS- ID) needs a scenario.",
        "A team wants feature files reviewed, or needs a BDD runner such as playwright-bdd, pytest-bdd, or Cucumber-JVM."
      ],
      "avoid_when": [
        "The criteria are still vague. Use story-refinement first.",
        "The behavior is a unit-level rule that no reader outside the team needs. Use a unit test."
      ],
      "preferred_context": "Acceptance criteria with IDs, existing feature files and step definitions, the test runner, and the test levels.",
      "expected_outputs": [
        "Feature files with criterion and level tags",
        "Step map against existing step definitions",
        "Traceability from each criterion to a scenario or unit test"
      ],
      "example_prompts": [
        "Write the feature files for PROJ-123's acceptance criteria.",
        "Review our feature files for UI coupling and missing failure paths."
      ],
      "related_skills": [
        "story-refinement",
        "test-case-design",
        "phased-delivery",
        "webapp-testing",
        "failure-scenario-design"
      ],
      "workflow_membership": [
        "feature-delivery",
        "feature-refinement",
        "idea-to-release"
      ],
      "documentation_completeness": {
        "status": "complete",
        "notes": "Canonical skill and agent metadata are present."
      },
      "recommended_changes": [],
      "source_path": "skills/bdd-scenarios/SKILL.md",
      "source_url": "https://github.com/Ryan-Thurman/agent-toolbelt/blob/main/skills/bdd-scenarios/SKILL.md"
    },
    {
      "id": "bug-to-fix",
      "display_name": "Bug To Fix",
      "short_description": "Diagnostic bug workflow from triage and reproduction through root cause, minimal fix, and verification.",
      "default_prompt": "Diagnose this bug and drive it to a verified fix.",
      "description": "Diagnose and fix reported bugs through triage, reproduction, root-cause analysis, minimal repair, and verification. Use for bug tickets, broken/failing/slow behavior, RCA requests, or turning a confirmed defect into a verified fix.",
      "category": "Debugging & Repair",
      "tags": [
        "bug",
        "reproduction",
        "root-cause",
        "bug-debugging"
      ],
      "primary_purpose": "Turn a reported defect into a reproducible, diagnosed, verified fix.",
      "use_when": [
        "A bug report needs reproduction, root-cause analysis, a minimal patch, and regression evidence."
      ],
      "avoid_when": [
        "The request is a new feature or a broad refactor without a concrete defect."
      ],
      "preferred_context": "Issue report, reproduction steps, expected and actual behavior, logs, and relevant code.",
      "expected_outputs": [
        "Reproduction case",
        "Root-cause explanation",
        "Fix and regression test"
      ],
      "example_prompts": [
        "Investigate this report, reproduce it, and make the smallest verified fix.",
        "Find the root cause of this failing behavior and add regression coverage."
      ],
      "related_skills": [
        "cover",
        "webapp-testing",
        "code-quality-gate",
        "handoff"
      ],
      "workflow_membership": [
        "bug-fixing",
        "incident-follow-up"
      ],
      "documentation_completeness": {
        "status": "complete",
        "notes": "Canonical skill and agent metadata are present."
      },
      "recommended_changes": [],
      "source_path": "skills/bug-to-fix/SKILL.md",
      "source_url": "https://github.com/Ryan-Thurman/agent-toolbelt/blob/main/skills/bug-to-fix/SKILL.md"
    },
    {
      "id": "code-quality-gate",
      "display_name": "Code Quality Gate",
      "short_description": "Verify pre-PR code quality evidence",
      "default_prompt": "Use $code-quality-gate to assess the current diff before PR readiness.",
      "description": "Run a focused pre-PR quality gate when repository policy, user request, or change risk calls for repository checks and changed-code maintainability evidence; not for broad cleanup.",
      "category": "Review & Quality",
      "tags": [
        "quality-gate",
        "maintainability",
        "pre-pr",
        "review"
      ],
      "primary_purpose": "Verify pre-PR code quality evidence before a change enters review.",
      "use_when": [
        "A branch needs a pre-PR quality verdict covering correctness, maintainability, tests, and risk."
      ],
      "avoid_when": [
        "You only need a narrow syntax check, focused test command, or release-only checklist."
      ],
      "preferred_context": "Diff, repository conventions, validation commands, test results, and known risk areas.",
      "expected_outputs": [
        "Quality findings",
        "Blocking and non-blocking risks",
        "Pre-PR readiness recommendation"
      ],
      "example_prompts": [
        "Run the repository quality gate on this change and report blockers.",
        "Assess whether this branch is ready for review, including tests and maintainability."
      ],
      "related_skills": [
        "pr-review",
        "cover",
        "phase-gate"
      ],
      "workflow_membership": [
        "feature-delivery",
        "bug-fixing",
        "pr-review",
        "codebase-improvement",
        "security-sensitive-change"
      ],
      "documentation_completeness": {
        "status": "complete",
        "notes": "Canonical skill and agent metadata are present."
      },
      "recommended_changes": [],
      "source_path": "skills/code-quality-gate/SKILL.md",
      "source_url": "https://github.com/Ryan-Thurman/agent-toolbelt/blob/main/skills/code-quality-gate/SKILL.md"
    },
    {
      "id": "cover",
      "display_name": "Cover",
      "short_description": "Author behavior-pinning tests for a diff, module, or bug reproduction on opt-in.",
      "default_prompt": "Propose tests that pin this behavior.",
      "description": "Author behavior-pinning tests for a diff, a module, or a bug-to-fix regression gap, applied on opt-in, or scan an area for missing and weak coverage (detect-only). Use when adding regression coverage, strengthening tests, or surveying coverage gaps. Use test-case-design to plan cases from requirements.",
      "category": "Testing & Verification",
      "tags": [
        "tests",
        "regression",
        "behavior",
        "testing"
      ],
      "primary_purpose": "Add or improve focused test coverage for the behavior changed by a task.",
      "use_when": [
        "A fix or feature needs regression protection and executable evidence of expected behavior.",
        "A test-case-design report has selected TC- cases that need executable tests."
      ],
      "avoid_when": [
        "The repository has no testable seam and a test would only duplicate implementation details.",
        "The task is to plan cases from requirements. Use test-case-design."
      ],
      "preferred_context": "Acceptance criteria, changed code paths, existing test conventions, and failure cases.",
      "expected_outputs": [
        "Focused tests",
        "Coverage rationale",
        "Test execution results"
      ],
      "example_prompts": [
        "Add focused regression coverage for this bug fix.",
        "Identify the highest-value tests for this change and implement them."
      ],
      "related_skills": [
        "bug-to-fix",
        "test-case-design",
        "webapp-testing"
      ],
      "workflow_membership": [
        "feature-delivery",
        "bug-fixing",
        "security-sensitive-change",
        "codebase-improvement",
        "incident-follow-up"
      ],
      "documentation_completeness": {
        "status": "complete",
        "notes": "Canonical skill and agent metadata are present."
      },
      "recommended_changes": [],
      "source_path": "skills/cover/SKILL.md",
      "source_url": "https://github.com/Ryan-Thurman/agent-toolbelt/blob/main/skills/cover/SKILL.md"
    },
    {
      "id": "crap-analysis",
      "display_name": "CRAP Analysis",
      "short_description": "Configure and run CRAP analysis via repo commands — deterministic review and opt-in refactor.",
      "default_prompt": "Run CRAP analysis on my branch changes.",
      "description": "Run CRAP analysis via repo-configured commands — wizard setup, single-run orchestration, deterministic report review, and opt-in refactor. Use for /do-crap-analysis, /crap-config, or /crap-refactor.",
      "category": "Codebase Improvement",
      "tags": [
        "complexity",
        "coverage",
        "risk",
        "refactor"
      ],
      "primary_purpose": "Identify code with combined complexity and weak coverage so improvement effort is prioritized.",
      "use_when": [
        "A codebase needs evidence-based prioritization of risky, complex, or under-tested areas."
      ],
      "avoid_when": [
        "A single failing behavior needs diagnosis rather than structural risk analysis."
      ],
      "preferred_context": "Complexity measurements, coverage reports, hotspots, and repository constraints.",
      "expected_outputs": [
        "Prioritized hotspots",
        "Risk explanation",
        "Improvement candidates"
      ],
      "example_prompts": [
        "Run CRAP analysis on my branch changes and list the hotspots above the threshold.",
        "Prioritize refactoring targets using complexity and test evidence."
      ],
      "related_skills": [
        "simplify",
        "retrofit",
        "code-quality-gate"
      ],
      "workflow_membership": [
        "codebase-improvement"
      ],
      "documentation_completeness": {
        "status": "complete",
        "notes": "Canonical skill and agent metadata are present."
      },
      "recommended_changes": [],
      "source_path": "skills/crap-analysis/SKILL.md",
      "source_url": "https://github.com/Ryan-Thurman/agent-toolbelt/blob/main/skills/crap-analysis/SKILL.md"
    },
    {
      "id": "failure-scenario-design",
      "display_name": "Failure Scenario Design",
      "short_description": "Plan failure scenarios and staging chaos experiments as testable cards.",
      "default_prompt": "Use $failure-scenario-design to turn these reliability risks into scenario cards with Given/When/Then forms, test-first cases, and staging experiment plans.",
      "description": "Turn reliability risks into failure-scenario cards with a hypothesis, steady state, fault, blast radius, abort conditions, Given/When/Then form, and test-first case. Plans chaos experiments and game days for staging. Plan output only. Use after reliability-review marks risks as testable.",
      "category": "Testing & Verification",
      "tags": [
        "chaos-engineering",
        "failure-scenarios",
        "game-day",
        "resilience"
      ],
      "primary_purpose": "Turn reliability risks into failure-scenario cards that become BDD scenarios, test-first cases, and staging chaos experiment plans.",
      "use_when": [
        "A reliability review marks risks as testable.",
        "A team needs a chaos experiment or game day plan for staging."
      ],
      "avoid_when": [
        "The request is to run fault injection now. This skill only writes plans.",
        "The target is production without written approval."
      ],
      "preferred_context": "Reliability review or failure modes, journeys and their SLIs, telemetry, and the staging environment.",
      "expected_outputs": [
        "Scenario cards with hypothesis, steady state, fault, and verification level",
        "Given/When/Then forms and test-first cases",
        "Staging experiment plans with abort and no-go conditions"
      ],
      "example_prompts": [
        "Write failure scenarios for the payment dependency in this reliability review.",
        "Plan a staging game day for zone loss."
      ],
      "related_skills": [
        "reliability-review",
        "bdd-scenarios",
        "test-case-design",
        "cover",
        "phased-delivery"
      ],
      "workflow_membership": [
        "security-sensitive-change",
        "production-readiness",
        "incident-follow-up"
      ],
      "documentation_completeness": {
        "status": "complete",
        "notes": "Canonical skill and agent metadata are present."
      },
      "recommended_changes": [],
      "source_path": "skills/failure-scenario-design/SKILL.md",
      "source_url": "https://github.com/Ryan-Thurman/agent-toolbelt/blob/main/skills/failure-scenario-design/SKILL.md"
    },
    {
      "id": "handoff",
      "display_name": "Handoff",
      "short_description": "Write a compact, resumable handoff for another session, agent, or person.",
      "default_prompt": "Write a resumable handoff for this work.",
      "description": "Write a resumable handoff so a fresh agent or person can continue the work without context loss. Use proactively before a context reset or compaction, when pausing a long task, or when transferring work between sessions, agents, or people — in any workflow.",
      "category": "Agent Operations",
      "tags": [
        "handoff",
        "resumability",
        "context",
        "documentation"
      ],
      "primary_purpose": "Produce a concise, evidence-backed handoff that lets another agent resume work safely.",
      "use_when": [
        "Work may pause, transfer ownership, or cross an agent/session boundary."
      ],
      "avoid_when": [
        "The task is complete and needs only a user-facing summary."
      ],
      "preferred_context": "Plan, current state, changed files, decisions, checks, blockers, and next action.",
      "expected_outputs": [
        "Durable progress record",
        "Evidence links",
        "Explicit resume instructions"
      ],
      "example_prompts": [
        "Write a resumable handoff for the current implementation state.",
        "Capture decisions, checks, risks, and the exact next step for another agent."
      ],
      "related_skills": [
        "phase-context-workflow",
        "worktree"
      ],
      "workflow_membership": [],
      "documentation_completeness": {
        "status": "complete",
        "notes": "Canonical skill and agent metadata are present."
      },
      "recommended_changes": [],
      "source_path": "skills/handoff/SKILL.md",
      "source_url": "https://github.com/Ryan-Thurman/agent-toolbelt/blob/main/skills/handoff/SKILL.md"
    },
    {
      "id": "phase-context-workflow",
      "display_name": "Phase Context Workflow",
      "short_description": "Durable phase context for resumable long-running coding-agent work.",
      "default_prompt": "Set up durable phase context for this work.",
      "description": "Keep phase files, context packets, and phase handoffs so long coding-agent work survives /clear or /compact. Use when the user asks for phase files or a context packet, or when `.acc/phases/` already exists.",
      "category": "Agent Operations",
      "tags": [
        "phases",
        "context",
        "resumability",
        "documentation"
      ],
      "primary_purpose": "Maintain durable context and boundaries across a multi-phase implementation.",
      "use_when": [
        "A task spans phases, agents, or context windows and must retain state without redoing work."
      ],
      "avoid_when": [
        "The change is small enough to complete in one uninterrupted session."
      ],
      "preferred_context": "Approved plan, phase state, acceptance criteria, evidence, and deferred scope.",
      "expected_outputs": [
        "Phase state",
        "Activity log",
        "Resume and reconciliation instructions"
      ],
      "example_prompts": [
        "Set up durable phase context for this multi-step implementation.",
        "Reconcile the plan, progress, evidence, and next task before continuing."
      ],
      "related_skills": [
        "handoff",
        "phase-gate",
        "phased-delivery"
      ],
      "workflow_membership": [],
      "documentation_completeness": {
        "status": "complete",
        "notes": "Canonical skill and agent metadata are present."
      },
      "recommended_changes": [],
      "source_path": "skills/phase-context-workflow/SKILL.md",
      "source_url": "https://github.com/Ryan-Thurman/agent-toolbelt/blob/main/skills/phase-context-workflow/SKILL.md"
    },
    {
      "id": "phase-gate",
      "display_name": "Phase Gate",
      "short_description": "Synchronous PR-review gate at a phased-build boundary with isolated review and routing.",
      "default_prompt": "Run a phase gate review for this phase PR.",
      "description": "Run a synchronous PR-review gate at a phased-build boundary. Use when each phase PR needs an isolated subagent review, posted findings, and either team handoff or solo fix-and-merge routing. It runs pr-review. Use pr-review directly for a single review.",
      "category": "Review & Quality",
      "tags": [
        "phase",
        "review",
        "gates"
      ],
      "primary_purpose": "Review whether a delivery phase met its evidence and acceptance criteria before proceeding.",
      "use_when": [
        "Each phase PR needs an isolated subagent review before the next phase starts."
      ],
      "avoid_when": [
        "There is no phase boundary or the work has no defined acceptance evidence.",
        "A single PR needs one review. Use pr-review."
      ],
      "preferred_context": "Phase plan, completed work, checks, acceptance criteria, risks, and deferred items.",
      "expected_outputs": [
        "Gate decision",
        "Evidence summary",
        "Corrections or next-phase conditions"
      ],
      "example_prompts": [
        "Review this phase against its acceptance criteria and decide whether it can close.",
        "Run a phase gate and list required corrections before continuing."
      ],
      "related_skills": [
        "pr-review",
        "pr-improve",
        "phased-delivery",
        "phase-context-workflow"
      ],
      "workflow_membership": [
        "pr-review"
      ],
      "documentation_completeness": {
        "status": "complete",
        "notes": "Canonical skill and agent metadata are present."
      },
      "recommended_changes": [],
      "source_path": "skills/phase-gate/SKILL.md",
      "source_url": "https://github.com/Ryan-Thurman/agent-toolbelt/blob/main/skills/phase-gate/SKILL.md"
    },
    {
      "id": "phased-delivery",
      "display_name": "Phased Delivery",
      "short_description": "Deliver requirements or tickets as one PR per phase.",
      "default_prompt": "Use $phased-delivery to plan and deliver this requirement as reviewable PRs.",
      "description": "Plan, review, or deliver requirements as test-first phases with one PR each. Use with a clear raw requirement (use shape-up if vague), an existing plan, or approved tickets. Checks a phase PR against its ticket's acceptance criteria (use pr-review for code findings).",
      "category": "Feature Delivery",
      "tags": [
        "feature",
        "planning",
        "phases",
        "tickets",
        "testing",
        "tdd",
        "review"
      ],
      "primary_purpose": "Deliver approved requirements or tickets through test-first implementation in reviewable phases, one PR per phase.",
      "use_when": [
        "A requirement, plan, or approved project ticket set needs implementation through human-reviewed PRs.",
        "An existing implementation plan needs a report-only readiness check before execution."
      ],
      "avoid_when": [
        "The request is only to define requirements, or an unattended runner owns execution and merge.",
        "The requirement is vague. Use shape-up first.",
        "The task is a code review of a phase PR. Use pr-review."
      ],
      "preferred_context": "Source requirement or approved tickets, acceptance criteria, dependencies, repository state, and PR branch strategy.",
      "expected_outputs": [
        "Phase-to-PR map",
        "Implementation and verification evidence",
        "One reviewable PR per phase or ticket",
        "Plan readiness and requirement coverage",
        "Red/green test evidence and unit-test coverage gaps"
      ],
      "example_prompts": [
        "Use Phased Delivery to implement these approved tickets as stacked PRs, one ticket per PR.",
        "Plan and deliver this requirement in reviewable phases.",
        "Implement this feature test-first and cover its important unit-test branches.",
        "Review this plan for missing requirements and disconnected components."
      ],
      "related_skills": [
        "product-discovery",
        "shape-up",
        "phase-gate",
        "handoff",
        "bdd-scenarios"
      ],
      "workflow_membership": [
        "feature-delivery",
        "product-learning",
        "security-sensitive-change",
        "feature-refinement",
        "idea-to-release"
      ],
      "documentation_completeness": {
        "status": "complete",
        "notes": "Canonical skill and agent metadata are present."
      },
      "recommended_changes": [],
      "source_path": "skills/phased-delivery/SKILL.md",
      "source_url": "https://github.com/Ryan-Thurman/agent-toolbelt/blob/main/skills/phased-delivery/SKILL.md"
    },
    {
      "id": "pr-improve",
      "display_name": "PR Improve",
      "short_description": "Improve a PR in bounded verified rounds.",
      "default_prompt": "Use $pr-improve to address accepted PR findings within scope.",
      "description": "Iteratively fix an agreed PR review ledger within a frozen scope and verify each round. Use to improve a PR after findings exist; not for one-time review or broad cleanup. Use pr-review-reply to answer reviewer threads.",
      "category": "Review & Quality",
      "tags": [
        "pr",
        "fix",
        "rereview",
        "review"
      ],
      "primary_purpose": "Apply review-driven improvements and verify that a pull request is stronger after feedback.",
      "use_when": [
        "A pull request has actionable findings that need implementation and re-checking."
      ],
      "avoid_when": [
        "No review findings exist or the task is a fresh implementation.",
        "The task is to answer reviewer threads. Use pr-review-reply."
      ],
      "preferred_context": "Pull request diff, review findings, repository checks, and unresolved threads.",
      "expected_outputs": [
        "Implemented review fixes",
        "Updated tests or docs",
        "Rereview evidence"
      ],
      "example_prompts": [
        "Apply the actionable review findings on this pull request and rerun checks.",
        "Improve this PR from the review comments, preserving intent and documenting tradeoffs."
      ],
      "related_skills": [
        "pr-review",
        "pr-review-reply",
        "code-quality-gate"
      ],
      "workflow_membership": [
        "pr-review"
      ],
      "documentation_completeness": {
        "status": "complete",
        "notes": "Canonical skill and agent metadata are present."
      },
      "recommended_changes": [],
      "source_path": "skills/pr-improve/SKILL.md",
      "source_url": "https://github.com/Ryan-Thurman/agent-toolbelt/blob/main/skills/pr-improve/SKILL.md"
    },
    {
      "id": "pr-review",
      "display_name": "PR Review",
      "short_description": "Tiered code review for PRs, branches, or local diffs with evidence-backed findings.",
      "default_prompt": "Review this PR, branch, or local diff.",
      "description": "Review a PR, branch, or local diff with a tiered, multi-agent code-review process (light/standard/deep). Use before merge or when auditing changed code for bugs, security, performance, reliability, tests, maintainability, and standards compliance.",
      "category": "Review & Quality",
      "tags": [
        "pr",
        "code-review",
        "risk",
        "review"
      ],
      "primary_purpose": "Review a change for correctness, regressions, maintainability, and delivery risk.",
      "use_when": [
        "A pull request or diff needs an independent, evidence-backed review.",
        "A local diff needs review before a PR exists. Use /review-diff, which reports findings only and never posts.",
        "A change needs a /pr-ready-check readiness verdict before a PR opens, or a /role-review from one role (product, engineering, design, QA, security, or release)."
      ],
      "avoid_when": [
        "The request is only to implement a known change and no review is needed yet."
      ],
      "preferred_context": "Diff, base branch, issue or acceptance criteria, tests, and repository conventions.",
      "expected_outputs": [
        "Prioritized findings",
        "Evidence and severity",
        "Approval or correction recommendation"
      ],
      "example_prompts": [
        "Review this PR for correctness, regressions, and maintainability.",
        "Perform a risk-focused code review of this diff and report actionable findings first."
      ],
      "related_skills": [
        "pr-improve",
        "pr-review-reply",
        "code-quality-gate",
        "security-audit",
        "risk-area-mapping"
      ],
      "workflow_membership": [
        "feature-delivery",
        "pr-review",
        "codebase-improvement",
        "security-sensitive-change",
        "risk-based-testing",
        "idea-to-release"
      ],
      "documentation_completeness": {
        "status": "complete",
        "notes": "Canonical skill and agent metadata are present."
      },
      "recommended_changes": [],
      "source_path": "skills/pr-review/SKILL.md",
      "source_url": "https://github.com/Ryan-Thurman/agent-toolbelt/blob/main/skills/pr-review/SKILL.md"
    },
    {
      "id": "pr-review-reply",
      "display_name": "PR Review Reply",
      "short_description": "Triage PR review threads, triage each thread against code changed since the review, and draft per-thread replies.",
      "default_prompt": "Handle these PR review comments.",
      "description": "Handle the PR-review round-trip: read reviewer threads, triage each one against code changed since the review, and draft per-thread replies. Use to reply to a human reviewer's threads or close a /pr-review loop. Use pr-improve to fix accepted findings in code.",
      "category": "Review & Quality",
      "tags": [
        "review-comments",
        "threads",
        "pr",
        "review"
      ],
      "primary_purpose": "Respond to pull request review threads with concise evidence and clear disposition.",
      "use_when": [
        "Review comments need replies that explain fixes, decisions, or justified non-changes."
      ],
      "avoid_when": [
        "The pull request has not been reviewed or needs implementation rather than communication.",
        "The task is to fix accepted findings in code. Use pr-improve."
      ],
      "preferred_context": "Review thread, changed code, check results, and project conventions.",
      "expected_outputs": [
        "Thread responses",
        "Evidence references",
        "Explicit unresolved decisions"
      ],
      "example_prompts": [
        "Draft evidence-backed replies to the open review threads.",
        "Respond to these PR comments and distinguish fixes from justified non-changes."
      ],
      "related_skills": [
        "pr-review",
        "pr-improve",
        "handoff"
      ],
      "workflow_membership": [
        "pr-review"
      ],
      "documentation_completeness": {
        "status": "complete",
        "notes": "Canonical skill and agent metadata are present."
      },
      "recommended_changes": [],
      "source_path": "skills/pr-review-reply/SKILL.md",
      "source_url": "https://github.com/Ryan-Thurman/agent-toolbelt/blob/main/skills/pr-review-reply/SKILL.md"
    },
    {
      "id": "product-discovery",
      "display_name": "Product Discovery",
      "short_description": "Assess evidence before shaping a product idea.",
      "default_prompt": "Use $product-discovery to assess this opportunity before shaping.",
      "description": "Frame a product opportunity with evidence, assumptions, risks, experiments, and success thresholds before shape-up. Use when deciding what to build, not when a brief is already approved.",
      "category": "Discovery & Planning",
      "tags": [
        "opportunity",
        "evidence",
        "experiments",
        "planning"
      ],
      "primary_purpose": "Turn an opportunity or problem into evidence-backed scope and a useful next decision.",
      "use_when": [
        "The desired outcome, user problem, or evidence is unclear before implementation."
      ],
      "avoid_when": [
        "Acceptance criteria and implementation scope are already settled."
      ],
      "preferred_context": "User problem, stakeholders, evidence, constraints, alternatives, and decision horizon.",
      "expected_outputs": [
        "Problem framing",
        "Evidence and assumptions",
        "Decision-ready opportunity brief"
      ],
      "example_prompts": [
        "Explore this product problem and produce a decision-ready brief.",
        "Identify assumptions, evidence gaps, and the smallest useful experiment for this idea."
      ],
      "related_skills": [
        "shape-up",
        "ticket-discovery",
        "phased-delivery",
        "user-research-synthesis",
        "product-outcome-review"
      ],
      "workflow_membership": [
        "feature-delivery",
        "product-learning",
        "idea-to-release"
      ],
      "documentation_completeness": {
        "status": "complete",
        "notes": "Canonical skill and agent metadata are present."
      },
      "recommended_changes": [],
      "source_path": "skills/product-discovery/SKILL.md",
      "source_url": "https://github.com/Ryan-Thurman/agent-toolbelt/blob/main/skills/product-discovery/SKILL.md"
    },
    {
      "id": "product-outcome-review",
      "display_name": "Product Outcome Review",
      "short_description": "Assess customer outcomes after an experiment or release.",
      "default_prompt": "Use $product-outcome-review to assess this result against the original hypothesis.",
      "description": "Review whether an experiment or released change improved its original customer problem. Compare hypotheses, baselines, populations, guardrails, and uncertainty; use ship-it for immediate release health.",
      "category": "Discovery & Planning",
      "tags": [
        "product",
        "metrics",
        "evidence",
        "verification"
      ],
      "primary_purpose": "Assess whether an experiment or release improved the original customer problem.",
      "use_when": [
        "Results need comparison with the original hypothesis, baseline, population, and guardrails."
      ],
      "avoid_when": [
        "An immediate release failure requires operational recovery or bug diagnosis."
      ],
      "preferred_context": "Original hypothesis, event definitions, baseline, results, exposure dates, populations, and data limits.",
      "expected_outputs": [
        "Outcome comparison",
        "Uncertainty and counterevidence",
        "Continue, revise, stop, or gather-evidence decision"
      ],
      "example_prompts": [
        "Did this experiment improve the original customer problem?",
        "Review activation results after the signup population changed."
      ],
      "related_skills": [
        "product-discovery",
        "user-research-synthesis",
        "ship-it"
      ],
      "workflow_membership": [
        "product-learning",
        "idea-to-release"
      ],
      "documentation_completeness": {
        "status": "complete",
        "notes": "Canonical skill, metadata, template, command, and compatibility installer are present."
      },
      "recommended_changes": [],
      "source_path": "skills/product-outcome-review/SKILL.md",
      "source_url": "https://github.com/Ryan-Thurman/agent-toolbelt/blob/main/skills/product-outcome-review/SKILL.md"
    },
    {
      "id": "reliability-review",
      "display_name": "Reliability Review",
      "short_description": "Find failure modes and testable reliability requirements before a design is built.",
      "default_prompt": "Use $reliability-review to review this design for failure modes, SLOs, dependencies, recovery, and observability, and produce the reliability requirements.",
      "description": "Review a design or feature plan for failure modes, SLOs, dependencies, recovery, capacity, and observability before it is built, or run a production readiness review. Produces testable reliability requirements. Analysis only. Use failure-scenario-design to turn its requirements into test scenarios.",
      "category": "Security & Risk",
      "tags": [
        "sre",
        "reliability",
        "slo",
        "failure-modes"
      ],
      "primary_purpose": "Find failure modes and recovery gaps in a design before it is built, and turn them into testable reliability requirements.",
      "use_when": [
        "A design or change adds or changes a service, dependency, data store, queue, job, topology, or reliability target.",
        "A built service needs a production readiness review against its reliability requirements."
      ],
      "avoid_when": [
        "The change has no remote call, data store, job, or deployment change. Use the story tier of the reliability checklist instead.",
        "The task is to write test scenarios from existing reliability requirements. Use failure-scenario-design."
      ],
      "preferred_context": "Design document and revision, user journeys, dependencies and their owners, targets, telemetry, and deployment topology.",
      "expected_outputs": [
        "Dependency inventory and failure-mode register",
        "SLO and observability gaps with owners",
        "Reliability requirements with verification levels"
      ],
      "example_prompts": [
        "Run a reliability review on this design before we build it.",
        "Is this service ready for production? Check it against its reliability requirements."
      ],
      "related_skills": [
        "system-design",
        "threat-model",
        "failure-scenario-design",
        "ship-it"
      ],
      "workflow_membership": [
        "security-sensitive-change",
        "production-readiness",
        "incident-follow-up"
      ],
      "documentation_completeness": {
        "status": "complete",
        "notes": "Canonical skill and agent metadata are present."
      },
      "recommended_changes": [],
      "source_path": "skills/reliability-review/SKILL.md",
      "source_url": "https://github.com/Ryan-Thurman/agent-toolbelt/blob/main/skills/reliability-review/SKILL.md"
    },
    {
      "id": "risk-area-mapping",
      "display_name": "Risk Area Mapping",
      "short_description": "Draft the high-impact paths of a repo or a folder of repos for review.",
      "default_prompt": "Use $risk-area-mapping to draft the risk areas of these repositories from code, history, ownership, and the workspace map, into one review file.",
      "description": "Draft a repository's risk areas, the paths where a defect has high impact, from code, history, ownership, and an optional workspace map. Sweeps a folder of repos into one review file and applies only approved entries. Use before risk-based test planning or review.",
      "category": "Testing & Verification",
      "tags": [
        "risk-based-testing",
        "qa",
        "review",
        "workspace"
      ],
      "primary_purpose": "Draft the paths where a defect has high impact, for one repository or a folder of repositories, so that test planning and review put effort there.",
      "use_when": [
        "A team wants risk-based test planning or review and has no declared risk areas.",
        "A workspace map changed, or an incident showed a new high-impact path."
      ],
      "avoid_when": [
        "The repository already has a reviewed risk-area list and nothing changed."
      ],
      "preferred_context": "Schemas and models, access control code, exports and pipelines, CODEOWNERS, revert and hotfix history, and a workspace map with blast radius and integration edges.",
      "expected_outputs": [
        "Risk-area review file with evidence for each entry",
        "Dropped candidates with reasons",
        "Approved risk-area lists in each repository"
      ],
      "example_prompts": [
        "Draft the risk areas for this repository.",
        "Sweep the repos in this folder for risk areas and use the workspace map as evidence."
      ],
      "related_skills": [
        "test-case-design",
        "pr-review",
        "threat-model",
        "reliability-review"
      ],
      "workflow_membership": [
        "risk-based-testing"
      ],
      "documentation_completeness": {
        "status": "complete",
        "notes": "Canonical skill, agent metadata, template, command, and installer are present."
      },
      "recommended_changes": [],
      "source_path": "skills/risk-area-mapping/SKILL.md",
      "source_url": "https://github.com/Ryan-Thurman/agent-toolbelt/blob/main/skills/risk-area-mapping/SKILL.md"
    },
    {
      "id": "retrofit",
      "display_name": "Retrofit",
      "short_description": "Apply one defined mechanical change across every required site in a codebase.",
      "default_prompt": "Retrofit this change across the codebase.",
      "description": "Apply one defined change across every required site, such as a library swap, API rename, framework upgrade, or pattern replacement. Use for codebase-wide mechanical changes. Not for deciding the change or database migrations.",
      "category": "Codebase Improvement",
      "tags": [
        "migration",
        "upgrade",
        "mechanical-change",
        "refactor"
      ],
      "primary_purpose": "Plan and execute a safe, repeatable retrofit across an existing codebase.",
      "use_when": [
        "An existing repository needs a dependency, convention, API, or structural migration."
      ],
      "avoid_when": [
        "The task is a new feature with no existing surface to migrate."
      ],
      "preferred_context": "Inventory, compatibility constraints, migration stages, automated transforms, and rollback plan.",
      "expected_outputs": [
        "Migration plan",
        "Incremental changes",
        "Compatibility and verification evidence"
      ],
      "example_prompts": [
        "Plan a safe retrofit of this repository to the new API.",
        "Inventory the migration surface, apply the change incrementally, and verify compatibility."
      ],
      "related_skills": [
        "simplify",
        "cover",
        "code-quality-gate"
      ],
      "workflow_membership": [
        "codebase-improvement"
      ],
      "documentation_completeness": {
        "status": "complete",
        "notes": "Canonical skill and agent metadata are present."
      },
      "recommended_changes": [],
      "source_path": "skills/retrofit/SKILL.md",
      "source_url": "https://github.com/Ryan-Thurman/agent-toolbelt/blob/main/skills/retrofit/SKILL.md"
    },
    {
      "id": "review-on-open",
      "display_name": "Review On Open",
      "short_description": "Trigger PR review automation when a PR opens or updates.",
      "default_prompt": "Set up review-on-open automation for this repository.",
      "description": "Trigger /pr-review when a PR opens or updates. Use for GitHub Actions or host-agnostic poller review automation, PRs opened by other agents, or a review bot. Drives pr-review with idempotent posting.",
      "category": "Review & Quality",
      "tags": [
        "automation",
        "pr",
        "trigger",
        "review"
      ],
      "primary_purpose": "Define or operate a review trigger that evaluates changes when a work item opens.",
      "use_when": [
        "A repository wants consistent automated or agent-assisted review at pull request creation."
      ],
      "avoid_when": [
        "The request is a one-off manual code review without automation needs."
      ],
      "preferred_context": "Repository event, diff scope, permissions, review policy, and reporting destination.",
      "expected_outputs": [
        "Trigger behavior",
        "Review scope and policy",
        "Failure and reporting handling"
      ],
      "example_prompts": [
        "Design the review-on-open behavior for this repository.",
        "Check the existing open-PR review automation for safe scope and clear reporting."
      ],
      "related_skills": [
        "review-queue",
        "pr-review",
        "phase-context-workflow"
      ],
      "workflow_membership": [
        "pr-review"
      ],
      "documentation_completeness": {
        "status": "complete",
        "notes": "Canonical skill and agent metadata are present."
      },
      "recommended_changes": [],
      "source_path": "skills/review-on-open/SKILL.md",
      "source_url": "https://github.com/Ryan-Thurman/agent-toolbelt/blob/main/skills/review-on-open/SKILL.md"
    },
    {
      "id": "review-queue",
      "display_name": "Review Queue",
      "short_description": "Queue local PR-review jobs with SQLite for producer and worker agents.",
      "default_prompt": "Set up or operate the local review queue.",
      "description": "Queue PR-review jobs locally with SQLite. Use when PR-opening agents need review workers without webhooks, CI, or API keys. Producers enqueue PRs; workers claim jobs and run /pr-review --comment.",
      "category": "Review & Quality",
      "tags": [
        "queue",
        "sqlite",
        "pr",
        "review",
        "automation"
      ],
      "primary_purpose": "Organize review work into a durable queue with explicit state and ownership.",
      "use_when": [
        "Many changes need review tracking beyond a single interactive session."
      ],
      "avoid_when": [
        "There is only one small diff and no queue or persistence is needed."
      ],
      "preferred_context": "Review candidates, priority, ownership, state transitions, and persistence constraints.",
      "expected_outputs": [
        "Queue model",
        "Prioritized review list",
        "State and retry behavior"
      ],
      "example_prompts": [
        "Design a durable review queue for these pull requests.",
        "Inspect the review queue state and identify the next safe review jobs."
      ],
      "related_skills": [
        "review-on-open",
        "pr-review",
        "phase-context-workflow"
      ],
      "workflow_membership": [
        "pr-review"
      ],
      "documentation_completeness": {
        "status": "complete",
        "notes": "Canonical skill and agent metadata are present."
      },
      "recommended_changes": [],
      "source_path": "skills/review-queue/SKILL.md",
      "source_url": "https://github.com/Ryan-Thurman/agent-toolbelt/blob/main/skills/review-queue/SKILL.md"
    },
    {
      "id": "security-audit",
      "display_name": "Security Audit",
      "short_description": "Audit code and configuration security risks.",
      "default_prompt": "Use $security-audit to review this target's security risks.",
      "description": "Perform a read-only security audit of implemented code, configuration, dependencies, and secret exposure. Use threat-model for a design before it is built. Active testing requires explicit written authorization. Use pr-review for the security facet of one diff.",
      "category": "Security & Risk",
      "tags": [
        "security",
        "audit",
        "read-only"
      ],
      "primary_purpose": "Find and prioritize security weaknesses using a bounded, evidence-backed audit.",
      "use_when": [
        "A repository, change, or configuration needs a security-focused inspection."
      ],
      "avoid_when": [
        "The task is general quality review with no security-sensitive surface.",
        "The design is not built yet. Use threat-model.",
        "The task is the security facet of one diff. Use pr-review."
      ],
      "preferred_context": "Trust boundaries, sensitive data, dependencies, configuration, findings policy, and safe test scope.",
      "expected_outputs": [
        "Security findings",
        "Severity and evidence",
        "Remediation recommendations"
      ],
      "example_prompts": [
        "Run a bounded security audit of this change and prioritize findings.",
        "Inspect this repository for exploitable configuration and dependency risks."
      ],
      "related_skills": [
        "threat-model",
        "pr-review",
        "cover"
      ],
      "workflow_membership": [
        "security-sensitive-change"
      ],
      "documentation_completeness": {
        "status": "complete",
        "notes": "Canonical skill and agent metadata are present."
      },
      "recommended_changes": [],
      "source_path": "skills/security-audit/SKILL.md",
      "source_url": "https://github.com/Ryan-Thurman/agent-toolbelt/blob/main/skills/security-audit/SKILL.md"
    },
    {
      "id": "shape-up",
      "display_name": "Shape Up",
      "short_description": "Compare a product ask with current behavior, or shape an approved brief.",
      "default_prompt": "Use $shape-up to review this ask against the current system or shape it into an approved brief, as requested.",
      "description": "Compare a product ask with current system behavior, shape a vague request into an approved brief, or slice an approved brief into tickets before planning. Use product-discovery to decide whether to build. Route defects to bug-to-fix.",
      "category": "Discovery & Planning",
      "tags": [
        "brief",
        "scope",
        "shaping",
        "gap-review"
      ],
      "primary_purpose": "Compare a product ask with current system behavior or shape an idea into an approved brief.",
      "use_when": [
        "A product ask needs an evidence-backed current-state and gap review.",
        "A feature needs scope, constraints, and solution shaping before delivery."
      ],
      "avoid_when": [
        "The request is already fully specified and needs delivery rather than discovery, or is a straightforward defect fix."
      ],
      "preferred_context": "Product ask, repository behavior, tests and documentation, constraints, risks, and open decisions.",
      "expected_outputs": [
        "Evidence-backed current-state gap report or approved shaped brief",
        "Scope boundary and unanswered questions"
      ],
      "example_prompts": [
        "Review this requirement against the current system and tell me what gaps and questions we are missing.",
        "Shape this idea into a bounded delivery brief."
      ],
      "related_skills": [
        "product-discovery",
        "phased-delivery",
        "ticket-discovery",
        "story-refinement"
      ],
      "workflow_membership": [
        "feature-delivery",
        "product-learning",
        "feature-refinement",
        "idea-to-release"
      ],
      "documentation_completeness": {
        "status": "complete",
        "notes": "Canonical skill and agent metadata are present."
      },
      "recommended_changes": [],
      "source_path": "skills/shape-up/SKILL.md",
      "source_url": "https://github.com/Ryan-Thurman/agent-toolbelt/blob/main/skills/shape-up/SKILL.md"
    },
    {
      "id": "ship-it",
      "display_name": "Ship It",
      "short_description": "Prepare release readiness, rollback, release notes, and rollout monitoring for a change.",
      "default_prompt": "Prepare this change for release.",
      "description": "Prepare a change for release with readiness checks, rollback, release notes, and rollout monitoring. Use after PR merge or approval, or for the first launch of a service that has no earlier release. Follow the project's release policy and deployment owner.",
      "category": "Feature Delivery",
      "tags": [
        "release",
        "rollback",
        "rollout"
      ],
      "primary_purpose": "Prepare and execute a controlled release with verification, rollout, and rollback awareness.",
      "use_when": [
        "A tested change needs release readiness, deployment sequencing, or post-release checks."
      ],
      "avoid_when": [
        "The code is still being shaped or has not passed its required validation."
      ],
      "preferred_context": "Release artifact, environment, deployment procedure, monitoring, rollback, and ownership.",
      "expected_outputs": [
        "Release checklist",
        "Rollout and rollback plan",
        "Post-release verification"
      ],
      "example_prompts": [
        "Prepare this change for a safe release and include rollback checks.",
        "Create the rollout, monitoring, and post-release verification plan for this feature."
      ],
      "related_skills": [
        "code-quality-gate",
        "cover",
        "handoff",
        "reliability-review"
      ],
      "workflow_membership": [
        "feature-delivery",
        "product-learning",
        "production-readiness",
        "idea-to-release"
      ],
      "documentation_completeness": {
        "status": "complete",
        "notes": "Canonical skill and agent metadata are present."
      },
      "recommended_changes": [],
      "source_path": "skills/ship-it/SKILL.md",
      "source_url": "https://github.com/Ryan-Thurman/agent-toolbelt/blob/main/skills/ship-it/SKILL.md"
    },
    {
      "id": "simple-english",
      "display_name": "Simple English",
      "short_description": "Plain English with ASD-STE100 discipline and trope review.",
      "default_prompt": "Use $simple-english to rewrite this document in plain English.",
      "description": "Check or rewrite text against ASD-STE100, or review it for AI writing tropes. Use only for an STE or compliance request, a trope review of long text or client copy, or an error message, runbook, incident report, release note, commit message, or UI copy.",
      "category": "Agent Operations",
      "tags": [
        "writing",
        "documentation",
        "ste",
        "plain-english",
        "communication",
        "ai-tropes"
      ],
      "primary_purpose": "Check or rewrite text against ASD-STE100 in Strict mode or rule by rule, and review long text for AI writing tropes. The everyday writing rules live in human-readable-output.md.",
      "use_when": [
        "The user asks for STE, ASD-STE100 compliance, or a plain-English rewrite.",
        "An agent writes an error message, runbook, incident report, or release notes and needs the matching pattern.",
        "Long text or client-facing copy needs a trope review, or a pattern is not in the short list in human-readable-output.md."
      ],
      "avoid_when": [
        "The text is marketing or brand copy that needs persuasion."
      ],
      "preferred_context": "The draft text, its reader, and whether the user asks for Strict ASD-STE100 compliance.",
      "expected_outputs": [
        "Plain-English rewrite",
        "Rule-numbered check report in check mode",
        "Text without AI writing tropes"
      ],
      "example_prompts": [
        "Rewrite this README with simple-english.",
        "Check this runbook against ASD-STE100.",
        "Check this draft for AI writing tropes."
      ],
      "related_skills": [
        "pr-review",
        "handoff",
        "ship-it"
      ],
      "workflow_membership": [],
      "documentation_completeness": {
        "status": "complete",
        "notes": "Canonical skill and agent metadata are present."
      },
      "recommended_changes": [],
      "source_path": "skills/simple-english/SKILL.md",
      "source_url": "https://github.com/Ryan-Thurman/agent-toolbelt/blob/main/skills/simple-english/SKILL.md"
    },
    {
      "id": "simplify",
      "display_name": "Simplify",
      "short_description": "Behavior-preserving cleanup proposals and opt-in application after feature work or before PR.",
      "default_prompt": "Find safe simplifications for this code or diff.",
      "description": "Apply behavior-preserving cleanup on opt-in: delete dead code, inline thin wrappers, reuse helpers, and fix small inefficiencies. Use after feature work, before PR, when asked to simplify, or to scan an area for structural smells (detect-only). For verdicts use pr-review.",
      "category": "Codebase Improvement",
      "tags": [
        "cleanup",
        "dead-code",
        "refactor"
      ],
      "primary_purpose": "Reduce unnecessary complexity while preserving observable behavior.",
      "use_when": [
        "A code path is overcomplicated, duplicated, stale, or difficult to maintain."
      ],
      "avoid_when": [
        "The primary need is a new behavior or an unbounded redesign."
      ],
      "preferred_context": "Target code, behavior contract, tests, dependency graph, and a narrow cleanup boundary.",
      "expected_outputs": [
        "Simplified implementation",
        "Behavior-preservation evidence",
        "Removed complexity"
      ],
      "example_prompts": [
        "Simplify this module without changing its public behavior.",
        "Find safe dead-code and duplication reductions in this area and verify them."
      ],
      "related_skills": [
        "crap-analysis",
        "retrofit",
        "code-quality-gate"
      ],
      "workflow_membership": [
        "codebase-improvement"
      ],
      "documentation_completeness": {
        "status": "complete",
        "notes": "Canonical skill and agent metadata are present."
      },
      "recommended_changes": [],
      "source_path": "skills/simplify/SKILL.md",
      "source_url": "https://github.com/Ryan-Thurman/agent-toolbelt/blob/main/skills/simplify/SKILL.md"
    },
    {
      "id": "story-refinement",
      "display_name": "Story Refinement",
      "short_description": "Refine a ticket into a ready-to-build spec with criteria and questions.",
      "default_prompt": "Use $story-refinement to scan this ticket for ambiguity, draft Given/When/Then criteria, and prepare the owner questions and readiness verdict.",
      "description": "Refine a ticket, story, or approved brief into a ready-to-build spec. Find ambiguity, resolve facts from the repository, batch owner questions with defaults, write Given/When/Then criteria with negative paths, and give a readiness verdict. Use shape-up for a vague idea.",
      "category": "Discovery & Planning",
      "tags": [
        "refinement",
        "acceptance-criteria",
        "definition-of-ready",
        "bdd"
      ],
      "primary_purpose": "Refine a ticket or story into a ready-to-build spec with Given/When/Then criteria, owner questions, and a readiness verdict.",
      "use_when": [
        "A ticket, story, or approved brief is almost ready but has open questions, vague criteria, or missing failure paths.",
        "A team wants to prepare questions before a refinement meeting or check whether a story is ready."
      ],
      "avoid_when": [
        "The request is a vague idea or spans several subsystems. Use shape-up.",
        "The item is a defect. Use bug-to-fix."
      ],
      "preferred_context": "Ticket or story text, linked sources, repository behavior, existing tests, and the people who own open decisions.",
      "expected_outputs": [
        "Refined spec with Given/When/Then criteria and negative paths",
        "Decision log and open-questions register",
        "Question packet for each owner",
        "Readiness verdict"
      ],
      "example_prompts": [
        "Refine PROJ-123 before tomorrow's refinement meeting.",
        "Is this story ready to build? Check it with product, QA, and SRE lenses."
      ],
      "related_skills": [
        "shape-up",
        "test-case-design",
        "phased-delivery",
        "ticket-sync",
        "bdd-scenarios"
      ],
      "workflow_membership": [
        "feature-delivery",
        "feature-refinement",
        "idea-to-release"
      ],
      "documentation_completeness": {
        "status": "complete",
        "notes": "Canonical skill and agent metadata are present."
      },
      "recommended_changes": [],
      "source_path": "skills/story-refinement/SKILL.md",
      "source_url": "https://github.com/Ryan-Thurman/agent-toolbelt/blob/main/skills/story-refinement/SKILL.md"
    },
    {
      "id": "style-guide-init",
      "display_name": "Repository Contribution Guide",
      "short_description": "Extract repo conventions and maintain contribution guidance.",
      "default_prompt": "Use $style-guide-init to derive or refresh this repository's contribution guide from current evidence.",
      "description": "Extract and maintain repository contribution guidance from code, tooling, tests, CI, and documented policy. Use to create or refresh contribution/style guides, explain how to contribute, assess convention drift, or set up one quality command for local use and CI; not for routine code review.",
      "category": "Discovery & Planning",
      "tags": [
        "style",
        "conventions",
        "repository",
        "documentation"
      ],
      "primary_purpose": "Derive and maintain contribution guidance from repository policy, tooling, CI, and observed code/test conventions.",
      "use_when": [
        "A repository needs contribution or style guidance created, checked for drift, or refreshed against current evidence.",
        "A new team needs one quality command that local use, CI, and release all run, without fixing existing findings."
      ],
      "avoid_when": [
        "Existing conventions are clear and the task only needs a local implementation."
      ],
      "preferred_context": "Applicable policies, representative source/tests, task definitions, CI, existing doc owners, and any prior evidence checkpoint.",
      "expected_outputs": [
        "Contribution or style guide",
        "Classified evidence and unresolved conflicts",
        "Scoped drift report and evidence checkpoint",
        "Canonical quality command with CI and release wiring, and a list of checks pending adoption"
      ],
      "example_prompts": [
        "Create a contribution guide from the actual code, tests, tooling and CI, flagging stale written guidance.",
        "Check what changed since this guide was reviewed and refresh only the affected conventions.",
        "Set up the quality rails for this repository with style-guide-init --rails."
      ],
      "related_skills": [
        "code-quality-gate",
        "simplify",
        "phased-delivery"
      ],
      "workflow_membership": [
        "codebase-improvement"
      ],
      "documentation_completeness": {
        "status": "complete",
        "notes": "Canonical skill and agent metadata are present."
      },
      "recommended_changes": [],
      "source_path": "skills/style-guide-init/SKILL.md",
      "source_url": "https://github.com/Ryan-Thurman/agent-toolbelt/blob/main/skills/style-guide-init/SKILL.md"
    },
    {
      "id": "system-design",
      "display_name": "System Design",
      "short_description": "Discuss architecture, compare options, and document decisions.",
      "default_prompt": "Use $system-design to work through this architecture question and produce the design documents, decisions, and diagrams needed.",
      "description": "Work through system design questions, compare options, and create or review architecture documents, diagrams, and decision records. Also map implemented architecture; use phased-delivery for implementation planning.",
      "category": "Discovery & Planning",
      "tags": [
        "architecture",
        "documentation",
        "adr",
        "diagrams",
        "security",
        "planning",
        "evidence"
      ],
      "primary_purpose": "Work through architecture questions and produce evidence-backed designs, diagrams, decision records, or current repository maps.",
      "use_when": [
        "A team member needs help exploring a system design question or comparing architecture approaches.",
        "Architecture decisions need documented interfaces, data flows, failure behavior, and security requirements.",
        "A design document, architecture diagram, or decision record needs authoring, review, or maintenance.",
        "Current repository maps, dependency edges, or entry-point flows need source-backed maintenance."
      ],
      "avoid_when": [
        "A small bounded edit needs no architecture decision, or implementation planning is already sufficient."
      ],
      "preferred_context": "Requirements, current system evidence, constraints, architecture sources, and project-owned document format.",
      "expected_outputs": [
        "Scoped architecture answers and viable options",
        "System design document and appropriate architecture views",
        "Architecture decision records (ADRs) with lifecycle links",
        "Linked threat review for concrete design proposals",
        "Current repository map with source revisions and coverage limits, when requested",
        "Readiness findings, open decisions, owners, and verification gaps"
      ],
      "example_prompts": [
        "Help our team work through this system design question and compare viable approaches.",
        "Design this service and review its attack paths.",
        "Create an architecture document with diagrams, decision records, and explicit open questions.",
        "Document why we chose this architecture and what would make us reconsider it.",
        "Review this architecture for unanswered decisions, failure behavior, and security requirements.",
        "Update the repository map after this entry point moved."
      ],
      "related_skills": [
        "threat-model",
        "security-audit",
        "phased-delivery",
        "test-case-design",
        "reliability-review"
      ],
      "workflow_membership": [
        "security-sensitive-change",
        "feature-delivery",
        "idea-to-release"
      ],
      "documentation_completeness": {
        "status": "complete",
        "notes": "Canonical skill, metadata, template, command, and compatibility installer are present."
      },
      "recommended_changes": [],
      "source_path": "skills/system-design/SKILL.md",
      "source_url": "https://github.com/Ryan-Thurman/agent-toolbelt/blob/main/skills/system-design/SKILL.md"
    },
    {
      "id": "tech-backlog-assessment",
      "display_name": "Tech Backlog Assessment",
      "short_description": "Assess one technical investment before implementation.",
      "default_prompt": "Use $tech-backlog-assessment to assess this item and compare its alternatives.",
      "description": "Decide whether and how to do one technical backlog item: do/defer/reject/spike, options such as packages or upgrades, risks, test strategy, and next workflow. Use ticket-discovery when the item names a precedent; use tech-debt-discovery to find candidates.",
      "category": "Discovery & Planning",
      "tags": [
        "backlog",
        "decision",
        "spike",
        "planning"
      ],
      "primary_purpose": "Assess one supplied technical item and recommend Do, Defer, Reject, or Spike.",
      "use_when": [
        "A supplied maintenance item, library choice, migration, or test investment needs an evidence-backed decision."
      ],
      "avoid_when": [
        "The task is repository-wide debt discovery or an already authorized mechanical transformation."
      ],
      "preferred_context": "Supplied item, repository evidence, alternatives, compatibility, risks, tests, and constraints.",
      "expected_outputs": [
        "Decision memo",
        "Options and confidence",
        "Test strategy and next workflow"
      ],
      "example_prompts": [
        "Should we replace this library or keep the current implementation?",
        "Assess this upgrade using official version changes and actual API usage."
      ],
      "related_skills": [
        "tech-debt-discovery",
        "retrofit",
        "ticket-discovery"
      ],
      "workflow_membership": [
        "codebase-improvement"
      ],
      "documentation_completeness": {
        "status": "complete",
        "notes": "Canonical skill and agent metadata are present."
      },
      "recommended_changes": [],
      "source_path": "skills/tech-backlog-assessment/SKILL.md",
      "source_url": "https://github.com/Ryan-Thurman/agent-toolbelt/blob/main/skills/tech-backlog-assessment/SKILL.md"
    },
    {
      "id": "tech-debt-discovery",
      "display_name": "Technical Debt Discovery",
      "short_description": "Find evidence-backed maintenance work across a repository.",
      "default_prompt": "Use $tech-debt-discovery to find and prioritize maintenance work in this repository.",
      "description": "Find and prioritize technical debt across a repository using code, history, tests, dependencies, and operational evidence. Use for maintenance discovery; use tech-backlog-assessment to decide one supplied item.",
      "category": "Codebase Improvement",
      "tags": [
        "technical-debt",
        "modernization",
        "planning",
        "evidence"
      ],
      "primary_purpose": "Discover and prioritize technical debt using repository and operational evidence.",
      "use_when": [
        "The repository needs a bounded maintenance backlog with consequences and priority reasons."
      ],
      "avoid_when": [
        "One supplied item already needs an options decision. Use tech-backlog-assessment."
      ],
      "preferred_context": "Repository revision, scoped paths, history period, tests, dependencies, operations, and existing debt records.",
      "expected_outputs": [
        "Debt register",
        "Priority and confidence reasons",
        "Selected assessment candidates and coverage limits"
      ],
      "example_prompts": [
        "Find the highest-value maintenance work in this repository.",
        "Review code organization and dependencies for demonstrated maintenance costs."
      ],
      "related_skills": [
        "tech-backlog-assessment",
        "simplify",
        "crap-analysis",
        "retrofit"
      ],
      "workflow_membership": [
        "codebase-improvement"
      ],
      "documentation_completeness": {
        "status": "complete",
        "notes": "Canonical skill, metadata, template, command, and compatibility installer are present."
      },
      "recommended_changes": [],
      "source_path": "skills/tech-debt-discovery/SKILL.md",
      "source_url": "https://github.com/Ryan-Thurman/agent-toolbelt/blob/main/skills/tech-debt-discovery/SKILL.md"
    },
    {
      "id": "test-case-design",
      "display_name": "Test Case Design",
      "short_description": "Design prioritized, traceable QA test cases.",
      "default_prompt": "Use $test-case-design to design cases for this requirement.",
      "description": "Turn requirements, risks, or a code change into prioritized, executable QA test cases without writing tests. Use before test implementation, QA handoff, case planning, or to plan focused tests for a pull request. Use cover to write tests or find coverage gaps in code.",
      "category": "Testing & Verification",
      "tags": [
        "qa",
        "test-design",
        "requirements",
        "testing"
      ],
      "primary_purpose": "Design high-value test cases from behavior, requirements, risks, and edge conditions.",
      "use_when": [
        "A feature or fix needs a deliberate test strategy before tests are implemented.",
        "A pull request needs a focused test plan for the modules, callers, and risk areas it touches."
      ],
      "avoid_when": [
        "The needed regression test is obvious and can be added directly.",
        "The task is to write tests or find coverage gaps in code. Use cover."
      ],
      "preferred_context": "Requirements, acceptance criteria, a pull request diff, declared risk areas, state transitions, failure modes, and test harness.",
      "expected_outputs": [
        "Test matrix",
        "Boundary and negative cases",
        "Traceability to behavior"
      ],
      "example_prompts": [
        "Design the test cases for this feature, including edge and failure paths.",
        "Turn these acceptance criteria into a prioritized executable test matrix.",
        "Plan focused tests for this pull request, with the risk areas it touches first."
      ],
      "related_skills": [
        "cover",
        "webapp-testing",
        "story-refinement",
        "bdd-scenarios",
        "failure-scenario-design",
        "risk-area-mapping"
      ],
      "workflow_membership": [
        "feature-delivery",
        "security-sensitive-change",
        "feature-refinement",
        "risk-based-testing",
        "incident-follow-up",
        "idea-to-release"
      ],
      "documentation_completeness": {
        "status": "complete",
        "notes": "Canonical skill and agent metadata are present."
      },
      "recommended_changes": [],
      "source_path": "skills/test-case-design/SKILL.md",
      "source_url": "https://github.com/Ryan-Thurman/agent-toolbelt/blob/main/skills/test-case-design/SKILL.md"
    },
    {
      "id": "threat-model",
      "display_name": "Threat Model",
      "short_description": "Map design threats and security controls.",
      "default_prompt": "Use $threat-model to analyze this design before implementation.",
      "description": "Model assets, trust boundaries, attacker paths, mitigations, and verification before building a security-sensitive change. Use for design-time security analysis, not active testing. Use security-audit for implemented code.",
      "category": "Security & Risk",
      "tags": [
        "threat-model",
        "trust-boundary",
        "mitigations",
        "security"
      ],
      "primary_purpose": "Identify threats, trust boundaries, and mitigations for a security-sensitive design before it is built.",
      "use_when": [
        "A change handles credentials, personal data, privileged actions, network boundaries, or untrusted input."
      ],
      "avoid_when": [
        "The change has no meaningful security boundary or sensitive data flow, or the code is already built (use security-audit)."
      ],
      "preferred_context": "Architecture, assets, actors, data flows, trust boundaries, abuse cases, and mitigations.",
      "expected_outputs": [
        "Threat model",
        "Prioritized abuse cases",
        "Mitigation and verification plan"
      ],
      "example_prompts": [
        "Threat-model this feature, focusing on trust boundaries and abuse cases.",
        "Map sensitive data flows and propose mitigations before implementation."
      ],
      "related_skills": [
        "security-audit",
        "pr-review",
        "test-case-design",
        "system-design",
        "reliability-review"
      ],
      "workflow_membership": [
        "security-sensitive-change"
      ],
      "documentation_completeness": {
        "status": "complete",
        "notes": "Canonical skill and agent metadata are present."
      },
      "recommended_changes": [],
      "source_path": "skills/threat-model/SKILL.md",
      "source_url": "https://github.com/Ryan-Thurman/agent-toolbelt/blob/main/skills/threat-model/SKILL.md"
    },
    {
      "id": "ticket-discovery",
      "display_name": "Ticket Discovery",
      "short_description": "Investigate a narrow precedent-based implementation ticket and produce a handoff without editing code.",
      "default_prompt": "Investigate this implementation ticket.",
      "description": "Investigate a narrow implementation ticket that references an existing precedent. Compare source and target areas, and produce a gap analysis, test plan, and handoff without editing code. Use tech-backlog-assessment when the work itself is in question.",
      "category": "Discovery & Planning",
      "tags": [
        "ticket",
        "precedent",
        "gap-analysis",
        "planning"
      ],
      "primary_purpose": "Investigate a narrow ticket that names an existing precedent, and produce a gap analysis, test plan, and handoff.",
      "use_when": [
        "A probably valid ticket asks to copy or adapt a pattern that already exists in another area."
      ],
      "avoid_when": [
        "The issue already contains sufficient context, or the question is whether to do the work at all (use tech-backlog-assessment)."
      ],
      "preferred_context": "Ticket, repository history, related issues, code ownership, and current behavior.",
      "expected_outputs": [
        "Clarified ticket",
        "Related precedent",
        "Open questions and acceptance gaps"
      ],
      "example_prompts": [
        "Investigate this ticket and identify precedent, scope gaps, and next questions.",
        "Clarify this issue using repository history and related work."
      ],
      "related_skills": [
        "product-discovery",
        "shape-up",
        "tech-backlog-assessment"
      ],
      "workflow_membership": [
        "feature-delivery"
      ],
      "documentation_completeness": {
        "status": "complete",
        "notes": "Canonical skill and agent metadata are present."
      },
      "recommended_changes": [],
      "source_path": "skills/ticket-discovery/SKILL.md",
      "source_url": "https://github.com/Ryan-Thurman/agent-toolbelt/blob/main/skills/ticket-discovery/SKILL.md"
    },
    {
      "id": "ticket-sync",
      "display_name": "Ticket Sync",
      "short_description": "Publish sliced ticket files to GitHub Issues, Jira, or Azure Boards with confirmation gates.",
      "default_prompt": "Sync these ticket files to the tracker.",
      "description": "Publish approved ticket files to the repository's tracker: GitHub Issues, Jira, or Azure Boards. Use after shape-up slicing or a project-owned ticket workflow. Preview changes, preserve tracker keys, and write a manifest when offline.",
      "category": "Feature Delivery",
      "tags": [
        "ticket",
        "tracking",
        "synchronization",
        "automation"
      ],
      "primary_purpose": "Synchronize delivery status and evidence between implementation work and a tracking system.",
      "use_when": [
        "A project needs ticket state, links, or progress evidence kept aligned with repository work."
      ],
      "avoid_when": [
        "No external tracker is in scope or the source of truth is already local."
      ],
      "preferred_context": "Ticket identifiers, repository state, tracker policy, credentials boundary, and update rules.",
      "expected_outputs": [
        "Sync plan or updates",
        "Traceability links",
        "Conflict and ownership notes"
      ],
      "example_prompts": [
        "Plan the safe synchronization between this change and its delivery ticket.",
        "Reconcile repository progress with the tracker and report conflicts."
      ],
      "related_skills": [
        "ticket-discovery",
        "handoff",
        "phased-delivery"
      ],
      "workflow_membership": [
        "feature-refinement"
      ],
      "documentation_completeness": {
        "status": "complete",
        "notes": "Canonical skill and agent metadata are present."
      },
      "recommended_changes": [],
      "source_path": "skills/ticket-sync/SKILL.md",
      "source_url": "https://github.com/Ryan-Thurman/agent-toolbelt/blob/main/skills/ticket-sync/SKILL.md"
    },
    {
      "id": "use-effect-killer",
      "display_name": "useEffect Killer",
      "short_description": "Audit React effects against You Might Not Need an Effect.",
      "default_prompt": "Use $use-effect-killer to audit the useEffect calls in this change and propose idiomatic fixes.",
      "description": "Audit React useEffect calls against 13 anti-patterns from \"You Might Not Need an Effect\" and propose idiomatic fixes. Use when you audit, review, write, or clean up effects, or when the React rule scan lists this skill.",
      "category": "Codebase Improvement",
      "tags": [
        "react",
        "hooks",
        "useEffect",
        "react-frontend",
        "refactor"
      ],
      "primary_purpose": "Audit React useEffect calls against 13 anti-patterns and propose idiomatic fixes.",
      "use_when": [
        "A change adds or edits React effects, or a component uses effects to derive state, handle events, or sync props."
      ],
      "avoid_when": [
        "The code is not React, or the effect synchronizes with a real external system and has cleanup."
      ],
      "preferred_context": "Effect bodies, dependency arrays, owning components, React version, React Compiler setting, and data-fetching library.",
      "expected_outputs": [
        "Classification of every effect in scope",
        "Anti-pattern findings with concrete fixes",
        "List of legitimate effects"
      ],
      "example_prompts": [
        "Audit the useEffect calls in src/components.",
        "Check the effects in my branch changes and fix the anti-patterns."
      ],
      "related_skills": [
        "vercel-react-best-practices",
        "vercel-composition-patterns",
        "simplify",
        "pr-review"
      ],
      "workflow_membership": [
        "codebase-improvement"
      ],
      "documentation_completeness": {
        "status": "complete",
        "notes": "Canonical skill and agent metadata are present."
      },
      "recommended_changes": [],
      "source_path": "skills/use-effect-killer/SKILL.md",
      "source_url": "https://github.com/Ryan-Thurman/agent-toolbelt/blob/main/skills/use-effect-killer/SKILL.md"
    },
    {
      "id": "user-research-synthesis",
      "display_name": "User Research Synthesis",
      "short_description": "Connect customer themes to evidence and limits.",
      "default_prompt": "Use $user-research-synthesis to analyze this research and preserve counterexamples.",
      "description": "Synthesize interviews, surveys, usability notes, and customer feedback into evidence-linked themes and counterexamples. Use to understand supplied research before product decisions; use product-discovery to choose an opportunity.",
      "category": "Discovery & Planning",
      "tags": [
        "product",
        "research",
        "evidence",
        "planning"
      ],
      "primary_purpose": "Connect customer research to themes, counterexamples, and bounded product implications.",
      "use_when": [
        "Interviews, surveys, usability notes, or feedback need synthesis before a product decision."
      ],
      "avoid_when": [
        "The opportunity is already understood and only implementation planning remains."
      ],
      "preferred_context": "Research question, source IDs, dates, participant sample, and permitted evidence.",
      "expected_outputs": [
        "Evidence-linked themes",
        "Counterexamples and sample limits",
        "Open research questions"
      ],
      "example_prompts": [
        "Synthesize these interviews and preserve conflicting accounts.",
        "Find themes in this feedback without inventing population prevalence."
      ],
      "related_skills": [
        "product-discovery",
        "product-outcome-review",
        "shape-up"
      ],
      "workflow_membership": [
        "product-learning"
      ],
      "documentation_completeness": {
        "status": "complete",
        "notes": "Canonical skill, metadata, template, command, and compatibility installer are present."
      },
      "recommended_changes": [],
      "source_path": "skills/user-research-synthesis/SKILL.md",
      "source_url": "https://github.com/Ryan-Thurman/agent-toolbelt/blob/main/skills/user-research-synthesis/SKILL.md"
    },
    {
      "id": "vercel-composition-patterns",
      "display_name": "Vercel Composition Patterns",
      "short_description": "React composition patterns for maintainable component APIs.",
      "default_prompt": "Use $vercel-composition-patterns to review or design this React component API.",
      "description": "Apply React composition patterns when designing or reviewing component APIs, compound components, context, or boolean-prop-heavy components; verify React-version-specific rules before use.",
      "category": "Codebase Improvement",
      "tags": [
        "react",
        "composition",
        "api-design",
        "react-frontend",
        "refactor"
      ],
      "primary_purpose": "Apply maintainable component composition patterns to React and frontend code.",
      "use_when": [
        "A React component API has conditionals, duplication, or composition problems."
      ],
      "avoid_when": [
        "The repository is not using the relevant frontend patterns or the issue is unrelated to component design."
      ],
      "preferred_context": "Component tree, public API, state ownership, rendering behavior, and existing design conventions.",
      "expected_outputs": [
        "Composition recommendation",
        "Focused refactor",
        "Behavior-preservation checks"
      ],
      "example_prompts": [
        "Improve this React component API using composition patterns.",
        "Refactor this component to remove prop-driven branching while preserving behavior."
      ],
      "related_skills": [
        "vercel-react-best-practices",
        "use-effect-killer",
        "simplify",
        "code-quality-gate"
      ],
      "workflow_membership": [
        "codebase-improvement"
      ],
      "documentation_completeness": {
        "status": "complete",
        "notes": "Canonical skill and agent metadata are present."
      },
      "recommended_changes": [],
      "source_path": "skills/vercel-composition-patterns/SKILL.md",
      "source_url": "https://github.com/Ryan-Thurman/agent-toolbelt/blob/main/skills/vercel-composition-patterns/SKILL.md"
    },
    {
      "id": "vercel-react-best-practices",
      "display_name": "Vercel React Best Practices",
      "short_description": "Conditional React and Next.js performance guidance.",
      "default_prompt": "Use $vercel-react-best-practices to review this React or Next.js change for evidence-backed performance issues.",
      "description": "Review or improve React and Next.js performance when components, data fetching, bundles, rendering, or server/client boundaries change; verify framework and React versions first.",
      "category": "Codebase Improvement",
      "tags": [
        "react",
        "nextjs",
        "performance",
        "react-frontend"
      ],
      "primary_purpose": "Review React or Next.js implementation choices for performance and maintainability.",
      "use_when": [
        "A React or Next.js change needs targeted performance, rendering, data-fetching, or bundle guidance."
      ],
      "avoid_when": [
        "The codebase is not React/Next.js or the review concern is unrelated to frontend performance."
      ],
      "preferred_context": "Component and route structure, data flow, bundle behavior, rendering boundaries, and measurements.",
      "expected_outputs": [
        "Prioritized frontend findings",
        "Implementation recommendations",
        "Validation approach"
      ],
      "example_prompts": [
        "Review this Next.js change against practical performance best practices.",
        "Identify the highest-impact React rendering and data-fetching improvements here."
      ],
      "related_skills": [
        "vercel-composition-patterns",
        "use-effect-killer",
        "webapp-testing",
        "code-quality-gate",
        "vercel-react-native-skills",
        "vercel-react-view-transitions"
      ],
      "workflow_membership": [
        "codebase-improvement"
      ],
      "documentation_completeness": {
        "status": "complete",
        "notes": "Canonical skill and agent metadata are present."
      },
      "recommended_changes": [],
      "source_path": "skills/vercel-react-best-practices/SKILL.md",
      "source_url": "https://github.com/Ryan-Thurman/agent-toolbelt/blob/main/skills/vercel-react-best-practices/SKILL.md"
    },
    {
      "id": "vercel-react-native-skills",
      "display_name": "Vercel React Native Skills",
      "short_description": "React Native and Expo performance and UI rules.",
      "default_prompt": "Use $vercel-react-native-skills to review this React Native change for list, animation, and UI issues.",
      "description": "Review or improve React Native and Expo code when lists, animations, navigation, images, native UI, or monorepo native dependencies change; verify the React Native, Expo, and library versions first.",
      "category": "Codebase Improvement",
      "tags": [
        "react-native",
        "expo",
        "mobile",
        "performance",
        "react"
      ],
      "primary_purpose": "Apply React Native and Expo performance and native UI rules to mobile changes.",
      "use_when": [
        "A React Native or Expo change touches lists, animations, navigation, images, or native UI."
      ],
      "avoid_when": [
        "The repository is a web-only React app."
      ],
      "preferred_context": "React Native, Expo, and library versions, list and animation code, navigation setup, and the React Compiler setting.",
      "expected_outputs": [
        "Applied or not-applicable record for each listed rule",
        "Evidence-backed findings",
        "Focused fixes"
      ],
      "example_prompts": [
        "Review this React Native screen for list and animation performance.",
        "Check my Expo branch changes against the React Native rules."
      ],
      "related_skills": [
        "vercel-react-best-practices",
        "use-effect-killer",
        "pr-review",
        "simplify"
      ],
      "workflow_membership": [
        "codebase-improvement"
      ],
      "documentation_completeness": {
        "status": "complete",
        "notes": "Canonical skill and agent metadata are present."
      },
      "recommended_changes": [],
      "source_path": "skills/vercel-react-native-skills/SKILL.md",
      "source_url": "https://github.com/Ryan-Thurman/agent-toolbelt/blob/main/skills/vercel-react-native-skills/SKILL.md"
    },
    {
      "id": "vercel-react-view-transitions",
      "display_name": "Vercel React View Transitions",
      "short_description": "Native-feeling React View Transition animations.",
      "default_prompt": "Use $vercel-react-view-transitions to add view transitions to this React route change.",
      "description": "Add or review React View Transition animations (`<ViewTransition>`, `addTransitionType`, view transition CSS) for route changes, shared elements, list reorder, enter and exit, and Suspense reveals, including Next.js. Verify React 19.3 or Next.js App Router first.",
      "category": "Codebase Improvement",
      "tags": [
        "react",
        "animation",
        "view-transitions",
        "nextjs",
        "react-frontend"
      ],
      "primary_purpose": "Add or review React View Transition animations with correct placement, triggers, and reduced motion.",
      "use_when": [
        "A change adds route, shared-element, list, enter and exit, or Suspense animations with React View Transitions."
      ],
      "avoid_when": [
        "The React version does not support ViewTransition, or the repository uses a different animation library for this surface."
      ],
      "preferred_context": "React or Next.js version, routing setup, the components that change, and the global stylesheet.",
      "expected_outputs": [
        "View transition implementation",
        "Reduced-motion CSS",
        "Review findings for placement and triggers"
      ],
      "example_prompts": [
        "Add a shared element transition from the list to the detail page.",
        "Review the view transitions in this change."
      ],
      "related_skills": [
        "vercel-react-best-practices",
        "vercel-composition-patterns",
        "webapp-testing"
      ],
      "workflow_membership": [
        "codebase-improvement"
      ],
      "documentation_completeness": {
        "status": "complete",
        "notes": "Canonical skill and agent metadata are present."
      },
      "recommended_changes": [],
      "source_path": "skills/vercel-react-view-transitions/SKILL.md",
      "source_url": "https://github.com/Ryan-Thurman/agent-toolbelt/blob/main/skills/vercel-react-view-transitions/SKILL.md"
    },
    {
      "id": "vercel-web-interface-guidelines",
      "display_name": "Vercel Web Interface Guidelines",
      "short_description": "Review UI code against the Web Interface Guidelines.",
      "default_prompt": "Use $vercel-web-interface-guidelines to review the UI files in this change, or the app when no file changed.",
      "description": "Review web UI code against the Vercel Web Interface Guidelines for accessibility, focus, forms, animation, typography, layout, theming, and interaction. Use when you review or build UI, or when the React rule scan lists this skill.",
      "category": "Codebase Improvement",
      "tags": [
        "accessibility",
        "ui",
        "forms",
        "animation",
        "react-frontend"
      ],
      "primary_purpose": "Review web UI code against the Vercel Web Interface Guidelines with a pinned offline rule list.",
      "use_when": [
        "A change adds or edits UI components, styles, forms, or interactions."
      ],
      "avoid_when": [
        "The change has no user interface, or the repository has a stricter design or accessibility policy for the same rules."
      ],
      "preferred_context": "Changed components and styles, the design system, copy style, and accessibility policy.",
      "expected_outputs": [
        "file:line findings grouped by file",
        "Severity from the React acceptance contract",
        "Pass list for clean files"
      ],
      "example_prompts": [
        "Review the UI files in my branch against the web interface guidelines.",
        "Check src/components/forms for accessibility and form issues."
      ],
      "related_skills": [
        "webapp-testing",
        "vercel-react-best-practices",
        "vercel-react-view-transitions",
        "pr-review"
      ],
      "workflow_membership": [
        "codebase-improvement"
      ],
      "documentation_completeness": {
        "status": "complete",
        "notes": "Canonical skill and agent metadata are present."
      },
      "recommended_changes": [],
      "source_path": "skills/vercel-web-interface-guidelines/SKILL.md",
      "source_url": "https://github.com/Ryan-Thurman/agent-toolbelt/blob/main/skills/vercel-web-interface-guidelines/SKILL.md"
    },
    {
      "id": "webapp-testing",
      "display_name": "Webapp Testing",
      "short_description": "Verify browser and web application behavior with Playwright checks, screenshots, traces, and QA evidence.",
      "default_prompt": "Test this web application behavior in the browser.",
      "description": "Verify browser and web application behavior for user-facing changes. Use when planning or running Playwright/browser checks, smoke-testing a local app, debugging UI failures, capturing screenshots/traces, or producing QA evidence for feature delivery or PR review.",
      "category": "Testing & Verification",
      "tags": [
        "browser",
        "playwright",
        "qa",
        "testing",
        "react-frontend"
      ],
      "primary_purpose": "Exercise a web application through realistic browser flows and report observable failures.",
      "use_when": [
        "A web UI change needs end-to-end verification across navigation, interaction, state, or responsive behavior."
      ],
      "avoid_when": [
        "The change is purely backend or a unit test provides sufficient evidence."
      ],
      "preferred_context": "Running app, test account or fixture, target flows, browser tooling, and expected states.",
      "expected_outputs": [
        "Browser test or reproduction",
        "Screenshots/logs where useful",
        "Failure and verification report"
      ],
      "example_prompts": [
        "Test this web flow end to end and report any observable failures.",
        "Exercise the changed UI in a browser across the critical user paths."
      ],
      "related_skills": [
        "cover",
        "test-case-design",
        "bug-to-fix"
      ],
      "workflow_membership": [
        "feature-delivery",
        "bug-fixing"
      ],
      "documentation_completeness": {
        "status": "complete",
        "notes": "Canonical skill and agent metadata are present."
      },
      "recommended_changes": [],
      "source_path": "skills/webapp-testing/SKILL.md",
      "source_url": "https://github.com/Ryan-Thurman/agent-toolbelt/blob/main/skills/webapp-testing/SKILL.md"
    },
    {
      "id": "worktree",
      "display_name": "Worktree",
      "short_description": "Create, list, and remove isolated git worktrees for multi-agent shared repository work.",
      "default_prompt": "Create or manage an isolated worktree for this task.",
      "description": "Create, list, and remove isolated git worktrees for multi-agent shared repo directories. Use when several sessions need separate branches, or when a task wants an isolated checkout without disturbing the main tree.",
      "category": "Agent Operations",
      "tags": [
        "git",
        "isolation",
        "multi-agent",
        "automation"
      ],
      "primary_purpose": "Create and manage isolated Git worktrees for parallel or safely bounded work.",
      "use_when": [
        "Work needs repository isolation, parallel agents, or a disposable implementation directory."
      ],
      "avoid_when": [
        "The task is a tiny local edit and additional worktree state would add risk."
      ],
      "preferred_context": "Repository status, branch policy, worktree path, ownership, and cleanup expectations.",
      "expected_outputs": [
        "Isolated worktree",
        "Branch and ownership record",
        "Safe cleanup or handoff instructions"
      ],
      "example_prompts": [
        "Set up an isolated worktree for this implementation and record its ownership.",
        "Inspect active worktrees and prepare a safe workspace for the next agent."
      ],
      "related_skills": [
        "handoff",
        "phase-context-workflow"
      ],
      "workflow_membership": [],
      "documentation_completeness": {
        "status": "complete",
        "notes": "Canonical skill and agent metadata are present."
      },
      "recommended_changes": [],
      "source_path": "skills/worktree/SKILL.md",
      "source_url": "https://github.com/Ryan-Thurman/agent-toolbelt/blob/main/skills/worktree/SKILL.md"
    },
    {
      "id": "papercuts",
      "display_name": "Papercuts",
      "short_description": "Report the codebase friction that slowed the work, as a ranked fix table.",
      "default_prompt": "Report the papercuts from this work.",
      "description": "Report codebase friction that slowed a session or feature, such as stale docs, misleading names, duplicate config, or failing commands, as ranked fixes for a shared team log. Suggest it after work that friction slowed.",
      "category": "Agent Operations",
      "tags": [
        "retrospective",
        "friction",
        "documentation",
        "developer-experience"
      ],
      "primary_purpose": "Report the codebase friction that slowed a session or a feature as a ranked table of fixes for a shared team log.",
      "use_when": [
        "A task or a feature is complete and stale docs, misleading names, duplicates, or failing commands cost time.",
        "A team collects recurring friction in a shared log to decide which fixes to make first."
      ],
      "avoid_when": [
        "The work had no friction from the repository.",
        "The question is about the delivery process after a release. Use the delivery retrospective workflow."
      ],
      "preferred_context": "The session, and for a feature the phase plan, handoffs, PR review threads, CI runs, and branch commits.",
      "expected_outputs": [
        "Ranked papercut table with a fix file for each row",
        "Saved report for a shared log",
        "Repeat marks against earlier entries when posted"
      ],
      "example_prompts": [
        "What in this repo slowed you down? Run papercuts.",
        "Report the papercuts for feature/export-csv and post them to our papercuts issue."
      ],
      "related_skills": [
        "handoff",
        "style-guide-init",
        "ticket-sync"
      ],
      "workflow_membership": [],
      "documentation_completeness": {
        "status": "complete",
        "notes": "Canonical skill and agent metadata are present."
      },
      "recommended_changes": [],
      "source_path": "skills/papercuts/SKILL.md",
      "source_url": "https://github.com/Ryan-Thurman/agent-toolbelt/blob/main/skills/papercuts/SKILL.md"
    }
  ],
  "workflows": [
    {
      "id": "product-learning",
      "name": "Product decisions and learning",
      "purpose": "Connect research, opportunity decisions, experiments, and customer outcome evidence. Use only the stages needed for the decision.",
      "stages": [
        {
          "skill": "user-research-synthesis",
          "rationale": "Understand source evidence, counterexamples, and sample limits.",
          "example_invocation": "Synthesize this customer research.",
          "next_steps": [
            "product-discovery"
          ]
        },
        {
          "skill": "product-discovery",
          "rationale": "Choose an opportunity or experiment with measurement and decision conditions.",
          "example_invocation": "Compare these opportunities and define the next experiment.",
          "next_steps": [
            "shape-up",
            "product-outcome-review"
          ]
        },
        {
          "skill": "shape-up",
          "rationale": "Clarify selected implementation scope when a brief is needed.",
          "example_invocation": "Shape this selected opportunity into a brief.",
          "next_steps": [
            "phased-delivery"
          ]
        },
        {
          "skill": "phased-delivery",
          "rationale": "Deliver approved scope with acceptance evidence.",
          "example_invocation": "Deliver the approved brief in reviewable phases.",
          "next_steps": [
            "ship-it",
            "product-outcome-review"
          ]
        },
        {
          "skill": "ship-it",
          "rationale": "Assess immediate release readiness and health when a release is involved.",
          "example_invocation": "Prepare this change for release using project thresholds.",
          "next_steps": [
            "product-outcome-review"
          ]
        },
        {
          "skill": "product-outcome-review",
          "rationale": "Determine whether the original customer problem improved.",
          "example_invocation": "Review this experiment against its hypothesis and baseline.",
          "next_steps": [
            "product-discovery"
          ]
        }
      ]
    },
    {
      "id": "feature-delivery",
      "name": "Feature delivery",
      "purpose": "Move a bounded product or engineering idea from discovery through implementation, verification, review, and release readiness.",
      "stages": [
        {
          "skill": "product-discovery",
          "rationale": "Clarify the user problem and evidence before committing to a solution.",
          "example_invocation": "Explore this problem and produce a decision-ready brief.",
          "next_steps": [
            "shape-up"
          ]
        },
        {
          "skill": "shape-up",
          "rationale": "Bound appetite, solution direction, rabbit holes, and explicit exclusions.",
          "example_invocation": "Shape this brief into a bounded implementation scope.",
          "next_steps": [
            "story-refinement",
            "phased-delivery"
          ]
        },
        {
          "skill": "story-refinement",
          "rationale": "Resolve open questions and write testable criteria with failure paths before planning.",
          "example_invocation": "Refine this story and tell me whether it is ready.",
          "next_steps": [
            "bdd-scenarios",
            "phased-delivery"
          ]
        },
        {
          "skill": "bdd-scenarios",
          "rationale": "Write the acceptance criteria as feature files that each phase turns from red to green.",
          "example_invocation": "Write the feature files for this refined story.",
          "next_steps": [
            "phased-delivery"
          ]
        },
        {
          "skill": "phased-delivery",
          "rationale": "Implement approved behavior test-first in reviewable phases, one PR per phase or ticket.",
          "example_invocation": "Deliver these approved tickets with failing tests, minimal implementation, and passing tests.",
          "next_steps": [
            "pr-review"
          ]
        },
        {
          "skill": "code-quality-gate",
          "rationale": "Check implementation quality, risks, and readiness using repository evidence.",
          "example_invocation": "Run the quality gate on this feature branch.",
          "next_steps": [
            "pr-review"
          ]
        },
        {
          "skill": "pr-review",
          "rationale": "Perform an independent review before release work.",
          "example_invocation": "Review this feature diff for correctness and regressions.",
          "next_steps": [
            "ship-it"
          ]
        },
        {
          "skill": "ship-it",
          "rationale": "Prepare rollout, monitoring, rollback, and post-release verification.",
          "example_invocation": "Prepare this change for a safe release.",
          "next_steps": [
            "handoff"
          ]
        }
      ]
    },
    {
      "id": "feature-refinement",
      "name": "Feature refinement",
      "purpose": "Turn a ticket or brief into a ready-to-build spec with fewer refinement rounds. Use only the stages that the item needs.",
      "stages": [
        {
          "skill": "shape-up",
          "rationale": "Shape a vague idea into an approved brief and slices before story refinement.",
          "example_invocation": "Shape this idea into a brief and tickets.",
          "next_steps": [
            "story-refinement"
          ]
        },
        {
          "skill": "story-refinement",
          "rationale": "Scan for ambiguity, batch owner questions with defaults, and write Given/When/Then criteria with failure paths.",
          "example_invocation": "Prepare PROJ-123 for refinement.",
          "next_steps": [
            "bdd-scenarios",
            "test-case-design",
            "ticket-sync",
            "phased-delivery"
          ]
        },
        {
          "skill": "test-case-design",
          "rationale": "Turn the criteria, negative families, and reliability answers into prioritized cases at the right test level.",
          "example_invocation": "Design the test cases for this refined story.",
          "next_steps": [
            "bdd-scenarios",
            "phased-delivery"
          ]
        },
        {
          "skill": "bdd-scenarios",
          "rationale": "Write the acceptance criteria as feature files that each phase turns from red to green.",
          "example_invocation": "Write the feature files for this refined story.",
          "next_steps": [
            "phased-delivery"
          ]
        },
        {
          "skill": "ticket-sync",
          "rationale": "Publish the approved story changes to the tracker.",
          "example_invocation": "Sync the refined story to Jira.",
          "next_steps": [
            "phased-delivery"
          ]
        },
        {
          "skill": "phased-delivery",
          "rationale": "Plan the ready story as test-first phases.",
          "example_invocation": "Plan this refined story.",
          "next_steps": [
            "code-quality-gate"
          ]
        }
      ]
    },
    {
      "id": "risk-based-testing",
      "name": "Risk-based testing",
      "purpose": "Map the paths where a defect has high impact, then give each pull request a focused test plan and a deeper review on those paths.",
      "stages": [
        {
          "skill": "risk-area-mapping",
          "rationale": "Draft risk areas from code, history, ownership, and the workspace map. A person approves each entry before it is applied.",
          "example_invocation": "Sweep the repos in this folder for risk areas with the workspace map.",
          "next_steps": [
            "test-case-design",
            "pr-review"
          ]
        },
        {
          "skill": "test-case-design",
          "rationale": "Plan focused cases for a pull request. Cases in a matched risk area get high impact.",
          "example_invocation": "Plan focused tests for PR 123.",
          "next_steps": [
            "cover",
            "webapp-testing",
            "pr-review"
          ]
        },
        {
          "skill": "pr-review",
          "rationale": "Review the pull request with the risk-area tier floor and a lower threshold on matched paths.",
          "example_invocation": "Review PR 123.",
          "next_steps": [
            "pr-improve",
            "pr-review-reply"
          ]
        }
      ]
    },
    {
      "id": "bug-fixing",
      "name": "Bug fixing",
      "purpose": "Move a concrete defect from reproduction through diagnosis, regression coverage, review, and release.",
      "stages": [
        {
          "skill": "bug-to-fix",
          "rationale": "Establish a reproducible failure and smallest defensible fix.",
          "example_invocation": "Reproduce this bug, find its root cause, and fix it.",
          "next_steps": [
            "cover"
          ]
        },
        {
          "skill": "cover",
          "rationale": "Prevent recurrence with focused behavior-level coverage.",
          "example_invocation": "Add regression coverage for this failure.",
          "next_steps": [
            "webapp-testing",
            "code-quality-gate"
          ]
        },
        {
          "skill": "webapp-testing",
          "rationale": "Exercise user-visible flows when the defect crosses the browser boundary.",
          "example_invocation": "Verify the fixed browser flow end to end.",
          "next_steps": [
            "code-quality-gate"
          ]
        },
        {
          "skill": "code-quality-gate",
          "rationale": "Confirm the fix is scoped, maintainable, and sufficiently verified.",
          "example_invocation": "Run the quality gate for this bug fix.",
          "next_steps": [
            "pr-review"
          ]
        },
        {
          "skill": "pr-review",
          "rationale": "Check for regressions or unintended behavior before shipping.",
          "example_invocation": "Review the bug-fix diff and regression test.",
          "next_steps": [
            "ship-it"
          ]
        }
      ]
    },
    {
      "id": "pr-review",
      "name": "Pull request review",
      "purpose": "Review, improve, and close feedback on a pull request with explicit evidence and communication.",
      "stages": [
        {
          "skill": "pr-review",
          "rationale": "Find correctness, regression, maintainability, and risk issues independently.",
          "example_invocation": "Review this PR and prioritize actionable findings.",
          "next_steps": [
            "pr-improve",
            "pr-review-reply"
          ]
        },
        {
          "skill": "pr-improve",
          "rationale": "Implement accepted findings and verify the changes.",
          "example_invocation": "Apply the actionable findings and rerun checks.",
          "next_steps": [
            "phase-gate"
          ]
        },
        {
          "skill": "phase-gate",
          "rationale": "Confirm review corrections and evidence are complete before closeout.",
          "example_invocation": "Run the review phase gate.",
          "next_steps": [
            "pr-review-reply"
          ]
        },
        {
          "skill": "pr-review-reply",
          "rationale": "Reply to each thread with evidence or a clear disposition.",
          "example_invocation": "Draft replies for all open review threads.",
          "next_steps": [
            "handoff"
          ]
        }
      ]
    },
    {
      "id": "codebase-improvement",
      "name": "Technical health and modernization",
      "purpose": "Discover maintenance costs, assess selected items, and verify authorized improvements against their baseline.",
      "stages": [
        {
          "skill": "tech-debt-discovery",
          "rationale": "Find demonstrated maintenance costs and report scoped evidence.",
          "example_invocation": "Find and prioritize debt in this repository.",
          "next_steps": [
            "tech-backlog-assessment"
          ]
        },
        {
          "skill": "tech-backlog-assessment",
          "rationale": "Decide whether a selected item warrants implementation or further evidence.",
          "example_invocation": "Assess this selected debt item and its alternatives.",
          "next_steps": [
            "simplify",
            "retrofit",
            "phased-delivery",
            "ticket-discovery",
            "cover"
          ]
        },
        {
          "skill": "crap-analysis",
          "rationale": "Use complexity and coverage signals to choose high-value targets.",
          "example_invocation": "Find the riskiest complexity and coverage hotspots.",
          "next_steps": [
            "simplify",
            "retrofit"
          ]
        },
        {
          "skill": "simplify",
          "rationale": "Remove unnecessary complexity within a narrow behavior boundary.",
          "example_invocation": "Simplify this module without changing behavior.",
          "next_steps": [
            "retrofit",
            "cover"
          ]
        },
        {
          "skill": "retrofit",
          "rationale": "Handle migrations and compatibility changes incrementally.",
          "example_invocation": "Plan and execute this repository retrofit safely.",
          "next_steps": [
            "cover",
            "code-quality-gate"
          ]
        },
        {
          "skill": "cover",
          "rationale": "Protect behavior while structural changes land.",
          "example_invocation": "Add coverage for the refactored behavior.",
          "next_steps": [
            "code-quality-gate"
          ]
        },
        {
          "skill": "code-quality-gate",
          "rationale": "Confirm the improvement reduced risk without introducing regressions.",
          "example_invocation": "Run the quality gate on this refactor.",
          "next_steps": [
            "pr-review"
          ]
        }
      ]
    },
    {
      "id": "security-sensitive-change",
      "name": "System design, security, and reliability",
      "purpose": "Document architecture, review attack paths and failure modes, and connect security and reliability requirements to implementation evidence.",
      "stages": [
        {
          "skill": "system-design",
          "rationale": "Create the design record and linked threat review before implementation.",
          "example_invocation": "Document this system and its attack paths.",
          "next_steps": [
            "threat-model",
            "reliability-review"
          ]
        },
        {
          "skill": "threat-model",
          "rationale": "Identify assets, trust boundaries, abuse cases, and mitigations before coding.",
          "example_invocation": "Threat-model this feature and its data flows.",
          "next_steps": [
            "test-case-design",
            "security-audit"
          ]
        },
        {
          "skill": "reliability-review",
          "rationale": "Find failure modes, SLO and observability gaps, and recovery needs, and write testable reliability requirements.",
          "example_invocation": "Run a reliability review on this design.",
          "next_steps": [
            "failure-scenario-design",
            "phased-delivery"
          ]
        },
        {
          "skill": "failure-scenario-design",
          "rationale": "Turn testable reliability risks into scenario cards, Given/When/Then forms, and staging experiment plans.",
          "example_invocation": "Write failure scenarios for these reliability risks.",
          "next_steps": [
            "phased-delivery",
            "test-case-design",
            "cover"
          ]
        },
        {
          "skill": "phased-delivery",
          "rationale": "Plan accepted requirements and preserve threat-to-verification links.",
          "example_invocation": "Plan the accepted design and security requirements.",
          "next_steps": [
            "test-case-design",
            "cover",
            "security-audit"
          ]
        },
        {
          "skill": "test-case-design",
          "rationale": "Turn threats and requirements into negative, boundary, and regression cases.",
          "example_invocation": "Design security-focused test cases for this change.",
          "next_steps": [
            "cover"
          ]
        },
        {
          "skill": "cover",
          "rationale": "Make critical protections executable and regression-resistant.",
          "example_invocation": "Implement tests for the security invariants.",
          "next_steps": [
            "security-audit"
          ]
        },
        {
          "skill": "security-audit",
          "rationale": "Inspect the resulting implementation and configuration for exploitable gaps.",
          "example_invocation": "Audit this security-sensitive diff and prioritize findings.",
          "next_steps": [
            "code-quality-gate"
          ]
        },
        {
          "skill": "code-quality-gate",
          "rationale": "Check evidence, maintainability, and release readiness across the risk boundary.",
          "example_invocation": "Run the quality gate with security risks in scope.",
          "next_steps": [
            "pr-review"
          ]
        },
        {
          "skill": "pr-review",
          "rationale": "Provide independent final review of correctness and residual risk.",
          "example_invocation": "Review this security-sensitive PR for residual risk.",
          "next_steps": [
            "ship-it"
          ]
        }
      ]
    },
    {
      "id": "production-readiness",
      "name": "Production readiness",
      "purpose": "Check a built service against its reliability requirements with evidence, plan the staging experiments that the evidence still needs, and release with rollback triggers.",
      "stages": [
        {
          "skill": "reliability-review",
          "rationale": "Run readiness mode. Mark each reliability requirement Verified, Failed, or Not verified from the SLO, alerts, runbooks, capacity, and restore evidence.",
          "example_invocation": "Is this service ready for production? Check it against its reliability requirements.",
          "next_steps": [
            "failure-scenario-design",
            "ship-it"
          ]
        },
        {
          "skill": "failure-scenario-design",
          "rationale": "Plan staging experiments and game days for the requirements that need platform evidence. Each plan has abort conditions, rollback, and no-go checks. The team that owns the chaos tooling runs it.",
          "example_invocation": "Plan staging experiments for the requirements that are not verified.",
          "next_steps": [
            "reliability-review",
            "ship-it"
          ]
        },
        {
          "skill": "ship-it",
          "rationale": "Check release readiness, including the reliability section, and set SLO burn-rate rollback triggers for the rollout.",
          "example_invocation": "Prepare this release and set the rollback triggers.",
          "next_steps": [
            "product-outcome-review",
            "handoff"
          ]
        }
      ]
    },
    {
      "id": "incident-follow-up",
      "name": "Incident follow-up",
      "purpose": "After an incident is mitigated, fix the root cause with a regression test, record the failure mode, and add the tests that prove the system now detects and recovers from it.",
      "stages": [
        {
          "skill": "bug-to-fix",
          "rationale": "Reproduce the defect behind the incident, find the root cause, and fix it after a failing regression test. Mitigate a live incident before this stage.",
          "example_invocation": "Find the root cause of last night's checkout outage and fix it.",
          "next_steps": [
            "reliability-review",
            "pr-review"
          ]
        },
        {
          "skill": "reliability-review",
          "rationale": "Add the failure mode to the register. Record the missing detection, recovery, or SLO coverage as testable requirements.",
          "example_invocation": "Update the reliability review with this incident's failure mode.",
          "next_steps": [
            "failure-scenario-design"
          ]
        },
        {
          "skill": "failure-scenario-design",
          "rationale": "Turn the failure mode into scenario cards at the lowest level that proves the fix and the recovery.",
          "example_invocation": "Write failure scenarios for the incident's failure mode.",
          "next_steps": [
            "test-case-design",
            "bdd-scenarios"
          ]
        },
        {
          "skill": "test-case-design",
          "rationale": "Plan regression and failure cases for the fix and the code next to it.",
          "example_invocation": "Plan test cases for the incident fix in PR 123.",
          "next_steps": [
            "cover"
          ]
        },
        {
          "skill": "cover",
          "rationale": "Pin the fixed behavior and the neighboring paths.",
          "example_invocation": "Write the planned tests for the incident fix.",
          "next_steps": [
            "pr-review"
          ]
        }
      ]
    },
    {
      "id": "idea-to-release",
      "name": "Idea to release",
      "purpose": "Take one feature from a raw idea to a released, accepted change through seven gated stages. Agents draft and check. People own each decision and approval.",
      "stages": [
        {
          "skill": "product-discovery",
          "rationale": "Stage 1, Define: frame the problem, the outcome, and the evidence. Stay cheap: no repository scan.",
          "example_invocation": "Decide whether this idea is worth building.",
          "next_steps": [
            "shape-up"
          ]
        },
        {
          "skill": "shape-up",
          "rationale": "Stages 1 to 3: shape the brief, compare it with current behavior, and slice it into draft tickets.",
          "example_invocation": "Shape this idea into a brief, then slice it into tickets.",
          "next_steps": [
            "system-design",
            "story-refinement"
          ]
        },
        {
          "skill": "system-design",
          "rationale": "Stage 2, Feature refine: design the change at the depth that its risk needs, with threat and reliability reviews.",
          "example_invocation": "Design this feature at the Standard level.",
          "next_steps": [
            "test-case-design"
          ]
        },
        {
          "skill": "test-case-design",
          "rationale": "Stage 2: the QA lead owns test cases before development. Gate 2 waits for them.",
          "example_invocation": "Design the test cases for this brief before development starts.",
          "next_steps": [
            "story-refinement"
          ]
        },
        {
          "skill": "story-refinement",
          "rationale": "Stage 4: write Given/When/Then criteria with failure paths and get the product, developer, and QA review.",
          "example_invocation": "Prepare each story for refinement and give the readiness verdict.",
          "next_steps": [
            "bdd-scenarios",
            "phased-delivery"
          ]
        },
        {
          "skill": "bdd-scenarios",
          "rationale": "Stage 4: turn the criteria into feature files that delivery turns from red to green.",
          "example_invocation": "Write the feature files for these refined stories.",
          "next_steps": [
            "phased-delivery"
          ]
        },
        {
          "skill": "phased-delivery",
          "rationale": "Stages 5 and 6: propose an order, then write the just-in-time plan and deliver one ticket test-first after a person approves the plan.",
          "example_invocation": "Plan this ticket from the current code and stop for plan approval.",
          "next_steps": [
            "pr-review"
          ]
        },
        {
          "skill": "pr-review",
          "rationale": "Stage 6: a separate review agent pre-reviews each pull request. People still verify before close.",
          "example_invocation": "Review this pull request against its ticket.",
          "next_steps": [
            "ship-it"
          ]
        },
        {
          "skill": "ship-it",
          "rationale": "Stage 7: check release readiness and rollback triggers.",
          "example_invocation": "Prepare this release.",
          "next_steps": [
            "product-outcome-review"
          ]
        },
        {
          "skill": "product-outcome-review",
          "rationale": "Stage 7: check the outcome after release, then run papercuts and the delivery retrospective.",
          "example_invocation": "Did this release move the outcome that the brief named?",
          "next_steps": []
        }
      ]
    }
  ],
  "use_cases": [
    {
      "slug": "arch-answer-an-architecture-question",
      "title": "Answer an architecture question",
      "summary": "This page is for a developer or architect with one focused architecture question about an existing codebase. You get a direct answer with its evidence and the alternatives that the code rules out. You also get a list of decisions that only the owner can make. To design a whole feature, use [Design a new capability](arch-design-a-new-capability.md) instead.",
      "group": "Architecture, SRE, and security",
      "roles": "Developer, architect",
      "skills": [
        "system-design"
      ],
      "source_path": "wiki/use-cases/arch-answer-an-architecture-question.md",
      "source_url": "https://github.com/Ryan-Thurman/agent-toolbelt/blob/main/wiki/use-cases/arch-answer-an-architecture-question.md"
    },
    {
      "slug": "arch-design-a-new-capability",
      "title": "Design a new capability before you build it",
      "summary": "This page is for an architect or senior developer who must design a new capability in an existing codebase. You get a design document with diagrams and recorded decisions, a threat review, and a reliability review. A verdict, such as `Needs decision`, says whether the design can go to planning.",
      "group": "Architecture, SRE, and security",
      "roles": "Architect or senior developer",
      "skills": [
        "system-design",
        "threat-model",
        "reliability-review"
      ],
      "source_path": "wiki/use-cases/arch-design-a-new-capability.md",
      "source_url": "https://github.com/Ryan-Thurman/agent-toolbelt/blob/main/wiki/use-cases/arch-design-a-new-capability.md"
    },
    {
      "slug": "arch-right-size-a-plan",
      "title": "Right-size a plan that looks over-built",
      "summary": "This page is for a tech lead who suspects that a delivery plan builds more than the requirements need. You get a list of the parts that have no ground and a revised plan with fewer parts. Each deferred part has a trigger that tells you when to add it back.",
      "group": "Architecture, SRE, and security",
      "roles": "Tech lead",
      "skills": [
        "phased-delivery"
      ],
      "source_path": "wiki/use-cases/arch-right-size-a-plan.md",
      "source_url": "https://github.com/Ryan-Thurman/agent-toolbelt/blob/main/wiki/use-cases/arch-right-size-a-plan.md"
    },
    {
      "slug": "dev-answer-review-comments",
      "title": "Answer review comments on your pull request",
      "summary": "This page is for a developer whose pull request has open reviewer comments. You fix the comments that you accept, with tests and a record of each decision. Then you get a drafted answer for every comment, and the draft cites the code that changed.",
      "group": "Developer",
      "roles": "Developer",
      "skills": [
        "pr-improve",
        "pr-review-reply"
      ],
      "source_path": "wiki/use-cases/dev-answer-review-comments.md",
      "source_url": "https://github.com/Ryan-Thurman/agent-toolbelt/blob/main/wiki/use-cases/dev-answer-review-comments.md"
    },
    {
      "slug": "dev-clean-up-after-a-feature",
      "title": "Clean up a feature before you open the pull request",
      "summary": "This page is for a developer whose feature works but whose diff is messy, for example with copied code blocks. You get a ranked list of smells, one behavior-preserving cleanup that you selected, and a check that the cleanup changed no behavior.",
      "group": "Developer",
      "roles": "Developer",
      "skills": [
        "simplify"
      ],
      "source_path": "wiki/use-cases/dev-clean-up-after-a-feature.md",
      "source_url": "https://github.com/Ryan-Thurman/agent-toolbelt/blob/main/wiki/use-cases/dev-clean-up-after-a-feature.md"
    },
    {
      "slug": "dev-copy-a-pattern-to-a-new-area",
      "title": "Copy a pattern to a new area",
      "summary": "This page is for a developer whose ticket says \"do it like the existing feature\". You get a brief that maps the existing feature (the precedent) onto the new area, lists the gaps, and names the open questions. The agent edits no code in its main work. The optional check in step 5 writes a throwaway test file. The skill now rules on this: a probe runs outside the tracked files, and the brief records its status. This run predates that rule.",
      "group": "Developer",
      "roles": "Developer",
      "skills": [
        "ticket-discovery"
      ],
      "source_path": "wiki/use-cases/dev-copy-a-pattern-to-a-new-area.md",
      "source_url": "https://github.com/Ryan-Thurman/agent-toolbelt/blob/main/wiki/use-cases/dev-copy-a-pattern-to-a-new-area.md"
    },
    {
      "slug": "dev-deliver-a-ticket-as-phased-prs",
      "title": "Deliver an approved ticket as phased pull requests",
      "summary": "This page is for a developer who has an approved ticket and must ship it as reviewable pull requests (PRs). You get a plan with one PR for each phase and a readiness verdict. You also get phase 1 built test-first on its own branch, with a review that lists what no test proved.",
      "group": "Developer",
      "roles": "Developer",
      "skills": [
        "phased-delivery"
      ],
      "source_path": "wiki/use-cases/dev-deliver-a-ticket-as-phased-prs.md",
      "source_url": "https://github.com/Ryan-Thurman/agent-toolbelt/blob/main/wiki/use-cases/dev-deliver-a-ticket-as-phased-prs.md"
    },
    {
      "slug": "dev-fix-a-reported-bug",
      "title": "Fix a reported bug with a failing test first",
      "summary": "This page is for a developer who gets a bug report with steps and must fix it with proof. You get a written root cause and a failing test (red) that turns passing (green). You also get a fix with no extra lines and a record that another person can resume.",
      "group": "Developer",
      "roles": "Developer",
      "skills": [
        "bug-to-fix",
        "cover"
      ],
      "source_path": "wiki/use-cases/dev-fix-a-reported-bug.md",
      "source_url": "https://github.com/Ryan-Thurman/agent-toolbelt/blob/main/wiki/use-cases/dev-fix-a-reported-bug.md"
    },
    {
      "slug": "dev-refactor-a-risky-function",
      "title": "Refactor the riskiest function in a codebase",
      "summary": "This page is for a developer who must change a function with high complexity and low test coverage. You find the riskiest function by score, add tests that pin its behavior, and read the new score. The skill ships no scorer, so the repository must supply a command that scores each function.",
      "group": "Developer",
      "roles": "Developer",
      "skills": [
        "crap-analysis",
        "cover"
      ],
      "source_path": "wiki/use-cases/dev-refactor-a-risky-function.md",
      "source_url": "https://github.com/Ryan-Thurman/agent-toolbelt/blob/main/wiki/use-cases/dev-refactor-a-risky-function.md"
    },
    {
      "slug": "dev-run-agents-in-parallel",
      "title": "Run two agents in one repository at the same time",
      "summary": "This page is for a developer who wants two agents to work in one repository at the same time. You get one separate folder and one branch for each agent, a way to see the state of both, and a clean way to remove them.",
      "group": "Developer",
      "roles": "Developer",
      "skills": [
        "worktree"
      ],
      "source_path": "wiki/use-cases/dev-run-agents-in-parallel.md",
      "source_url": "https://github.com/Ryan-Thurman/agent-toolbelt/blob/main/wiki/use-cases/dev-run-agents-in-parallel.md"
    },
    {
      "slug": "dev-self-review-before-a-pr",
      "title": "Check a branch before you open a pull request",
      "summary": "This page is for a developer who has a finished branch and wants to find problems before a reviewer does. You get a local review report with a verdict, a list of findings and open questions, and a readiness verdict. Nothing is posted anywhere. If your PR is already open, use `/pr-review` instead (see Decision points).",
      "group": "Developer",
      "roles": "Developer",
      "skills": [
        "pr-review"
      ],
      "source_path": "wiki/use-cases/dev-self-review-before-a-pr.md",
      "source_url": "https://github.com/Ryan-Thurman/agent-toolbelt/blob/main/wiki/use-cases/dev-self-review-before-a-pr.md"
    },
    {
      "slug": "dev-survive-a-context-reset",
      "title": "Survive a context reset in the middle of a task",
      "summary": "This page is for a developer whose task is too long for one agent session. You get phase files, a handoff, and a context packet (a short file that gives a fresh session the goal, git state, and next action). They sit in the repository, and a fresh session continues from them, not from chat history. For a task that fits one session, use `/handoff` alone.",
      "group": "Developer",
      "roles": "Developer",
      "skills": [
        "phase-context-workflow",
        "handoff"
      ],
      "source_path": "wiki/use-cases/dev-survive-a-context-reset.md",
      "source_url": "https://github.com/Ryan-Thurman/agent-toolbelt/blob/main/wiki/use-cases/dev-survive-a-context-reset.md"
    },
    {
      "slug": "dev-swap-a-library-everywhere",
      "title": "Swap a library at every call site",
      "summary": "This page is for a developer who must replace one library or API at every call site and keep the build working. You get a site list that two searches confirm, a plan in slices, and the first slice applied with tests.",
      "group": "Developer",
      "roles": "Developer",
      "skills": [
        "retrofit"
      ],
      "source_path": "wiki/use-cases/dev-swap-a-library-everywhere.md",
      "source_url": "https://github.com/Ryan-Thurman/agent-toolbelt/blob/main/wiki/use-cases/dev-swap-a-library-everywhere.md"
    },
    {
      "slug": "journey-bug-report-to-regression-test",
      "title": "Take a bug from report to a locked regression test",
      "summary": "This page is for a developer and a QA engineer who share one bug. It takes the bug from the first report to a branch that is ready for review. You get a fix with a regression test (a test that fails when the bug returns). You also get a QA case list for the change and a readiness verdict. Each stage links to the use-case page that shows it in detail.",
      "group": "End-to-end journeys",
      "roles": "Developer, QA engineer",
      "skills": [
        "bug-to-fix",
        "test-case-design",
        "cover",
        "pr-review"
      ],
      "source_path": "wiki/use-cases/journey-bug-report-to-regression-test.md",
      "source_url": "https://github.com/Ryan-Thurman/agent-toolbelt/blob/main/wiki/use-cases/journey-bug-report-to-regression-test.md"
    },
    {
      "slug": "journey-idea-to-release",
      "title": "From an idea to an accepted release",
      "summary": "This page is for a team lead or product owner who plans one feature from idea to an accepted release with agents and people. It maps the seven stages of the idea-to-release workflow to nine earlier runs and shows why no gate reaches `Ready`. No run released the feature. You get the use-case page for each stage, the gate verdict that the evidence supports, and the approvals that stay with people.",
      "group": "End-to-end journeys",
      "roles": "Product owner, team lead, QA lead, developers. Each stage names its own owner.",
      "skills": [
        "product-discovery",
        "shape-up",
        "system-design",
        "test-case-design",
        "story-refinement",
        "bdd-scenarios",
        "phased-delivery",
        "pr-review",
        "ship-it",
        "product-outcome-review",
        "papercuts"
      ],
      "source_path": "wiki/use-cases/journey-idea-to-release.md",
      "source_url": "https://github.com/Ryan-Thurman/agent-toolbelt/blob/main/wiki/use-cases/journey-idea-to-release.md"
    },
    {
      "slug": "journey-incident-to-prevention",
      "title": "From an incident to prevention",
      "summary": "This page is for an SRE and a tech lead after an incident that they have mitigated. You get a fix with a regression test and a register of the failure modes that the incident showed (a table of what can fail and what detects each). You also get test plans for the gaps and a readiness check that shows which gaps are still open. Each stage links to the use-case page that shows it in detail.",
      "group": "End-to-end journeys",
      "roles": "SRE, tech lead, with a developer for the fix and QA for the tests",
      "skills": [
        "bug-to-fix",
        "reliability-review",
        "failure-scenario-design",
        "test-case-design",
        "cover",
        "pr-review",
        "ship-it"
      ],
      "source_path": "wiki/use-cases/journey-incident-to-prevention.md",
      "source_url": "https://github.com/Ryan-Thurman/agent-toolbelt/blob/main/wiki/use-cases/journey-incident-to-prevention.md"
    },
    {
      "slug": "journey-modernize-a-legacy-area",
      "title": "Pay down the debt in an old area of the code",
      "summary": "This page is for a tech lead who must pay down debt in one old area and keep its behavior. You leave with an updated debt register, tests that pin the code, one cleanup, and one gate status. Each stage links to the use case that shows it.",
      "group": "End-to-end journeys",
      "roles": "Tech lead, with a developer for the code stages and a QA lead for the coverage stage",
      "skills": [
        "tech-debt-discovery",
        "tech-backlog-assessment",
        "cover",
        "crap-analysis",
        "simplify",
        "retrofit",
        "code-quality-gate"
      ],
      "source_path": "wiki/use-cases/journey-modernize-a-legacy-area.md",
      "source_url": "https://github.com/Ryan-Thurman/agent-toolbelt/blob/main/wiki/use-cases/journey-modernize-a-legacy-area.md"
    },
    {
      "slug": "lead-choose-tech-debt-to-pay",
      "title": "Choose which technical debt to pay in the next sprint",
      "summary": "This page is for a tech lead who must choose which technical debt goes into the next sprint. You get a ranked debt register with evidence for each item. You also get a Do, Defer, Reject, or Spike decision for the top item, with a test plan.",
      "group": "Tech lead",
      "roles": "Tech lead",
      "skills": [
        "tech-debt-discovery",
        "tech-backlog-assessment"
      ],
      "source_path": "wiki/use-cases/lead-choose-tech-debt-to-pay.md",
      "source_url": "https://github.com/Ryan-Thurman/agent-toolbelt/blob/main/wiki/use-cases/lead-choose-tech-debt-to-pay.md"
    },
    {
      "slug": "lead-decide-one-backlog-item",
      "title": "Decide one technical backlog item",
      "summary": "This page is for a tech lead who must decide one backlog item, such as a major dependency upgrade. You get one verdict (`Do`, `Defer`, `Reject`, or `Spike`) with the evidence, the options, the risks, and the next command. For a dependency upgrade, the report also lists version changes that touch your code.",
      "group": "Tech lead",
      "roles": "Tech lead",
      "skills": [
        "tech-backlog-assessment"
      ],
      "source_path": "wiki/use-cases/lead-decide-one-backlog-item.md",
      "source_url": "https://github.com/Ryan-Thurman/agent-toolbelt/blob/main/wiki/use-cases/lead-decide-one-backlog-item.md"
    },
    {
      "slug": "lead-prepare-a-release",
      "title": "Prepare a release and decide go or no-go",
      "summary": "This page is for a tech lead who must decide go or no-go for a release after a change is merged. You get a release package with a GO or NO-GO verdict and its blocking gaps, a rollback plan, a release-notes draft, and a rollout and monitor plan. Use it after the merge. For a change before the pull request, use the pre-PR gate ([`/pr-ready-check`](ops-enforce-a-pre-pr-gate.md)). For a new service, use the [production readiness review](sre-run-a-production-readiness-review.md).",
      "group": "Tech lead",
      "roles": "Tech lead",
      "skills": [
        "ship-it"
      ],
      "source_path": "wiki/use-cases/lead-prepare-a-release.md",
      "source_url": "https://github.com/Ryan-Thurman/agent-toolbelt/blob/main/wiki/use-cases/lead-prepare-a-release.md"
    },
    {
      "slug": "lead-run-a-retrospective-with-papercuts",
      "title": "Run a retrospective with papercuts after a feature",
      "summary": "This page is for a tech lead or engineering manager who wants to collect the friction that a feature caused. You get a ranked list of codebase fixes, with one file named for each fix. You also get a delivery retrospective. Its improvements each have an owner, a done condition, and a review trigger. Use another page when you want customer results or an incident review (see Decision points).",
      "group": "Tech lead",
      "roles": "Tech lead, engineering manager",
      "skills": [
        "papercuts"
      ],
      "source_path": "wiki/use-cases/lead-run-a-retrospective-with-papercuts.md",
      "source_url": "https://github.com/Ryan-Thurman/agent-toolbelt/blob/main/wiki/use-cases/lead-run-a-retrospective-with-papercuts.md"
    },
    {
      "slug": "lead-set-up-a-new-team-repo",
      "title": "Set up a new team repository on day one",
      "summary": "This page is for a tech lead who has just received a repository and must write down how the team works in it. You get a contribution guide that records the real commands and their results, a draft review configuration, and a reviewed list of high-impact paths.",
      "group": "Tech lead",
      "roles": "Tech lead, with one developer or product owner to confirm impact lines",
      "skills": [
        "style-guide-init",
        "pr-review",
        "risk-area-mapping"
      ],
      "source_path": "wiki/use-cases/lead-set-up-a-new-team-repo.md",
      "source_url": "https://github.com/Ryan-Thurman/agent-toolbelt/blob/main/wiki/use-cases/lead-set-up-a-new-team-repo.md"
    },
    {
      "slug": "lead-set-up-quality-rails",
      "title": "Set up one quality command for local use, CI, and release",
      "summary": "This page is for a tech lead whose repository has separate check tools but no single command that runs them. You get one command that local use, CI, and release all call. You also get a list of the checks that already report findings, with counts.",
      "group": "Tech lead",
      "roles": "Tech lead",
      "skills": [
        "style-guide-init"
      ],
      "source_path": "wiki/use-cases/lead-set-up-quality-rails.md",
      "source_url": "https://github.com/Ryan-Thurman/agent-toolbelt/blob/main/wiki/use-cases/lead-set-up-quality-rails.md"
    },
    {
      "slug": "ops-agent-to-agent-review-queue",
      "title": "Queue branch reviews from coding agents for a reviewer agent",
      "summary": "This page is for a platform engineer whose coding agents open branches and pull requests (PRs) that a different agent must review. You get a local queue. The coding agents enqueue each branch. A worker session reviews the branches one at a time. Each job records one verdict.",
      "group": "Platform and operators",
      "roles": "Platform engineer",
      "skills": [
        "review-queue",
        "pr-review"
      ],
      "source_path": "wiki/use-cases/ops-agent-to-agent-review-queue.md",
      "source_url": "https://github.com/Ryan-Thurman/agent-toolbelt/blob/main/wiki/use-cases/ops-agent-to-agent-review-queue.md"
    },
    {
      "slug": "ops-cursor-hooks",
      "title": "Add commit and push checks for Cursor users",
      "summary": "This page is for a platform engineer whose team uses Cursor. You install two advisory Cursor hooks into a repository. One hook asks for a confirmation when a commit changes code but no documentation. The other hook reminds the team to run `/pr-review` before a push. Both hooks are advisory: they ask, and they never block. Both hooks are fail-open: on a hook error, the action goes ahead.",
      "group": "Platform and operators",
      "roles": "Platform engineer",
      "skills": [
        "pr-review",
        "review-on-open"
      ],
      "source_path": "wiki/use-cases/ops-cursor-hooks.md",
      "source_url": "https://github.com/Ryan-Thurman/agent-toolbelt/blob/main/wiki/use-cases/ops-cursor-hooks.md"
    },
    {
      "slug": "ops-enforce-a-pre-pr-gate",
      "title": "Enforce a pre-PR gate on every branch",
      "summary": "This page is for a tech lead whose policy says every pull request passes a quality gate. You get one status for the checked-out branch: `PASS`, `FAIL`, `CAPPED`, or `BLOCKED`. You also get a folder of evidence and a way to see when the status is stale. The sample run ends `FAIL`, because two required checks were already red on the base commit. The run predates the pre-existing failure rule. Under the current contract, those two checks are pre-existing failures, and only a new failure sets `FAIL`. The run also predates the right-sizing change of the gate. The excerpts below keep the run's text verbatim. That text names `scope_fingerprint`, `round_bound`, `rounds_completed`, `--scope`, and a separate `/simplify` pass. The current gate has none of them. It has one `head_fingerprint` and one `/pr-review --tier=standard --show-nits` call.",
      "group": "Platform and operators",
      "roles": "Tech lead",
      "skills": [
        "code-quality-gate"
      ],
      "source_path": "wiki/use-cases/ops-enforce-a-pre-pr-gate.md",
      "source_url": "https://github.com/Ryan-Thurman/agent-toolbelt/blob/main/wiki/use-cases/ops-enforce-a-pre-pr-gate.md"
    },
    {
      "slug": "ops-gate-each-phase",
      "title": "Gate each phase with a review before the next phase starts",
      "summary": "This page is for a lead who builds a feature as phased pull requests (PRs) and wants an independent review at each phase boundary. You get a verdict for the phase head commit and a list of blockers with evidence. The gate then stops for people (team mode) or starts an agent loop that fixes and merges (solo mode).",
      "group": "Platform and operators",
      "roles": "Lead, developer",
      "skills": [
        "phase-gate",
        "pr-review"
      ],
      "source_path": "wiki/use-cases/ops-gate-each-phase.md",
      "source_url": "https://github.com/Ryan-Thurman/agent-toolbelt/blob/main/wiki/use-cases/ops-gate-each-phase.md"
    },
    {
      "slug": "ops-install-for-a-team",
      "title": "Install the Toolbelt for a team across several repositories",
      "summary": "This page is for a platform engineer who installs the Toolbelt for a team that uses Claude Code, Cursor, and Codex in several repositories. You install the same files into every repository in one folder with one command, and you can run that command again without damage.",
      "group": "Platform and operators",
      "roles": "Platform engineer",
      "skills": [],
      "source_path": "wiki/use-cases/ops-install-for-a-team.md",
      "source_url": "https://github.com/Ryan-Thurman/agent-toolbelt/blob/main/wiki/use-cases/ops-install-for-a-team.md"
    },
    {
      "slug": "ops-review-every-pr-on-open",
      "title": "Review every pull request when it opens",
      "summary": "This page is for a platform engineer who wants a fresh reviewer on every pull request (PR) when it opens or gets a new push. You set up a trigger and check it before it posts anything. On GitHub the trigger is a CI workflow. On Azure Repos it is a poller. For PRs that your own local agents open, or for one review now, use the pages in Next.",
      "group": "Platform and operators",
      "roles": "Platform engineer, DevOps engineer",
      "skills": [
        "review-on-open",
        "pr-review"
      ],
      "source_path": "wiki/use-cases/ops-review-every-pr-on-open.md",
      "source_url": "https://github.com/Ryan-Thurman/agent-toolbelt/blob/main/wiki/use-cases/ops-review-every-pr-on-open.md"
    },
    {
      "slug": "ops-unattended-agent-runs",
      "title": "Prepare a plan and task records for unattended agent runs",
      "summary": "This page is for a platform engineer who wants a runner program to implement and review work with agent CLIs while nobody watches. The Toolbelt prepares the plan and the rules. Your runner executes them. You get a validated plan that the runner parses. You also get a configuration to check before the first run and an optional task record that a checker validates.",
      "group": "Platform and operators",
      "roles": "Platform engineer",
      "skills": [
        "phased-delivery",
        "phase-gate",
        "pr-review"
      ],
      "source_path": "wiki/use-cases/ops-unattended-agent-runs.md",
      "source_url": "https://github.com/Ryan-Thurman/agent-toolbelt/blob/main/wiki/use-cases/ops-unattended-agent-runs.md"
    },
    {
      "slug": "product-compare-an-ask-with-the-product",
      "title": "Check whether the product already does what was asked",
      "summary": "This page is for a product owner who gets a request such as \"can users follow tags and see a feed of them?\" You must say whether the product can do it today. You get a report with a status for each requested outcome, evidence from the code, and a ranked list of open decisions.",
      "group": "Product",
      "roles": "Product owner. A developer reads the evidence and the product owner answers the questions.",
      "skills": [
        "shape-up"
      ],
      "source_path": "wiki/use-cases/product-compare-an-ask-with-the-product.md",
      "source_url": "https://github.com/Ryan-Thurman/agent-toolbelt/blob/main/wiki/use-cases/product-compare-an-ask-with-the-product.md"
    },
    {
      "slug": "product-decide-whether-to-build",
      "title": "Decide whether a requested feature is worth building",
      "summary": "This page is for a product manager who gets a feature request and must decide whether to build it. You get a report that checks each claim behind the request and compares the options. It names the riskiest assumptions and ends in one decision: ready to shape, needs evidence, or deferred.",
      "group": "Product",
      "roles": "Product manager",
      "skills": [
        "product-discovery"
      ],
      "source_path": "wiki/use-cases/product-decide-whether-to-build.md",
      "source_url": "https://github.com/Ryan-Thurman/agent-toolbelt/blob/main/wiki/use-cases/product-decide-whether-to-build.md"
    },
    {
      "slug": "product-review-outcomes-after-release",
      "title": "Review product outcomes after a release",
      "summary": "This page is for a product manager who ships a change and must judge whether it moved the outcome. You get a review with the original hypothesis, the before and after comparisons that are valid, and the uncertainty of the result. It ends with one of four decisions: `Continue`, `Revise`, `Stop`, or `Gather evidence`.",
      "group": "Product",
      "roles": "Product manager",
      "skills": [
        "product-outcome-review"
      ],
      "source_path": "wiki/use-cases/product-review-outcomes-after-release.md",
      "source_url": "https://github.com/Ryan-Thurman/agent-toolbelt/blob/main/wiki/use-cases/product-review-outcomes-after-release.md"
    },
    {
      "slug": "product-shape-an-idea-into-tickets",
      "title": "Shape an idea into a brief and tickets",
      "summary": "This page is for a product owner who has a rough idea. The idea needs a brief that the team approves and tickets that the team can build. You finish with an approved brief, ticket files in build order, and a preview of the issues that your tracker receives after you confirm. A tracker is a system, such as GitHub Issues, Jira, or Azure Boards, that holds tickets.",
      "group": "Product",
      "roles": "Product owner. In practice, a developer helps with questions that the code cannot answer.",
      "skills": [
        "shape-up",
        "ticket-sync"
      ],
      "source_path": "wiki/use-cases/product-shape-an-idea-into-tickets.md",
      "source_url": "https://github.com/Ryan-Thurman/agent-toolbelt/blob/main/wiki/use-cases/product-shape-an-idea-into-tickets.md"
    },
    {
      "slug": "product-synthesize-interview-notes",
      "title": "Find themes in a set of interview notes",
      "summary": "This page is for a product researcher who has several interview notes and must learn what they show before anyone decides what to build. You get a report where each theme links to the notes that support it, the notes that contradict it, and the limits of the sample.",
      "group": "Product",
      "roles": "Product researcher",
      "skills": [
        "user-research-synthesis"
      ],
      "source_path": "wiki/use-cases/product-synthesize-interview-notes.md",
      "source_url": "https://github.com/Ryan-Thurman/agent-toolbelt/blob/main/wiki/use-cases/product-synthesize-interview-notes.md"
    },
    {
      "slug": "qa-find-coverage-gaps-before-release",
      "title": "Find coverage gaps before a release",
      "summary": "This page is for a QA lead who has one week before a release and does not know where the tests are weak. You get a ranked list of coverage gaps with a risk for each. You also get a list of risky functions, scored by complexity and coverage.",
      "group": "QA and test",
      "roles": "QA lead, with a developer for step 5",
      "skills": [
        "cover",
        "crap-analysis"
      ],
      "source_path": "wiki/use-cases/qa-find-coverage-gaps-before-release.md",
      "source_url": "https://github.com/Ryan-Thurman/agent-toolbelt/blob/main/wiki/use-cases/qa-find-coverage-gaps-before-release.md"
    },
    {
      "slug": "qa-map-risk-areas-in-an-inherited-repo",
      "title": "Map risk areas in an inherited repository",
      "summary": "This page is for a QA lead whose team inherited a repository and must decide where testing effort goes first. You get a reviewed risk map of the repository and a prioritized set of test cases for the riskiest area.",
      "group": "QA and test",
      "roles": "QA lead, with one developer or product owner to answer questions",
      "skills": [
        "risk-area-mapping",
        "test-case-design"
      ],
      "source_path": "wiki/use-cases/qa-map-risk-areas-in-an-inherited-repo.md",
      "source_url": "https://github.com/Ryan-Thurman/agent-toolbelt/blob/main/wiki/use-cases/qa-map-risk-areas-in-an-inherited-repo.md"
    },
    {
      "slug": "qa-plan-staging-failure-tests",
      "title": "Plan failure tests for a service in staging",
      "summary": "This page is for a QA or SRE engineer who must plan failure tests for a service before launch. You get a reliability review of the service and a set of failure-scenario cards. You get plans, not results: no test runs. Each card has a testable hypothesis and a Given/When/Then form (a scenario in three plain steps: a starting state, an event, and an expected outcome). Each card also has a test-first case, which is a test that you write before the fix and that fails until the fix exists. The cards that need a real platform fault also get a staging experiment plan with abort conditions and no-go checks.",
      "group": "QA and test",
      "roles": "QA engineer, SRE",
      "skills": [
        "reliability-review",
        "failure-scenario-design"
      ],
      "source_path": "wiki/use-cases/qa-plan-staging-failure-tests.md",
      "source_url": "https://github.com/Ryan-Thurman/agent-toolbelt/blob/main/wiki/use-cases/qa-plan-staging-failure-tests.md"
    },
    {
      "slug": "qa-plan-tests-for-a-small-pr",
      "title": "Plan tests for a small authentication pull request",
      "summary": "This page is for a QA engineer who gets a small pull request in an authentication area and must decide what to test. You get a short, prioritized case list, a list of the code that the change affects, and a statement about whether the existing tests cover it.",
      "group": "QA and test",
      "roles": "QA engineer",
      "skills": [
        "test-case-design"
      ],
      "source_path": "wiki/use-cases/qa-plan-tests-for-a-small-pr.md",
      "source_url": "https://github.com/Ryan-Thurman/agent-toolbelt/blob/main/wiki/use-cases/qa-plan-tests-for-a-small-pr.md"
    },
    {
      "slug": "qa-refine-a-vague-story",
      "title": "Make a vague story testable before the sprint starts",
      "summary": "This page is for a QA engineer who joins refinement with a one-line story and must make it testable. You finish with a refined spec, one question packet for each owner, and a readiness verdict. You also get Gherkin (Given/When/Then text) scenarios that trace to the criteria.",
      "group": "QA and test",
      "roles": "QA engineer. The product owner and a developer answer the questions.",
      "skills": [
        "story-refinement",
        "bdd-scenarios"
      ],
      "source_path": "wiki/use-cases/qa-refine-a-vague-story.md",
      "source_url": "https://github.com/Ryan-Thurman/agent-toolbelt/blob/main/wiki/use-cases/qa-refine-a-vague-story.md"
    },
    {
      "slug": "qa-review-feature-files",
      "title": "Review feature files that a developer wrote",
      "summary": "Use this page to review feature files that a developer wrote. You get a list of findings, ranked by risk, and each finding has a suggested rewrite. Gherkin is the Given/When/Then text format that behavior-driven development (BDD) tools read. This page is not for you if the feature files do not exist yet (use the write mode of `bdd-scenarios`) or if the criteria are vague (use [Refine a vague story](qa-refine-a-vague-story.md) first). You must say if the files are good enough to build against.",
      "group": "QA and test",
      "roles": "QA engineer. The developer who wrote the files answers the findings.",
      "skills": [
        "bdd-scenarios"
      ],
      "source_path": "wiki/use-cases/qa-review-feature-files.md",
      "source_url": "https://github.com/Ryan-Thurman/agent-toolbelt/blob/main/wiki/use-cases/qa-review-feature-files.md"
    },
    {
      "slug": "qa-set-up-a-bdd-runner",
      "title": "Set up a BDD runner when you only have feature files",
      "summary": "This page is for a QA engineer whose team has Gherkin feature files but no BDD runner (a tool that executes Given/When/Then text as tests) in the repository. You get a runner plan, a proposed install, and one scenario outline that runs against your API and fails for a reason you can read. Scenarios that need a database stay unwired. This page covers scenarios that call an HTTP API. Browser scenarios need another path (see Decision points).",
      "group": "QA and test",
      "roles": "QA engineer. A developer helps with the CI job.",
      "skills": [
        "bdd-scenarios"
      ],
      "source_path": "wiki/use-cases/qa-set-up-a-bdd-runner.md",
      "source_url": "https://github.com/Ryan-Thurman/agent-toolbelt/blob/main/wiki/use-cases/qa-set-up-a-bdd-runner.md"
    },
    {
      "slug": "qa-turn-test-cases-into-tests",
      "title": "Turn approved test cases into automated unit tests",
      "summary": "This page is for a QA engineer or developer who has approved test cases and must turn them into automated tests. You get unit tests that run in the repository's own test runner. Each test has a red run (the test fails) when the behavior it guards breaks. It also has a green run (the test passes) on the working code. This page covers a test that locks a fixed bug. That test is red on the code from before the fix. A test that pins current behavior is red when you break that behavior on purpose.",
      "group": "QA and test",
      "roles": "QA engineer, developer",
      "skills": [
        "cover"
      ],
      "source_path": "wiki/use-cases/qa-turn-test-cases-into-tests.md",
      "source_url": "https://github.com/Ryan-Thurman/agent-toolbelt/blob/main/wiki/use-cases/qa-turn-test-cases-into-tests.md"
    },
    {
      "slug": "sec-audit-existing-code",
      "title": "Audit the auth area of existing code",
      "summary": "This page is for a developer or security engineer who must audit code that already runs, such as the login and token code of a service. You get a read-only report of evidence-backed findings, the risk that remains, and a statement of what the audit did not check. You can also ask for a list of the controls that work.",
      "group": "Architecture, SRE, and security",
      "roles": "Developer or security engineer",
      "skills": [
        "security-audit"
      ],
      "source_path": "wiki/use-cases/sec-audit-existing-code.md",
      "source_url": "https://github.com/Ryan-Thurman/agent-toolbelt/blob/main/wiki/use-cases/sec-audit-existing-code.md"
    },
    {
      "slug": "sec-threat-model-a-design",
      "title": "Review the threats of a design before it is built",
      "summary": "This page is for a security-minded engineer who must review a design before anyone builds it. You get a threat model: the assets, the attack paths, a testable security requirement for each accepted fix, and the risk that remains.",
      "group": "Architecture, SRE, and security",
      "roles": "Security engineer, tech lead, or developer who reviews a design",
      "skills": [
        "threat-model"
      ],
      "source_path": "wiki/use-cases/sec-threat-model-a-design.md",
      "source_url": "https://github.com/Ryan-Thurman/agent-toolbelt/blob/main/wiki/use-cases/sec-threat-model-a-design.md"
    },
    {
      "slug": "sre-follow-up-an-incident",
      "title": "Follow up an incident after it is mitigated",
      "summary": "This page is for an SRE who has mitigated an incident and must now fix the cause and close the gaps that let it run. You get a root cause with a regression test and a register of failure modes (a table of what can fail, how you detect it, and who owns the control) with open decisions. You also get failure scenario cards and a case list for the fix and the code next to it.",
      "group": "Architecture, SRE, and security",
      "roles": "SRE, with a developer for the fix",
      "skills": [
        "bug-to-fix",
        "reliability-review",
        "failure-scenario-design",
        "test-case-design",
        "cover"
      ],
      "source_path": "wiki/use-cases/sre-follow-up-an-incident.md",
      "source_url": "https://github.com/Ryan-Thurman/agent-toolbelt/blob/main/wiki/use-cases/sre-follow-up-an-incident.md"
    },
    {
      "slug": "sre-run-a-production-readiness-review",
      "title": "Run a production readiness review before a launch",
      "summary": "This page is for an SRE or a tech lead who must decide if a service is ready for its first launch. You get a status for each reliability requirement (`Verified`, `Failed`, or `Not verified`). You also get a list of the missing evidence and a GO or NO-GO verdict with its blocking gaps.",
      "group": "Architecture, SRE, and security",
      "roles": "SRE, tech lead",
      "skills": [
        "reliability-review",
        "ship-it"
      ],
      "source_path": "wiki/use-cases/sre-run-a-production-readiness-review.md",
      "source_url": "https://github.com/Ryan-Thurman/agent-toolbelt/blob/main/wiki/use-cases/sre-run-a-production-readiness-review.md"
    },
    {
      "slug": "ui-clean-up-react-effects",
      "title": "Clean up React effects and re-render problems",
      "summary": "This page is for a front-end developer whose React components have effects that run too often or state that re-renders too much. You get a scan report that lists each effect and each rule that applies, and one safe fix with a test that fails before the fix and passes after it.",
      "group": "UI and front end",
      "roles": "Front-end developer",
      "skills": [
        "vercel-react-best-practices",
        "use-effect-killer"
      ],
      "source_path": "wiki/use-cases/ui-clean-up-react-effects.md",
      "source_url": "https://github.com/Ryan-Thurman/agent-toolbelt/blob/main/wiki/use-cases/ui-clean-up-react-effects.md"
    },
    {
      "slug": "ui-review-against-interface-guidelines",
      "title": "Review a page for accessibility and interface quality",
      "summary": "This page is for a designer, front-end developer, or QA engineer who must review a page or a UI change. You get a list of findings. Each finding has a file, a line, a severity, and a fix. No code changes.",
      "group": "UI and front end",
      "roles": "Designer, front-end developer, QA engineer",
      "skills": [
        "vercel-web-interface-guidelines"
      ],
      "source_path": "wiki/use-cases/ui-review-against-interface-guidelines.md",
      "source_url": "https://github.com/Ryan-Thurman/agent-toolbelt/blob/main/wiki/use-cases/ui-review-against-interface-guidelines.md"
    },
    {
      "slug": "ui-verify-a-browser-flow",
      "title": "Prove a user flow works in the browser before the pull request merges",
      "summary": "This page is for a QA engineer or developer who must show that a user flow works in a real browser. You get a written plan, a Playwright check that was seen failing and then passing, screenshots, a trace, and a verdict.",
      "group": "UI and front end",
      "roles": "QA engineer, developer",
      "skills": [
        "webapp-testing"
      ],
      "source_path": "wiki/use-cases/ui-verify-a-browser-flow.md",
      "source_url": "https://github.com/Ryan-Thurman/agent-toolbelt/blob/main/wiki/use-cases/ui-verify-a-browser-flow.md"
    },
    {
      "slug": "write-make-a-runbook-plain",
      "title": "Rewrite a README setup section as a plain runbook",
      "summary": "This page is for anyone who writes runbooks, error messages, or release notes and has a setup text that readers misread. You get a list of the rule violations in the text. You also get a runbook in plain English and a list of the facts that the old text left out.",
      "group": "Writers",
      "roles": "Developer, on-call engineer, technical writer",
      "skills": [
        "simple-english"
      ],
      "source_path": "wiki/use-cases/write-make-a-runbook-plain.md",
      "source_url": "https://github.com/Ryan-Thurman/agent-toolbelt/blob/main/wiki/use-cases/write-make-a-runbook-plain.md"
    }
  ],
  "tooling_audit": [
    {
      "id": "auto-agent-package",
      "label": "Optional Auto Agent plugin",
      "kind": "optional-plugin",
      "lifecycle": "optional-compatibility",
      "native_skill_surface": false,
      "paths": [
        "plugins/agent-toolbelt-auto-agent",
        "install/auto-agent-contract.sh"
      ],
      "absent_paths": [
        "skills/auto-agent-contract",
        "skills/auto-agent-dev-lite",
        "commands/auto-agent-plan.md"
      ],
      "purpose": "Keep unattended runner contracts available as an explicit opt-in package, separate from standard skill discovery and all-pack installation.",
      "recommendation": "Maintain independent plugin validation and require explicit installation for private runner workflows."
    },
    {
      "id": "project-installer",
      "label": "install.sh, install/*.sh, and install/lib.sh",
      "kind": "installer",
      "lifecycle": "still-required",
      "native_skill_surface": false,
      "paths": [
        "install.sh",
        "install",
        "install/lib.sh"
      ],
      "purpose": "Install project-scoped commands, templates, workflows, and compatibility files for existing repositories.",
      "recommendation": "Keep as the legacy/project installer; it remains separate from native plugin skill discovery."
    },
    {
      "id": "command-surface",
      "label": "commands/",
      "kind": "commands",
      "lifecycle": "optional-compatibility",
      "native_skill_surface": false,
      "paths": [
        "commands"
      ],
      "purpose": "Provide project-scoped command prompts for the existing install workflow.",
      "recommendation": "Keep for install.sh consumers, but keep commands suppressed in native Cursor, Claude Code, and Codex plugin manifests."
    },
    {
      "id": "cursor-hooks",
      "label": "optional/cursor-hooks/",
      "kind": "hooks",
      "lifecycle": "optional-compatibility",
      "native_skill_surface": false,
      "paths": [
        "optional/cursor-hooks"
      ],
      "purpose": "Preserve opt-in Cursor hook behavior without enabling hooks through native plugin discovery.",
      "recommendation": "Keep opt-in and project-installer-managed; do not make it a default plugin component."
    },
    {
      "id": "cursor-build",
      "label": "build-cursor-plugin.sh and scripts/check-cursor-plugin-build.sh",
      "kind": "build-helper",
      "lifecycle": "still-required",
      "native_skill_surface": false,
      "paths": [
        "build-cursor-plugin.sh",
        "scripts/check-cursor-plugin-build.sh"
      ],
      "purpose": "Build and verify the skills-only Cursor package with its required support resources.",
      "recommendation": "Keep as a repeatable packaging and validation path."
    },
    {
      "id": "plugin-checks",
      "label": "scripts/check-plugin-package.js and scripts/check-plugin-package.sh",
      "kind": "validator",
      "lifecycle": "still-required",
      "native_skill_surface": false,
      "paths": [
        "scripts/check-plugin-package.js",
        "scripts/check-plugin-package.sh",
        "scripts/check-catalog.sh",
        "scripts/check-portal.sh"
      ],
      "purpose": "Validate native manifests, catalogs, package inventory, and host-specific plugin contracts.",
      "recommendation": "Keep as release checks."
    },
    {
      "id": "skill-sync",
      "label": "scripts/check-skill-shape.sh and scripts/check-skill-sync.sh",
      "kind": "validator",
      "lifecycle": "still-required",
      "native_skill_surface": false,
      "paths": [
        "scripts/check-skill-shape.sh",
        "scripts/check-skill-sync.sh"
      ],
      "purpose": "Protect canonical skill shape and the repository's internal compatibility mirror.",
      "recommendation": "Keep until the installer and sync contract no longer requires the mirror."
    },
    {
      "id": "internal-skill-copy",
      "label": ".agents/skills/phased-delivery/",
      "kind": "internal-copy",
      "lifecycle": "optional-compatibility",
      "native_skill_surface": false,
      "paths": [
        ".agents/skills/phased-delivery"
      ],
      "purpose": "Maintain the repository-local Phased Delivery skill copy used by existing tooling and checks.",
      "recommendation": "Keep only for the established compatibility contract; do not add additional duplicated skill trees."
    },
    {
      "id": "native-plugin-metadata",
      "label": ".cursor-plugin/, .claude-plugin/, .codex-plugin/, and .agents/plugins/",
      "kind": "host-metadata",
      "lifecycle": "still-required",
      "native_skill_surface": false,
      "paths": [
        ".cursor-plugin",
        ".claude-plugin",
        ".codex-plugin",
        ".agents/plugins"
      ],
      "purpose": "Describe and index the skills-only native plugin for the three supported hosts.",
      "recommendation": "Keep manifests and marketplace metadata aligned; these are plugin metadata, not additional skill copies."
    },
    {
      "id": "legacy-root-hooks",
      "label": "root hooks/ discovery",
      "kind": "hooks",
      "lifecycle": "deprecated",
      "native_skill_surface": false,
      "absent_paths": [
        "hooks/hooks.json",
        "hooks/doc-sync-guard.sh",
        "hooks/review-nudge.sh"
      ],
      "purpose": "Historical root-level hook discovery that could unintentionally enable behavior in plugin contexts.",
      "recommendation": "Do not restore; the optional/cursor-hooks location preserves explicit compatibility behavior."
    },
    {
      "id": "old-plugin-duplicates",
      "label": "Committed duplicated plugin skill trees",
      "kind": "internal-copy",
      "lifecycle": "removable",
      "native_skill_surface": false,
      "absent_paths": [
        ".cursor/skills",
        ".claude/skills",
        ".agents/skills/agent-toolbelt"
      ],
      "purpose": "Avoid duplicate copies that drift from skills/*/SKILL.md.",
      "recommendation": "Do not add; use host manifests, build validation, and the canonical root skill tree."
    },
    {
      "id": "macos-installer-wrapper",
      "label": "install.command",
      "kind": "installer-wrapper",
      "lifecycle": "optional-compatibility",
      "native_skill_surface": false,
      "paths": [
        "install.command"
      ],
      "purpose": "Offer a double-click macOS entry point for the project-scoped installer.",
      "recommendation": "Keep as an optional convenience; direct install.sh remains the documented cross-platform path."
    },
    {
      "id": "contributor-harness-config",
      "label": ".cursor/commands/ and .cursor/rules/",
      "kind": "contributor-configuration",
      "lifecycle": "optional-compatibility",
      "native_skill_surface": false,
      "paths": [
        ".cursor/commands"
      ],
      "optional_paths": [
        ".cursor/rules"
      ],
      "purpose": "Provide repo-local contributor and developer configuration for maintaining the collection.",
      "recommendation": "Keep as repository contributor configuration; do not treat it as native plugin payload."
    },
    {
      "id": "support-content",
      "label": "templates/, workflows/, and examples/",
      "kind": "support-content",
      "lifecycle": "still-required",
      "native_skill_surface": false,
      "paths": [
        "templates",
        "workflows",
        "examples"
      ],
      "purpose": "Supply referenced templates, workflow playbooks, and worked examples used by skills and the project installer.",
      "recommendation": "Keep canonical support content; validate references and avoid duplicating it in the portal."
    },
    {
      "id": "operational-documentation",
      "label": "wiki/",
      "kind": "documentation",
      "lifecycle": "still-required",
      "native_skill_surface": false,
      "paths": [
        "wiki"
      ],
      "purpose": "Supply essential installation and operational instructions.",
      "recommendation": "Keep usage instructions in the wiki. Keep maintainer reports and evaluation material local."
    },
    {
      "id": "maintainer-research",
      "label": "Local maintainer material",
      "kind": "maintainer-research",
      "lifecycle": "optional-compatibility",
      "native_skill_surface": false,
      "optional_paths": [
        "notes",
        "repos"
      ],
      "purpose": "Hold local maintainer research and source material when these ignored directories are present.",
      "recommendation": "Keep research, handoff documents, and evaluations outside the repository or in ignored scratch output."
    },
    {
      "id": "portal-catalog",
      "label": "catalog/ and portal/",
      "kind": "discovery-tooling",
      "lifecycle": "still-required",
      "native_skill_surface": false,
      "paths": [
        "catalog",
        "portal"
      ],
      "purpose": "Provide deterministic discovery metadata and the offline capability portal.",
      "recommendation": "Derive discovery content from canonical skill metadata. Generate optional maintainer reports outside published content."
    },
    {
      "id": "project-workflow-boundary",
      "label": "Project-owned delivery boundary",
      "kind": "documentation",
      "lifecycle": "still-required",
      "native_skill_surface": false,
      "paths": [
        "README.md"
      ],
      "absent_paths": [
        "skills/ai-feature-delivery",
        "install/ai-feature-delivery.sh",
        "workflows/ai-feature-delivery-lifecycle.md",
        "workflows/cursor-first-ai-feature-delivery.md",
        "commands/feature-start.md",
        "commands/feature-fleshout.md",
        "commands/steward-review.md",
        "commands/draft-pings.md",
        "commands/sdd-draft.md",
        "commands/doc-impact.md",
        "commands/doc-delta.md",
        "commands/refine-to-tickets.md",
        "commands/start-dev-from-feature.md",
        "commands/dev-doc-delta-check.md",
        "commands/pr-traceability-review.md",
        "commands/gate-check.md",
        "commands/qa-handoff.md",
        "commands/release-manifest.md",
        "commands/release-doc-check.md",
        "templates/feature-master-record.md",
        "templates/sdd-template.md",
        "templates/doc-impact-template.md",
        "templates/clarification-queue-template.md",
        "templates/steward-review-template.md",
        "templates/refinement-ticket-template.md",
        "templates/pr-traceability-review-template.md",
        "templates/gate-check-template.md",
        "templates/qa-handoff-template.md",
        "templates/release-manifest-template.md",
        "templates/implementation-plan-template.md",
        "templates/cursor-rules-000-core-process.mdc",
        "templates/cursor-rules-010-doc-control.mdc",
        "templates/cursor-rules-020-gates.mdc",
        "templates/cursor-rules-030-traceability.mdc",
        "templates/cursor-rules-040-stakeholder-pings.mdc",
        "templates/cursor-rules-050-pr-review.mdc",
        "templates/cursor-rules-100-dev-core.mdc",
        "templates/cursor-rules-130-testing.mdc",
        "templates/cursor-rules-150-pr-hygiene.mdc",
        "templates/cursor-rules-200-dev-feature-traceability.mdc"
      ],
      "purpose": "Define shared capability ownership and preserve project-owned delivery requirements.",
      "recommendation": "Use project-owned adapters for forms, approvals, and controlled records; import shared skills without replacing those adapters."
    }
  ]
};
