#!/usr/bin/env python3
"""Check that the writing rule sources stay consistent.

1. Imported upstream writing text is unchanged from its pinned version.
2. The imported writing skill points to the single "Writing precedence" section.
3. Every tracked Toolbelt-authored .md and .mdc file obeys the mechanical rules
   of that section. Upstream, generated, and mirrored text is excluded (EXCLUDED).

Usage: check-writing-rules.py [--files PATH [PATH ...]] [--summary] [--print-hashes]
  (no option)     run all checks on every linted file, one line per finding
  --files PATHS   lint only these files. Pass each path as its own argument.
                  An argument that is not an existing file stops the run with
                  exit code 2. An excluded file is skipped with a note on stderr.
                  Skip the pinned-hash and pointer checks.
  --summary       print a count of findings per file (most first) and a total,
                  in place of one line per finding; combines with --files
  --print-hashes  print the current hash of each pinned upstream file
Exit 0 when every check passes, 1 when a check fails, and 2 for a usage error.
"""

import hashlib
import re
import subprocess
import sys
from fnmatch import fnmatch
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = "shared/contracts/references/human-readable-output.md"
POINTER = 'The "Writing precedence" section in `shared/contracts/references/human-readable-output.md`'

# sha256 of upstream text. Update a hash only with a deliberate upstream import.
PINNED = {
    "skills/simple-english/SKILL.md#body": "12429341bdbd58886b8e312027cc6619d52db7980c588e97dd776748b26020a9",
    "skills/simple-english/references/rule-catalog.md": "49175a0614ffe23fd7e9889964015cbd1126be52f19363288e665b6be41d1213",
    "skills/simple-english/references/strict-vocabulary.md": "3f34ef3a878d9dc83de68191b5ddd6220fdb4e3c99eafc89425adfabd46258a7",
    "skills/simple-english/references/word-swaps.md": "4a0056cbc9e5faf2132a2b172ac82f684d30fbf8c0914e86f966666a116ab55f",
    "skills/simple-english/references/use-cases.md": "ac0e7129107693a45f641c1285ba33d996d4567495c6b009b9020cb8e7968229",
    "skills/simple-english/references/trope-list.md": "1cb25dcd4f3289d0e0b8cf5da43d6b1db50b930518f81d9ae9edc4200109d6ce",
    "skills/simple-english/references/tropes.md": "df0975bf1b6dd02f94cee7b703c911cf6ed99f7695001991e3d102f8d4ab98ed",
}

# Paths that the linter skips. Each group is upstream, generated, or mirrored text.
EXCLUDED = {
    # Upstream text with a pinned hash (compared without the #body suffix).
    "pinned": {key.partition("#")[0] for key in PINNED},
    # Directories and files of generated, example, history, or license text.
    "globs": ["portal/**", "examples/**", "CHANGELOG.md", "LICENSE*", "node_modules/**"],
    # Imported rule files live under any references/rules/ directory.
    "contains": ["/references/rules/"],
    # Upstream attribution files, by file name.
    "names": ["upstream-attribution.md"],
    # One imported reference file that Toolbelt does not author.
    "exact": ["skills/use-effect-killer/references/anti-patterns.md"],
    # Vercel skills are upstream: only these two SKILL.md files are linted.
    "vercel_keep": ["skills/vercel-react-native-skills/SKILL.md",
                    "skills/vercel-web-interface-guidelines/SKILL.md"],
    # Mirrors that are byte copies of linted sources.
    "mirrors": [".agents/skills/**", ".cursor/commands/**"],
}

PROPER = {"React", "Native", "Expo", "Next.js", "TypeScript", "JavaScript", "ESLint", "Biome", "Oxlint",
          "ASD-STE100", "STE", "Vercel", "CRAP", "UI", "API", "PR", "Markdown", "Server", "Actions",
          "GitHub", "Azure", "Cursor", "Claude", "Codex", "Playwright", "Gherkin", "Jira", "Toolbelt",
          "Given", "When", "Then"}
# Multiword product names: removed from a heading before the title-case test.
PRODUCTS = ["Claude Code", "Azure Repos", "Azure Boards", "GitHub Issues", "Agent Toolbelt Auto Agent"]
RULES = [
    ("em dash", re.compile("—")),
    ("unicode arrow", re.compile("[←-⇿]")),
    ("curly quote", re.compile("[‘’“”]")),
    ("contraction", re.compile(r"\b\w+(n't|'re|'ll|'ve|'d)\b|\b(it's|that's|there's|what's|let's)\b", re.I)),
    ("banned modal", re.compile(r"\b(should|would|may|might|could)\b", re.I)),
    ("semicolon", re.compile(";")),
    ("signposted conclusion", re.compile(r"\b(in conclusion|to sum up|in summary)\b", re.I)),
]


def upstream_body(path):
    """Return the upstream part of an imported SKILL.md: after frontmatter, before Toolbelt text."""
    text = (ROOT / path).read_text()
    body = text.split("\n---\n", 1)[1]
    marker = "\n## Toolbelt precedence"
    if marker in body:
        body = body[:body.index(marker)]
    return body.strip() + "\n"


def digest(key):
    path, _, part = key.partition("#")
    text = upstream_body(path) if part == "body" else (ROOT / path).read_text()
    return hashlib.sha256(text.encode()).hexdigest()


