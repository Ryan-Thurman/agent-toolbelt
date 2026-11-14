#!/usr/bin/env python3
"""Exercise fresh installs and migration from the former duplicate layout."""

import os
import shutil
import subprocess
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


class InstallLayoutTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(prefix="toolbelt-layout-")
        self.addCleanup(self.temp.cleanup)
        self.target = Path(self.temp.name) / "project with spaces"

    def install(self, *args, harness="all", success=True):
        result = subprocess.run(
            [str(ROOT / "install.sh"), "--harness", harness, *args, str(self.target)],
            capture_output=True, text=True,
        )
        self.assertEqual(result.returncode == 0, success, result.stdout + result.stderr)
        return result

    def write(self, name, data):
        file = self.target / name
        file.parent.mkdir(parents=True, exist_ok=True)
        file.write_bytes(data)
        return file

    def snapshot(self):
        return {
            str(file.relative_to(self.target)): (file.read_bytes(), file.stat().st_mode)
            for file in self.target.rglob("*") if file.is_file()
        }

    def legacy_install(self, duplicate=True):
        self.install("simplify", "auto-agent-contract")
        canonical = self.target / ".agents"
        shutil.copytree(canonical, self.target / ".atb")
        for file in self.target.rglob("*"):
            if file.is_file():
                file.write_bytes(file.read_bytes().replace(b".agents/", b".atb/"))
        if not duplicate:
            shutil.rmtree(canonical)
        for host in ["cursor", "claude"]:
            file = self.target / f".{host}/commands/simplify.md"
            file.write_text(file.read_text() + "Read .atb/skills/simplify/SKILL.md.\n")
        # Preserve user-owned text outside the installer block.
        for name in ["AGENTS.md", "CLAUDE.md"]:
            file = self.target / name
            file.write_text(
                "User text: .atb/user-owned.md\n"
                "<!-- BEGIN agent-toolbelt -->\n## Available workflows\n"
                "### simplify\n- `.atb/skills/simplify/`\n"
                "### auto-agent-contract\n- `.atb/skills/auto-agent-contract/`\n"
                "<!-- END agent-toolbelt -->\nUser footer.\n"
            )

    def test_fresh_install_has_one_tree_for_each_harness(self):
        for harness in ["cursor", "claude", "codex", "all"]:
            with self.subTest(harness=harness):
                self.target = Path(self.temp.name) / harness
                self.install("phased-delivery", harness=harness)
                self.assertFalse((self.target / ".atb").exists())
                for name in ["skills/phased-delivery/SKILL.md",
                             "skills/phased-delivery/agents/openai.yaml",
                             "shared/contracts/references/execution.md",
                             "templates/phased-delivery-plan.md",
                             "workflows/phased-delivery-workflow.md"]:
                    self.assertTrue((self.target / ".agents" / name).is_file(), name)
                for host in ["cursor", "claude"]:
                    command = self.target / f".{host}/commands/dev-implement-task.md"
                    self.assertEqual(command.is_file(), harness in [host, "all"])
                    if command.is_file():
                        self.assertIn("phased-delivery", command.read_text())
                        self.assertNotIn(".atb/", command.read_text())
                for name in ["AGENTS.md", "CLAUDE.md"]:
                    pointer = self.target / name
                    expected = harness in (["claude", "all"] if name == "CLAUDE.md" else ["cursor", "codex", "all"])
                    self.assertEqual(pointer.is_file(), expected)
                    if expected:
                        self.assert_compact_instructions(pointer.read_text())
                rule = self.target / ".cursor/rules/agent-toolbelt-router.mdc"
                self.assertEqual(rule.is_file(), harness in ["cursor", "all"])
                if rule.is_file():
                    text = rule.read_text()
                    self.assertIn("alwaysApply: true", text)
                    self.assert_writing_paths(text)

    def assert_writing_paths(self, text):
        for name in ["human-readable-output.md", "docs-writing.md"]:
            path = f".agents/shared/contracts/references/{name}"
            self.assertIn(path, text)
            self.assertTrue((self.target / path).is_file(), path)

    def assert_compact_instructions(self, text):
        self.assertLessEqual(len(text.splitlines()), 15)
        self.assertEqual(text.count("<!-- BEGIN agent-toolbelt -->"), 1)
        self.assertEqual(text.count("<!-- END agent-toolbelt -->"), 1)
        self.assertNotIn("### ", text)
        self.assert_writing_paths(text)
        self.assertIn(".agents/skills/", text)
        self.assertIn("templates", text)

    def test_existing_catalog_shrinks_and_stays_small_when_packs_are_added(self):
        prefix = "# Team instructions\nKeep project policy.\n\n"
        suffix = "\n# Local instructions\nKeep these too.\n"
        catalog = "<!-- BEGIN agent-toolbelt -->\n## Available workflows\n"
        catalog += "### old-pack\nDescription.\nCommands:\n- `/old-command`\n" * 40
        catalog += "<!-- END agent-toolbelt -->\n"
        for name in ["AGENTS.md", "CLAUDE.md"]:
            self.write(name, (prefix + catalog + suffix).encode())
        self.install("simplify")
        for name in ["AGENTS.md", "CLAUDE.md"]:
            text = (self.target / name).read_text()
            self.assertTrue(text.startswith(prefix))
            self.assertTrue(text.endswith(suffix))
            self.assert_compact_instructions(text[len(prefix):-len(suffix)])
        before = {name: (self.target / name).read_bytes() for name in ["AGENTS.md", "CLAUDE.md"]}
        self.install("handoff")
        for name, content in before.items():
            self.assertEqual((self.target / name).read_bytes(), content)
        for pack in ["simplify", "handoff"]:
            self.assertTrue((self.target / f".agents/skills/{pack}/SKILL.md").is_file())

    def test_hooks_only_install_includes_the_referenced_writing_rules(self):
        self.install("cursor-hooks", harness="cursor")
        self.assert_compact_instructions((self.target / "AGENTS.md").read_text())
        self.assert_writing_paths((self.target / ".cursor/rules/agent-toolbelt-router.mdc").read_text())

    def test_existing_cursor_rules_are_preserved_without_force(self):
        old_rule = b"---\nalwaysApply: true\n---\nKeep local routing instructions.\n"
        self.write(".cursor/rules/agent-toolbelt-router.mdc", old_rule)
        self.write(".cursor/rules/team.mdc", b"Team policy.\n")
        self.install("simplify", harness="cursor")
        rule = self.target / ".cursor/rules/agent-toolbelt-router.mdc"
        self.assertEqual(rule.read_bytes(), old_rule)
        self.assert_compact_instructions((self.target / "AGENTS.md").read_text())
        self.install("--force", "simplify", harness="cursor")
        self.assert_writing_paths(rule.read_text())
        self.assertEqual((self.target / ".cursor/rules/team.mdc").read_bytes(), b"Team policy.\n")

    def test_upgrade_merges_duplicates_and_keeps_unselected_packs(self):
        self.legacy_install()
        self.write(".agents/skills/local/SKILL.md", b"Local skill.\n")
        self.write(".cursor/commands/local.md", b"User path: .atb/local.md\n")
        self.write(".cursor/commands/retired.md", b"Read .atb/templates/old.md\n")
        self.write(".cursor/rules/retired.mdc", b"Read .atb/skills/simplify/SKILL.md\n")
        self.write(".atb-work/notes.txt", b"Scratch.\n")
        binary = self.write(".atb/examples/binary.dat", b"\x00\xff.atb/bytes\n")
        executable = self.write(".atb/skills/local/run.sh", b"#!/bin/sh\necho .atb/templates/a.md\n")
        executable.chmod(0o755)
        binary_bytes = binary.read_bytes()
        # Install a different pack without --force. Both prior packs must survive.
        self.install("handoff")
        self.assertFalse((self.target / ".atb").exists())
        self.assertEqual((self.target / ".agents/examples/binary.dat").read_bytes(), binary_bytes)
        script = self.target / ".agents/skills/local/run.sh"
        self.assertTrue(os.access(script, os.X_OK))
        self.assertIn(b".agents/templates/a.md", script.read_bytes())
        self.assertEqual((self.target / ".agents/skills/local/SKILL.md").read_text(), "Local skill.\n")
        self.assertEqual((self.target / ".cursor/commands/local.md").read_text(), "User path: .atb/local.md\n")
        self.assertEqual((self.target / ".cursor/commands/retired.md").read_text(), "Read .agents/templates/old.md\n")
        self.assertIn(".agents/skills/", (self.target / ".cursor/rules/retired.mdc").read_text())
        self.assertEqual((self.target / ".atb-work/notes.txt").read_text(), "Scratch.\n")
        for name in ["simplify", "auto-agent-contract", "auto-agent-dev-lite", "handoff"]:
            skill = self.target / f".agents/skills/{name}/SKILL.md"
            self.assertTrue(skill.is_file(), name)
            self.assertNotIn(".atb/", skill.read_text())
        for host in ["cursor", "claude"]:
            self.assertIn(".agents/skills/", (self.target / f".{host}/commands/simplify.md").read_text())
            self.assertNotIn(".atb/", (self.target / f".{host}/commands/auto-agent-plan.md").read_text())
        for name in ["AGENTS.md", "CLAUDE.md"]:
            text = (self.target / name).read_text()
            self.assertTrue(text.startswith("User text: .atb/user-owned.md\n"))
            block = text.split("<!-- BEGIN agent-toolbelt -->", 1)[1]
            self.assertNotIn(".atb/", block)
            self.assertNotIn("### ", block)
            self.assertTrue(text.endswith("User footer.\n"))
        before = self.snapshot()
        self.install("handoff")
        self.assertEqual(before, self.snapshot())

    def test_upgrade_from_claude_only_tree(self):
        self.legacy_install(duplicate=False)
        self.install("simplify", harness="claude")
        self.assertFalse((self.target / ".atb").exists())
        self.assertTrue((self.target / ".agents/skills/auto-agent-contract/SKILL.md").is_file())
        self.assertIn(".agents/skills/", (self.target / ".claude/commands/simplify.md").read_text())

    def test_dry_run_preserves_all_files(self):
        self.legacy_install()
        before = self.snapshot()
        result = self.install("--dry-run", "handoff")
        self.assertIn("would migrate", result.stdout)
        self.assertEqual(before, self.snapshot())
        self.assertTrue((self.target / ".atb").is_dir())

    def test_conflicts_stop_before_migration_even_with_force(self):
        self.legacy_install()
        file = self.target / ".agents/skills/simplify/SKILL.md"
        file.write_text(file.read_text() + "Local edit.\n")
        before = self.snapshot()
        for args in [("handoff",), ("--force", "handoff"), ("--dry-run", "handoff")]:
            with self.subTest(args=args):
                result = self.install(*args, success=False)
                self.assertIn("migration conflict", result.stderr)
                self.assertEqual(before, self.snapshot())

    def test_symlink_destination_stops_before_migration(self):
        self.write(".atb/templates/file.md", b"Legacy.\n")
        outside = Path(self.temp.name) / "outside"
        outside.mkdir()
        (self.target / ".agents").mkdir()
        (self.target / ".agents/templates").symlink_to(outside, target_is_directory=True)
        result = self.install("handoff", success=False)
        self.assertIn("link or special file", result.stderr)
        self.assertFalse(list(outside.iterdir()))
        self.assertTrue((self.target / ".atb/templates/file.md").is_file())


if __name__ == "__main__":
    unittest.main()
