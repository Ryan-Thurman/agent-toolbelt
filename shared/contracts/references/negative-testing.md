# Negative testing

Use these families to find negative cases for a story, a plan, or a test design.
A negative case checks that the system rejects or survives a wrong input, an unauthorized action,
or a failed dependency.

Consider every family. Raise a family only when its condition applies to a real interface,
data rule, or dependency in the change. Record each family as `Covered`, `Not applicable` with a
reason, or `Gap`. Do not set a ratio of negative cases to positive cases.

| Family | Applies when | Example cases |
| --- | --- | --- |
| Input values | The change accepts user or API input. | Wrong type, missing field, null and empty and absent, value at and past each boundary, wrong format, unusual encoding, oversized value. |
| Malformed request | The change exposes an HTTP, message, or file interface. | Body that does not parse, wrong content type, unknown fields, fields that the caller must not set (mass assignment). |
| Authentication | The change has a protected entry point. | No credentials, expired or revoked credentials, credentials for a different environment. |
| Authorization | The change reads or writes data that has an owner, a role, or a tenant. | Wrong role, another user's object (object-level access), another tenant's data, an action on a disabled account. |
| Limits and quotas | The change has a rate, size, count, or page limit. | One below, at, and one past the limit. The response when the limit is reached. |
| State and lifecycle | The change has states or ordered steps. | Skipped step, repeated step, illegal transition, action on an expired, cancelled, or deleted item. |
| Dependency failure | The change calls another service, a database, a queue, or a third party. | Error response, timeout, connection reset, slow response, response body that does not parse, partial failure in a batch. |
| Concurrency | Two actors or two requests can act on the same data. | Double submit, lost update, race for the last item, out-of-order messages. |
| Idempotency | A request or message can arrive more than once. | Retry with the same key, duplicate message delivery, replay after a timeout. |
| Data integrity | The change writes stored data. | A constraint rejects bad data. A failed write leaves no partial record. |

## Required assertions

Every negative case asserts these results when they apply:

1. The response or message gives the specific status, error code, and field. A generic failure is not enough.
2. The system state does not change, or it changes only as the rule allows.
3. The response does not show internal details, such as stack traces, queries, or secrets.
4. The next valid request succeeds.

## Rules

- Choose the partitions that the validator can confuse. Do not generate every type violation for every field.
- Prefer schema-driven generation when the project has a schema and a generation tool.
- A security abuse case goes to `threat-model` or `security-audit` when the change crosses a trust boundary.
- A dependency failure that needs a real platform fault, such as zone loss, is a reliability scenario.
  Use the story tier in `reliability-checklist.md`.
