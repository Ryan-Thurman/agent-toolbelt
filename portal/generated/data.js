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
        "code-quality-gate"
      ],
      "workflow_membership": [
        "bug-fixing"
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
      "description": "Author behavior-pinning tests for a diff, a module, or a bug-to-fix regression gap, applied on opt-in, or scan an area for missing and weak coverage (detect-only). Use when adding regression coverage, strengthening tests, or surveying coverage gaps. For a merge verdict use /pr-review.",
      "category": "Testing & Verification",
      "tags": [
        "tests",
        "regression",
        "behavior",
        "testing"
      ],
      "primary_purpose": "Add or improve focused test coverage for the behavior changed by a task.",
      "use_when": [
        "A fix or feature needs regression protection and executable evidence of expected behavior."
      ],
      "avoid_when": [
        "The repository has no testable seam and a test would only duplicate implementation details."
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
        "codebase-improvement"
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
      "description": "Run a synchronous PR-review gate at a phased-build boundary. Use when each phase PR needs an isolated subagent review, posted findings, and either team handoff or solo fix-and-merge routing.",
      "category": "Review & Quality",
      "tags": [
        "phase",
        "review",
        "gates"
      ],
      "primary_purpose": "Review whether a delivery phase met its evidence and acceptance criteria before proceeding.",
      "use_when": [
        "A phased task needs an explicit checkpoint before the next implementation or release step."
      ],
      "avoid_when": [
        "There is no phase boundary or the work has no defined acceptance evidence."
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
        "code-quality-gate",
        "handoff",
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
      "description": "Plan, review, or deliver requirements as test-first, reviewable phases with one PR per phase. Use with a raw request, an existing plan, or approved tickets, or to review a phase branch or PR against its ticket.",
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
        "The request is only to define requirements, or an unattended runner owns execution and merge."
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
        "handoff"
      ],
      "workflow_membership": [
        "feature-delivery",
        "product-learning",
        "security-sensitive-change"
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
      "description": "Iteratively fix an agreed PR review ledger within a frozen scope and verify each round. Use to improve a PR after findings exist; not for one-time review or broad cleanup.",
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
        "No review findings exist or the task is a fresh implementation."
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
      "description": "Review a PR, branch, or local diff with a tiered, multi-agent code-review process (light/standard/deep). Use before merge or when auditing changed code for bugs, security, performance, tests, maintainability, and standards compliance.",
      "category": "Review & Quality",
      "tags": [
        "pr",
        "code-review",
        "risk",
        "review"
      ],
      "primary_purpose": "Review a change for correctness, regressions, maintainability, and delivery risk.",
      "use_when": [
        "A pull request or diff needs an independent, evidence-backed review."
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
        "security-audit"
      ],
      "workflow_membership": [
        "feature-delivery",
        "pr-review",
        "codebase-improvement",
        "security-sensitive-change"
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
      "short_description": "Triage PR review threads, re-review touched code, and draft per-thread replies.",
      "default_prompt": "Handle these PR review comments.",
      "description": "Handle the PR-review round-trip: read reviewer threads, triage each one against code changed since the review, and draft per-thread replies. Use to address PR comments, answer review feedback, or close a /pr-review loop.",
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
        "The pull request has not been reviewed or needs implementation rather than communication."
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
        "product-learning"
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
        "product-learning"
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
      "description": "Perform a read-only security audit of implemented code, configuration, dependencies, and secret exposure. Use threat-model for a design before it is built. Active testing requires explicit written authorization.",
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
        "The task is general quality review with no security-sensitive surface."
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
        "ticket-discovery"
      ],
      "workflow_membership": [
        "feature-delivery",
        "product-learning"
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
      "description": "Prepare a change for release with readiness checks, rollback, release notes, and rollout monitoring. Use after PR merge or approval. Follow the project's release policy and deployment owner.",
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
        "handoff"
      ],
      "workflow_membership": [
        "feature-delivery",
        "product-learning"
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
      "short_description": "Plain English with ASD-STE100 discipline.",
      "default_prompt": "Use $simple-english to rewrite this document in plain English.",
      "description": "Check or rewrite text against ASD-STE100 in Strict mode or rule by rule, and apply the patterns for error messages, runbooks, incident reports, and release notes. Everyday writing rules are in human-readable-output.md. Use this skill when the user asks for STE or a rewrite.",
      "category": "Agent Operations",
      "tags": [
        "writing",
        "documentation",
        "ste",
        "plain-english",
        "communication"
      ],
      "primary_purpose": "Check or rewrite text against ASD-STE100 in Strict mode or rule by rule. The everyday writing rules live in human-readable-output.md.",
      "use_when": [
        "The user asks for STE, ASD-STE100 compliance, or a plain-English rewrite.",
        "An agent writes an error message, runbook, incident report, or release notes and needs the matching pattern."
      ],
      "avoid_when": [
        "The text is marketing or brand copy that needs persuasion."
      ],
      "preferred_context": "The draft text, its reader, and whether the user asks for Strict ASD-STE100 compliance.",
      "expected_outputs": [
        "Plain-English rewrite",
        "Rule-numbered check report in check mode"
      ],
      "example_prompts": [
        "Rewrite this README with simple-english.",
        "Check this runbook against ASD-STE100."
      ],
      "related_skills": [
        "writing-whip",
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
      "id": "style-guide-init",
      "display_name": "Repository Contribution Guide",
      "short_description": "Extract repo conventions and maintain contribution guidance.",
      "default_prompt": "Use $style-guide-init to derive or refresh this repository's contribution guide from current evidence.",
      "description": "Extract and maintain repository contribution guidance from code, tooling, tests, CI, and documented policy. Use to create or refresh contribution/style guides, explain how to contribute, or assess convention drift; not for routine code review.",
      "category": "Discovery & Planning",
      "tags": [
        "style",
        "conventions",
        "repository",
        "documentation"
      ],
      "primary_purpose": "Derive and maintain contribution guidance from repository policy, tooling, CI, and observed code/test conventions.",
      "use_when": [
        "A repository needs contribution or style guidance created, checked for drift, or refreshed against current evidence."
      ],
      "avoid_when": [
        "Existing conventions are clear and the task only needs a local implementation."
      ],
      "preferred_context": "Applicable policies, representative source/tests, task definitions, CI, existing doc owners, and any prior evidence checkpoint.",
      "expected_outputs": [
        "Contribution or style guide",
        "Classified evidence and unresolved conflicts",
        "Scoped drift report and evidence checkpoint"
      ],
      "example_prompts": [
        "Create a contribution guide from the actual code, tests, tooling and CI, flagging stale written guidance.",
        "Check what changed since this guide was reviewed and refresh only the affected conventions."
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
        "test-case-design"
      ],
      "workflow_membership": [
        "security-sensitive-change",
        "feature-delivery"
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
        "One supplied item already needs an options decision; use technical assessment."
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
      "description": "Turn requirements and risks into prioritized, executable QA test cases without writing tests. Use before test implementation, QA handoff, or coverage planning.",
      "category": "Testing & Verification",
      "tags": [
        "qa",
        "test-design",
        "requirements",
        "testing"
      ],
      "primary_purpose": "Design high-value test cases from behavior, requirements, risks, and edge conditions.",
      "use_when": [
        "A feature or fix needs a deliberate test strategy before tests are implemented."
      ],
      "avoid_when": [
        "The needed regression test is obvious and can be added directly."
      ],
      "preferred_context": "Requirements, acceptance criteria, state transitions, failure modes, and test harness.",
      "expected_outputs": [
        "Test matrix",
        "Boundary and negative cases",
        "Traceability to behavior"
      ],
      "example_prompts": [
        "Design the test cases for this feature, including edge and failure paths.",
        "Turn these acceptance criteria into a prioritized executable test matrix."
      ],
      "related_skills": [
        "cover",
        "webapp-testing"
      ],
      "workflow_membership": [
        "feature-delivery",
        "security-sensitive-change"
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
        "system-design"
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
      "description": "Publish approved ticket files to the repository's tracker: GitHub Issues, Jira, or Azure Boards. Use after shape-up slicing, bug-to-fix intake, or a project-owned ticket workflow. Preview changes, preserve tracker keys, and write a manifest when offline.",
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
      "workflow_membership": [],
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
      "default_prompt": "Use $vercel-web-interface-guidelines to review the UI files in this change.",
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
      "id": "writing-whip",
      "display_name": "Writing Whip",
      "short_description": "Stop AI writing tropes and behaviors at generation.",
      "default_prompt": "Use $writing-whip to check this draft for AI writing tropes and fix them.",
      "description": "Full catalog of AI writing tropes with examples. Use for a trope review of long text or client-facing copy, or for a pattern that the short list in human-readable-output.md does not cover.",
      "category": "Agent Operations",
      "tags": [
        "writing",
        "documentation",
        "ai-tropes",
        "communication",
        "review"
      ],
      "primary_purpose": "Give the full AI writing trope catalog with examples. The short trope list lives in human-readable-output.md.",
      "use_when": [
        "Long text or client-facing copy needs a trope review.",
        "A pattern is not in the short list in human-readable-output.md."
      ],
      "avoid_when": [
        "The output is a required data format, such as JSON, where prose rules do not apply."
      ],
      "preferred_context": "The draft text and its reader.",
      "expected_outputs": [
        "Text without AI writing tropes",
        "A one-line note for each rule that the output breaks on purpose"
      ],
      "example_prompts": [
        "Check this draft for AI writing tropes.",
        "Rewrite this README section without AI tells."
      ],
      "related_skills": [
        "simple-english",
        "pr-review"
      ],
      "workflow_membership": [],
      "documentation_completeness": {
        "status": "complete",
        "notes": "Canonical skill and agent metadata are present."
      },
      "recommended_changes": [],
      "source_path": "skills/writing-whip/SKILL.md",
      "source_url": "https://github.com/Ryan-Thurman/agent-toolbelt/blob/main/skills/writing-whip/SKILL.md"
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
            "phased-delivery"
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
      "name": "System design and security",
      "purpose": "Document architecture, review attack paths, and connect security requirements to implementation evidence.",
      "stages": [
        {
          "skill": "system-design",
          "rationale": "Create the design record and linked threat review before implementation.",
          "example_invocation": "Document this system and its attack paths.",
          "next_steps": [
            "threat-model"
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
      "recommendation": "Keep as release checks; add catalog checks as a separate Phase 1 surface."
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
