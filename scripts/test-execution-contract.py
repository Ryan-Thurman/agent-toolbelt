#!/usr/bin/env python3
"""Exercise record rejection and installed execution-checker behavior."""

import copy
import hashlib
import importlib.util
import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path


sys.dont_write_bytecode = True
ROOT = Path(__file__).resolve().parents[1]
CHECKER = ROOT / "shared/contracts/scripts/validate-execution.py"
spec = importlib.util.spec_from_file_location("execution_contract", CHECKER)
contract = importlib.util.module_from_spec(spec)
spec.loader.exec_module(contract)


def context_record():
    return {
        "contract_version": 1,
        "task_id": "sample-42",
        "run_id": "sample-42-attempt-2",
        "operation": "implement",
        "goal": "Return a validation error for an empty title.",
        "source_refs": [{"location": "requirements/sample-42.md", "revision": "source-hash-1"}],
        "workspace": {
            "repository": "sample", "worktree": "/tmp/sample-worktree", "branch": "fix/title",
            "base_revision": "base-1", "head_revision": "head-2", "worktree_fingerprint": "content-hash-3",
        },
        "scope": {"allowed_paths": ["src/", "tests/"], "excluded_paths": ["src/generated/"]},
        "acceptance": [{"id": "AC-1", "criterion": "An empty title produces a validation error.",
                        "verification": "Run the focused validation test."}],
        "required_checks": ["validation-test"],
        "authority": {"worker_actions": ["inspect", "edit", "check"], "external_action_owner": "caller"},
        "attempt": {"number": 2, "limit": 3},
        "next_action": {"action": "implement", "owner": "worker", "reason": "Meet AC-1."},
    }


def result_record(context, raw):
    return {
        "contract_version": 1, "task_id": context["task_id"], "run_id": context["run_id"],
        "context_digest": hashlib.sha256(raw).hexdigest(), "status": "completed",
        "summary": "The validation case passed.", "changed_paths": ["src/title.js", "tests/title.test.js"],
        "actions_used": ["inspect", "edit", "check"],
        "checks": [{"id": "validation-test", "outcome": "passed", "evidence": "evidence/title-test.txt"}],
        "acceptance": [{"id": "AC-1", "outcome": "verified", "evidence": "evidence/title-test.txt"}],
        "blockers": [],
        "next_action": {"action": "review", "owner": "caller", "reason": "Review the actual diff and evidence."},
    }


class ExecutionContractTests(unittest.TestCase):
    def setUp(self):
        self.context = context_record()
        self.raw = json.dumps(self.context).encode()
        self.result = result_record(self.context, self.raw)
        self.digest = hashlib.sha256(self.raw).hexdigest()

    def check(self):
        contract.validate(self.context, self.result, self.digest)

    def test_valid_result_and_no_permission_from_proposed_next_action(self):
        self.check()
        self.result["next_action"]["action"] = "merge"
        self.check()  # A proposal is not execution authority.
        self.result["actions_used"].append("merge")
        with self.assertRaisesRegex(contract.ContractError, "authority"):
            self.check()

    def test_same_head_with_changed_input_rejects_old_result(self):
        for mutate in [
            lambda c: c["workspace"].update(worktree_fingerprint="different-untracked-content"),
            lambda c: c["source_refs"][0].update(revision="different-requirement"),
            lambda c: c["authority"]["worker_actions"].remove("edit"),
        ]:
            changed = copy.deepcopy(self.context)
            mutate(changed)
            digest = hashlib.sha256(json.dumps(changed).encode()).hexdigest()
            with self.assertRaisesRegex(contract.ContractError, "digest"):
                contract.validate(changed, self.result, digest)

    def test_other_run_cannot_reuse_result(self):
        self.result["run_id"] = "another-run"
        with self.assertRaisesRegex(contract.ContractError, "run_id"):
            self.check()

    def test_excluded_and_neighbor_paths_are_rejected(self):
        for path in ["src/generated/file.js", "src-neighbor/file.js", "../user.txt", "/tmp/user.txt",
                     "src/../user.txt", "src//file.js", "C:\\user.txt", "src/file.js/"]:
            with self.subTest(path=path), self.assertRaises(contract.ContractError):
                self.result["changed_paths"] = [path]
                self.check()

    def test_read_only_assignment_rejects_declared_changes(self):
        self.context["scope"]["allowed_paths"] = []
        with self.assertRaisesRegex(contract.ContractError, "scope"):
            self.check()

    def test_missing_check_or_acceptance_cannot_complete(self):
        for field in ["checks", "acceptance"]:
            previous = self.result[field]
            self.result[field] = []
            with self.assertRaises(contract.ContractError):
                self.check()
            self.result[field] = previous

    def test_failed_and_unrun_required_checks_cannot_complete(self):
        for outcome in ["failed", "not_run"]:
            self.result["checks"][0]["outcome"] = outcome
            with self.assertRaises(contract.ContractError):
                self.check()
        self.result["status"] = "partial"
        self.check()

    def test_blocked_needs_a_reason_and_cannot_be_completed(self):
        self.result["status"] = "blocked"
        with self.assertRaisesRegex(contract.ContractError, "blocker"):
            self.check()
        self.result["blockers"] = ["The required fixture service is unavailable."]
        self.check()
        self.result["status"] = "completed"
        with self.assertRaisesRegex(contract.ContractError, "blockers"):
            self.check()

    def test_review_completion_is_separate_from_implementation_success(self):
        self.context["operation"] = "review"
        self.result["changed_paths"] = []
        self.result["actions_used"] = ["inspect", "check"]
        self.result["checks"].append({"id": "diagnostic-test", "outcome": "failed", "evidence": "logs/failure.txt"})
        self.check()

    def test_exhausted_attempt_is_not_renewed(self):
        self.context["attempt"]["number"] = 4
        with self.assertRaisesRegex(contract.ContractError, "limit"):
            self.check()

    def test_duplicate_criteria_and_wrong_versions_are_rejected(self):
        self.result["acceptance"].append(copy.deepcopy(self.result["acceptance"][0]))
        with self.assertRaisesRegex(contract.ContractError, "duplicate"):
            self.check()
        self.result["acceptance"].pop()
        for version in [True, 2]:
            self.context["contract_version"] = version
            with self.assertRaisesRegex(contract.ContractError, "version"):
                self.check()

    def test_cli_uses_exact_bytes_and_rejects_duplicate_keys(self):
        with tempfile.TemporaryDirectory() as temp:
            context_path, result_path = Path(temp) / "context.json", Path(temp) / "result.json"
            context_path.write_bytes(self.raw)
            result_path.write_text(json.dumps(self.result))
            command = [sys.executable, str(CHECKER), str(context_path), str(result_path)]
            passed = subprocess.run(command, capture_output=True, text=True)
            self.assertEqual(passed.returncode, 0, passed.stdout + passed.stderr)
            self.assertEqual(json.loads(passed.stdout)["verification"], "record-only")
            context_path.write_bytes(self.raw + b"\n")
            self.assertEqual(subprocess.run(command, capture_output=True).returncode, 1)
            context_path.write_bytes(b'{"task_id":"one","task_id":"two"}')
            rejected = subprocess.run(command, capture_output=True, text=True)
            self.assertEqual(rejected.returncode, 1)
            self.assertIn("duplicate", json.loads(rejected.stdout)["error"])