def is_excluded(path):
    """Return True when path holds upstream, generated, or mirrored text."""
    ex = EXCLUDED
    if path in ex["pinned"] or path in ex["exact"]:
        return True
    if any(fnmatch(path, g) for g in ex["globs"] + ex["mirrors"]):
        return True
    if any(part in path for part in ex["contains"]):
        return True
    if Path(path).name in ex["names"]:
        return True
    if path.startswith("skills/vercel-") and path not in ex["vercel_keep"]:
        return True
    return False


def linted_files():
    """Return every tracked .md and .mdc file that is Toolbelt-authored and on disk."""
    out = subprocess.run(["git", "ls-files", "*.md", "*.mdc"], cwd=ROOT, capture_output=True,
                         text=True, check=True).stdout.splitlines()
    return sorted(p for p in out if (ROOT / p).is_file() and not is_excluded(p))


def prose_lines(text):
    """Yield (line number, prose) with code, quoted examples, comments, and link targets removed."""
    fenced = False
    for number, line in enumerate(text.splitlines(), 1):
        if line.lstrip().startswith("```"):
            fenced = not fenced
            continue
        if fenced or re.fullmatch(r"\s*\|?[\s:|-]+\|?\s*", line) and "-" in line and "|" in line:
            continue
        line = re.sub(r"<!--.*?-->", "", line)
        line = re.sub(r"`[^`]*`", "", line)
        line = re.sub(r'"[^"]*"', "", line)
        line = re.sub(r"(\[[^\]]*\])\([^)]*\)", r"\1", line)
        line = re.sub(r"&#?\w+;", "", line)
        line = re.sub(r"\bshould-fix\b", "", line, flags=re.I)
        yield number, line


def title_case(heading):
    heading = re.sub(r"`[^`]*`", "", heading).strip()
    heading = re.sub(r"^/[\w:-]+\s*", "", heading)
    for product in PRODUCTS:
        heading = heading.replace(product, "product")
    words = [w for w in re.findall(r"[A-Za-z][\w.-]*", heading)[1:] if len(w) > 3]
    capital = [w for w in words if w[0].isupper() and w not in PROPER and not re.match(r"[A-Z]{2,}", w)]
    return bool(capital)


def lint(path):
    """Return the finding names with line numbers for one file."""
    text = (ROOT / path).read_text()
    body = text.split("\n---\n", 1)[1] if text.startswith("---\n") else text
    offset = text.count("\n", 0, len(text) - len(body))
    found = []
    for number, line in prose_lines(body):
        for name, pattern in RULES:
            if pattern.search(line):
                found.append((number + offset, name))
        if line.startswith("#") and title_case(line.lstrip("#").strip()):
            found.append((number + offset, "title case heading"))
    return found


def main(argv):
    if argv == ["--print-hashes"]:
        for key in PINNED:
            print(f'    "{key}": "{digest(key)}",')
        return 0
    summary = "--summary" in argv
    rest = [a for a in argv if a != "--summary"]
    files = None
    if rest:
        if rest[0] != "--files" or len(rest) < 2:
            print(__doc__, file=sys.stderr)
            return 2
        files = []
        missing = []
        for arg in rest[1:]:
            path = Path(arg)
            full = path if path.is_absolute() else ROOT / path
            if not full.is_file():
                missing.append(arg)
                continue
            try:
                files.append(str(full.resolve().relative_to(ROOT)))
            except ValueError:
                files.append(str(full.resolve()))  # a file outside the repository, such as a draft
        if missing:
            for arg in missing:
                print(f"error: --files argument is not an existing file: {arg!r}", file=sys.stderr)
            print("pass each path as a separate argument (for example with xargs)", file=sys.stderr)
            return 2
    errors = []
    if files is None:
        for key, expected in PINNED.items():
            if digest(key) != expected:
                errors.append(f"{key}: upstream text changed; restore it or re-import with a new pin")
        for path in ["skills/simple-english/SKILL.md"]:
            if POINTER not in (ROOT / path).read_text():
                errors.append(f"{path}: missing the pointer to the Writing precedence section")
        if "## Writing precedence" not in (ROOT / OUTPUT).read_text():
            errors.append(f"{OUTPUT}: missing the Writing precedence section")
        targets = linted_files()
    else:
        targets = []
        for f in files:
            if is_excluded(f):
                print(f"excluded: {f} is covered by the exclusion set and was not linted", file=sys.stderr)
            else:
                targets.append(f)
    counts = {}
    for path in targets:
        for number, name in lint(path):
            counts[path] = counts.get(path, 0) + 1
            if not summary:
                errors.append(f"{path}:{number}: {name}")
    if summary:
        for path, n in sorted(counts.items(), key=lambda kv: (-kv[1], kv[0])):
            print(f"{n:6d}  {path}")
        print(f"{sum(counts.values()):6d}  total")
    for error in errors:
        print(f"! {error}", file=sys.stderr)
    if errors or counts:
        return 1
    if files is not None:
        noun = "file" if len(targets) == 1 else "files"
        print(f"ok: {len(targets)} {noun} linted, no findings")
        return 0
    print("ok: writing sources are pinned, point to one precedence order, and pass the mechanical rules")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
