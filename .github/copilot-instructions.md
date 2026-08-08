# Project Rules — MANDATORY

The `.github/instructions/*.instructions.md` files contain mandatory domain rules when applicable. Use `.github/agent-state/routing.md` to load only the files relevant to the current task.

## Key Enforcement Points

- The frontend-quality file contains ABSOLUTE BANS — patterns that must NEVER appear
- The code-quality file contains fallback logic rules — never silently swallow errors
- ALL instruction files apply to ALL code in this project regardless of language or framework
- For Copilot coding sessions and project work, use remote execution whenever the project supports it: enable `/remote` and run `copilot --remote`; if remote execution is unavailable, stop and report why before continuing locally
- Frontend projects need one canonical design-system CSS source and one root DESIGN.md; components should consume semantic/component tokens, not app-specific raw variables
- Data-heavy UI needs chart tokens and meaningful chart interactions; charts are not decorative filler
- Image-led surfaces need real, generated, verified stock, or explicit asset slots; never fake product screenshots with divs
- App shells must be selected from the product workflow. Do not default to left navigation; left navigation is only appropriate when the information architecture truly requires it, such as settings/admin hierarchies.
- Do not use purple/violet as the generated default primary palette; use it only when explicitly requested or strongly justified by the brand/context
- Reorder, staging, grouping, spatial, kanban/board, and prioritization workflows must consider drag-and-drop or keyboard-accessible reorder/direct-manipulation alternatives
- Interaction design must be considered at page, region, component, and micro-interaction levels, including hover, focus, active, icon choreography, loading, success, error, drag/drop, and reduced-motion behavior.
- Non-trivial frontend work is not done until it has been previewed in a real browser, inspected visually, iterated at least once on concrete findings, and verified with the relevant checks
- If tests, lint, build, or requested validation are red, the task is incomplete; do not present it as complete

## If In Doubt

When unsure whether something violates a rule, err on the side of NOT doing the questionable thing.
Ask rather than ship something that might violate a ban.

## Project Autopilot

When `.github/agent-state/autopilot.yaml` exists, treat it as the shared proactive-work control plane for Codex and GitHub Copilot.

- Read its mode before proactive project work.
- Use `project-autopilot` for Project Manager, Architect, Engineer, and Release Manager routing.
- Keep the Project Manager as the only persistent top-level Codex task. It may run up to two reusable native Architect subagents, up to three disposable native Engineer subagents, and disposable Release Manager subagents without an artificial review cap.
- Never create independent top-level Codex tasks for those roles. Native child results are the role-to-PM transport; the PM must wait for and immediately route them.
- Name every child assignment `<Engineer|Architect|Release Manager> <Plan|Implement> [#<issue>] — <title>`. Use the exact GitHub issue title when an issue exists; otherwise generate a concise title. Reusable children retitle themselves on every assignment.
- Engineering routes automatically to Codex or GitHub Copilot CLI unless an engineer label overrides it. Copilot CLI must run under a native Codex Engineer child that owns its output and returns the result to the PM.
- Each disposable native Release Manager uses `gpt-5.6-luna` with medium reasoning and owns one PR review, automatic green merge, deployment when applicable, and post-deploy validation. It never implements fixes or changes architecture; findings return natively to the PM for Engineer routing.
- Security-sensitive work is handled by the assigned Engineer and normal validation rules; do not launch a separate Security agent or gate.
- Keep open issues represented in the configured Project backlog. Missing issues enter `Backlog`, never `Ready`.
- Only the configured project owner may approve movement to `Ready`; `Ready` itself is the approval state.
- Remove `needs-planning` when moving an issue to `Ready`. If planning or another blocker remains unresolved, keep the issue outside `Ready` and record the blocker.
- In `execute-ready`, evidence-backed maintenance recovery is the only Ready-gate exception. Start it immediately only for blockers or P0/P1 root causes; add other maintenance to `Backlog`. PR creation, reviewed green merges, deployment, and validated destructive/data-migration work need no owner approval.
- Each PM heartbeat performs the quick repository-hygiene scan configured in `autopilot.yaml`. It may remove stale ignored generated logs/temp files only after checking for active writers and diagnostic value; tracked files, dirty worktrees, and systemic generators require maintenance recovery rather than blind deletion.
- Every surfaced PM loop result is an actionable whole-project brief: overall status, changes, verified running work, up to three next PM priorities, and the owner's exact action. Every issue mention includes its exact GitHub title. A Project status alone never proves work is active; reconcile and restart orphaned executable work before reporting.
- When asked to create the needed project automation and agent tree, read `.github/agent-state/automation-blueprints.md` and `watchdog.yaml`; update the PM heartbeat and initialize the PM-owned native subagents without duplicating tasks.
- The optional Watchdog is for health anomalies only, never role handoff delivery. Register external Copilot CLI processes when monitoring is enabled; native Codex children are tracked by their parent.
- Only a Release Manager may merge or deploy in the Autopilot flow. It automatically marks PRs ready, merges, and deploys when applicable after reviewing the exact current SHA, resolving findings, confirming required checks/validation are green, and respecting branch protection. Data migrations and destructive data changes require compatibility evidence and backup/rollback readiness, not separate approval. Never change secrets or create paid resources without explicit human confirmation.
- Keep an issue `In progress` through Engineer work and automated review/merge/deployment. Move it to `In review` only after implementation and release validation complete; `In review` is the configured owner's acceptance/testing queue. Requested changes return it to `In progress` and start an Engineer.

## Optional Agent Team Scaffold

Projects bootstrapped with `cpinit` include `.github/agent-state/` by default, unless `cpinit -NoAgentTeam` was used.
When present, read those files after the core instructions and before making implementation decisions.

- `operating-model.md` defines the session flow and gates.
- `routing.md` maps task types to project-local skills, agents, and instruction files.
- `scope.md` records whether durable project notes belong in Work, Personal, General, or remain unconfirmed.
- `setup-checklist.md` records detected setup, validation, and run commands.
- `decisions.md` captures project-local decisions for future agents.
- `validation.md` defines the narrow-to-broad validation contract.
- `handoff.md` defines completion and handoff expectations.
- `vault-promotion.md` defines what should stay project-local versus what should be promoted into OIL.
