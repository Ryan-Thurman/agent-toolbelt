# Interface contracts

Read this at the Standard level or higher when a design adds or changes an API, an event, or a webhook.
An interface contract is what a caller can rely on: requests, responses, errors, limits, and how they change.

## Choose the protocol from the call

| Call shape | Default |
| --- | --- |
| Request and reply between a client and a service, or across teams | HTTP with JSON (REST style). It is the default until a measured need says otherwise. |
| High-volume calls between internal services with a shared schema | gRPC, when the teams already run it. |
| A fact that other services react to later | An event on a queue or a stream. See `distributed-workflows.md`. |
| A notification to a system outside your control | A webhook with a signature, retries, and a delivery log. |

Do not change the protocol of an existing interface without a measured reason, such as latency or payload cost.

## Breaking changes

A change breaks callers when it removes or renames a field, changes a type or a meaning,
makes an optional input required, adds a required input, narrows accepted values, or changes an error code.
Adding an optional field or a new endpoint does not break callers, if callers ignore unknown fields.

- Prefer additive change. Add the new field, keep the old one, and remove the old one later.
- When a break is necessary, add a new version and keep the old version for a stated period.
- Mark a deprecated version in the response, for example with `Deprecation` and `Sunset` headers, and in the documentation.
- Record each caller of the old version and the date that it will move.

## Errors

Use one error format for the whole interface. Each error gives a stable machine code, a message for people,
the field that caused it when there is one, and a correlation ID for support.
Do not return stack traces or internal names. Map each failure to a status that tells the caller whether a retry can help.

## Lists and limits

- Paginate every list that can grow. Prefer cursor pagination for data that changes while a caller reads it.
- Set a maximum page size, a maximum request size, and a rate limit. Document the response when a limit is reached.

## Idempotency

Every operation that changes state must be safe for a caller to retry.

1. The caller sends an idempotency key with the request.
2. The service stores the key with the request and its result.
3. The same key with the same request returns the stored result. The operation does not run again.
4. The same key with a different request is rejected.
5. A second request with a key whose first request is still running is rejected or waits. It does not run twice.
6. The key expires after a stated period.

Retry rules for the caller are in `skills/reliability-review/references/resilience-patterns.md`.
