#!/usr/bin/env python3
"""Check that the writing rule sources stay consistent.

1. Imported upstream writing text is unchanged from its pinned version.
2. Each imported writing skill points to the single "Writing precedence" section.
3. Toolbelt-authored writing files obey the mechanical rules of that section.

Usage: check-writing-rules.py
Exit 0 when every check passes, and 1 when a check fails.
"""

import hashlib
import re
import sys
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
    "skills/writing-whip/SKILL.md#body": "1cb25dcd4f3289d0e0b8cf5da43d6b1db50b930518f81d9ae9edc4200109d6ce",
    "skills/writing-whip/references/tropes.md": "df0975bf1b6dd02f94cee7b703c911cf6ed99f7695001991e3d102f8d4ab98ed",
}

# Toolbelt-authored files that must follow the mechanical writing rules.
LINTED = [
    OUTPUT,
    "shared/contracts/references/docs-writing.md",
    "shared/contracts/references/react-acceptance.md",
    "skills/use-effect-killer/SKILL.md",
    "skills/vercel-react-native-skills/SKILL.md",
    "skills/vercel-web-interface-guidelines/SKILL.md",
]

PROPER = {"React", "Native", "Expo", "Next.js", "TypeScript", "JavaScript", "ESLint", "Biome", "Oxlint",
          "ASD-STE100", "STE", "Vercel", "CRAP", "UI", "API", "PR", "Markdown", "Server", "Actions"}
RULES = [
    ("em dash", re.compile("—")),
    ("unicode arrow", re.compile("[←-⇿]")),
    ("curly quote", re.compile("[‘’“”]")),
    ("contraction", re.compile(r"\b\w+(n't|'re|'ll|'ve|'d)\b|\b(it's|that's|there's|what's|let's)\b", re.I)),
    ("banned modal", re.compile(r"\b(should|would|may|might|could)\b", re.I)),
    ("signposted conclusion", re.compile(r"\b(in conclusion|to sum up|in summary)\b", re.I)),
]


def upstream_body(path):
    """Return the upstream part of an imported SKILL.md: after frontmatter, before Toolbelt text."""
    text = (ROOT / path).read_text()
    body = text.split("\n---\n", 1)[1]
    for marker in ("\nFor the full trope catalog", "\n## Toolbelt precedence"):
        if marker in body:
            body = body[:body.index(marker)]
            break
    return body.strip() + "\n"


def digest(key):
    path, _, part = key.partition("#")
    text = upstream_body(path) if part == "body" else (ROOT / path).read_text()
    return hashlib.sha256(text.encode()).hexdigest()


def prose_lines(text):
    """Yield (line number, prose) with code, inline code, and quoted examples removed."""
    fenced = False
    for number, line in enumerate(text.splitlines(), 1):
        if line.lstrip().startswith("```"):
            fenced = not fenced
            continue
        if fenced:
            continue
        line = re.sub(r"`[^`]*`", "", line)
        line = re.sub(r'"[^"]*"', "", line)
        line = re.sub(r"\bshould-fix\b", "", line, flags=re.I)
        yield number, line


def title_case(heading):
    words = [w for w in re.findall(r"[A-Za-z][\w.-]*", heading)[1:] if len(w) > 3]
    capital = [w for w in words if w[0].isupper() and w not in PROPER and not re.match(r"[A-Z]{2,}", w)]
    return bool(capital)


def main(argv):
    errors = []
    if argv == ["--print-hashes"]:
        for key in PINNED:
            print(f'    "{key}": "{digest(key)}",')
        return 0
    for key, expected in PINNED.items():
        if digest(key) != expected:
            errors.append(f"{key}: upstream text changed; restore it or re-import with a new pin")
    for path in ["skills/simple-english/SKILL.md", "skills/writing-whip/SKILL.md"]:
        if POINTER not in (ROOT / path).read_text():
            errors.append(f"{path}: missing the pointer to the Writing precedence section")
    if "## Writing precedence" not in (ROOT / OUTPUT).read_text():
        errors.append(f"{OUTPUT}: missing the Writing precedence section")
    for path in LINTED:
        text = (ROOT / path).read_text()
        body = text.split("\n---\n", 1)[1] if text.startswith("---\n") else text
        offset = text.count("\n", 0, len(text) - len(body))
        for number, line in prose_lines(body):
            for name, pattern in RULES:
                if pattern.search(line):
                    errors.append(f"{path}:{number + offset}: {name}")
            if line.startswith("#") and title_case(line.lstrip("#").strip()):
                errors.append(f"{path}:{number + offset}: title case heading")
    for error in errors:
        print(f"! {error}", file=sys.stderr)
    if errors:
        return 1
    print("ok: writing sources are pinned, point to one precedence order, and pass the mechanical rules")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
