#!/usr/bin/env python3
"""Exercise the React rule scan against fixture repositories and real installs."""

import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

sys.dont_write_bytecode = True
ROOT = Path(__file__).resolve().parents[1]
SCANNER = ROOT / "shared/contracts/scripts/react-rule-scan.py"

EFFECT_COMPONENT = """import { useEffect, useState } from 'react';

export function Name({ first, last }) {
  const [full, setFull] = useState('');
  useEffect(() => {
    setFull(first + ' ' + last);
  }, [first, last]);
  return <p>{full}</p>;
}
"""

SERVER_ACTION = """'use server'

export async function deleteUser(id: string) {
  await db.user.delete({ where: { id } })
}
"""


NATIVE_COMPONENT = """import { Text, View } from 'react-native';

export function Count({ count }: { count: number }) {
  return <View>{count && <Text>{count} items</Text>}</View>;
}
"""

VIEW_TRANSITION = """import { ViewTransition } from 'react';

export function Detail({ id }: { id: string }) {
  return <ViewTransition name={`photo-${id}`}><img src={`/p/${id}.jpg`} /></ViewTransition>;
}
"""


def run(cmd, cwd):
    done = subprocess.run(cmd, cwd=cwd, capture_output=True, text=True)
    if done.returncode != 0:
        raise AssertionError(f"{cmd}: {done.stdout}{done.stderr}")
    return done.stdout


def scan(repo, *args, scanner=SCANNER):
    done = subprocess.run([sys.executable, str(scanner), "--repo", str(repo), *args],
                          capture_output=True, text=True)
    return done.returncode, json.loads(done.stdout)


def write_index(skills, skill, rules):
    path = skills / skill / "references" / "rule-index.json"
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps({"skill": skill, "rules": rules}))


class FixtureRepo:
    def __init__(self, temp):
        self.repo = Path(temp) / "repo"
        self.repo.mkdir()
        run(["git", "init", "-q", "-b", "main"], self.repo)
        run(["git", "config", "user.email", "test@example.com"], self.repo)
        run(["git", "config", "user.name", "Test"], self.repo)
        (self.repo / "src").mkdir()
        (self.repo / "src/base.tsx").write_text("export const Base = () => null;\n")
        (self.repo / "README.md").write_text("fixture\n")
        run(["git", "add", "."], self.repo)
        run(["git", "commit", "-q", "-m", "base"], self.repo)
        run(["git", "checkout", "-q", "-b", "feature"], self.repo)

    def write(self, rel, text):
        path = self.repo / rel
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(text)

    def commit(self):
        run(["git", "add", "."], self.repo)
        run(["git", "commit", "-q", "-m", "change"], self.repo)


class ScannerLogicTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.fixture = FixtureRepo(self.temp.name)
        self.skills = Path(self.temp.name) / "skills"
        write_index(self.skills, "use-effect-killer", [
            {"path": "references/anti-patterns.md", "when": "Effects.", "signals": [r"\buseEffect\s*\("]},
        ])
        write_index(self.skills, "vercel-react-best-practices", [
            {"path": "references/rules/derived.md", "when": "Derived.", "signals": [r"\buseEffect\s*\("],
             "defer_to": "use-effect-killer"},
            {"path": "references/rules/auth.md", "when": "Auth.", "signals": [],
             "file_signals": [r"^\s*['\"]use server['\"]"]},
            {"path": "references/rules/judged.md", "when": "Judged.", "signals": []},
        ])

    def tearDown(self):
        self.temp.cleanup()

    def scan(self, *args):
        return scan(self.fixture.repo, "--skills-dir", str(self.skills), *args)

    def listed(self, result):
        return {(r["skill"], r["rule"]): r for r in result["rules"]}

    def test_no_react_change_reports_skip(self):
        self.fixture.write("README.md", "changed\n")
        code, result = self.scan("--base", "main")
        self.assertEqual(code, 0)
        self.assertEqual(result["react_files"], [])
        self.assertEqual(result["rules"], [])
        self.assertIn("Skipped", result["next"])

    def test_committed_staged_unstaged_and_untracked_lines_are_scanned(self):
        self.fixture.write("src/committed.tsx", EFFECT_COMPONENT)
        self.fixture.commit()
        self.fixture.write("src/staged.tsx", EFFECT_COMPONENT)
        run(["git", "add", "src/staged.tsx"], self.fixture.repo)
        self.fixture.write("src/base.tsx", "import { useEffect } from 'react';\nuseEffect(() => {}, []);\n")
        self.fixture.write("src/untracked.tsx", EFFECT_COMPONENT)
        _, result = self.scan("--base", "main")
        hits = self.listed(result)[("use-effect-killer", "anti-patterns")]["hits"]
        self.assertEqual(sorted(hits), ["src/base.tsx:2", "src/committed.tsx:5", "src/staged.tsx:5", "src/untracked.tsx:5"])

    def test_unchanged_lines_are_not_scanned(self):
        self.fixture.write("src/old.tsx", EFFECT_COMPONENT)
        self.fixture.commit()
        run(["git", "branch", "-f", "main", "HEAD"], self.fixture.repo)
        self.fixture.write("src/old.tsx", EFFECT_COMPONENT + "export const extra = 1;\n")
        _, result = self.scan("--base", "main")
        self.assertEqual(result["react_files"], ["src/old.tsx"])
        self.assertNotIn(("use-effect-killer", "anti-patterns"), self.listed(result))

    def test_defer_to_installed_skill_hides_duplicate_rule(self):
        self.fixture.write("src/effect.tsx", EFFECT_COMPONENT)
        _, result = self.scan("--base", "main")
        self.assertNotIn(("vercel-react-best-practices", "derived"), self.listed(result))
        (self.skills / "use-effect-killer/references/rule-index.json").unlink()
        _, result = self.scan("--base", "main")
        self.assertIn(("vercel-react-best-practices", "derived"), self.listed(result))
        self.assertEqual(result["missing"], ["vercel-composition-patterns", "use-effect-killer",
                                             "vercel-react-native-skills", "vercel-react-view-transitions",
                                             "vercel-web-interface-guidelines"])

    def test_file_signal_lists_rule_once_per_file(self):
        self.fixture.write("app/actions.ts", SERVER_ACTION)
        _, result = self.scan("--base", "main")
        auth = self.listed(result)[("vercel-react-best-practices", "auth")]
        self.assertEqual(auth["hits"], ["app/actions.ts:1"])
        self.assertNotIn(("vercel-react-best-practices", "judged"), self.listed(result))

    def test_path_mode_scans_whole_files_and_max_hits(self):
        self.fixture.write("src/a.tsx", EFFECT_COMPONENT * 3)
        self.fixture.commit()
        _, result = self.scan("--max-hits", "2", "src")
        rule = self.listed(result)[("use-effect-killer", "anti-patterns")]
        self.assertEqual(result["mode"], "paths")
        self.assertEqual(rule["hit_count"], 3)
        self.assertEqual(len(rule["hits"]), 2)

    def test_errors_are_json_with_exit_2(self):
        code, result = self.scan("--base", "no-such-ref")
        self.assertEqual(code, 2)
        self.assertIn("base ref not found", result["error"])


