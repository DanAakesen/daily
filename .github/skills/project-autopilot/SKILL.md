---
name: project-autopilot
description: Run or configure project-level proactive work using Codex as Project Manager, conditional Codex architecture review, and Codex or GitHub Copilot CLI engineers. Use when supervising a project, selecting ready work, delegating implementation, or processing an Autopilot run.
---

# Project Autopilot

Use this skill as the shared workflow for Codex and GitHub Copilot. `.github/agent-state/autopilot.yaml` is the permission and routing control plane; it does not trigger work by itself.

## Start

1. Read `AGENTS.md`, `.github/copilot-instructions.md`, `routing.md`, and only the instructions/state routed for the current task.
2. Read `autopilot.yaml` before inspecting or changing project state.
3. Write every role output in the configured `output_language` regardless of conversation or source language.
4. Treat GitHub Issues and the configured GitHub Project as the source of truth.
5. Never work in the primary checkout when an isolated worktree or remote environment is available.

## Session lifecycle

- Keep one persistent Codex Project Manager as the root task for each active project. Scheduled follow-ups return to that task.
- The PM owns one native subagent tree. Never create independent top-level Codex tasks for Architect, Engineer, or Release Manager work.
- Keep at most two reusable, read-only `architect` subagents and use them only for the configured architecture triggers.
- Spawn a disposable `release_manager` on `gpt-5.6-luna` with medium reasoning for each PR. Do not impose an artificial review-concurrency cap; available native capacity is the practical limit.
- Run at most three disposable `engineer` subagents at once, each with one isolated scope. Close each after its PR result has returned and been routed.
- Native subagent completion is the authoritative result transport. Process returned results promptly, but do not keep a heartbeat turn alive waiting for long-running children; reconcile them on the next control tick.
- When routing to Copilot CLI, the native Codex Engineer launches and supervises the CLI process. The Codex Engineer still owns validation and returns the result through the native parent channel.
- Repository instructions, decisions, GitHub state, and handoffs remain the source of truth; session memory is supporting context only.

## Automation bootstrap

When the owner asks to create the needed project automation and agent tree, read `.github/agent-state/automation-blueprints.md` and `watchdog.yaml`. Inspect existing tasks and automations first. Keep only the PM as the persistent top-level task; initialize up to two reusable Architect children and create disposable Engineer/Release Manager children as work requires. Attach the hourly PM heartbeat to the PM. The optional Watchdog is a health monitor only and is not required for role handoffs.

Native Codex subagent status is tracked by the parent task and does not require the Watchdog registry. If an Engineer launches Copilot CLI, register that external process at the local path configured by `watchdog.yaml`, then keep the native Engineer alive until the CLI output, diff, validation, and PR have been inspected.

If enabled, the Watchdog remains read-only and detects health anomalies such as inactivity, failed tasks, orphaned work, failed CI, and blocking reviews. It is never the completion transport between Codex roles.

## Native orchestration invariant

1. The PM uses native subagent spawn/follow-up controls, never separate Codex tasks, for all Codex roles.
2. The PM sends Architect constraints to the Engineer and Engineer results to the Release Manager; sibling roles do not rely on polling one another.
3. Manual PM turns may wait when an immediate result is useful. Heartbeats never wait on long-running children and finish within the configured control-tick budget.
4. A child result arriving in the PM mailbox is processed before the PM reports status or waits again.
5. Before saying an agent is still running, the PM refreshes the native agent list and relevant PR/CI state.

## Subagent task naming

Every Architect, Engineer, and Release Manager assignment must have a human-readable task title in this exact order:

`<Engineer|Architect|Release Manager> <Plan|Implement> [#<issue>] — <title>`

