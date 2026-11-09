# Evidence-backed execution lessons

Use this procedure after a consequential failure, a repeated workaround, or an explicit request to preserve a lesson.
Keep routine task status in the existing handoff or investigation record.

1. Identify the incident, observed failure, attempted approaches, and the evidence for the successful correction.
2. Separate a demonstrated cause from an unresolved hypothesis.
3. Write a candidate lesson with its trigger, applicable repository or tool version, action, and supporting incident.
4. Record counterexamples, limits, and the change that would require revalidation.
5. Check existing project knowledge before adding another entry.
6. Store it in the project's existing knowledge location when authorized; otherwise propose it in the handoff.

Use this compact record:

| Field | Content |
| --- | --- |
| Trigger and scope | State when the lesson applies and where it does not. |
| Observation | Describe what failed and what corrected it. |
| Action and reason | State the action and the failure it prevents. |
| Evidence | Link the incident, source revision, commands, or result artifacts. |
| Confidence | Use `candidate` or `validated`, with the supporting reason. |
| Revalidation | Name relevant source, dependency, configuration, or policy changes. |
| Disposition | Use `active`, `superseded`, or `retired`, with a replacement link when applicable. |

A single incident can support a narrow validated lesson, not a universal engineering rule.
Load only active lessons relevant to the present task and version.
Recheck contradictory evidence before applying an old lesson.
Mark corrected lessons as superseded so later sessions can follow the change.
Promoting a lesson into repository policy requires the project's normal approval.
Do not modify global instructions, shared skills, or another repository automatically.