class RealIndexTests(unittest.TestCase):
    def test_real_indexes_route_effects_and_server_actions(self):
        with tempfile.TemporaryDirectory() as temp:
            fixture = FixtureRepo(temp)
            fixture.write("src/effect.tsx", EFFECT_COMPONENT)
            fixture.write("app/actions.ts", SERVER_ACTION)
            code, result = scan(fixture.repo, "--skills-dir", str(ROOT / "skills"), "--base", "main")
            self.assertEqual(code, 0, result)
            listed = {(r["skill"], r["rule"]) for r in result["rules"]}
            self.assertIn(("use-effect-killer", "anti-patterns"), listed)
            self.assertIn(("vercel-react-best-practices", "server-auth-actions"), listed)
            self.assertNotIn(("vercel-react-best-practices", "rerender-derived-state-no-effect"), listed)
            for rule in result["rules"]:
                self.assertTrue(Path(rule["path"]).is_file(), rule["path"])
            auth = next(r for r in result["rules"] if r["rule"] == "server-auth-actions")
            self.assertEqual(auth["impact"], "CRITICAL")
            self.assertTrue(auth["fix"])

    def test_real_indexes_route_native_and_view_transitions(self):
        with tempfile.TemporaryDirectory() as temp:
            fixture = FixtureRepo(temp)
            fixture.write("app/Count.tsx", NATIVE_COMPONENT)
            fixture.write("src/Detail.tsx", VIEW_TRANSITION)
            fixture.write("src/detail.css", ".photo { transition: all 200ms; }\n")
            code, result = scan(fixture.repo, "--skills-dir", str(ROOT / "skills"), "--base", "main")
            self.assertEqual(code, 0, result)
            listed = {(r["skill"], r["rule"]) for r in result["rules"]}
            self.assertIn(("vercel-react-native-skills", "rendering-no-falsy-and"), listed)
            self.assertIn(("vercel-react-view-transitions", "SKILL"), listed)
            self.assertIn(("vercel-web-interface-guidelines", "guidelines"), listed)
            guideline = next(r for r in result["rules"] if r["skill"] == "vercel-web-interface-guidelines")
            self.assertEqual(sorted(guideline["hits"]), ["src/Detail.tsx:4", "src/detail.css:1"])
            native = [r for r in result["rules"] if r["skill"] == "vercel-react-native-skills"]
            self.assertTrue(all(h.startswith("app/Count.tsx") for r in native for h in r["hits"]), native)

    def test_installed_scanner_finds_installed_skills(self):
        with tempfile.TemporaryDirectory() as temp:
            fixture = FixtureRepo(temp)
            run([str(ROOT / "install.sh"), "--harness", "all", "react-quality", str(fixture.repo)], ROOT)
            fixture.write("src/effect.tsx", EFFECT_COMPONENT)
            installed = fixture.repo / ".atb/shared/contracts/scripts/react-rule-scan.py"
            code, result = scan(fixture.repo, "--base", "main", scanner=installed)
            self.assertEqual(code, 0, result)
            self.assertEqual(result["installed"], ["vercel-react-best-practices", "vercel-composition-patterns",
                                                   "use-effect-killer", "vercel-react-view-transitions",
                                                   "vercel-web-interface-guidelines"])
            self.assertEqual(result["source_files"], ["src/effect.tsx"])
            self.assertIn(("use-effect-killer", "anti-patterns"), {(r["skill"], r["rule"]) for r in result["rules"]})


if __name__ == "__main__":
    unittest.main()
