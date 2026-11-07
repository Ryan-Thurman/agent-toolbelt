# Version delta assessment

Record installed source versions, proposed target versions, runtime support, and actual APIs or configuration used.
Read official migration notes for that version pair.
Report only changes that intersect actual usage, with file or symbol evidence.

Distinguish removed APIs, silent behavior changes, build or configuration changes, and dependency compatibility.
For silent behavior changes, name a characterization test that records the current behavior before migration.
Compare keeping the current version, a smaller supported update, and the proposed migration.
Treat replacing a library as a separate decision from updating it.

Discover ecosystem migration tools and record whether each is installed, runnable, or actually run.
Do not count findings from tools that did not execute.
Run potentially writing migration tools only within an authorized isolated copy.
Record mechanical changes, judgment calls, affected consumers, rollout, recovery, and remaining evidence gaps.
Hand an accepted repetitive transformation to `retrofit` when available.
