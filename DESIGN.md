# Design

This repository has no user interface. The existing Daily Overview site remains the only dashboard.

## Workflow shape

Scheduled integration pipeline: fetch, validate, normalize, submit, and report per-source status.

## Operator experience

- GitHub Actions provides scheduled runs, manual runs, concise summaries, and failure evidence.
- Logs use structured records and omit message bodies, tokens, email addresses, and personal content.
- Failures identify the source and exact non-sensitive error without masking successful sources.

## Accessibility and visual system

Not applicable because this project does not add a visual surface.