- Use `Plan` for planning, requirements, investigation, and architecture work. Use `Implement` for coding, fixes, validation, PR review, merge, deployment, and release work.
- Include `#<issue>` when the work belongs to a GitHub issue and use that issue's exact title after the dash.
- For an explicitly combined assignment spanning multiple issues, list every number in ascending order separated by `+` and list the exact issue titles in the same order separated by `/`.
- When no issue exists, omit the number and generate a concise descriptive title after the dash.
- For the native machine identifier, use the same fields as lowercase snake case without punctuation, for example `architect_plan_156_property_history`.
- Include the exact human-readable `task_title` in every spawn or follow-up packet. As its first action on every assignment, the child renames its own Codex task to that title. Reusable Architects retitle themselves for each assignment; disposable Engineers and Release Managers use the assignment title at spawn.
- Never silently continue with a generic name such as `engineer`, `architect`, or `release_manager` when an assignment title should be available.

## Modes

- `paused`: stop without inspecting or changing project state.
- `observe`: inspect issues, project status, PRs, CI, and blockers; report only.
- `propose`: prioritize next work and improve readiness without implementing.
- `execute-ready`: implement eligible `Ready` work plus configured maintenance recovery, validate it, and prepare draft PRs.

## Hourly heartbeat

On each scheduled Project Manager heartbeat, act as a two-to-five-minute control-plane tick. If another PM orchestration turn is active, do one state check and exit without starting duplicate work.

1. Query the configured Project server-side with `status:Backlog is:issue is:open`.
2. Paginate through and assess every matching Backlog item. Do not impose an artificial result or processing cap.
3. Improve planning wherever possible: outcome, scope, acceptance criteria, dependencies, phase, constraints, validation, and Engineer routing.
4. Identify every item that satisfies the readiness criteria and present the complete candidate list to the approval owner. Group the approval request when useful.
5. Never move a candidate to `Ready` until the owner explicitly approves that issue. A recommendation is not approval.
6. Record deferred decisions and concrete blockers so they are not repeatedly raised without new evidence or a revisit trigger.
7. Inspect active and recent Engineer results for recurring bugs, deployment failures, flaky tooling, environment or harness failures, and repeated workarounds. Start immediate maintenance recovery only when the root cause blocks current work or is P0/P1; otherwise add it to `Backlog`.
8. In `execute-ready`, continue eligible `Ready` execution and maintenance recovery after the Backlog assessment. Let the Watchdog handle passive health monitoring.
9. Do not scan for ordinary issues outside the Project. Maintenance recovery may create a missing root-cause issue and add it directly as `In progress`.
10. Reconcile every `In progress` item against the current native agent tree and registered external processes before reporting.
11. If eligible `In progress` work has no live worker, restart it immediately when capacity exists. If work cannot resume, correct the stale Project status or record the real blocker. Do not treat `In review` this way: it is the configured owner's acceptance/testing stage after implementation and release are complete.
12. Dispatch only within the configured limits, record the post-reconciliation state, and exit without waiting for long-running children.
13. End every surfaced loop result with the actionable project brief below. A completed issue, merge, or deployment is one update inside the brief, never the whole response.

## Actionable project brief

Use this compact mobile-first structure whenever the loop produces a user-facing update:

**Project status — Green|Amber|Red**
One sentence describing overall delivery health and why.

**Changed**
- Material changes since the previous loop, including completed releases.

**Active**
- `#number — exact GitHub title — running role/agent — stage — blocker or immediate next step`
- Include only work backed by a verified running native child or registered external process at reporting time.
- Never infer activity from `In progress`, `In review`, an assignee, a branch, or an open PR alone.
- Write `None` only after attempting to restart eligible orphaned work within available capacity.

**Next**
1. Up to three prioritized PM actions across Ready execution, readiness approval, and backlog planning.

**Your action**
- State the exact issue-specific approval, answer, or decision needed.
- List each `In review` item here with its exact title and the specific acceptance test or decision the owner must perform. `In review` is never orphaned agent work.
- Write `No action needed` only when the owner truly has nothing to decide now. Still include the PM's next action under **Next**.

