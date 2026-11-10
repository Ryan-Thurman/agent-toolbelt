#!/usr/bin/env python3
"""Build each React specialist's references/rule-routing.md from rule-index.json.

Usage: build-react-rule-routing.py [--check]

--check exits 1 when an index is invalid or a routing file is not current.
"""

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
IMPACT_ORDER = ["CRITICAL", "HIGH", "MEDIUM-HIGH", "MEDIUM", "LOW-MEDIUM", "LOW"]
MAX_WHEN_WORDS = 20


def frontmatter(path):
    text = path.read_text()
    match = re.match(r"---\n(.*?)\n---\n", text, re.DOTALL)
    fields = {}
    for line in (match.group(1).splitlines() if match else []):
        key, _, value = line.partition(":")
        fields[key.strip()] = value.strip()
    return fields


def category_of(name, prefixes):
    """Return the longest category prefix that the rule name starts with."""
    matches = [p for p in prefixes if name.startswith(p + "-")]
    return max(matches, key=len) if matches else None


def validate(skill_dir, index):
    errors = []
    rules_dir = skill_dir / "references" / "rules"
    on_disk = {f"references/rules/{p.name}" for p in rules_dir.glob("*.md")}
    indexed = [rule["path"] for rule in index["rules"]]
    prefixes = {c["prefix"] for c in index.get("categories", [])}
    for path in sorted(on_disk - set(indexed)):
        errors.append(f"{path}: no index entry")
    for path in sorted(set(indexed) - on_disk):
        errors.append(f"{path}: index entry has no rule file")
    if len(indexed) != len(set(indexed)):
        errors.append("duplicate index entries")
    for rule in index["rules"]:
        name = Path(rule["path"]).stem
        if not category_of(name, prefixes):
            errors.append(f"{rule['path']}: no category prefix matches {name}")
        if len(rule["when"].split()) > MAX_WHEN_WORDS:
            errors.append(f"{rule['path']}: when line has more than {MAX_WHEN_WORDS} words")
        for pattern in rule.get("signals", []) + rule.get("file_signals", []):
            try:
                re.compile(pattern)
            except re.error as error:
                errors.append(f"{rule['path']}: bad pattern {pattern!r}: {error}")
    return errors


def render(skill_dir, index):
    by_prefix = {}
    prefixes = [c["prefix"] for c in index["categories"]]
    for rule in index["rules"]:
        name = Path(rule["path"]).stem
        impact = frontmatter(skill_dir / rule["path"]).get("impact", "")
        found_by = "scan" if rule.get("signals") or rule.get("file_signals") else "judgment"
        rank = IMPACT_ORDER.index(impact) if impact in IMPACT_ORDER else len(IMPACT_ORDER)
        by_prefix.setdefault(category_of(name, prefixes), []).append((rank, name, rule["when"], rule.get("fix", ""), impact, found_by))

    lines = [
        "# Rule routing",
        "",
        "<!-- Generated from rule-index.json by scripts/build-react-rule-routing.py. Do not edit. -->",
        "",
        index["intro"],
        "",
        "The React rule scan in `shared/contracts/references/typescript-react-baseline.md`",
        "lists the `scan` rules that changed lines trigger. Check each `judgment` rule",
        "against the change yourself. Severity comes from",
        "`shared/contracts/references/react-acceptance.md`, not from the impact column.",
    ]
    for category in index["categories"]:
        rows = sorted(by_prefix.get(category["prefix"], []))
        if not rows:
            continue
        lines += ["", f"## {category['title']}", "", "| When | Rule | Fix | Impact | Found by |", "| --- | --- | --- | --- | --- |"]
        for _, name, when, fix, impact, found_by in rows:
            fix = fix.replace("|", "\\|")
            lines.append(f"| {when} | [`{name}.md`](rules/{name}.md) | {fix} | {impact} | {found_by} |")
    return "\n".join(lines) + "\n"


def main(argv):
    check = argv == ["--check"]
    if argv and not check:
        print(__doc__, file=sys.stderr)
        return 2
    status = 0
    for index_path in sorted(ROOT.glob("skills/*/references/rule-index.json")):
        skill_dir = index_path.parents[1]
        if not (skill_dir / "references" / "rules").is_dir():
            continue
        index = json.loads(index_path.read_text())
        errors = validate(skill_dir, index)
        for error in errors:
            print(f"! {skill_dir.name}: {error}", file=sys.stderr)
        if errors:
            status = 1
            continue
        routing = skill_dir / "references" / "rule-routing.md"
        content = render(skill_dir, index)
        if check:
            if not routing.is_file() or routing.read_text() != content:
                print(f"! {routing.relative_to(ROOT)} is stale; run scripts/build-react-rule-routing.py", file=sys.stderr)
                status = 1
        elif not routing.is_file() or routing.read_text() != content:
            routing.write_text(content)
            print(f"wrote {routing.relative_to(ROOT)}")
    if check and status == 0:
        print("ok: React rule indexes and routing files are current")
    return status


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
