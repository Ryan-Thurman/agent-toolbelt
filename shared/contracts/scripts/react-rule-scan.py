#!/usr/bin/env python3
"""List the React specialist rules that changed code triggers.

Usage:
  react-rule-scan.py [--base REF] [--repo DIR] [--skills-dir DIR] [--max-hits N] [PATH ...]

Without PATH, the scan reads the lines changed since the merge base with the
default branch: committed, staged, unstaged, and untracked files. With PATH,
the scan reads every line of the named files and directories.

The scan reads `references/rule-index.json` from each installed specialist
skill. `rules` lists the rules that the changed lines trigger. `judgment_rules`
lists the rules that no pattern can detect, for the installed specialists that
apply to the React files in scope. React Native rules apply only when a file
imports React Native or Expo. Output is JSON on stdout. Exit 0 on success and
2 on a usage or git error.
"""

import argparse
import json
import re
import subprocess
import sys
from pathlib import Path

SPECIALISTS = [
    "vercel-react-best-practices", "vercel-composition-patterns", "use-effect-killer",
    "vercel-react-native-skills", "vercel-react-view-transitions", "vercel-web-interface-guidelines",
]
SOURCE_SUFFIXES = {".js", ".jsx", ".ts", ".tsx", ".mjs", ".cjs", ".css", ".scss"}
SKIP_DIRS = {"node_modules", "dist", "build", ".next", "coverage", ".git", ".atb", ".atb-work"}
REACT_FILE = re.compile(
    r"""from\s+['"](react|react-dom|next)(/[^'"]*)?['"]|require\(['"](react|next)['"]\)|^\s*['"]use (client|server)['"]""",
    re.MULTILINE,
)
NATIVE_FILE = re.compile(
    r"""from\s+['"](?:react-native(?:-[\w-]+)?|expo(?:-[\w-]+)?|@expo/[\w-]+)(?:/[^'"]*)?['"]""")
# Specialists whose judgment rules apply only to React Native files.
NATIVE_ONLY = {"vercel-react-native-skills"}
HUNK = re.compile(r"^@@ -\d+(?:,\d+)? \+(\d+)(?:,(\d+))? @@")


class ScanError(Exception):
    pass


def git(repo, *args):
    done = subprocess.run(["git", "-C", str(repo), "-c", "core.quotepath=off", *args],
                          capture_output=True, text=True)
    if done.returncode != 0:
        raise ScanError(f"git {' '.join(args)}: {done.stderr.strip()}")
    return done.stdout


def ref_exists(repo, ref):
    return subprocess.run(["git", "-C", str(repo), "rev-parse", "--verify", "--quiet", f"{ref}^{{commit}}"],
                          capture_output=True).returncode == 0


def resolve_base(repo, override):
    if override:
        if not ref_exists(repo, override):
            raise ScanError(f"base ref not found: {override}")
        ref = override
    else:
        head = subprocess.run(["git", "-C", str(repo), "symbolic-ref", "-q", "--short", "refs/remotes/origin/HEAD"],
                              capture_output=True, text=True).stdout.strip()
        candidates = ([head] if head else []) + ["origin/main", "origin/master", "main", "master"]
        ref = next((c for c in candidates if ref_exists(repo, c)), None)
        if not ref:
            raise ScanError("cannot find the default branch; pass --base REF")
    merge_base = git(repo, "merge-base", "HEAD", ref).strip()
    return ref, merge_base


def is_source(path):
    return path.suffix in SOURCE_SUFFIXES and not (set(path.parts) & SKIP_DIRS)


def changed_lines(repo, merge_base):
    """Map each changed source file to its changed line numbers (None = whole file)."""
    result = {}
    current = None
    for line in git(repo, "diff", "-U0", "--no-color", "--diff-filter=d", merge_base, "--").splitlines():
        if line.startswith("+++ "):
            name = line[4:]
            current = name[2:] if name.startswith("b/") else None
            if current and is_source(Path(current)):
                result.setdefault(current, set())
            else:
                current = None
        elif current and (match := HUNK.match(line)):
            start, count = int(match.group(1)), int(match.group(2) or "1")
            result[current].update(range(start, start + count))
    for name in git(repo, "ls-files", "--others", "--exclude-standard").splitlines():
        if is_source(Path(name)):
            result[name] = None
    return {name: lines for name, lines in result.items() if lines is None or lines}


def named_files(repo, paths):
    result = {}
    for raw in paths:
        path = (repo / raw) if not Path(raw).is_absolute() else Path(raw)
        if not path.exists():
            raise ScanError(f"path not found: {raw}")
        files = [path] if path.is_file() else sorted(p for p in path.rglob("*") if p.is_file())
        for file in files:
            try:
                rel = file.resolve().relative_to(repo)
            except ValueError:
                rel = file.resolve()
            if is_source(Path(rel)):
                result[str(rel)] = None
    return result