class ExecutionInstallTests(unittest.TestCase):
    def test_selected_packs_include_their_runtime_dependencies(self):
        managed = ["phased-delivery", "bug-to-fix", "handoff", "phase-context-workflow", "auto-agent-contract"]
        retrying = ["ticket-sync", "ship-it", "pr-review-reply", "review-on-open"]
        with tempfile.TemporaryDirectory() as temp:
            for pack in managed + retrying + ["pr-improve", "system-design"]:
                with self.subTest(pack=pack):
                    target = Path(temp) / pack
                    installed = subprocess.run(
                        [str(ROOT / "install.sh"), "--harness", "all", pack, str(target)],
                        capture_output=True, text=True,
                    )
                    self.assertEqual(installed.returncode, 0, installed.stderr)
                    support = target / ".atb/shared/contracts"
                    refs = []
                    if pack in ["phased-delivery", "bug-to-fix", "auto-agent-contract", "pr-improve"]:
                        refs += ["test-driven-development.md"]
                    if pack in managed:
                        refs += ["execution.md", "execution-schema.md", "failure-recovery.md", "execution-lessons.md"]
                    if pack in managed + retrying:
                        refs += ["operation-retries.md", "posting.md", "providers.md"]
                    if pack == "pr-improve":
                        refs += ["failure-recovery.md", "execution-lessons.md"]
                    for ref in refs:
                        self.assertTrue((support / "references" / ref).is_file(), ref)
                    if "test-driven-development.md" in refs:
                        relative = "references/test-driven-development.md"
                        self.assertEqual((support / relative).read_bytes(),
                                         (ROOT / "shared/contracts" / relative).read_bytes())
                    if pack in managed:
                        checker = support / "scripts/validate-execution.py"
                        self.assertTrue(checker.is_file())
                        context = context_record()
                        raw = json.dumps(context).encode()
                        context_path, result_path = target / "context.json", target / "result.json"
                        context_path.write_bytes(raw)
                        result_path.write_text(json.dumps(result_record(context, raw)))
                        check = subprocess.run([sys.executable, str(checker), str(context_path), str(result_path)],
                                               capture_output=True, text=True)
                        self.assertEqual(check.returncode, 0, check.stdout + check.stderr)
                    if pack == "system-design":
                        for surface in [".atb", ".agents"]:
                            for name in ["repository-map.md", "design-method.md", "design-conversation.md",
                                         "architecture-diagrams.md", "decision-records.md"]:
                                installed_ref = target / surface / "skills/system-design/references" / name
                                self.assertTrue(installed_ref.is_file(), str(installed_ref))
                                if surface == ".agents":
                                    canonical = target / ".atb/skills/system-design/references" / name
                                    self.assertEqual(installed_ref.read_bytes(), canonical.read_bytes())
                        for name in ["system-design.md", "architecture-decision-record.md"]:
                            installed_template = target / ".atb/templates" / name
                            self.assertTrue(installed_template.is_file(), name)
                            self.assertEqual(installed_template.read_bytes(), (ROOT / "templates" / name).read_bytes())
                    if pack == "auto-agent-contract":
                        self.assertTrue((target / ".agents/skills/auto-agent-contract/references/execution-boundary.md").is_file())


if __name__ == "__main__":
    unittest.main()
