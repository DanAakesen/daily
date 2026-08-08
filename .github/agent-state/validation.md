# Validation Contract

Use the narrowest trustworthy validation path before claiming work is done. Prefer repository-native commands over ad hoc checks.

## Validation ladder

1. Targeted check for the touched surface.
2. Static check that covers the edited language or package.
3. Build or compile check when boundaries, generated output, or packaging are affected.
4. Integration or end-to-end check only when the change reaches those seams.
5. Manual/browser/smoke check when the user-facing behavior cannot be proven by tests alone.

## Required evidence by change type

| Change type                                           | Minimum validation                                                                                                                                                                      |
| ----------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Documentation-only                                    | Read the affected rendered/context path when practical.                                                                                                                                 |
| Agent instruction, skill, hook, or custom Codex agent | Bootstrap or load a temporary project and inspect copied output and `.codex/agents/*.toml`.                                                                                             |
| Script changes                                        | Run the script with a safe temporary target and inspect outputs.                                                                                                                        |
| Project bootstrap                                     | Inspect `.github/agent-state/scope.md`, `.github/agent-state/setup-checklist.md`, and merged `.vscode/settings.json`.                                                                   |
| Autopilot configuration                               | Confirm mode parsing, role routing, permission boundaries, backlog intake, owner-approved `Ready`, exclusion of `needs-planning`/blockers from `Ready`, and `cpautopilot` mode changes. |
| Native orchestration                                  | Run a parent/child smoke test and confirm the child result is delivered to the parent without polling or an automation.                                                                 |
| Automation blueprint                                  | Confirm one persistent top-level PM, PM-heartbeat target, native Architect/Engineer/Release Manager roles, and no independent role tasks.                                               |
| Watchdog configuration                                | Confirm it is optional, disabled by default, health-only, and not part of native handoff delivery.                                                                                      |
| Delegated Engineer run                                | Confirm it is a PM-owned native child; Project Manager reviews the returned diff, tests, acceptance criteria, and PR evidence before release routing.                                   |
| Release Manager review                                | Verify issue linkage, scope, acceptance criteria, diff risk, targeted Engineer evidence, green required CI, review findings, documentation, and deployment plan. Trust green CI rather than rerunning the full suite locally. Do not fix findings in the Release Manager session. |
| Release                                               | Merge the reviewed SHA, deploy when applicable, perform post-deploy smoke/health validation, and report evidence to the PM. Merge and deployment require no separate approval after release checks pass. |
| Frontend UI                                           | Run relevant checks and inspect in a browser or state why browser tooling is unavailable.                                                                                               |
| Backend/API                                           | Run targeted tests or type/build checks for the changed route/service boundary.                                                                                                         |
| Security/dependency                                   | Use manifests, lockfiles, and native audit/scanner output when available.                                                                                                               |

## Red validation

If relevant validation fails, the task is incomplete. Either fix the issue or clearly report the blocker and what remains unproven.

## Residual risk

Call out what the chosen checks do not prove when that matters for the user's decision.