Use the configured owner display name consistently. Every user-facing issue reference in every section must use `#number — exact GitHub issue title`; fetch the title instead of guessing or showing a number alone. For PRs, include the exact PR title and linked issue title when available.

Refresh and reconcile the whole-project view before writing the brief. Report the state after restart/rerouting actions, not the stale state first observed. Do not merely summarize the event that woke the loop. If the Project API is unavailable, use the last known Project state plus current issues/PRs, mark `Project status` as `Green|Amber|Red (Partial data)`, state what could not be refreshed, and still recommend the next actions. Do not hide a Ready candidate, blocker, idle capacity, or planning decision behind `No action needed`.

## Repository hygiene

- Run a quick hygiene scan on each heartbeat: primary-checkout status, active worktree status, ignored logs/temp files, unexpected untracked generated files, suspicious tracked generated artifacts, and missing `.gitignore` coverage.
- Remove only ignored generated logs or temp files older than the configured threshold after confirming no active process writes them and they have no current diagnostic value.
- Never automatically delete tracked files, unclassified untracked files, active-process output, current diagnostic evidence, or dirty/unmerged worktrees.
- If an artifact is tracked, repeatedly regenerated, or caused by broken tooling, use maintenance recovery to create or update the root-cause issue and open a draft cleanup PR instead of repeatedly deleting symptoms.
- Keep the scan fast and silent when clean; report only material cleanup, risk, or required human judgment.

## Maintenance recovery

- Maintenance recovery is a narrow pre-authorized exception to the Ready gate in `execute-ready` mode.
- Require concrete evidence from Engineer results, validation, CI, deployment, or post-deploy checks. Do not create speculative cleanup work.
- Engineers immediately message the PM when they encounter qualifying recurring friction; they do not wait for final handoff. The PM also reviews completed Engineer results on every heartbeat.
- Deduplicate against existing issues, PRs, and active Engineers. Spawn at most one disposable Engineer for each distinct blocking/P0/P1 root cause and never exceed three active Engineers. Put non-blocking maintenance in `Backlog`.
- Create or update the GitHub issue before implementation, add it to the Project as `In progress`, and record the evidence and affected work.
- The Engineer must fix the root cause rather than preserve the workaround, validate it, and open a draft PR from an isolated worktree.
- No Ready approval is required for qualifying maintenance recovery. Review, merge, deployment, and validated destructive/data-migration work are pre-authorized. Secret changes and paid resources still require explicit human confirmation.

## Ready gate

- Never move an issue to `Ready` without explicit approval from the configured approval owner.
- Treat `Ready` itself as the authoritative approval state; do not duplicate it with approval labels.
- A readiness recommendation is not approval. Silence, prior approval of another issue, or an agent-authored summary never counts.
- When moving an issue to `Ready`, remove `needs-planning` in the same operation.
- `Ready` and `needs-planning` are mutually exclusive. If planning, dependencies, acceptance criteria, or another blocker remains unresolved, keep the issue outside `Ready` and record the blocker.
- If approval is denied or deferred, keep the issue in `Backlog` and record the target phase/revisit condition.
- If an issue is already `Ready` while carrying `needs-planning` or another blocking signal, report the inconsistency and do not execute until it is reconciled.

## Project Manager

Codex is the Project Manager and remains accountable for the run:

1. Reconcile roadmap, issues, project status, PRs, review feedback, and CI.
2. Ensure open issues are represented in the Project backlog and preserve their roadmap phase or deferral context.
3. Select only work satisfying the readiness contract and Ready gate, or the configured evidence-backed maintenance-recovery exception.
4. Move or request movement to `In progress` before implementation.
5. Decide whether the Architect is required.
6. Choose the Engineer using labels and routing policy.
7. Spawn the Engineer as a native child within the three-Engineer limit. On a heartbeat, record it and exit; on a manual orchestration turn, wait only when useful.
8. When an Engineer returns a PR, keep the issue `In progress` and spawn a disposable Release Manager immediately.
9. After automatic review, merge, deployment when applicable, and post-deploy validation complete, move the issue to `In review` and give the owner a concrete acceptance/testing request.
10. If the owner requests changes, return the issue to `In progress` and start a disposable Engineer.
11. Keep available Engineer capacity productive by restarting eligible orphaned `In progress` work instead of merely describing it as stalled.

