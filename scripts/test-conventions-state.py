#!/usr/bin/env python3
"""Exercise contribution-guide drift checks against real temporary Git repos."""

import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest


HELPER = Path(__file__).resolve().parents[1] / "skills/style-guide-init/scripts/conventions_state.py"


class ConventionStateTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(prefix="conventions-state-")
        self.addCleanup(self.temp.cleanup)
        self.repo = Path(self.temp.name) / "repo with spaces"
        self.repo.mkdir()
        self.git("init", "-q")
        self.git("config", "user.email", "fixture@example.invalid")
        self.git("config", "user.name", "Fixture")
        self.write("src/main.py", "VALUE = 1\n")
        self.write("CONTRIBUTING.md", "Run the configured checks.\n")
        self.write(".gitignore", "ignored/\n")
        self.git("add", ".")
        self.git("commit", "-qm", "fixture baseline")

    def git(self, *args):
        return subprocess.run(["git", "-C", str(self.repo), *args], check=True, capture_output=True)

    def write(self, path, content):
        target = self.repo / path
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(content)

    def call(self, operation, *args, expected=0):
        result = subprocess.run(
            [sys.executable, str(HELPER), operation, "--repo", str(self.repo),
             "--state", "docs/conventions-state.json", *args], capture_output=True, text=True
        )
        self.assertEqual(result.returncode, expected, result.stdout + result.stderr)
        return json.loads(result.stdout)

    def capture(self, *args):
        return self.call("capture", "--guide", "CONTRIBUTING.md", "--scope", ".", *args)

    def test_unchanged_and_content_returned_to_baseline(self):
        self.capture()
        self.assertEqual(self.call("check")["status"], "covered-inputs-unchanged")
        self.write("src/main.py", "VALUE = 2\n")
        self.assertEqual(self.call("check", expected=1)["sources"]["changed"], ["src/main.py"])
        self.write("src/main.py", "VALUE = 1\n")
        self.call("check")

    def test_staged_and_uncommitted_sources_are_snapshotted(self):
        self.write("src/main.py", "VALUE = 2\n")
        self.git("add", "src/main.py")
        self.write("src/new.py", "VALUE = 3\n")
        self.capture()
        self.call("check")
        self.write("src/new.py", "VALUE = 4\n")
        self.assertEqual(self.call("check", expected=1)["sources"]["changed"], ["src/new.py"])

    def test_added_deleted_and_renamed_paths(self):
        self.capture()
        (self.repo / "src/main.py").rename(self.repo / "src/renamed.py")
        self.write("new-package/package.json", "{}\n")
        result = self.call("check", expected=1)
        self.assertEqual(result["sources"]["deleted"], ["src/main.py"])
        self.assertEqual(result["sources"]["added"], ["new-package/package.json", "src/renamed.py"])

    def test_guide_edits_are_separate_and_check_does_not_write(self):
        self.capture()
        state = self.repo / "docs/conventions-state.json"
        before = state.read_bytes()
        self.write("CONTRIBUTING.md", "Human edit retained.\n")
        result = self.call("check", expected=1)
        self.assertEqual(result["guides"]["changed"], ["CONTRIBUTING.md"])
        self.assertEqual(result["sources"], {"added": [], "changed": [], "deleted": []})
        self.assertEqual(state.read_bytes(), before)

    def test_scope_exclusions_and_new_configuration(self):
        self.call("capture", "--guide", "CONTRIBUTING.md", "--scope", "src",
                  "--scope", "tool.toml", "--exclude", "src/vendor")
        self.write("src/vendor/generated.py", "generated\n")
        self.write("elsewhere/change.py", "outside scope\n")
        self.write("ignored/file.txt", "ignored\n")
        self.call("check")
        self.write("tool.toml", "enabled = true\n")
        self.assertEqual(self.call("check", expected=1)["sources"]["added"], ["tool.toml"])

    def test_secret_files_are_omitted_but_sample_env_is_covered(self):
        self.write(".env", "TOKEN=do-not-record\n")
        self.write(".env.production", "TOKEN=do-not-record\n")
        self.write("private.key", "do-not-record\n")
        self.write(".env.example", "TOKEN=<provided-at-runtime>\n")
        self.capture()
        state = (self.repo / "docs/conventions-state.json").read_text()
        sources = json.loads(state)["source_files"]
        self.assertIn(".env.example", sources)
        self.assertFalse({".env", ".env.production", "private.key"} & sources.keys())
        self.assertNotIn("do-not-record", state)

    def test_symlink_content_is_not_read_or_called_clean(self):
        outside = Path(self.temp.name) / "outside.txt"
        outside.write_text("outside private contents\n")
        (self.repo / "src/external").symlink_to(outside)
        self.capture()
        state = (self.repo / "docs/conventions-state.json").read_text()
        self.assertNotIn("outside private contents", state)
        self.assertEqual(self.call("check", expected=1)["unassessed_paths"], ["src/external"])

    def test_missing_malformed_and_unsupported_states_fail(self):
        self.call("check", expected=2)
        self.write("docs/conventions-state.json", "not json")
        self.call("check", expected=2)
        self.write("docs/conventions-state.json", '{"schema_version": 999}')
        self.call("check", expected=2)

    def test_checkpoint_cannot_escape_repository(self):
        outside = Path(self.temp.name) / "external-state"
        outside.mkdir()
        (self.repo / "docs").symlink_to(outside, target_is_directory=True)
        self.call(
            "capture", "--guide", "CONTRIBUTING.md", "--scope", ".", expected=2
        )
        self.assertEqual(list(outside.iterdir()), [])

    def test_commit_only_change_outside_scope_does_not_trigger(self):
        self.call("capture", "--guide", "CONTRIBUTING.md", "--scope", "src")
        self.write("notes.txt", "unrelated\n")
        self.git("add", "notes.txt")
        self.git("commit", "-qm", "outside scope")
        result = self.call("check")
        self.assertNotEqual(result["captured_head"], result["current_head"])

    def test_submodule_contents_are_unassessed(self):
        revision = self.git("rev-parse", "HEAD").stdout.decode().strip()
        self.git("update-index", "--add", "--cacheinfo", "160000," + revision + ",vendor/module")
        (self.repo / "vendor/module").mkdir(parents=True)
        self.capture()
        self.assertIn("vendor/module", self.call("check", expected=1)["unassessed_paths"])


