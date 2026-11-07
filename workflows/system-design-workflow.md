# System design and security

1. Run `system-design` against the requirements or existing design record.
2. Run its linked `threat-model` review against the same design revision.
3. Resolve design findings and preserve threat-to-requirement-to-verification links.
4. Hand accepted scope to planning and `test-case-design` when requested.
5. After implementation, run `security-audit` and acceptance checks against the linked requirements.

Keep proposed controls distinct from implemented and verified controls.
Reassess affected threats after changes to architecture, identity, sensitive data, or trust boundaries.
The project owns controlled records, internal risk registers, required reviews, and release authority.