def load_indexes(skills_dir):
    installed, missing, rules = [], [], []
    for skill in SPECIALISTS:
        index_path = skills_dir / skill / "references" / "rule-index.json"
        if not index_path.is_file():
            missing.append(skill)
            continue
        installed.append(skill)
        index = json.loads(index_path.read_text())
        for rule in index["rules"]:
            head = (skills_dir / skill / rule["path"]).read_text(errors="replace")[:600] \
                if (skills_dir / skill / rule["path"]).is_file() else ""
            impact = re.search(r"^impact:\s*(\S+)", head, re.MULTILINE)
            rules.append({
                "skill": skill,
                "path": str((skills_dir / skill / rule["path"]).resolve()),
                "rule": Path(rule["path"]).stem,
                "when": rule["when"],
                "fix": rule.get("fix", ""),
                "impact": impact.group(1) if impact else None,
                "signals": [re.compile(s) for s in rule.get("signals", [])],
                "file_signals": [re.compile(s, re.MULTILINE) for s in rule.get("file_signals", [])],
                "defer_to": rule.get("defer_to"),
            })
    active = [r for r in rules if not (r["defer_to"] and r["defer_to"] in installed)]
    scanned = [r for r in active if r["signals"] or r["file_signals"]]
    judged = [r for r in active if not (r["signals"] or r["file_signals"])]
    return installed, missing, scanned, judged


def judgment_list(judged, native):
    """Return the judgment-only rules that apply to the React files in scope."""
    return [{"skill": r["skill"], "rule": r["rule"], "path": r["path"], "when": r["when"], "fix": r["fix"]}
            for r in judged if native or r["skill"] not in NATIVE_ONLY]


def scan(repo, targets, rules, max_hits):
    hits = {id(rule): [] for rule in rules}
    react_files, native = [], False
    for name, wanted in sorted(targets.items()):
        try:
            text = (repo / name).read_text(errors="replace")
        except OSError:
            continue
        if REACT_FILE.search(text) or Path(name).suffix in {".jsx", ".tsx"}:
            react_files.append(name)
        native = native or bool(NATIVE_FILE.search(text))
        lines = text.splitlines()
        numbers = range(1, len(lines) + 1) if wanted is None else sorted(n for n in wanted if n <= len(lines))
        for rule in rules:
            if rule["file_signals"] and not any(p.search(text) for p in rule["file_signals"]):
                continue
            for number in numbers:
                if not rule["signals"] or any(p.search(lines[number - 1]) for p in rule["signals"]):
                    hits[id(rule)].append(f"{name}:{number}")
                    if not rule["signals"]:
                        break  # A file-level trigger needs one location per file.
    listed = []
    for rule in rules:
        if hits[id(rule)]:
            listed.append({"skill": rule["skill"], "rule": rule["rule"], "path": rule["path"],
                           "when": rule["when"], "fix": rule["fix"], "impact": rule["impact"], "hits": hits[id(rule)][:max_hits] if max_hits else hits[id(rule)], "hit_count": len(hits[id(rule)])})
    return react_files, native, listed


def main(argv):
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--base", help="base ref for changed-line mode (default: the default branch)")
    parser.add_argument("--repo", default=".", help="repository to scan (default: current directory)")
    parser.add_argument("--skills-dir", help="directory that holds the installed specialist skills")
    parser.add_argument("--max-hits", type=int, default=20, help="locations to print per rule; 0 prints all")
    parser.add_argument("paths", nargs="*", help="files or directories to scan in full")
    args = parser.parse_args(argv)

    skills_dir = Path(args.skills_dir) if args.skills_dir else Path(__file__).resolve().parents[3] / "skills"
    try:
        repo = Path(git(Path(args.repo), "rev-parse", "--show-toplevel").strip()).resolve()
        if args.paths:
            base_ref = merge_base = None
            targets = named_files(repo, args.paths)
        else:
            base_ref, merge_base = resolve_base(repo, args.base)
            targets = changed_lines(repo, merge_base)
        installed, missing, rules, judged = load_indexes(skills_dir)
        react_files, native, listed = scan(repo, targets, rules, args.max_hits)
    except (ScanError, json.JSONDecodeError, KeyError, re.error) as error:
        print(json.dumps({"error": str(error)}))
        return 2

    print(json.dumps({
        "mode": "paths" if args.paths else "changed",
        "base_ref": base_ref,
        "merge_base": merge_base,
        "source_files": sorted(targets),
        "react_files": react_files,
        "installed": installed,
        "missing": missing if react_files else [],
        "rules": listed,
        "judgment_rules": judgment_list(judged, native) if react_files else [],
        "next": ("No React files changed. Record the React rules check as Skipped."
                 if not react_files else
                 "Read every file in rules. Record each rule as Applied or Not applicable with a reason. "
                 "Compare the change with the when line of each judgment_rules entry. Read the path only "
                 "when the condition matches, and record that rule the same way. "
                 "Set severity with shared/contracts/references/react-acceptance.md."),
    }, indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
