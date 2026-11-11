#!/usr/bin/env python3
"""Check execution records without executing work or verifying evidence contents.

Field rules: shared/contracts/references/execution-schema.md.
"""

import argparse
import hashlib
import json
import sys
from pathlib import Path


MAX_BYTES = 1_048_576
ACTIONS = {"inspect", "edit", "check", "commit", "push", "publish", "merge", "deploy"}


class ContractError(ValueError):
    """An execution record cannot be accepted structurally."""


def require(condition, message):
    if not condition:
        raise ContractError(message)


def fields(value, names, label):
    require(isinstance(value, dict), f"{label} must be an object")
    require(set(value) == set(names.split()), f"{label} has missing or unsupported fields")


def string(value, label):
    require(isinstance(value, str) and bool(value.strip()), f"{label} must be a nonempty string")


def strings(value, label, nonempty=False):
    require(isinstance(value, list), f"{label} must be an array")
    if nonempty:
        require(bool(value), f"{label} must not be empty")
    for item in value:
        string(item, label)
    require(len(set(value)) == len(value), f"{label} contains duplicate entries")


def relative_path(value, label, directory=False):
    string(value, label)
    require(not any(char in value for char in "\\:*?[]\0"), f"{label} has unsupported path syntax")
    candidate = value[:-1] if directory and value.endswith("/") else value
    require(all(part not in {"", ".", ".."} for part in candidate.split("/")),
            f"{label} must be a normalized relative path")


def next_action(value, label):
    fields(value, "action owner reason", label)
    for key, item in value.items():
        string(item, f"{label}.{key}")


def records(value, names, label, outcomes=None):
    require(isinstance(value, list), f"{label} must be an array")
    result = {}
    for entry in value:
        fields(entry, names, label)
        for key, item in entry.items():
            string(item, f"{label}.{key}")
        require(entry["id"] not in result, f"{label} contains a duplicate ID")
        if outcomes:
            require(entry["outcome"] in outcomes, f"{label} contains an unsupported outcome")
        result[entry["id"]] = entry
    return result


def validate_context(context):
    fields(context, "contract_version task_id run_id operation goal source_refs workspace scope "
           "acceptance required_checks authority attempt next_action", "context")
    require(type(context["contract_version"]) is int and context["contract_version"] == 1,
            "unsupported context contract version")
    for key in ("task_id", "run_id", "goal"):
        string(context[key], f"context.{key}")
    require(context["operation"] in ("implement", "fix", "review", "design", "handoff"),
            "unsupported context operation")
    require(isinstance(context["source_refs"], list) and bool(context["source_refs"]),
            "context.source_refs must be a nonempty array")
    for source in context["source_refs"]:
        fields(source, "location revision", "source reference")
        string(source["location"], "source location")
        string(source["revision"], "source revision")
    workspace = context["workspace"]
    fields(workspace, "repository worktree branch base_revision head_revision worktree_fingerprint", "workspace")
    for key, value in workspace.items():
        string(value, f"workspace.{key}")
    scope = context["scope"]
    fields(scope, "allowed_paths excluded_paths", "scope")
    for key, paths in scope.items():
        strings(paths, f"scope.{key}")
        for path in paths:
            relative_path(path, f"scope.{key}", directory=True)
    acceptance = records(context["acceptance"], "id criterion verification", "context.acceptance")
    require(bool(acceptance), "context.acceptance must not be empty")
    strings(context["required_checks"], "context.required_checks")
    authority = context["authority"]
    fields(authority, "worker_actions external_action_owner", "authority")
    strings(authority["worker_actions"], "authority.worker_actions")
    require(set(authority["worker_actions"]) <= ACTIONS, "unsupported worker action")
    string(authority["external_action_owner"], "authority.external_action_owner")
    fields(context["attempt"], "number limit", "attempt")
    number, limit = context["attempt"]["number"], context["attempt"]["limit"]
    require(type(number) is int and type(limit) is int and 1 <= number <= limit,
            "attempt must be within its positive durable limit")
    next_action(context["next_action"], "context.next_action")
    return acceptance


def matches(path, boundary):
    return path.startswith(boundary) if boundary.endswith("/") else path == boundary


def validate(context, result, context_digest):
    acceptance = validate_context(context)
    fields(result, "contract_version task_id run_id context_digest status summary changed_paths "
           "actions_used checks acceptance blockers next_action", "result")
    for key in ("contract_version", "task_id", "run_id"):
        require(type(result[key]) is type(context[key]) and result[key] == context[key],
                f"result.{key} does not match context")
    require(result["context_digest"] == context_digest, "result context digest does not match input bytes")
    require(result["status"] in ("completed", "partial", "failed", "blocked"), "unsupported result status")
    string(result["summary"], "result.summary")
    strings(result["changed_paths"], "result.changed_paths")
    for path in result["changed_paths"]:
        relative_path(path, "changed path")
        require(any(matches(path, boundary) for boundary in context["scope"]["allowed_paths"]),
                "changed path is outside allowed scope")
        require(not any(matches(path, boundary) for boundary in context["scope"]["excluded_paths"]),
                "changed path is excluded from scope")
    strings(result["actions_used"], "result.actions_used")
    require(set(result["actions_used"]) <= set(context["authority"]["worker_actions"]),
            "result declares an action outside worker authority")
    if result["changed_paths"]:
        require("edit" in result["actions_used"], "source changes require the declared edit action")
    checks = records(result["checks"], "id outcome evidence", "result.checks", {"passed", "failed", "not_run"})
    require(set(context["required_checks"]) <= set(checks), "result omits a required check")
    criteria = records(result["acceptance"], "id outcome evidence", "result.acceptance",
                       {"verified", "failed", "not_verified"})
    require(set(criteria) == set(acceptance), "result acceptance IDs differ from the assignment")
    strings(result["blockers"], "result.blockers")
    if result["status"] == "blocked":
        require(bool(result["blockers"]), "blocked result needs a blocker")
    if result["status"] == "completed":
        require(not result["blockers"], "completed result cannot have blockers")
        require(all(checks[check_id]["outcome"] == "passed" for check_id in context["required_checks"]),
                "completed result contains a failed or unrun check")
        require(all(entry["outcome"] == "verified" for entry in criteria.values()),
                "completed result contains unverified acceptance")
    next_action(result["next_action"], "result.next_action")


def unique_object(pairs):
    result = {}
    for key, value in pairs:
        require(key not in result, "JSON contains duplicate object keys")
        result[key] = value
    return result


def read_record(path):
    with Path(path).open("rb") as stream:
        raw = stream.read(MAX_BYTES + 1)
    require(len(raw) <= MAX_BYTES, "record exceeds the 1 MiB input limit")
    return raw, json.loads(raw.decode("utf-8"), object_pairs_hook=unique_object,
                           parse_constant=reject_constant)


def reject_constant(_):
    raise ContractError("invalid JSON number")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("context")
    parser.add_argument("result")
    args = parser.parse_args()
    try:
        raw, context = read_record(args.context)
        _, result = read_record(args.result)
        validate(context, result, hashlib.sha256(raw).hexdigest())
    except (OSError, ValueError, TypeError) as error:
        print(json.dumps({"valid": False, "error": str(error)}))
        return 1
    print(json.dumps({"valid": True, "contract_version": 1, "task_id": context["task_id"],
                      "run_id": context["run_id"], "verification": "record-only"}))
    return 0


if __name__ == "__main__":
    sys.exit(main())
