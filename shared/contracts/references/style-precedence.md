# Repository Style Precedence

Use this contract when writing or reviewing code. It defines how generic guidance
becomes repository-specific practice.

## Order of authority

Apply the first applicable source in this order:

1. Explicit repository instructions and approved style documents.
2. Enforced repository configuration: formatter, linter, compiler, test, and CI rules.
3. Repeated, representative local conventions in adjacent production code and tests.
4. Shared baseline contracts, including `anti-slop-naming.md` and `typescript-react-baseline.md`.

Do not infer policy from one anomalous file, a generated file, or a change under
review. When sources conflict, report the conflict and follow the higher source.

## Evidence packet

Before substantial implementation or a convention finding, collect a compact,
ephemeral packet: policy paths, relevant configuration, two or three representative
neighbors, established domain terms, and the local patterns for boundaries, errors,
and tests. Record uncertainty rather than inventing a rule.

An approved `STYLE_GUIDE.md` is a repository style owner only when the team has
adopted it. `AGENTS.md` and similar entry files should point to the owner rather
than duplicate its content.

## Review rule

Generic guidance is a fallback. A style finding needs either an explicit policy
violation or a concrete readability, contract, safety, or maintenance consequence.
Do not describe code or authors as AI-generated.
