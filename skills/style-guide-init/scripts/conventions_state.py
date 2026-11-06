#!/usr/bin/env python3
"""Capture/check scoped repository inputs. Hash changes are not semantic verdicts."""

import argparse
import hashlib
import json
import os
from pathlib import Path, PurePosixPath
import stat
import subprocess
import sys
import tempfile
from datetime import datetime, timezone


def git(repo, *args):
    result = subprocess.run(
        ["git", "-C", str(repo), *args], capture_output=True, check=False
    )
    if result.returncode:
        raise ValueError(result.stderr.decode(errors="replace").strip())
    return result.stdout


def relative(value):
    path = PurePosixPath(value)
    if not value or path.is_absolute() or ".." in path.parts or ".git" in path.parts:
        raise ValueError("Expected a repository-relative path outside .git: " + value)
    return path.as_posix()


def under(path, prefix):
    return prefix == "." or path == prefix or path.startswith(prefix + "/")


def secret_like(name):
    base = PurePosixPath(name).name.lower()
    sample = base.endswith((".example", ".sample", ".template"))
    return (base == ".env" or base.startswith(".env.")) and not sample or base.endswith(
        (".pem", ".key", ".p12", ".pfx")
    ) or base in ("id_rsa", "id_ed25519", "credentials.json")


def contained(repo, path):
    try:
        path.resolve().relative_to(repo)
    except ValueError as error:
        raise ValueError("Path resolves outside the repository: " + str(path)) from error
    return path


def state_path(repo, name):
    path = repo / relative(name)
    for part in [path, *path.parents]:
        if part == repo:
            break
        if part.is_symlink():
            raise ValueError("Checkpoint path must not traverse symlinks: " + str(path))
    return contained(repo, path)


def fingerprint(repo, name):
    path = repo / name
    info = path.lstat()
    if stat.S_ISLNK(info.st_mode):
        # Never read the linked contents, even when the target is inside the repo.
        return {"kind": "symlink", "sha256": hashlib.sha256(os.fsencode(os.readlink(path))).hexdigest()}
    contained(repo, path)
    if stat.S_ISDIR(info.st_mode):
        return {"kind": "unassessed-directory"}  # Gitlinks/submodules are not traversed.
    if not stat.S_ISREG(info.st_mode):
        raise ValueError("Unsupported non-regular input: " + name)
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return {"kind": "file", "sha256": digest.hexdigest()}


def inventory(repo, scopes, excludes):
    files = {}
    for raw in sorted(set(git(repo, "ls-files", "-z", "--cached", "--others", "--exclude-standard").split(b"\0"))):
        if not raw:
            continue
        name = os.fsdecode(raw)
        if not any(under(name, scope) for scope in scopes):
            continue
        if secret_like(name) or any(under(name, excluded) for excluded in excludes):
            continue
        if not os.path.lexists(repo / name):  # A tracked deletion is absent in this snapshot.
            continue
        files[name] = fingerprint(repo, name)
    return files


def head(repo):
    result = subprocess.run(
        ["git", "-C", str(repo), "rev-parse", "--verify", "HEAD"], capture_output=True
    )
    return result.stdout.decode().strip() if result.returncode == 0 else None


def differences(before, after):
    return {
        "added": sorted(after.keys() - before.keys()),
        "changed": sorted(name for name in before.keys() & after.keys() if before[name] != after[name]),
        "deleted": sorted(before.keys() - after.keys()),
    }


