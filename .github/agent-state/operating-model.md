# Agent Operating Model

This project uses a lightweight agent-team scaffold. It is not a runtime dependency. It is the shared workflow agents should follow before, during, and after work.

## Session start

1. Read `.github/copilot-instructions.md`.
2. Read every applicable `.github/instructions/*.instructions.md` file.
3. Read `PRODUCT.md`, `DESIGN.md`, and `docs/README.md` or `docs/index.md` when they exist. If `PRODUCT.md` or `DESIGN.md` only contains cpinit starter placeholders, fill them from the initial project prompt before making implementation decisions.
4. Read this folder when it exists: `.github/agent-state/`.
5. Read `.github/agent-state/scope.md` and `.github/agent-state/setup-checklist.md` when present.
6. If the project scope is unclear or `scope.md` says `unconfirmed`, ask whether it is work, personal, or general before creating vault notes. If the agent cannot ask interactively, skip vault writes and record the unresolved scope in the handoff.
7. Read `.github/agent-state/autopilot.yaml` before proactive project work. If its mode is `paused`, stop the Autopilot run immediately.
8. When creating or repairing app automations, read `automation-blueprints.md` and `watchdog.yaml`; update existing matches rather than creating duplicates.

## Work routing

Use `routing.md` to decide which project-local skills and custom agents apply. Prefer the narrowest relevant skill or agent. Do not invoke broad reviews when a focused skill answers the task.

For proactive project work, use `project-autopilot`. Codex keeps the Project Manager as the persistent root task. The PM owns up to two reusable read-only Architect children, up to three disposable Engineer children, and disposable Release Manager children per PR with no artificial review cap. Copilot CLI runs inside a native Engineer child so its final result still returns through Codex's parent channel. Security-sensitive work follows the normal engineering validation rules; it never launches a separate Security agent or gate.

## Gates

Pause or explicitly check the relevant gate when:

- UI work is non-trivial: use the design contract and browser/screenshot loop.
- A change crosses architecture, API, auth, data, or deployment boundaries: use architecture and validation review.
- Autopilot selects planned implementation work: confirm the item is ready and Engineer routing is recorded before edits. For evidence-backed maintenance recovery, deduplicate the root cause, create or update its issue, move it directly to `In progress`, and spawn one isolated Engineer per distinct root cause without waiting for Ready approval.
- Autopilot considers moving work to `Ready`: confirm every readiness criterion is met and request the configured owner's issue-specific approval. When approved, move it and remove `needs-planning` in the same operation. If planning or another blocker remains, keep it outside `Ready` and record the blocker.
- An open issue is missing from the Project: add it to `Backlog`, preserve its roadmap phase or deferral context, and plan it incrementally.
- A Codex role is delegated: use a native PM-owned subagent, never an independent top-level task. Heartbeats record the assignment and exit instead of waiting; later PM ticks reconcile results.
- An Engineer uses Copilot CLI: the native Engineer supervises it; register only the external CLI process when optional monitoring is enabled.
- An Engineer result returns with a PR: keep the issue `In progress` and immediately spawn a disposable Release Manager after validating the result.
- A PR has findings: the Release Manager reports them to the PM; the PM routes fixes to an Engineer. The Release Manager never edits implementation code.
- A merge or deployment is proposed: the Release Manager verifies the exact current SHA, required checks, validation, findings, conflicts, branch protection, and release readiness, then proceeds automatically.
- A data migration or destructive data change is proposed: require compatibility evidence, backup/rollback readiness, and the validation contract, then proceed without a separate approval.
- A deployment completes: the Release Manager performs post-deploy validation and reports evidence to the PM.
- Automated release completes: move the issue to `In review` for owner acceptance/testing. Requested changes return it to `In progress` and start an Engineer.
- A repeated convention or project lesson appears: draft knowledge capture before saving it.

## Decision discipline

Write project-local decisions to `decisions.md` when they affect future agents in this repo. Promote only reusable, validated lessons to the vault using `vault-promotion.md`.

## Completion discipline

Use `validation.md` before claiming work is done. Use `handoff.md` for the final response shape when work changed code, docs, configuration, hooks, skills, or agent instructions.
