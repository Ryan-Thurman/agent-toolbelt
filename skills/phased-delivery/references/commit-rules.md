# Commit guidance

Commit at coherent, reviewable boundaries within the current phase. A phase
may have one or several commits; a task does not require its own commit.
Keep unrelated work and future-ticket changes out of the branch.

Prefer concise messages that state the change, such as `feat: add saved filter`
or `test: cover duplicate names`. Before committing, inspect the staged diff
and report the checks run and any known risk. Do not rewrite published branch
history without authorization, especially when a child PR is based on it.