def read_state(path):
    data = json.loads(path.read_text())
    if not isinstance(data, dict) or data.get("schema_version") != 1:
        raise ValueError("Unsupported checkpoint schema; expected schema_version 1")
    for key in ("scopes", "excludes"):
        if not isinstance(data.get(key), list) or not all(isinstance(p, str) for p in data[key]):
            raise ValueError("Invalid checkpoint field: " + key)
        data[key] = [relative(p) for p in data[key]]
    if not data["scopes"]:
        raise ValueError("Checkpoint scopes must not be empty")
    for key in ("source_files", "guides"):
        if not isinstance(data.get(key), dict) or not data[key]:
            raise ValueError("Missing checkpoint inventory: " + key)
        for name, value in data[key].items():
            relative(name)
            if not isinstance(value, dict) or value.get("kind") not in ("file", "symlink", "unassessed-directory"):
                raise ValueError("Invalid fingerprint: " + name)
            if value["kind"] != "unassessed-directory":
                digest = value.get("sha256", "")
                if not isinstance(digest, str) or len(digest) != 64 or any(c not in "0123456789abcdef" for c in digest):
                    raise ValueError("Invalid fingerprint digest: " + name)
    return data


def run(args):
    repo = Path(os.fsdecode(git(Path(args.repo).resolve(), "rev-parse", "--show-toplevel")).strip()).resolve()
    output = state_path(repo, args.state)
    state_name = output.relative_to(repo).as_posix()
    if args.operation == "capture":
        scopes = sorted(set(relative(p) for p in args.scope))
        guides = {relative(p): fingerprint(repo, relative(p)) for p in args.guide}
        if any(p == state_name for p in guides):
            raise ValueError("The guide and checkpoint must have different paths")
        if any(value["kind"] != "file" for value in guides.values()):
            raise ValueError("Guide outputs must be regular files")
        excludes = sorted(set(relative(p) for p in args.exclude))
        files = inventory(repo, scopes, excludes + [state_name, *guides])
        if not files:
            raise ValueError("No covered source files; inspect and widen the scopes before capture")
        data = {
            "schema_version": 1,
            "captured_at": datetime.now(timezone.utc).isoformat(),
            "captured_head": head(repo),
            "scopes": scopes,
            "excludes": excludes,
            "source_files": files,
            "guides": guides,
        }
        output.parent.mkdir(parents=True, exist_ok=True)
        temporary = None
        try:
            with tempfile.NamedTemporaryFile(mode="w", encoding="utf-8", dir=output.parent, delete=False) as stream:
                temporary = Path(stream.name)
                json.dump(data, stream, indent=2, sort_keys=True)
                stream.write("\n")
            temporary.replace(output)
        finally:
            if temporary is not None and temporary.exists():
                temporary.unlink()
        print(json.dumps({"status": "captured", "state": state_name, "covered_files": len(files),
                          "unassessed_paths": [p for p, v in files.items() if v["kind"] != "file"]}))
        return 0

    data = read_state(output)
    files = inventory(repo, data["scopes"], data["excludes"] + [state_name, *data["guides"]])
    guides = {p: fingerprint(repo, p) for p in data["guides"] if os.path.lexists(repo / p)}
    sources_changed = differences(data["source_files"], files)
    guides_changed = differences(data["guides"], guides)
    unassessed = sorted(p for p, v in {**files, **guides}.items() if v["kind"] != "file")
    changed = any(sources_changed.values()) or any(guides_changed.values()) or bool(unassessed)
    print(json.dumps({"status": "review-needed" if changed else "covered-inputs-unchanged",
                      "captured_head": data.get("captured_head"), "current_head": head(repo),
                      "scopes": data["scopes"], "excludes": data["excludes"],
                      "sources": sources_changed, "guides": guides_changed,
                      "unassessed_paths": unassessed, "covered_files": len(files)}, sort_keys=True))
    return 1 if changed else 0


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    subcommands = parser.add_subparsers(dest="operation", required=True)
    for operation in ("capture", "check"):
        command = subcommands.add_parser(operation)
        command.add_argument("--repo", required=True)
        command.add_argument("--state", required=True)
        if operation == "capture":
            command.add_argument("--guide", action="append", required=True)
            command.add_argument("--scope", action="append", required=True)
            command.add_argument("--exclude", action="append", default=[])
    try:
        return run(parser.parse_args())
    except (OSError, ValueError, TypeError) as error:
        print(json.dumps({"status": "error", "reason": str(error)}))
        return 2


if __name__ == "__main__":
    sys.exit(main())
