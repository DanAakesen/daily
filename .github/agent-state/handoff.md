# Agent Handoff Contract

Use this contract when completing work that changed code, docs, configuration, hooks, skills, or agent instructions.

## Final response shape

Lead with the outcome. Then include only the details needed for the user to trust and continue the work.

Include:

- What changed.
- Why it matters.
- What was validated.
- Any blocker or residual risk.
- The exact next step only when one is required.
- For Autopilot work: mode, selected item, Architect decision, Engineer provider, Release Manager result, validation/deployment evidence, and resulting GitHub state.
- For every user-facing Autopilot loop result: the compact `Project status`, `Changed`, `Active`, `Next`, and `Your action` brief. Include the exact title with every issue number. `Active` means a verified running worker. `In review` means completed implementation awaiting owner acceptance and belongs under `Your action`. Never return only the task that just completed.

For new project bootstrap work, also mention the selected project scope and the setup/validation commands captured in `.github/agent-state/setup-checklist.md`.

Avoid:

- Long recaps.
- Generic offers to continue.
- Claiming complete work when validation is red.
- Hiding uncertainty.

## Handoff notes for future agents

If future agents need context, update `decisions.md` or add a short project-local note. If the lesson is reusable across projects, follow `vault-promotion.md` instead of leaving it only in this repo.