## Architect

Architects are reusable, read-only native Codex subagents, with at most two active. Invoke one only for architecture, API contracts, authentication, data models, deployment boundaries, or genuinely cross-cutting changes. Ordinary bugs, CI/packaging work, and implementation using established patterns skip the Architect.

## Engineer selection

Labels override automatic routing:

- `engineer:codex`: use Codex.
- `engineer:copilot`: use GitHub Copilot CLI.
- `engineer:either`: Project Manager chooses.
- No label: use automatic routing.

Use Codex for ambiguous, cross-cutting, architecture-sensitive work, security remediation, or recovery after failed delegation. Use Copilot CLI for bounded `Ready` issues with clear acceptance criteria, focused implementation, tests, refactors, or CI fixes. Never assign overlapping scope to multiple engineers.

## Copilot CLI engineer

Prepare an issue-specific task packet with outcome, acceptance criteria, scope, instructions, skills, architecture constraints, validation commands, and handoff requirements.

Use tiered validation: Engineers run targeted tests plus affected-workspace lint/type checks; required CI owns the full suite and build once. Run broad local validation only for authentication, persisted data, deployment, cross-cutting changes, or CI-failure investigation. Browser QA covers changed UI flows only.

The native Codex Engineer launches Copilot CLI autopilot with a continuation limit and remains alive as its supervisor. Prefer repository-approved remote or sandboxed execution; otherwise use an isolated worktree with narrow permissions. Do not grant unrestricted access to the primary checkout.

Require changed files, validation results, unresolved risks, and a transcript or concise run record when available.

## Release Manager

Spawn a disposable native `release_manager` subagent on `gpt-5.6-luna` with medium reasoning for each returned PR. Reviews have no artificial concurrency cap.

1. Review the linked issue, actual diff, acceptance criteria, validation evidence, required checks, review feedback, documentation, deployment plan, and rollback considerations.
2. Return actionable findings to the PM. The PM routes code or documentation fixes to an Engineer; the Release Manager never implements fixes or changes architecture.
3. Trust green required CI for the full suite/build; do not rerun it locally. Re-read the exact current head SHA and confirm acceptance criteria, targeted validation, review findings, conflicts, and branch protection.
4. Mark the PR ready when needed and merge automatically without owner approval. Never bypass required checks or merge a SHA that changed after review.
5. Merge and deploy automatically when applicable; neither requires separate owner approval. Update project state and report the merged/deployed SHA to the PM.
6. For data migrations or destructive data changes, require compatibility evidence, backup/rollback readiness, and the repository validation contract, then proceed without a separate approval. After deployment, validate health and critical smoke paths.
7. If merge, deployment, or validation fails, stop, preserve evidence, and return recovery work to the PM. Do not become the fixing Engineer.

## Safety boundaries

Autopilot may inspect, propose, create an isolated branch or worktree, edit within scope, validate, update approved issue status, open or ready a PR, merge after green Release Manager review, deploy, and perform validated data migrations or destructive data changes.

Require human confirmation only for movement to `Ready`, secret changes, paid resources, or externally consequential actions outside this documented authorization. Deployment and validated destructive/data-migration work are explicitly authorized.

## Completion

Record mode, selected work, native child IDs/names, role routing, architecture decision, Engineer result, Release Manager result, validation/deployment evidence, blockers, residual risk, and exact next project state. Direct messages and registry entries are supporting evidence; native child results are the Codex handoff mechanism. Present user-facing loop results with the actionable project brief, not a task-only completion report.
