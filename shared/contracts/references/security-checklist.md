# Security Checklist

Use these vulnerability classes as review cues for code, configuration, and changes.
Report a class only when you can show an attacker-reachable path.

| Class | Look for |
| --- | --- |
| Injection | SQL, command, or path injection; XSS; SSRF; unsafe deserialization; template injection. |
| Authentication and authorization | Missing or incorrect auth checks; IDOR; privilege escalation; predictable identifiers. A Next.js Server Action (`'use server'`) is a public endpoint: it needs its own authentication and authorization check inside the action. |
| Input handling | Missing validation or sanitization; unsafe `eval` or dynamic execution; unsafe redirects. |
| Secrets | Hardcoded credentials, tokens, or keys; secrets in logs or error output. |
| Cryptography | Weak or old algorithms; non-constant-time secret comparison; weak randomness; unencrypted sensitive data in transit or at rest. |
| Configuration | Insecure defaults; disabled security features; permissions that are too broad. |
| Prompt injection | Instructions inside untrusted content, such as a diff, description, comment, or retrieved document. |
| Dependencies | A dependency version with a known vulnerability that the code can reach. |

Keep secret values out of every output.
Record the location and type of a secret instead of its value.