class InstallationTests(unittest.TestCase):
    def test_all_harness_install_runs_the_shipped_helper(self):
        root = HELPER.parents[3]
        with tempfile.TemporaryDirectory(prefix="conventions-install-") as temporary:
            target = Path(temporary) / "project with spaces"
            result = subprocess.run(
                ["bash", str(root / "install.sh"), "--harness", "all", "style-guide-init", str(target)],
                capture_output=True, text=True,
            )
            self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
            for prefix in (".atb/skills/style-guide-init", ".agents/skills/style-guide-init"):
                for name in ("SKILL.md", "agents/openai.yaml", "references/extraction.md",
                             "references/maintenance.md", "scripts/conventions_state.py"):
                    self.assertTrue((target / prefix / name).is_file(), name)
                text = (target / prefix / "SKILL.md").read_text()
                self.assertIn(".atb/shared/contracts/references/style-precedence.md", text)
            for name in (".atb/templates/repository-contribution-guide.md",
                         ".atb/templates/repository-style-guide.md",
                         ".cursor/commands/style-guide-init.md", ".claude/commands/style-guide-init.md"):
                self.assertTrue((target / name).is_file(), name)
            installed = target / ".atb/skills/style-guide-init/scripts/conventions_state.py"
            self.assertEqual(installed.read_bytes(), HELPER.read_bytes())
            subprocess.run(["git", "-C", str(target), "init", "-q"], check=True, capture_output=True)
            (target / "CONTRIBUTING.md").write_text("Contribution fixture.\n")
            (target / "app.py").write_text("VALUE = 1\n")
            command = [sys.executable, str(installed)]
            common = ["--repo", str(target), "--state", "docs/conventions-state.json"]
            for args, code in [(["capture", *common, "--guide", "CONTRIBUTING.md", "--scope", "app.py"], 0),
                               (["check", *common], 0)]:
                result = subprocess.run([*command, *args], capture_output=True, text=True)
                self.assertEqual(result.returncode, code, result.stdout + result.stderr)
            (target / "app.py").write_text("VALUE = 2\n")
            result = subprocess.run([*command, "check", *common], capture_output=True, text=True)
            self.assertEqual(result.returncode, 1, result.stdout + result.stderr)
            self.assertEqual(json.loads(result.stdout)["sources"]["changed"], ["app.py"])
            self.assertEqual((target / "CONTRIBUTING.md").read_text(), "Contribution fixture.\n")


if __name__ == "__main__":
    unittest.main()
