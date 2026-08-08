# Codex Automation Blueprints

This file defines automations to create in the Codex app. It is a blueprint, not an active schedule. `cpinit` copies it into the project; each active project gets its own app automations.

## Setup request

When the owner asks Codex to create the needed project automations:

1. Read `autopilot.yaml`, `watchdog.yaml`, and `project-autopilot`.
2. Inspect existing project tasks and automations; update matching entries instead of creating duplicates.
3. Use one persistent Project Manager as the only top-level Codex task. From it, run up to two reusable `architect` children, up to three disposable `engineer` children, and disposable `release_manager` children per PR on `gpt-5.6-luna` with medium reasoning.
4. Create or update an hourly Project Manager heartbeat attached to the persistent PM task.
5. Configure the PM to spawn every Engineer as a disposable native `engineer` child and to wait for its result. A Copilot CLI route runs inside that native Engineer child.
6. Do not create independent top-level Architect, Engineer, or Release Manager tasks.
7. Create the optional Watchdog heartbeat only when the owner explicitly enables health monitoring. It is never needed for role handoffs.
8. Verify automation name, active state, cadence, target PM task, native child roles, and repository before reporting completion.

## Naming

- Project Manager heartbeat: `{project_name} hourly PM`
- Optional Watchdog heartbeat: `{project_name} Watchdog`
- Persistent top-level task: `{project_name} Project Manager`
- Native PM children: up to two reusable `architect` children, up to three disposable `engineer` children, and disposable `release_manager` children per PR without an artificial review cap
- Child assignment title: `<Engineer|Architect|Release Manager> <Plan|Implement> [#<issue>] — <title>`
- With an issue, use its number and exact GitHub issue title; otherwise omit the number and generate a concise title
- For an explicitly combined multi-issue assignment, include every number with `+` and every exact title with `/` in the same order
- Native identifier: lowercase snake case, for example `engineer_implement_156_property_history`
- The PM includes `task_title` in every spawn/follow-up packet; each child renames its own task before substantive work, including reusable children on every new assignment

## Project Manager heartbeat

Run hourly as a two-to-five-minute, non-overlapping control-plane tick. If another PM orchestration turn is active, perform one state check and exit. Reconcile state, process completed handoffs, dispatch work within the two-Architect/three-Engineer limits, record state, and exit without waiting for long-running children. Start maintenance recovery immediately only for evidence-backed blockers or P0/P1 root causes; put other maintenance in `Backlog`. PR creation, reviewed green merges, deployment, and validated destructive/data-migration work are pre-authorized. Run the quick hygiene scan.

Before reporting, reconcile `In progress` items against the live native agent tree and registered external processes. Restart eligible orphaned work immediately when capacity exists; otherwise correct stale Project state or surface the real blocker. `In review` is different: implementation/release is complete and the owner must perform acceptance testing. Do not restart or reroute an `In review` item merely because it has no agent or PR.

Every surfaced result must be an actionable whole-project brief with: `Project status`, `Changed`, `Active`, `Next` (up to three prioritized PM actions), and `Your action`. Every issue reference uses `#number — exact GitHub issue title`; never show a number alone. `Active` contains only verified running native children or registered external workers and names the role/agent. A completed task or deployment is only one bullet. `Your action` may say `No action needed`, but `Next` must always state what the PM will do next. If the Project API cannot refresh, use last-known Project state plus current issues/PRs, label the data partial, and still provide priorities.

## Watchdog heartbeat

Disabled by default. When explicitly enabled, run as a read-only health heartbeat on the persistent PM task or another owner-approved task. Inspect stalls, failed tasks, orphaned project work, external Copilot CLI processes, GitHub, reviews, and CI. Do not monitor whether native child results reached the PM; that transport is owned by Codex orchestration.

## Release Manager handoff

The Engineer child result arrives automatically in the PM task. The PM immediately spawns a disposable `release_manager` for that PR. It trusts green required CI for the full suite/build, reviews the exact current SHA, and merges automatically when no unresolved findings or conflicts remain. It respects branch protection, deploys automatically when applicable, and performs post-deploy validation. Data migrations and destructive data changes need compatibility evidence and backup/rollback readiness, not separate approval.

Keep the issue `In progress` through this automated release path. Move it to `In review` only after implementation, merge, deployment when applicable, and post-deploy validation are complete. `In review` is the owner's acceptance/testing queue. Requested changes return the issue to `In progress` and start an Engineer.

## Registration contract

Native Codex children are tracked by the PM task and need no Watchdog registration. If an Engineer launches Copilot CLI and optional monitoring is enabled, register the external process ID, worktree, timestamps, status, blocker/question, and PR. The native Engineer remains responsible for returning the final result to the PM.

## Boundary

Automations live in the Codex app and require the configured local environment to be available. Repository files define behavior only; copying the template does not activate schedules.
